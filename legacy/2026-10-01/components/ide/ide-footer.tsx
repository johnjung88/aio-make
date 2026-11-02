"use client";

import Link from "next/link";
import { Handshake, Mail, ShoppingBag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
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

export function IdeFooter() {
  const locale = useLocale();
  const t = useTranslations("footer");
  const base = `/${locale}`;
  const isKo = locale === "ko";

  const channels = [
    { id: "soomgo", label: "숨고", href: `${base}/quote?source=soomgo`, icon: <Handshake className="size-3.5" /> },
    { id: "kmong", label: "크몽", href: `${base}/quote?source=kmong`, icon: <ShoppingBag className="size-3.5" /> },
    { id: "email", label: isKo ? "이메일" : "Email", href: "mailto:aiomake2023@gmail.com", icon: <Mail className="size-3.5" /> },
  ];

  return (
    <footer
      style={{
        background: "var(--tone-ide-bg-2)",
        borderTop: "1px solid var(--tone-ide-line)",
        color: "var(--tone-ide-fg-3)",
        fontFamily: "var(--font-jetbrains)",
      }}
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-6 lg:px-12 py-10 md:py-14">
        <div className="flex flex-col gap-10 md:gap-12 md:flex-row md:items-start md:justify-between text-center md:text-left">
          {/* Brand */}
          <div className="flex flex-col gap-5 max-w-sm items-center md:items-start mx-auto md:mx-0">
            <BrandLogo variant="footer" />
            <p
              style={{
                fontFamily: "var(--font-pretendard)",
                fontSize: 14.5,
                lineHeight: 1.7,
                color: "var(--tone-ide-fg-2)",
                fontWeight: 400,
                letterSpacing: "-0.005em",
              }}
            >
              {t("tagline")}
            </p>
            <div className="flex flex-wrap gap-2 mt-1 justify-center md:justify-start">
              {channels.map((c) => (
                <Link
                  key={c.id}
                  href={c.href}
                  className="inline-flex items-center gap-2 px-4 py-2 transition-all hover:-translate-y-0.5 hover:!border-[var(--tone-ide-mint)] hover:!text-[var(--tone-ide-mint)]"
                  style={{
                    background: "var(--tone-ide-bg-3)",
                    color: "var(--tone-ide-fg-2)",
                    border: "1px solid var(--tone-ide-line)",
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    borderRadius: 4,
                  }}
                >
                  {c.icon}
                  {c.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-8 md:gap-x-12 gap-y-8 md:gap-y-6 sm:grid-cols-3 mx-auto md:mx-0 text-center sm:text-left">
            <div className="flex flex-col gap-3 items-center sm:items-start">
              <p
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "10.5px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--tone-ide-mint)",
                }}
              >
                # {t("services")}
              </p>
              {disciplines.map((d) => {
                const linkStyle: React.CSSProperties = {
                  fontFamily: "var(--font-pretendard)",
                  fontSize: 14,
                  fontWeight: 400,
                  letterSpacing: "-0.005em",
                  color: d.available
                    ? "var(--tone-ide-fg)"
                    : "var(--tone-ide-fg-faint)",
                };
                if (d.available && d.href) {
                  return (
                    <Link
                      key={d.label}
                      href={`${base}${d.href}`}
                      className="transition-colors hover:!text-[var(--tone-ide-mint)]"
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
                        color: "var(--tone-ide-fg-faint)",
                      }}
                    >
                      soon
                    </span>
                  </span>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 items-center sm:items-start">
              <p
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "10.5px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--tone-ide-mint)",
                }}
              >
                # {t("company")}
              </p>
              {[
                { label: isKo ? "회사 소개" : "About", href: `${base}/about` },
                { label: t("contact"), href: `${base}/quote` },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:!text-[var(--tone-ide-mint)]"
                  style={{
                    fontFamily: "var(--font-pretendard)",
                    fontSize: 14,
                    color: "var(--tone-ide-fg)",
                    fontWeight: 400,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3 items-center sm:items-start">
              <p
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "10.5px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--tone-ide-mint)",
                }}
              >
                # {t("contact")}
              </p>
              <Link
                href="mailto:aiomake2023@gmail.com"
                className="transition-colors hover:!text-[var(--tone-ide-mint)]"
                style={{
                  fontFamily: "var(--font-pretendard)",
                  fontSize: 14,
                  color: "var(--tone-ide-fg)",
                  fontWeight: 400,
                  letterSpacing: "-0.005em",
                }}
              >
                aiomake2023@gmail.com
              </Link>
            </div>
          </div>
        </div>

        {/* Business info */}
        <div
          className="mt-14 pt-6 text-center"
          style={{ borderTop: "1px solid var(--tone-ide-line)" }}
        >
          <div
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "clamp(9.5px, 0.9vw, 10.5px)",
              letterSpacing: "0.18em",
              color: "var(--tone-ide-fg-faint)",
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
