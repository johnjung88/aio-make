export function gtmId(value = process.env.NEXT_PUBLIC_GTM_ID ?? "") {
  return /^GTM-[A-Z0-9]+$/.test(value) ? value : "";
}

export function analyticsAllowed({
  hostname,
  canonicalHost,
  pathname,
  production = process.env.NODE_ENV === "production",
  localTest = process.env.NEXT_PUBLIC_TRACKING_LOCAL_TEST === "1",
}: {
  hostname: string;
  canonicalHost: string;
  pathname: string;
  production?: boolean;
  localTest?: boolean;
}) {
  if (/^\/admin(?:\/|$)/.test(pathname)) return false;
  const loopback = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(
    hostname,
  );
  return loopback ? localTest : production && hostname === canonicalHost;
}

// Google's standard loader; only a validated container ID is interpolated.
export function gtmSnippet(id: string) {
  if (!gtmId(id)) return "";
  return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(id)});`;
}

export function trackLegacyLead(
  receipt: { duplicate?: unknown },
  values: { division: string; service: string },
) {
  if (
    gtmId() ||
    receipt.duplicate !== false ||
    typeof window === "undefined" ||
    ["localhost", "127.0.0.1", "::1", "[::1]"].includes(location.hostname)
  )
    return;
  window.gtag?.("event", "generate_lead", values);
}
