import { SITE_URL } from "@/lib/seo";

const LOCALE = "ko";

// 구버전 sitemapindex가 /sitemap-0.xml을 참조하므로 동일한 사이트맵 내용 반환
export function GET() {
  const now = new Date().toISOString();
  const urls = [
    { path: "",              priority: "1.0", freq: "weekly"  },
    { path: "/about",        priority: "0.8", freq: "monthly" },
    { path: "/quote",        priority: "1.0", freq: "weekly"  },
    { path: "/portfolio",    priority: "0.8", freq: "weekly"  },
    { path: "/pricing",      priority: "0.7", freq: "monthly" },
    { path: "/services/development",    priority: "0.9", freq: "weekly" },
    { path: "/services/design",         priority: "0.9", freq: "weekly" },
    { path: "/services/video",          priority: "0.9", freq: "weekly" },
    { path: "/services/marketing",      priority: "0.9", freq: "weekly" },
    { path: "/services/website",             priority: "0.9", freq: "weekly" },
    { path: "/portfolio/category/website",   priority: "0.8", freq: "weekly" },
    { path: "/services/shopping-mall",       priority: "0.9", freq: "weekly" },
    { path: "/portfolio/category/shopping-mall", priority: "0.8", freq: "weekly" },
    { path: "/services/detail-page",         priority: "0.9", freq: "weekly" },
    { path: "/portfolio/category/detail-page", priority: "0.8", freq: "weekly" },
    { path: "/services/ppt-design",          priority: "0.9", freq: "weekly" },
    { path: "/portfolio/category/ppt-design", priority: "0.8", freq: "weekly" },
    { path: "/services/automation-app",      priority: "0.9", freq: "weekly" },
    { path: "/portfolio/category/automation-app", priority: "0.8", freq: "weekly" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ path, priority, freq }) => `<url>
<loc>${SITE_URL}/${LOCALE}${path}</loc>
<lastmod>${now}</lastmod>
<changefreq>${freq}</changefreq>
<priority>${priority}</priority>
</url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
  });
}
