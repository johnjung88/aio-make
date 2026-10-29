import { divisions, services } from "@/lib/content";
import { siteUrl, siteDescription } from "@/lib/metadata";
import { organizationSchema } from "@/lib/seo";
export function GET() {
  const lines = [
    "# AIO MAKE",
    "",
    "> " + siteDescription,
    "",
    "브랜드: AIO MAKE / 법적 상호: 에이아이오 (AIO).",
    "연락처: " + organizationSchema.email,
    "공개 가격의 정본은 각 서비스 상세 페이지입니다\n컨텐츠 가격은 부가세 별도이며, 마케팅 월 운영의 단위·최소 기간은 각 페이지에서 확인합니다\n개발의 VAT와 외부 비용은 개별 견적에서 확인합니다",
    "사례의 제작 예시·시안·실제 작업 상태를 구분합니다\n시안은 고객 채택이나 운영 성과를 뜻하지 않습니다",
    "",
    "## 회사와 문의",
    "- [회사 소개](" + siteUrl + "/about)",
    "- [문의](" + siteUrl + "/contact)",
    "- [이용 안내](" + siteUrl + "/terms)",
    "- [의뢰 준비 체크리스트](" + siteUrl + "/guides/project-checklist)",
    "- [공개 작업](" + siteUrl + "/work)",
    "",
    ...divisions.flatMap((d) => [
      "## " + d.label,
      "- [사업부 홈](" + siteUrl + "/" + d.path + ")",
      ...services
        .filter((s) => s.division === d.id)
        .map(
          (s) =>
            "- [" +
            s.name +
            "](" +
            siteUrl +
            "/" +
            d.path +
            "/services/" +
            s.id +
            "): 범위·준비물·가격 또는 견적 기준",
        ),
      "",
    ]),
    "갱신 기준: 서비스 URL·공개 가격·연락처 변경 시 이 파일과 서비스 정본을 함께 확인합니다\n이 문서는 탐색 안내이며 검색 순위나 AI 인용을 보장하지 않습니다",
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
