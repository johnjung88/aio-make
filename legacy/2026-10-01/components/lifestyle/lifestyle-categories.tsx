"use client";

import Image from "next/image";

const categories = [
  {
    id: "beauty",
    name: "뷰티 · 스킨케어",
    nameEn: "Beauty",
    desc: "세럼·크림·앰플·선크림. Before/After + 성분 스토리텔링.",
    tags: ["Before/After", "성분표", "리뷰 사례"],
    imgSrc: "/portfolio/detail-page/_categories/beauty.jpg",
    accent: "var(--tone-life-rose)",
  },
  {
    id: "food",
    name: "식품 · 밀키트",
    nameEn: "Food",
    desc: "건강식·밀키트·건강기능식품. 신선함·원산지·영양 강조.",
    tags: ["원산지", "영양성분", "레시피"],
    imgSrc: "/portfolio/detail-page/_categories/food.jpg",
    accent: "var(--tone-life-terra)",
  },
  {
    id: "fashion",
    name: "패션 · 의류",
    nameEn: "Fashion",
    desc: "의류·신발·가방. 착용샷 구성 + 소재·핏·컬러 가이드.",
    tags: ["착용컷", "소재표", "사이즈 가이드"],
    imgSrc: "/portfolio/detail-page/_categories/fashion.jpg",
    accent: "var(--tone-life-olive)",
  },
  {
    id: "living",
    name: "리빙 · 가구",
    nameEn: "Living",
    desc: "가구·인테리어·생활용품. 공간 활용 시나리오 구성.",
    tags: ["공간 연출", "치수", "소재"],
    imgSrc: "/portfolio/detail-page/_categories/living.jpg",
    accent: "var(--tone-life-mustard)",
  },
  {
    id: "health",
    name: "건강 · 헬스케어",
    nameEn: "Health",
    desc: "영양제·건강기능식품·의료기기. 효능 근거 + 임상 데이터.",
    tags: ["임상 근거", "복용법", "효능"],
    imgSrc: "/portfolio/detail-page/_categories/health.jpg",
    accent: "var(--tone-life-mustard)",
  },
  {
    id: "pet",
    name: "펫 · 반려동물",
    nameEn: "Pet",
    desc: "펫푸드·용품·케어. 성분 안전성 + 반려동물 중심 스토리.",
    tags: ["안전성", "성분", "후기"],
    imgSrc: "/portfolio/detail-page/_categories/pet.jpg",
    accent: "var(--tone-life-rose)",
  },
];

export function LifestyleCategories() {
  return (
    <section
      className="mx-auto"
      style={{ padding: "clamp(64px, 10vw, 110px) clamp(16px, 3vw, 24px)", maxWidth: 1480 }}
    >
      {/* Head */}
      <div className="mx-auto mb-16 max-w-[720px] text-center">
        <div
          className="inline-flex items-center gap-[14px] mb-[22px] text-[11.5px] tracking-[0.28em] uppercase"
          style={{ fontFamily: "var(--font-jetbrains)", color: "var(--tone-life-rose)" }}
        >
          <span style={{ width: 28, height: 1, background: "var(--tone-life-rose)", display: "inline-block" }} />
          Category · 6 Verticals
          <span style={{ width: 28, height: 1, background: "var(--tone-life-rose)", display: "inline-block" }} />
        </div>
        <h2
          className="font-medium mb-[18px]"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(28px, 5vw, 72px)",
            letterSpacing: "-0.025em",
            lineHeight: 1.0,
            color: "var(--tone-life-ink)",
          }}
        >
          카테고리마다{" "}
          <em style={{ fontStyle: "italic", color: "var(--tone-life-rose)" }}>다른 흐름</em>
        </h2>
        <p
          style={{
            fontFamily: "var(--font-pretendard)",
            fontSize: "clamp(15px,1.2vw,17px)",
            color: "var(--tone-life-ink-2)",
            lineHeight: 1.7,
            letterSpacing: "-0.005em",
          }}
        >
          뷰티는 성분 스토리, 식품은 신선함, 패션은 핏·소재.
          <br className="hidden sm:inline" />
          {" "}카테고리별로 검증된 섹션 구성을 적용합니다.
        </p>
      </div>

      {/* Grid — 3 cols × 2 rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {categories.map((cat) => (
          <article
            key={cat.id}
            className="group relative overflow-hidden transition-all hover:-translate-y-1"
            style={{
              background: "var(--tone-life-cream)",
              border: "1px solid var(--tone-life-line)",
              borderRadius: 16,
            }}
          >
            {/* Image — 16:9 (소스 비율 매칭, 잘림 없음) */}
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "16/9" }}
            >
              <Image
                src={cat.imgSrc}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                style={{ objectPosition: "center 35%" }}
              />
              <div
                className="absolute inset-x-0 bottom-0 pointer-events-none"
                style={{
                  height: "30%",
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%)",
                }}
              />
              <span
                className="absolute bottom-4 left-4 px-3 py-1.5 text-[10px] tracking-[0.22em] uppercase rounded-full"
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  background: "rgba(255,255,255,0.95)",
                  color: cat.accent,
                  fontWeight: 700,
                  backdropFilter: "blur(6px)",
                  zIndex: 2,
                }}
              >
                {cat.nameEn}
              </span>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-3 p-5 md:p-6">
              <h3
                className="font-medium"
                style={{
                  fontFamily: "var(--font-fraunces)",
                  fontSize: "clamp(20px, 1.9vw, 24px)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  color: "var(--tone-life-ink)",
                }}
              >
                {cat.name}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-pretendard)",
                  fontSize: 13.5,
                  color: "var(--tone-life-ink-2)",
                  lineHeight: 1.65,
                  letterSpacing: "-0.005em",
                }}
              >
                {cat.desc}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {cat.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full"
                    style={{
                      fontFamily: "var(--font-jakarta)",
                      fontSize: 11,
                      background: "var(--tone-life-cream-3)",
                      color: "var(--tone-life-ink-2)",
                      fontWeight: 500,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
