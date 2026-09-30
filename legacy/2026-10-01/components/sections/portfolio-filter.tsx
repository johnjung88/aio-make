"use client";

import { useLocale } from "next-intl";
import { portfolioGroups, type PortfolioGroup } from "@/lib/portfolio-data";

type FilterValue = PortfolioGroup | "all";

interface PortfolioFilterProps {
  active: FilterValue;
  onChange: (value: FilterValue) => void;
  counts?: Partial<Record<FilterValue, number>>;
}

export function PortfolioFilter({ active, onChange, counts = {} }: PortfolioFilterProps) {
  const locale = useLocale() as "ko" | "en";

  return (
    <div className="flex flex-wrap gap-2">
      {portfolioGroups.map(({ value, icon, label }) => {
        const isActive = active === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
            }`}
          >
            {icon && <span>{icon}</span>}
            {label[locale]}
            {counts[value] !== undefined && (
              <span
                className={`rounded-full px-1.5 text-[10px] ${
                  isActive ? "bg-primary-foreground/20" : "bg-white/10"
                }`}
              >
                {counts[value]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
