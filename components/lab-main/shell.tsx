"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
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
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    const parent = nav.current;
    if (!parent) return;
    let disposed = false;
    const updateScrollHint = () => {
      parent.dataset.scrollEnd = String(
        parent.scrollLeft + parent.clientWidth >= parent.scrollWidth - 2,
      );
      parent.dataset.scrollStart = String(parent.scrollLeft <= 2);
    };
    const revealCurrent = () => {
      if (disposed) return;
      const current = parent.querySelector('[aria-current="page"]');
      if (!(current instanceof HTMLElement)) return;
      const bounds = parent.getBoundingClientRect();
      const item = current.getBoundingClientRect();
      const inset = parent.clientWidth < 600 ? 28 : 12;
      if (current === parent.querySelector("a")) parent.scrollLeft = 0;
      else if (item.left < bounds.left + inset)
        parent.scrollLeft += item.left - bounds.left - inset;
      else if (item.right > bounds.right - inset)
        parent.scrollLeft += item.right - bounds.right + inset;
      updateScrollHint();
    };
    revealCurrent();
    void document.fonts.ready.then(revealCurrent);
    const observer = new ResizeObserver(revealCurrent);
    observer.observe(parent);
    parent.addEventListener("scroll", updateScrollHint, { passive: true });
    return () => {
      disposed = true;
      observer.disconnect();
      parent.removeEventListener("scroll", updateScrollHint);
    };
  }, [path]);
  const service = labServices.find((s) => path === labServicePath(s.id));
  return (
    <div className={`cs-site ${styles.headerScope}`}>
      <header className="cs-header cs-header-v15">
        <div className="cs-container cs-header-inner cs-header-v15-inner">
          <Link
            href="/lab"
            className="cs-lockup cs-header-v15-lockup"
            aria-label="AIO MAKE 개발 홈"
          >
            <span className="cs-brand">
              <Brand />
            </span>
            <span className="cs-lockup-divider" aria-hidden="true" />
            <span className="cs-lockup-label cs-t-lockup">DEVELOPMENT LAB</span>
          </Link>
          <nav
            ref={nav}
            className="cs-header-v15-nav"
            aria-label="개발 전체 메뉴"
          >
            <ul>
              <li>
                <Link
                  className="cs-nav-link"
                  href="/lab"
                  aria-current={path === "/lab" ? "page" : undefined}
                >
                  홈
                </Link>
              </li>
              {labServices.map((s) => (
                <li key={s.id}>
                  <Link
                    className="cs-nav-link"
                    href={labServicePath(s.id)}
                    aria-current={service?.id === s.id ? "page" : undefined}
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  className="cs-nav-link"
                  href="/lab/insights"
                  aria-current={
                    path.startsWith("/lab/insights") ? "page" : undefined
                  }
                >
                  인사이트
                </Link>
              </li>
              <li>
                <Link
                  className="cs-nav-link"
                  href="/lab/references"
                  aria-current={path === "/lab/references" ? "page" : undefined}
                >
                  레퍼런스
                </Link>
              </li>
            </ul>
          </nav>
          <Link
            className="cs-header-v15-cta"
            href={labContactPath(service?.id)}
          >
            상담 신청 <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>
    </div>
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
            <span className={styles.brand}>
              <Brand />
            </span>
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
          <Link href="/lab/insights">인사이트</Link>
          <Link href="/lab/references">레퍼런스</Link>
        </nav>
        <nav aria-label="상담과 다른 분야">
          <h2>CONTACT</h2>
          <Link href={labContactPath()}>제작 상담</Link>
          <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
          <Link href="/">AIO MAKE 홈 ↗</Link>
          <Link href="/content">{"컨텐츠 스튜디오"}</Link>
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
