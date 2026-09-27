import { createLocalJWKSet, jwtVerify, type JSONWebKeySet } from "jose";

// Firebase App Check public keys JWKS endpoint
const JWKS_URL = "https://firebaseappcheck.googleapis.com/v1/jwks";

let cachedJWKS: ReturnType<typeof createLocalJWKSet> | null = null;
let cacheExpiresAt = 0;

async function getJWKS(): Promise<ReturnType<typeof createLocalJWKSet>> {
  const now = Date.now();
  if (cachedJWKS && now < cacheExpiresAt) {
    return cachedJWKS;
  }

  console.log("[appCheck] Fetching JWKS...");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000); // 3-second timeout protection

  try {
    const res = await fetch(JWKS_URL, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`Failed to fetch App Check JWKS: ${res.status}`);
    }
    const jwks = (await res.json()) as JSONWebKeySet;
    cachedJWKS = createLocalJWKSet(jwks);
    cacheExpiresAt = now + 60 * 60 * 1000;
    return cachedJWKS;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Verifies a Firebase App Check JWT.
 */
export async function verifyAppCheckToken(token: string, projectNumber: string): Promise<boolean> {
  try {
    const JWKS = await getJWKS();
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://firebaseappcheck.googleapis.com/${projectNumber}`,
      audience: `projects/${projectNumber}`,
    });

    return !!payload;
  } catch (error) {
    console.error("[verifyAppCheckToken] Verification failed:", error);
    return false;
  }
}
