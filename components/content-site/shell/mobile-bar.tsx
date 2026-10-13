"use client";
/* 모바일 하단 바(<768, 서비스 페이지에서만. 768 이상은 CSS가 숨긴다).
 * #inquiry가 화면에 들어오거나 가상 키보드가 열리면(visualViewport 160px 기준) 숨긴다.
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
  const [inquiryVisible, setInquiryVisible] = useState(false);
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    setInquiryVisible(false);
    const target = document.getElementById("inquiry");
    if (!target || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setInquiryVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(target);
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
  const price = startingPrice(serviceId);
  const hidden = inquiryVisible || keyboard;
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
