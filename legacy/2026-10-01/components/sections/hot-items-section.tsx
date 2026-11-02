"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock, WalletCards } from "lucide-react";
import { useLocale } from "next-intl";
import { hotItems } from "@/lib/hot-items";
import { TypeBadge } from "@/components/ui/type-badge";

export function HotItemsSection() {
  const locale = useLocale() as "ko" | "en";
  const base = `/${locale}`;

  return (
    <section className="border-y border-white/8 bg-white/[0.02] py-10">
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-primary" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                Hot Items
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {locale === "ko" ? "외주 의뢰 전 바로 확인할 수 있는 대표 결과물" : "Representative results to review before outsourcing"}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            {locale === "ko"
              ? "가격과 납기만 보지 말고, 실제로 어떤 결과물이 납품되는지 먼저 확인하세요"
              : "Review the actual type of result you can receive, not just the price and timeline."}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {hotItems.map((item) => (
            <Link
              key={item.id}
              href={`${base}${item.href}`}
              className="group flex min-h-[360px] flex-col overflow-hidden rounded-lg border border-white/8 bg-card transition-colors hover:border-primary/50 hover:bg-white/[0.045]"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                <Image
                  src={item.image}
                  alt={item.title[locale]}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                />
                <div className="absolute left-3 top-3">
                  <TypeBadge type={item.type} />
                </div>
                <div className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-black/60 backdrop-blur">
                  <ArrowUpRight className="size-4 text-white/80 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold text-foreground">{item.title[locale]}</h3>
                <p className="mt-2 min-h-16 text-sm leading-6 text-muted-foreground">
                  {item.description[locale]}
                </p>
                <div className="mt-5 grid gap-2 text-xs text-foreground/80">
                  <span className="inline-flex items-center gap-2">
                    <WalletCards className="size-3.5 text-primary" />
                    {item.price[locale]}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock className="size-3.5 text-primary" />
                    {item.duration[locale]}
                  </span>
                </div>
                <div className="mt-auto pt-5 text-xs font-semibold text-primary">
                  {item.proof[locale]}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
