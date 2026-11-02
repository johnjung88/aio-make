// Compare against the incoming Host, since Next may normalize a local Request URL.
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin"),
    host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    const parsed = new URL(origin);
    const protocol =
      (request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ??
        new URL(request.url).protocol.replace(":", "")) + ":";
    return parsed.host === host && parsed.protocol === protocol;
  } catch {
    return false;
  }
}
