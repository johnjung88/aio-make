import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase";
import { createResendClient, getInquiryRecipient } from "@/lib/resend";
import { notifyTelegram } from "@/lib/admin/telegram";
import { markSessionConverted } from "@/lib/analytics/server";
import { getHandoffInfo, normalizeEntryPath } from "@/lib/service-handoff";
import type { ServiceCategory } from "@/lib/services-data";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

const quoteSchema = z.object({
  sessionUid: z.string().max(200).optional(),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().default(""),
  category: z.enum([
    "website",
    "shopping-mall",
    "logo-business-card",
    "detail-page",
    "ppt-design",
    "automation-app",
    "video-content",
    "marketing",
  ]),
  subtype: z.string().trim().max(80).optional().default(""),
  budget_range: z.string().trim().max(80).optional().default(""),
  timeline: z.string().trim().max(80).optional().default(""),
  rush: z.boolean().optional().default(false),
  source: z.enum(["soomgo", "kmong", "email", "direct", "search", "referral", "portfolio", "service_page", "home"]).optional().default("direct"),
  entry_path: z.string().trim().max(500).optional().default("/quote"),
  service_key: z.string().trim().max(80).optional(),
  assigned_pm_queue: z.string().trim().max(80).optional(),
  handoff_status: z.enum(["new", "needs_triage", "assigned"]).optional().default("new"),
  handoff_reason: z.string().trim().max(500).optional().default(""),
  consent_privacy: z.boolean().optional().default(false),
  description: z.string().trim().min(1).max(3000),
  contact_method: z.enum(["email", "phone"]).optional().default("email"),
  locale: z.enum(["ko", "en"]),
});

const categoryMap: Record<z.infer<typeof quoteSchema>["category"], string> = {
  website: "website",
  "shopping-mall": "shop",
  "logo-business-card": "logo",
  "detail-page": "detail",
  "ppt-design": "ppt",
  "automation-app": "automation",
  "video-content": "video",
  marketing: "marketing",
};

