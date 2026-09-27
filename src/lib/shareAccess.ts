/**
 * Password verification for media preview links. It reuses the existing
 * `access_attempts` table and its lazy creation pattern, so no migration is
 * needed for media tools.
 */

const MAX_FAILED_ATTEMPTS = 5;
const COOLDOWN_MINUTES = 15;

export type ShareAccessResult =
  | { ok: true }
  | { ok: false; status: number; message: string };

export async function verifyShareAccessCode({
  db,
  uploadId,
  expectedAccessCode,
  suppliedAccessCode,
  clientIp,
}: {
  db: D1Database;
  uploadId: string;
  expectedAccessCode: string | null;
  suppliedAccessCode?: string;
  clientIp: string;
}): Promise<ShareAccessResult> {
  if (!expectedAccessCode) {
    return { ok: true };
  }

  if (!suppliedAccessCode) {
    return { ok: false, status: 401, message: "Invalid or missing access code" };
  }

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS access_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        upload_id TEXT NOT NULL,
        ip TEXT NOT NULL,
        attempt_count INTEGER NOT NULL DEFAULT 0,
        last_attempt_at TEXT NOT NULL,
        UNIQUE(upload_id, ip)
      )`,
    )
    .run();

  const attempt = await db
    .prepare("SELECT attempt_count, last_attempt_at FROM access_attempts WHERE upload_id = ? AND ip = ?")
    .bind(uploadId, clientIp)
    .first<{ attempt_count: number; last_attempt_at: string }>();

  const now = new Date();
  const cooldownEnd = attempt
    ? new Date(new Date(attempt.last_attempt_at).getTime() + COOLDOWN_MINUTES * 60 * 1000)
    : null;

  if (attempt && attempt.attempt_count >= MAX_FAILED_ATTEMPTS && cooldownEnd && now < cooldownEnd) {
    const retryAfter = Math.ceil((cooldownEnd.getTime() - now.getTime()) / 1000);
    return {
      ok: false,
      status: 429,
      message: `Too many failed attempts. Try again in ${Math.ceil(retryAfter / 60)} minutes.`,
    };
  }

  const attemptCount = attempt && cooldownEnd && now >= cooldownEnd ? 0 : (attempt?.attempt_count ?? 0);
  if (attempt && cooldownEnd && now >= cooldownEnd) {
    await db
      .prepare("UPDATE access_attempts SET attempt_count = 0, last_attempt_at = ? WHERE upload_id = ? AND ip = ?")
      .bind(now.toISOString(), uploadId, clientIp)
      .run();
  }

  if (suppliedAccessCode.toUpperCase() !== expectedAccessCode.toUpperCase()) {
    if (attempt) {
      await db
        .prepare("UPDATE access_attempts SET attempt_count = ?, last_attempt_at = ? WHERE upload_id = ? AND ip = ?")
        .bind(attemptCount + 1, now.toISOString(), uploadId, clientIp)
        .run();
    } else {
      await db
        .prepare("INSERT INTO access_attempts (upload_id, ip, attempt_count, last_attempt_at) VALUES (?, ?, 1, ?)")
        .bind(uploadId, clientIp, now.toISOString())
        .run();
    }

    return {
      ok: false,
      status: 401,
      message: `Invalid access code. ${Math.max(0, MAX_FAILED_ATTEMPTS - (attemptCount + 1))} attempts remaining.`,
    };
  }

  if (attempt) {
    await db
      .prepare("UPDATE access_attempts SET attempt_count = 0, last_attempt_at = ? WHERE upload_id = ? AND ip = ?")
      .bind(now.toISOString(), uploadId, clientIp)
      .run();
  }

  return { ok: true };
}
