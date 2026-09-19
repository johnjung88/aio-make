import { NextResponse } from "next/server";
import { hasSupabaseAdminConfig } from "@/lib/supabase";
export async function GET() {
  return NextResponse.json(
    {
      version: process.env.MARKETING_CONSENT_VERSION || "pending",
      text:
        process.env.MARKETING_CONSENT_NOTICE ||
        "개인정보 처리자·보유기간·문의처를 포함한 상담 안내를 준비하고 있습니다.",
      enabled:
        process.env.MARKETING_INTAKE_ENABLED === "true" &&
        !!process.env.MARKETING_CONSENT_VERSION &&
        !!process.env.MARKETING_CONSENT_NOTICE &&
        hasSupabaseAdminConfig(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
