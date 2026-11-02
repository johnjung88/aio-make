"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { servicesData } from "@/lib/services-data";

export function ServicesSection() {
  const [open, setOpen] = useState<string | null>(null);
  const t = useTranslations("services");
  const locale = useLocale() as "ko" | "en";
  const base = `/${locale}`;

  return (
    <section id="services" className="py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12">

        <div className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-primary" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              {t("sectionTitle")}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {t("sectionSubtitle")}
          </span>
        </div>

        <div className="divide-y divide-white/8 border-t border-white/8">
          {servicesData.map((service, idx) => (
            <div key={service.id}>
              <button
                type="button"
                onClick={() => setOpen(open === service.id ? null : service.id)}
                className="group flex w-full items-center gap-6 py-8 text-left focus-visible:outline-none lg:py-10"
              >
                <span className="w-10 shrink-0 text-xs font-medium text-muted-foreground lg:w-14">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span
                  className="flex-1 font-bold tracking-[-0.02em] text-foreground transition-colors group-hover:text-primary"
                  style={{ fontSize: "clamp(24px, 3.5vw, 58px)", lineHeight: 1.08 }}
                >
                  {service.title[locale]}
                </span>
                <ArrowUpRight
                  className={`size-6 shrink-0 text-muted-foreground transition-all duration-300 group-hover:text-primary ${
                    open === service.id ? "rotate-45 text-primary" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {open === service.id && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-6 pb-10 pl-16 lg:flex-row lg:items-start lg:gap-16 lg:pl-20">
                      <p className="w-full max-w-full text-sm leading-7 text-muted-foreground lg:max-w-sm">
                        {service.description[locale]}
                      </p>
                      <ul className="flex flex-col gap-y-2.5 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-2.5">
                        {service.items.map((item) => (
                          <li
                            key={item.name[locale]}
                            className="flex items-center gap-2 text-sm text-foreground/70"
                          >
                            <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                            {item.name[locale]}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`${base}/services/${service.id}`}
                        className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        {locale === "ko" ? "자세히 보기" : "Learn more"}
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
