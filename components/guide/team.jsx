"use client";
import { DivisionCards, ContactCta } from "@/components/home/renewal-sections";
import "@/components/content-site/theme.css";
import "@/components/home/main-about-renewal.css";
const R = (scope, role, count, desc, tags) => ({
  scope,
  role,
  count,
  desc,
  tags,
});
const DATA = [
  {
    key: "Studio",
    name: "Studio",
    ko: "컨텐츠 팀",
    roles: [
      R(
        "컨텐츠",
        "기획",
        2,
        "목적과 채널에 맞춰 콘셉트, 스토리보드, 장면 구성을 설계합니다",
        ["콘셉트", "스토리보드", "연출"],
      ),
      R(
        "컨텐츠",
        "편집",
        4,
        "AI로 만든 소스를 편집하고 자막, 사운드, 컬러까지 채널 규격에 맞춰 완성합니다",
        ["컷 편집", "자막·사운드", "컬러그레이딩"],
      ),
    ],
  },
  {
    key: "Marketing",
    name: "Marketing",
    ko: "마케팅 팀",
    roles: [
      R(
        "마케팅",
        "기획",
        2,
        "브랜드와 목표에 맞는 채널 전략과 월간 운영 계획을 세웁니다",
        ["채널 전략", "운영 캘린더"],
      ),
      R(
        "마케팅",
        "컨텐츠",
        4,
        "SNS 피드, 블로그, 숏폼 컨텐츠를 꾸준히 제작하고 발행합니다",
        ["SNS", "블로그", "숏폼"],
      ),
      R(
        "마케팅",
        "디자인",
        2,
        "카드뉴스, 배너, 피드 이미지를 브랜드 톤에 맞춰 만듭니다",
        ["카드뉴스", "배너", "피드"],
      ),
      R(
        "마케팅",
        "그로스",
        1,
        "광고와 유입 채널을 실험하며 성과가 나는 방향을 찾습니다",
        ["퍼포먼스", "A/B 테스트"],
      ),
      R(
        "마케팅",
        "SEO·AEO",
        1,
        "검색엔진과 AI 검색에서 브랜드가 잘 노출되도록 구조와 컨텐츠를 최적화합니다",
        ["SEO", "AEO", "키워드"],
      ),
      R(
        "마케팅",
        "분석",
        1,
        "채널 데이터를 분석해 월간 리포트와 다음 달 개선안을 드립니다",
        ["GA4", "리포트"],
      ),
    ],
  },
  {
    key: "Lab",
    name: "Lab",
    ko: "개발 팀",
    roles: [
      R(
        "웹사이트 · 쇼핑몰",
        "기획",
        2,
        "요구사항을 정리하고 사이트 구조, 화면 흐름, 결제 흐름을 설계합니다",
        ["요구사항", "IA", "화면 설계"],
      ),
      R(
        "웹사이트 · 쇼핑몰",
        "디자인",
        2,
        "반응형 UI와 상세·배너 이미지를 브랜드에 맞게 디자인합니다",
        ["UI/UX", "반응형", "상세페이지"],
      ),
      R(
        "웹사이트 · 쇼핑몰",
        "개발",
        2,
        "웹사이트와 쇼핑몰을 구축하고 배포, 유지보수까지 맡습니다",
        ["Next.js", "Cafe24", "Shopify"],
      ),
      R(
        "업무 자동화",
        "기획",
        1,
        "고객의 반복 업무를 분석해 자동화할 범위와 흐름을 설계합니다",
        ["업무 분석", "프로세스"],
      ),
      R(
        "업무 자동화",
        "개발",
        1,
        "알림, 보고서, 데이터 처리를 자동화 시스템으로 구현합니다",
        ["Python", "n8n", "API"],
      ),
    ],
  },
].map((d) => ({ ...d, total: d.roles.reduce((n, r) => n + r.count, 0) }));

export default function Team() {
  return (
    <div className="guide-page cs-site rw-site">
      <section className="rw-section">
        <div className="cs-container">
          <header className="cs-head cs-head--center">
            <p className="cs-t-eyebrow">OUR TEAM</p>
            <h1 className="cs-t-display">분야별 업무</h1>
            <p className="cs-t-lead">
              각 분야의 역할을 하나의 결과물로 연결합니다
            </p>
          </header>
          <DivisionCards />
          <div className="rw-team-roles">
            {[DATA[2], DATA[1], DATA[0]].map((division) => (
              <section key={division.key} aria-label={division.ko}>
                <h2 className="cs-t-h3">{division.ko}</h2>
                {division.roles.map((role) => (
                  <details key={role.scope + role.role}>
                    <summary className="cs-t-body">
                      {role.scope} · {role.role}
                    </summary>
                    <p className="cs-t-body">{role.desc}</p>
                    <p className="cs-t-small">{role.tags.join(" · ")}</p>
                  </details>
                ))}
              </section>
            ))}
          </div>
        </div>
      </section>
      <ContactCta source="about-team" />
    </div>
  );
}
