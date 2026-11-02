import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminPortfolioById } from "@/lib/admin/portfolios";
import { PortfolioForm } from "@/components/admin/portfolio-form";

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { portfolio, error } = await getAdminPortfolioById(id);

  if (!portfolio) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/portfolios"
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          목록으로
        </Link>
        <p className="text-xs font-medium uppercase text-primary">Portfolios</p>
        <h2 className="mt-2 text-3xl font-semibold">포트폴리오 수정</h2>
        <p className="mt-1 text-sm text-muted-foreground">{portfolio.titleKo}</p>
      </div>
      {error && (
        <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {error}
        </p>
      )}
      <PortfolioForm portfolio={portfolio} />
    </div>
  );
}
