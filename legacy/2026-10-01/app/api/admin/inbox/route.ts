import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import { getInboxItems } from "@/lib/admin/data";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";

const patchSchema = z.object({
  requestId: z.string().uuid(),
  responseId: z.string().uuid().optional(),
  status: z.enum(["new", "draft", "sent", "viewed", "replied", "matched", "contracted", "rejected", "archived"]),
});

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const result = await getInboxItems();
  return NextResponse.json({ success: true, data: result.items, warning: result.error });
}

export async function PATCH(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json({ success: false, error: "Supabase 관리자 환경변수가 없어 상태를 변경할 수 없습니다." }, { status: 503 });
  }

  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { requestId, responseId, status } = parsed.data;
  const { error } = await supabase.from("quote_requests").update({ status }).eq("id", requestId);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  if (status === "sent" && responseId) {
    const { error: responseError } = await supabase
      .from("quote_responses")
      .update({ sent_at: new Date().toISOString() })
      .eq("id", responseId);
    if (responseError) {
      return NextResponse.json({ success: false, error: responseError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
