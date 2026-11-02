import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { getRevenueReport } from "@/lib/admin/revenue";

export async function GET() {
  await requireAdminSession();
  return NextResponse.json({ report: await getRevenueReport() });
}
