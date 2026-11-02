"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface KpiItem {
  value: string;
  unit: string;
  labelKey: string;
}

const KPI_ITEMS: KpiItem[] = [
  { value: "18", unit: "+", labelKey: "projects" },
  { value: "5", unit: "일", labelKey: "avgDelivery" },
  { value: "8", unit: "개국", labelKey: "countries" },
  { value: "189", unit: "", labelKey: "pythonFiles" },
  { value: "68/68", unit: "", labelKey: "testsPassing" },
  { value: "2", unit: "h", labelKey: "responseTime" },
  { value: "10", unit: "%", labelKey: "refundGuarantee" },
];

export function KpiStrip() {
  const t = useTranslations("kpi");

  return (
    <div className="w-full overflow-x-auto py-6 scrollbar-none">
      <div className="flex min-w-max items-stretch gap-px border-y border-white/8">
        {KPI_ITEMS.map((kpi, i) => (
          <motion.div
            key={kpi.labelKey}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
            className="flex min-w-[120px] flex-col items-center justify-center gap-1 px-8 py-6 text-center"
          >
            <span className="font-mono text-3xl font-bold tabular-nums text-foreground">
              {kpi.value}
              <span className="ml-0.5 text-lg text-primary">{kpi.unit}</span>
            </span>
            <span className="text-xs text-muted-foreground">{t(kpi.labelKey)}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
