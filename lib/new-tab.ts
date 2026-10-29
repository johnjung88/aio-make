// Main-site links into content and lab open a new tab with NewTabHint
// Each area keeps its own internal navigation in the same tab
export const NEW_TAB_HINT = "새 탭에서 열림";

export const newTabProps = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

export function isContentHref(href: string): boolean {
  return /^\/content(?:[/?#]|$)/.test(href);
}

export function isLabHref(href: string): boolean {
  return /^\/lab(?:[/?#]|$)/.test(href);
}
export function isMarketingHref(href: string): boolean {
  return /^\/marketing(?:[/?#]|$)/.test(href);
}
export function contentLinkProps(
  href: string,
  currentPath = "/",
): Partial<typeof newTabProps> {
  return (isContentHref(href) && !isContentHref(currentPath)) ||
    (isLabHref(href) && !isLabHref(currentPath)) ||
    (isMarketingHref(href) && !isMarketingHref(currentPath))
    ? newTabProps
    : {};
}
