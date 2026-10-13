export function creativeAsset(division: string, service: string) {
  if (division === "video" && service === "motion-graphics")
    return "/creative-v06/video-brand-film.webp";
  const key = division === "video" && service === "ad" ? "sns-ad" : service;
  const refreshed =
    (division === "marketing" && (key === "integrated" || key === "seo")) ||
    (division === "development" &&
      (key === "website" || key === "automation"));
  return `/creative-v${refreshed ? "08" : "06"}/${division}-${key}.webp`;
}
