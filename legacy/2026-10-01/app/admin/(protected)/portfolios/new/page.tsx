import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PortfolioForm } from "@/components/admin/portfolio-form";

export default function NewPortfolioPage() {
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
        <h2 className="mt-2 text-3xl font-semibold">신규 포트폴리오 등록</h2>
      </div>
      <PortfolioForm />
    </div>
  );
}
