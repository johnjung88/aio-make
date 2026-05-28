import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { MagazineEyebrow } from "@/components/magazine/magazine-eyebrow";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const isKo = locale === "ko";
  return localizedPageMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: isKo
      ? "AIO에이전시의 제작 방식, 기술 스택, 응대·기획·제작·운영 역할을 확인하세요."
      : "Meet AIO Agency's production process, stack, and roles across reception, planning, production, and care.",
  });
}

const STACK = [
  "Next.js 15",
  "React 19",
  "TypeScript",
  "Tailwind CSS 4",
  "Supabase",
  "Vercel",
  "Python 3.12",
  "n8n",
  "React Native / Expo",
  "Remotion",
  "Resend",
  "shadcn/ui",
];

const TEAM_ROLES = [
  {
    num: "01",
    label: "No 01 · Reception",
    title: "응대",
    titleEm: "reception",
    body: "상담 · 견적 담당 — 1시간 안에 답하고 24시간 안에 견적을 보냅니다",
    metric: { label: "평균 응답", value: "23분" },
  },
  {
    num: "02",
    label: "No 02 · Planning",
    title: "기획",
    titleEm: "planning",
    body: "구조 · 카피 담당 — 각 분야 전문가가 의뢰의 첫 흐름부터 함께 잡습니다",
    metric: { label: "기획 컨퍼런스", value: "100%" },
  },
  {
    num: "03",
    label: "No 03 · Production",
    title: "제작",
    titleEm: "production",
    body: "디자인 · 개발 담당 — 5일 안에 손에 쥐어드리고 매일 진행을 공유합니다",
    metric: { label: "평균 납기", value: "4.6일" },
  },
  {
    num: "04",
    label: "No 04 · Care",
    title: "운영",
    titleEm: "care",
    body: "유지보수 담당 — 1개월 무상 A/S, 텔레그램으로 언제든 닿습니다",
    metric: { label: "재의뢰율", value: "98%" },
  },
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const isKo = locale === "ko";

  return (
    <div
      data-tone="magazine"
      style={{ background: "var(--tone-magazine-paper)" }}
      className="min-h-screen"
    >
      <section
        className="max-w-[1280px] mx-auto text-center relative"
        style={{
          padding: "clamp(56px,8vw,120px) clamp(16px,3vw,40px) clamp(64px,10vw,140px)",
        }}
      >
        {/* Cover meta */}
        <div
          className="pb-4 border-b mb-8 md:mb-14 inline-flex flex-wrap items-center gap-2.5 md:gap-[18px] justify-center"
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "clamp(9.5px, 0.9vw, 11px)",
            color: "var(--tone-magazine-ink-3)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            borderColor: "var(--tone-magazine-ink)",
          }}
        >
          <span>Issue 2026 · May</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--tone-magazine-ink-3)", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--font-marcellus)", letterSpacing: "0.4em", color: "var(--tone-magazine-ink)" }}>
            A&nbsp;·&nbsp;I&nbsp;·&nbsp;O&nbsp;&nbsp; S T U D I O
          </span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--tone-magazine-ink-3)", display: "inline-block" }} />
          <span>{isKo ? "회사 소개" : "About"}</span>
        </div>

        {/* Eyebrow */}
        <MagazineEyebrow className="mb-8">{isKo ? "About · The Studio" : "About · The Studio"}</MagazineEyebrow>

        {/* H1 */}
        <h1
          className="font-normal mx-auto mb-10 max-w-[1200px]"
          style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: "clamp(38px, 9vw, 132px)",
            lineHeight: 0.98,
            letterSpacing: "-0.014em",
            color: "var(--tone-magazine-ink)",
          }}
        >
          다른 손이,
          <br />
          <em
            style={{
              fontFamily: "var(--font-fraunces)",
              fontStyle: "normal",
              color: "var(--tone-magazine-red)",
              fontWeight: 500,
            }}
          >
            같은 약속
          </em>
          으로 만듭니다
        </h1>

        {/* Subtitle */}
        <p
          className="mx-auto mb-12"
          style={{
            fontFamily: "var(--font-pretendard)",
            fontSize: "clamp(14px, 1.3vw, 18px)",
            lineHeight: 1.7,
            color: "var(--tone-magazine-ink-2)",
            maxWidth: 720,
            fontWeight: 400,
          }}
        >
          {t("role")}
        </p>

        {/* Bio */}
        <p
          className="mx-auto mb-20"
          style={{
            fontFamily: "var(--font-pretendard)",
            fontSize: "clamp(14px, 1.2vw, 17px)",
            lineHeight: 1.9,
            color: "var(--tone-magazine-ink-2)",
            maxWidth: 720,
            fontWeight: 400,
            letterSpacing: "-0.005em",
            whiteSpace: "pre-line",
          }}
        >
          {t("bio")}
        </p>

        {/* 4 Team Roles — magazine card 2x2 */}
        <MagazineEyebrow className="mb-6">Team · 04 Roles</MagazineEyebrow>
        <h2
          className="font-normal mx-auto mb-14 max-w-[900px]"
          style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: "clamp(28px, 5vw, 64px)",
            lineHeight: 1.0,
            letterSpacing: "-0.014em",
            color: "var(--tone-magazine-ink)",
          }}
        >
          역할은 넷,{" "}
          <em style={{ fontFamily: "var(--font-fraunces)", fontStyle: "normal", fontWeight: 500 }}>
            책임은 하나
          </em>
        </h2>

        <div
          className="grid grid-cols-1 md:grid-cols-2 mx-auto max-w-[940px] mb-24"
          style={{ border: "1px solid var(--tone-magazine-ink)" }}
        >
          {TEAM_ROLES.map((p, i) => (
            <div
              key={p.num}
              className={`flex flex-col items-center text-center ${i % 2 === 0 ? "sm:border-r" : ""} ${i < 2 ? "sm:!border-b" : "sm:!border-b-0"}`}
              style={{
                padding: "clamp(28px, 3.5vw, 44px) clamp(20px, 2.5vw, 32px)",
                borderBottom: i < TEAM_ROLES.length - 1 ? "1px solid var(--tone-magazine-line-2)" : "none",
                borderColor: "var(--tone-magazine-line-2)",
              }}
            >
              <div
                className="mb-3"
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "10.5px",
                  color: "var(--tone-magazine-ink-3)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}
              >
                {p.label}
              </div>
              <h3
                className="font-normal mb-3"
                style={{
                  fontFamily: "var(--font-marcellus)",
                  fontSize: "clamp(32px, 3.6vw, 44px)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.012em",
                  color: "var(--tone-magazine-ink)",
                }}
              >
                {p.title}{" "}
                <em
                  style={{
                    fontFamily: "var(--font-fraunces)",
                    fontStyle: "normal",
                    color: "var(--tone-magazine-ink-3)",
                    fontWeight: 500,
                    fontSize: "0.5em",
                    letterSpacing: 0,
                  }}
                >
                  {p.titleEm}
                </em>
              </h3>
              <p
                className="mb-5 max-w-[300px]"
                style={{
                  fontFamily: "var(--font-pretendard)",
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "var(--tone-magazine-ink-2)",
                  fontWeight: 400,
                }}
              >
                {p.body}
              </p>
              <div
                className="inline-flex items-baseline gap-2.5 pt-[14px] flex-wrap justify-center"
                style={{ borderTop: "1px solid var(--tone-magazine-line)" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: "10.5px",
                    color: "var(--tone-magazine-ink-3)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  → {p.metric.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-marcellus)",
                    fontSize: "clamp(20px, 2vw, 26px)",
                    color: "var(--tone-magazine-ink)",
                    letterSpacing: "-0.012em",
                    lineHeight: 1,
                  }}
                >
                  {p.metric.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <MagazineEyebrow className="mb-6">Stack · Tools</MagazineEyebrow>
        <h2
          className="font-normal mx-auto mb-10"
          style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: "clamp(32px, 4vw, 56px)",
            lineHeight: 1.05,
            letterSpacing: "-0.014em",
            color: "var(--tone-magazine-ink)",
          }}
        >
          {t("stackTitle")}
        </h2>

        <div className="flex flex-wrap justify-center gap-x-2 gap-y-2.5 max-w-[960px] mx-auto mb-24">
          {STACK.map((tech) => (
            <span
              key={tech}
              style={{
                padding: "7px 14px",
                border: "1px solid var(--tone-magazine-line-2)",
                fontFamily: "var(--font-jetbrains)",
                fontSize: "clamp(11px, 1vw, 12.5px)",
                letterSpacing: "0.08em",
                color: "var(--tone-magazine-ink)",
                borderRadius: 2,
                background: "var(--tone-magazine-paper-2)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Business Info */}
        <MagazineEyebrow className="mb-6">{t("businessTitle")}</MagazineEyebrow>
        <h2
          className="font-normal mx-auto mb-10"
          style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: "clamp(32px, 4vw, 56px)",
            lineHeight: 1.05,
            letterSpacing: "-0.014em",
            color: "var(--tone-magazine-ink)",
          }}
        >
          사업자 정보
        </h2>

        <dl
          className="mx-auto text-left max-w-[640px]"
          style={{
            border: "1px solid var(--tone-magazine-line-2)",
            background: "var(--tone-magazine-paper-2)",
          }}
        >
          {[
            { dt: "상호명", dd: "에이아이오 (AIO)" },
            { dt: "대표자", dd: "정재홍" },
            { dt: "사업자번호", dd: "682-01-02748" },
            { dt: "통신판매업신고", dd: "제 2026-경기김포-3656 호" },
            { dt: "주소", dd: "경기도 김포시 대곶면 흥신로67" },
            { dt: "이메일", dd: "aiomake2023@gmail.com" },
          ].map((row, i, arr) => (
            <div
              key={row.dt}
              className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 px-4 md:px-7 py-3.5 md:py-4"
              style={{
                borderBottom:
                  i < arr.length - 1
                    ? "1px solid var(--tone-magazine-line)"
                    : "none",
              }}
            >
              <dt
                className="shrink-0"
                style={{
                  width: 110,
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "10.5px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--tone-magazine-ink-3)",
                }}
              >
                {row.dt}
              </dt>
              <dd
                style={{
                  fontFamily: "var(--font-pretendard)",
                  fontSize: "clamp(13.5px, 1.1vw, 15px)",
                  color: "var(--tone-magazine-ink)",
                  fontWeight: 500,
                  letterSpacing: "-0.005em",
                }}
              >
                {row.dd}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
