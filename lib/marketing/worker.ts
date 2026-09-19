import "server-only";
import { Resend } from "resend";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { replyAddress } from "@/lib/marketing/security";
export async function runOne(kind: "slack" | "email") {
  if (process.env.MARKETING_EXTERNAL_ENABLED !== "true")
    throw new Error("External execution disabled");
  if (
    kind === "email" &&
    (!process.env.RESEND_API_KEY ||
      !process.env.RESEND_FROM_EMAIL ||
      !process.env.MARKETING_REPLY_DOMAIN ||
      !process.env.MARKETING_REPLY_SECRET)
  )
    throw new Error("Email configuration missing");
  if (
    kind === "slack" &&
    (!process.env.MARKETING_SLACK_BOT_TOKEN ||
      !process.env.MARKETING_SLACK_CHANNEL)
  )
    throw new Error("Slack configuration missing");
  const db = createSupabaseAdminClient();
  const { data: job, error } = await db.rpc("marketing_claim", {
    p_kind: kind,
  });
  if (error) throw new Error("Claim failed");
  if (!job) return { idle: true };
  try {
    let result: Record<string, string> = {};
    const c = job.consultation;
    const o = job.outbox;
    if (kind === "email") {
      const d = job.draft;
      const resend = new Resend(process.env.RESEND_API_KEY);
      const sent = await resend.emails.send(
        {
          from: process.env.RESEND_FROM_EMAIL!,
          to: [d.recipient],
          subject: d.subject,
          text: d.body,
          replyTo: replyAddress(c.id),
        },
        { idempotencyKey: `marketing-${d.id}` },
      );
      if (sent.error || !sent.data?.id) throw new Error("Delivery unconfirmed");
      result = { provider_id: sent.data.id };
    } else {
      const blocks: unknown[] = [];
      let fallback = `마케팅 상담 ${c.id}`;
      blocks.push({
        type: "section",
        text: {
          type: "plain_text",
          text: `마케팅 상담 · ${c.payload.company} · ${c.payload.name}\n${c.payload.description.slice(0, 2000)}`,
        },
      });
      if (o.payload.draft_id) {
        const { data: d, error: e } = await db
          .from("marketing_drafts")
          .select("*")
          .eq("id", o.payload.draft_id)
          .single();
        if (e || !d) throw new Error("Draft missing");
        fallback += ` · 초안 v${d.version}`;
        blocks.push({
          type: "section",
          text: {
            type: "plain_text",
            text: `이메일 · ${d.recipient}\n제목: ${d.subject}\n초안 v${d.version} · 회신 기준 ${d.reply_revision}`,
          },
        });
        for (let i = 0; i < d.body.length; i += 2500)
          blocks.push({
            type: "section",
            text: { type: "plain_text", text: d.body.slice(i, i + 2500) },
          });
        blocks.push({
          type: "actions",
          elements: [
            {
              type: "button",
              action_id: "marketing_approve",
              text: {
                type: "plain_text",
                text: `v${d.version} 이메일 발송 승인`,
              },
              value: JSON.stringify({ id: c.id, draft_id: d.id }),
              confirm: {
                title: {
                  type: "plain_text",
                  text: "이 초안의 이메일 발송 승인",
                },
                text: {
                  type: "plain_text",
                  text: `수신자: ${d.recipient}\n제목: ${d.subject}\n위에 표시된 v${d.version} 본문을 승인합니다.`,
                },
                confirm: { type: "plain_text", text: "승인" },
                deny: { type: "plain_text", text: "취소" },
              },
            },
          ],
        });
      } else {
        const { data: replies } = await db
          .from("marketing_events")
          .select("payload")
          .eq("consultation_id", c.id)
          .eq("kind", "reply")
          .order("created_at", { ascending: false })
          .limit(1);
        if (replies?.[0])
          blocks.push({
            type: "section",
            text: {
              type: "plain_text",
              text: `고객 후속 회신: ${(replies[0].payload.body || "").slice(0, 2500)}`,
            },
          });
      }
      const response = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.MARKETING_SLACK_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: process.env.MARKETING_SLACK_CHANNEL,
          thread_ts: c.slack_thread || undefined,
          client_msg_id: o.id,
          text: fallback,
          blocks,
          unfurl_links: false,
          unfurl_media: false,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const sent = await response.json();
      if (!response.ok || !sent.ok || !sent.ts)
        throw new Error("Slack delivery unconfirmed");
      result = { thread_ts: c.slack_thread || sent.ts, message_ts: sent.ts };
    }
    const finish = await db.rpc("marketing_finish", {
      p_outbox: job.outbox.id,
      p_state: "done",
      p_result: result,
    });
    if (finish.error) throw new Error("Completion unconfirmed");
    return { success: true };
  } catch {
    await db.rpc("marketing_finish", {
      p_outbox: job.outbox.id,
      p_state: "unknown",
      p_result: { reason: "외부 결과 확인 필요. 자동 재시도 금지." },
    });
    return { success: false, reconciliation: true };
  }
}
