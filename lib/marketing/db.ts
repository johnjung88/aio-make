import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase";
export async function action(id: string, kind: string, data: unknown) {
  const result = await createSupabaseAdminClient().rpc("marketing_action", {
    p_id: id,
    p_action: kind,
    p_data: data,
  });
  if (result.error)
    throw new Error(
      "상태가 변경되었거나 저장에 실패했습니다. 새로고침 후 확인해 주세요.",
    );
  return result.data;
}
export async function consultation(id: string) {
  const db = createSupabaseAdminClient();
  const results = await Promise.all([
    db.from("marketing_consultations").select("*").eq("id", id).single(),
    db
      .from("marketing_drafts")
      .select("*")
      .eq("consultation_id", id)
      .order("version", { ascending: false }),
    db
      .from("marketing_events")
      .select("*")
      .eq("consultation_id", id)
      .order("created_at"),
    db
      .from("marketing_outbox")
      .select("*")
      .eq("consultation_id", id)
      .order("created_at"),
  ]);
  if (results.some((r) => r.error))
    throw new Error("상담 기록을 불러오지 못했습니다.");
  return {
    consultation: results[0].data,
    drafts: results[1].data,
    events: results[2].data,
    outbox: results[3].data,
  };
}
