import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertVisitorSession, recordVisitorEvent } from "@/lib/analytics/server";
import { hasSupabaseAdminConfig } from "@/lib/supabase";

const schema = z.object({
  sessionUid: z.string().min(1).max(200),
  eventType:  z.string().min(1).max(80),
  eventPath:  z.string().max(500).optional(),
  eventProps: z.record(z.unknown()).optional(),
  utm: z.object({
    utm_source:   z.string().optional(),
    utm_medium:   z.string().optional(),
    utm_campaign: z.string().optional(),
    utm_content:  z.string().optional(),
    _tl:          z.string().optional(),
  }).optional(),
});

export async function POST(req: Request) {
  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  const { sessionUid, eventType, eventPath, eventProps, utm } = parsed.data;
  const ip  = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ua  = req.headers.get("user-agent") ?? "";
  const ref = req.headers.get("referer") ?? "";

  try {
    const session = await upsertVisitorSession({
      sessionUid,
      ipRaw:   ip,
      ua,
      referer: ref,
      pagePath: eventPath,
      interest: (eventProps?.category as string) ?? undefined,
      utm: utm ? {
        source:       utm.utm_source,
        medium:       utm.utm_medium,
        campaign:     utm.utm_campaign,
        content:      utm.utm_content,
        trackingCode: utm._tl,
      } : undefined,
    });

    if (session?.id) {
      await recordVisitorEvent(session.id, eventType, eventPath, eventProps as Record<string, unknown>);
    }
  } catch (e) {
    console.error("[analytics/track]", e);
  }

  return NextResponse.json({ ok: true });
}
