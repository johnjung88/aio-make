import "server-only";
import { createClient } from "@supabase/supabase-js";
export function databaseReady() {
  return Boolean(
    process.env.ENABLE_LEGACY_SUPABASE === "true" && process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
export function database() {
  if (!databaseReady()) throw new Error("데이터베이스 연결이 필요합니다");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) =>
          fetch(input, { ...init, signal: AbortSignal.timeout(10000) }),
      },
    },
  );
}
export type Entry = {
  id: string;
  type: "reference" | "insight";
  division: string;
  service: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  cover_url: string;
  video_url: string;
  kind: "case" | "example";
  rights_confirmed: boolean;
  is_published: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};
export async function publicEntries(
  type: "reference" | "insight",
  division?: string,
) {
  if (!databaseReady()) return [] as Entry[];
  let query = database()
    .from("website_entries")
    .select("*")
    .eq("type", type)
    .eq("is_published", true)
    .eq("rights_confirmed", true)
    .order("display_order")
    .order("created_at", { ascending: false })
    .limit(60);
  if (division) query = query.eq("division", division);
  const { data, error } = await query;
  if (error) {
    console.error("[public-content] unavailable", error.code);
    return [] as Entry[];
  }
  return (data ?? []) as Entry[];
}
export async function publicEntry(
  type: "reference" | "insight",
  division: string,
  slug: string,
) {
  if (!databaseReady()) return null;
  const { data, error } = await database()
    .from("website_entries")
    .select("*")
    .eq("type", type)
    .eq("division", division)
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("rights_confirmed", true)
    .maybeSingle();
  if (error) return null;
  return data as Entry | null;
}
