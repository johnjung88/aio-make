import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ServiceDetail } from "@/lib/services-data";

interface Props {
  service: ServiceDetail;
  locale: string;
}

export function CategoryFaq({ service, locale }: Props) {
  const lang = locale === "ko" ? "ko" : "en";
  const faqs = service.faqs;

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="mt-16 border-t border-white/8 pt-16">
      <h2 className="mb-8 text-sm font-semibold text-foreground">
        {lang === "ko"
          ? `${service.title[lang]} 자주 묻는 질문`
          : `${service.title[lang]} FAQ`}
      </h2>

      <Accordion className="divide-y divide-white/8 border-t border-white/8">
        {faqs.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border-0">
            <AccordionTrigger className="py-6 text-left text-sm font-medium text-foreground hover:text-primary hover:no-underline [&[data-state=open]]:text-primary">
              {item.q[lang]}
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-sm leading-7 text-muted-foreground">
              {item.a[lang]}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
