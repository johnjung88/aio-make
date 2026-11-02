import { CustomersManager } from "@/components/admin/customers-manager";
import { getCustomers } from "@/lib/admin/data";

export default async function AdminCustomersPage() {
  const { customers, error } = await getCustomers();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase text-primary">Customers</p>
        <h2 className="mt-2 text-3xl font-semibold">고객 DB 관리</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          견적 문의와 계약 고객을 한곳에 모아 태그, 메모, 재접촉 대상으로 정리합니다.
        </p>
      </div>
      {error && <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">{error}</p>}
      <CustomersManager customers={customers} />
    </div>
  );
}
