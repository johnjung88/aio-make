"use client";
/* [data-reveal] 요소를 한 번 나타나게 한다. 루트에 data-js가 붙은 뒤에만 CSS가 숨기므로
 * JS가 없으면 처음부터 보이고, reduced-motion이면 CSS가 숨기지 않는다. 렌더 출력은 없다. */
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function CsReveal() {
  const pathname = usePathname();
  useEffect(() => {
    const items = [
      ...document.querySelectorAll<HTMLElement>(
        ".cs-site [data-reveal]:not([data-revealed])",
      ),
    ];
    if (items.length === 0) return;
    if (typeof IntersectionObserver === "undefined") {
      items.forEach((el) => el.setAttribute("data-revealed", ""));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
