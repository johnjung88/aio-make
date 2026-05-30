import type { Metadata } from "next";
import Link from "next/link";
import { MagazineEyebrow } from "@/components/magazine/magazine-eyebrow";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return localizedPageMetadata({
    locale,
    path: "/team",
    title: isKo ? "팀원 소개 — AIO" : "Team — AIO",
    description: isKo
      ? "AIO에이전시의 조직과 분야별 전문가 팀 — 의사결정부터 제작·검수·운영까지."
      : "AIO Agency org and team — from decisions to craft, QA, and care.",
  });
}

/* ───────── 데이터 ───────── */
const LEADERSHIP = [
  { role: "Chair", name: "의장", nameEn: "Chair", note: "최종 의사결정 · 고객 관계 · 가격 · 납기 · 결재" },
  { role: "CEO Hermes", name: "아대표", nameEn: "AIO CEO", note: "PM 관리 · 우선순위 · 위험 · 보고 · 게이트웨이 운영" },
];
const DIRECTORS = [
  { dept: "Development", title: "개발 이사", note: "공통 개발 지원 · 외부 코드 AIO화 · 신사업 MVP" },
  { dept: "Design", title: "디자인 이사", note: "전체 디자인 품질 · Adobe 도구 · handoff · 100점 QA" },
  { dept: "Video", title: "영상 이사", note: "영상 에이전시 · 영상 제작 조직 총괄" },
  { dept: "Marketing", title: "마케팅 이사", note: "유입 · 브랜드 · 콘텐츠 · 검색 · 분석 · 운영대행 총괄" },
  { dept: "R&D", title: "신사업 이사", note: "신규 BM · 시장기회 · 작은 실험 설계" },
  { dept: "Finance", title: "재무 이사", note: "매출 · 입금 · 미수 · 비용 · 손익 관리" },
];
const SECRETARY = { title: "비서", note: "일정 · 마감 · 리마인더 · 결재 필요 항목 정리" };

const TEAMS = [
  {
    cat: "개발",
    eyebrow: "Team · Development",
    members: [
      { mark: "리", role: "Planner", name: "기획 · 리아", body: "목적과 흐름을 먼저 설계합니다", tags: ["IA", "와이어프레임"] },
      { mark: "준", role: "Copywriter", name: "카피 · 준", body: "읽게 만드는 한 줄을 씁니다", tags: ["메시지", "카피"] },
      { mark: "도", role: "Designer", name: "디자인 · 도윤", body: "첫인상을 디자인합니다", tags: ["UI", "비주얼"] },
      { mark: "세", role: "Developer", name: "개발 · 세호", body: "운영 가능한 상태로 구현·배포합니다", tags: ["Next.js", "반응형"] },
      { mark: "현", role: "QA · Ops", name: "검수·운영 · 현아", body: "끝까지 점검하고 유지보수합니다", tags: ["QA", "A/S"] },
    ],
  },
  {
    cat: "디자인",
    eyebrow: "Team · Design",
    members: [
      { mark: "유", role: "Detail Designer", name: "상세 · 유나", body: "스크롤을 멈추게 만드는 상세를 만듭니다", tags: ["상세", "전환"] },
      { mark: "한", role: "PPT Designer", name: "PPT · 한결", body: "한 눈에 전달되는 슬라이드를 설계합니다", tags: ["IR", "제안"] },
      { mark: "—", role: "Logo · Coming", name: "로고·명함 · 준비 중", body: "곧 합류합니다", tags: ["Soon"] },
    ],
  },
  {
    cat: "영상",
    eyebrow: "Team · Video",
    members: [
      { mark: "민", role: "Director", name: "감독 · 민재", body: "한 컷의 무게를 압니다", tags: ["연출"] },
      { mark: "정", role: "Editor", name: "편집 · 정우", body: "리듬과 호흡으로 끝까지 보게 합니다", tags: ["편집", "컬러"] },
    ],
  },
  {
    cat: "마케팅",
    eyebrow: "Team · Marketing",
    members: [
      { mark: "서", role: "Content Ops", name: "콘텐츠 · 서영", body: "꾸준히 보이는 운영을 만듭니다", tags: ["블로그", "SNS"] },
      { mark: "지", role: "Growth", name: "그로스 · 지호", body: "데이터에서 다음 한 수를 봅니다", tags: ["GA", "리포트"] },
    ],
  },
];

