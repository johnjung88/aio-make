"use client";
import { useState } from "react";
import Link from "next/link";

interface Props {
  locale: string;
}

const webPackages = [
  {
    name: "Light", price: "9.9만~", days: "1 DAY", featured: false,
    rows: { page_count: "1p (랜딩)", composition: "회사소개·문의 1p", responsive: true, seo_setup: false, revisions: "1회", free_warranty: "30일" },
  },
  {
    name: "Standard", price: "19.9만~", days: "2-3 DAYS", featured: true,
    rows: { page_count: "3p", composition: "메인·소개·문의", responsive: true, seo_setup: true, revisions: "2회", free_warranty: "30일" },
  },
  {
    name: "Premium", price: "34.9만~", days: "3-5 DAYS", featured: false,
    rows: { page_count: "5p", composition: "메인·소개·서비스·포트폴리오·문의", responsive: true, seo_setup: true, revisions: "3회", free_warranty: "60일" },
  },
];

const shopPackages = [
  {
    name: "Light", price: "14.9만~", days: "2 DAYS", featured: false,
    rows: { main_layout: "기본", products: "3개", category_banner: "기본 정리", product_detail: false, responsive: true, revisions: "1회", free_warranty: "30일" },
  },
  {
    name: "Standard", price: "24.9만~", days: "3-5 DAYS", featured: true,
    rows: { main_layout: "판매형 개선", products: "5개", category_banner: "정리 + 문구", product_detail: false, responsive: true, revisions: "2회", free_warranty: "30일" },
  },
  {
    name: "Premium", price: "39.9만~", days: "5 DAYS", featured: false,
    rows: { main_layout: "브랜드형", products: "10개", category_banner: "풀 정리", product_detail: true, responsive: true, revisions: "3회", free_warranty: "60일" },
  },
];

const addons = [
  { label: "추가 페이지 1p", price: "+5만" },
  { label: "원고 정리·카피 강화", price: "+3만~" },
  { label: "긴급 작업 (24h)", price: "+3만" },
  { label: "상품 추가 등록", price: "+1만/개" },
  { label: "배너 추가 제작", price: "+2만/개" },
  { label: "예약·결제 기능", price: "별도 견적" },
];

type Tab = "web" | "shop";

