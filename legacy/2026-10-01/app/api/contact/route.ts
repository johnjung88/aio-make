import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase";
import { createResendClient, getInquiryRecipient } from "@/lib/resend";
import { markSessionConverted } from "@/lib/analytics/server";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().default(""),
  service_category: z.enum(["web", "app", "design", "video", "automation"]).optional(),
  source: z.enum(["soomgo", "kmong", "search", "referral", "direct"]).optional(),
  sessionUid: z.string().min(1).max(200).optional(),
  budget_range: z
    .enum([
      "under-50k",
      "50k-300k",
      "300k-1m",
      "1m-3m",
      "3m-plus",
      "under-100k",
      "100k-500k",
      "500k-1m",
      "1m-plus",
    ])
    .optional(),
  message: z.string().trim().min(1).max(2000),
  locale: z.enum(["ko", "en"]),
});

type ContactInsertResult = { id: string };

const contactCategoryMap: Record<NonNullable<z.infer<typeof contactSchema>["service_category"]>, { quoteCategory: string; serviceKey: string; assignedPmQueue: string }> = {
  web: { quoteCategory: "website", serviceKey: "website", assignedPmQueue: "aio_pm_website" },
  app: { quoteCategory: "automation", serviceKey: "automation-app", assignedPmQueue: "aio_director_dev" },
  design: { quoteCategory: "detail", serviceKey: "detail-page", assignedPmQueue: "aio_pm_page" },
  video: { quoteCategory: "video", serviceKey: "video-content", assignedPmQueue: "aio_pm_sns" },
  automation: { quoteCategory: "automation", serviceKey: "automation-app", assignedPmQueue: "aio_director_dev" },
};

async function sendContactEmail(payload: z.infer<typeof contactSchema>, inquiryId?: string) {
  const resend = createResendClient();
  if (!resend) return;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "AIO Agency <onboarding@resend.dev>",
    to: getInquiryRecipient(),
    subject: `[AIO Contact] ${payload.service_category ?? "general"} - ${payload.name}`,
    text: [
      `Inquiry ID: ${inquiryId ?? "not saved"}`,
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone || "-"}`,
      `Service: ${payload.service_category ?? "-"}`,
      `Source: ${payload.source ?? "-"}`,
      `Budget: ${payload.budget_range ?? "-"}`,
      `Locale: ${payload.locale}`,
      "",
      payload.message,
    ].join("\n"),
  });
}

export async function POST(request: Request) {
  try {
    const rawBody: unknown = await request.json();
    const parsed = contactSchema.safeParse(rawBody);

    if (!parsed.success) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid request body",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    const payload = parsed.data;

    const categoryInfo = payload.service_category
      ? contactCategoryMap[payload.service_category]
      : { quoteCategory: "other", serviceKey: "other", assignedPmQueue: "aio_pm_insales" };
    const sourceMeta = {
      source: payload.source ?? "direct",
      locale: payload.locale,
      public_category: payload.service_category ?? null,
      entry_path: `/${payload.locale}/contact`,
      service_key: categoryInfo.serviceKey,
      assigned_pm_queue: categoryInfo.assignedPmQueue,
      handoff_status: "new",
      handoff_reason: `${payload.service_category ?? "general"} contact form submitted`,
      notification_status: "pending",
    };

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
      .single<ContactInsertResult>();

    let data: ContactInsertResult | null = null;
    let error = leadError;

    if (!leadError && lead) {
      const request = await supabase
        .from("quote_requests")
        .insert({
          lead_id: lead.id,
          channel: "website",
          raw_text: payload.message,
          category: categoryInfo.quoteCategory,
          customer_summary: `${payload.name} / contact / ${categoryInfo.assignedPmQueue}`,
          status: "new",
        })
        .select("id")
        .single<ContactInsertResult>();
      data = request.data;
      error = request.error;
    }

    if (error || !data) {
      console.error("[contact] unified inbox insert error:", error?.message);
      const fallback = await supabase
        .from("ada_inquiries")
        .insert({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          service_category: payload.service_category ?? null,
          source: payload.source ?? null,
          budget_range: payload.budget_range ?? null,
          message: [
            payload.message,
            "",
            `[handoff] service_key=${sourceMeta.service_key} assigned_pm_queue=${sourceMeta.assigned_pm_queue} entry_path=${sourceMeta.entry_path}`,
          ].join("\n"),
          locale: payload.locale,
        })
        .select("id")
        .single<ContactInsertResult>();

      data = fallback.data;
      error = fallback.error;
    }

    if (error || !data) {
      console.error("[contact] supabase insert error:", error?.message);
      const errorResponse: ApiResponse<null> = { success: false, error: error?.message ?? "Contact was not saved" };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // 방문 세션 → 문의 전환 연결
    if (payload.sessionUid && lead?.id) {
      markSessionConverted(payload.sessionUid, lead.id).catch(() => {});
    }

    try {
      await sendContactEmail(payload, data.id);
    } catch (emailError) {
      const message = emailError instanceof Error ? emailError.message : "Unknown email error";
      console.error("[contact] email error:", message);
    }

    const successResponse: ApiResponse<{ inquiryId: string }> = {
      success: true,
      data: { inquiryId: data.id },
    };
    return NextResponse.json(successResponse, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.error("[contact] unhandled error:", message);
    const errorResponse: ApiResponse<null> = { success: false, error: message };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
