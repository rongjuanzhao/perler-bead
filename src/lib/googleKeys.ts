import { createLocalJWKSet, type JSONWebKeySet } from "jose";

// Firebase Auth JWKS endpoint (Google public keys for ID token verification).
const FIREBASE_JWKS_URL =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

// Google OIDC public keys endpoint (Google Accounts public keys)
const GOOGLE_OIDC_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";

const CACHE_TTL = 3600 * 1000; // 1 hour caching

// --- Firebase Fallback Keys ---
const FALLBACK_FIREBASE_JWKS: JSONWebKeySet = {
  "keys": [
    {
      "kid": "20cad86d769fade5b8916d9ce5074c820f067d52",
      "n": "0d8fcK5cTzWsLSGimKWL0n7mIG8qBA4LMN0xmOz5SngU_8hATACGnaWNYUxWRudk5j3CXK5dSBdQ6y2VuHzMXtjR9Hzks_dHW5c2_o1hUTIe2vG07qNXDKR25p5misIVOYRXmIXGhqIDALdZ2kZxPP1EsM2NRjSrOm0VbUz-PjaQqXRgFjj8b3rV9QVG6uq--T8TmAOp5ucrjSO-AHd6fc2yDsQT1fj_5PGLr-morPRUbtkbOMgFqbiUzjXQJwXjoa8Liaw4L5BmPRYm7VhQZqoXP_EGz3Yzw5xIfROXLm9eXPs0zaYJSKNYu82g4GUq26urdgd8-RXPa0Eq4f92TQ",
      "kty": "RSA",
      "e": "AQAB",
      "use": "sig",
      "alg": "RS256"
    },
    {
      "alg": "RS256",
      "use": "sig",
      "kty": "RSA",
      "e": "AQAB",
      "n": "mJygtWeUGCFVLKrg6j1M2Mn8qcSyM9UAQ_2DGvGwQ1kmgwv7pD7VutNx_3y-Eu9iUdDtIK0Ul0p-WsdORJ5dznEkKPSdQb3WpqQdB-NuIAew_iSD3DeKCx7DbPFCF4FHkJVOlCYrzDL3nmT6Hp0SlWszRR9Kq2C4h1MQTUy6t2sF5KSRczO4wsxJwoUBc1Av9WGXSPCdwJUgxqZWwNBU6-I43HQJuss-OieeWrfmSzDt67jxKjkBMsQpbcll5dyctekwOzIlMyDS3W-uoGi6zT3m1b2EmSNIsipgvlc3qAdm1dG0g3Ib_c9Zv7OXXLYAW2dOm5NsAVXc-AK1LhK0zw",
      "kid": "27c45548555561960f491d50639e55657b212abc"
    },
    {
      "n": "22q04PsB_qjo1bTqdpfXmf3UOOP0GFivY8NTX3B8cTM1gVxHL4bpJw20Lrl2a5fJteO1zbKMx3UKShYKQlB5lgIgStDh9QSuLtt5vVCWFFIIdHW1ssm7622F5qRT973-JGxVLLPPkJlOjoqbgawQ7Q0MKJZM8CBwoepwoCv4loMBnlQhrQqG6MHv5L1i1D5_y1neOILobbFPCfoxdO0Xg1vGKqeU0ohdcU7V3IT1OZ45XkznsCEffVCm91WwmjWuRrZh1xJ3Zsy5euHn0EPB68PsUe11SpZsNMszfB1WCb7luDade3i_u8K2azaxfwnEUqm1eS07re9CQQOnKY7wxw",
      "e": "AQAB",
      "alg": "RS256",
      "kty": "RSA",
      "use": "sig",
      "kid": "904b0f91be6eb0867dabbaab587dfc2e33f00a24"
    },
    {
      "alg": "RS256",
      "n": "4o6lOQoZ-McfWfLlklcpqDrd5aD1G9WV9jdKApQuKnibAzUe4IhjRpihcR0p1UWBL_6Y848N9JKNxhuXX_5BNkfSYGKpq0iBAZ6A1_mdoiQX2N1LFrNhKE_xyCM6RFyRoV2sy8Rr-Y047nBOToAQxtRH5XUzxq44CKp4AY69NOBs4mVtEH025_MjxZvKxsQ9G2CoNhj1bFdyu6SRpx5xixouSPSrLXgNNle3Tw0H5mVicdDb6qgSjfeUwybruCkFM97ea7gv0Ktn2oPHMftaozP7vMZ4D0WoPDIy71Q40T5KxuzFg3p23DXa8LVLq54DN0aBYI5MHyeMEC-StgnSAw",
      "e": "AQAB",
      "kid": "6f7de798eee8a24ebade6f228411220c8669010d",
      "use": "sig",
      "kty": "RSA"
    }
  ]
};

