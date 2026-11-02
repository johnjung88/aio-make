import Link from "next/link";
import { Plus, Pencil, Star, Eye, EyeOff } from "lucide-react";
import { getAdminPortfolios } from "@/lib/admin/portfolios";

const CATEGORY_LABELS: Record<string, string> = {
  "website":            "웹사이트",
  "shopping-mall":      "쇼핑몰",
  "logo-business-card": "로고·명함",
  "detail-page":        "상세페이지",
  "ppt-design":         "PPT",
  "automation-app":     "자동화·앱",
  "video-content":      "영상",
};

export default async function AdminPortfoliosPage() {
  const { portfolios, error } = await getAdminPortfolios();

  const total     = portfolios.length;
  const published = portfolios.filter((p) => p.isPublished).length;
  const featured  = portfolios.filter((p) => p.isFeatured).length;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-primary">Portfolios</p>
          <h2 className="mt-2 text-3xl font-semibold">포트폴리오 관리</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            PR·배포 없이 DB에서 직접 포트폴리오를 추가·수정할 수 있습니다.
          </p>
        </div>
        <Link
          href="/admin/portfolios/new"
          className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="size-4" />
          신규 등록
        </Link>
      </div>

      {error && (
        <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {error}
        </p>
      )}

      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "전체", value: total },
          { label: "게시 중", value: published },
          { label: "추천(HOT)", value: featured },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-white/10 bg-card p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* 목록 */}
      <section className="rounded-xl border border-white/10 bg-card">
        <div className="border-b border-white/10 px-5 py-4">
          <h3 className="text-sm font-semibold">포트폴리오 목록</h3>
        </div>

        {portfolios.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-muted-foreground">
            등록된 포트폴리오가 없습니다.
          </p>
        ) : (
          <div className="divide-y divide-white/8">
            {portfolios.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-4">
                {/* 커버 썸네일 */}
                {p.coverUrl ? (
                  <div
                    className="size-14 shrink-0 rounded-lg bg-cover bg-center border border-white/10"
                    style={{ backgroundImage: `url(${p.coverUrl})` }}
                  />
                ) : (
                  <div className="size-14 shrink-0 rounded-lg border border-white/10 bg-white/5" />
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{p.titleKo}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                      {CATEGORY_LABELS[p.primaryCategoryId] ?? p.primaryCategoryId}
                    </span>
                    {p.clientName && (
                      <span className="text-xs text-muted-foreground">{p.clientName}</span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {p.isFeatured && <Star className="size-4 text-yellow-400" />}
                  {p.isPublished ? (
                    <Eye className="size-4 text-green-400" />
                  ) : (
                    <EyeOff className="size-4 text-muted-foreground" />
                  )}
                  <Link
                    href={`/admin/portfolios/${p.id}/edit`}
                    className="flex h-8 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="size-3" />
                    수정
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
