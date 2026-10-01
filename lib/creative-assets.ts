export function creativeAsset(division: string, service: string) {
  const key = division === "video" && service === "ad" ? "sns-ad" : service;
  const refreshed =
    (division === "marketing" && (key === "integrated" || key === "seo")) ||
    (division === "development" &&
      (key === "website" || key === "automation"));
  return `/creative-v${refreshed ? "08" : "06"}/${division}-${key}.webp`;
}
