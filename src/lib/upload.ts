/**
 * Shared constants and utilities for the upload feature.
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Get Cloudflare bindings (D1, R2, etc.) via the OpenNext context API.
 * Works in both edge and Node.js runtimes.
 */
export async function getEnv(): Promise<Cloudflare.Env> {
  const ctx = await getCloudflareContext({ async: true });
  return ctx.env as unknown as Cloudflare.Env;
}

// --- Tier limits ---

export const TIER_LIMITS = {
  free: {
    maxFiles: 3,
    maxFileSizeBytes: 1 * 1024 * 1024 * 1024, // 1 GB
    allowedExpiryDays: [3],
  },
  pro: {
    maxFiles: 20,
    maxFileSizeBytes: 5 * 1024 * 1024 * 1024, // 5 GB
    allowedExpiryDays: [3, 7, 14, 30],
  },
} as const;

export type Tier = "free" | "pro";

// --- Access code ---

// Character set excluding easily confused characters: 0/O, 1/l/I
const ACCESS_CODE_CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ACCESS_CODE_LENGTH = 4;

/**
 * Generate a cryptographically random 4-character access code.
 */
export function generateAccessCode(): string {
  const array = new Uint8Array(ACCESS_CODE_LENGTH);
  crypto.getRandomValues(array);
  let code = "";
  for (let i = 0; i < ACCESS_CODE_LENGTH; i++) {
    code += ACCESS_CODE_CHARSET[array[i] % ACCESS_CODE_CHARSET.length];
  }
  return code;
}

// --- Upload ID ---

const UPLOAD_ID_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
const UPLOAD_ID_LENGTH = 21;

/**
 * Generate a cryptographically random upload ID (nanoid-compatible).
 */
export function generateUploadId(): string {
  const array = new Uint8Array(UPLOAD_ID_LENGTH);
  crypto.getRandomValues(array);
  let id = "";
  for (let i = 0; i < UPLOAD_ID_LENGTH; i++) {
    id += UPLOAD_ID_CHARSET[array[i] % UPLOAD_ID_CHARSET.length];
  }
  return id;
}

// --- R2 Key ---

/**
 * Generate an R2 object key with expiry-based prefix for lifecycle rules.
 * Does not include original file name to prevent encoding issues and security risks.
 * uploads/{N}d/{user_id}/{upload_id}
 */
export function generateR2Key(userId: string, uploadId: string, expiryDays: number): string {
  return `uploads/${expiryDays}d/${userId}/${uploadId}`;
}

// --- Tier detection ---

/**
 * Determine user tier from the presence of a purchase_token.
 * Simple trust model: if purchase_token is provided, treat as Pro.
 */
export function detectTier(purchaseToken?: string): Tier {
  return purchaseToken ? "pro" : "free";
}

// --- Content type helpers ---

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/avif",
]);

const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "avif"]);

export function isImageContentType(contentType: string | null | undefined): boolean {
  if (!contentType) return false;
  return IMAGE_TYPES.has(contentType.split(";")[0].trim().toLowerCase());
}

/**
 * Robust image detection using both MIME type and file extension.
 */
export function isImageFile(fileName: string, contentType: string | null | undefined): boolean {
  if (isImageContentType(contentType)) return true;
  const ext = fileName.split(".").pop()?.toLowerCase();
  return !!ext && IMAGE_EXTENSIONS.has(ext);
}

// --- Response helpers ---

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function errorResponse(message: string, status = 400, code?: string): Response {
  return jsonResponse(code ? { message, code } : { message }, status);
}

// --- Presigned URL generation ---

/**
 * Generate a presigned PUT URL for R2 using the S3-compatible API.
 * Uses AWS SigV4 signing.
 */
export interface PresignedUrlResult {
  url: string;
  headers: Record<string, string>;
}

