import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";

const patchSchema = z.object({
  leadId: z.string().uuid(),
  notes: z.string().trim().max(3000).optional().default(""),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).optional().default([]),
});

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

  const { leadId, notes, tags } = parsed.data;
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("leads")
    .update({
      notes: notes || null,
      tags,
      last_contact_at: new Date().toISOString(),
    })
    .eq("id", leadId);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
