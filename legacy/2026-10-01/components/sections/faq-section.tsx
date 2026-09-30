"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ALL_FAQ_KEYS = ["1", "2", "3", "4", "5", "6"] as const;

interface Props {
  scope?: "general" | string;
  limit?: number;
}

export function FaqSection({ scope = "general", limit = 6 }: Props) {
  const t = useTranslations("faq");

  if (scope !== "general") return null;

  const keys = ALL_FAQ_KEYS.slice(0, limit);

  return (
    <section id="faq" className="py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12">

        <div className="mb-16 flex items-center gap-3">
          <span className="h-px w-10 bg-primary" />
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">FAQ</span>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2
              className="font-bold leading-tight tracking-[-0.02em] text-foreground"
              style={{ fontSize: "clamp(32px, 3.5vw, 52px)" }}
            >
              {t("sectionTitle")}
            </h2>
          </div>

          <Accordion className="divide-y divide-white/8 border-t border-white/8">
            {keys.map((key) => (
              <AccordionItem key={key} value={`faq-${key}`} className="border-0">
                <AccordionTrigger className="py-6 text-left text-sm font-medium text-foreground hover:text-primary hover:no-underline [&[data-state=open]]:text-primary">
                  {t(`q${key}`)}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-sm leading-7 text-muted-foreground">
                  {t(`a${key}`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
