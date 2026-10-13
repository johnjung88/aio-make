// Main-site links into the content category (/content, /content/services/*)
// open the content site in a new tab (user request 2026-10-14). Links inside
// the content area keep same-tab navigation, and marketing/lab links are
// unchanged. Every new-tab link carries the same screen-reader hint
// (components/new-tab-hint.tsx).
export const NEW_TAB_HINT = "새 탭에서 열림";

export const newTabProps = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

export function isContentHref(href: string): boolean {
  return /^\/content(?:[/?#]|$)/.test(href);
}

// currentPath: the page the link is rendered on. Inside /content the link
// stays in the same tab.
export function contentLinkProps(
  href: string,
  currentPath = "/",
): Partial<typeof newTabProps> {
  return isContentHref(href) && !isContentHref(currentPath) ? newTabProps : {};
}
