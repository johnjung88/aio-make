import { notFound } from "next/navigation";
import { divisionByPath } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { MarketingHome } from "@/components/marketing/home";
import { JsonLd } from "@/components/ui";
import { faqSchema } from "@/lib/seo";
import { marketingHomeFaq } from "@/lib/marketing-home-faq";
export async function generateMetadata() {
  const d = divisionByPath("marketing");
  return d ? pageMetadata(d.label + " 대행", d.summary, "/" + d.path) : {};
}
export default async function MarketingPage() {
  const d = divisionByPath("marketing");
  if (!d || d.id === "video") notFound();
  return (
    <>
      <MarketingHome />
      <JsonLd data={faqSchema(marketingHomeFaq)} />
    </>
  );
}