/* ───────── 스타일 토큰 ───────── */
const H1 = { fontFamily: "var(--font-marcellus)", fontSize: "clamp(42px,7vw,96px)", lineHeight: 1.02, letterSpacing: "-0.012em", color: "var(--tone-magazine-ink)", fontWeight: 400 as const, wordBreak: "keep-all" as const, overflowWrap: "break-word" as const };
const H2 = { fontFamily: "var(--font-marcellus)", fontSize: "clamp(28px,4.6vw,58px)", lineHeight: 1.04, letterSpacing: "-0.012em", color: "var(--tone-magazine-ink)", fontWeight: 400 as const, wordBreak: "keep-all" as const };
const LEAD = { fontFamily: "var(--font-pretendard)", fontSize: "clamp(14.5px,1.25vw,17.5px)", lineHeight: 1.85, color: "var(--tone-magazine-ink-2)", letterSpacing: "-0.005em", fontWeight: 400 as const, wordBreak: "keep-all" as const };
const LABEL = { fontFamily: "var(--font-jetbrains)", fontSize: "10.5px", color: "var(--tone-magazine-ink-3)", letterSpacing: "0.22em", textTransform: "uppercase" as const };
const EM_CORM = { fontFamily: "var(--font-fraunces)", fontStyle: "normal" as const, fontWeight: 500 as const };

