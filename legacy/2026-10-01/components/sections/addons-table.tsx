"use client";

import { useLocale } from "next-intl";
import type { AddonItem } from "@/lib/services-data";

interface AddonsTableProps {
  addons: AddonItem[];
}

export function AddonsTable({ addons }: AddonsTableProps) {
  const locale = useLocale() as "ko" | "en";

  return (
    <div className="overflow-hidden rounded-xl border border-white/8">
      <table className="w-full text-sm">
        <tbody>
          {addons.map((addon, i) => (
            <tr
              key={i}
              className={`flex items-center justify-between gap-4 px-4 py-3 ${
                i % 2 === 0 ? "bg-white/2" : "bg-transparent"
              }`}
            >
              <td className="text-foreground/80">{addon.name[locale]}</td>
              <td className="font-mono text-xs text-primary">{addon.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
