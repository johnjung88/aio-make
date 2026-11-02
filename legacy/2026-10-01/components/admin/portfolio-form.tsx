"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminPortfolio } from "@/lib/admin/portfolios";

const CATEGORIES = [
  { id: "website",            label: "웹사이트" },
  { id: "shopping-mall",      label: "쇼핑몰" },
  { id: "logo-business-card", label: "로고·명함" },
  { id: "detail-page",        label: "상세페이지" },
  { id: "ppt-design",         label: "PPT 디자인" },
  { id: "automation-app",     label: "자동화·앱" },
  { id: "video-content",      label: "영상 콘텐츠" },
];

function inp() {
  return "h-10 w-full rounded-lg border border-white/10 bg-background px-3 text-sm outline-none transition focus:border-primary";
}
function area() {
  return "w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm outline-none transition focus:border-primary";
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

type FormValues = {
  slug: string;
  primaryCategoryId: string;
  titleKo: string;
  titleEn: string;
  clientName: string;
  summaryKo: string;
  summaryEn: string;
  durationDays: string;
  isFeatured: boolean;
  isPublished: boolean;
  externalUrl: string;
  techStack: string;
  testimonial: string;
  coverUrl: string;
};

function init(p?: AdminPortfolio): FormValues {
  return {
    slug:              p?.slug ?? "",
    primaryCategoryId: p?.primaryCategoryId ?? "website",
    titleKo:           p?.titleKo ?? "",
    titleEn:           p?.titleEn ?? "",
    clientName:        p?.clientName ?? "",
    summaryKo:         p?.summaryKo ?? "",
    summaryEn:         p?.summaryEn ?? "",
    durationDays:      p?.durationDays ? String(p.durationDays) : "",
    isFeatured:        p?.isFeatured ?? false,
    isPublished:       p?.isPublished ?? true,
    externalUrl:       p?.externalUrl ?? "",
    techStack:         p?.techStack.join(", ") ?? "",
    testimonial:       p?.testimonial ?? "",
    coverUrl:          p?.coverUrl ?? "",
  };
}

interface Props {
  portfolio?: AdminPortfolio;
}

export function PortfolioForm({ portfolio }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormValues>(init(portfolio));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isEdit = Boolean(portfolio);

  function set(key: keyof FormValues, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      slug:              form.slug,
      primaryCategoryId: form.primaryCategoryId,
      titleKo:           form.titleKo,
      titleEn:           form.titleEn,
      clientName:        form.clientName,
      summaryKo:         form.summaryKo,
      summaryEn:         form.summaryEn,
      durationDays:      form.durationDays ? parseInt(form.durationDays, 10) : null,
      isFeatured:        form.isFeatured,
      isPublished:       form.isPublished,
      externalUrl:       form.externalUrl,
      techStack:         form.techStack.split(",").map((s) => s.trim()).filter(Boolean),
      testimonial:       form.testimonial,
      coverUrl:          form.coverUrl,
    };

    const url = isEdit ? `/api/admin/portfolios/${portfolio!.id}` : "/api/admin/portfolios";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = (await res.json()) as { success: boolean; error?: string };

    if (!res.ok || !json.success) {
      setError(json.error ?? "저장에 실패했습니다.");
      return;
    }

    setSuccess(isEdit ? "수정이 완료되었습니다." : "포트폴리오가 등록되었습니다.");
    startTransition(() => {
      if (!isEdit) router.push("/admin/portfolios");
      else router.refresh();
    });
  }

  async function handleDelete() {
    if (!portfolio) return;
    if (!confirm(`"${portfolio.titleKo}"를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) return;

    const res = await fetch(`/api/admin/portfolios/${portfolio.id}`, { method: "DELETE" });
    const json = (await res.json()) as { success: boolean; error?: string };
    if (!res.ok || !json.success) {
      setError(json.error ?? "삭제에 실패했습니다.");
      return;
    }
    router.push("/admin/portfolios");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {success}
        </p>
      )}

      {/* 기본 정보 */}
      <section className="rounded-xl border border-white/10 bg-card p-6">
        <h3 className="mb-5 text-sm font-semibold">기본 정보</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">제목 (한국어) *</label>
            <input
              className={inp()}
              required
              value={form.titleKo}
              onChange={(e) => {
                set("titleKo", e.target.value);
                if (!isEdit && !form.slug) set("slug", slugify(e.target.value));
              }}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">제목 (영어)</label>
            <input className={inp()} value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Slug * (URL에 사용 — 영문 소문자/숫자/하이픈)</label>
            <input
              className={inp()}
              required
              pattern="^[a-z0-9-]+$"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              disabled={isEdit}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">카테고리 *</label>
            <select
              className={inp()}
              value={form.primaryCategoryId}
              onChange={(e) => set("primaryCategoryId", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">클라이언트명</label>
            <input className={inp()} value={form.clientName} onChange={(e) => set("clientName", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">작업 일수</label>
            <input
              className={inp()}
              type="number"
              min={1}
              max={999}
              value={form.durationDays}
              onChange={(e) => set("durationDays", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 요약 */}
      <section className="rounded-xl border border-white/10 bg-card p-6">
        <h3 className="mb-5 text-sm font-semibold">요약 설명</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">요약 (한국어)</label>
            <textarea
              className={`${area()} min-h-24`}
              value={form.summaryKo}
              onChange={(e) => set("summaryKo", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">요약 (영어)</label>
            <textarea
              className={`${area()} min-h-24`}
              value={form.summaryEn}
              onChange={(e) => set("summaryEn", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 미디어 & 링크 */}
      <section className="rounded-xl border border-white/10 bg-card p-6">
        <h3 className="mb-5 text-sm font-semibold">미디어 & 링크</h3>
        <div className="grid gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">커버 이미지 경로</label>
            <input
              className={inp()}
              placeholder="/portfolio/logo-showcase/moru-coffee/cover.jpg"
              value={form.coverUrl}
              onChange={(e) => set("coverUrl", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">라이브 URL</label>
            <input
              className={inp()}
              type="url"
              placeholder="https://example.com"
              value={form.externalUrl}
              onChange={(e) => set("externalUrl", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">기술 스택 (쉼표로 구분)</label>
            <input
              className={inp()}
              placeholder="Next.js, Supabase, Tailwind CSS"
              value={form.techStack}
              onChange={(e) => set("techStack", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">클라이언트 후기 (선택)</label>
            <textarea
              className={`${area()} min-h-20`}
              value={form.testimonial}
              onChange={(e) => set("testimonial", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 게시 설정 */}
      <section className="rounded-xl border border-white/10 bg-card p-6">
        <h3 className="mb-5 text-sm font-semibold">게시 설정</h3>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="size-4 accent-primary"
              checked={form.isPublished}
              onChange={(e) => set("isPublished", e.target.checked)}
            />
            게시 (published)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="size-4 accent-primary"
              checked={form.isFeatured}
              onChange={(e) => set("isFeatured", e.target.checked)}
            />
            추천 (featured) — 홈 HOT ITEMS에 노출
          </label>
        </div>
      </section>

      {/* 액션 */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="text-sm text-muted-foreground underline hover:text-foreground"
          onClick={() => router.back()}
        >
          취소
        </button>
        <div className="flex items-center gap-3">
          {isEdit && (
            <button
              type="button"
              className="h-10 rounded-lg border border-red-500/30 px-4 text-sm text-red-400 hover:bg-red-500/10"
              onClick={handleDelete}
            >
              삭제
            </button>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="h-10 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {isPending ? "저장 중..." : isEdit ? "수정 저장" : "등록"}
          </button>
        </div>
      </div>
    </form>
  );
}
