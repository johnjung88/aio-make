import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { getCommandCenterData } from "@/lib/admin/command-center";

export async function GET() {
  await requireAdminSession();
  const data = await getCommandCenterData();
  return NextResponse.json({ generatedAt: data.generatedAt, approvals: data.approvals, warnings: data.warnings });
}
