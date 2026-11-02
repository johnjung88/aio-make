import { ContractsManager } from "@/components/admin/contracts-manager";
import { getContracts } from "@/lib/admin/data";

export default async function AdminContractsPage() {
  const { contracts, error } = await getContracts();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase text-primary">Contracts</p>
        <h2 className="mt-2 text-3xl font-semibold">계약 사항 관리</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          숨고, 크몽, 위시켓 등 채널별로 성사된 계약의 마감일, 입금, 미수, 납품 상태를 관리합니다.
        </p>
      </div>
      {error && <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">{error}</p>}
      <ContractsManager contracts={contracts} />
    </div>
  );
}
