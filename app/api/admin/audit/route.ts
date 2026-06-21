import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { getAdminAuditLog } from "@/lib/admin/command-center";

export async function GET() {
  await requireAdminSession();
  return NextResponse.json(await getAdminAuditLog());
}
