import assert from "node:assert/strict";
import { writeFile, mkdir } from "node:fs/promises";
const base = process.env.AIO_QA_BASE || "http://127.0.0.1:3100";
assert.ok(/^http:\/\/127\.0\.0\.1:\d+$/.test(base), "Loopback only");
const xml = await (await fetch(base + "/sitemap.xml")).text();
const paths = [
  ...new Set(
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => new URL(m[1]).pathname,
    ),
  ),
];
const pages = [];
const links = [];
for (let i = 0; i < paths.length; i += 3) {
  const batch = await Promise.all(
    paths.slice(i, i + 3).map(async (path) => {
      const r = await fetch(base + path);
      const html = await r.text();
      const hs = [...html.matchAll(/<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/g)];
      for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
        const href = m[1].replaceAll("&amp;", "&");
        if (!href.startsWith("/") && !href.startsWith("#")) continue;
        if (
          href.startsWith("/_next/") ||
          href.startsWith("/images/") ||
          href.startsWith("/renewal/")
        )
          continue;
        const u = new URL(href, base + path);
        links.push({ from: path, to: u.pathname, hash: u.hash });
      }
      return {
        path,
        status: r.status,
        h1: hs.length,
        title: html.match(/<title>([^<]*)<\/title>/)?.[1],
        futureDate: /2026\.12/.test(html),
      };
    }),
  );
  pages.push(...batch);
}
const missing = [
  ...new Set(
    links
      .filter(
        (l) =>
          !paths.includes(l.to) && !["/admin/login", "/admin"].includes(l.to),
      )
      .map((l) => l.to),
  ),
];
const issues = pages.filter(
  (p) => p.status !== 200 || p.h1 !== 1 || p.futureDate,
);
await mkdir("docs/review-v04", { recursive: true });
await writeFile(
  "docs/review-v04/routes.json",
  JSON.stringify(
    {
      at: new Date().toISOString(),
      base,
      count: pages.length,
      pages,
      unknownInternalTargets: missing,
      links,
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify(
    {
      pages: pages.length,
      links: links.length,
      issues,
      unknownInternalTargets: missing,
    },
    null,
    2,
  ),
);
assert.equal(issues.length, 0);
assert.equal(missing.length, 0);