export function IdePricing({ locale }: Props) {
  const [tab, setTab] = useState<Tab>("web");
  const packages = tab === "web" ? webPackages : shopPackages;
  const rowKeys = tab === "web"
    ? ["page_count", "composition", "responsive", "seo_setup", "revisions", "free_warranty"]
    : ["main_layout", "products", "category_banner", "product_detail", "responsive", "revisions", "free_warranty"];

  return (
    <section
      className="mx-auto"
      style={{ padding: "80px clamp(16px,3vw,24px)", maxWidth: 1180 }}
    >
      {/* Head */}
      <div className="mx-auto mb-10 max-w-[760px] text-center">
        <div
          className="mb-[14px] inline-flex items-center gap-2 text-[12px]"
          style={{ fontFamily: "var(--font-jetbrains)", color: "var(--tone-ide-mint)" }}
        >
          <span style={{ color: "var(--tone-ide-fg-3)" }}>$</span>
          <span style={{ color: "var(--tone-ide-syntax-string)" }}>aio pricing</span>
          <span style={{ color: "var(--tone-ide-amber)" }}>--web</span>
          <span style={{ color: "var(--tone-ide-amber)" }}>--shop</span>
        </div>
        <h2
          className="font-bold mb-[14px]"
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "clamp(30px,4.2vw,52px)",
            letterSpacing: "-0.022em",
            lineHeight: 1.08,
            color: "var(--tone-ide-fg)",
          }}
        >
          패키지 · <span style={{ color: "var(--tone-ide-mint)" }}>투명한 견적</span>
        </h2>
        <p
          style={{
            fontFamily: "var(--font-pretendard)",
            fontSize: "15.5px",
            color: "var(--tone-ide-fg-2)",
            lineHeight: 1.6,
          }}
        >
          웹사이트와 쇼핑몰은 구축 체계가 다릅니다.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div
          className="inline-flex"
          style={{
            background: "var(--tone-ide-bg-2)",
            border: "1px solid var(--tone-ide-line)",
            borderRadius: 6,
            padding: 4,
            gap: 4,
          }}
        >
          {(["web", "shop"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2 text-[13px] font-medium rounded transition-all"
              style={{
                fontFamily: "var(--font-jetbrains)",
                background: tab === t ? "var(--tone-ide-mint)" : "transparent",
                color: tab === t ? "var(--tone-ide-bg)" : "var(--tone-ide-fg-2)",
                border: "none",
                cursor: "pointer",
              }}
            >
              {t === "web" ? "웹사이트" : "쇼핑몰"}{" "}
              <span
                style={{
                  fontSize: "10px",
                  opacity: 0.75,
                  marginLeft: 4,
                }}
              >
                {t === "web" ? "9.9만~" : "14.9만~"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Package cards */}
      <div
        className="grid mb-8"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}
      >
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className="flex flex-col"
            style={{
              background: "var(--tone-ide-bg-2)",
              border: `1px solid ${pkg.featured ? "var(--tone-ide-mint)" : "var(--tone-ide-line)"}`,
              borderRadius: 8,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {pkg.featured && (
              <div
                className="text-center py-[6px] text-[10px] font-semibold tracking-[0.18em] uppercase"
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  background: "var(--tone-ide-mint)",
                  color: "var(--tone-ide-bg)",
                }}
              >
                recommended
              </div>
            )}

            <div className="p-6 flex-1 flex flex-col">
              <div
                className="mb-1 text-[12px] tracking-[0.04em]"
                style={{ fontFamily: "var(--font-jetbrains)", color: "var(--tone-ide-fg-3)" }}
              >
                ▸ {pkg.days}
              </div>
              <div
                className="font-bold mb-1"
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: 18,
                  color: pkg.featured ? "var(--tone-ide-mint)" : "var(--tone-ide-fg)",
                }}
              >
                {pkg.name}
              </div>
              <div
                className="font-bold mb-6"
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "clamp(24px,3vw,32px)",
                  letterSpacing: "-0.02em",
                  color: "var(--tone-ide-fg)",
                }}
              >
                <span style={{ fontSize: "0.55em", color: "var(--tone-ide-fg-3)", fontWeight: 400 }}>₩</span>
                {pkg.price}
              </div>

              <div
                className="flex flex-col gap-[6px] mb-6 flex-1 text-[13px]"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                {rowKeys.map((key) => {
                  const val = (pkg.rows as Record<string, string | boolean>)[key];
                  return (
                    <div key={key} className="flex justify-between items-baseline gap-2">
                      <span style={{ color: "var(--tone-ide-syntax-blue)" }}>{key}</span>
                      <span style={{ color: typeof val === "boolean" ? (val ? "var(--tone-ide-mint)" : "var(--tone-ide-fg-faint)") : "var(--tone-ide-fg-2)" }}>
                        {typeof val === "boolean" ? (val ? "✓" : "—") : String(val)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <Link
                href={`/${locale}/quote`}
                className="block text-center py-[11px] text-[13px] font-semibold rounded-md transition-all hover:-translate-y-0.5"
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  background: pkg.featured ? "var(--tone-ide-mint)" : "var(--tone-ide-bg-3)",
                  color: pkg.featured ? "var(--tone-ide-bg)" : "var(--tone-ide-fg)",
                  border: `1px solid ${pkg.featured ? "var(--tone-ide-mint)" : "var(--tone-ide-line-2)"}`,
                  textDecoration: "none",
                }}
              >
                선택
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add-ons */}
      <div
        className="p-6"
        style={{
          background: "var(--tone-ide-bg-2)",
          border: "1px solid var(--tone-ide-line)",
          borderRadius: 8,
        }}
      >
        <div
          className="mb-4 text-[11px] tracking-[0.18em] uppercase"
          style={{ fontFamily: "var(--font-jetbrains)", color: "var(--tone-ide-fg-3)" }}
        >
          {"//"} add-ons
        </div>
        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}
        >
          {addons.map((a) => (
            <div
              key={a.label}
              className="flex justify-between items-center px-4 py-[10px]"
              style={{
                background: "var(--tone-ide-bg-3)",
                border: "1px solid var(--tone-ide-line-2)",
                borderRadius: 4,
                fontFamily: "var(--font-jetbrains)",
                fontSize: 12,
              }}
            >
              <span style={{ color: "var(--tone-ide-fg-2)" }}>{a.label}</span>
              <span style={{ color: "var(--tone-ide-mint)", fontWeight: 600 }}>{a.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
