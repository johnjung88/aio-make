"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const STEPS = ["step1", "step2", "step3", "step4"] as const;

export function ProcessSection() {
  const t = useTranslations("process");

  return (
    <section id="process" className="py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12">

        <div className="mb-16 flex items-center gap-3">
          <span className="h-px w-10 bg-primary" />
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            {t("sectionTitle")}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
              className="relative flex flex-col gap-4 rounded-2xl border border-white/8 bg-card p-6"
            >
              <span className="font-mono text-4xl font-bold text-white/8 select-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{t(`${step}Title`)}</h3>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">{t(`${step}Desc`)}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="absolute -right-2 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-white/15 lg:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
