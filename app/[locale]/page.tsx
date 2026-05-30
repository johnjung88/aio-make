import { MagazineCover } from "@/components/magazine/magazine-cover";
import { MagazineBanner } from "@/components/magazine/magazine-banner";
import { MagazineEditorsNote } from "@/components/magazine/magazine-editors-note";
import { MagazineToc } from "@/components/magazine/magazine-toc";
import { MagazineVoices } from "@/components/magazine/magazine-voices";
import { MagazineEditorial } from "@/components/magazine/magazine-editorial";
import { getTranslations } from "next-intl/server";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return localizedPageMetadata({
    locale,
    title: t("headline"),
    description: t("subheadline"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main data-tone="magazine" style={{ background: "var(--tone-magazine-paper)" }}>
      <MagazineCover />
      <MagazineBanner />
      <MagazineEditorsNote />
      <MagazineToc locale={locale} />
      <MagazineVoices />
      <MagazineEditorial locale={locale} />
    </main>
  );
}
