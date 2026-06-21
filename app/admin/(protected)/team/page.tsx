import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Users } from "lucide-react";

export const metadata = {
  title: "팀 조직도 | AIO 관리자",
};

const ORG_LANES = [
  {
    title: "의장님 승인 게이트",
    owner: "chairperson",
    mission: "가격, 납기, 고객 발송, 환불/정산, live 변경 최종 승인",
    items: ["견적 확정", "고객-facing 메시지", "환불/정산", "배포/도메인/추적 변경"],
  },
  {
    title: "Hermes 자사몰 조직",
    owner: "aio_pm_insales",
    mission: "자사몰 유입, 챗봇 상담, 문의함, 견적서, PM handoff 관리",
    items: ["자사몰 봇", "문의함", "견적서", "고객 DB", "마케팅 유입 확인"],
  },
  {
    title: "재무 운영",
    owner: "aio_director_finance",
    mission: "매출/지출/미수/정기비용 흐름과 승인대기 재무 판단",
    items: ["재무 종합", "매출 리포트", "지출 관리", "미수 확인"],
  },
  {
    title: "개발/시스템 운영",
    owner: "aio_director_dev",
    mission: "admin, DB/API, 배포, 보안, tracking 변경 검토",
    items: ["업무 칸반", "설정 점검", "API/DB", "배포 검토"],
  },
];

const SERVICE_TEAMS = [
  { name: "Development", scope: "웹사이트 · 쇼핑몰 · 자동화·앱", href: "/ko/services/development/team", owner: "dev_pm" },
  { name: "Design", scope: "로고·명함 · 상세페이지 · PPT", href: "/ko/services/design/team", owner: "design_pm" },
  { name: "Video", scope: "브랜드 영상 · 쇼츠 · 편집", href: "/ko/services/video/team", owner: "video_pm" },
  { name: "Marketing", scope: "블로그 · SNS · 캠페인", href: "/ko/services/marketing/team", owner: "marketing_pm" },
];

export default function AdminTeamPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase text-primary">Organization</p>
        <h2 className="mt-2 text-3xl font-semibold">팀 · 조직도</h2>
        <p className="mt-2 text-sm text-muted-foreground">자사몰 운영조직, 승인 게이트, 서비스 제작조직을 실제 admin 업무 흐름 기준으로 정리합니다.</p>
      </div>

      <section className="rounded-lg border border-white/10 bg-card p-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">운영 의사결정 흐름</h3>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-4">
          {ORG_LANES.map((lane, index) => (
            <div key={lane.title} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] text-primary">0{index + 1}</span>
                <Users className="size-4 text-muted-foreground" />
              </div>
              <h4 className="mt-4 font-semibold">{lane.title}</h4>
              <p className="mt-2 text-xs text-primary">{lane.owner}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{lane.mission}</p>
              <div className="mt-4 space-y-2">
                {lane.items.map((item) => (
                  <p key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="size-3 text-primary" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-card">
        <div className="border-b border-white/10 px-5 py-4">
          <h3 className="text-sm font-semibold">서비스 제작 조직</h3>
        </div>
        <div className="divide-y divide-white/10">
          {SERVICE_TEAMS.map((team) => (
            <div key={team.name} className="grid gap-3 px-5 py-4 text-sm md:grid-cols-[160px_1fr_160px_130px] md:items-center">
              <p className="font-semibold">{team.name}</p>
              <p className="text-muted-foreground">{team.scope}</p>
              <p className="text-xs text-muted-foreground">owner: {team.owner}</p>
              <Link href={team.href} className="inline-flex h-8 items-center justify-center gap-2 rounded-md border border-white/10 px-3 text-xs text-muted-foreground hover:bg-white/5 hover:text-foreground">
                공개 팀
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        {[
          { href: "/admin/bot", label: "자사몰 봇" },
          { href: "/admin/inbox", label: "문의함" },
          { href: "/admin/approvals", label: "승인센터" },
          { href: "/admin/work", label: "PM 업무 현황" },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center justify-between rounded-lg border border-white/10 bg-card px-4 py-3 text-sm hover:bg-white/[0.04]">
            {item.label}
            <ArrowRight className="size-4 text-primary" />
          </Link>
        ))}
      </section>
    </div>
  );
}
