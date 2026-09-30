import Link from "next/link";
import { ArrowRight, FileText, LayoutTemplate, PenLine } from "lucide-react";

export const metadata = {
  title: "매거진 홈 | AIO 관리자",
};

const TONE_MAP = [
  { tone: "Magazine", path: "/ko", scope: "홈, 소개, 견적, 전체 브랜드 톤", status: "운영중" },
  { tone: "IDE", path: "/ko/services/development", scope: "개발/웹사이트/자동화 서비스 톤", status: "운영중" },
  { tone: "Lifestyle", path: "/ko/services/design", scope: "디자인/상세페이지 서비스 톤", status: "운영중" },
  { tone: "Cinema", path: "/ko/services/video", scope: "영상 서비스 톤", status: "운영중" },
  { tone: "Consultant", path: "/ko/services/marketing", scope: "마케팅/PPT/컨설팅 톤", status: "운영중" },
];

const CONTENT_AREAS = [
  { label: "홈 첫 화면", href: "/ko", owner: "brand_content", source: "app/[locale]/page.tsx + magazine components" },
  { label: "견적 문의", href: "/ko/quote", owner: "aio_pm_insales", source: "quote form + /api/quote" },
  { label: "서비스 허브", href: "/ko/services", owner: "service_pm", source: "lib/services-data.ts" },
  { label: "포트폴리오", href: "/admin/portfolios", owner: "portfolio_pm", source: "admin DB + portfolio routes" },
];

export default function AdminMagazinePage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase text-primary">Magazine Home</p>
        <h2 className="mt-2 text-3xl font-semibold">매거진 · 홈</h2>
        <p className="mt-2 text-sm text-muted-foreground">자사몰 홈/매거진 톤, 서비스 허브, 견적 전환 콘텐츠의 현재 연결 상태를 정리합니다.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "공개 톤", value: `${TONE_MAP.length}개`, icon: LayoutTemplate },
          { label: "관리 영역", value: `${CONTENT_AREAS.length}개`, icon: FileText },
          { label: "직접 편집", value: "부분 지원", icon: PenLine },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-lg border border-white/10 bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <Icon className="size-4 text-primary" />
              </div>
              <p className="mt-4 text-2xl font-semibold">{card.value}</p>
            </div>
          );
        })}
      </section>

      <section className="rounded-lg border border-white/10 bg-card">
        <div className="border-b border-white/10 px-5 py-4">
          <h3 className="text-sm font-semibold">공개 사이트 톤 구조</h3>
        </div>
        <div className="divide-y divide-white/10">
          {TONE_MAP.map((item) => (
            <div key={item.tone} className="grid gap-3 px-5 py-4 text-sm md:grid-cols-[150px_1fr_100px_120px] md:items-center">
              <p className="font-semibold">{item.tone}</p>
              <p className="text-muted-foreground">{item.scope}</p>
              <span className="w-fit rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-200">{item.status}</span>
              <Link href={item.path} className="inline-flex h-8 items-center justify-center gap-2 rounded-md border border-white/10 px-3 text-xs text-muted-foreground hover:bg-white/5 hover:text-foreground">
                보기
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-card">
        <div className="border-b border-white/10 px-5 py-4">
          <h3 className="text-sm font-semibold">콘텐츠 관리 영역</h3>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2">
          {CONTENT_AREAS.map((area) => (
            <Link key={area.label} href={area.href} className="rounded-lg border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06]">
              <span className="flex items-center justify-between gap-3 font-semibold">
                {area.label}
                <ArrowRight className="size-4 text-primary" />
              </span>
              <p className="mt-3 text-sm text-muted-foreground">owner: {area.owner}</p>
              <p className="mt-2 text-xs text-muted-foreground">source: {area.source}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
        포트폴리오는 admin에서 직접 관리 중입니다. 홈 카피/매거진 섹션/서비스 허브를 완전 입력형으로 만들려면 `content_blocks`와 `content_publish_requests` 테이블을 추가하고 승인 후 공개 반영되게 연결해야 합니다.
      </section>
    </div>
  );
}
