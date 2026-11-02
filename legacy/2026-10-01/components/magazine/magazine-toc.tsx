import Link from "next/link";
import { MagazineEyebrow } from "./magazine-eyebrow";

interface Props {
  locale: string;
}

type Discipline = {
  num: string;
  name: string;
  nameEn: string;
  tagline: string;
  sub: string;
  priceMan?: string;       // 만 자리 (예: "9", "4")
  priceCheon?: string;     // 천 자리 — 없으면 빈 문자열
  priceText?: string;      // 숫자 대신 표기 (예: "프로젝트 견적")
  days?: string;
  href?: (locale: string) => string;
  available: boolean;
};

const disciplines: Discipline[] = [
  {
    num: "01",
    name: "개발",
    nameEn: "development",
    tagline: "기능을 짓는 분야",
    sub: "웹사이트 · 쇼핑몰 · 자동화 · 프로그램",
    priceMan: "9",
    priceCheon: "9",
    days: "1-7 DAYS",
    href: (locale: string) => `/${locale}/services/development`,
    available: true,
  },
  {
    num: "02",
    name: "디자인",
    nameEn: "design",
    tagline: "감각을 입히는 분야",
    sub: "로고·명함 · 상세페이지 · PPT",
    priceMan: "4",
    priceCheon: "9",
    days: "1-5 DAYS",
    href: (locale: string) => `/${locale}/services/design`,
    available: true,
  },
  {
    num: "03",
    name: "영상",
    nameEn: "video",
    tagline: "장면을 담는 분야",
    sub: "브랜드 · SNS · 마케팅 · 유튜브 편집",
    priceText: "프로젝트 견적",
    days: "3-7 DAYS",
    href: (locale: string) => `/${locale}/services/video`,
    available: true,
  },
  {
    num: "04",
    name: "마케팅",
    nameEn: "marketing",
    tagline: "고객을 부르는 분야",
    sub: "블로그 · SNS · 영상채널 운영대행",
    priceText: "월 운영",
    days: "MONTHLY",
    href: (locale: string) => `/${locale}/services/marketing`,
    available: true,
  },
];

