import "server-only";
import { isIP } from "node:net";

export const META_GRAPH_API_VERSION = "v26.0";
export const META_TIMEOUT_MS = 3000;

function cookie(request: Request, name: string) {
  const raw = request.headers
    .get("cookie")
    ?.split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(name + "="))
    ?.slice(name.length + 1);
  try {
    return raw ? decodeURIComponent(raw) : "";
  } catch {
    return "";
  }
}

export async function sendMetaLead(
  request: Request,
  receipt: { inquiryId: string; duplicate: boolean },
  service: string,
  submitPath: string,
) {
  const pixel = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  const fbp = cookie(request, "_fbp");
  if (!pixel || !token || receipt.duplicate || !fbp) return;
  try {
    const now = Date.now();
    const source = new URL(request.url);
    const submitted = new URL(submitPath, source.origin);
    if (submitted.origin !== source.origin) return;
    source.pathname = submitted.pathname;
    source.search = "";
    source.hash = "";
    const fbclid = cookie(request, "fbclid");
    const fbc =
      cookie(request, "_fbc") ||
      (fbclid && /^[A-Za-z0-9_.~%|=:-]{1,1000}$/.test(fbclid)
        ? `fb.1.${now}.${fbclid}`
        : "");
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim();
    const userAgent = request.headers.get("user-agent");
    const response = await fetch(
      `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${encodeURIComponent(pixel)}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(META_TIMEOUT_MS),
        body: JSON.stringify({
          access_token: token,
          data: [
            {
              event_name: "Lead",
              event_time: Math.floor(now / 1000),
              event_id: receipt.inquiryId,
              action_source: "website",
              event_source_url: source.href,
              user_data: {
                ...(ip && isIP(ip) ? { client_ip_address: ip } : {}),
                ...(userAgent ? { client_user_agent: userAgent } : {}),
                fbp,
                ...(fbc ? { fbc } : {}),
              },
              custom_data: { content_category: service },
            },
          ],
          ...(process.env.META_TEST_EVENT_CODE
            ? { test_event_code: process.env.META_TEST_EVENT_CODE }
            : {}),
        }),
      },
    );
    if (!response.ok) console.error("[meta-capi] delivery failed");
    await response.body?.cancel();
  } catch {
    // Never log the request, credentials, payload, response body or exception.
    console.error("[meta-capi] delivery failed");
  }
}
