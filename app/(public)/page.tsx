import MainGuide from "@/components/guide/main";
import { JsonLd } from "@/components/ui";
import { pageMetadata, siteDescription } from "@/lib/metadata";
import { websiteSchema } from "@/lib/seo";
import { publicEntries } from "@/lib/db";
import { homeJourneyData } from "@/lib/home-journey-data";
export const dynamic = "force-dynamic";
export const metadata = {
  ...pageMetadata(
    "AIO MAKE | 올인원 에이전시",
    siteDescription,
    "/",
  ),
  title: { absolute: "AIO MAKE | 올인원 에이전시" },
};
export default async function HomePage() {
  const entries = await publicEntries("reference");
  return (
    <>
      <MainGuide entries={entries} journey={homeJourneyData(entries)} />
      <JsonLd data={websiteSchema} />
    </>
  );
}
