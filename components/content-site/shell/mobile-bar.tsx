"use client";
/* 모바일 하단 바(<768, 서비스 페이지에서만. 768 이상은 CSS가 숨긴다 — R7 사용자 확정: PC에는 두지 않는다).
 * 색·정렬(서비스 포인트색 22% 바탕, 서비스명·시작가·버튼 가운데 한 묶음)은 theme.css가 정한다.
 * 히어로 CTA 또는 #inquiry가 화면에 들어오거나 가상 키보드가 열리면(visualViewport 160px 기준) 숨긴다.
 * 숨김은 hidden 속성이 아니라 transform + visibility(data-hidden)로 해서 레이아웃 이동이 없다. */
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { startingPrice } from "@/lib/content-pricing";
import { CS_COPY } from "@/lib/content-site/copy";
import { csRoute } from "@/lib/content-site/theme-map";
import { CONTENT_SERVICES } from "@/lib/content-site/types";

export function ContentMobileBar() {
  const pathname = usePathname();
  const { serviceId } = csRoute(pathname);
  const [inlineVisible, setInlineVisible] = useState(true);
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setInlineVisible(false);
      return;
    }
    const targets = Array.from(document.querySelectorAll(".cs-hero-actions, #inquiry"));
    const visible = new Set<Element>();
    targets.forEach(target => {
      const rect = target.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) visible.add(target);
    });
    setInlineVisible(visible.size > 0);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
      setInlineVisible(visible.size > 0);
    }, { threshold:0 });
    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const change = () =>
      setKeyboard(window.innerHeight - viewport.height > 160);
    viewport.addEventListener("resize", change);
    return () => viewport.removeEventListener("resize", change);
  }, []);

  if (!serviceId) return null;
  const service = CONTENT_SERVICES.find((s) => s.id === serviceId);
  // 사용자 10/30: 웹툰 외 5개 서비스는 하단 바에 시작가를 띄우지 않는다(가격은 #pricing 절에)
  const price = serviceId === "webtoon" ? startingPrice(serviceId) : null;
  const hidden = inlineVisible || keyboard;
  return (
    <aside
      className="cs-mbar"
      aria-label={CS_COPY.mobileBar.label}
      data-hidden={hidden ? "true" : "false"}
    >
      <p className="cs-mbar-text">
        <span className="cs-t-caption">{service?.label}</span>
        {price ? <span className="cs-t-price-sm">{price.head}</span> : null}
      </p>
      <a
        href="#inquiry"
        className="cs-btn cs-btn--primary cs-btn--sm"
        tabIndex={hidden ? -1 : undefined}
      >
        {CS_COPY.mobileBar.cta}
      </a>
    </aside>
  );
}
