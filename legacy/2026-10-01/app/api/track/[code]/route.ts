import { redirect } from "next/navigation";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aio-make.com";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

  if (!hasSupabaseAdminConfig()) redirect("/");

  const supabase = createSupabaseAdminClient();
  const { data: link } = await supabase
    .from("tracking_links")
    .select("destination_path, utm_source, utm_medium, utm_campaign, utm_content, utm_term, is_active")
    .eq("code", code)
    .maybeSingle();

  if (!link || !link.is_active) redirect("/");

  const dest = new URL(link.destination_path, SITE_URL);
  if (link.utm_source)   dest.searchParams.set("utm_source",   link.utm_source);
  if (link.utm_medium)   dest.searchParams.set("utm_medium",   link.utm_medium);
  if (link.utm_campaign) dest.searchParams.set("utm_campaign", link.utm_campaign);
  if (link.utm_content)  dest.searchParams.set("utm_content",  link.utm_content);
  if (link.utm_term)     dest.searchParams.set("utm_term",     link.utm_term);
  dest.searchParams.set("_tl", code);

  redirect(dest.toString());
}
