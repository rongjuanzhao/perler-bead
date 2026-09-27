const ALLOWED_CHECKOUT_RETURN_PATHS = new Set([
  "/transfer/cloud",
  "/image-to-url",
  "/video-to-link",
]);

/**
 * Checkout providers redirect the browser after payment. Restrict caller-
 * supplied return paths to our known product routes so a checkout request can
 * never be used as an open redirect.
 */
export function getSubscriptionCheckoutReturnUrl(
  requestUrl: string,
  requestedPath: unknown,
): URL {
  const requestOrigin = new URL(requestUrl).origin;
  const fallback = new URL("/transfer/cloud", requestOrigin);

  if (typeof requestedPath !== "string" || requestedPath.length === 0) {
    return fallback;
  }

  try {
    const candidate = new URL(requestedPath, requestOrigin);
    if (
      candidate.origin !== requestOrigin ||
      !ALLOWED_CHECKOUT_RETURN_PATHS.has(candidate.pathname)
    ) {
      return fallback;
    }

    candidate.search = "";
    candidate.hash = "";
    return candidate;
  } catch {
    return fallback;
  }
}
