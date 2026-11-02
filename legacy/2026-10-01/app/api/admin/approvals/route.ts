import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { getCommandCenterData } from "@/lib/admin/command-center";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";

export async function GET() {
  await requireAdminSession();
  const data = await getCommandCenterData();
  return NextResponse.json({ generatedAt: data.generatedAt, approvals: data.approvals, warnings: data.warnings });
}

const decisionStatus = z.enum(["approved", "rejected", "on_hold"]);
const approvalType = z.enum([
  "customer_message",
  "price_due_date",
  "contract_payment",
  "refund_settlement",
  "portfolio_publish",
  "tracking_live",
  "risk_escalation",
]);

const patchSchema = z.object({
  id: z.string().uuid(),
  status: decisionStatus,
  decisionNote: z.string().trim().max(1000).optional(),
});

const postSchema = z.object({
  sourceId: z.string().max(160).optional(),
  title: z.string().trim().min(1).max(300),
  approvalType,
  status: decisionStatus,
  priority: z.enum(["P0", "P1", "P2"]).default("P1"),
  requestedBy: z.string().trim().min(1).max(120).default("admin"),
  targetType: z.string().trim().max(80).optional(),
  targetId: z.string().uuid().optional(),
  summary: z.string().trim().max(2000).optional(),
  dueAt: z.string().optional(),
  decisionNote: z.string().trim().max(1000).optional(),
});

function missingDb() {
  return NextResponse.json({ error: "Supabase 관리자 환경변수가 없어 승인 처리를 저장할 수 없습니다." }, { status: 503 });
}

async function insertAuditLog(input: {
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  summary: string;
}) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("admin_audit_logs").insert({
    actor: "admin",
    action: input.action,
    target_type: input.targetType ?? "approval_request",
    target_id: input.targetId ?? null,
    before_json: input.before ?? null,
    after_json: input.after ?? null,
    summary: input.summary,
  });
}

export async function PATCH(req: Request) {
  await requireAdminSession();
  if (!hasSupabaseAdminConfig()) return missingDb();

  const parsed = patchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: before, error: loadError } = await supabase
    .from("approval_requests")
    .select("id, title, approval_type, status, priority, requested_by, target_type, target_id, summary, decision_note")
    .eq("id", parsed.data.id)
    .single();

  if (loadError || !before) {
    return NextResponse.json({ error: loadError?.message ?? "승인 요청을 찾을 수 없습니다." }, { status: 404 });
  }

  const { data: updated, error } = await supabase
    .from("approval_requests")
    .update({
      status: parsed.data.status,
      reviewed_by: "admin",
      decision_note: parsed.data.decisionNote ?? null,
      decided_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id)
    .select("id, title, status, target_type, target_id")
    .single();

  if (error || !updated) {
    return NextResponse.json({ error: error?.message ?? "승인 요청 처리 실패" }, { status: 500 });
  }

  await insertAuditLog({
    action: `approval.${parsed.data.status}`,
    targetType: "approval_request",
    targetId: parsed.data.id,
    before: before as Record<string, unknown>,
    after: updated as Record<string, unknown>,
    summary: `${String(before.title)}: ${String(before.status)} -> ${parsed.data.status}`,
  });

  return NextResponse.json({ ok: true, approval: updated });
}

export async function POST(req: Request) {
  await requireAdminSession();
  if (!hasSupabaseAdminConfig()) return missingDb();

  const parsed = postSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("approval_requests")
    .insert({
      title: parsed.data.title,
      approval_type: parsed.data.approvalType,
      status: parsed.data.status,
      priority: parsed.data.priority,
      requested_by: parsed.data.requestedBy,
      reviewed_by: "admin",
      target_type: parsed.data.targetType ?? null,
      target_id: parsed.data.targetId ?? null,
      summary: parsed.data.summary ?? null,
      decision_note: parsed.data.decisionNote ?? null,
      due_at: parsed.data.dueAt ?? null,
      decided_at: now,
      updated_at: now,
    })
    .select("id, title, approval_type, status, priority, target_type, target_id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "승인 기록 생성 실패" }, { status: 500 });
  }

  await insertAuditLog({
    action: `approval.materialize.${parsed.data.status}`,
    targetType: "approval_request",
    targetId: String(data.id),
    after: data as Record<string, unknown>,
    summary: `${parsed.data.title}: 가상 게이트를 ${parsed.data.status} 기록으로 저장`,
  });

  return NextResponse.json({ ok: true, approval: data }, { status: 201 });
}
