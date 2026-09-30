"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { divisions, divisionByPath } from "@/lib/content";
export function Brand() {
  return (
    <span className="brand">
      <b>AIO</b>
      <span>MAKE</span>
      <i aria-hidden="true" />
    </span>
  );
}
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = divisionByPath(pathname.split("/")[1]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" aria-label="AIO MAKE 홈" onClick={() => setOpen(false)}>
          <Brand />
        </Link>
        <nav className="desktop-nav" aria-label="주 메뉴">
          {divisions.map((d) => (
            <Link
              key={d.id}
              href={"/" + d.path}
              className={current?.id === d.id ? "active" : ""}
            >
              {d.label}
            </Link>
          ))}
          <Link href="/about">AIO 소개</Link>
        </nav>
        <Link
          className="header-cta"
          href={current ? "/" + current.path + "/contact" : "/contact"}
        >
          프로젝트 문의 <ArrowUpRight size={16} />
        </Link>
        <button
          className="menu-toggle"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="모바일 메뉴">
          {[
            ...divisions.map((d) => ({ href: "/" + d.path, label: d.label })),
            { href: "/about", label: "AIO 소개" },
            { href: "/contact", label: "프로젝트 문의" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </nav>
      )}
      {current && (
        <nav className="division-nav" aria-label={current.label + " 메뉴"}>
          <Link className="division-brand" href={"/" + current.path}>
            {current.brand}
          </Link>
          <Link href={"/" + current.path + "#services"}>서비스</Link>
          <Link href={"/" + current.path + "/work"}>레퍼런스</Link>
          <Link href={"/" + current.path + "/insights"}>인사이트</Link>
          <Link href={"/" + current.path + "/contact"}>문의</Link>
        </nav>
      )}
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link href="/">
          <Brand />
        </Link>
        <p>
          마케팅 · 개발 · 영상
          <br />
          필요한 일을, 하나의 방향으로.
        </p>
        <a href="mailto:aiomake2023@gmail.com">
          aiomake2023@gmail.com <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="footer-bottom">
        <p>
          에이아이오 (AIO) · 사업자등록번호 682-01-02748
          <br />
          통신판매업신고 제 2026-경기김포-3656 호 · 경기도 김포시 대곶면
          흥신로67
        </p>
        <div>
          <Link href="/privacy">개인정보처리방침</Link>
          <Link href="/terms">이용 안내</Link>
          <Link href="/admin/login">관리자</Link>
          <span>© {new Date().getFullYear()} AIO MAKE</span>
        </div>
      </div>
    </footer>
  );
}