/* ───────── 페이지 ───────── */
export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const base = `/${locale}`;
  return (
    <main style={{ background: "var(--tone-magazine-paper)", paddingTop: "clamp(48px,7vw,96px)", paddingBottom: "clamp(60px,8vw,100px)" }}>
      <div className="mx-auto w-full max-w-[1180px] px-5 md:px-10 lg:px-14 text-center">

        {/* Hero */}
        <MagazineEyebrow className="mb-6">No 02 · The People</MagazineEyebrow>
        <h1 className="mb-8" style={H1}>
          AIO를 만드는<br /><span style={EM_CORM}>사람들</span>
        </h1>
        <p className="mx-auto mb-20" style={{ ...LEAD, maxWidth: 640 }}>
          분야별 전문가가 의뢰의 시작부터 운영까지 함께합니다. 의사결정부터 제작·검수·운영까지, 각자의 자리에서 책임집니다.
        </p>

        {/* Leadership */}
        <MagazineEyebrow className="mb-6">Leadership</MagazineEyebrow>
        <h2 className="mb-14" style={H2}>의사결정의 <span style={EM_CORM}>두 축</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 mx-auto max-w-[820px] mb-24" style={{ border: "1px solid var(--tone-magazine-ink)" }}>
          {LEADERSHIP.map((m, i) => (
            <div key={m.role} className="flex flex-col items-center text-center" style={{ padding: "clamp(28px,3.5vw,44px) clamp(20px,2.5vw,32px)", borderRight: i === 0 ? "1px solid var(--tone-magazine-line-2)" : "none" }}>
              <div className="mb-3" style={LABEL}>{m.role}</div>
              <div className="mb-3" style={{ fontFamily: "var(--font-marcellus)", fontSize: "clamp(24px,3vw,36px)", color: "var(--tone-magazine-ink)" }}>{m.name}</div>
              <div style={{ ...LEAD, fontSize: "clamp(13px,1vw,15px)", maxWidth: "32ch" }}>{m.note}</div>
            </div>
          ))}
        </div>

        {/* Directors */}
        <MagazineEyebrow className="mb-6">Directors · 06</MagazineEyebrow>
        <h2 className="mb-14" style={H2}>분야의 <span style={EM_CORM}>책임자</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 mx-auto max-w-[1080px] mb-12" style={{ border: "1px solid var(--tone-magazine-ink)" }}>
          {DIRECTORS.map((d, i) => (
            <div key={d.dept} className="flex flex-col items-center text-center" style={{ padding: "clamp(24px,2.6vw,36px) clamp(18px,2vw,28px)", borderRight: (i + 1) % 3 !== 0 ? "1px solid var(--tone-magazine-line-2)" : "none", borderBottom: i < 3 ? "1px solid var(--tone-magazine-line-2)" : "none" }}>
              <div className="mb-3" style={LABEL}>{d.dept}</div>
              <div className="mb-2" style={{ fontFamily: "var(--font-marcellus)", fontSize: "clamp(20px,2.4vw,28px)", color: "var(--tone-magazine-ink)" }}>{d.title}</div>
              <div style={{ ...LEAD, fontSize: "13.5px", maxWidth: "28ch" }}>{d.note}</div>
            </div>
          ))}
        </div>
        <div className="mx-auto max-w-[420px] mb-24 py-6 px-8" style={{ border: "1px solid var(--tone-magazine-line-2)" }}>
          <div className="mb-2" style={LABEL}>Staff</div>
          <div className="mb-2" style={{ fontFamily: "var(--font-marcellus)", fontSize: "clamp(20px,2.4vw,28px)", color: "var(--tone-magazine-ink)" }}>{SECRETARY.title}</div>
          <div style={{ ...LEAD, fontSize: "13.5px" }}>{SECRETARY.note}</div>
        </div>

        {/* Teams by category */}
        {TEAMS.map((team) => (
          <section key={team.cat} className="mb-24">
            <MagazineEyebrow className="mb-6">{team.eyebrow}</MagazineEyebrow>
            <h2 className="mb-14" style={H2}>{team.cat} <span style={EM_CORM}>팀</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 mx-auto max-w-[1080px]" style={{ border: "1px solid var(--tone-magazine-ink)" }}>
              {team.members.map((p, i) => (
                <div key={p.role + i} className="flex flex-col items-center text-center" style={{ padding: "clamp(28px,3vw,40px) clamp(18px,2vw,28px)", borderRight: (i + 1) % 3 !== 0 ? "1px solid var(--tone-magazine-line-2)" : "none", borderBottom: i < team.members.length - (team.members.length % 3 || 3) ? "1px solid var(--tone-magazine-line-2)" : "none" }}>
                  <div className="mb-4 flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--tone-magazine-ink)", color: "var(--tone-magazine-paper)", fontFamily: "var(--font-marcellus)", fontSize: 20 }}>{p.mark}</div>
                  <div className="mb-2" style={LABEL}>{p.role}</div>
                  <div className="mb-2" style={{ fontFamily: "var(--font-marcellus)", fontSize: "clamp(18px,2vw,22px)", color: "var(--tone-magazine-ink)" }}>{p.name}</div>
                  <div className="mb-3" style={{ ...LEAD, fontSize: "13.5px", maxWidth: "26ch" }}>{p.body}</div>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} style={{ ...LABEL, fontSize: 9.5, padding: "3px 8px", border: "1px solid var(--tone-magazine-line-2)" }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="mt-12">
          <h2 className="mb-6" style={H2}>같이 만들 <span style={EM_CORM}>차례입니다</span></h2>
          <p className="mx-auto mb-10" style={{ ...LEAD, maxWidth: 520 }}>지금 문의하면 24시간 안에 견적 · 5일 안에 첫 결과물</p>
          <Link href={`${base}/quote`} className="inline-flex items-center" style={{ padding: "14px 30px", border: "1px solid var(--tone-magazine-ink)", fontFamily: "var(--font-jetbrains)", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--tone-magazine-ink)", textDecoration: "none" }}>견적 문의 →</Link>
        </section>
      </div>
    </main>
  );
}
