export const utmKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;
export const clickIdKeys = ["gclid", "fbclid", "NaPm"] as const;
export type FirstTouch = {
  utm: Record<string, string>;
  landingPath: string;
  date: string;
};
export type Attribution = {
  landingPath: string;
  submitPath: string;
  referrer: string;
  utm: Record<string, string>;
  sessionUid?: string;
  firstTouch?: FirstTouch;
  clickIds?: Partial<Record<(typeof clickIdKeys)[number], string>>;
};
export function cleanUtm(value: unknown): Record<string, string> {
  const result: Record<string, string> = {};
  if (value && typeof value === "object")
    for (const key of utmKeys) {
      const item = (value as Record<string, unknown>)[key];
      // Identifiers only: never copy free text, contact fields or full URLs.
      if (typeof item === "string" && /^[A-Za-z0-9_-]{1,250}$/.test(item))
        result[key] = item;
    }
  return result;
}
export function cleanPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//")
    ? value.split(/[?#]/)[0].slice(0, 500)
    : "/";
}
function cookie(name: string) {
  try {
    const value = document.cookie
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith(name + "="));
    return value ? decodeURIComponent(value.slice(name.length + 1)) : "";
  } catch {
    return "";
  }
}
function setCookie(name: string, value: string) {
  try {
    document.cookie =
      name +
      "=" +
      encodeURIComponent(value) +
      "; Path=/; Max-Age=7776000; SameSite=Lax" +
      (location.protocol === "https:" ? "; Secure" : "");
  } catch {}
}
function firstTouch(): FirstTouch | undefined {
  try {
    const value = JSON.parse(cookie("aio_first_touch"));
    if (
      typeof value.landingPath === "string" &&
      typeof value.date === "string" &&
      Number.isFinite(Date.parse(value.date))
    )
      return {
        utm: cleanUtm(value.utm),
        landingPath: cleanPath(value.landingPath),
        date: new Date(value.date).toISOString(),
      };
  } catch {}
}
export function captureAttribution(pathname: string, params: URLSearchParams) {
  const utm = cleanUtm(Object.fromEntries(params));
  try {
    if (!sessionStorage.getItem("aio_renewal_landing"))
      sessionStorage.setItem("aio_renewal_landing", cleanPath(pathname));
    if (Object.keys(utm).length && !sessionStorage.getItem("aio_renewal_utm"))
      sessionStorage.setItem("aio_renewal_utm", JSON.stringify(utm));
  } catch {}
  // Cookie and session storage are independent; either may be denied.
  if (!cookie("aio_first_touch"))
    setCookie(
      "aio_first_touch",
      JSON.stringify({
        utm,
        landingPath: cleanPath(pathname),
        date: new Date().toISOString(),
      }),
    );
  for (const key of clickIdKeys) {
    const value = params.get(key);
    if (value && /^[A-Za-z0-9_.~%|=:-]{1,1000}$/.test(value))
      setCookie(key, value);
  }
}
export function submissionAttribution(): Attribution {
  const params = new URLSearchParams(location.search);
  captureAttribution(location.pathname, params);
  const result: Attribution = {
    landingPath: cleanPath(location.pathname),
    submitPath: cleanPath(location.pathname),
    referrer: "",
    utm: cleanUtm(Object.fromEntries(params)),
    firstTouch: firstTouch(),
    clickIds: {},
  };
  try {
    const url = new URL(document.referrer);
    result.referrer = (url.origin + url.pathname).slice(0, 500);
  } catch {}
  try {
    result.landingPath = cleanPath(
      sessionStorage.getItem("aio_renewal_landing") ?? location.pathname,
    );
    const stored = cleanUtm(
      JSON.parse(sessionStorage.getItem("aio_renewal_utm") ?? "{}"),
    );
    if (Object.keys(stored).length) result.utm = stored;
    const existing = sessionStorage.getItem("aio_renewal_session");
    result.sessionUid =
      existing && /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(existing)
        ? existing
        : crypto.randomUUID();
    sessionStorage.setItem("aio_renewal_session", result.sessionUid);
  } catch {}
  for (const key of clickIdKeys) {
    const value = cookie(key);
    if (/^[A-Za-z0-9_.~%|=:-]{1,1000}$/.test(value))
      result.clickIds![key] = value;
  }
  return result;
}
