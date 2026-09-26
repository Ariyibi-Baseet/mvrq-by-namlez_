// Thin wrapper around Paystack's Inline JS (https://js.paystack.co/v1/inline.js).
// The script exposes a global `PaystackPop` once loaded; we only load it once
// and reuse it for every checkout.

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: PaystackSetupOptions) => { openIframe: () => void };
    };
  }
}

interface PaystackSetupOptions {
  key: string;
  email: string;
  amount: number; // kobo (NGN * 100)
  currency?: string;
  ref?: string;
  metadata?: Record<string, unknown>;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
}

let scriptPromise: Promise<void> | null = null;

const loadPaystackScript = (): Promise<void> => {
  if (window.PaystackPop) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null; // allow retrying on a later attempt
      reject(
        new Error(
          "Could not load Paystack. Check your connection and try again.",
        ),
      );
    };
    document.body.appendChild(script);
  });

  return scriptPromise;
};

export interface PayWithPaystackArgs {
  email: string;
  amountNaira: number;
  reference: string;
  metadata?: Record<string, unknown>;
}

/**
 * Opens the Paystack popup. Resolves with the transaction reference once the
 * customer completes payment in the popup, or rejects if they close it first
 * or the script fails to load.
 *
 * IMPORTANT: this only means the popup reported success — it does NOT mean
 * the charge is verified. Always confirm with the /api/verify-payment
 * endpoint before treating the order as paid.
 */
export const payWithPaystack = async ({
  email,
  amountNaira,
  reference,
  metadata,
}: PayWithPaystackArgs): Promise<string> => {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error(
      "Payments are not configured yet. Missing VITE_PAYSTACK_PUBLIC_KEY.",
    );
  }

  await loadPaystackScript();

  return new Promise((resolve, reject) => {
    const handler = window.PaystackPop!.setup({
      key: publicKey,
      email,
      amount: Math.round(amountNaira * 100), // Paystack expects kobo
      currency: "NGN",
      ref: reference,
      metadata,
      callback: (response) => resolve(response.reference),
      onClose: () => reject(new Error("cancelled")),
    });
    handler.openIframe();
  });
};

/** A reference unique enough for one checkout session. */
export const generateReference = () =>
  `mvrq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
