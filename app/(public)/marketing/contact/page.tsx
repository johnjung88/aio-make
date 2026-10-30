import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { notFound } from "next/navigation";
import { divisionByPath, serviceById } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import MarketingContact from "@/components/guide/marketing-contact";
export async function generateMetadata() {
  const d = divisionByPath("marketing");
  return d
    ? pageMetadata(
        d.label + " 문의",
        `${d.label} 프로젝트에 필요한 작업, 준비 자료, 일정과 예산을 알려주세요 담당자가 범위를 확인해 안내합니다`,
        "/" + d.path + "/contact",
      )
    : {};
}
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{
    service?: string;
    plan?: string;
    entry?: string;
    message?: string;
  }>;
}) {
  const d = divisionByPath("marketing");
  if (!d) notFound();
  const query = await searchParams;
  const id = query.service,
    service = id && serviceById(d.id, id);
  const plans: Record<string, string> = {
    channels: "월간 채널 배치",
    preview: "한 소재, 세 채널 미리보기",
    persona: "인물 설정과 한 달 편성",
    checklist: "검색·답변 구조 점검",
  };
  const plan = query.plan && plans[query.plan] ? plans[query.plan] : "";
  const entry = [
    "hero",
    "signature",
    "pricing",
    "faq",
    "inquiry",
    "home-finder",
  ].includes(query.entry ?? "")
    ? query.entry
    : "";
  return <><PageBreadcrumb path="/marketing/contact" />{(
    <MarketingContact
      service={service ? service.id : undefined}
      initialMessage={
        typeof query.message === "string" ? query.message.slice(0, 400) : ""
      }
      selectedPlan={plan}
      entry={entry}
    />
  )}</>;
}
