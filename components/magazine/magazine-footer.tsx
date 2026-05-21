"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";
import { useLocale, useTranslations } from "next-intl";


const disciplines = [
  { label: "개발", href: "/services/development", available: true },
  { label: "디자인", href: "/services/design", available: true },
  { label: "영상", href: "/services/video", available: true },
  { label: "마케팅", href: "/services/marketing", available: true },
];

export function MagazineFooter() {
  const locale = useLocale();
  const t = useTranslations("footer");
  const base = `/${locale}`;

  return (
    <footer
      style={{
        background: "var(--tone-magazine-paper)",
        borderTop: "1px solid var(--tone-magazine-ink)",
        color: "var(--tone-magazine-ink-2)",
      }}
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-6 lg:px-12 py-10 md:py-16">
        {/* Top meta row */}
        <div
          className="flex flex-wrap items-center justify-center gap-2.5 md:gap-[18px] pb-6 mb-8 md:mb-12"
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: 11,
            color: "var(--tone-magazine-ink-3)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            borderBottom: "1px solid var(--tone-magazine-line-2)",
          }}
        >
          <span>Issue 2026 · May</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--tone-magazine-ink-3)" }} />
          <span style={{ fontFamily: "var(--font-marcellus)", letterSpacing: "0.4em", color: "var(--tone-magazine-ink)" }}>
            A&nbsp;·&nbsp;I&nbsp;·&nbsp;O&nbsp;&nbsp; S T U D I O
          </span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--tone-magazine-ink-3)" }} />
          <span>est 2024 · Korea</span>
        </div>

        <div className="flex flex-col gap-10 md:gap-12 md:flex-row md:items-start md:justify-between text-center md:text-left">
          {/* Brand */}
          <div className="flex flex-col gap-5 max-w-sm items-center md:items-start mx-auto md:mx-0">
            <BrandLogo variant="footer" />
            <p
              style={{
                fontFamily: "var(--font-pretendard)",
                fontSize: 15,
                lineHeight: 1.7,
                color: "var(--tone-magazine-ink-2)",
                fontWeight: 400,
                letterSpacing: "-0.005em",
              }}
            >
              {t("tagline")}
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-8 md:gap-x-12 gap-y-8 md:gap-y-6 sm:grid-cols-3 mx-auto md:mx-0 text-center sm:text-left">
            {/* Services */}
            <div className="flex flex-col gap-3 items-center sm:items-start">
              <p
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "10.5px",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "var(--tone-magazine-ink-3)",
                }}
              >
                — {t("services")}
              </p>
              {disciplines.map((d) => {
                const linkStyle = {
                  fontFamily: "var(--font-pretendard)",
                  fontSize: 14.5,
                  fontWeight: 400,
                  letterSpacing: "-0.005em",
                  color: d.available
                    ? "var(--tone-magazine-ink)"
                    : "var(--tone-magazine-ink-faint)",
                };
                if (d.available && d.href) {
                  return (
                    <Link
                      key={d.label}
                      href={`${base}${d.href}`}
                      className="transition-colors hover:!text-[var(--tone-magazine-red)]"
                      style={linkStyle}
                    >
                      {d.label}
                    </Link>
                  );
                }
                return (
                  <span key={d.label} style={{ ...linkStyle, cursor: "default" }}>
                    {d.label}
                    <span
                      style={{
                        marginLeft: 6,
                        fontFamily: "var(--font-jetbrains)",
                        fontSize: 9,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--tone-magazine-ink-faint)",
                      }}
                    >
                      soon
                    </span>
                  </span>
                );
              })}
            </div>

            {/* Company */}
            <div className="flex flex-col gap-3 items-center sm:items-start">
              <p
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "10.5px",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "var(--tone-magazine-ink-3)",
                }}
              >
                — {t("company")}
              </p>
              {[
                { label: locale === "ko" ? "회사 소개" : "About", href: `${base}/about` },
                { label: t("contact"), href: `${base}/quote` },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:!text-[var(--tone-magazine-red)]"
                  style={{
                    fontFamily: "var(--font-pretendard)",
                    fontSize: 14.5,
                    color: "var(--tone-magazine-ink)",
                    fontWeight: 400,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Contact — 모바일 가운데 고정 */}
            <div className="col-span-2 sm:col-span-1 flex flex-col gap-3 items-center sm:items-start text-center sm:text-left">
              <p
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "10.5px",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "var(--tone-magazine-ink-3)",
                }}
              >
                — {t("contact")}
              </p>
              <Link
                href="mailto:aiomake2023@gmail.com"
                className="transition-colors hover:!text-[var(--tone-magazine-red)]"
                style={{
                  fontFamily: "var(--font-pretendard)",
                  fontSize: 15,
                  color: "var(--tone-magazine-ink)",
                }}
              >
                aiomake2023@gmail.com
              </Link>
            </div>
          </div>
        </div>

        {/* Business info bar */}
        <div
          className="mt-14 pt-6 text-center"
          style={{ borderTop: "1px solid var(--tone-magazine-line-2)" }}
        >
          <div
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "clamp(9.5px, 0.9vw, 10.5px)",
              letterSpacing: "0.18em",
              color: "var(--tone-magazine-ink-3)",
              lineHeight: 1.85,
            }}
          >
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
