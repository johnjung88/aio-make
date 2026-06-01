import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "관리자 로그인 | AIO에이전시",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getAdminSession()) {
    redirect("/admin");
  }

  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-md items-center">
        <form action="/api/admin/login" method="post" className="w-full rounded-lg border border-white/10 bg-card p-8">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase text-primary">AIO-MAKE Admin</p>
            <h1 className="mt-3 text-2xl font-semibold">관리자 로그인</h1>
            <p className="mt-2 text-sm text-muted-foreground">아이디와 비밀번호로 관리자 페이지에 접속합니다.</p>
          </div>

          <label className="mb-2 block text-xs font-medium text-muted-foreground" htmlFor="username">
            아이디
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            autoComplete="username"
            className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm outline-none transition focus:border-primary/60"
          />

          <label className="mb-2 mt-4 block text-xs font-medium text-muted-foreground" htmlFor="password">
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm outline-none transition focus:border-primary/60"
          />

          {error === "invalid" && (
            <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">아이디 또는 비밀번호가 맞지 않습니다.</p>
          )}

          <button
            type="submit"
            className="mt-6 h-11 w-full rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-85"
          >
            로그인
          </button>
        </form>
      </div>
    </main>
  );
}