// --- Google Play/OIDC Fallback Keys ---
const FALLBACK_GOOGLE_OIDC_JWKS: JSONWebKeySet = {
  "keys": [
    {
      "alg": "RS256",
      "kty": "RSA",
      "e": "AQAB",
      "use": "sig",
      "kid": "b6dd51e66d36010bd3bbdfb3c91a1a5f6ec6c12c",
      "n": "5vwKWwUfpipVmVHwU8MVsjFGh0K1WPNX_YDWNdVkrcMKGcPG_k3_ZCPWQ9bTm38kITVTtAJGZzo2xxFBlHJ5m9Rw2EbYJ-tdwlcodR4gGtBllFSo-hX0U6hgDapnFjky3xEWx8Au4cXVV-uYMUJAR3y4q9PeYV1rdmHTbK0gFUmyd2BPz5NEVVAKkQH8L1gTTYKSDOUD2UzLDw1fx46dv4OELhfMJsObnG_MsBzxwNSQOUCE9Et2ikQ3BypfGFl59N3yx5PKchtpa9Z1c8hYMEuv5cel5bKclXcZyMo4yuj84OjFpRrE8xfwruI7C-9CULcoq2Qy1o2OI-saXPd3Pw"
    },
    {
      "e": "AQAB",
      "use": "sig",
      "kid": "49900291d36cec8c018f2e8af3ef235b8b18d3c9",
      "alg": "RS256",
      "kty": "RSA",
      "n": "yYcQpXE3z8HRR3Vw7n5vQHCK-DM7kyfHd9Q17PZp82g6mBXfwTVzui6dLM4gyDGhOOiU2RCcJurDy2Rk8danIdnEhD4Mai-0SYR0Lr1AVUfVr5yqEnEXJ2kdysNPVBP4b2ZL_Ksen5rpZMnTl9M0Ke5GfbzHyStF-o3x7wV_SMZFbRu912AblpxJuI9f82fhT8PHYhiJotfkiSDsSsoSrsW0qojR_vXFpRU0KQRBm8wR-sZ7SdnSuEgxfz3dHaPydktBHSoCL-sJ-84-SBlxWKDbLwIwA-jqvOzFIgiSjgjSg2TAMi5Ib2UD8RF4bhbGCaapkwUCxSI1M_OTE1J2WQ"
    },
    {
      "use": "sig",
      "kid": "943a3a5d7d919625a454e489b75c29adab57acba",
      "e": "AQAB",
      "alg": "RS256",
      "kty": "RSA",
      "n": "pIpnzA2ezyEERJSxiqpLBmMeIqATH-V6iuBtKIibXEyYovujrx8niqTeO6RIyXT6uDUUv0V2kJ8V_iWYFxzXY1BqK9IfcAmjg0XUDoyTVkoyLsF0gj299LH-zw5vCvy8jmamFIZKAbKcQ5hpHvSittM1vl-6vVL-i2GxyGbMA9aY6Hq15NylS1t7ELTYfQimlnvxcb7_DM0cuS5U1SfbCZMCpKhh0nrSlYds240oxpCJOV2rBahs_Ea5c7tezS1nwVC9W_E-bR9TF6BHkC_fv-E8DcWfkI_6geaJzBhINNxBfjx-w1-WUp2Jz3YYFWEfeQjxMqu-Fg6cGxwk7V16uQ"
    },
    {
      "alg": "RS256",
      "kty": "RSA",
      "n": "4rY5uwZK1dQ-UVgB5s4NLyC-u5LC2MT7b8GWZztiNgMsp0Nnqx0pM7Ofx0ws32N2aZcx10-J8ydQxnNb9uAcf-7LyhyOIcv_WEyzaSbUAMOgoF-nQmJetckxNg6ekhNfaFcTQS0T-29ql2_CBLIML6CvSh-r0fgWRsqN2ayB7wCl74Gv6OOVbvagUWhj5z2L6o_plmsPDwLVuvA7o3WDEDjoq-IXafRQowj92kQUenrOKD4YCopuLIBhel6VH8doFRNZ6KISQhMcOivWaLU_UtKKAMloGJieTf_3r-_nErs2h5wB7T7FrMCScmO7mvFQXKh8_4P-MlbfgS9CUvQksw",
      "e": "AQAB",
      "use": "sig",
      "kid": "f10f87405a979c1df36df26606734f33cd85c271"
    }
  ]
};

