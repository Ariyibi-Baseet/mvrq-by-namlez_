import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminDb } from "./_firebaseAdmin.js";

interface OrderItemInput {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

interface VerifyBody {
  reference: string;
  expectedAmountNaira: number;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
  };
  items: OrderItemInput[];
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    status: string; // 'success' | 'failed' | 'abandoned' ...
    amount: number; // kobo
    currency: string;
    reference: string;
  };
}

interface StockIssue {
  productId: string;
  name: string;
  requested: number;
  available: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res
      .status(405)
      .json({ verified: false, message: "Method not allowed" });
  }

  // Everything below — including Firebase Admin initialisation — now runs
  // inside this try/catch, so any failure (bad env var, bad JSON, Paystack
  // being unreachable, etc) returns a real JSON error instead of crashing
  // the function before a response body exists.
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      console.error("Missing PAYSTACK_SECRET_KEY");
      return res.status(500).json({
        verified: false,
        message:
          "Payment verification is not configured (missing Paystack secret key).",
      });
    }

    const body = req.body as Partial<VerifyBody>;
    const { reference, expectedAmountNaira, customer, items } = body;

    if (
      !reference ||
      typeof expectedAmountNaira !== "number" ||
      !customer?.email ||
      !customer?.fullName ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res
        .status(400)
        .json({
          verified: false,
          message: "Missing or invalid order details.",
        });
    }

    const adminDb = getAdminDb(); // <- throws a readable error if misconfigured; caught below

    // Fast-path idempotency check: if this reference was already recorded
    // (e.g. the client retried after a network blip), skip straight to
    // returning it rather than calling Paystack and running the stock
    // transaction again. The transaction below re-checks this too, closing
    // the race between this read and the eventual write.
    const existing = await adminDb.collection("orders").doc(reference).get();
    if (existing.exists) {
      return res.status(200).json({ verified: true, order: existing.data() });
    }

    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secretKey}` },
      },
    );
    const result = (await paystackRes.json()) as PaystackVerifyResponse;

    if (!paystackRes.ok || !result.status || !result.data) {
      return res
        .status(402)
        .json({
          verified: false,
          message: result.message || "Verification failed.",
        });
    }

    const { status, amount, currency } = result.data;
    const expectedKobo = Math.round(expectedAmountNaira * 100);

    if (status !== "success") {
      return res
        .status(402)
        .json({
          verified: false,
          message: `Payment was not successful (${status}).`,
        });
    }
    if (currency !== "NGN") {
      return res
        .status(402)
        .json({ verified: false, message: "Unexpected currency." });
    }
    // Guards against a tampered client sending a lower amount to Paystack
    // than the cart total shown to the customer.
    if (amount !== expectedKobo) {
      console.error("Amount mismatch", {
        reference,
        expectedKobo,
        got: amount,
      });
      return res
        .status(402)
        .json({ verified: false, message: "Amount does not match the order." });
    }

    // At this point Paystack has genuinely captured the money. Everything
    // from here records the order and decrements stock ATOMICALLY in one
    // Firestore transaction, so if two customers pay for the last unit
    // within moments of each other, only one can actually take the
    // product's stockQuantity to zero — the product flips to "Sold Out" for
    // everyone else immediately via the storefront's live listener.
    //
    // The other customer's card is still charged (Paystack already
    // captured it before this code runs), so their order is still recorded
    // but flagged in `stockIssues` for you to review and refund manually —
    // this endpoint can't prevent that edge case, only surface it.
    const orderRef = adminDb.collection("orders").doc(reference);
    const stockIssues: StockIssue[] = [];

    await adminDb.runTransaction(async (tx) => {
      // Re-check idempotency inside the transaction.
      const orderSnap = await tx.get(orderRef);
      if (orderSnap.exists) return;

      const productRefs = items.map((item) =>
        adminDb.collection("products").doc(item.productId),
      );
      // Firestore transactions require ALL reads before ANY writes.
      const productSnaps = await Promise.all(
        productRefs.map((ref) => tx.get(ref)),
      );

      productSnaps.forEach((snap, idx) => {
        const item = items[idx];
        if (!snap.exists) return; // product was deleted since the order was placed

        const data = snap.data() as { stockQuantity?: unknown };
        // Products created before this feature existed have no
        // stockQuantity field — treat them as unlimited stock rather than
        // blocking the sale.
        if (typeof data.stockQuantity !== "number") return;

        const remaining = data.stockQuantity - item.quantity;
        if (remaining < 0) {
          stockIssues.push({
            productId: item.productId,
            name: item.name,
            requested: item.quantity,
            available: data.stockQuantity,
          });
        }

        const newQuantity = Math.max(remaining, 0);
        tx.update(productRefs[idx], {
          stockQuantity: newQuantity,
          inStock: newQuantity > 0,
        });
      });

      tx.create(orderRef, {
        id: reference,
        reference,
        amount: expectedAmountNaira,
        status: "paid" as const,
        customer,
        items,
        stockIssues,
        createdAt: new Date().toISOString(),
      });
    });

    if (stockIssues.length > 0) {
      console.error(
        "Order completed with stock shortfall — review for refund:",
        { reference, stockIssues },
      );
    }

    const finalSnap = await orderRef.get();
    return res.status(200).json({ verified: true, order: finalSnap.data() });
  } catch (err) {
    // This now catches Firebase Admin init failures too, so the client gets
    // a real message instead of a raw 500 it can't parse as JSON.
    const message =
      err instanceof Error
        ? err.message
        : "Something went wrong verifying your payment.";
    console.error("verify-payment error:", err);
    return res.status(500).json({ verified: false, message });
  }
}
