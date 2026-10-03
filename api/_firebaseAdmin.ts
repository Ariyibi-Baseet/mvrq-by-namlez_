// Server-only. Never import this from src/ — it uses the service account
// secret and must not end up in the browser bundle.
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let db: Firestore | null = null;

/**
 * Lazily initialises Firebase Admin on first use, INSIDE the handler's
 * try/catch (see verify-payment.ts). If this threw at module import time
 * instead, a missing/bad env var would crash the whole serverless function
 * before any response body is sent — the client would see a raw 500 with
 * no JSON, which is what produced the generic "Network error" message.
 * Throwing here instead means the caller can catch it and return a proper
 * JSON error describing exactly what's wrong.
 */
export const getAdminDb = (): Firestore => {
  if (db) return db;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error(
      "Missing FIREBASE_SERVICE_ACCOUNT_KEY. Add it in Vercel → Settings → Environment Variables, " +
        "checked for the Production environment, then redeploy.",
    );
  }

  let serviceAccount: Record<string, unknown>;
  try {
    serviceAccount = JSON.parse(raw);
  } catch {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON. Paste the full contents of the downloaded " +
        "service-account file, unmodified, as the value.",
    );
  }

  const app = getApps().length
    ? getApps()[0]
    : initializeApp({ credential: cert(serviceAccount as any) });
  db = getFirestore(app);
  return db;
};
