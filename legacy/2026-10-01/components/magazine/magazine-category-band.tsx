import Image from "next/image";
import Link from "next/link";

// 4분야 카테고리 띠 — 히어로 바로 아래 "이런 일을 합니다" 시각 소개.
// 사진은 AI 생성 오피스 사진을 object-position 크롭으로 분야별 변형.
// 각 셀 클릭 → 해당 서비스 페이지.

const CATEGORIES = [
  {
    id: "development",
    label: { ko: "개발", en: "Development" },
    sub: { ko: "홈페이지 · 앱 · 자동화", en: "Website · App · Automation" },
    src: "/images/categories/cat-development.png",
    objectPosition: "center center",
  },
  {
    id: "design",
    label: { ko: "디자인", en: "Design" },
    sub: { ko: "브랜드 · 상세페이지 · PPT", en: "Brand · Detail page · PPT" },
    src: "/images/categories/cat-design.png",
    objectPosition: "center center",
  },
  {
    id: "video",
    label: { ko: "영상", en: "Video" },
    sub: { ko: "쇼츠 · 홍보영상 · 모션", en: "Shorts · Promo · Motion" },
    src: "/images/categories/cat-video.png",
    objectPosition: "center center",
  },
  {
    id: "marketing",
    label: { ko: "마케팅", en: "Marketing" },
    sub: { ko: "SNS · 콘텐츠 · 광고", en: "SNS · Content · Ads" },
    src: "/images/categories/cat-marketing.png",
    objectPosition: "center center",
  },
] as const;

interface Props {
  locale: string;
}

export function MagazineCategoryBand({ locale }: Props) {
  const isKo = locale === "ko";

  return (
    <div
      className="max-w-[1500px] mx-auto"
      style={{ background: "var(--tone-magazine-paper)" }}
    >
      {/* 4분야 이미지 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        {CATEGORIES.map((cat, i) => (
          <Link
            key={cat.id}
            href={`/${locale}/services/${cat.id}`}
            className="group relative block overflow-hidden h-[140px] md:h-[200px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0"
            style={{
              borderRight: i < CATEGORIES.length - 1 ? "1px solid rgba(255,255,255,0.07)" : undefined,
              borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.07)" : undefined,
            }}
            aria-label={isKo ? cat.label.ko : cat.label.en}
          >
            {/* 배경 사진 — 분야별 크롭 + 가벼운 그레이스케일로 매거진 무드 */}
            <Image
              src={cat.src}
              alt=""
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              style={{
                objectPosition: cat.objectPosition,
                filter: "grayscale(25%)",
              }}
              sizes="(max-width: 768px) 50vw, 25vw"
              quality={80}
            />

            {/* 다크 오버레이 — 기본: 55%, 호버: 45% */}
            <div
              className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-75"
              style={{ background: "rgba(14,13,11,0.55)" }}
            />

            {/* 라벨 블록 — 하단 왼쪽 정렬, 매거진 활자 스타일 */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
              <div
                className="flex items-end justify-between"
              >
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-jetbrains)",
                      fontSize: "9.5px",
                      color: "rgba(245,240,232,0.55)",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    {isKo ? cat.sub.ko : cat.sub.en}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-marcellus)",
                      fontSize: "clamp(18px, 2.2vw, 26px)",
                      color: "#F5F0E8",
                      lineHeight: 1,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {isKo ? cat.label.ko : cat.label.en}
                  </p>
                </div>
                {/* 화살표 → 호버 시 이동 */}
                <span
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: "13px",
                    color: "var(--tone-magazine-red)",
                    lineHeight: 1,
                  }}
                >
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 하단 캡션 */}
      <div
        className="px-4 py-3 text-center"
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: "10px",
          color: "var(--tone-magazine-ink-3)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          borderTop: "1px solid var(--tone-magazine-line)",
        }}
      >
        AIO 스튜디오가 하는 일 — 클릭해서 각 서비스 확인
      </div>
    </div>
  );
}
