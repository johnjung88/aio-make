"use client";
/* 컨텐츠 사이트 헤더. 왼쪽 로고 잠금(AIO MAKE | CONTENT STUDIO) → /content,
 * 가운데(≥1180) 서비스 6개, <1180은 '서비스' 버튼 → 시트(시작가 한 줄 포함), 오른쪽 움직임 토글 + 상담 신청.
 * 메인 사이트 링크는 헤더에 두지 않는다(푸터 'AIO MAKE 홈' 하나). */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Brand } from "@/components/site-shell";
import { startingPrice } from "@/lib/content-pricing";
import { CS_COPY } from "@/lib/content-site/copy";
import { csRoute } from "@/lib/content-site/theme-map";
import {
  CONTENT_SERVICES,
  contentServicePath,
} from "@/lib/content-site/types";
import { MotionToggle } from "./motion-toggle";

export function ContentSiteHeader() {
  const pathname = usePathname();
  const route = csRoute(pathname);
  const [open, setOpen] = useState(false);
  const sheetId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // 페이지가 바뀌면 시트를 닫는다.
  useEffect(() => setOpen(false), [pathname]);

  // 열릴 때 첫 링크로 포커스. Esc·바깥 클릭이면 닫고 버튼으로 포커스 복귀.
  useEffect(() => {
    if (!open) return;
    sheetRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const close = (returnFocus: boolean) => {
      setOpen(false);
      if (returnFocus) toggleRef.current?.focus();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  // 시트 안 화살표 키 이동(APG: 위·아래·Home·End)
  function onSheetKey(event: React.KeyboardEvent<HTMLDivElement>) {
    const links = [
      ...(sheetRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []),
    ];
    const at = links.indexOf(document.activeElement as HTMLAnchorElement);
    let next = -1;
    if (event.key === "ArrowDown") next = (at + 1) % links.length;
    else if (event.key === "ArrowUp")
      next = (at - 1 + links.length) % links.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = links.length - 1;
    if (next < 0) return;
    event.preventDefault();
    links[next]?.focus();
  }


  return (
    <header className="cs-header" ref={headerRef}>
      <div className="cs-container cs-header-inner">
        <Link
          href="/content"
          className="cs-lockup"
          aria-label={CS_COPY.header.homeLabel}
        >
          <span className="cs-brand">
            <Brand />
          </span>
          <span className="cs-lockup-divider" aria-hidden="true" />
          <span className="cs-lockup-label cs-t-eyebrow" aria-hidden="true">
            {CS_COPY.header.studio}
          </span>
        </Link>

        <nav className="cs-nav" aria-label={CS_COPY.header.navLabel}>
          <ul className="cs-nav-list">
            {CONTENT_SERVICES.map((s) => (
              <li key={s.id}>
                <Link
                  href={contentServicePath(s.id)}
                  className="cs-nav-link cs-t-nav"
                  aria-current={route.serviceId === s.id ? "page" : undefined}
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="cs-header-actions">
          <button
            type="button"
            ref={toggleRef}
            className="cs-sheet-toggle cs-t-nav"
            aria-expanded={open}
            aria-controls={sheetId}
            aria-label={
              open ? CS_COPY.header.sheetClose : CS_COPY.header.sheetOpen
            }
            onClick={() => setOpen((v) => !v)}
          >
            {CS_COPY.header.sheetButton}
            <span aria-hidden="true">{open ? "×" : "↓"}</span>
          </button>
          <MotionToggle />
          {route.page === "service" ? (
            <a
              href="#inquiry"
              className="cs-btn cs-btn--primary cs-btn--sm cs-header-cta"
            >
              {CS_COPY.header.cta}
            </a>
          ) : route.page === "home" ? (
            <Link
              href="/content/contact"
              className="cs-btn cs-btn--primary cs-btn--sm cs-header-cta"
            >
              {CS_COPY.header.cta}
            </Link>
          ) : null}
        </div>
      </div>

      <div
        id={sheetId}
        ref={sheetRef}
        className="cs-sheet"
        hidden={!open}
        onKeyDown={onSheetKey}
      >
        <nav className="cs-container" aria-label={CS_COPY.header.navLabel}>
          <ul className="cs-sheet-list">
            {CONTENT_SERVICES.map((s) => {
              const price = startingPrice(s.id);
              return (
                <li key={s.id}>
                  <Link
                    href={contentServicePath(s.id)}
                    className="cs-sheet-link"
                    aria-current={
                      route.serviceId === s.id ? "page" : undefined
                    }
                    onClick={() => setOpen(false)}
                  >
                    <span className="cs-t-h3">{s.label}</span>
                    {price ? (
                      <span className="cs-t-small">{price.line}</span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
