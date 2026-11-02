import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { metaCategoriesData, servicesData, type MetaCategory } from "@/lib/services-data";
import { ICON_MAP } from "@/lib/category-icons";
import { CategoryCardLink } from "./category-card-link";

// ── 카테고리 카드 (인포그래픽 스타일) ──────────────────────────────

function CategoryHeroCard({ cat, locale }: { cat: MetaCategory; locale: string }) {
  const Icon = ICON_MAP[cat.icon] ?? ICON_MAP["Globe"];
  const lang = locale === "ko" ? "ko" : "en";

  const subLabels = cat.subcategories.map((id) => {
    const svc = servicesData.find((s) => s.id === id);
    return svc?.title[lang] ?? id;
  });

  const firstSvc = servicesData.find((s) => s.id === cat.subcategories[0]);
  const startPrice = firstSvc?.pricing[0]?.eventPrice;

  const inner = (
    <div
      className={`group relative flex h-full min-h-[200px] flex-col rounded-2xl border p-5 transition-all duration-200 sm:p-7 ${
        cat.comingSoon
          ? "cursor-not-allowed border-white/5 bg-white/[0.015]"
          : "cursor-pointer border-white/10 bg-[#111111] hover:border-primary/40 hover:bg-[#161616]"
      }`}
    >
      {/* 상단: 아이콘 + 가격 뱃지 */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className={`flex size-14 shrink-0 items-center justify-center rounded-xl border sm:size-16 ${
            cat.comingSoon
              ? "border-white/5 bg-white/5 opacity-25"
              : "border-primary/20 bg-primary/10 text-primary"
          }`}
        >
          <Icon className="size-6 sm:size-7" />
        </div>

        {cat.comingSoon ? (
          <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs font-medium text-white/25">
            {lang === "ko" ? "준비 중" : "Coming Soon"}
          </span>
        ) : startPrice ? (
          <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {lang === "ko" ? `시작가 ${startPrice}` : `From ${startPrice}`}
          </span>
        ) : null}
      </div>

      {/* 카테고리 명 */}
      <h3
        className={`mb-3 text-xl font-bold sm:text-2xl ${
          cat.comingSoon ? "text-white/20" : "text-foreground"
        }`}
      >
        {cat.title[lang]}
      </h3>

      {/* 설명 */}
      <p className={`mb-4 text-xs leading-5 sm:text-sm sm:leading-6 ${
        cat.comingSoon ? "text-white/15" : "text-muted-foreground"
      }`}>
        {cat.description[lang]}
      </p>

      {/* 세부 서비스 태그 */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {subLabels.map((label) => (
          <span
            key={label}
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
              cat.comingSoon
                ? "bg-white/5 text-white/15"
                : "bg-white/[0.06] text-muted-foreground"
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* 하단 CTA */}
      <div className="mt-auto">
        {cat.comingSoon ? (
          <span className="text-xs text-white/20">
            {lang === "ko" ? "오픈 예정" : "Opening soon"}
          </span>
        ) : (
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <span>{lang === "ko" ? "서비스 보기" : "View service"}</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        )}
      </div>
    </div>
  );

  if (cat.comingSoon) return inner;
  return (
    <CategoryCardLink
      href={`/${locale}/services/${cat.id}`}
      category={cat.id}
      className="flex"
    >
      {inner}
    </CategoryCardLink>
  );
}

// ── 메인 히어로 ────────────────────────────────────────────────────

interface Props {
  locale: string;
}

export async function HeroSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "hero" });
  const lang = locale === "ko" ? "ko" : "en";
  const base = `/${locale}`;
  const marqueeText = t("marquee");

  return (
    <section className="relative overflow-hidden pb-0 pt-20 sm:pt-24">
      {/* 미묘한 라임 배경 글로우 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(163,230,53,0.07),transparent)]" />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-12">

        {/* ── 헤드라인 영역 ── */}
        <div className="mb-8 text-center sm:mb-10 lg:mb-12">
          {/* 라벨 뱃지 */}
          <div className="mb-4 flex justify-center sm:mb-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
              {t("label")}
            </span>
          </div>

          {/* 메인 헤드라인 */}
          <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            {t("headline")}
          </h1>

          {/* 서비스 선택 서브 카피 */}
          <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base lg:text-lg">
            {lang === "ko"
              ? "어떤 서비스가 필요하신가요? 카테고리를 선택해 포트폴리오와 가격을 확인하세요"
              : "What service do you need? Select a category to see portfolio samples and pricing."}
          </p>
        </div>

        {/* ── 4 카테고리 카드 (인포그래픽 선택 UI) ── */}
        <div id="services" className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {metaCategoriesData.map((cat) => (
            <CategoryHeroCard key={cat.id} cat={cat} locale={locale} />
          ))}
        </div>

        {/* ── CTA 버튼 ── */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center">
          <Link
            href={`${base}/quote`}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-80 sm:w-auto"
          >
            {t("ctaSecondary")}
            <ArrowUpRight className="size-4" />
          </Link>
          <Link
            href={`${base}/portfolio`}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/12 px-7 text-sm font-semibold text-foreground transition-colors hover:border-white/25 hover:bg-white/5 sm:w-auto"
          >
            {t("ctaPrimary")}
          </Link>
        </div>
      </div>

      {/* ── 마퀴 스트립 ── */}
      <div className="mt-12 w-full overflow-hidden border-t border-white/8 py-3">
        <div className="animate-marquee flex whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mr-10">
              {marqueeText}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
