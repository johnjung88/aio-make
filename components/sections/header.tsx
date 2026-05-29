"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { NavDropdown, MobileNavAccordion } from "@/components/ui/nav-dropdown";
import { BrandLogo } from "@/components/ui/brand-logo";

export function Header() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const base = `/${locale}`;
  const isKo = locale === "ko";

  const serviceItems = [
    {
      label: isKo ? "웹사이트" : "Website",
      href: `${base}/services/website`,
      description: isKo ? "랜딩·홈페이지·CMS" : "Landing · Website · CMS",
    },
    {
      label: isKo ? "쇼핑몰" : "Store",
      href: `${base}/services/shopping-mall`,
      description: isKo ? "카페24·커머스형 메인" : "Cafe24 · Commerce storefront",
    },
    {
      label: isKo ? "로고 및 명함" : "Logo & Business Card",
      href: `${base}/services/logo-business-card`,
      description: isKo ? "로고·명함·브랜드 키트" : "Logo · Card · Brand kit",
    },
    {
      label: isKo ? "상세페이지" : "Detail Page",
      href: `${base}/services/detail-page`,
      description: isKo ? "쇼핑몰·크몽용 세로형 상세" : "Vertical sales detail page",
    },
    {
      label: isKo ? "PPT 디자인" : "PPT Design",
      href: `${base}/services/ppt-design`,
      description: isKo ? "회사소개·제안서·피치덱" : "Company deck · Proposal · Pitch",
    },
    {
      label: isKo ? "자동화 및 앱" : "Automation & App",
      href: `${base}/services/automation-app`,
      description: isKo ? "업무 자동화·MVP 앱" : "Ops automation · MVP app",
    },
    {
      label: isKo ? "영상 콘텐츠" : "Video Content",
      href: `${base}/services/video-content`,
      description: isKo ? "마케팅·쇼츠·모션" : "Marketing · Shorts · Motion",
    },
  ];

  const portfolioItems = [
    { label: t("portfolioAll"), href: `${base}/portfolio` },
    { label: isKo ? "웹사이트" : "Website", href: `${base}/portfolio/category/website` },
    { label: isKo ? "쇼핑몰" : "Store", href: `${base}/portfolio/category/shopping-mall` },
    { label: isKo ? "로고 및 명함" : "Logo & Business Card", href: `${base}/portfolio/category/logo-business-card` },
    { label: isKo ? "상세페이지" : "Detail Page", href: `${base}/portfolio/category/detail-page` },
    { label: isKo ? "PPT 디자인" : "PPT Design", href: `${base}/portfolio/category/ppt-design` },
    { label: isKo ? "자동화 및 앱" : "Automation & App", href: `${base}/portfolio/category/automation-app` },
    { label: isKo ? "영상 콘텐츠" : "Video Content", href: `${base}/portfolio/category/video-content` },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "border-b border-white/8 bg-[#0a0a0a]/90 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-6 lg:px-12">
        {/* 로고 */}
        <Link
          href={base}
          className="flex shrink-0 items-center py-1 transition-opacity hover:opacity-85 focus-visible:outline-none"
          aria-label="AIO에이전시 홈"
        >
          <BrandLogo />
        </Link>

        {/* 데스크톱 네비 */}
        <nav className="hidden items-center gap-8 md:flex">
          <NavDropdown label={t("services")} items={serviceItems} />
          <NavDropdown label={t("portfolio")} items={portfolioItems} />
          <Link
            href={`${base}/pricing`}
            className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
          >
            {t("pricing")}
          </Link>
          <Link
            href={`${base}/about`}
            className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
          >
            {t("about")}
          </Link>
        </nav>

        {/* 우측 액션 */}
        <div className="hidden items-center gap-3 md:flex">
          
          <Link
            href={`${base}/quote`}
            className="inline-flex h-9 items-center rounded-full bg-primary px-5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-80"
          >
            {t("contact")}
          </Link>
        </div>

        {/* 모바일 토글 */}
        <button
          type="button"
          aria-label="메뉴"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="flex size-9 items-center justify-center rounded-full border border-white/10 text-foreground/80 transition-colors hover:border-white/20 md:hidden"
        >
          {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <div className="border-t border-white/8 bg-[#0a0a0a]/95 px-6 py-6 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-2">
            <MobileNavAccordion
              label={t("services")}
              items={serviceItems}
              onClose={() => setMobileOpen(false)}
            />
            <MobileNavAccordion
              label={t("portfolio")}
              items={portfolioItems}
              onClose={() => setMobileOpen(false)}
            />
            {[
              { label: t("pricing"), href: `${base}/pricing` },
              { label: t("about"), href: `${base}/about` },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex items-center gap-3">
              
              <Link
                href={`${base}/quote`}
                className="flex-1 inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {t("contact")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
