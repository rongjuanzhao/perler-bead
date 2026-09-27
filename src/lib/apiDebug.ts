import { jsonResponse } from "./upload";

const LOCAL_DEBUG_HOST_SUFFIXES = [
  ".ngrok-free.app",
  ".ngrok-free.dev",
  ".ngrok.io",
  ".trycloudflare.com",
];

export function shouldLogApiBodies(request: Request): boolean {
  if (process.env.DEBUG_API_BODIES === "true") return true;
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NEXTJS_ENV === "development"
  ) {
    return true;
  }

  const hostname = new URL(request.url).hostname;
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    LOCAL_DEBUG_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix))
  );
}

export async function logApiRequestBody(
  scope: string,
  request: Request,
): Promise<void> {
  if (!shouldLogApiBodies(request)) return;

  let body: string | null = null;
  try {
    body = await request.clone().text();
  } catch (err) {
    body = `<failed to read request body: ${err instanceof Error ? err.message : String(err)}>`;
  }

  const authHeader = request.headers.get("Authorization");
  console.log(`${scope} Request debug:`, {
    method: request.method,
    url: request.url,
    authorization: authHeader
      ? {
          present: true,
          startsWithBearer: authHeader.startsWith("Bearer "),
          length: authHeader.length,
        }
      : { present: false },
    body,
  });
}

export function debugJsonResponse(
  scope: string,
  request: Request,
  body: unknown,
  status = 200,
): Response {
  if (shouldLogApiBodies(request)) {
    console.log(`${scope} Response debug:`, {
      status,
      body,
    });
  }

  return jsonResponse(body, status);
}
