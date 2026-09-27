/**
 * Subscription and tier management utilities (server-side).
 *
 * Tier determination strategy (transition period):
 * 1. If user exists in `users` table → use `users.tier` (authoritative)
 * 2. If `purchase_token` is provided → legacy trust model (backward compat)
 * 3. Otherwise → "free"
 */

import type { Tier } from "./upload";
import { compactVerify, importX509 } from "jose";

// --- Tier determination ---

/**
 * Determine user tier by looking up the `users` table.
 * Returns null if the user record does not exist (means not synced yet).
 */
export async function getTierFromDB(
  db: D1Database,
  firebaseUid: string,
): Promise<Tier | null> {
  const row = await db
    .prepare("SELECT tier FROM users WHERE firebase_uid = ?")
    .bind(firebaseUid)
    .first<{ tier: string }>();

  if (!row) return null;
  return row.tier === "pro" ? "pro" : "free";
}

/**
 * Determine tier with fallback for transition period.
 * Priority: DB lookup > legacy purchase_token trust model > free
 */
export async function resolveTier(
  db: D1Database,
  firebaseUid: string,
  purchaseToken?: string,
): Promise<Tier> {
  // 1. Check DB first. A stored pro tier is authoritative.
  const dbTier = await getTierFromDB(db, firebaseUid);
  if (dbTier === "pro") {
    // A scheduled cancellation can reach its period end between daily cron
    // runs. Enforce this particular expiry on every Pro quota check without
    // invalidating legacy Pro users that do not have subscription rows.
    const expiredScheduledCancellation = await db
      .prepare(
        `SELECT 1 AS found
         FROM subscriptions
         WHERE firebase_uid = ?
           AND status = 'scheduled_cancel'
           AND current_period_end IS NOT NULL
           AND datetime(current_period_end) <= datetime('now')
         LIMIT 1`,
      )
      .bind(firebaseUid)
      .first<{ found: number }>();

    if (expiredScheduledCancellation && !(await hasActiveSubscription(db, firebaseUid))) {
      await updateUserTier(db, firebaseUid, "free");
      return "free";
    }

    return "pro";
  }

  // 2. If a store token is supplied, try to resolve it against verified
  // subscription records. This lets iOS purchases made before sign-in bind to
  // the Firebase user on the first authenticated quota/upload request.
  if (purchaseToken) {
    const verifiedTier = await resolveTierFromVerifiedPurchaseToken(
      db,
      firebaseUid,
      purchaseToken,
    );
    if (verifiedTier === "pro") return "pro";

    // StoreKit delivers the signed transaction as the token. Do not downgrade
    // a purchaser just because the asynchronous App Store verification/webhook
    // has not completed yet.
    return "pro";
  }

  // 3. Existing free user or default
  return dbTier ?? "free";
}

async function resolveTierFromVerifiedPurchaseToken(
  db: D1Database,
  firebaseUid: string,
  purchaseToken: string,
): Promise<Tier | null> {
  try {
    const appStoreOriginalTransactionId =
      decodeJwtPayload<AppStoreTransactionPayload>(purchaseToken)
        ?.originalTransactionId ??
      decodeJwtPayload<AppStoreTransactionPayload>(purchaseToken)
        ?.transactionId ??
      purchaseToken;

    const existing = await db
      .prepare(
        `SELECT firebase_uid, provider, status, current_period_end
         FROM subscriptions
         WHERE (provider = 'google_play' AND provider_subscription_id = ?)
            OR (provider = 'app_store' AND provider_subscription_id = ?)`,
      )
      .bind(purchaseToken, appStoreOriginalTransactionId)
      .first<{
        firebase_uid: string;
        provider: string;
        status: string;
        current_period_end: string | null;
      }>();

    if (!existing) return null;
    if (
      existing.firebase_uid !== firebaseUid &&
      existing.firebase_uid !== "pending_attribution"
    ) {
      return null;
    }

    const active =
      ((existing.status === "active" || existing.status === "trialing") &&
        (!existing.current_period_end ||
          new Date(existing.current_period_end).getTime() >
            Date.now() - 2 * 24 * 60 * 60 * 1000)) ||
      (existing.status === "scheduled_cancel" &&
        (!existing.current_period_end ||
          new Date(existing.current_period_end).getTime() > Date.now()));

    if (!active) return null;

    if (existing.firebase_uid === "pending_attribution") {
      const now = new Date().toISOString();
      await db
        .prepare(
          `UPDATE subscriptions SET firebase_uid = ?, updated_at = ?
           WHERE provider = ? AND provider_subscription_id = ?`,
        )
        .bind(
          firebaseUid,
          now,
          existing.provider,
          existing.provider === "app_store"
            ? appStoreOriginalTransactionId
            : purchaseToken,
        )
        .run();
    }

    await updateUserTier(db, firebaseUid, "pro");
    return "pro";
  } catch (err) {
    console.error("[resolveTier] Verified token binding failed:", err);
    return null;
  }
}

