// Server-only. Never import this from src/ — it uses the service account
// secret and must not end up in the browser bundle.
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!raw) {
  throw new Error(
    "Missing FIREBASE_SERVICE_ACCOUNT_KEY. Add it as a server-side environment variable (no VITE_ prefix).",
  );
}

let serviceAccount: Record<string, unknown>;
try {
  serviceAccount = JSON.parse(raw);
} catch {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON. Paste the whole service-account file contents.",
  );
}

// Serverless functions can be reused between invocations; guard against re-initializing.
const app = getApps().length
  ? getApps()[0]
  : initializeApp({ credential: cert(serviceAccount as any) });

export const adminDb = getFirestore(app);
