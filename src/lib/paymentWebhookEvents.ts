/**
 * Provider-scoped idempotency ledger for payment webhook deliveries.
 *
 * Providers deliver webhooks at least once and may resend an event after a
 * timeout. A row is written only after reconciliation has completed, so a
 * failed request remains eligible for a provider retry. PayPal uses this
 * helper now; the provider field lets the other channels opt in later without
 * a schema change.
 */

import { generateSubscriptionId } from "@/src/lib/subscription";

const PAYMENT_WEBHOOK_EVENT_RETENTION_DAYS = 30;
const PAYMENT_WEBHOOK_EVENT_CLEANUP_BATCH_SIZE = 5000;
const PAYMENT_WEBHOOK_EVENT_CLEANUP_COOLDOWN_MS = 12 * 60 * 60 * 1000;

// This is only a best-effort per-isolate cooldown. Cleanup remains safe to run
// more than once because it deletes only already-expired idempotency records.
let lastPaymentWebhookEventCleanupAt = 0;

export type PaymentWebhookProvider =
  | "app_store"
  | "creem"
  | "google_play"
  | "paypal";

export async function hasProcessedPaymentWebhookEvent(
  db: D1Database,
  provider: PaymentWebhookProvider,
  providerEventId: string,
): Promise<boolean> {
  const existing = await db
    .prepare(
      `SELECT id FROM payment_webhook_events
       WHERE provider = ? AND provider_event_id = ?`,
    )
    .bind(provider, providerEventId)
    .first<{ id: string }>();
  return !!existing;
}

export async function recordProcessedPaymentWebhookEvent(
  db: D1Database,
  provider: PaymentWebhookProvider,
  providerEventId: string,
  eventType: string,
): Promise<void> {
  await db
    .prepare(
      `INSERT OR IGNORE INTO payment_webhook_events
       (id, provider, provider_event_id, event_type)
       VALUES (?, ?, ?, ?)`,
    )
    .bind(generateSubscriptionId(), provider, providerEventId, eventType)
    .run();
}

/**
 * Prune the idempotency ledger from a successfully processed payment webhook.
 * The work is intentionally capped and rate-limited because payment webhooks
 * are the low-frequency trigger for this table's own maintenance.
 */
export async function triggerPaymentWebhookEventCleanup(
  db: D1Database,
): Promise<void> {
  const now = Date.now();
  if (now - lastPaymentWebhookEventCleanupAt < PAYMENT_WEBHOOK_EVENT_CLEANUP_COOLDOWN_MS) {
    return;
  }

  lastPaymentWebhookEventCleanupAt = now;

  try {
    const result = await db
      .prepare(
        `DELETE FROM payment_webhook_events
         WHERE id IN (
           SELECT id
           FROM payment_webhook_events
           WHERE processed_at < datetime('now', ?)
           ORDER BY processed_at ASC
           LIMIT ?
         )`,
      )
      .bind(`-${PAYMENT_WEBHOOK_EVENT_RETENTION_DAYS} days`, PAYMENT_WEBHOOK_EVENT_CLEANUP_BATCH_SIZE)
      .run();

    const deleted = result.meta?.changes ?? 0;
    if (deleted > 0) {
      console.log("[payment-webhook-events] Pruned expired idempotency records", { deleted });
    }
  } catch (error) {
    // A later successful payment webhook can retry maintenance. Never let this
    // auxiliary cleanup affect acknowledgement of a provider event.
    lastPaymentWebhookEventCleanupAt = 0;
    console.error("[payment-webhook-events] Cleanup failed:", error);
  }
}
