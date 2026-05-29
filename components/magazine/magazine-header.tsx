"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export function MagazineHeader() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const base = `/${locale}`;
  const isKo = locale === "ko";
  const nextLocale = isKo ? "en" : "ko";

  const toggleLang = () => {
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    router.push(newPath);
  };

  // 매거진 헤더 = 홈 전용. "서비스"는 같은 페이지의 TOC 섹션으로 스크롤
  const navItems = [
    { label: isKo ? "서비스" : "Services", href: `${base}/#toc` },
    { label: isKo ? "회사 소개" : "About", href: `${base}/about` },
    { label: isKo ? "팀원 소개" : "Team", href: `${base}/team` },
  ];

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
      style={{
        background: isScrolled ? "var(--tone-magazine-paper)" : "transparent",
        borderBottom: isScrolled
          ? "1px solid var(--tone-magazine-line)"
          : "1px solid transparent",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="mx-auto grid h-14 md:h-16 w-full max-w-[1400px] items-center px-4 md:px-6 lg:px-12 grid-cols-[1fr_auto_1fr] gap-3 md:gap-4">
        {/* Logo — square mark */}
        <Link
          href={base}
          className="flex shrink-0 items-center py-1 justify-self-start transition-opacity hover:opacity-80"
          aria-label="AIO에이전시 홈"
        >
          <BrandLogo variant="header" />
        </Link>

        {/* Desktop nav — 한글 가독성 우선 (Pretendard, 좁은 letter-spacing) */}
        <nav className="hidden items-center justify-center gap-10 lg:gap-14 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              scroll={true}
              style={{
                fontFamily: "var(--font-pretendard)",
                fontSize: "clamp(14.5px, 1.2vw, 16px)",
                letterSpacing: isKo ? "-0.005em" : "0.05em",
                color: "var(--tone-magazine-ink-2)",
                transition: "color 0.2s",
                fontWeight: 500,
              }}
              className="hover:!text-[var(--tone-magazine-ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden items-center justify-end gap-3 md:flex">
          <Link
            href={`${base}/quote`}
            className="inline-flex items-center gap-1.5 transition-colors"
            style={{
              padding: "6px 4px",
              color: "var(--tone-magazine-ink)",
              fontFamily: "var(--font-pretendard)",
              fontSize: "clamp(14px, 1.15vw, 15.5px)",
              fontWeight: 600,
              letterSpacing: "-0.005em",
            }}
          >
            <span>{t("contact")}</span>
            <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 14, color: "var(--tone-magazine-red)" }}>→</span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="메뉴"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="flex size-9 items-center justify-center justify-self-end col-start-3 md:hidden"
          style={{
            border: "1px solid var(--tone-magazine-line-2)",
            borderRadius: 999,
            color: "var(--tone-magazine-ink)",
          }}
        >
          {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="px-6 py-6 md:hidden"
          style={{
            background: "var(--tone-magazine-paper)",
            borderTop: "1px solid var(--tone-magazine-line)",
          }}
        >
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="py-3"
                style={{
                  fontFamily: "var(--font-marcellus)",
                  fontSize: 20,
                  color: "var(--tone-magazine-ink)",
                  borderBottom: "1px solid var(--tone-magazine-line-2)",
                }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-5 flex items-center gap-3">
              <Link
                href={`${base}/quote`}
                onClick={() => setMobileOpen(false)}
                className="flex-1 inline-flex h-10 items-center justify-center"
                style={{
                  background: "var(--tone-magazine-red)",
                  color: "var(--tone-magazine-paper)",
                  fontFamily: "var(--font-pretendard)",
                  fontSize: 14,
                  fontWeight: 500,
                  borderRadius: 2,
                }}
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