// --- In-Memory Caches ---
let cachedFirebaseJWKS: ReturnType<typeof createLocalJWKSet> | null = null;
let firebaseExpiresAt = 0;

let cachedGoogleOidcJWKS: ReturnType<typeof createLocalJWKSet> | null = null;
let googleOidcExpiresAt = 0;

/**
 * Common JWKS fetcher helper with caching, timeout, and fallback.
 */
async function fetchAndCacheJWKS(
  url: string,
  fallback: JSONWebKeySet,
  logPrefix: string
): Promise<JSONWebKeySet> {
  console.log(`${logPrefix} Fetching JWKS from Google...`);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`Failed to fetch JWKS: ${res.status}`);
    }
    const data = (await res.json()) as JSONWebKeySet;
    console.log(`${logPrefix} JWKS successfully loaded from Google`);
    return data;
  } catch (error: any) {
    console.warn(`${logPrefix} Network fetch of JWKS failed. Falling back to static JWKS cache.`, {
      name: error?.name,
      message: error?.message,
    });
    return fallback;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Get the Firebase Auth JWKS store.
 */
export async function getFirebaseJWKS(): Promise<ReturnType<typeof createLocalJWKSet>> {
  const now = Date.now();
  if (cachedFirebaseJWKS && now < firebaseExpiresAt) {
    return cachedFirebaseJWKS;
  }

  const jwks = await fetchAndCacheJWKS(FIREBASE_JWKS_URL, FALLBACK_FIREBASE_JWKS, "[firebaseAuth]");
  cachedFirebaseJWKS = createLocalJWKSet(jwks);
  
  if (jwks !== FALLBACK_FIREBASE_JWKS) {
    firebaseExpiresAt = now + CACHE_TTL;
  } else {
    firebaseExpiresAt = 0; // retry next time if fallback was used
  }
  
  return cachedFirebaseJWKS;
}

/**
 * Get the Google Accounts OIDC JWKS store.
 */
export async function getGoogleOidcJWKS(): Promise<ReturnType<typeof createLocalJWKSet>> {
  const now = Date.now();
  if (cachedGoogleOidcJWKS && now < googleOidcExpiresAt) {
    return cachedGoogleOidcJWKS;
  }

  const jwks = await fetchAndCacheJWKS(GOOGLE_OIDC_JWKS_URL, FALLBACK_GOOGLE_OIDC_JWKS, "[googleOidc]");
  cachedGoogleOidcJWKS = createLocalJWKSet(jwks);

  if (jwks !== FALLBACK_GOOGLE_OIDC_JWKS) {
    googleOidcExpiresAt = now + CACHE_TTL;
  } else {
    googleOidcExpiresAt = 0; // retry next time if fallback was used
  }

  return cachedGoogleOidcJWKS;
}
