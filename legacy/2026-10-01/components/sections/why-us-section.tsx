"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Headphones, Rocket, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

const ICONS = [Headphones, Rocket, BadgeCheck, ShieldCheck];
const KEYS = ["response", "delivery", "quality", "maintenance"] as const;

export function WhyUsSection() {
  const t = useTranslations("whyUs");

  return (
    <section id="why-us" className="py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12">

        <div className="mb-16 flex items-center gap-3">
          <span className="h-px w-10 bg-primary" />
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            {t("sectionTitle")}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KEYS.map((key, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: "easeOut" }}
                className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-card p-6 transition-colors hover:border-white/16"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="size-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{t(key)}</h3>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">{t(`${key}Desc`)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
