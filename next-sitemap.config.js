/** @type {import('next-sitemap').IConfig} */

const LOCALES = ["ko", "en"];
const CORE_PATHS = ["", "/about", "/quote", "/services", "/portfolio"];
const SERVICE_GROUP_SLUGS = ["development", "design", "business"];
const CATEGORY_SLUGS = [
  "website",
  "shopping-mall",
  "logo-business-card",
  "detail-page",
  "ppt-design",
  "automation-app",
  "video-content",
];

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://aio-make.com",
  generateRobotsTxt: true,
  exclude: ["/admin/*", "/api/*", "/icon.svg", "/*.svg"],
  additionalPaths: async (config) => {
    const paths = [];
    for (const locale of LOCALES) {
      for (const path of CORE_PATHS) {
        paths.push(await config.transform(config, `/${locale}${path}`));
      }
      for (const slug of SERVICE_GROUP_SLUGS) {
        paths.push(await config.transform(config, `/${locale}/services/${slug}`));
      }
      for (const slug of CATEGORY_SLUGS) {
        paths.push(
          await config.transform(config, `/${locale}/services/${slug}`),
          await config.transform(config, `/${locale}/portfolio/category/${slug}`)
        );
      }
    }
    return paths;
  },
  transform: async (config, path) => {
    const isCore = path === "/ko" || path === "/en" || path.endsWith("/quote");
    const isCategory =
      path.includes("/services/") || path.includes("/portfolio/category/");
    return {
      loc: path,
      changefreq: isCore || isCategory ? "weekly" : "monthly",
      priority: isCore ? 1.0 : isCategory ? 0.9 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
