import type { VercelRequest, VercelResponse } from "@vercel/node";

// Temporary diagnostic endpoint. DELETE this file once env vars are confirmed
// working — it shouldn't stay in a production deployment.
export default function handler(_req: VercelRequest, res: VercelResponse) {
  const key = process.env.PAYSTACK_SECRET_KEY;
  const fbKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  res.status(200).json({
    hasPaystackSecret: !!key,
    paystackSecretPreview: key ? `${key.slice(0, 7)}...` : null,
    hasFirebaseServiceAccount: !!fbKey,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV ?? "not set (local vercel dev)",
  });
}