// --- User sync ---

/**
 * Upsert a user record from Firebase Auth data.
 * Only updates tier if there are no active subscriptions (preserve existing pro status).
 */
export async function upsertUser(
  db: D1Database,
  firebaseUid: string,
  email: string | undefined,
  displayName: string | undefined,
): Promise<Tier> {
  const now = new Date().toISOString();

  const existing = await db
    .prepare("SELECT tier FROM users WHERE firebase_uid = ?")
    .bind(firebaseUid)
    .first<{ tier: string }>();

  if (existing) {
    // Update email/name only when supplied, and preserve tier (managed by subscription logic).
    // Webhooks often know the Firebase UID but not the Firebase profile fields.
    await db
      .prepare(
        `UPDATE users
         SET email = COALESCE(?, email),
             display_name = COALESCE(?, display_name),
             updated_at = ?
         WHERE firebase_uid = ?`,
      )
      .bind(email ?? null, displayName ?? null, now, firebaseUid)
      .run();
    return existing.tier === "pro" ? "pro" : "free";
  }

  // New user, default to free
  await db
    .prepare(
      "INSERT INTO users (firebase_uid, email, display_name, tier, created_at) VALUES (?, ?, ?, 'free', ?)",
    )
    .bind(firebaseUid, email ?? null, displayName ?? null, now)
    .run();

  return "free";
}

/**
 * Update user tier. Should only be called after verifying subscription status.
 */
export async function updateUserTier(
  db: D1Database,
  firebaseUid: string,
  tier: Tier,
): Promise<void> {
  const now = new Date().toISOString();
  await db
    .prepare("UPDATE users SET tier = ?, updated_at = ? WHERE firebase_uid = ?")
    .bind(tier, now, firebaseUid)
    .run();
}

// --- Subscription helpers ---

export interface SubscriptionRecord {
  id: string;
  firebase_uid: string;
  provider: string;
  provider_customer_id: string | null;
  provider_subscription_id: string | null;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  raw_payload: string | null;
  canceled_at: string | null;
  created_at: string;
  updated_at: string | null;
}

/**
 * Check if a user has any active subscription across all providers.
 * Handles canceled-but-not-expired subscriptions (scheduled_cancel) and allows a 2-day grace period
 * for active/trialing subscriptions to account for webhook processing times.
 */
export async function hasActiveSubscription(
  db: D1Database,
  firebaseUid: string,
): Promise<boolean> {
  const row = await db
    .prepare(
      `SELECT COUNT(*) as count FROM subscriptions
       WHERE firebase_uid = ?
         AND (
           (status IN ('active', 'trialing') AND (current_period_end IS NULL OR datetime(current_period_end) > datetime('now', '-2 days')))
           OR
           (status = 'scheduled_cancel' AND (current_period_end IS NULL OR datetime(current_period_end) > datetime('now')))
         )`,
    )
    .bind(firebaseUid)
    .first<{ count: number }>();

  return (row?.count ?? 0) > 0;
}

/**
 * Upsert a subscription record.
 */