export async function generatePresignedPutUrl(
  r2Key: string,
  contentType: string,
  options: {
    accountId: string;
    bucketName: string;
    accessKeyId: string;
    secretAccessKey: string;
    expiresInSeconds?: number;
  }
): Promise<PresignedUrlResult> {
  const expires = options.expiresInSeconds || 3600; // 1 hour default
  const endpoint = `https://${options.accountId}.r2.cloudflarestorage.com`;
  const url = new URL(`/${options.bucketName}/${encodeR2Key(r2Key)}`, endpoint);

  // We need to sign using AWS SigV4
  const now = new Date();
  const dateStamp = formatDate(now);
  const amzDate = formatAmzDate(now);
  const credentialScope = `${dateStamp}/auto/s3/aws4_request`;

  const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";
  const payloadHash = "UNSIGNED-PAYLOAD";

  // Canonical request
  const canonicalHeaders =
    `content-type:${contentType}\n` +
    `host:${url.host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;

  const canonicalQueryString = `X-Amz-Algorithm=AWS4-HMAC-SHA256` +
    `&X-Amz-Credential=${encodeURIComponent(options.accessKeyId + "/" + credentialScope)}` +
    `&X-Amz-Date=${amzDate}` +
    `&X-Amz-Expires=${expires}` +
    `&X-Amz-SignedHeaders=${encodeURIComponent(signedHeaders)}`;

  const canonicalRequest = [
    "PUT",
    url.pathname,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  // String to sign
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join("\n");

  // Signing
  const signingKey = await getSigningKey(options.secretAccessKey, dateStamp);
  const signature = await hmacSha256Hex(signingKey, stringToSign);

  // Build final URL
  const presignedUrl = `${url}?${canonicalQueryString}&X-Amz-Signature=${signature}`;
  return {
    url: presignedUrl,
    headers: {
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
    },
  };
}

/**
 * Generate a presigned GET URL for downloading from R2.
 */
export async function generatePresignedGetUrl(
  r2Key: string,
  options: {
    accountId: string;
    bucketName: string;
    accessKeyId: string;
    secretAccessKey: string;
    expiresInSeconds?: number;
    responseContentDisposition?: string;
  }
): Promise<string> {
  const expires = options.expiresInSeconds || 3600;
  const endpoint = `https://${options.accountId}.r2.cloudflarestorage.com`;
  const url = new URL(`/${options.bucketName}/${encodeR2Key(r2Key)}`, endpoint);

  const now = new Date();
  const dateStamp = formatDate(now);
  const amzDate = formatAmzDate(now);
  const credentialScope = `${dateStamp}/auto/s3/aws4_request`;

  const signedHeaders = "host";
  const payloadHash = "UNSIGNED-PAYLOAD";

  const canonicalHeaders = `host:${url.host}\n`;

  const queryParams: string[] = [
    `X-Amz-Algorithm=AWS4-HMAC-SHA256`,
    `X-Amz-Credential=${encodeURIComponent(options.accessKeyId + "/" + credentialScope)}`,
    `X-Amz-Date=${amzDate}`,
    `X-Amz-Expires=${expires}`,
    `X-Amz-SignedHeaders=${encodeURIComponent(signedHeaders)}`,
  ];

  if (options.responseContentDisposition) {
    queryParams.push(
      `response-content-disposition=${encodeURIComponent(options.responseContentDisposition)}`
    );
  }

  queryParams.sort();
  const canonicalQueryString = queryParams.join("&");

  const canonicalRequest = [
    "GET",
    url.pathname,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join("\n");

  const signingKey = await getSigningKey(options.secretAccessKey, dateStamp);
  const signature = await hmacSha256Hex(signingKey, stringToSign);

  return `${url}?${canonicalQueryString}&X-Amz-Signature=${signature}`;
}

// --- AWS SigV4 crypto helpers (Web Crypto API) ---

function encodeRfc3986(str: string): string {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()
  );
}

