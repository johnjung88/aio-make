import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { action, consultation } from "@/lib/marketing/db";
import { statuses } from "@/lib/marketing/validation";
import { z } from "zod";
const schema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("reconcile"),
    id: z.string().uuid(),
    job_id: z.string().uuid(),
    state: z.enum(["done", "failed"]),
    evidence: z.string().trim().min(10).max(3000),
    provider_id: z.string().max(200),
    thread: z.string().max(100),
  }),
  z.object({
    action: z.literal("draft"),
    id: z.string().uuid(),
    subject: z.string().trim().min(1).max(200),
    body: z.string().trim().min(1).max(12000),
    reply_revision: z.number().int().nonnegative(),
  }),
  z.object({
    action: z.literal("update"),
    id: z.string().uuid(),
    status: z.enum(statuses),
    notes: z.string().max(10000),
    next_action: z.string().max(2000),
  }),
]);
export async function GET(req: Request) {
  if (!(await getAdminSession()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (id)
      return NextResponse.json(
        await consultation(z.string().uuid().parse(id)),
        { headers: { "Cache-Control": "no-store" } },
      );
    const r = await createSupabaseAdminClient()
      .from("marketing_consultations")
      .select("id,payload,status,created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (r.error) throw r.error;
    return NextResponse.json(r.data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "상담 DB를 확인할 수 없습니다." },
      { status: 503 },
    );
  }
}
export async function POST(req: Request) {
  if (!(await getAdminSession()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (
    req.headers.get("origin") !==
    new URL(process.env.NEXT_PUBLIC_SITE_URL || req.url).origin
  )
    return NextResponse.json({ error: "Origin rejected" }, { status: 403 });
  try {
    const p = schema.parse(await req.json());
    if (p.action === "reconcile") {
      const r = await createSupabaseAdminClient().rpc("marketing_reconcile", {
        p_job: p.job_id,
        p_state: p.state,
        p_evidence: p.evidence,
        p_provider_id: p.provider_id,
        p_thread: p.thread,
      });
      if (r.error) throw r.error;
      return NextResponse.json({ success: true });
    }
    return NextResponse.json(
      await action(p.id, p.action, { ...p, author: "human-admin" }),
    );
  } catch {
    return NextResponse.json(
      { error: "저장에 실패했습니다. 최신 상태와 입력 내용을 확인해 주세요." },
      { status: 409 },
    );
  }
}
