import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowLeft, CheckCircle2, FileText, Clock3, Download } from "lucide-react";
import type { Metadata } from "next";
import { formatProjectDuration, getPortfolioGroup, portfolioProjects } from "@/lib/portfolio-data";
import { getPortfolioBySlug } from "@/lib/portfolio";
import { AioNav, AioFooter } from "@/components/landing/aio-nav";
import { getCategoryNav } from "@/lib/portfolio-nav";
import { getPptGalleryFromDisk } from "@/lib/ppt-gallery";
import { TypeBadge } from "@/components/ui/type-badge";
import { GuaranteeBadge } from "@/components/ui/guarantee-badge";
import { DeviceShowcase } from "@/components/portfolio/device-showcase";
import type { ServiceCategory } from "@/lib/services-data";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return portfolioProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getPortfolioBySlug(slug);
  if (!project) return {};
  return { title: project.title[locale as "ko" | "en"] };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  const project = await getPortfolioBySlug(slug);
  if (!project) notFound();

  const l = locale as "ko" | "en";
  const base = `/${locale}`;
  const projectGroup = getPortfolioGroup(project);
  const isShoppingMall = projectGroup === "shopping-mall";
  const isPptProject = projectGroup === "ppt-design";

  const nav = getCategoryNav(projectGroup);

  // PPT 갤러리 — 디스크에서 실제 슬라이드 이미지를 자동 스캔
  const pptGallery: string[] = (() => {
    if (!isPptProject || !project.cover) return [];
    const match = project.cover.match(/\/portfolio\/ppt-design\/([^/]+)\//);
    if (!match) return [];
    const diskGallery = getPptGalleryFromDisk(match[1]);
    return diskGallery.length > 0 ? diskGallery : project.gallery;
  })();

  const isDetailPageProject = projectGroup === "detail-page";
  const hasResponsive = !!project.responsivePreview;
  const hasUsableCover = !!(project.cover && project.cover !== "/portfolio/placeholder.svg");
  const isRasterCover = /\.(png|jpe?g|webp)$/i.test(project.cover ?? "");

  // Dedupe gallery: remove images already shown in the device-showcase hero
  const heroImages = new Set<string>(
    [
      project.responsivePreview?.desktop,
      project.responsivePreview?.mobile,
      !hasResponsive ? project.cover : undefined,
    ].filter(Boolean) as string[]
  );

  const rawGallery = isPptProject ? pptGallery : project.gallery;
  const dedupedGallery = (isDetailPageProject
    ? rawGallery
    : rawGallery.filter((s) => !heroImages.has(s))
  ).filter((s) => !/\.svg$/i.test(s));

  const quoteHref = `${base}/quote?category=${projectGroup}`;
  const similarWorkLabel = isShoppingMall
    ? l === "ko" ? "비슷한 쇼핑몰 문의" : "Request similar store"
    : projectGroup === "website"
      ? l === "ko" ? "비슷한 웹사이트 문의" : "Request similar website"
      : l === "ko" ? "비슷한 작업 문의" : "Request similar work";

  const storyLabels =
    l === "ko"
      ? [
          { label: "고객 고민", text: project.problem[l] },
          { label: "작업 방향", text: project.solution[l] },
          { label: "사용자가 얻는 변화", text: project.impact[l] },
        ]
      : [
          { label: "Client Need", text: project.problem[l] },
          { label: "What We Built", text: project.solution[l] },
          { label: "Expected Result", text: project.impact[l] },
        ];

  const keyOutput =
    project.deliverables?.[0]?.[l] ??
    project.resultSummary?.[l] ??
    (l === "ko" ? "결과물 중심 포트폴리오" : "Result-focused portfolio");

  return (
    <div>
      <AioNav locale={locale} level={nav.level} cat={nav.cat} sub={nav.sub} active="portfolio" />
      <main className="pb-24 pt-10">
        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12">

          {/* 뒤로가기 */}
          <Link
            href={`${base}/portfolio`}
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            {t("back")}
          </Link>

          {/* ── HERO ── */}
          {hasResponsive ? (
            /* Device showcase: monitor.png + phone.png mockup */
            <section className="mb-12 rounded-xl border border-white/8 bg-card px-4 py-2 md:px-8">
              <DeviceShowcase
                desktopSrc={project.responsivePreview!.desktop}
                mobileSrc={project.responsivePreview!.mobile ?? undefined}
                alt={project.title[l]}
              />
              {/* Caption: live link / cafe24 badge */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 pb-2">
                {project.links.live && (
                  <Link
                    href={project.links.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-primary hover:underline"
                  >
                    <ExternalLink className="size-3" />
                    {project.links.live.replace(/^https?:\/\//, "")}
                  </Link>
                )}
                {isShoppingMall && !project.links.live && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <Clock3 className="size-3" />
                    {l === "ko" ? "카페24 디자인센터 등록 예정" : "Cafe24 Design Center planned"}
                  </span>
                )}
              </div>
            </section>
          ) : hasUsableCover && (
            /* Fallback cover hero — preserves per-group object-fit logic */
            <div
              className={`relative mb-12 w-full overflow-hidden rounded-xl border border-white/8 ${
                isDetailPageProject
                  ? "aspect-[4/3] bg-white md:aspect-[16/9]"
                  : isPptProject
                    ? "aspect-video bg-secondary"
                    : "aspect-[16/7] bg-secondary"
              }`}
            >
              <Image
                src={project.cover}
                alt={project.title[l]}
                fill
                className={
                  isDetailPageProject
                    ? "object-contain object-top"
                    : isPptProject
                      ? "object-contain"
                      : isRasterCover
                        ? "object-cover"
                        : "object-contain p-2"
                }
                priority
                sizes="(max-width: 1400px) 100vw"
              />
            </div>
          )}

          {/* ── HEADER ── */}
          <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <TypeBadge type={project.type as ServiceCategory} />
                <GuaranteeBadge label={t("guarantee")} />
                <span className="text-xs text-muted-foreground">{formatProjectDuration(project.duration, l)}</span>
                {project.visibility === "private-result" && (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold text-cyan-200">
                    <CheckCircle2 className="size-3.5 shrink-0" />
                    {l === "ko" ? `핵심 결과 · ${keyOutput}` : `Key output · ${keyOutput}`}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {project.title[l]}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                {project.summary[l]}
              </p>
            </div>

            {/* 링크 */}
            <div className="flex shrink-0 flex-wrap gap-3">
              {project.links.live && (
                <Link
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-80"
                >
                  <ExternalLink className="size-3.5" />
                  {t("liveLink")}
                </Link>
              )}
              {isShoppingMall && !project.links.live && (
                <span
                  aria-disabled="true"
                  className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-full bg-primary px-5 text-xs font-semibold text-primary-foreground opacity-85"
                >
                  <Clock3 className="size-3.5" />
                  {l === "ko" ? "카페24 디자인센터 등록 예정" : "Cafe24 Design Center planned"}
                </span>
              )}
              {project.downloads?.planning && (
                <a
                  href={project.downloads.planning}
                  download
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-white/12 px-5 text-xs font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Download className="size-3.5" />
                  {l === "ko" ? "기획서 다운로드" : "Download plan"}
                </a>
              )}
              {project.downloads?.deck && (
                <a
                  href={project.downloads.deck}
                  download
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-white/12 px-5 text-xs font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Download className="size-3.5" />
                  {l === "ko" ? "PPT 다운로드" : "Download PPT"}
                </a>
              )}
              <Link
                href={quoteHref}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {similarWorkLabel}
              </Link>
            </div>
          </div>

          {/* ── STORY 3-UP ── */}
          <div className="mb-14">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
              {l === "ko" ? "프로젝트 스토리" : "Project Story"}
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {storyLabels.map(({ label, text }) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/8 bg-card p-6"
                  style={{ borderTopWidth: 2, borderTopColor: "rgba(77,212,172,0.35)" }}
                >
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                    {label}
                  </p>
                  <p className="text-sm leading-7 text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── OUTCOME ZONE: Result + Deliverables + KPIs ── */}
          {(project.resultSummary || project.deliverables?.length || (project.kpis && project.kpis.length > 0)) && (
            <div className="mb-14 border-l-2 border-primary/40 pl-5">
              <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-primary">
                {l === "ko" ? "성과 / 납품" : "Outcome / Deliverables"}
              </p>

              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                {project.resultSummary && (
                  <div className="rounded-xl border border-white/8 bg-card p-6">
                    <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                      <FileText className="size-3.5" />
                      {l === "ko" ? "작업 결과" : "Result"}
                    </p>
                    <p className="text-sm leading-7 text-muted-foreground">{project.resultSummary[l]}</p>
                  </div>
                )}
                {project.deliverables && project.deliverables.length > 0 && (
                  <div className="rounded-xl border border-white/8 bg-card p-6">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
                      {l === "ko" ? "납품 범위" : "Deliverables"}
                    </p>
                    <ul className="space-y-2">
                      {project.deliverables.map((item) => (
                        <li key={item[l]} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                          {item[l]}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* KPI 카드 */}
              {project.kpis && project.kpis.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {project.kpis.map((kpi, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-1 rounded-xl border border-white/8 bg-card px-6 py-4 text-center"
                    >
                      <span className="font-mono text-3xl font-bold text-primary">
                        {kpi.value}
                        {kpi.unit && <span className="ml-0.5 text-lg">{kpi.unit}</span>}
                      </span>
                      <span className="text-xs text-muted-foreground">{kpi.label[l]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── VIDEO ── */}
          {project.links.video && (
            <div className="mb-14">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                {l === "ko" ? "작동 데모 영상" : "Working demo video"}
              </p>
              <div className="overflow-hidden rounded-xl border border-white/8 bg-secondary">
                <video
                  src={project.links.video}
                  poster={project.cover}
                  controls
                  muted
                  playsInline
                  preload="metadata"
                  className="aspect-video w-full bg-black object-contain"
                />
              </div>
            </div>
          )}

          {/* ── GALLERY ── */}
          {dedupedGallery.length > 0 && (
            <div className="mb-14">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                {isDetailPageProject
                  ? l === "ko" ? "전체 상세페이지 결과 화면" : "Full Detail Page Result"
                  : l === "ko" ? "결과 화면" : "Gallery"}
              </p>

              {isDetailPageProject ? (
                <div className="space-y-6">
                  {dedupedGallery.filter((src) => /detail\.(jpe?g|png|webp)$/i.test(src)).map((src, i) => (
                    <a
                      key={src}
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                      className="block overflow-hidden rounded-xl border border-white/8 bg-white"
                      aria-label={`${project.title[l]} ${l === "ko" ? "전체 상세페이지 원본 보기" : "open full detail page"}`}
                    >
                      <Image
                        src={src}
                        alt={`${project.title[l]} ${l === "ko" ? "전체 상세페이지" : "full detail page"} ${i + 1}`}
                        width={1000}
                        height={7200}
                        className="h-auto w-full"
                        sizes="(max-width: 1400px) 100vw, 1200px"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {dedupedGallery.map((src, i) => {
                    const isRasterGallery = /\.(png|jpe?g|webp)$/i.test(src);
                    const isPortrait = /(?:^|\/|-)mobile(?:-preview|-v2|-final|-photo)?\.(png|jpe?g|webp)$/i.test(src);
                    const aspectClass = isPortrait
                      ? "aspect-[9/16]"
                      : isPptProject
                        ? "aspect-video"
                        : "aspect-[16/10]";
                    return (
                      <div
                        key={i}
                        className={`relative overflow-hidden rounded-xl bg-secondary ${aspectClass}`}
                      >
                        <Image
                          src={src}
                          alt={`${project.title[l]} ${i + 1}`}
                          fill
                          className={
                            isPptProject || isPortrait
                              ? "object-contain"
                              : isRasterGallery
                                ? "object-cover"
                                : "object-contain p-2"
                          }
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── BOTTOM CTA ── */}
          <div className="rounded-xl border border-primary/30 bg-primary/10 p-6 md:flex md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {l === "ko" ? "이런 결과물이 필요하신가요?" : "Need a similar result?"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {l === "ko"
                  ? "카테고리와 세부 작업이 자동으로 채워진 견적 폼에서 바로 문의할 수 있습니다."
                  : "Open a quote form with this category preselected."}
              </p>
            </div>
            <Link
              href={quoteHref}
              className="mt-5 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground md:mt-0"
            >
              {isShoppingMall ? (l === "ko" ? "쇼핑몰 견적 문의하기" : "Request store quote") : (l === "ko" ? "견적 문의하기" : "Get a quote")}
            </Link>
          </div>

        </div>
      </main>
      <AioFooter locale={locale} />
    </div>
  );
}
