import { NextResponse } from "next/server";
import { hasAdmin } from "@/lib/auth";
import { sameOrigin } from "@/lib/http";
import { syncInquiries, mailError } from "@/lib/inquiry-mail";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!(await hasAdmin()))
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "허용되지 않은 요청입니다" },
      { status: 403 },
    );
  try {
    return NextResponse.json(await syncInquiries());
  } catch (e) {
    return NextResponse.json({ error: mailError(e) }, { status: 503 });
  }
}
