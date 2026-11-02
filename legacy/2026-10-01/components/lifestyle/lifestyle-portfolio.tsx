"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  locale: string;
}

interface Project {
  slug: string;
  cat: "beauty" | "food" | "fashion" | "living" | "pet";
  catLabel: string;
  title: string;
  titleEm: string;
  product: string;
  conv: string;
  channel: string;
}

/* 실제 작업물 — 3_포트폴리오/자체작업/portfolio_page/{카테고리}/ 의 15개 상세페이지 */
const projects: Project[] = [
  // 뷰티 (3) — 1_뷰티
  {
    slug: "ampoule-anti-aging",
    cat: "beauty",
    catLabel: "뷰티 · 안티에이징",
    title: "발라서 ",
    titleEm: "젊어지는",
    product: "LUMICELL Anti-Aging Ampoule — 안티에이징 세럼",
    conv: "+42%",
    channel: "자사몰 · 스마트스토어",
  },
  {
    slug: "vegan-cleanser",
    cat: "beauty",
    catLabel: "뷰티 · 클렌저",
    title: "비건 ",
    titleEm: "클렌징의 정의",
    product: "PUREON Vegan Cleanser — 비건 클렌저",
    conv: "+35%",
    channel: "자사몰",
  },
  {
    slug: "herbal-cream",
    cat: "beauty",
    catLabel: "뷰티 · 한방",
    title: "한방 ",
    titleEm: "재생 크림",
    product: "초원 Herbal Repair Cream — 한방 크림",
    conv: "+38%",
    channel: "스마트스토어",
  },

  // 식품 (3) — 2_식품
  {
    slug: "premium-mealkit",
    cat: "food",
    catLabel: "식품 · 밀키트",
    title: "10분, ",
    titleEm: "셰프의 한 그릇",
    product: "HOMEDISH Premium Mealkit — 프리미엄 밀키트",
    conv: "+52%",
    channel: "자사몰 · 쿠팡",
  },
  {
    slug: "office-vitamin",
    cat: "food",
    catLabel: "식품 · 비타민",
    title: "직장인을 위한 ",
    titleEm: "데일리 비타민",
    product: "VITALOG Office Daily — 직장인 비타민",
    conv: "+40%",
    channel: "스마트스토어",
  },
  {
    slug: "senior-protein",
    cat: "food",
    catLabel: "식품 · 건강식",
    title: "시니어 ",
    titleEm: "단백질 한 잔",
    product: "든든프로 Senior Protein — 시니어 단백질",
    conv: "+33%",
    channel: "자사몰",
  },

  // 패션 (3) — 3_패션
  {
    slug: "linen-onepiece",
    cat: "fashion",
    catLabel: "패션 · 여성복",
    title: "한 벌이 ",
    titleEm: "여름을 정의",
    product: "LINENA Linen Onepiece — 여성 린넨 원피스",
    conv: "+33%",
    channel: "자사몰 · 스마트스토어",
  },
  {
    slug: "business-shirt",
    cat: "fashion",
    catLabel: "패션 · 남성복",
    title: "비즈니스 ",
    titleEm: "셔츠의 기준",
    product: "STILBLOCK Business Shirt — 남성 비즈니스 셔츠",
    conv: "+28%",
    channel: "자사몰",
  },
  {
    slug: "kids-organic-wear",
    cat: "fashion",
    catLabel: "패션 · 키즈",
    title: "엄마가 안심하는 ",
    titleEm: "친환경 의류",
    product: "모이모이 Kids Organic Wear — 키즈 친환경 의류",
    conv: "+45%",
    channel: "자사몰 · 쿠팡",
  },

  // 리빙 (3) — 4_리빙
  {
    slug: "hotel-bedding",
    cat: "living",
    catLabel: "리빙 · 침구",
    title: "호텔의 ",
    titleEm: "그 잠",
    product: "SLEEPVERSE Hotel Bedding — 호텔식 침구",
    conv: "+31%",
    channel: "자사몰 · 스마트스토어",
  },
  {
    slug: "one-room-furniture",
    cat: "living",
    catLabel: "리빙 · 1인 가구",
    title: "1인 가구를 위한 ",
    titleEm: "한 세트",
    product: "NOOKIT One-Room Furniture — 1인 가구 가구",
    conv: "+34%",
    channel: "자사몰",
  },
  {
    slug: "mood-light",
    cat: "living",
    catLabel: "리빙 · 조명",
    title: "공간의 ",
    titleEm: "온도를 바꾸는",
    product: "GLOWAVE Mood Light — 무드 조명",
    conv: "+29%",
    channel: "스마트스토어 · 쿠팡",
  },

  // 펫 (3) — 5_펫
  {
    slug: "premium-pet-food",
    cat: "pet",
    catLabel: "펫 · 프리미엄 사료",
    title: "내 아이에게 ",
    titleEm: "프리미엄 한 끼",
    product: "멍슐랭 Premium Cooked Food — 프리미엄 화식",
    conv: "+47%",
    channel: "자사몰",
  },
  {
    slug: "auto-pet-feeder",
    cat: "pet",
    catLabel: "펫 · 자동급식기",
    title: "스마트 ",
    titleEm: "자동 급식",
    product: "PURRSMART Auto Feeder — 자동 급식기",
    conv: "+44%",
    channel: "자사몰 · 쿠팡",
  },
  {
    slug: "senior-pet-supplement",
    cat: "pet",
    catLabel: "펫 · 시니어 영양제",
    title: "시니어 펫을 위한 ",
    titleEm: "영양제",
    product: "포에버펫 Senior Supplement — 시니어 펫 영양제",
    conv: "+36%",
    channel: "스마트스토어",
  },
];

