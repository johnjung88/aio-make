"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { ArchitectureSample } from "./architecture";
import { FashionSample } from "./fashion";
import { LeadsSample } from "./leads";
import { SampleDialog } from "./dialog";
import styles from "./samples.module.css";

type Mode = "architecture" | "fashion" | "leads";
const MODES: { id: Mode; title: string; number: string }[] = [
  { id: "architecture", title: "건축 웹사이트", number: "01" },
  { id: "fashion", title: "패션 쇼핑몰", number: "02" },
  { id: "leads", title: "영업 리드 자동화", number: "03" },
];

export function CaseShowroom() {
  const [mode, setMode] = useState<Mode>("architecture");
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sync = () => {
      const id = location.hash.slice(1);
      if (MODES.some((m) => m.id === id)) setMode(id as Mode);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    const active = host.current?.querySelector(`[data-case="${mode}"]`);
    if (!active || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const context = gsap.context(() => {
      gsap.fromTo(
        active.querySelectorAll("[data-reveal]"),
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.07,
          ease: "power2.out",
          clearProps: "transform,opacity",
        },
      );
    }, host);
    return () => context.revert();
  }, [mode]);
  const choose = (next: Mode) => {
    setMode(next);
    history.replaceState(null, "", `#${next}`);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const consult = (text: string) => {
    setCopied(false);
    setSummary(text);
  };
  return (
    <div className={styles.shell} ref={host}>
      <header className={styles.reviewBar}>
        <Link href="/lab" className={styles.aioBrand}>
          aio<span>make</span>
          <small>DEVELOPMENT SHOWROOM</small>
        </Link>
        <nav aria-label="작동 샘플 선택" className={styles.caseNav}>
          {MODES.map((m) => (
            <button
              type="button"
              key={m.id}
              onClick={() => choose(m.id)}
              aria-pressed={mode === m.id}
            >
              <small>{m.number}</small>
              {m.title}
            </button>
          ))}
        </nav>
        <span className={styles.reviewStatus}>
          <i />
          검토용 샘플
        </span>
      </header>
      <main>
        <section data-case="architecture" hidden={mode !== "architecture"}>
          <ArchitectureSample
            onConsult={consult}
            active={mode === "architecture"}
          />
        </section>
        <section data-case="fashion" hidden={mode !== "fashion"}>
          <FashionSample onConsult={consult} />
        </section>
        <section data-case="leads" hidden={mode !== "leads"}>
          <LeadsSample onConsult={consult} />
        </section>
      </main>
      <footer className={styles.reviewFooter}>
        <span>One system, made tangible</span>
        <p>업종별 화면과 기능을 직접 체험하는 가상 사례입니다</p>
        <Link href="/lab">
          기존 개발 페이지 <ArrowUpRight size={15} />
        </Link>
      </footer>
      <SampleDialog
        open={Boolean(summary)}
        title="선택한 구성으로 상담 준비"
        onClose={() => setSummary("")}
      >
        <div className={styles.summaryBody}>
          <span className={styles.eyebrow}>YOUR PROJECT BRIEF</span>
          <h2>
            방금 살펴본 구성을
            <br />내 프로젝트의 출발점으로
          </h2>
          <pre>{summary}</pre>
          <p className={styles.finePrint}>
            이 샘플에서는 상담을 저장하거나 외부로 전송하지 않습니다
          </p>
          <button
            type="button"
            className={styles.darkButton}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(summary);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            {copied ? <Check size={17} /> : <Copy size={17} />}
            {copied ? "선택 내용 복사됨" : "선택 내용 복사"}
          </button>
        </div>
      </SampleDialog>
    </div>
  );
}
