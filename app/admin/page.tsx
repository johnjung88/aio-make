import { requireAdmin } from "@/lib/auth";
import { AdminDashboard } from "@/components/admin-dashboard";
export const dynamic = "force-dynamic";
export default async function Admin() {
  await requireAdmin();
  return <AdminDashboard />;
}
