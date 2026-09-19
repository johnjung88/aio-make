import "server-only";
import {
  createSupabaseAdminClient,
  hasSupabaseAdminConfig,
} from "@/lib/supabase";
import { contentSchemas, defaults, type ContentSlug } from "./cms-schema";
export async function publicContent<K extends ContentSlug>(
  slug: K,
): Promise<(typeof defaults)[K]> {
  if (!hasSupabaseAdminConfig()) return defaults[slug];
  const { data, error } = await createSupabaseAdminClient()
    .from("marketing_content")
    .select("body")
    .eq("slug", slug)
    .eq("state", "published")
    .maybeSingle();
  if (error) throw new Error("Published content could not be verified");
  if (!data) return defaults[slug];
  return contentSchemas[slug].parse(
    JSON.parse(data.body),
  ) as (typeof defaults)[K];
}
