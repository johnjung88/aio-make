import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";

const expenseCategories = ["platform_fee", "tools", "marketing", "outsourcing", "tax_office", "assets", "other"] as const;
const paymentMethods = ["card_business", "card_personal", "bank_transfer", "cash", "platform_credit", "other"] as const;

const createExpenseSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}/),
  category: z.enum(expenseCategories),
  vendor: z.string().trim().max(100).optional().default(""),
  item: z.string().trim().min(1).max(200),
  amount: z.number().int().nonnegative(),
  currency: z.string().max(10).default("KRW"),
  payment_method: z.enum(paymentMethods).optional(),
  vat_deductible: z.boolean().default(false),
  notes: z.string().trim().max(1000).optional().default(""),
});

const patchExpenseSchema = z.object({
  id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}/).optional(),
  category: z.enum(expenseCategories).optional(),
  vendor: z.string().trim().max(100).optional(),
  item: z.string().trim().min(1).max(200).optional(),
  amount: z.number().int().nonnegative().optional(),
  payment_method: z.enum(paymentMethods).optional(),
  vat_deductible: z.boolean().optional(),
  notes: z.string().trim().max(1000).optional(),
});

const recurringPatchSchema = z.object({
  id: z.string().uuid(),
  type: z.literal("recurring"),
  active: z.boolean().optional(),
  next_charge: z.string().optional().nullable(),
  amount: z.number().int().nonnegative().optional().nullable(),
  notes: z.string().trim().max(1000).optional(),
});

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  if (!hasSupabaseAdminConfig()) return NextResponse.json({ error: "환경변수 없음" }, { status: 503 });

  const supabase = createSupabaseAdminClient();
  const [expRes, recRes] = await Promise.all([
    supabase.from("expenses").select("*").order("date", { ascending: false }).limit(100),
    supabase.from("recurring_expenses").select("*").order("active", { ascending: false }).order("next_charge", { ascending: true, nullsFirst: false }),
  ]);

  return NextResponse.json({ expenses: expRes.data ?? [], recurring: recRes.data ?? [] });
}

export async function POST(request: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  if (!hasSupabaseAdminConfig()) return NextResponse.json({ error: "환경변수 없음" }, { status: 503 });

  const body = await request.json();
  const parsed = createExpenseSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { vendor, payment_method, notes, ...rest } = parsed.data;
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("expenses")
    .insert({ ...rest, vendor: vendor || null, payment_method: payment_method ?? null, notes: notes || null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ expense: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  if (!hasSupabaseAdminConfig()) return NextResponse.json({ error: "환경변수 없음" }, { status: 503 });

  const body = await request.json();

  // 정기구독 수정
  if (body.type === "recurring") {
    const parsed = recurringPatchSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const { id, active, next_charge, amount, notes } = parsed.data;
    const updates = Object.fromEntries(
      Object.entries({ active, next_charge, amount, notes }).filter(([, value]) => value !== undefined),
    );
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("recurring_expenses").update(updates).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // 일반 지출 수정
  const parsed = patchExpenseSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { id, ...updates } = parsed.data;
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("expenses").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  if (!hasSupabaseAdminConfig()) return NextResponse.json({ error: "환경변수 없음" }, { status: 503 });

  const { id } = await request.json();
  if (!id || typeof id !== "string") return NextResponse.json({ error: "id 필수" }, { status: 400 });

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
