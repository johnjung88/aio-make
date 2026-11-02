"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

interface Bundle {
  id: string;
  name: { ko: string; en: string };
  description: { ko: string; en: string };
  items: { ko: string; en: string }[];
  eventPrice: string;
  regularPrice: string;
  badge: string;
  featured?: boolean;
}

const BUNDLES: Bundle[] = [
  {
    id: "a",
    name: { ko: "런칭 패키지", en: "Launch Package" },
    description: { ko: "브랜드 첫 화면을 빠르게 준비하는 구성", en: "A fast starter set for a new brand" },
    items: [
      { ko: "랜딩페이지 (1P)", en: "Landing page (1P)" },
      { ko: "로고 디자인", en: "Logo design" },
      { ko: "명함 디자인", en: "Business card" },
    ],
    eventPrice: "₩60,000~",
    regularPrice: "₩400,000~",
    badge: "빠른 시작",
  },
  {
    id: "b",
    name: { ko: "성장 패키지", en: "Growth Package" },
    description: { ko: "홈페이지와 마케팅 콘텐츠를 함께 정리", en: "Website and marketing content together" },
    featured: true,
    items: [
      { ko: "프리미엄 5페이지 홈페이지", en: "Premium 5-page website" },
      { ko: "마케팅 영상 30초", en: "Marketing video 30s" },
      { ko: "카드뉴스 5장", en: "Card news ×5" },
      { ko: "SNS 프로필 세팅", en: "SNS profile setup" },
    ],
    eventPrice: "₩350,000~",
    regularPrice: "₩1,300,000~",
    badge: "추천 구성",
  },
  {
    id: "c",
    name: { ko: "통합 패키지", en: "Integrated Package" },
    description: { ko: "웹·앱·자동화를 한 번에 준비", en: "Website, app, and automation together" },
    items: [
      { ko: "프리미엄 5페이지 홈페이지", en: "Premium 5-page website" },
      { ko: "앱 MVP 기본", en: "App MVP Basic" },
      { ko: "간단 자동화 1종", en: "Simple automation ×1" },
    ],
    eventPrice: "₩700,000~",
    regularPrice: "₩2,100,000~",
    badge: "통합 구성",
  },
];

export function BundleCards() {
  const locale = useLocale() as "ko" | "en";
  const base = `/${locale}`;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {BUNDLES.map((bundle) => (
        <div
          key={bundle.id}
          className={`relative flex flex-col gap-5 rounded-2xl border p-6 ${
            bundle.featured
              ? "border-primary/40 bg-primary/5"
              : "border-white/8 bg-card"
          }`}
        >
          {bundle.featured && (
            <span className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground">
              BEST
            </span>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Bundle {bundle.id.toUpperCase()}
            </p>
            <h3 className="mt-1 text-lg font-bold text-foreground">
              {bundle.name[locale]}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {bundle.description[locale]}
            </p>
          </div>

          <ul className="flex flex-col gap-2">
            {bundle.items.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="size-3.5 shrink-0 text-primary" />
                {item[locale]}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex items-end justify-between border-t border-white/8 pt-4">
            <div>
              <p className="font-mono text-xl font-bold text-primary">{bundle.eventPrice}</p>
              <p className="text-xs text-muted-foreground line-through">{bundle.regularPrice}</p>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-400">
              {bundle.badge}
            </span>
          </div>

          <Link
            href={`${base}/quote`}
            className="inline-flex h-9 items-center justify-center rounded-full border border-white/12 text-xs font-semibold text-foreground transition-colors hover:border-white/25 hover:bg-white/5"
          >
            {locale === "ko" ? "견적 문의" : "Get a Quote"}
          </Link>
        </div>
      ))}
    </div>
  );
}
