"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export function AdminLogin() {
  const router = useRouter(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password"),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      router.replace("/admin");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "로그인에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={login} className="login-form">
      <div>
        <p className="eyebrow">AIO MAKE / ADMIN</p>
        <h2>관리자 로그인</h2>
      </div>
      <label>
        아이디
        <input
          name="username"
          autoComplete="username"
          maxLength={100}
          required
        />
      </label>
      <label>
        비밀번호
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          maxLength={500}
          required
        />
      </label>
      {error && (
        <p role="alert" className="field-error">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className="button">
        {busy ? "로그인 중…" : "로그인 →"}
      </button>
      <p>관리 권한이 있는 담당자만 로그인할 수 있습니다.</p>
      <Link href="/">← 사이트로 돌아가기</Link>
    </form>
  );
}
