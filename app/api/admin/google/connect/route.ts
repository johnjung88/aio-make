import { NextResponse } from "next/server";
import { hasAdmin } from "@/lib/auth";
import { googleConfigured, seal, mailbox } from "@/lib/inquiry-mail";
import { randomBytes, createHash } from "node:crypto";
export const runtime = "nodejs";
export async function GET(request: Request) {
  if (!(await hasAdmin()))
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  if (!googleConfigured())
    return NextResponse.json(
      { error: "Google OAuth 클라이언트 설정이 필요합니다" },
      { status: 503 },
    );
  const mode =
    new URL(request.url).searchParams.get("mode") === "send" ? "send" : "read";
  const state = randomBytes(24).toString("hex"),
    verifier = randomBytes(32).toString("base64url");
  const redirect = "http://127.0.0.1:3111/api/admin/google/callback";
  const u = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  for (const [k, v] of Object.entries({
    client_id: process.env.GMAIL_CLIENT_ID!,
    redirect_uri: redirect,
    response_type: "code",
    scope:
      "openid email https://www.googleapis.com/auth/gmail." +
      (mode === "send" ? "send" : "readonly"),
    access_type: "offline",
    prompt: "consent",
    login_hint: mailbox,
    state,
    code_challenge: createHash("sha256").update(verifier).digest("base64url"),
    code_challenge_method: "S256",
  }))
    u.searchParams.set(k, v);
  const response = NextResponse.redirect(u);
  response.cookies.set(
    "aio_google_flow",
    seal(
      JSON.stringify({ state, verifier, mode, expires: Date.now() + 600000 }),
    ),
    { httpOnly: true, sameSite: "lax", path: "/api/admin/google", maxAge: 600 },
  );
  return response;
}
