import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import { categories, channels, createContractRecord, projectStatuses, updateContractRecord } from "@/lib/admin/contracts";
import { hasSupabaseAdminConfig } from "@/lib/supabase";

const createSchema = z.object({
  customerName: z.string().trim().min(1).max(100),
  companyName: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email().max(255).optional().or(z.literal("")).default(""),
  phone: z.string().trim().max(40).optional().default(""),
  channel: z.enum(channels).default("other"),
  category: z.enum(categories).default("other"),
  productName: z.string().trim().min(1).max(160),
  contractedAmount: z.number().int().nonnegative(),
  paidAmount: z.number().int().nonnegative().optional().default(0),
  startDate: z.string().trim().optional().default(""),
  dueDate: z.string().trim().optional().default(""),
  notes: z.string().trim().max(2000).optional().default(""),
});

const patchSchema = z.object({
  projectId: z.string().uuid(),
  invoiceId: z.string().uuid().optional(),
  status: z.enum(projectStatuses).optional(),
  dueDate: z.string().trim().optional(),
  paidAmount: z.number().int().nonnegative().optional(),
});

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json({ success: false, error: "Supabase 관리자 환경변수가 없습니다." }, { status: 503 });
  }

  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  const payload = parsed.data;
  try {
    const data = await createContractRecord({
      ...payload,
      sourceMeta: { created_from: "admin_contract" },
    });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Contract was not saved" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json({ success: false, error: "Supabase 관리자 환경변수가 없습니다." }, { status: 503 });
  }

  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  const payload = parsed.data;
  try {
    await updateContractRecord(payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Contract was not updated" }, { status: 500 });
  }
}
