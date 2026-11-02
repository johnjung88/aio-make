import { PageBreadcrumb } from "@/components/page-breadcrumb";
import AboutGuide from "@/components/guide/about";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "회사 소개",
  "컨텐츠·마케팅·개발, 분야별 전문가와 AI가 함께 일합니다",
  "/about",
);
export default function AboutPage() {
  return <><PageBreadcrumb path="/about" />{<AboutGuide />}</>;
}
