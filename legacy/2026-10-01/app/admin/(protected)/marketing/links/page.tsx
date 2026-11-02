import Link from "next/link";
import { Plus } from "lucide-react";
import { TrackingLinksManager } from "@/components/admin/tracking-links-manager";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";

async function getLinks() {
  if (!hasSupabaseAdminConfig()) return [];
  const supabase = createSupabaseAdminClient();

  const [linksRes, clicksRes] = await Promise.all([
    supabase
      .from("tracking_links")
      .select("id, code, destination_path, utm_source, utm_medium, utm_campaign, utm_content, label, is_active, created_at, category_id")
      .order("created_at", { ascending: false }),
    // 클릭수: visitor_sessions.first_tracking_link_id 기준 집계
    supabase
      .from("visitor_sessions")
      .select("first_tracking_link_id")
      .not("first_tracking_link_id", "is", null),
  ]);

  const links = linksRes.data ?? [];
  const sessions = clicksRes.data ?? [];

  // 링크 ID → 클릭수 맵
  const clickMap: Record<string, number> = {};
  for (const s of sessions) {
    const id = s.first_tracking_link_id as string;
    if (id) clickMap[id] = (clickMap[id] ?? 0) + 1;
  }

  return links.map((link) => ({ ...link, click_count: clickMap[link.id] ?? 0 }));
}

export default async function TrackingLinksPage() {
  const links = await getLinks();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-primary">Marketing</p>
          <h2 className="mt-2 text-3xl font-semibold">UTM 추적 링크</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            채널별 단축링크를 발급하여 SNS·이메일 ROI를 추적합니다.
          </p>
        </div>
        <Link
          href="/admin/marketing/links/new"
          className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="size-4" />
          링크 발급
        </Link>
      </div>
      <TrackingLinksManager links={links} />
    </div>
  );
}
