import "server-only";
import crypto from "crypto";
import { createSupabaseAdminClient } from "@/lib/supabase";

function hashIp(ip: string): string {
  const secret = process.env.ANALYTICS_HMAC_SECRET ?? "aio-analytics";
  return crypto.createHash("sha256").update(ip + secret).digest("hex").slice(0, 32);
}

function summarizeUa(ua: string): string {
  if (!ua) return "unknown";
  if (/iPhone|Android.*Mobile|Mobile/.test(ua)) return "mobile";
  if (/iPad|Tablet/.test(ua)) return "tablet";
  if (/bot|crawler|spider|Googlebot|Bingbot/i.test(ua)) return "bot";
  return "desktop";
}

function detectDevice(uaSummary: string): "desktop" | "mobile" | "tablet" | "bot" | "other" {
  if (["desktop","mobile","tablet","bot"].includes(uaSummary)) {
    return uaSummary as "desktop" | "mobile" | "tablet" | "bot";
  }
  return "other";
}

function extractHost(referer: string): string | null {
  try {
    return new URL(referer).hostname || null;
  } catch {
    return null;
  }
}

export type UpsertSessionInput = {
  sessionUid: string;
  ipRaw: string;
  ua: string;
  referer: string;
  pagePath?: string;
  interest?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    trackingCode?: string;
  };
};

export async function upsertVisitorSession(input: UpsertSessionInput) {
  const supabase = createSupabaseAdminClient();
  const uaSummary = summarizeUa(input.ua);

  // 기존 세션 조회
  const { data: existing } = await supabase
    .from("visitor_sessions")
    .select("id, interests, total_pageviews")
    .eq("session_uid", input.sessionUid)
    .maybeSingle();

  if (existing) {
    const newInterests =
      input.interest && !existing.interests.includes(input.interest)
        ? [...existing.interests, input.interest]
        : existing.interests;

    const { data } = await supabase
      .from("visitor_sessions")
      .update({
        last_seen_at: new Date().toISOString(),
        total_pageviews: existing.total_pageviews + 1,
        interests: newInterests,
      })
      .eq("id", existing.id)
      .select("id")
      .single();
    return data;
  }

  // 단축링크 코드로 tracking_link_id 조회
  let trackingLinkId: string | null = null;
  if (input.utm?.trackingCode) {
    const { data: link } = await supabase
      .from("tracking_links")
      .select("id")
      .eq("code", input.utm.trackingCode)
      .maybeSingle();
    trackingLinkId = link?.id ?? null;
  }

  const { data } = await supabase
    .from("visitor_sessions")
    .insert({
      session_uid: input.sessionUid,
      ip_hash: hashIp(input.ipRaw),
      ua_summary: uaSummary,
      device: detectDevice(uaSummary),
      referrer_host: extractHost(input.referer),
      first_landing_path: input.pagePath ?? null,
      first_utm_source: input.utm?.source ?? null,
      first_utm_medium: input.utm?.medium ?? null,
      first_utm_campaign: input.utm?.campaign ?? null,
      first_utm_content: input.utm?.content ?? null,
      first_tracking_link_id: trackingLinkId,
      interests: input.interest ? [input.interest] : [],
      total_pageviews: 1,
    })
    .select("id")
    .single();
  return data;
}

export async function recordVisitorEvent(
  sessionId: string,
  eventType: string,
  eventPath?: string,
  eventProps?: Record<string, unknown>,
) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("visitor_events").insert({
    session_id: sessionId,
    event_type: eventType,
    event_path: eventPath ?? null,
    event_props: eventProps ?? {},
  });

  // 채팅 메시지 발송 시 total_chat_messages 증가
  if (eventType === "submit_chat") {
    const { data: sess } = await supabase
      .from("visitor_sessions")
      .select("total_chat_messages")
      .eq("id", sessionId)
      .single();
    if (sess) {
      await supabase
        .from("visitor_sessions")
        .update({ total_chat_messages: (sess.total_chat_messages ?? 0) + 1 })
        .eq("id", sessionId);
    }
  }
}

export async function markSessionConverted(sessionUid: string, leadId: string) {
  const supabase = createSupabaseAdminClient();
  await supabase
    .from("visitor_sessions")
    .update({ has_converted: true, lead_id: leadId })
    .eq("session_uid", sessionUid)
    .eq("has_converted", false); // 이미 전환된 세션은 덮어쓰지 않음
}
