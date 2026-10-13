/* /content/contact 컨텐츠 문의. ?service=<6종 id>면 그 서비스를 미리 선택한다. */
import { ContentContact } from "@/components/content-site/contact/contact-page";
import { divisionById } from "@/lib/content";
import { isContentServiceId } from "@/lib/content-site/types";
import { pageMetadata } from "@/lib/metadata";

const video = divisionById("video")!;

export function generateMetadata() {
  return pageMetadata(
    video.label + " 문의",
    `${video.label} 프로젝트에 필요한 작업, 준비 자료, 일정과 예산을 알려주세요 담당자가 범위를 확인해 안내합니다`,
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
