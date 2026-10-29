/* /content/contact 컨텐츠 문의. ?service=<6종 id>면 그 서비스를 미리 선택한다. */
import { ContentContact } from "@/components/content-site/contact/contact-page";
import { divisionById } from "@/lib/content";
import { isContentServiceId } from "@/lib/content-site/types";
import { pageMetadata } from "@/lib/metadata";

const video = divisionById("video")!;

export function generateMetadata() {
  return pageMetadata(
    video.label + " 문의",
    "웹툰부터 SNS 광고 영상까지 필요한 컨텐츠와 일정을 알려주세요\n담당자가 범위와 견적을 안내합니다",
    "/" + video.path + "/contact",
  );
}

export default async function ContentContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string | string[] }>;
}) {
  const raw = (await searchParams).service;
  const id = Array.isArray(raw) ? raw[0] : raw;
  return <ContentContact service={isContentServiceId(id) ? id : undefined} />;
}
