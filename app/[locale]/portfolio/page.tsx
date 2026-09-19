import { Projects } from "@/components/marketing/site";
import { localizedPageMetadata } from "@/lib/seo";
export const metadata = localizedPageMetadata({
  locale: "ko",
  path: "/portfolio",
  title: "자체 운영 프로젝트",
  description:
    "재방문 준비·콘텐츠 운영·유입 측정. AIO의 통합 마케팅 안내입니다.",
});
export default function Page() {
  return <Projects />;
}
