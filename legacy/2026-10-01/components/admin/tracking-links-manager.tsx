"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, ToggleLeft, ToggleRight } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aio-make.com";

type TrackingLink = {
  id: string;
  code: string;
  destination_path: string;
  utm_source: string;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  label: string | null;
  is_active: boolean;
  created_at: string;
  category_id: string | null;
  click_count?: number;
};

export function TrackingLinksManager({ links }: { links: TrackingLink[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  async function toggleActive(link: TrackingLink) {
    await fetch("/api/admin/tracking-links", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: link.id, isActive: !link.is_active }),
    });
    startTransition(() => router.refresh());
  }

  if (links.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-card p-12 text-center text-sm text-muted-foreground">
        발급된 추적 링크가 없습니다. 위에서 새 링크를 발급하세요.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-card">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-sm font-semibold">발급된 링크 ({links.length}개)</p>
      </div>
      <div className="divide-y divide-white/8">
        {links.map((link) => {
          const shortUrl = `${SITE_URL}/api/track/${link.code}`;
          return (
            <div key={link.id} className={`px-5 py-4 ${!link.is_active ? "opacity-50" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {link.label && (
                      <span className="text-sm font-medium text-foreground">{link.label}</span>
                    )}
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-muted-foreground">
                      {link.utm_source}
                      {link.utm_medium ? ` / ${link.utm_medium}` : ""}
                    </span>
                    {link.utm_campaign && (
                      <span className="text-[11px] text-muted-foreground">{link.utm_campaign}</span>
                    )}
                    {link.click_count != null && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary font-medium">
                        클릭 {link.click_count}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-primary">{shortUrl}</code>
                    <button
                      onClick={() => copy(shortUrl, link.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {copiedId === link.id
                        ? <Check className="size-3.5 text-green-400" />
                        : <Copy className="size-3.5" />
                      }
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{link.destination_path}</p>
                </div>

                <button
                  onClick={() => toggleActive(link)}
                  disabled={isPending}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  title={link.is_active ? "비활성화" : "활성화"}
                >
                  {link.is_active
                    ? <ToggleRight className="size-5 text-green-400" />
                    : <ToggleLeft className="size-5" />
                  }
                </button>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {new Date(link.created_at).toLocaleDateString("ko-KR")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
