import "server-only";
import { localMode } from "./local-store";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookie, createToken, verifyToken } from "./session";
export { credentialsReady, verifyCredentials } from "./session";
export async function localRequest() {
  const host = (await headers()).get("host") ?? "";
  return localMode() && /^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host);
}
export async function hasAdmin() {
  if (!(await localRequest())) return false;
  return verifyToken((await cookies()).get(sessionCookie)?.value ?? "");
}
export async function requireAdmin() {
  if (!(await hasAdmin())) redirect("/admin/login");
}
export async function setSession() {
  (await cookies()).set(sessionCookie, createToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production" && !localMode(),
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}
export async function clearSession() {
  (await cookies()).delete(sessionCookie);
}
