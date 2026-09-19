import { NextResponse } from "next/server";
import { Resend } from "resend";
import { matchReplyAddress } from "@/lib/marketing/security";
import { action } from "@/lib/marketing/db";
import { createSupabaseAdminClient } from "@/lib/supabase";
export async function POST(req: Request) {
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.MARKETING_RESEND_WEBHOOK_SECRET
  )
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const resend = new Resend(process.env.RESEND_API_KEY);
  let event;
  try {
    event = resend.webhooks.verify({
      payload: await req.text(),
      headers: {
        id: req.headers.get("svix-id") || "",
        timestamp: req.headers.get("svix-timestamp") || "",
        signature: req.headers.get("svix-signature") || "",
      },
      webhookSecret: process.env.MARKETING_RESEND_WEBHOOK_SECRET,
    });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  try {
    const db = createSupabaseAdminClient();
    if (event.type === "email.received") {
      const { data: email, error } = await resend.emails.receiving.get(
        event.data.email_id,
      );
      if (error || !email) throw new Error("Fetch failed");
      const ids = [
        ...new Set(
          email.to.map(matchReplyAddress).filter((id): id is string => !!id),
        ),
      ];
      if (ids.length !== 1)
        return NextResponse.json(
          { error: "Unmatched reply; reconcile in provider inbox" },
          { status: 422 },
        );
      const { data: c, error: e } = await db
        .from("marketing_consultations")
        .select("payload")
        .eq("id", ids[0])
        .single();
      if (e || !c) throw e;
      const sender = email.from.match(/<([^>]+)>/)?.[1] || email.from;
      if (sender.toLowerCase() !== c.payload.email.toLowerCase())
        return NextResponse.json(
          { error: "Sender mismatch; manual reconciliation required" },
          { status: 422 },
        );
      await action(ids[0], "reply", {
        event_key: `resend-inbound:${event.data.email_id}`,
        body: (email.text || "[텍스트 본문 없음 — 수신 원본 확인 필요]").slice(
          0,
          30000,
        ),
        subject: email.subject,
        provider_id: event.data.email_id,
        from: sender,
      });
    } else if (
      [
        "email.delivered",
        "email.bounced",
        "email.delivery_delayed",
        "email.complained",
      ].includes(event.type) &&
      "email_id" in event.data
    ) {
      const providerId = event.data.email_id;
      const { data: d, error } = await db
        .from("marketing_drafts")
        .select("consultation_id")
        .eq("provider_id", providerId)
        .maybeSingle();
      if (error) throw error;
      if (!d)
        return NextResponse.json(
          { error: "Send result not yet reconciled" },
          { status: 503 },
        );
      const saved = await db
        .from("marketing_events")
        .upsert(
          {
            consultation_id: d.consultation_id,
            kind: event.type,
            event_key: `resend:${req.headers.get("svix-id")}`,
            payload: { provider_id: providerId },
          },
          { onConflict: "event_key", ignoreDuplicates: true },
        );
      if (saved.error) throw saved.error;
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "저장 확인 실패. 제공자 재전송 필요." },
      { status: 503 },
    );
  }
}
