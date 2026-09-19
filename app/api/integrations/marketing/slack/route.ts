import { NextResponse } from "next/server";
import { verifySlack, ownerAllowed } from "@/lib/marketing/security";
import { action } from "@/lib/marketing/db";
import { z } from "zod";
export async function POST(req: Request) {
  const raw = await req.text();
  if (
    !verifySlack(
      raw,
      req.headers.get("x-slack-request-timestamp") || "",
      req.headers.get("x-slack-signature") || "",
      process.env.MARKETING_SLACK_SIGNING_SECRET || "",
    )
  )
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  try {
    const p = JSON.parse(new URLSearchParams(raw).get("payload") || "{}");
    if (!ownerAllowed(p))
      return NextResponse.json(
        { error: "Owner approval required" },
        { status: 403 },
      );
    const a = p.actions?.[0];
    if (a?.action_id !== "marketing_approve")
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    const value = z
      .object({ id: z.string().uuid(), draft_id: z.string().uuid() })
      .parse(JSON.parse(a.value));
    await action(value.id, "approve", {
      draft_id: value.draft_id,
      actor: p.user.id,
    });
    return NextResponse.json({
      text: "승인 기록 완료. 발송 결과는 별도로 확인합니다.",
      replace_original: false,
    });
  } catch {
    return NextResponse.json({
      response_type: "ephemeral",
      text: "승인하지 못했습니다. 초안 수정·새 회신 여부와 현재 상담 상태를 확인해 주세요.",
    });
  }
}
