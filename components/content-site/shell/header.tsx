"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Brand } from "@/components/site-shell";
import { CONTENT_SERVICES, contentServicePath } from "@/lib/content-site/types";
import "./header-v15.css";

const serviceLabels: Record<string, string> = {
  "ai-influencer": "AI 인플루언서",
  "brand-film": "브랜드 홍보영상",
  ad: "SNS 광고",
};

export function ContentSiteHeader() {
  const path = usePathname();
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    const container = nav.current;
    const current = container?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!container || !current || container.scrollWidth <= container.clientWidth) return;
    const viewport = container.getBoundingClientRect();
    const item = current.getBoundingClientRect();
    container.scrollTo({ left: container.scrollLeft + item.left - viewport.left - (viewport.width - item.width) / 2 });
  }, [path]);

  return <header className="cs-header cs-header-v15">
    <div className="cs-container cs-header-inner cs-header-v15-inner">
      <Link href="/content" className="cs-lockup cs-header-v15-lockup" aria-label="AIO MAKE 컨텐츠 홈">
        <span className="cs-brand"><Brand /></span>
        <span className="cs-lockup-divider" aria-hidden="true" />
        <span className="cs-lockup-label cs-t-lockup">CONTENT STUDIO</span>
      </Link>
      <nav ref={nav} className="cs-header-v15-nav" aria-label="컨텐츠 전체 메뉴">
        <ul>
          <li><Link href="/content" className="cs-nav-link" aria-current={path === "/content" ? "page" : undefined}>홈</Link></li>
          {CONTENT_SERVICES.map((service) => <li key={service.id}>
            <Link href={contentServicePath(service.id)} className="cs-nav-link" aria-current={path.startsWith(contentServicePath(service.id)) ? "page" : undefined}>
              {serviceLabels[service.id] ?? service.label}
            </Link>
          </li>)}
          <li><Link href="/content/insights" className="cs-nav-link" aria-current={path.startsWith("/content/insights") ? "page" : undefined}>인사이트</Link></li>
          <li><Link href="/content/references" className="cs-nav-link" aria-current={path.startsWith("/content/references") ? "page" : undefined}>레퍼런스</Link></li>
        </ul>
      </nav>
      <Link href="/content/contact" className="cs-header-v15-cta" aria-current={path === "/content/contact" ? "page" : undefined}>상담 신청<span aria-hidden="true">↗</span></Link>
    </div>
  </header>;
}
