/**
 * PayPal Subscriptions REST API helpers.
 *
 * This module only runs on the server. Keep PAYPAL_CLIENT_SECRET in a
 * Cloudflare Worker secret and never expose it to the browser.
 */

export type PayPalEnvironment = "sandbox" | "live";

export interface PayPalConfig {
  environment: PayPalEnvironment;
  apiBaseUrl: string;
  clientId: string;
  clientSecret: string;
  planId?: string;
  webhookId?: string;
}

export interface PayPalLink {
  href: string;
  rel: string;
  method?: string;
}

export interface PayPalSubscription {
  id: string;
  status: string;
  plan_id: string;
  start_time?: string;
  custom_id?: string;
  subscriber?: {
    payer_id?: string;
    email_address?: string;
  };
  billing_info?: {
    next_billing_time?: string;
    last_payment?: {
      time?: string;
      status?: string;
    };
  };
  links?: PayPalLink[];
}

export function mapPayPalSubscriptionStatus(status: string | undefined): string {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "active";
    case "APPROVAL_PENDING":
    case "APPROVED":
      return "approval_pending";
    case "SUSPENDED":
      return "past_due";
    case "CANCELLED":
      return "canceled";
    case "EXPIRED":
      return "expired";
    default:
      return "unknown";
  }
}

export function getPayPalSubscriptionPeriod(subscription: PayPalSubscription): {
  start: string | null;
  end: string | null;
} {
  return {
    start: subscription.billing_info?.last_payment?.time ?? subscription.start_time ?? null,
    end: subscription.billing_info?.next_billing_time ?? null,
  };
}

interface PayPalErrorBody {
  name?: string;
  message?: string;
  debug_id?: string;
  details?: unknown;
}

export class PayPalApiError extends Error {
  status: number;
  debugId?: string;

  constructor(message: string, status: number, debugId?: string) {
    super(message);
    this.name = "PayPalApiError";
    this.status = status;
    this.debugId = debugId;
  }
}

export function getPayPalConfig(options?: {
  requirePlanId?: boolean;
  requireWebhookId?: boolean;
}): PayPalConfig {
  const environment = process.env.PAYPAL_ENV?.toLowerCase();
  if (environment !== "sandbox" && environment !== "live") {
    throw new Error("PAYPAL_ENV must be either sandbox or live");
  }

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const planId = process.env.PAYPAL_PLAN_ID;
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!clientId || !clientSecret) {
    throw new Error("PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET must be configured");
  }
  if (options?.requirePlanId && !planId) {
    throw new Error("PAYPAL_PLAN_ID must be configured");
  }
  if (options?.requireWebhookId && !webhookId) {
    throw new Error("PAYPAL_WEBHOOK_ID must be configured");
  }

  return {
    environment,
    apiBaseUrl:
      environment === "sandbox"
        ? "https://api-m.sandbox.paypal.com"
        : "https://api-m.paypal.com",
    clientId,
    clientSecret,
    planId,
    webhookId,
  };
}

function parsePayPalError(rawBody: string): PayPalErrorBody | null {
  if (!rawBody) return null;
  try {
    return JSON.parse(rawBody) as PayPalErrorBody;
  } catch {
    return null;
  }
}

async function getAccessToken(config: PayPalConfig): Promise<string> {
  const response = await fetch(`${config.apiBaseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`,
      Accept: "application/json",
      "Accept-Language": "en_US",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const rawBody = await response.text();
  if (!response.ok) {
    const error = parsePayPalError(rawBody);
    throw new PayPalApiError(
      error?.message ?? "PayPal authentication failed",
      response.status,
      error?.debug_id,
    );
  }

  const body = JSON.parse(rawBody) as { access_token?: string };
  if (!body.access_token) {
    throw new PayPalApiError("PayPal authentication response did not include an access token", 502);
  }
  return body.access_token;
}

export function newPayPalRequestId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`.slice(0, 108);
}

export async function paypalRequest<T>(
  config: PayPalConfig,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const accessToken = await getAccessToken(config);
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
  headers.set("Accept", "application/json");

  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    ...init,
    headers,
  });
  const rawBody = await response.text();

  if (!response.ok) {
    const error = parsePayPalError(rawBody);
    throw new PayPalApiError(
      error?.message ?? `PayPal request failed with ${response.status}`,
      response.status,
      error?.debug_id,
    );
  }

  if (!rawBody) return null as T;
  return JSON.parse(rawBody) as T;
}

export async function createPayPalSubscription(
  config: PayPalConfig,
  options: {
    returnUrl: string;
    cancelUrl: string;
    email?: string;
    locale?: string;
  },
): Promise<PayPalSubscription> {
  if (!config.planId) {
    throw new Error("PAYPAL_PLAN_ID must be configured");
  }

  const subscriber = options.email ? { email_address: options.email } : undefined;
  return paypalRequest<PayPalSubscription>(config, "/v1/billing/subscriptions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation",
      "PayPal-Request-Id": newPayPalRequestId("quickshare-subscription"),
    },
    body: JSON.stringify({
      plan_id: config.planId,
      custom_id: `qs_${crypto.randomUUID()}`,
      subscriber,
      application_context: {
        brand_name: "Quick Share",
        locale: options.locale,
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        return_url: options.returnUrl,
        cancel_url: options.cancelUrl,
      },
    }),
  });
}

export async function getPayPalSubscription(
  config: PayPalConfig,
  subscriptionId: string,
): Promise<PayPalSubscription> {
  return paypalRequest<PayPalSubscription>(
    config,
    `/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`,
  );
}

export async function cancelPayPalSubscription(
  config: PayPalConfig,
  subscriptionId: string,
  reason: string,
): Promise<void> {
  await paypalRequest<null>(
    config,
    `/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    },
  );
}

export async function verifyPayPalWebhookSignature(
  config: PayPalConfig,
  event: unknown,
  headers: Headers,
): Promise<boolean> {
  if (!config.webhookId) {
    throw new Error("PAYPAL_WEBHOOK_ID must be configured");
  }

  const authAlgo = headers.get("paypal-auth-algo");
  const certUrl = headers.get("paypal-cert-url");
  const transmissionId = headers.get("paypal-transmission-id");
  const transmissionSig = headers.get("paypal-transmission-sig");
  const transmissionTime = headers.get("paypal-transmission-time");

  if (!authAlgo || !certUrl || !transmissionId || !transmissionSig || !transmissionTime) {
    return false;
  }

  const result = await paypalRequest<{ verification_status?: string }>(
    config,
    "/v1/notifications/verify-webhook-signature",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: config.webhookId,
        webhook_event: event,
      }),
    },
  );

  return result.verification_status === "SUCCESS";
}
