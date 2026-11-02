import { JsonLd } from "@/components/ui";
import { breadcrumbSchema } from "@/lib/seo";

const names: Record<string, string> = {
  about: "회사 소개",
  team: "일하는 방식",
  contact: "프로젝트 문의",
  privacy: "개인정보처리방침",
  terms: "이용 안내",
  content: "컨텐츠",
  marketing: "마케팅",
  lab: "개발",
  insights: "인사이트",
  references: "레퍼런스",
  work: "제작 방향",
};
export function PageBreadcrumb({ path }: { path: string }) {
  const parts = path.split("/").filter(Boolean);
  return (
    <JsonLd
      data={breadcrumbSchema([
        { name: "AIO MAKE", path: "/" },
        ...parts.map((part, i) => ({
          name: names[part] ?? part,
          path: "/" + parts.slice(0, i + 1).join("/"),
        })),
      ])}
    />
  );
}
