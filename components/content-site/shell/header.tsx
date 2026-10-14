"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Brand } from "@/components/site-shell";
import { CONTENT_SERVICES, contentServicePath } from "@/lib/content-site/types";

export function ContentSiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); button.current?.focus(); }
    };
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", key); document.removeEventListener("pointerdown", outside); };
  }, [open]);
  return <header className="cs-header" ref={root}>
    <div className="cs-container cs-header-inner">
      <Link href="/content" className="cs-lockup" aria-label="AIO MAKE 컨텐츠 홈">
        <span className="cs-brand"><Brand /></span>
        <span className="cs-lockup-divider" aria-hidden="true" />
        <span className="cs-lockup-label cs-t-lockup">CONTENT STUDIO</span>
      </Link>
      <nav className="cs-primary-nav" aria-label="컨텐츠 사이트">
        <Link href="/content" className="cs-nav-link cs-t-nav" aria-current={path === "/content" ? "page" : undefined}>홈</Link>
        <button ref={button} type="button" className="cs-nav-link cs-t-nav cs-services-disclosure" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>각 서비스 <span aria-hidden="true">{open ? "−" : "+"}</span></button>
        <Link href="/content/insights" className="cs-nav-link cs-t-nav" aria-current={path.startsWith("/content/insights") ? "page" : undefined}>인사이트</Link>
        <Link href="/content/contact" className="cs-btn cs-btn--primary cs-btn--sm cs-header-cta">상담 신청</Link>
      </nav>
    </div>
    <div id={id} className="cs-sheet" hidden={!open}>
      <nav className="cs-container" aria-label="컨텐츠 서비스 6종">
        <ul className="cs-sheet-list">{CONTENT_SERVICES.map(service => <li key={service.id}>
          <Link href={contentServicePath(service.id)} className="cs-sheet-link" aria-current={path === contentServicePath(service.id) ? "page" : undefined} onClick={() => setOpen(false)}><span className="cs-t-h3">{service.label}</span><span aria-hidden="true">↗</span></Link>
        </li>)}</ul>
      </nav>
    </div>
  </header>;
}
