/* /content 컨텐츠 사이트 홈. 컨텐츠 셸(layout.tsx) 안에서 ContentHome(히어로 쇼릴 슬롯 · 서비스 6종 · 제작 과정 · 상담 띠)을 렌더한다. */
import { ContentHome } from "@/components/content-home/content-home";
import { divisionById } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const video = divisionById("video")!;

export function generateMetadata() {
  return pageMetadata(video.label + " 대행", video.summary, "/" + video.path);
}

export default function ContentHomePage() {
  return <ContentHome />;
}
