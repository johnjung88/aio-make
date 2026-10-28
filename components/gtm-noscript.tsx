import { headers } from "next/headers";
import { analyticsAllowed, gtmId } from "@/lib/analytics-config";

// RootLayout awaits this component so streaming cannot precede the noscript.
export async function GtmNoscript({
  canonicalHost,
}: {
  canonicalHost: string;
}) {
  const id = gtmId();
  if (!id || process.env.NODE_ENV !== "production") return null;
  const requestHeaders = await headers();
  const pathname = requestHeaders.get("x-aio-tracking-path");
  if (!pathname) return null;
  let hostname = "";
  try {
    hostname = new URL("http://" + requestHeaders.get("host")).hostname;
  } catch {}
  if (!analyticsAllowed({ hostname, canonicalHost, pathname })) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${id}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
