import { NextResponse } from "next/server";
import { setAdminSessionCookie, verifyAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url), {
      status: 303,
    });
  }

  await setAdminSessionCookie();
  return NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
}
