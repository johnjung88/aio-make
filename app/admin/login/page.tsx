import Link from "next/link";
import { redirect } from "next/navigation";
import { hasAdmin } from "@/lib/auth";
import { Brand } from "@/components/site-shell";
import { AdminLogin } from "@/components/admin-login";
export const dynamic = "force-dynamic";
export default async function Login() {
  if (await hasAdmin()) redirect("/admin");
  return (
    <div className="login-layout">
      <div className="login-brand">
        <Link href="/">
          <Brand />
        </Link>
        <div>
          <p className="eyebrow">YOUR WORK. CONNECTED.</p>
          <h1>
            문의부터
            <br />
            다음 프로젝트까지
          </h1>
          <p>이 PC에서 문의와 상담 내역, 방문 통계를 관리합니다</p>
        </div>
        <span className="mono">AIO MAKE / MANAGEMENT</span>
      </div>
      <div className="login-form-area">
        <AdminLogin />
      </div>
    </div>
  );
}
