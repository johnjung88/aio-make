"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArchitectureSample } from "@/components/lab-samples/architecture";
import { SampleDialog } from "@/components/lab-samples/dialog";
import sampleStyles from "@/components/lab-samples/samples.module.css";
import styles from "./lab-main.module.css";

const FashionSample = dynamic(
  () => import("@/components/lab-samples/fashion").then((m) => m.FashionSample),
  {
    loading: () => (
      <p className={styles.loading}>상품 체험을 준비하고 있습니다</p>
    ),
  },
);
const LeadsSample = dynamic(
  () => import("@/components/lab-samples/leads").then((m) => m.LeadsSample),
  {
    loading: () => (
      <p className={styles.loading}>업무 체험을 준비하고 있습니다</p>
    ),
  },
);

const services = [
  {
    id: "website",
    label: "웹사이트",
    industry: "architecture",
    context: "건축사무소 웹사이트 · 기능 시연",
    instruction: "건물을 돌려보고 층과 공간, 지어지는 과정을 살펴보세요",
  },
  {
    id: "shopping-mall",
    label: "쇼핑몰",
    industry: "fashion",
    context: "패션 쇼핑몰 · 구매 흐름 시연",
    instruction: "착용 컷을 보고 옵션을 골라 샘플 주문서까지 확인해보세요",
  },
  {
    id: "automation",
    label: "자동화",
    industry: "sales-leads",
    context: "영업 리드 자동화 · 업무 시연",
    instruction: "샘플을 실행하고 중복 대조부터 고객원장까지 확인해보세요",
  },
] as const;
type Service = (typeof services)[number]["id"];
const sections: {
  id: string;
  title: string;
  description: string;
  service?: Service;
}[] = [
  {
    id: "websites",
    title: "업종을 설명하는 웹사이트",
    description: "공간과 서비스를 살펴보는 기능을 건축 사례에서 체험하세요",
    service: "website",
  },
  {
    id: "shopping",
    title: "구매를 돕는 쇼핑몰",
    description:
      "상품을 이해하고 옵션을 고르는 흐름을 패션 사례에서 체험하세요",
    service: "shopping-mall",
  },
  {
    id: "workflows",
    title: "실제 업무 자동화",
    description: "입력과 처리 과정, 결과물을 영업 리드 사례에서 확인하세요",
    service: "automation",
  },
  {
    id: "evidence",
    title: "실제 사례와 운영 근거",
    description: "공개할 수 있는 작업 범위와 결과 근거를 연결할 자리입니다",
  },
  {
    id: "process",
    title: "제작과 운영 방식",
    description: "제공물과 검수, 인계 범위를 안내할 자리입니다",
  },
  {
    id: "your-business",
    title: "내 사업에 적용",
    description:
      "선택한 서비스와 업종을 바탕으로 필요한 제작 범위를 상담하세요",
  },
];

export function LabMain() {
  const [selected, setSelected] = useState<Service>("website");
  const [summary, setSummary] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const current = services.find((service) => service.id === selected)!;
  const contactHref = `/lab/contact?${new URLSearchParams({ service: selected, industry: current.industry, source: "lab" })}`;
  const consult = (value: string) => {
    setSummary(value);
    setCopyStatus("");
  };

  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#experience">
        체험으로 바로가기
      </a>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          AIO MAKE <span>개발</span>
        </Link>
        <nav aria-label="개발 서비스 탐색">
          <a href="#services">서비스</a>
          <a href="#experience">직접 체험</a>
          <Link href={contactHref}>제작 상담 ↗</Link>
        </nav>
      </header>
      <main>
        <section className={styles.intro} aria-labelledby="lab-title">
          <p className={styles.eyebrow}>WEBSITES, COMMERCE & OPERATIONS</p>
          <h1 id="lab-title">
            업종을 설명하는 웹사이트
            <br />
            구매와 운영을 잇는 시스템
          </h1>
          <p className={styles.lead}>
            웹사이트·쇼핑몰·자동화를 실제 사용 장면으로 보여드립니다
            <br />내 업종과 업무를 골라 필요한 기능을 확인해보세요
          </p>
        </section>
        <section
          id="experience"
          className={styles.experience}
          aria-label="서비스별 작동 체험"
        >
          <fieldset className={styles.selector}>
            <legend className={styles.srOnly}>체험할 서비스 선택</legend>
            {services.map((service, index) => (
              <label key={service.id}>
                <input
                  type="radio"
                  name="lab-service"
                  value={service.id}
                  checked={selected === service.id}
                  onChange={() => setSelected(service.id)}
                />
                <span>
                  <small>0{index + 1}</small>
                  {service.label}
                  <b aria-hidden="true">↗</b>
                </span>
              </label>
            ))}
          </fieldset>
          <div className={styles.context} aria-live="polite">
            <h2>{current.context}</h2>
            <p>{current.instruction}</p>
          </div>
          <div className={sampleStyles.shell}>
            {selected === "website" ? (
              <ArchitectureSample active onConsult={consult} />
            ) : selected === "shopping-mall" ? (
              <FashionSample onConsult={consult} />
            ) : (
              <LeadsSample onConsult={consult} />
            )}
          </div>
          <div className={styles.nextAction}>
            <p>
              가상 자료로 직접 조작하는 기능 시연입니다
              <br />
              <span>실제 주문·결제·외부 발송은 이루어지지 않습니다</span>
            </p>
            <Link className={styles.cta} href={contactHref}>
              이 사례로 제작 상담하기 <span aria-hidden="true">↗</span>
            </Link>
            <a
              href={`#${sections.find((section) => section.service === selected)?.id}`}
            >
              선택한 서비스 자세히 보기 ↓
            </a>
          </div>
        </section>
        <div id="services" className={styles.sections}>
          {sections.map((section, index) => (
            <section
              id={section.id}
              key={section.id}
              className={styles.section}
            >
              <span className={styles.number}>0{index + 2}</span>
              <div>
                <h2>{section.title}</h2>
                <p>{section.description}</p>
              </div>
              <a
                href="#experience"
                onClick={() => {
                  if (section.service) setSelected(section.service);
                }}
                aria-label={`${section.title} 관련 ${section.service ? services.find((service) => service.id === section.service)!.label : current.label} 체험으로 이동`}
              >
                체험으로 이동 ↗
              </a>
            </section>
          ))}
        </div>
      </main>
      <footer className={styles.footer}>
        <Link href="/">AIO MAKE</Link>
        <p>웹사이트에서 시작해 운영으로 이어지는 제작</p>
        <Link href={contactHref}>제작 상담 ↗</Link>
      </footer>
      <div className={`${sampleStyles.shell} ${styles.dialogHost}`}>
        <SampleDialog
          open={Boolean(summary)}
          title="선택한 구성으로 상담 준비"
          onClose={() => setSummary("")}
        >
          <div className={styles.summary}>
            <h2>체험에서 고른 구성</h2>
            <pre>{summary}</pre>
            <p>선택 내용을 복사해 문의에 함께 남겨주세요</p>
            <button
              type="button"
              className={styles.cta}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(summary);
                  setCopyStatus("선택 내용을 복사했습니다");
                } catch {
                  setCopyStatus(
                    "복사하지 못했습니다. 위 내용을 직접 선택해 복사해주세요",
                  );
                }
              }}
            >
              선택 내용 복사
            </button>
            <p role="status">{copyStatus}</p>
            <Link className={styles.cta} href={contactHref}>
              이 사례로 제작 상담하기 ↗
            </Link>
          </div>
        </SampleDialog>
      </div>
    </div>
  );
}
