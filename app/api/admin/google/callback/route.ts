import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { localRequest } from "@/lib/auth";
import { unseal, seal, mailbox } from "@/lib/inquiry-mail";
import { setting } from "@/lib/local-store";
export const runtime = "nodejs";
export async function GET(request: Request) {
  if (!(await localRequest()))
    return NextResponse.json(
      { error: "관리자에 다시 로그인해주세요" },
      { status: 401 },
    );
  const p = new URL(request.url).searchParams;
  const response = NextResponse.redirect("http://127.0.0.1:3111/admin");
  response.cookies.set("aio_google_flow", "", {
    path: "/api/admin/google",
    maxAge: 0,
  });
  try {
    const flow = JSON.parse(
      unseal((await cookies()).get("aio_google_flow")?.value ?? ""),
    );
    if (
      flow.expires < Date.now() ||
      p.get("state") !== flow.state ||
      !p.get("code") ||
      !["read", "send"].includes(flow.mode)
    )
      throw Error();
    const r = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: p.get("code")!,
        client_id: process.env.GMAIL_CLIENT_ID!,
        client_secret: process.env.GMAIL_CLIENT_SECRET!,
        redirect_uri: "http://127.0.0.1:3111/api/admin/google/callback",
        grant_type: "authorization_code",
        code_verifier: flow.verifier,
      }),
      signal: AbortSignal.timeout(15000),
    });
    const d = await r.json();
    if (!r.ok || !d.refresh_token) throw Error();
    const profile = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: { Authorization: "Bearer " + d.access_token },
        signal: AbortSignal.timeout(10000),
      },
    );
    const identity = await profile.json();
    if (
      !profile.ok ||
      identity.email?.toLowerCase() !== mailbox ||
      !identity.email_verified
    )
      throw Error();
    await setting("gmail_" + flow.mode, seal(d.refresh_token));
    return response;
  } catch {
    const failure = NextResponse.json(
      {
        error:
          "Google 연결을 완료하지 못했습니다 aiomake2023@gmail.com 계정으로 다시 연결해주세요",
      },
      { status: 400 },
    );
    failure.cookies.set("aio_google_flow", "", {
      path: "/api/admin/google",
      maxAge: 0,
    });
    return failure;
  }
}
