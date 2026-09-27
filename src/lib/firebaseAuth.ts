import { jwtVerify } from "jose";
import { getFirebaseJWKS } from "./googleKeys";

const FIREBASE_PROJECT_ID = "quickshare-3991d";

export interface FirebaseAuthPayload {
  /** Firebase UID — use this as user_id */
  sub: string;
  email?: string;
  name?: string;
}

/**
 * Verify a Firebase ID token and return the decoded payload.
 * Checks signature, expiry, issuer, and audience.
 *
 * @param token Raw JWT string (without "Bearer " prefix)
 * @returns Decoded payload, or null if invalid
 */
export async function verifyFirebaseIdToken(
  token: string
): Promise<FirebaseAuthPayload | null> {
  try {
    console.log("[firebaseAuth] Verifying ID token...");
    const JWKS = await getFirebaseJWKS();
    console.log("[firebaseAuth] JWKS ready, running jwtVerify...");
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
    });
    console.log("[firebaseAuth] JWT verified, sub:", payload.sub);

    if (!payload.sub) {
      console.warn("[firebaseAuth] Token missing sub claim");
      return null;
    }

    return {
      sub: payload.sub,
      email: payload["email"] as string | undefined,
      name: payload["name"] as string | undefined,
    };
  } catch (error: any) {
    console.error("[verifyFirebaseIdToken] Verification failed detail:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });
    return null;
  }
}

/**
 * Extract and verify Firebase ID token from the Authorization header.
 * Expects: "Authorization: Bearer <token>"
 *
 * @returns Decoded payload or null if missing/invalid
 */
export async function verifyAuthHeader(
  authHeader: string | null
): Promise<FirebaseAuthPayload | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.slice(7); // Remove "Bearer "
  return verifyFirebaseIdToken(token);
}