async function sendQuoteEmail(payload: z.infer<typeof quoteSchema>, inquiryId?: string) {
  const resend = createResendClient();
  if (!resend) return;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "AIO Agency <onboarding@resend.dev>",
    to: getInquiryRecipient(),
    subject: `[AIO Quote] ${payload.category}${payload.subtype ? ` / ${payload.subtype}` : ""} - ${payload.name}`,
    text: [
      `Inquiry ID: ${inquiryId ?? "not saved"}`,
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone || "-"}`,
      `Category: ${payload.category}`,
      `Subtype: ${payload.subtype || "-"}`,
      `Budget: ${payload.budget_range || "-"}`,
      `Timeline: ${payload.timeline || "-"}`,
      `Rush: ${payload.rush ? "yes" : "no"}`,
      `Source: ${payload.source || "-"}`,
      `Entry path: ${payload.entry_path || "-"}`,
      `Service key: ${payload.service_key || payload.category}`,
      `Assigned PM queue: ${payload.assigned_pm_queue || "auto"}`,
      `Handoff status: ${payload.handoff_status}`,
      `Privacy consent: ${payload.consent_privacy ? "yes" : "no"}`,
      `Preferred contact: ${payload.contact_method}`,
      "",
      payload.description,
    ].join("\n"),
  });
}

export async function POST(request: Request) {
  try {
    const rawBody: unknown = await request.json();
    const parsed = quoteSchema.safeParse(rawBody);

    if (!parsed.success) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid request body",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const payload = parsed.data;
    if (!payload.consent_privacy) {
      const errorResponse: ApiResponse<null> = { success: false, error: "Privacy consent is required" };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const handoff = getHandoffInfo(payload.category as ServiceCategory, payload.subtype);
    const sourceMeta = {
      source: payload.source,
      locale: payload.locale,
      contact_method: payload.contact_method,
      public_category: payload.category,
      subtype: payload.subtype || null,
      entry_path: normalizeEntryPath(payload.entry_path, `/${payload.locale}/quote`),
      service_key: payload.service_key || handoff.serviceKey,
      assigned_pm_queue: payload.assigned_pm_queue || handoff.assignedPmQueue,
      handoff_status: payload.handoff_status || handoff.handoffStatus,
      handoff_reason: payload.handoff_reason || handoff.handoffReason,
      notification_status: "pending",
      consent_privacy: payload.consent_privacy,
    };

    const supabase = createSupabaseServerClient();

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert({
        channel: "website",
        customer_name: payload.name,
        email: payload.email,
        phone: payload.phone || null,
        source_meta: sourceMeta,
      })
      .select("id")
      .single<{ id: string }>();

    let { data, error } = leadError || !lead ? { data: null, error: leadError } : await supabase
      .from("quote_requests")
      .insert({
        lead_id: lead.id,
        channel: "website",
        raw_text: payload.description,
        category: categoryMap[payload.category],
        customer_summary: `${payload.name} / ${payload.category}${payload.subtype ? ` / ${payload.subtype}` : ""} / ${sourceMeta.assigned_pm_queue}`,
        deadline_text: payload.timeline || null,
        urgency: payload.rush ? "urgent" : "normal",
        status: "new",
      })
      .select("id")
      .single<{ id: string }>();

    if (error) {
      console.error("[quote] unified insert error:", error.message);
      const legacyQuote = await supabase
        .from("quote_requests")
        .insert({
          source: payload.source,
          raw_text: payload.description,
          category: payload.category,
          subtype: payload.subtype || null,
          budget_estimate: payload.budget_range || null,
          urgency: payload.rush ? "high" : payload.timeline,
          draft_response: null,
          status: "new",
          notes: JSON.stringify({
            ...sourceMeta,
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            timeline: payload.timeline,
          }),
        })
        .select("id")
        .single<{ id: string }>();

      data = legacyQuote.data;
      error = legacyQuote.error;
    }

    if (error) {
      console.error("[quote] legacy quote_requests insert error:", error.message);
      const fallback = await supabase
        .from("ada_inquiries")
        .insert({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          service_category: payload.category,
          source: payload.source,
          budget_range: payload.budget_range || null,
          message: [
            `[Structured quote]`,
            `Subtype: ${payload.subtype || "-"}`,
            `Timeline: ${payload.timeline || "-"}`,
            `Rush: ${payload.rush ? "yes" : "no"}`,
            `Contact method: ${payload.contact_method}`,
            `Entry path: ${sourceMeta.entry_path}`,
            `Service key: ${sourceMeta.service_key}`,
            `Assigned PM queue: ${sourceMeta.assigned_pm_queue}`,
            `Handoff status: ${sourceMeta.handoff_status}`,
            "",
            payload.description,
          ].join("\n"),
          locale: payload.locale,
        })
        .select("id")
        .single<{ id: string }>();

      data = fallback.data;
      error = fallback.error;

      if (error) {
        console.error("[quote] fallback insert error:", error.message);
        const errorResponse: ApiResponse<null> = { success: false, error: error.message };
        return NextResponse.json(errorResponse, { status: 500 });
      }
    }

    if (!data) {
      const errorResponse: ApiResponse<null> = { success: false, error: "Quote was not saved" };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    if (payload.sessionUid) {
      markSessionConverted(payload.sessionUid, data.id).catch(() => {});
    }

    try {
      await sendQuoteEmail(payload, data.id);
    } catch (emailError) {
      const message = emailError instanceof Error ? emailError.message : "Unknown email error";
      console.error("[quote] email error:", message);
    }

    await notifyTelegram(
      [
        "신규 AIO 견적 요청",
        `이름: ${payload.name}`,
        `서비스: ${payload.category}${payload.subtype ? ` / ${payload.subtype}` : ""}`,
        `인계: ${sourceMeta.assigned_pm_queue} / ${sourceMeta.handoff_status}`,
        `진입: ${sourceMeta.entry_path}`,
        `일정: ${payload.timeline || "-"}`,
        `연락: ${payload.email}${payload.phone ? ` / ${payload.phone}` : ""}`,
        `관리자: ${process.env.NEXT_PUBLIC_SITE_URL ?? "https://aio-make.com"}/admin/inbox`,
      ].join("\n"),
    );

    const successResponse: ApiResponse<{ quoteId: string }> = {
      success: true,
      data: { quoteId: data.id },
    };
    return NextResponse.json(successResponse, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.error("[quote] unhandled error:", message);
    const errorResponse: ApiResponse<null> = { success: false, error: message };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
