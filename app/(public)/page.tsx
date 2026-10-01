import MainGuide from "@/components/guide/main";
import { JsonLd } from "@/components/ui";
import { pageMetadata, siteUrl } from "@/lib/metadata";
import { publicEntries } from "@/lib/db";
export const dynamic = "force-dynamic";
export const metadata = {
  ...pageMetadata(
    "AIO MAKE · 마케팅 개발 영상",
    "분야별 전문가들이 AI와 함께 일합니다. 마케팅·개발·영상의 기획, 제작과 운영을 연결합니다.",
    "/",
  ),
  title: { absolute: "AIO MAKE · 마케팅 개발 영상" },
};
export default async function HomePage() {
  const entries = await publicEntries("reference");
  return (
    <>
      <MainGuide entries={entries} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": siteUrl + "/#organization",
          name: "AIO MAKE",
          url: siteUrl,
        }}
      />
    </>
  );
}