const cats = [
  { id: "all", label: "전체" },
  { id: "beauty", label: "뷰티" },
  { id: "food", label: "식품" },
  { id: "fashion", label: "패션" },
  { id: "living", label: "리빙" },
  { id: "pet", label: "펫" },
] as const;

export function LifestylePortfolio({ locale }: Props) {
  const [active, setActive] = useState<(typeof cats)[number]["id"]>("all");
  const filtered =
    active === "all" ? projects : projects.filter((p) => p.cat === active);
  const countFor = (id: string) =>
    id === "all"
      ? projects.length
      : projects.filter((p) => p.cat === id).length;

  return (
    <>
      {/* Hero */}
      <section
        style={{
          padding: "clamp(56px, 8vw, 80px) clamp(16px, 3vw, 24px) 24px",
          maxWidth: 1280,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: 11.5,
            color: "var(--tone-life-rose)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            marginBottom: 24,
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span
            style={{
              width: 28,
              height: 1,
              background: "var(--tone-life-rose)",
              display: "inline-block",
            }}
          />
          Portfolio · {projects.length} pages
          <span
            style={{
              width: 28,
              height: 1,
              background: "var(--tone-life-rose)",
              display: "inline-block",
            }}
          />
        </div>
        <h1
          className="font-medium"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(32px, 6.4vw, 96px)",
            letterSpacing: "-0.03em",
            lineHeight: 0.98,
            color: "var(--tone-life-ink)",
            marginBottom: 22,
          }}
        >
          실제 발행된
          <br />
          <em
            style={{
              fontStyle: "italic",
              color: "var(--tone-life-rose)",
              fontWeight: 500,
            }}
          >
            {projects.length}개
          </em>
          의 상세페이지
        </h1>
        <p
          style={{
            fontFamily: "var(--font-pretendard)",
            fontSize: "clamp(15px, 1.3vw, 17px)",
            lineHeight: 1.7,
            color: "var(--tone-life-ink-2)",
            maxWidth: 640,
            margin: "0 auto 36px",
          }}
        >
          뷰티 · 식품 · 패션 · 리빙 · 펫 5개 카테고리.
          <br className="hidden sm:inline" />
          {" "}전환율을 끌어올린 작업물만 모았습니다.
        </p>

        {/* Filter bar — pill */}
        <div
          style={{
            display: "inline-flex",
            flexWrap: "wrap",
            border: "1.5px solid var(--tone-life-ink)",
            justifyContent: "center",
            borderRadius: 999,
            background: "var(--tone-life-cream)",
            padding: 4,
            gap: 2,
          }}
        >
          {cats.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              style={{
                padding: "8px 16px",
                border: 0,
                background:
                  active === c.id ? "var(--tone-life-ink)" : "transparent",
                color:
                  active === c.id
                    ? "var(--tone-life-cream)"
                    : "var(--tone-life-ink-2)",
                fontFamily: "var(--font-jakarta)",
                fontSize: 12.5,
                cursor: "pointer",
                fontWeight: active === c.id ? 600 : 500,
                transition: "all 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
              }}
            >
              {c.label}
              <span
                style={{
                  opacity: active === c.id ? 0.7 : 0.5,
                  fontSize: 10,
                  fontFamily: "var(--font-jetbrains)",
                  color:
                    active === c.id
                      ? "var(--tone-life-cream)"
                      : "var(--tone-life-ink-3)",
                }}
              >
                {countFor(c.id)}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section
        style={{
          padding: "24px clamp(20px,3vw,24px) 80px",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {filtered.map((p) => (
            <article
              key={p.slug}
              className="flex flex-col group overflow-hidden transition-all hover:-translate-y-1"
              style={{
                background: "var(--tone-life-cream)",
                border: "1px solid var(--tone-life-line)",
                borderRadius: 12,
              }}
            >
              {/* Cover image */}
              <div
                className="relative overflow-hidden"
                style={{
                  aspectRatio: "4/5",
                  background: "var(--tone-life-cream-3)",
                }}
              >
                <Image
                  src={`/portfolio/detail-page/${p.slug}/cover.png`}
                  alt={`${p.title}${p.titleEm} 상세페이지 cover`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  style={{ objectPosition: "center top" }}
                />
                {/* Conv rate floating badge */}
                <div
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(8px)",
                    color: "var(--tone-life-rose)",
                    fontFamily: "var(--font-fraunces)",
                    fontStyle: "italic",
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {p.conv}
                </div>
                {/* Category label */}
                <div
                  className="absolute top-3 left-3 px-3 py-1.5"
                  style={{
                    background: "var(--tone-life-ink)",
                    color: "var(--tone-life-cream)",
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: 9.5,
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    borderRadius: 999,
                  }}
                >
                  {p.catLabel}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 gap-2 p-5">
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--tone-life-ink-3)",
                  }}
                >
                  {p.channel}
                </div>
                <h3
                  className="font-medium"
                  style={{
                    fontFamily: "var(--font-fraunces)",
                    fontSize: "clamp(20px, 1.9vw, 24px)",
                    lineHeight: 1.2,
                    letterSpacing: "-0.018em",
                    color: "var(--tone-life-ink)",
                  }}
                >
                  {p.title}
                  <em
                    style={{
                      fontStyle: "italic",
                      color: "var(--tone-life-rose)",
                    }}
                  >
                    {p.titleEm}
                  </em>
                </h3>
                <p
                  className="flex-1"
                  style={{
                    fontFamily: "var(--font-pretendard)",
                    fontSize: 13.5,
                    color: "var(--tone-life-ink-2)",
                    lineHeight: 1.6,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {p.product}
                </p>

                <div
                  className="flex items-center justify-between gap-3 pt-3 mt-1"
                  style={{
                    borderTop: "1px solid var(--tone-life-line)",
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: 10,
                    color: "var(--tone-life-ink-3)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  <span>§ Live Work · 2026</span>
                  <span style={{ color: "var(--tone-life-rose)", fontWeight: 600 }}>
                    {p.conv} Conv ↑
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "clamp(48px, 7vw, 70px) clamp(16px, 3vw, 24px) clamp(40px, 6vw, 56px)",
          maxWidth: 1180,
          margin: "0 auto",
          textAlign: "center",
          borderTop: "1px solid var(--tone-life-line)",
        }}
      >
        <h2
          className="font-medium"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(26px, 4.6vw, 64px)",
            letterSpacing: "-0.028em",
            lineHeight: 0.96,
            marginBottom: 14,
            color: "var(--tone-life-ink)",
          }}
        >
          비슷한 상품을{" "}
          <em
            style={{
              fontStyle: "italic",
              color: "var(--tone-life-rose)",
              fontWeight: 500,
            }}
          >
            맡기시나요?
          </em>
        </h2>
        <p
          style={{
            fontFamily: "var(--font-pretendard)",
            fontSize: 15,
            color: "var(--tone-life-ink-2)",
            marginBottom: 28,
          }}
        >
          1시간 답변 · 24시간 견적 · 1-3일 결과물
        </p>
        <div
          style={{
            display: "inline-flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            href={`/${locale}/quote`}
            className="hover:!bg-[var(--tone-life-rose)] transition-all hover:-translate-y-0.5"
            style={{
              padding: "14px 26px",
              background: "var(--tone-life-ink)",
              color: "var(--tone-life-cream)",
              border: "1px solid var(--tone-life-ink)",
              fontFamily: "var(--font-jakarta)",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            견적 시작 →
          </Link>
          <Link
            href={`/${locale}/services/detail-page`}
            className="transition-all hover:-translate-y-0.5"
            style={{
              padding: "14px 26px",
              background: "transparent",
              color: "var(--tone-life-ink)",
              border: "1px solid var(--tone-life-ink)",
              fontFamily: "var(--font-jakarta)",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            ← services
          </Link>
        </div>
      </section>
    </>
  );
}