export async function upsertSubscription(
  db: D1Database,
  record: Omit<SubscriptionRecord, "created_at" | "updated_at">,
): Promise<void> {
  const now = new Date().toISOString();

  // Check for existing by provider + provider_subscription_id
  const existing = await db
    .prepare(
      `SELECT id FROM subscriptions WHERE provider = ? AND provider_subscription_id = ?`,
    )
    .bind(record.provider, record.provider_subscription_id)
    .first<{ id: string }>();

  if (existing) {
    await db
      .prepare(
        `UPDATE subscriptions SET
          firebase_uid = ?, provider_customer_id = ?, status = ?, current_period_start = ?, current_period_end = ?,
          raw_payload = ?, canceled_at = ?, updated_at = ?
         WHERE id = ?`,
      )
      .bind(
        record.firebase_uid,
        record.provider_customer_id,
        record.status,
        record.current_period_start,
        record.current_period_end,
        record.raw_payload,
        record.canceled_at,
        now,
        existing.id,
      )
      .run();
  } else {
    await db
      .prepare(
        `INSERT INTO subscriptions
          (id, firebase_uid, provider, provider_customer_id, provider_subscription_id,
           status, current_period_start, current_period_end, raw_payload, canceled_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        record.id,
        record.firebase_uid,
        record.provider,
        record.provider_customer_id,
        record.provider_subscription_id,
        record.status,
        record.current_period_start,
        record.current_period_end,
        record.raw_payload,
        record.canceled_at,
        now,
      )
      .run();
  }
}

// --- App Store account attribution ---

export async function appStoreAccountTokenForFirebaseUid(
  firebaseUid: string,
): Promise<string> {
  const data = new TextEncoder().encode(firebaseUid);
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", data));
  const bytes = Array.from(digest.slice(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = bytes.map((byte) => byte.toString(16).padStart(2, "0"));
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
}

export async function upsertAppStoreAccountLink(
  db: D1Database,
  appAccountToken: string,
  firebaseUid: string,
): Promise<void> {
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO app_store_account_links (app_account_token, firebase_uid, created_at, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(app_account_token) DO UPDATE SET
         firebase_uid = excluded.firebase_uid,
         updated_at = excluded.updated_at`,
    )
    .bind(appAccountToken, firebaseUid, now, now)
    .run();
}

export async function getFirebaseUidByAppStoreAccountToken(
  db: D1Database,
  appAccountToken: string,
): Promise<string | null> {
  const row = await db
    .prepare(
      "SELECT firebase_uid FROM app_store_account_links WHERE app_account_token = ?",
    )
    .bind(appAccountToken)
    .first<{ firebase_uid: string }>();

  return row?.firebase_uid ?? null;
}

// --- Google Play Developer API ---

/**
 * Generate a signed JWT for Google Service Account authentication.
 * Uses Web Crypto API (compatible with Cloudflare Workers).
 */
async function createServiceAccountJWT(
  serviceAccountEmail: string,
  privateKeyPem: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const expiry = now + 3600; // 1 hour

  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: serviceAccountEmail,
    scope: "https://www.googleapis.com/auth/androidpublisher",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: expiry,
  };

  // Parse PEM private key
  const privateKey = await parseRSAPrivateKey(privateKeyPem);

  const headerB64 = base64urlEncode(JSON.stringify(header));
  const payloadB64 = base64urlEncode(JSON.stringify(payload));
  const signInput = `${headerB64}.${payloadB64}`;

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    new TextEncoder().encode(signInput),
  );

  const signatureB64 = base64urlEncodeBuffer(signature);
  return `${signInput}.${signatureB64}`;
}

/**
 * Parse a PEM-encoded RSA private key into a CryptoKey.
 */
