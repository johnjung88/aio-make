import MainGuide from "@/components/guide/main";
import { JsonLd } from "@/components/ui";
import { pageMetadata, siteDescription } from "@/lib/metadata";
import { websiteSchema } from "@/lib/seo";
import { publicEntries } from "@/lib/db";
export const dynamic = "force-dynamic";
export const metadata = {
  ...pageMetadata(
    "AIO MAKE | 영상·마케팅·웹사이트 제작",
    siteDescription,
    "/",
  ),
  title: { absolute: "AIO MAKE | 영상·마케팅·웹사이트 제작" },
};
export default async function HomePage() {
  const entries = await publicEntries("reference");
  return (
    <>
      <MainGuide entries={entries} />
      <JsonLd data={websiteSchema} />
    </>
  );
}
