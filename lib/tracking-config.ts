/** Add an account here when its public campaign is approved. */
export const trackingAccounts: Readonly<Record<string, string>> = {
  a001: "a001_aio_contents",
};
export const trackingSources: Readonly<Record<string, string>> = {
  yt: "youtube",
  ig: "instagram",
  fb: "facebook",
  th: "threads",
};
export const trackingPlacements = [
  "profile",
  "description",
  "pinned_comment",
  "post",
] as const;
export const purposeOptions = [
  ["sales_ad", "매출을 올릴 광고"],
  ["brand_intro", "브랜드 소개"],
  ["sns_ops", "SNS 운영용 콘텐츠"],
  ["unknown", "아직 모르겠어요"],
] as const;
export const foundViaOptions = [
  ["youtube", "유튜브"],
  ["instagram", "인스타그램"],
  ["facebook", "페이스북"],
  ["threads", "스레드"],
  ["naver", "네이버"],
  ["search", "검색"],
  ["referral", "지인 소개"],
  ["other", "기타"],
] as const;
export function shortLinkDestination(
  segments: string[],
  query: URLSearchParams,
) {
  const fallback = "/content/contact";
  const [account, kind, contentId] = segments;
  if (
    !/^a\d{3}$/.test(account ?? "") ||
    !Object.hasOwn(trackingAccounts, account)
  )
    return fallback;
  const content = kind === "c";
  const source = content ? query.get("s") : kind;
  const placement = content ? query.get("p") : "profile";
  if (
    (query.has("s") && !Object.hasOwn(trackingSources, query.get("s") ?? "")) ||
    (query.has("p") &&
      !trackingPlacements.some((value) => value === query.get("p")))
  )
    return fallback;
  if (
    segments.length !== (content ? 3 : 2) ||
    !source ||
    !Object.hasOwn(trackingSources, source) ||
    !placement ||
    !trackingPlacements.some((value) => value === placement) ||
    (content && !/^[A-Za-z0-9_-]{1,250}$/.test(contentId ?? "")) ||
    query.getAll("s").length > 1 ||
    query.getAll("p").length > 1
  )
    return fallback;
  // Do not forward arbitrary query parameters, destinations or supplied UTMs.
  const params = new URLSearchParams({
    utm_source: trackingSources[source],
    utm_medium: "social",
    utm_campaign: trackingAccounts[account],
    utm_term: placement,
  });
  if (content) params.set("utm_content", contentId);
  return fallback + "?" + params.toString();
}
