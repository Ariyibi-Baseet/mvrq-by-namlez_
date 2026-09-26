import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminDb } from "./_firebaseAdmin";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res
      .status(405)
      .json({ verified: false, message: "Method not allowed" });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error("Missing PAYSTACK_SECRET_KEY");
    return res.status(500).json({
      verified: false,
      message: "Payment verification is not configured.",
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
      .json({ verified: false, message: "Missing or invalid order details." });
  }

  try {
    // Idempotency: if this reference was already recorded (e.g. the client
    // retried after a network blip), return the existing order instead of
    // verifying and writing again.
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
      return res.status(402).json({
        verified: false,
        message: result.message || "Verification failed.",
      });
    }

    const { status, amount, currency } = result.data;
    const expectedKobo = Math.round(expectedAmountNaira * 100);

    if (status !== "success") {
      return res.status(402).json({
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

    const order = {
      id: reference,
      reference,
      amount: expectedAmountNaira,
      status: "paid" as const,
      customer,
      items,
      createdAt: new Date().toISOString(),
    };

    // .create() fails instead of overwriting if two requests race each other
    await adminDb.collection("orders").doc(reference).create(order);

    return res.status(200).json({ verified: true, order });
  } catch (err) {
    console.error("verify-payment error:", err);
    return res.status(500).json({
      verified: false,
      message: "Something went wrong verifying your payment.",
    });
  }
}
