import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { divisions, services } from "@/lib/content";
import { checklistVersion, projectChecklist } from "@/lib/project-checklist";
import { breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui";

export const metadata = pageMetadata(
  "의뢰 준비 체크리스트",
  "목적·결과물·자료·범위·검토 담당자를 정리하는 무료 의뢰 준비표입니다",
  "/guides/project-checklist",
);
export default function Checklist() {
  return (
    <main className="guide-page guide-utility">
      <header className="container page-intro">
        <h1>의뢰 준비 체크리스트</h1>
        <p>
          {
            "준비된 항목부터 적어주세요\n서비스별 공개 범위와 개별 협의 조건을\n        확인하는 자료입니다"
          }
        </p>
        <p>버전·작성일·갱신일: {checklistVersion}</p>
        <a
          href="/guides/project-checklist/download"
          download="aio-project-checklist.txt"
        >
          빈칸 준비표 내려받기 (TXT)
        </a>
      </header>
      <article className="container prose project-checklist">
        {projectChecklist.map(([title, body], index) => (
          <section key={title}>
            <h2>
              {index + 1}. {title}
            </h2>
            <p>{body}</p>
          </section>
        ))}
        <h2>서비스 범위와 가격 확인</h2>
        <ul>
          {services.map((s) => (
            <li key={`${s.division}-${s.id}`}>
              <Link
                href={`/${divisions.find((d) => d.id === s.division)!.path}/services/${s.id}`}
              >
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
        <p>
          <Link href="/terms">이용 안내</Link> ·{" "}
          <Link href="/contact">준비한 내용으로 상담</Link>
        </p>
      </article>
      <JsonLd
        data={breadcrumbSchema([
          { name: "AIO MAKE", path: "/" },
          { name: "의뢰 준비 체크리스트", path: "/guides/project-checklist" },
        ])}
      />
    </main>
  );
}
