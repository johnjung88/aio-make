import Link from "next/link";
import {
  Home,
  MarketingPage,
  MarketingHeader,
  MarketingFooter,
  Scope,
  Prices,
  Projects,
  Resources,
} from "@/components/marketing/site";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { contentSchemas } from "@/lib/marketing/cms-schema";
import "../../../marketing.css";
export const metadata = {
  title: "비공개 디자인·콘텐츠 검토",
  robots: { index: false, follow: false },
};
export default async function Preview({
  searchParams,
}: {
  searchParams: Promise<{
    direction?: string;
    page?: string;
    content?: string;
  }>;
}) {
  const p = await searchParams;
  let content: React.ReactNode =
    p.page === "marketing" ? <MarketingPage /> : <Home />;
  if (p.content) {
    const { data, error } = await createSupabaseAdminClient()
      .from("marketing_content")
      .select("*")
      .eq("id", p.content)
      .single();
    if (error || !data) return <p>초안을 확인할 수 없습니다.</p>;
    const raw = JSON.parse(data.body);
    switch (data.slug) {
      case "home":
        content = <Home preview={contentSchemas.home.parse(raw)} />;
        break;
      case "marketing":
        content = <Scope preview={contentSchemas.marketing.parse(raw)} />;
        break;
      case "pricing":
        content = <Prices preview={contentSchemas.pricing.parse(raw)} />;
        break;
      case "projects":
        content = <Projects preview={contentSchemas.projects.parse(raw)} />;
        break;
      case "resources":
        content = <Resources preview={contentSchemas.resources.parse(raw)} />;
    }
  }
  return (
    <div className={"m-site " + (p.direction === "b" ? "m-direction-b" : "")}>
      <div className="m-preview-note">
        비공개 검토본 · <Link href="?direction=a">A 메인</Link> /{" "}
        <Link href="?direction=b">B 메인</Link> /{" "}
        <Link href="?direction=a&page=marketing">A 마케팅</Link> /{" "}
        <Link href="?direction=b&page=marketing">B 마케팅</Link>
      </div>
      <MarketingHeader />
      {content}
      <MarketingFooter />
    </div>
  );
}
