import { requireAdmin } from "@/lib/auth";
import { LocalAdmin } from "@/components/local-admin";
export const dynamic = "force-dynamic";
export default async function Admin() {
  await requireAdmin();
  return <LocalAdmin />;
}
