import { NextResponse } from "next/server";
import { credentialsReady, verifyCredentials, setSession } from "@/lib/auth";
import { sameOrigin, readJson, rateLimit } from "@/lib/http";
import { adminRequest } from "@/lib/auth";
export async function POST(request: Request) {
  if (!(await adminRequest()))
    return NextResponse.json(
      { error: "관리자 연결 설정을 확인해주세요" },
      { status: 404 },
    );
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "허용되지 않은 요청입니다" },
      { status: 403 },
    );
  if (!credentialsReady())
    return NextResponse.json(
      { error: "관리자 계정 설정이 필요합니다" },
      { status: 503 },
    );

  if (!(await rateLimit(request, "admin-login", 5, 900)))
    return NextResponse.json(
      { error: "로그인 시도가 제한되었습니다 잠시 뒤 다시 시도해주세요" },
      { status: 429 },
    );
  try {
    const body = await readJson(request);
    if (
      typeof body.username !== "string" ||
      typeof body.password !== "string" ||
      body.username.length > 100 ||
      body.password.length > 500 ||
      !verifyCredentials(body.username, body.password)
    )
      return NextResponse.json(
        { error: "아이디 또는 비밀번호를 확인해주세요" },
        { status: 401 },
      );
    await setSession();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "로그인 요청 형식을 확인해주세요" },
      { status: 400 },
    );
  }
}