export function MagazineToc({ locale }: Props) {
  return (
    <section
      id="toc"
      className="max-w-[1280px] mx-auto relative text-center scroll-mt-24"
      style={{
        padding: "var(--space-section) var(--space-edge)",
      }}
    >
      {/* Eyebrow */}
      <MagazineEyebrow className="mb-4 md:mb-6">Index · 04 Categories</MagazineEyebrow>

      {/* H2 — 토큰 기반 */}
      <h2
        className="font-normal mx-auto mb-5 md:mb-7 max-w-[1100px]"
        style={{
          fontFamily: "var(--font-marcellus)",
          fontSize: "var(--text-h1)",
          lineHeight: "var(--leading-display)",
          letterSpacing: "-0.014em",
          color: "var(--tone-magazine-ink)",
        }}
      >
        네 분야의
        <br />
        <em style={{ fontFamily: "var(--font-fraunces)", fontStyle: "normal", fontWeight: 500 }}>
          전문가들
        </em>
      </h2>

      {/* Lede — H2 보완 한 줄 */}
      <p
        className="mx-auto mb-10 md:mb-16"
        style={{
          fontFamily: "var(--font-pretendard)",
          fontSize: "var(--text-lead)",
          lineHeight: 1.8,
          color: "var(--tone-magazine-ink-2)",
          maxWidth: "42ch",
          fontWeight: 400,
        }}
      >
        각 <strong style={{ color: "var(--tone-magazine-ink)", fontWeight: 600 }}>분야 페이지</strong>에서
        <br />
        그 <strong style={{ color: "var(--tone-magazine-ink)", fontWeight: 600 }}>분야 전문가</strong>가 직접 소개해드립니다
      </p>

      {/* Rows */}
      <div
        style={{
          borderTop: "1px solid var(--tone-magazine-ink)",
          borderBottom: "1px solid var(--tone-magazine-ink)",
        }}
      >
        {disciplines.map((d, idx) => {
          const isLast = idx === disciplines.length - 1;
          const inkActive = d.available
            ? "var(--tone-magazine-ink)"
            : "var(--tone-magazine-ink-faint)";
          const inkSubActive = d.available
            ? "var(--tone-magazine-ink-2)"
            : "var(--tone-magazine-ink-faint)";

          const rowStyle: React.CSSProperties = {
            borderBottom: isLast
              ? "none"
              : "1px solid var(--tone-magazine-line-2)",
            color: inkActive,
            textDecoration: "none",
            transition: "background 0.4s cubic-bezier(0.4,0,0.2,1)",
          };

          const inner = (
            <div
              className="
                grid items-center gap-y-2 md:gap-y-3 gap-x-3 md:gap-x-4
                grid-cols-[24px_1fr]
                md:grid-cols-[56px_minmax(220px,auto)_1fr_minmax(200px,auto)_40px]
                px-3 md:px-6 py-3.5 md:py-8
              "
            >
              {/* Number */}
              <span
                className="text-center md:text-left"
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "clamp(12px, 1vw, 13px)",
                  color: inkSubActive,
                  letterSpacing: "0.06em",
                  alignSelf: "start",
                  paddingTop: 4,
                }}
              >
                {d.num}
              </span>

              {/* Name (Korean + English italic) */}
              <div className="text-center md:text-left">
                <div
                  className="inline-flex items-baseline gap-2 md:gap-4 flex-wrap justify-center md:justify-start"
                  style={{
                    fontFamily: "var(--font-marcellus)",
                    fontSize: "var(--text-h2)",
                    lineHeight: "var(--leading-display)",
                    letterSpacing: "-0.012em",
                    color: inkActive,
                  }}
                >
                  {d.name}
                  <em
                    style={{
                      fontFamily: "var(--font-fraunces)",
                      fontStyle: "normal",
                      color: inkSubActive,
                      fontWeight: 500,
                      fontSize: "0.5em",
                      letterSpacing: 0,
                    }}
                  >
                    {d.nameEn}
                  </em>
                  {/* 모바일 인라인 화살표 */}
                  <span
                    className="md:hidden"
                    style={{
                      fontFamily: "var(--font-marcellus)",
                      fontSize: "0.55em",
                      color: inkSubActive,
                      lineHeight: 1,
                      marginLeft: 4,
                    }}
                  >
                    {d.available ? "→" : "·"}
                  </span>
                </div>
              </div>

              {/* Tagline + sub-services — full width on mobile (col-span-3), center column on PC */}
              <div className="col-span-2 md:col-span-1 text-center px-1 md:px-2">
                <p
                  style={{
                    fontFamily: "var(--font-fraunces)",
                    fontSize: "var(--text-lead)",
                    lineHeight: 1.55,
                    color: inkSubActive,
                    fontStyle: "normal",
                    margin: 0,
                  }}
                >
                  {d.tagline}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-pretendard)",
                    fontSize: "var(--text-small)",
                    lineHeight: 1.55,
                    color: d.available ? "var(--tone-magazine-ink-3)" : "var(--tone-magazine-ink-faint)",
                    margin: "4px 0 0",
                    fontWeight: 400,
                  }}
                >
                  {d.sub}
                </p>
              </div>

              {/* Meta (price + days) — full width row on mobile, right column on PC */}
              <div className="col-span-2 md:col-span-1 flex items-baseline justify-center md:justify-end gap-2.5 md:gap-4">
                {d.available && (d.priceMan || d.priceText) ? (
                  <>
                    <span
                      style={{
                        fontFamily: "var(--font-pretendard)",
                        fontSize: "clamp(15px, 1.4vw, 17px)",
                        color: "var(--tone-magazine-ink)",
                        letterSpacing: "-0.01em",
                        lineHeight: 1,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {d.priceText ? (
                        <span style={{ fontFamily: "var(--font-marcellus)", fontSize: "1.05em", fontWeight: 400, letterSpacing: "0.01em" }}>
                          {d.priceText}
                        </span>
                      ) : (
                        <>
                          <span style={{ fontFamily: "var(--font-marcellus)", fontSize: "1.35em", fontWeight: 400 }}>
                            {d.priceMan}
                          </span>
                          <span style={{ fontSize: "0.85em", marginLeft: 2 }}>만</span>
                          {d.priceCheon && (
                            <>
                              {" "}
                              <span style={{ fontFamily: "var(--font-marcellus)", fontSize: "1.35em", fontWeight: 400 }}>
                                {d.priceCheon}
                              </span>
                              <span style={{ fontSize: "0.85em", marginLeft: 2 }}>천</span>
                            </>
                          )}
                          <span style={{ fontSize: "0.85em", marginLeft: 2, color: "var(--tone-magazine-ink-2)" }}>원~</span>
                        </>
                      )}
                    </span>
                    <span
                      style={{
                        color: "var(--tone-magazine-ink-faint)",
                        fontSize: "clamp(11px, 1vw, 13px)",
                      }}
                    >
                      ·
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-jetbrains)",
                        fontSize: "clamp(11.5px, 1vw, 12px)",
                        color: "var(--tone-magazine-ink-2)",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                      }}
                    >
                      {d.days}
                    </span>
                  </>
                ) : (
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains)",
                      fontSize: "clamp(10.5px, 1vw, 12px)",
                      color: "var(--tone-magazine-ink-faint)",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                    }}
                  >
                    Coming soon
                  </span>
                )}
              </div>

              {/* Arrow — last col on PC, top-right on mobile */}
              <span
                className="hidden md:inline text-right justify-self-end self-start md:self-center"
                style={{
                  fontFamily: "var(--font-marcellus)",
                  fontSize: "clamp(22px, 2vw, 30px)",
                  color: inkSubActive,
                  lineHeight: 1,
                  transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
                  paddingTop: 4,
                }}
              >
                {d.available ? "→" : "·"}
                 </span>
            </div>
          );

          if (d.available && d.href) {
            return (
              <Link
                key={d.num}
                href={d.href(locale)}
                style={rowStyle}
                className="block hover:bg-[var(--tone-magazine-paper-2)] [&:hover_span:last-child]:translate-x-2"
              >
                {inner}
              </Link>
            );
          }

          return (
            <div key={d.num} style={{ ...rowStyle, cursor: "default" }}>
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
