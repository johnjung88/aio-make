"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check } from "lucide-react";

const SOURCES = ["instagram","facebook","threads","kakao","naver_blog","youtube","x","linkedin","email","tiktok","other"];
const MEDIUMS_BY_SOURCE: Record<string, string[]> = {
  instagram: ["bio","story","post","reel","dm"],
  facebook:  ["bio","post","ad","dm"],
  threads:   ["bio","post"],
  kakao:     ["plus_friend","open_chat","channel"],
  naver_blog:["post","sticker"],
  youtube:   ["description","pinned_comment","community"],
  x:         ["bio","post","dm"],
  linkedin:  ["post","dm","article"],
  email:     ["signature","newsletter"],
  tiktok:    ["bio","post"],
  other:     ["direct","referral"],
};
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

type Result = { shortUrl: string; fullUrl: string; code: string };

export function TrackingLinkForm() {
  const router = useRouter();
  const [source,   setSource]   = useState("instagram");
  const [medium,   setMedium]   = useState("bio");
  const [campaign, setCampaign] = useState("");
  const [content,  setContent]  = useState("");
  const [category, setCategory] = useState("detail-page");
  const [locale,   setLocale]   = useState<"ko"|"en">("ko");
  const [label,    setLabel]    = useState("");
  const [error,    setError]    = useState("");
  const [result,   setResult]   = useState<Result | null>(null);
  const [copied,   setCopied]   = useState(false);
  const [loading,  setLoading]  = useState(false);

  const mediums = MEDIUMS_BY_SOURCE[source] ?? ["direct"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setResult(null); setLoading(true);
    const res = await fetch("/api/admin/tracking-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId:  category,
        locale,
        utmSource:   source,
        utmMedium:   medium,
        utmCampaign: campaign,
        utmContent:  content,
        label,
      }),
    });
    setLoading(false);
    const json = await res.json();
    if (!res.ok || !json.success) { setError(json.error ?? "발급 실패"); return; }
    setResult(json.data);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-white/10 bg-card p-6">
        {error && (
          <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">채널 (utm_source) *</label>
            <select className={inp()} value={source} onChange={(e) => { setSource(e.target.value); setMedium(MEDIUMS_BY_SOURCE[e.target.value]?.[0] ?? "direct"); }}>
              {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">매체 (utm_medium)</label>
            <select className={inp()} value={medium} onChange={(e) => setMedium(e.target.value)}>
              {mediums.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">캠페인 (utm_campaign)</label>
            <input className={inp()} placeholder="2026q2" value={campaign} onChange={(e) => setCampaign(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">콘텐츠 (utm_content)</label>
            <input className={inp()} placeholder="ig_main_bio" value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">목적지 카테고리 *</label>
            <select className={inp()} value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">언어</label>
            <select className={inp()} value={locale} onChange={(e) => setLocale(e.target.value as "ko"|"en")}>
              <option value="ko">한국어 (/ko)</option>
              <option value="en">English (/en)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">메모 (관리자용 라벨)</label>
          <input className={inp()} placeholder="인스타 메인 프로필 5월" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-10 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {loading ? "발급 중..." : "링크 발급"}
        </button>
      </form>

      {result && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6 space-y-4">
          <p className="text-sm font-semibold text-green-300">링크 발급 완료!</p>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">단축 링크</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-background px-3 py-2 text-sm text-primary">{result.shortUrl}</code>
                <button
                  onClick={() => copy(result.shortUrl)}
                  className="flex h-9 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-xs"
                >
                  {copied ? <Check className="size-3.5 text-green-400" /> : <Copy className="size-3.5" />}
                  복사
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">풀 UTM 링크 (플랫폼 직접 입력용)</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded bg-background px-3 py-2 text-xs text-muted-foreground">{result.fullUrl}</code>
                <button
                  onClick={() => copy(result.fullUrl)}
                  className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-xs"
                >
                  <Copy className="size-3.5" />
                  복사
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setResult(null); setLabel(""); }}
              className="h-9 rounded-lg border border-white/10 px-4 text-sm text-muted-foreground hover:text-foreground"
            >
              새 링크 발급
            </button>
            <button
              onClick={() => router.push("/admin/marketing/links")}
              className="h-9 rounded-lg bg-white/5 px-4 text-sm hover:bg-white/10"
            >
              목록 보기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
