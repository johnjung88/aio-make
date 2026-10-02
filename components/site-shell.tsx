"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
export function Brand() {
  return (
    <span className="brand guide-brand">
      <b>AIO</b>
      <span>MAKE</span>
      <i aria-hidden="true" />
    </span>
  );
}
const links = [
  ["컨텐츠", "/video"],
  ["마케팅", "/marketing"],
  ["개발", "/lab"],
  ["작업 보기", "/work"],
];
export function Header() {
  const path = usePathname(),
    [open, setOpen] = useState(false),
    [about, setAbout] = useState(false);
  const menu = useRef<HTMLButtonElement>(null);
  return (
    <header
      className="guide-header"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          setAbout(false);
          menu.current?.focus();
        }
      }}
    >
      <div className="guide-header-inner">
        <Link href="/" aria-label="AIO MAKE 홈" onClick={() => setOpen(false)}>
          <Brand />
        </Link>
        <button
          ref={menu}
          className="guide-mobile-toggle"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls="guide-main-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        <nav
          className={"guide-main-nav" + (open ? " is-open" : "")}
          id="guide-main-nav"
          aria-label="주 메뉴"
        >
          <div
            className="guide-about-menu"
            onMouseEnter={() => setAbout(true)}
            onMouseLeave={() => setAbout(false)}
          >
            <button
              aria-expanded={about}
              aria-controls="guide-about-links"
              className={path.startsWith("/about") ? "is-current" : ""}
              onClick={(event) =>
                setAbout(
                  event.detail && matchMedia("(hover:hover)").matches
                    ? true
                    : !about,
                )
              }
            >
              AIO 소개 <ChevronDown size={11} />
            </button>
            {about && (
              <div id="guide-about-links">
                <Link
                  href="/about"
                  onClick={() => {
                    setOpen(false);
                    setAbout(false);
                  }}
                >
                  회사소개
                </Link>
                <Link
                  href="/about/team"
                  onClick={() => {
                    setOpen(false);
                    setAbout(false);
                  }}
                >
                  일하는 방식
                </Link>
              </div>
            )}
          </div>
          {links.map(([label, href]) => (
            <Link
              key={label}
              className={
                path === href ||
                (href !== "/work" && path.startsWith(href + "/"))
                  ? "is-current"
                  : ""
              }
              href={href}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            className="guide-header-cta"
            href={
              path.startsWith("/marketing")
                ? "/marketing/contact"
                : path.startsWith("/video")
                  ? "/video/contact"
                  : path.startsWith("/lab")
                    ? "/lab/contact"
                    : "/contact"
            }
            onClick={() => setOpen(false)}
          >
            문의하기
          </Link>
        </nav>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="guide-footer">
      <div className="guide-footer-inner">
        <div className="guide-footer-top">
          <Link href="/" aria-label="AIO MAKE 홈">
            <Brand />
          </Link>
          <nav aria-label="하단 메뉴">
            {[
              ["회사소개", "/about"],
              ["일하는 방식", "/about/team"],
              ["컨텐츠", "/video"],
              ["마케팅", "/marketing"],
              ["개발", "/lab"],
              ["개인정보처리방침", "/privacy"],
              ["이용약관", "/terms"],
            ].map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="guide-business-info">
          <span>사업자명: 에이아이오 (AIO) | 사업자번호: 682-01-02748</span>
          <span>통신판매업신고: 제 2026-경기김포-3656 호</span>
          <span>주소: 경기도 김포시 대곶면 흥신로67</span>
          <a href="mailto:AIOMAKE2023@GMAIL.COM">
            이메일: AIOMAKE2023@GMAIL.COM
          </a>
          <span className="guide-copyright">
            © 2026 AIO MAKE · All rights reserved
          </span>
        </div>
      </div>
    </footer>
  );
}
