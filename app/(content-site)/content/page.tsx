/* /content 컨텐츠 홈. P3 ContentHome을 컨텐츠 셸 안에서 그대로 렌더한다(셸에 맞춘 재스타일은 WP-D). */
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
