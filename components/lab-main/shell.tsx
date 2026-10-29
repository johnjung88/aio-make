"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/site-shell";
import { BUSINESS_INFO, BUSINESS_EMAIL } from "@/lib/business-info";
import {
  labServices,
  labServicePath,
  labContactPath,
} from "@/lib/lab-services";
import styles from "./shell.module.css";

export function LabHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const current = nav.current?.querySelector('[aria-current="page"]');
    if (current instanceof HTMLElement) {
      const parent = nav.current!;
      parent.scrollLeft =
        current.offsetLeft -
        parent.offsetLeft -
        (parent.clientWidth - current.clientWidth) / 2;
    }
  }, [path]);
  const service = labServices.find((s) => path === labServicePath(s.id));
  return (
    <header
      className={styles.header}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <div className={styles.headerInner}>
        <Link
          href="/lab"
          className={styles.lockup}
          aria-label="AIO MAKE 개발 홈"
          onClick={() => setOpen(false)}
        >
          <Brand />
          <span>DEVELOPMENT LAB</span>
        </Link>
        <nav ref={nav} className={styles.nav} aria-label="개발 전체 메뉴">
          <Link href="/lab" aria-current={path === "/lab" ? "page" : undefined}>
            홈
          </Link>
          {labServices.map((s) => (
            <Link
              key={s.id}
              href={labServicePath(s.id)}
              aria-current={service?.id === s.id ? "page" : undefined}
            >
              {s.name}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          <button
            ref={toggle}
            type="button"
            aria-label={open ? "다른 분야 메뉴 닫기" : "다른 분야 메뉴 열기"}
            aria-expanded={open}
            aria-controls="lab-divisions"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link className={styles.cta} href={labContactPath(service?.id)}>
            상담 신청 <ArrowUpRight size={16} />
          </Link>
        </div>
        {open && (
          <nav
            id="lab-divisions"
            className={styles.divisions}
            aria-label="AIO 다른 분야"
            onClick={() => setOpen(false)}
          >
            <Link href="/">AIO MAKE 홈</Link>
            <Link href="/content">콘텐츠 스튜디오</Link>
            <Link href="/marketing">마케팅</Link>
            <Link href="/lab#gallery">가상 샘플 갤러리</Link>
            <Link href="/lab#process">제작 과정</Link>
          </nav>
        )}
      </div>
    </header>
  );
}

export function LabFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div>
          <Link
            className={styles.lockup}
            href="/lab"
            aria-label="AIO MAKE 개발 홈"
          >
            <Brand />
            <span>DEVELOPMENT LAB</span>
          </Link>
          <p>
            웹사이트부터 쇼핑몰과 업무 자동화까지
            <br />
            생각한 기능을 작동하는 화면으로
          </p>
        </div>
        <nav aria-label="개발 서비스">
          <h2>SERVICES</h2>
          {labServices.map((s) => (
            <Link key={s.id} href={labServicePath(s.id)}>
              {s.name}
            </Link>
          ))}
        </nav>
        <nav aria-label="상담과 다른 분야">
          <h2>CONTACT</h2>
          <Link href={labContactPath()}>제작 상담</Link>
          <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
          <Link href="/">AIO MAKE 홈 ↗</Link>
          <Link href="/content">콘텐츠 스튜디오</Link>
          <Link href="/marketing">마케팅</Link>
        </nav>
      </div>
      <div className={styles.footerBottom}>
        <div>
          {BUSINESS_INFO.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <a href={`mailto:${BUSINESS_EMAIL}`}>이메일: {BUSINESS_EMAIL}</a>
        </div>
        <div>
          <Link href="/privacy">개인정보처리방침</Link>
          <Link href="/terms">이용약관</Link>
          <p>© 2026 AIO MAKE · All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}

export function LabMobileBar() {
  const path = usePathname();
  const service = labServices.find((s) => path === labServicePath(s.id));
  const [hidden, setHidden] = useState(true);
  const [keyboard, setKeyboard] = useState(false);
  useEffect(() => {
    const targets = document.querySelectorAll(
      "[data-hero-sample], [data-lab-inline-cta], #lab-inquiry",
    );
    const visible = new Set<Element>();
    let heroPassed = !document.querySelector("[data-hero-sample]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target.hasAttribute("data-hero-sample")) {
          heroPassed = e.boundingClientRect.bottom <= 0;
        }
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      });
      setHidden(!heroPassed || visible.size > 0);
    });
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [path]);
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const update = () =>
      setKeyboard(window.innerHeight - viewport.height > 160);
    viewport.addEventListener("resize", update);
    return () => viewport.removeEventListener("resize", update);
  }, []);
  if (!service) return null;
  return (
    <aside
      className={styles.mobileBar}
      data-hidden={hidden || keyboard}
      aria-label="개발 서비스 상담"
    >
      <span>{service.name}</span>
      <Link
        className={styles.cta}
        href={labContactPath(service.id)}
        tabIndex={hidden || keyboard ? -1 : undefined}
      >
        상담 신청 <ArrowUpRight size={16} />
      </Link>
    </aside>
  );
}
