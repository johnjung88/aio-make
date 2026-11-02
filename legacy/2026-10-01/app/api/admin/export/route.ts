import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { buildOperationsExcel } from "@/lib/admin/excel-export";
import { hasSupabaseAdminConfig } from "@/lib/supabase";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  }

  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json({ error: "Supabase 관리자 환경변수가 없어 내보낼 수 없습니다." }, { status: 503 });
  }

  try {
    const { buffer, filename } = await buildOperationsExcel(new Date());

    // Buffer → Uint8Array 변환 (Next.js 15 Web API Response 호환)
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[admin/export] 엑셀 생성 실패:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "엑셀 생성에 실패했습니다." },
      { status: 500 },
    );
  }
}
