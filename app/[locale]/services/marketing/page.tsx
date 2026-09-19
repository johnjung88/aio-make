import { MarketingPage } from "@/components/marketing/site";
import { localizedPageMetadata } from "@/lib/seo";
export const metadata = localizedPageMetadata({
  locale: "ko",
  path: "/services/marketing",
  title: "통합 마케팅 서비스·가격",
  description:
    "재방문 준비·콘텐츠 운영·유입 측정. AIO의 통합 마케팅 안내입니다.",
});
export default function Page() {
  return <MarketingPage />;
}
