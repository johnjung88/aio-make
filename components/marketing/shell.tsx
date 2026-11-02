"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { marketingIds, marketingNames } from "@/lib/marketing-renewal";
import { BUSINESS_INFO, BUSINESS_EMAIL } from "@/lib/business-info";
import { NewTabHint } from "@/components/new-tab-hint";

export function MarketingHeader({ brand }: { brand: React.ReactNode }) {
  const path = usePathname();
  const nav = useRef<HTMLElement>(null);
  const [end, setEnd] = useState(false);
  useEffect(() => {
    const el = nav.current;
    const current = el?.querySelector<HTMLElement>('[aria-current="page"]');
    if (el && current && el.scrollWidth > el.clientWidth)
      el.scrollLeft =
        current.offsetLeft -
        el.offsetLeft -
        (el.clientWidth - current.clientWidth) / 2;
    const update = () => {
      if (el) setEnd(el.scrollWidth - el.clientWidth - el.scrollLeft < 3);
    };
    update();
    const observer = new ResizeObserver(update);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [path]);
  const items = [
    ["홈", "/marketing"],
    ...marketingIds.map((id) => [
      marketingNames[id],
      `/marketing/services/${id}`,
    ]),
    ["제작 방향", "/marketing/work"],
    ["인사이트", "/marketing/insights"],
  ];
  return (
    <header className="mk-shell mk-header">
      <div className="mk-container mk-header-inner">
        <Link
          className="mk-lockup"
          href="/marketing"
          aria-label="AIO MAKE 마케팅 홈"
        >
          {brand}
          <span>MARKETING</span>
        </Link>
        <div className="mk-nav-wrap" data-end={end}>
          <nav
            ref={nav}
            onScroll={(e) =>
              setEnd(
                e.currentTarget.scrollWidth -
                  e.currentTarget.clientWidth -
                  e.currentTarget.scrollLeft <
                  3,
              )
            }
            aria-label="마케팅 전체 메뉴"
          >
            {items.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                aria-current={
                  (
                    href === "/marketing"
                      ? path === href
                      : path.startsWith(href)
                  )
                    ? "page"
                    : undefined
                }
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <Link className="mk-primary mk-header-cta" href="/marketing/contact">
          상담 신청 ↗
        </Link>
      </div>
    </header>
  );
}
export function MarketingFooter({ brand }: { brand: React.ReactNode }) {
  return (
    <footer className="mk-shell mk-footer">
      <div className="mk-container">
        <div className="mk-footer-grid">
          <div>
            <Link href="/marketing" className="mk-lockup">
              {brand}
              <span>MARKETING</span>
            </Link>
            <p>
              컨텐츠와 채널을 잇고
              <br />
              다음 운영의 방향을 정합니다
            </p>
          </div>
          <nav aria-label="마케팅 서비스">
            <p className="mk-eyebrow">SERVICES</p>
            {marketingIds.map((id) => (
              <Link key={id} href={`/marketing/services/${id}`}>
                {marketingNames[id]}
              </Link>
            ))}
          </nav>
          <div>
            <p className="mk-eyebrow">CONTACT</p>
            <Link href="/marketing/contact">상담 신청 ↗</Link>
            <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
            <Link href="/content" target="_blank" rel="noopener noreferrer">
              컨텐츠 제작 <NewTabHint />
            </Link>
            <Link href="/lab" target="_blank" rel="noopener noreferrer">
              웹사이트·개발 <NewTabHint />
            </Link>
          </div>
        </div>
        <div className="mk-footer-bottom">
          <div>
            {BUSINESS_INFO.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
          <div>
            <Link href="/privacy">개인정보처리방침</Link>
            <Link href="/terms">이용약관</Link>
            <Link href="/">AIO MAKE 홈 →</Link>
            <span>© 2026 AIO MAKE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
