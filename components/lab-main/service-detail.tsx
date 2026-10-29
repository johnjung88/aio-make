import Image from "next/image";
import Link from "next/link";
import {
  labServices,
  labDetails,
  labServicePath,
  labContactPath,
} from "@/lib/lab-services";
import {
  developmentOffer,
  developmentQuoteTerms,
} from "@/lib/development-offers";
import { ServiceExperience } from "./service-experience";
import styles from "./service-detail.module.css";

const steps = [
  [
    "목적과 범위",
    "방문자와 담당자의 목적, 필요한 기능과 운영 조건을 함께 정리합니다",
  ],
  [
    "화면과 원형",
    "자료와 카피를 담은 시안을 확인하고 핵심 선택 흐름을 먼저 체험합니다",
  ],
  [
    "구현과 검수",
    "정상·실패 흐름과 PC·모바일 화면을 확인하고 합의한 범위에 맞게 수정합니다",
  ],
  [
    "운영 인계",
    "사용 방법과 결과 확인, 복구 조건과 남은 확인을 정리해 전달합니다",
  ],
];

export function LabServiceDetail({ id }: { id: string }) {
  const service = labServices.find((s) => s.id === id)!;
  const detail = labDetails[id];
  const offer = developmentOffer(id);
  return (
    <main className={styles.page} data-service={id}>
      <section className={styles.hero}>
        <nav aria-label="현재 위치" className={styles.breadcrumb}>
          <Link href="/lab">개발 홈</Link>
          <span>/</span>
          <span>{service.name}</span>
        </nav>
        <p className={styles.eyebrow}>{detail.eyebrow}</p>
        <h1>
          {detail.title.split("\n").map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p className={styles.lead}>{service.description}</p>
        <div className={styles.actions} data-lab-inline-cta>
          <a className={styles.button} href="#service-experience">
            작동 샘플 체험하기 ↓
          </a>
          <Link className={styles.secondary} href={labContactPath(id)}>
            {service.name} 상담 ↗
          </Link>
        </div>
        <div className={styles.heroVisual} aria-hidden="true">
          <span>
            {id === "website"
              ? "EXPLORE"
              : id === "shopping-mall"
                ? "SELECT"
                : id === "automation"
                  ? "CONNECT"
                  : "BUILD"}
          </span>
          <div />
          <div />
          <div />
        </div>
      </section>
      <section className={styles.section} id="service-experience">
        <div className={styles.heading}>
          <p className={styles.eyebrow}>01 / WORKING SAMPLE</p>
          <h2>
            {id === "website"
              ? "공간의 안쪽까지 직접 살펴보세요"
              : id === "shopping-mall"
                ? "스타일을 고르고 선택을 확인하세요"
                : "입력부터 결과까지 직접 확인하세요"}
          </h2>
          <p>
            가상 브랜드 기능 시연 · 실제 주문·결제·외부 발송은 이루어지지
            않습니다
          </p>
          {id === "program" && (
            <p>
              자동화 샘플을 재사용한 관리 화면 예시 · 로그인과 권한 기능은
              상담에서 협의합니다
            </p>
          )}
        </div>
        <ServiceExperience service={id} sample={detail.sample} />
      </section>
      <section className={styles.section}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>02 / SCOPE & FEATURES</p>
          <h2>필요한 기능부터 함께 정합니다</h2>
          <p>{service.audience}</p>
        </div>
        <div className={styles.cards}>
          {detail.features.map(([title, body], i) => (
            <article key={title}>
              <span className={styles.number}>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className={styles.scope}>
          <div>
            <h3>제공 범위</h3>
            <ul>
              {service.outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>상담 전 준비할 자료</h3>
            <ul>
              {service.inputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.price} id="pricing">
          <p className={styles.eyebrow}>PUBLIC OFFER</p>
          <h3>{offer.title}</h3>
          <p>{offer.summary}</p>
          {offer.lines.length > 0 && (
            <ul>
              {offer.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
          <p>{developmentQuoteTerms}</p>
          <a href="#lab-inquiry">이 범위로 상담하기 ↗</a>
        </div>
      </section>
      <section className={styles.section} id="process">
        <div className={styles.heading}>
          <p className={styles.eyebrow}>03 / STEP BY STEP</p>
          <h2>확인하며 만드는 과정</h2>
        </div>
        <div className={styles.steps}>
          {steps.map(([title, body], i) => (
            <article key={title}>
              <span className={styles.number}>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.section} id="gallery">
        <div className={styles.heading}>
          <p className={styles.eyebrow}>04 / CONCEPT GALLERY</p>
          <h2>관련 가상 샘플 갤러리</h2>
          <p>
            포트폴리오용 가상 브랜드 · 이미지 시안과 작동 샘플을 구분해
            안내합니다
          </p>
        </div>
        <div className={styles.gallery}>
          {detail.gallery.map(([src, title, body]) => (
            <article key={src}>
              <a href={src} aria-label={`${title} 이미지 크게 보기`}>
                <Image
                  src={src}
                  width={720}
                  height={900}
                  alt={`${title} 가상 샘플`}
                />
              </a>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>05 / FAQ</p>
          <h2>제작 전 궁금한 점</h2>
        </div>
        <div className={styles.faq}>
          {[
            ...detail.faq,
            [
              "가격과 납기는 어떻게 정하나요?",
              "위 공개 가격 안내와 준비된 자료, 필요한 기능을 기준으로 범위를 확인합니다 납기와 수정·지원 조건은 개별 견적에서 정합니다",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section
        className={`${styles.section} ${styles.inquiry}`}
        id="lab-inquiry"
      >
        <p className={styles.eyebrow}>LET’S MAKE IT WORK</p>
        <h2>
          지금, 당신의 아이디어를
          <br />
          작동하는 화면으로
        </h2>
        <p>필요한 기능과 준비한 자료를 남겨주세요</p>
        <Link className={styles.button} href={labContactPath(id)}>
          {service.name} 상담하기 ↗
        </Link>
      </section>
      <nav
        className={`${styles.section} ${styles.related}`}
        aria-label="다른 개발 서비스"
      >
        {labServices
          .filter((s) => s.id !== id)
          .map((s) => (
            <Link key={s.id} href={labServicePath(s.id)}>
              {s.name} ↗
            </Link>
          ))}
      </nav>
    </main>
  );
}
