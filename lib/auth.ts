import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookie, createToken, verifyToken } from "./session";
export { credentialsReady, verifyCredentials } from "./session";
export async function hasAdmin() {
  return verifyToken((await cookies()).get(sessionCookie)?.value ?? "");
}
export async function requireAdmin() {
  if (!(await hasAdmin())) redirect("/admin/login");
}
export async function setSession() {
  (await cookies()).set(sessionCookie, createToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}
export async function clearSession() {
  (await cookies()).delete(sessionCookie);
}
