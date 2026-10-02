import AboutGuide from "@/components/guide/about";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "회사소개",
  "영상·마케팅·개발, 분야별 전문가와 AI가 함께 일합니다",
  "/about",
);
export default function AboutPage() {
  return <AboutGuide />;
}
