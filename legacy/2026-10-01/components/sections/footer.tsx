"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ChannelBadges } from "@/components/sections/channel-badges";
import { BrandLogo } from "@/components/ui/brand-logo";

const disciplines = [
  { label: "웹 개발", href: "/services/website", available: true },
  { label: "상세페이지", href: "/services/detail-page", available: true },
  { label: "PPT 디자인", href: "/services/ppt-design", available: true },
  { label: "자동화", href: null, available: false },
  { label: "앱 개발", href: null, available: false },
  { label: "영상", href: null, available: false },
  { label: "마케팅", href: null, available: false },
];

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("footer");
  const base = `/${locale}`;

  return (
    <footer className="border-t border-white/8 py-12">
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* 브랜드 */}
          <div className="flex flex-col gap-4">
            <div>
              <BrandLogo variant="footer" />
              <p className="mt-2 max-w-xs text-xs leading-6 text-muted-foreground">
                {t("tagline")}
              </p>
            </div>
            <ChannelBadges size="sm" />
          </div>

          {/* 링크 */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("services")}
              </p>
              {disciplines.map((d) => {
                if (d.available && d.href) {
                  return (
                    <Link
                      key={d.label}
                      href={`${base}${d.href}`}
                      className="text-xs text-muted-foreground/70 transition-colors hover:text-foreground"
                    >
                      {d.label}
                    </Link>
                  );
                }
                return (
                  <span key={d.label} className="text-xs text-muted-foreground/40 inline-flex items-center gap-1.5">
                    {d.label}
                    <span className="text-[9px] tracking-[0.18em] uppercase opacity-60">soon</span>
                  </span>
                );
              })}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("company")}
              </p>
              {[
                { label: locale === "ko" ? "회사 소개" : "About", href: `${base}/about` },
                { label: t("contact"), href: `${base}/quote` },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs text-muted-foreground/70 transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("contact")}
              </p>
              <Link
                href="mailto:aiomake2023@gmail.com"
                className="text-xs text-muted-foreground/70 transition-colors hover:text-foreground"
              >
                aiomake2023@gmail.com
              </Link>
            </div>
          </div>
        </div>

        {/* 사업자 정보 */}
        <div className="mt-10 border-t border-white/8 pt-6">
          <div className="text-xs leading-6 text-muted-foreground/50">
            <p>
              사업자명: 에이아이오 (AIO) &nbsp;|&nbsp; 사업자번호: 682-01-02748
            </p>
            <p>
              통신판매업신고: 제 2026-경기김포-3656 호
            </p>
            <p>
              주소: 경기도 김포시 대곶면 흥신로67
            </p>
            <p>
              © {new Date().getFullYear()} AIO에이전시. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
