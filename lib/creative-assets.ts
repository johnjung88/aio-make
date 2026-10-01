export function creativeAsset(division: string, service: string) {
  const key = division === "video" && service === "ad" ? "sns-ad" : service;
  return `/creative-v06/${division}-${key}.webp`;
}