async function parseRSAPrivateKey(pem: string): Promise<CryptoKey> {
  // Remove PEM headers and decode base64
  const pemBody = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");

  const binaryStr = atob(pemBody);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }

  return crypto.subtle.importKey(
    "pkcs8",
    bytes.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

function base64urlEncode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlEncodeBuffer(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Cache the OAuth2 access token in memory
let cachedAccessToken: string | null = null;
let accessTokenExpiresAt = 0;

/**
 * Get an OAuth2 access token using Google Service Account.
 * Cached for 50 minutes (tokens are valid for 1 hour).
 */
async function getGoogleAccessToken(
  serviceAccountEmail: string,
  privateKey: string,
): Promise<string> {
  const now = Date.now();
  if (cachedAccessToken && now < accessTokenExpiresAt) {
    return cachedAccessToken;
  }

  const jwt = await createServiceAccountJWT(serviceAccountEmail, privateKey);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Google OAuth2 token error: ${res.status} ${text}`);
    }

    const data = (await res.json()) as {
      access_token: string;
      expires_in: number;
    };
    cachedAccessToken = data.access_token;
    accessTokenExpiresAt = now + (data.expires_in - 120) * 1000; // 2 min buffer

    return cachedAccessToken;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Verify a Google Play subscription purchase by calling the
 * Android Publisher API (purchases.subscriptionsv2.get).
 */
export async function verifyGooglePlaySubscription(options: {
  packageName: string;
  purchaseToken: string;
  serviceAccountEmail: string;
  privateKey: string;
  isLocalDev?: boolean;
}): Promise<{
  valid: boolean;
  status: string;
  expiryTime: string | null;
  rawResponse: unknown;
}> {
  const {
    packageName,
    purchaseToken,
    serviceAccountEmail,
    privateKey,
    isLocalDev,
  } = options;

  try {
    const accessToken = await getGoogleAccessToken(
      serviceAccountEmail,
      privateKey,
    );

    const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/subscriptionsv2/tokens/${purchaseToken}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("[googlePlay] API error:", res.status, text);
        if (isLocalDev) {
          console.warn(
            "[googlePlay] API error in local dev. Falling back to mock active subscription.",
          );
          return getMockSubscriptionResponse();
        }
        throw new Error(`Google Play API error: ${res.status} ${text}`);
      }

      const data = (await res.json()) as {
        subscriptionState?: string;
        lineItems?: Array<{ expiryTime?: string }>;
        [key: string]: unknown;
      };

      // Active states per Google Play documentation
      const activeStates = [
        "ACTIVE",
        "PAUSED",
        "IN_GRACE_PERIOD",
        "SUBSCRIPTION_STATE_ACTIVE",
        "SUBSCRIPTION_STATE_PAUSED",
        "SUBSCRIPTION_STATE_IN_GRACE_PERIOD",
      ];
      const state = data.subscriptionState ?? "UNKNOWN";
      const valid = activeStates.includes(state);

      // Get the earliest expiry time from line items
      const expiryTime = data.lineItems?.[0]?.expiryTime ?? null;

      return { valid, status: state, expiryTime, rawResponse: data };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error("[googlePlay] Verification process failed:", error);
    if (isLocalDev) {
      console.warn(
        "[googlePlay] Verification failed or timed out in local dev. Falling back to mock active subscription.",
      );
      return getMockSubscriptionResponse();
    }
    throw error;
  }
}

// --- App Store Server API ---

export async function verifyAppStoreSubscription(options: {
  signedTransactionInfo: string;
  productId?: string;
  bundleId?: string;
  issuerId?: string;
  keyId?: string;
  privateKey?: string;
  isLocalDev?: boolean;
}): Promise<{
  valid: boolean;
  status: string;
  expiryTime: string | null;
  originalTransactionId: string | null;
  rawResponse: unknown;
}> {
  const {
    signedTransactionInfo,
    productId,
    bundleId,
    isLocalDev,
  } = options;

  if (isLocalDev) {
    const decoded = decodeJwtPayload<AppStoreTransactionPayload>(
      signedTransactionInfo,
    );
    const futureExpiry = new Date();
    futureExpiry.setFullYear(futureExpiry.getFullYear() + 1);
    return {
      valid: true,
      status: "ACTIVE",
      expiryTime: decoded?.expiresDate
        ? new Date(Number(decoded.expiresDate)).toISOString()
        : futureExpiry.toISOString(),
      originalTransactionId:
        decoded?.originalTransactionId ?? decoded?.transactionId ?? null,
      rawResponse: {
        mock: true,
        decoded,
        note: "Generated locally because App Store Server API is not configured",
      },
    };
  }

  if (!bundleId) {
    throw new Error("App Store verification is not configured");
  }

  const decoded = await verifyAndDecodeAppStoreJws<AppStoreTransactionPayload>(
    signedTransactionInfo,
  );
  if (!decoded) {
    throw new Error("Invalid App Store transaction payload");
  }
  if (decoded.bundleId !== bundleId) {
    throw new Error("App Store bundle id mismatch");
  }
  if (productId && decoded.productId !== productId) {
    throw new Error("App Store product id mismatch");
  }

  const expiryTime = appStoreMillisToIso(decoded.expiresDate);
  const isActive = !expiryTime || new Date(expiryTime).getTime() > Date.now();

  return {
    valid: isActive,
    status: isActive ? "ACTIVE" : "EXPIRED",
    expiryTime,
    originalTransactionId:
      decoded.originalTransactionId ?? decoded.transactionId ?? null,
    rawResponse: decoded,
  };
}

interface AppStoreTransactionPayload {
  transactionId?: string;
  originalTransactionId?: string;
  bundleId?: string;
  productId?: string;
  expiresDate?: number | string;
  purchaseDate?: number | string;
  appAccountToken?: string;
  environment?: string;
  type?: string;
}

interface AppStoreRenewalInfoPayload {
  originalTransactionId?: string;
  autoRenewStatus?: number;
  productId?: string;
  autoRenewProductId?: string;
  expirationIntent?: number;
  gracePeriodExpiresDate?: number | string;
  isInBillingRetryPeriod?: boolean;
}

export interface AppStoreNotificationPayload {
  notificationType?: string;
  subtype?: string;
  notificationUUID?: string;
  version?: string;
  signedDate?: number | string;
  data?: {
    appAppleId?: number;
    bundleId?: string;
    bundleVersion?: string;
    environment?: string;
    signedTransactionInfo?: string;
    signedRenewalInfo?: string;
    status?: number;
  };
}

export interface DecodedAppStoreNotification {
  notification: AppStoreNotificationPayload;
  transaction: AppStoreTransactionPayload | null;
  renewalInfo: AppStoreRenewalInfoPayload | null;
}

export async function decodeAppStoreNotification(
  signedPayload: string,
  options: {
    bundleId?: string;
    verifySignature?: boolean;
  } = {},
): Promise<DecodedAppStoreNotification> {
  const notification = await decodeAppStoreJwsWithContext<AppStoreNotificationPayload>(
    signedPayload,
    "notification",
    options.verifySignature,
  );
  if (!notification) {
    throw new Error("Invalid App Store notification payload");
  }

  const signedTransactionInfo = notification.data?.signedTransactionInfo;
  const signedRenewalInfo = notification.data?.signedRenewalInfo;
  const transaction = signedTransactionInfo
    ? await decodeAppStoreJwsWithContext<AppStoreTransactionPayload>(
        signedTransactionInfo,
        "transaction",
        options.verifySignature,
      )
    : null;
  const renewalInfo = signedRenewalInfo
    ? await decodeAppStoreJwsWithContext<AppStoreRenewalInfoPayload>(
        signedRenewalInfo,
        "renewalInfo",
        options.verifySignature,
      )
    : null;

  const actualBundleId = transaction?.bundleId ?? notification.data?.bundleId;
  if (
    options.bundleId &&
    actualBundleId &&
    actualBundleId !== options.bundleId
  ) {
    throw new Error("App Store notification bundle id mismatch");
  }

  return { notification, transaction, renewalInfo };
}

async function decodeAppStoreJwsWithContext<T>(
  jws: string,
  context: string,
  verifySignature?: boolean,
): Promise<T | null> {
  try {
    return verifySignature === false
      ? decodeJwtPayload<T>(jws)
      : await verifyAndDecodeAppStoreJws<T>(jws);
  } catch (err) {
    const detail = describeAppStoreJws(jws);
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `App Store ${context} JWS verification failed: ${message}; ${detail}`,
      { cause: err },
    );
  }
}

export function appStoreMillisToIso(
  value?: number | string | null,
): string | null {
  if (value == null) return null;
  const millis = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(millis)) return null;
  return new Date(millis).toISOString();
}

export function decodeJwtPayload<T>(jws: string): T | null {
  const parts = jws.split(".");
  if (parts.length < 2) return null;
  try {
    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    return JSON.parse(atob(padded)) as T;
  } catch {
    return null;
  }
}

async function verifyAndDecodeAppStoreJws<T>(jws: string): Promise<T | null> {
  const parts = jws.split(".");
  if (parts.length !== 3) return null;

  const header = decodeJwtPayloadPart<{ alg?: string; x5c?: string[] }>(
    parts[0],
  );
  if (!header) {
    throw new Error("App Store JWS invalid header");
  }
  const certificates = header?.x5c ?? [];
  if (certificates.length === 0) {
    throw new Error("App Store JWS missing x5c certificate");
  }
  if (header.alg && header.alg !== "ES256") {
    throw new Error(`Unsupported App Store JWS algorithm: ${header.alg}`);
  }

  const failures: string[] = [];
  for (let index = 0; index < certificates.length; index += 1) {
    const certificate = certificates[index];
    try {
      const payload = await verifyAppStoreJwsWithCertificate(jws, certificate);
      if (index !== 0) {
        console.warn("[app-store-jws] Verified with non-leaf x5c certificate", {
          certificateIndex: index,
          x5cCount: certificates.length,
        });
      }
      return JSON.parse(new TextDecoder().decode(payload)) as T;
    } catch (err) {
      failures.push(
        `x5c[${index}]: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  throw new Error(
    `App Store JWS signature verification failed for all x5c certificates: ${failures.join("; ")}`,
  );
}

async function verifyAppStoreJwsWithCertificate(
  jws: string,
  certificate: string,
): Promise<Uint8Array> {
  try {
    const publicKey = await publicKeyFromX5cCertificate(certificate);
    const [encodedHeader, encodedPayload, encodedSignature] = jws.split(".");
    const signingInput = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`);
    const signature = base64UrlToBytes(encodedSignature);
    const verified = await crypto.subtle.verify(
      { name: "ECDSA", hash: "SHA-256" },
      publicKey,
      toArrayBuffer(signature),
      toArrayBuffer(signingInput),
    );
    if (!verified) {
      throw new Error("signature verification failed");
    }
    return base64UrlToBytes(encodedPayload);
  } catch (err) {
    try {
      const publicKey = await importX509(
        `-----BEGIN CERTIFICATE-----\n${certificate}\n-----END CERTIFICATE-----`,
        "ES256",
      );
      const { payload } = await compactVerify(jws, publicKey);
      return payload;
    } catch {
      throw err;
    }
  }
}

function decodeJwtPayloadPart<T>(part: string): T | null {
  try {
    const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    return JSON.parse(atob(padded)) as T;
  } catch {
    return null;
  }
}

export function describeAppStoreJws(jws: string): string {
  const parts = jws.split(".");
  const header = parts.length >= 1
    ? decodeJwtPayloadPart<{ alg?: string; kid?: string; x5c?: string[] }>(parts[0])
    : null;
  const payload = parts.length >= 2
    ? decodeJwtPayload<Record<string, unknown>>(jws)
    : null;

  return JSON.stringify({
    parts: parts.length,
    partLengths: parts.map((part) => part.length),
    headerPrefix: parts[0]?.slice(0, 16),
    payloadPrefix: parts[1]?.slice(0, 16),
    signaturePrefix: parts[2]?.slice(0, 16),
    header: header
      ? {
          alg: header.alg,
          kid: header.kid,
          x5cCount: header.x5c?.length ?? 0,
          leafCertPrefix: header.x5c?.[0]?.slice(0, 24),
        }
      : null,
    payload: payload
      ? {
          notificationType: payload.notificationType,
          bundleId:
            payload.bundleId ??
            (payload.data as { bundleId?: string } | undefined)?.bundleId,
          productId: payload.productId,
          environment:
            payload.environment ??
            (payload.data as { environment?: string } | undefined)?.environment,
          transactionId: payload.transactionId,
          originalTransactionId: payload.originalTransactionId,
        }
      : null,
  });
}

function base64UrlToBytes(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function publicKeyFromX5cCertificate(certificate: string): Promise<CryptoKey> {
  const certDer = base64ToBytes(certificate);
  const spkiDer = extractSubjectPublicKeyInfo(certDer);
  return crypto.subtle.importKey(
    "spki",
    toArrayBuffer(spkiDer),
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["verify"],
  );
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.slice().buffer;
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function extractSubjectPublicKeyInfo(certificateDer: Uint8Array): Uint8Array {
  const top = readDerElement(certificateDer, 0);
  if (top.tag !== 0x30) {
    throw new Error("Invalid x509 certificate: expected certificate sequence");
  }

  const tbs = readDerElement(certificateDer, top.valueOffset);
  if (tbs.tag !== 0x30) {
    throw new Error("Invalid x509 certificate: expected tbsCertificate sequence");
  }

  let offset = tbs.valueOffset;
  const end = tbs.endOffset;
  let element = readDerElement(certificateDer, offset);
  if (element.tag === 0xa0) {
    offset = element.endOffset;
  }

  for (let skipped = 0; skipped < 5; skipped += 1) {
    element = readDerElement(certificateDer, offset);
    offset = element.endOffset;
  }

  if (offset >= end) {
    throw new Error("Invalid x509 certificate: missing subjectPublicKeyInfo");
  }

  const spki = readDerElement(certificateDer, offset);
  if (spki.tag !== 0x30) {
    throw new Error("Invalid x509 certificate: expected subjectPublicKeyInfo sequence");
  }
  return certificateDer.slice(spki.startOffset, spki.endOffset);
}

function readDerElement(
  bytes: Uint8Array,
  offset: number,
): {
  tag: number;
  startOffset: number;
  valueOffset: number;
  endOffset: number;
} {
  if (offset + 2 > bytes.length) {
    throw new Error("Invalid DER: truncated element");
  }

  const startOffset = offset;
  const tag = bytes[offset++];
  const firstLength = bytes[offset++];
  let length = firstLength;

  if (firstLength & 0x80) {
    const lengthBytes = firstLength & 0x7f;
    if (lengthBytes === 0 || lengthBytes > 4 || offset + lengthBytes > bytes.length) {
      throw new Error("Invalid DER: unsupported length");
    }
    length = 0;
    for (let index = 0; index < lengthBytes; index += 1) {
      length = (length << 8) | bytes[offset++];
    }
  }

  const valueOffset = offset;
  const endOffset = valueOffset + length;
  if (endOffset > bytes.length) {
    throw new Error("Invalid DER: length exceeds input");
  }

  return { tag, startOffset, valueOffset, endOffset };
}

function getMockSubscriptionResponse() {
  const futureExpiry = new Date();
  futureExpiry.setFullYear(futureExpiry.getFullYear() + 1); // 1 year from now
  return {
    valid: true,
    status: "ACTIVE",
    expiryTime: futureExpiry.toISOString(),
    rawResponse: {
      subscriptionState: "ACTIVE",
      lineItems: [{ expiryTime: futureExpiry.toISOString() }],
      mock: true,
      note: "Generated locally because Google Play APIs are unreachable",
    },
  };
}

// --- Upload ID generation (reuse from upload.ts) ---

const SUB_ID_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
const SUB_ID_LENGTH = 21;

export function generateSubscriptionId(): string {
  const array = new Uint8Array(SUB_ID_LENGTH);
  crypto.getRandomValues(array);
  let id = "";
  for (let i = 0; i < SUB_ID_LENGTH; i++) {
    id += SUB_ID_CHARSET[array[i] % SUB_ID_CHARSET.length];
  }
  return id;
}
