import Image from "next/image";
import Link from "next/link";
import {
  ClipboardList,
  PanelsTopLeft,
  ScanLine,
  PackageCheck,
} from "lucide-react";
import content from "@/lib/lab-renewal-content.json";
import { labServices, labServicePath } from "@/lib/lab-services";
import { contactSelection } from "@/lib/lab-renewal-engine";
import { CsSectionHead } from "@/components/content-site/ui/section-head";
import { RenewalSignature, ShopHero } from "./renewal-signature";
import { DeviceVisual } from "./renewal-visual";
import { LazySample } from "./renewal-sample";
import { OutputPreview } from "./output-preview";
import { ResultBoard } from "./result-board";
import { AutomationCardVisual } from "./automation-card-visual";
import styles from "./renewal.module.css";
type Id = keyof typeof content;
export function SectionHead({
  id,
  eyebrow,
  title,
  lead,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  const emphasis = title.split("\n").at(-1)?.split(" ").at(0);
  return (
    <div className={styles.head}>
      <CsSectionHead
        id={id}
        align="center"
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        emphasis={emphasis}
      />
    </div>
  );
}
const prices: Record<Id, [string, string, string][]> = {
  website: [
    ["1~9페이지", "10만 원", "사업과 서비스를 담은 기본 구성"],
    ["10~20페이지", "20만 원", "서비스별 상세 페이지까지"],
    ["21페이지 이상", "30만 원부터", "페이지와 기능 범위 별도 문의"],
  ],
  "shopping-mall": [
    ["단순 복사", "15만 원", "완성 템플릿 디자인 복사"],
    ["풀 세팅", "30만 원", "복사 + 기본 로고·배너 제작·적용"],
  ],
  automation: [
    [
      "입출력과 연결 서비스 기준",
      "맞춤 제작",
      "입력 엑셀·CSV·연결 서비스\n처리 정리·대조·조건 판단\n결과 파일·기록·알림",
    ],
  ],
  program: [
    [
      "기능과 역할 기준",
      "요청별 개별 견적",
      "사용자 사용할 사람과 역할\n기능 입력·조회·수정·처리\n환경 웹 또는 설치형 등 협의",
    ],
  ],
};
const outputs: Record<Id, [string, string, string][]> = {
  website: [
    ["stay", "활판재", "객실과 시설을 둘러보는 구성"],
    ["clinic", "서리온결", "진료 안내와 예약 문의 · AI 생성 인물 포함"],
    ["food", "모그레빗", "메뉴 소개와 주문 안내"],
  ],
  "shopping-mall": [
    ["logo", "기본 로고", "몰 머리와 파비콘에 맞춘 형태"],
    ["banner", "메인 배너", "PC와 모바일 크기"],
    ["check", "상품 상세", "상품 사진과 옵션이 이어지는 화면"],
  ],
  automation: [
    ["result", "결과 파일", "일치와 확인 필요를 나눈 시트"],
    ["error", "오류 내역", "어느 줄이 왜 멈췄는지"],
    ["guide", "운영 안내", "실행·재실행·수동 처리 순서"],
  ],
  program: [
    ["detail", "상세와 변경 내역", "누가 무엇을 바꿨는지"],
    ["permission", "권한 설정", "역할마다 다른 메뉴"],
    ["mobile", "모바일 담당자 화면", "배정된 일만 보기"],
  ],
};
const icons = [ClipboardList, PanelsTopLeft, ScanLine, PackageCheck];
export function LabServiceDetail({ id }: { id: string }) {
  const key = id as Id,
    data = content[key],
    service = labServices.find((s) => s.id === id)!;
  const slot = (name: string) =>
    data.slots[name as keyof typeof data.slots] as {
      eyebrow: string;
      title: string;
      lead: string;
      body: string;
    };
  const hero = slot("S1"),
    fit = slot("S1b")
      .body.split(/ · 0[123] /)
      .map((x) => x.replace(/^01 /, ""));
  const heading = (s: string) => {
    const h = slot(s);
    return (
      <SectionHead
        id={`${s}-title`}
        eyebrow={h.eyebrow}
        title={h.title}
        lead={h.lead}
      />
    );
  };
  const decision = (part: string) =>
    data.decision
      .find((row) => row[0].includes(part))?.[1]
      .replace(/\*\*/g, "")
      .replace(/\([^)]*D-\d+[^)]*\)/g, "") || "";
  const scope = [
    ["포함", decision("범위")],
    ["별도 협의", decision("별도")],
    ["준비하면 좋은 것", decision("준비물")],
  ];
  const segments = [
    ...slot("S5").body.matchAll(/0([1-4]) ([^"\[]+)"([^"]+)" \[([^\]]+)\]/g),
  ];
  return (
    <main className={styles.page} data-service={id}>
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{hero.eyebrow}</p>
            <h1>
              {hero.title.split("\n").map((line, i) => (
                <span key={line}>
                  {i > 0 ? "\n" : ""}
                  {i === 1 ? <em>{line}</em> : line}
                </span>
              ))}
            </h1>
            <p className={styles.lead}>{hero.lead}</p>
            <p className={styles.priceLine}>
              {id === "website"
                ? "1~9페이지 10만 원부터"
                : id === "shopping-mall"
                  ? "단순 복사 15만 원 · 풀 세팅 30만 원"
                  : id === "automation"
                    ? "맞춤 제작 · 입출력과 연결 서비스 기준"
                    : "요청별 개별 견적"}
            </p>
            <div className={styles.actions}>
              <Link
                className={styles.button}
                href={contactSelection(id, "hero")}
              >
                {service.name} 상담 ↗
              </Link>
              <a className={styles.secondary} href="#signature">
                {id === "website"
                  ? "페이지 구성해 보기"
                  : id === "shopping-mall"
                    ? "두 방법 비교해 보기"
                    : id === "automation"
                      ? "샘플 직접 실행하기"
                      : "역할별 화면 보기"}{" "}
                ↓
              </a>
            </div>
          </div>
          {id === "website" ? (
            <DeviceVisual name="space" hero />
          ) : id === "shopping-mall" ? (
            <div className={styles.shopHero}>
              <ShopHero />
            </div>
          ) : (
            <div className={`${styles.visual} ${styles.heroVisual}`}>
              <ResultBoard service={id} />
            </div>
          )}
        </div>
      </section>
      <aside className={styles.summaryStrip}>
        <ol className={styles.fits}>
          {fit.map((s, i) => (
            <li key={s}>
              <span>0{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
        <div className={styles.stripBottom}>
          <a href="#pricing">구성과 가격 보기 ↓</a>
        </div>
      </aside>
      <section
        className={styles.section}
        id="signature"
        aria-labelledby="S2-title"
      >
        {heading("S2")}
        <RenewalSignature service={id} />
      </section>
      <section
        className={styles.section}
        id="deliverables"
        aria-labelledby="S3-title"
      >
        {heading("S3")}
        <div className={styles.cards}>
          {outputs[key].map(([variant, title, body]) => (
            <article
              className={`${styles.card} ${styles.deliverableCard}`}
              key={variant}
            >
              {id === "website" ? (
                <DeviceVisual name={variant} />
              ) : id === "automation" || id === "program" ? (
                <OutputPreview variant={variant} />
              ) : variant === "check" ? (
                <div className={`${styles.visual} ${styles.productPreview}`}>
                  <div
                    className={styles.knitPhoto}
                    role="img"
                    aria-label="아이보리 니트 상품 단독 사진"
                  />
                  <div>
                    <small>모그레빗 · PRODUCT DETAIL</small>
                    <strong>아이보리 크루넥 니트</strong>
                    <span>색상 · Ivory</span>
                    <span>크기 · S / M / L</span>
                  </div>
                </div>
              ) : (
                <div className={styles.visual}>
                  <Image
                    src={`/lab-renewal/${id}-${variant}.webp`}
                    alt={`${title} 제작 방향 예시`}
                    width={1600}
                    height={1200}
                    loading="lazy"
                  />
                </div>
              )}
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        {id !== "website" && (
          <p className={styles.note}>가상 브랜드로 만든 제작 방향 예시입니다</p>
        )}
      </section>
      <section
        className={styles.section}
        id="pricing"
        aria-labelledby="S4-title"
      >
        {heading("S4")}
        <div className={styles.prices}>
          {prices[key].map(([label, price, body], i) => (
            <article
              className={`${styles.priceCard} ${prices[key].length === 1 ? styles.customPrice : ""}`}
              key={label}
            >
              <h3>{label}</h3>
              <strong>{price}</strong>
              {prices[key].length === 1 ? (
                <ul className={styles.priceRows}>
                  {body.split("\n").map((row) => (
                    <li key={row}>{row}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ whiteSpace: "pre-line" }}>{body}</p>
              )}
              <Link
                className={
                  prices[key].length > 1 && i !== 1
                    ? styles.secondary
                    : styles.button
                }
                href={contactSelection(
                  id,
                  "pricing",
                  id === "shopping-mall" ? (i ? "full" : "copy") : "",
                )}
              >
                이 구성으로 상담하기 ↗
              </Link>
            </article>
          ))}
        </div>
        <p className={styles.note}>
          {id === "website"
            ? "대시보드 +3만 원 · 기능 범위 사전 합의"
            : id === "shopping-mall"
              ? "풀 세팅 30만 원에 복사 15만 원을 더하지 않습니다\n템플릿 이용권 · 복사 가능 여부 · 모바일 지원을 먼저 확인합니다"
              : ""}
        </p>
        <div className={styles.scope}>
          {scope.map(([title, body]) => (
            <div key={title}>
              <h3>{title}</h3>
              <ul>
                {body.split(" / ").map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className={styles.note}>
          {decision("결과물")}
          <br />
          VAT 포함 여부와 납기·수정·지원 조건은 개별 견적에서 정합니다
        </p>
      </section>
      <section
        className={styles.section}
        id="process"
        aria-labelledby="S5-title"
      >
        {heading("S5")}
        <div className={styles.steps}>
          {segments.map((m, i) => {
            const Icon = icons[i];
            return (
              <article key={m[1]}>
                <Icon aria-hidden="true" />
                <p className={styles.eyebrow}>0{m[1]}</p>
                <h3>{m[2].trim()}</h3>
                <p>{m[3]}</p>
                <span className={styles.chip}>확인할 것 · {m[4]}</span>
              </article>
            );
          })}
        </div>
      </section>
      {id !== "program" && (
        <section
          className={styles.section}
          id="working-sample"
          aria-labelledby="S6-title"
        >
          {heading("S6")}
          <LazySample service={id} />
        </section>
      )}
      <section className={styles.section} id="faq" aria-labelledby="S7-title">
        {heading("S7")}
        <div className={styles.faq}>
          {data.faq.map(([q, a], i) => (
            <details key={q} id={`faq-${i + 1}`}>
              <summary>
                <h3>{q}</h3>
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
        <p className={styles.eyebrow}>CONTACT</p>
        <h2>{slot("S8").title}</h2>
        <p>{slot("S8").lead}</p>
        <Link className={styles.button} href={contactSelection(id, "inquiry")}>
          {service.name} 상담하기 ↗
        </Link>
        <p className={styles.note}>{slot("S8").body.match(/"([^"]+)"/)?.[1]}</p>
      </section>
      <section className={styles.section} aria-labelledby="related-title">
        <SectionHead
          id="related-title"
          eyebrow="OTHER SERVICES"
          title="다른 개발 서비스"
        />
        <div className={`${styles.cards} ${styles.relatedCards}`}>
          {labServices
            .filter((s) => s.id !== id)
            .map((s) => (
              <article key={s.id} className={styles.card}>
                <Link href={labServicePath(s.id)}>
                  <div className={styles.visual}>
                    {s.id === "automation" ? (
                      <AutomationCardVisual />
                    ) : (
                      <Image
                        src={
                          s.id === "website"
                            ? "/lab/clinic-pc.webp"
                            : `/lab-renewal/card-${s.id}.webp`
                        }
                        alt={`${s.name} 결과물 예시`}
                        width={1200}
                        height={900}
                        loading="lazy"
                      />
                    )}
                  </div>
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                  <span className={styles.cardLink}>서비스 보기 →</span>
                </Link>
              </article>
            ))}
        </div>
      </section>
    </main>
  );
}
