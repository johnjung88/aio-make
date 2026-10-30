import Image from "next/image";
import Link from "next/link";
import { DivisionFaq } from "@/components/division-faq";
import {
  ClipboardList,
  PanelsTopLeft,
  ScanLine,
  PackageCheck,
} from "lucide-react";
import {
  labServices,
  labServicePath,
  labContactPath,
} from "@/lib/lab-services";
import { SectionHead } from "./service-detail";
import { DeviceVisual } from "./renewal-visual";
import { HomeScene } from "./renewal-scene";
import { AutomationCardVisual } from "./automation-card-visual";
import styles from "./renewal.module.css";
const gallery = [
  [
    "clinic",
    "서리온결",
    "진료 안내와 예약 문의",
    "진료 안내 · 시설 소개 · 상담 분기",
  ],
  [
    "space",
    "여백결",
    "빛과 재료를 담은 공간 소개",
    "공간 탐색 · 층별 보기 · 상담 요약",
  ],
  [
    "stay",
    "활판재",
    "객실과 시설을 둘러보는 숙소 안내",
    "객실 비교 · 시설 안내 · 예약 문의",
  ],
  [
    "food",
    "모그레빗",
    "메뉴 소개와 주문 안내",
    "메뉴 탐색 · 매장 안내 · 방문 문의",
  ],
];
const steps = [
  [
    "목적과 범위",
    "사업과 방문자의 목적, 필요한 자료를 정리합니다",
    "페이지·기능 목록",
    ClipboardList,
  ],
  [
    "화면과 원형",
    "자료와 카피를 담은 화면을 먼저 확인합니다",
    "시안과 원형",
    PanelsTopLeft,
  ],
  [
    "구현과 검수",
    "PC·모바일에서 정상·실패 흐름을 확인합니다",
    "검수 결과",
    ScanLine,
  ],
  [
    "운영 인계",
    "사용 방법과 운영 정보를 정리해 전달합니다",
    "인계 문서",
    PackageCheck,
  ],
] as const;
export function LabMain() {
  return (
    <main className={styles.page}>
      <section className={`${styles.hero} ${styles.homeHero}`}>
        <div className={styles.homeHeroCopy}>
          <p className={styles.eyebrow}>AIO MAKE DEVELOPMENT LAB</p>
          <h1>
            생각한 기능이
            <br />
            <em>작동하는 화면으로</em>
          </h1>
          <p className={styles.lead}>
            웹사이트부터 쇼핑몰과 업무 자동화까지
            <br />
            사업에 필요한 화면과 흐름을 만듭니다
          </p>
          <div className={styles.actions}>
            <a className={styles.button} href="#services">
              서비스 살펴보기 ↓
            </a>
            <Link className={styles.secondary} href={labContactPath()}>
              제작 상담 ↗
            </Link>
          </div>
        </div>
        <HomeScene />
      </section>
      <section className={styles.section} id="services">
        <SectionHead
          id="services-title"
          eyebrow="WHAT WE BUILD"
          title={"직접 써보는\n세 가지 결과물"}
          lead="필요한 서비스를 고르면 구성과 작동 방식을 자세히 볼 수 있습니다"
        />
        <div className={`${styles.cards} ${styles.homeCards}`}>
          {labServices
            .filter((s) => s.id !== "program")
            .map((s, i) => (
              <article className={styles.card} key={s.id}>
                <Link href={labServicePath(s.id)}>
                  <div className={styles.visual}>
                    {s.id === "automation" ? (
                      <AutomationCardVisual />
                    ) : (
                      <Image
                        src={
                          s.id === "website"
                            ? "/lab-renewal/card-website.webp"
                            : `/lab-renewal/card-${s.id}.webp`
                        }
                        width={1200}
                        height={750}
                        sizes="(max-width: 600px) 90vw, 30vw"
                        alt={`${s.name} 작동 화면 전체 예시`}
                        loading="lazy"
                      />
                    )}
                  </div>
                  <p className={styles.eyebrow}>0{i + 1}</p>
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                  <span className={styles.cardLink}>
                    {s.name} 자세히 보기 →
                  </span>
                </Link>
              </article>
            ))}
        </div>
        <div className={styles.signatureConsult}>
          <Link className={styles.secondary} href={labServicePath("program")}>
            프로그램 개발 살펴보기 →
          </Link>
        </div>
      </section>
      <section className={styles.section} id="gallery">
        <SectionHead
          id="gallery-title"
          eyebrow="DESIGN FOR YOUR BUSINESS"
          title={"다른 업종에도\n어울리는 화면"}
          lead="가상 브랜드로 만든 제작 방향 예시입니다"
        />
        <div className={styles.homeGallery}>
          {gallery.map(([name, title, body, features]) => (
            <article className={styles.card} key={name}>
              <DeviceVisual name={name} />
              <h3>{title}</h3>
              <p>
                {body}
                {name === "clinic" ? " · AI 생성 인물 포함" : ""}
              </p>
              <details className={styles.galleryDetail}>
                <summary>이 업종에 맞는 기능</summary>
                <p>{features}</p>
                <Link
                  className={styles.cardLink}
                  href={labContactPath(
                    "website",
                    `관심 업종: ${title}\n관심 기능: ${features}`,
                  )}
                >
                  이 구성으로 상담하기 ↗
                </Link>
              </details>
            </article>
          ))}
        </div>
      </section>
      <div className={styles.centerAction}>
        <Link className={styles.secondary} href="/lab/references">
          12개 업종별 웹사이트 샘플 보기 →
        </Link>
      </div>
      <section className={styles.section} id="process">
        <SectionHead
          id="process-title"
          eyebrow="PROCESS"
          title={"확인하며\n함께 만드는 과정"}
          lead="화면을 확인하고 직접 써본 뒤 다음 단계로 갑니다"
        />
        <div className={styles.steps}>
          {steps.map(([title, body, chip, Icon], i) => (
            <article key={title}>
              <Icon aria-hidden="true" />
              <p className={styles.eyebrow}>0{i + 1}</p>
              <h3>{title}</h3>
              <p>{body}</p>
              <span className={styles.chip}>확인할 것 · {chip}</span>
            </article>
          ))}
        </div>
      </section>
      <DivisionFaq division="lab" />
      <section
        className={`${styles.section} ${styles.inquiry}`}
        id="lab-inquiry"
      >
        <p className={styles.eyebrow}>LET’S MAKE IT WORK</p>
        <h2>
          지금 필요한 기능부터
          <br />
          <em>함께 정해요</em>
        </h2>
        <p>
          사업 소개와 지금 쓰는 도구를 알려주세요
          <br />
          화면과 업무 흐름에 맞는 범위를 안내합니다
        </p>
        <Link className={styles.button} href={labContactPath()}>
          제작 상담하기 ↗
        </Link>
      </section>
    </main>
  );
}