function encodeR2Key(key: string): string {
  return key.split("/").map(encodeRfc3986).join("/");
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

function formatAmzDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

async function sha256Hex(data: string): Promise<string> {
  const encoded = new TextEncoder().encode(data);
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256(key: Uint8Array, data: string): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
  return new Uint8Array(sig);
}

async function hmacSha256Hex(key: Uint8Array, data: string): Promise<string> {
  const result = await hmacSha256(key, data);
  return Array.from(result)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getSigningKey(secretKey: string, dateStamp: string): Promise<Uint8Array> {
  const kDate = await hmacSha256(new TextEncoder().encode("AWS4" + secretKey), dateStamp);
  const kRegion = await hmacSha256(kDate, "auto");
  const kService = await hmacSha256(kRegion, "s3");
  const kSigning = await hmacSha256(kService, "aws4_request");
  return kSigning;
}

// --- Database types ---

export interface UploadRecord {
  id: string;
  user_id: string;
  file_name: string;
  file_size_bytes: number;
  content_type: string | null;
  r2_key: string;
  status: "pending" | "completed";
  expiry_days: number;
  access_code: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string | null;
}

// In-memory cooldown cache
let lastCleanupTime = 0;
const CLEANUP_COOLDOWN_MS = 12 * 60 * 60 * 1000; // 12 hours
const SQL_IN_CHUNK_SIZE = 90;

type UploadCleanupRow = Pick<UploadRecord, "id">;

export interface UploadCleanupResult {
  expiredUploadsFound: number;
  stalePendingUploadsFound: number;
  accessAttemptsDeleted: number;
  abuseReportsDeleted: number;
  uploadRecordsDeleted: number;
}

/**
 * Remove metadata for uploads in dependency order. `abuse_reports.upload_id`
 * has a foreign key to `uploads.id`, so deleting the parent upload first makes
 * the entire cleanup transaction fail when a report exists.
 */
async function deleteUploadMetadata(
  db: D1Database,
  uploadIds: string[],
  hasAccessAttemptsTable: boolean,
) {
  let accessAttemptsDeleted = 0;
  let abuseReportsDeleted = 0;
  let uploadRecordsDeleted = 0;

  for (let i = 0; i < uploadIds.length; i += SQL_IN_CHUNK_SIZE) {
    const chunk = uploadIds.slice(i, i + SQL_IN_CHUNK_SIZE);
    const placeholders = chunk.map(() => "?").join(", ");
    const statements: D1PreparedStatement[] = [];

    // This table is created lazily by the password-verification route, so it
    // may not exist on a new deployment with no password attempts yet.
    if (hasAccessAttemptsTable) {
      statements.push(
        db
          .prepare(`DELETE FROM access_attempts WHERE upload_id IN (${placeholders})`)
          .bind(...chunk),
      );
    }

    statements.push(
      db
        .prepare(`DELETE FROM abuse_reports WHERE upload_id IN (${placeholders})`)
        .bind(...chunk),
      db.prepare(`DELETE FROM uploads WHERE id IN (${placeholders})`).bind(...chunk),
    );

    // D1 executes batch statements in order, atomically. This keeps the child
    // row deletions and the parent upload deletion together.
    const results = await db.batch(statements);
    let resultIndex = 0;

    if (hasAccessAttemptsTable) {
      accessAttemptsDeleted += results[resultIndex++]?.meta?.changes ?? 0;
    }
    abuseReportsDeleted += results[resultIndex++]?.meta?.changes ?? 0;
    uploadRecordsDeleted += results[resultIndex]?.meta?.changes ?? 0;
  }

  return { accessAttemptsDeleted, abuseReportsDeleted, uploadRecordsDeleted };
}

async function hasAccessAttemptsTable(db: D1Database): Promise<boolean> {
  const table = await db
    .prepare("SELECT 1 AS present FROM sqlite_master WHERE type = 'table' AND name = ?")
    .bind("access_attempts")
    .first<{ present: number }>();

  return Boolean(table);
}

/**
 * Delete expired completed uploads and pending uploads that were never
 * completed within 24 hours. Related rate-limit and abuse-report rows must be
 * deleted first so foreign-key constraints cannot block all later cleanups.
 * R2 objects are removed by the bucket lifecycle rule.
 */
export async function cleanupExpiredUploads(
  env: Cloudflare.Env,
  cleanupTime = new Date(),
): Promise<UploadCleanupResult> {
  const nowISO = cleanupTime.toISOString();
  const staleCutoff = new Date(cleanupTime.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const [expiredRecords, staleRecords] = await Promise.all([
    env.DB
      .prepare("SELECT id FROM uploads WHERE status = 'completed' AND expires_at < ?")
      .bind(nowISO)
      .all<UploadCleanupRow>(),
    env.DB
      .prepare("SELECT id FROM uploads WHERE status = 'pending' AND created_at < ?")
      .bind(staleCutoff)
      .all<UploadCleanupRow>(),
  ]);

  const expiredUploads = expiredRecords.results ?? [];
  const stalePendingUploads = staleRecords.results ?? [];
  const uploadsToDelete = [...expiredUploads, ...stalePendingUploads];

  if (uploadsToDelete.length === 0) {
    return {
      expiredUploadsFound: 0,
      stalePendingUploadsFound: 0,
      accessAttemptsDeleted: 0,
      abuseReportsDeleted: 0,
      uploadRecordsDeleted: 0,
    };
  }

  const metadataCleanup = await deleteUploadMetadata(
    env.DB,
    uploadsToDelete.map((upload) => upload.id),
    await hasAccessAttemptsTable(env.DB),
  );

  const result = {
    expiredUploadsFound: expiredUploads.length,
    stalePendingUploadsFound: stalePendingUploads.length,
    ...metadataCleanup,
  };

  console.log("[upload-cleanup] Finished", result);
  return result;
}

/**
 * Run cleanup after a completed upload. It is rate-limited to at most once per
 * Worker isolate every 12 hours.
 */
export async function triggerLazyCleanup(env: Cloudflare.Env): Promise<void> {
  const now = Date.now();
  if (now - lastCleanupTime < CLEANUP_COOLDOWN_MS) {
    return;
  }

  // Update cooldown timestamp immediately to prevent concurrent calls
  lastCleanupTime = now;

  try {
    const result = await cleanupExpiredUploads(env);
    if (result.expiredUploadsFound === 0 && result.stalePendingUploadsFound === 0) {
      console.log("[lazy-cleanup] Checked. No expired or stale uploads found. Exiting early (0 writes).");
    }
  } catch (error) {
    console.error("[lazy-cleanup] Error during lazy cleanup execution:", error);
    lastCleanupTime = 0; // Reset timer on error to allow retry
  }
}
