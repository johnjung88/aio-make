import { divisions, services } from "@/lib/content";
import { siteUrl, siteDescription } from "@/lib/metadata";

// A concise navigation aid; this file does not establish indexing or AI citations.
export function GET() {
  const body = [
    "# AIO MAKE",
    "",
    `> ${siteDescription}`,
    "",
    "한국어 서비스 안내 사이트입니다 각 서비스 페이지에서 제공 범위, 준비 자료, 진행 방법을 확인할 수 있습니다",
    "작업 페이지는 제작 예시와 실제 작업의 상태를 구분합니다 시안은 고객 채택이나 운영 성과를 뜻하지 않습니다",
    "",
    "## 회사와 문의",
    `- [AIO 소개](${siteUrl}/about): 회사와 제공 서비스`,
    `- [프로젝트 문의](${siteUrl}/contact): 필요한 작업과 준비 자료 전달`,
    "",
    ...divisions.flatMap((division) => [
      `## ${division.label}`,
      ...services
        .filter((service) => service.division === division.id)
        .map(
          (service) =>
            `- [${service.name}](${siteUrl}/${division.path}/services/${service.id}): ${service.description}`,
        ),
      "",
    ]),
  ].join("\n");
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
