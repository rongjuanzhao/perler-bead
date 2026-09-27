'use client';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export type TransferType = "lan" | "cloud";

type AnalyticsEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

let analyticsReady = false;
const queuedEvents: AnalyticsEvent[] = [];

function sendEvent({ action, category, label, value }: AnalyticsEvent) {
  window.gtag?.("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
  console.log(`[Analytics] Tracked event: ${action}`, { category, label, value });
}

/**
 * Flushes events which fired before the Google tag initialization script was
 * available. This is especially important for page-mount funnel events.
 */
export function markAnalyticsReady() {
  if (typeof window === "undefined" || !window.gtag) return;

  analyticsReady = true;
  while (queuedEvents.length > 0) {
    const event = queuedEvents.shift();
    if (event) sendEvent(event);
  }
}

/**
 * Log a custom event to Google Analytics.
 * Events triggered before the Google tag initializes are queued and sent once
 * the tag is ready.
 *
 * @param action Event action name (e.g. 'click_buy_premium', 'upload_complete')
 * @param category Event category (e.g. 'engagement', 'conversion')
 * @param label Event label (e.g. 'pro_pricing_button', 'cloud_transfer')
 * @param value Optional numeric value
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window === "undefined") return;

  const event = { action, category, label, value };
  if (!analyticsReady || !window.gtag) {
    queuedEvents.push(event);
    return;
  }

  sendEvent(event);
}

export function trackHomeView() {
  trackEvent("home_view", "funnel");
}

export function trackTransferEntry(transferType: TransferType) {
  trackEvent(`${transferType}_transfer_entry`, "funnel");
}

export function trackTransferToolView(transferType: TransferType) {
  trackEvent(`${transferType}_transfer_view`, "funnel");
}
