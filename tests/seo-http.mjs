import assert from "node:assert/strict";
import { writeFile, mkdir } from "node:fs/promises";
import sharp from "sharp";
import { divisions, services } from "../lib/content.ts";
import { guideEntries } from "../lib/guide-content.ts";

const base = process.env.AIO_QA_BASE || "http://127.0.0.1:3100";
const canonical = "https://aio-make.com";
const referenceReview = process.env.AIO_QA_REFERENCE_REVIEW === "1";
const reportPath =
  process.env.AIO_QA_REPORT || "docs/release-v09/seo-http.json";
const decode = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'");
const attrs = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], decode(m[2])]),
  );
const paths = ["/", "/about", "/about/team", "/contact", "/privacy", "/terms"];
for (const d of divisions)
  paths.push(
    `/${d.path}`,
    ...["contact", ...(d.id === "video" ? [] : ["work"]), "insights"].map(
      (x) => `/${d.path}/${x}`,
    ),
  );
for (const s of services)
  paths.push(
    `/${divisions.find((d) => d.id === s.division).path}/services/${s.id}`,
  );
for (const type of ["reference", "insight"])
  for (const e of guideEntries(type))
    if (!(type === "reference" && e.division === "video"))
      paths.push(
        `/${divisions.find((d) => d.id === e.division).path}/${type === "reference" ? "work" : "insights"}/${e.slug}`,
      );
const results = [],
  errors = [],
  bodies = new Map(),
  titles = new Map(),
  images = new Set(),
  links = new Set();
const retiredPath = (path) =>
  path === "/work" || /^\/content\/work(?:\/|$)/.test(path);
function check(fn, label) {
  try {
    fn();
  } catch (error) {
    errors.push(`${label}: ${error.message}`);
  }
}
for (const path of paths) {
  const response = await fetch(base + path, {
    headers: { "User-Agent": "Googlebot" },
  });
  const html = await response.text();
  bodies.set(path, html);
  const meta = [...html.matchAll(/<meta\b[^>]*>/g)].map((m) => attrs(m[0]));
  const linkTags = [...html.matchAll(/<link\b[^>]*>/g)].map((m) => attrs(m[0]));
  const title = decode(html.match(/<title>([^<]+)<\/title>/)?.[1] || "");
  const value = (key) =>
    meta.find((m) => m.name === key || m.property === key)?.content;
  const schema = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].flatMap((m) => JSON.parse(m[1]));
  check(() => {
    assert.equal(response.status, 200);
    assert.equal(
      (html.match(/<h1[\s>]/g) || []).length,
      1,
      "one primary heading",
    );
    assert.ok(
      title.length > 5 && title.includes("AIO MAKE"),
      "descriptive branded title",
    );
    assert.ok(
      !titles.has(title),
      `duplicate title: ${title} / ${titles.get(title)}`,
    );
    assert.ok(value("description")?.length >= 20, "description");
    assert.deepEqual(
      linkTags
        .filter((m) => m.rel === "canonical")
        .map((m) => new URL(m.href).href),
      [new URL(canonical + path).href],
    );
    assert.equal(new URL(value("og:url")).href, new URL(canonical + path).href);
    assert.ok(value("og:title")?.includes("AIO MAKE"));
    assert.equal(value("og:description"), value("description"));
    assert.equal(value("og:image:width"), "1200");
    assert.equal(value("og:image:height"), "630");
    assert.equal(value("twitter:card"), "summary_large_image");
    assert.equal(value("twitter:image"), value("og:image"));
    assert.equal(
      meta.some((m) => m.name === "robots" && m.content.includes("noindex")),
      referenceReview,
      "review builds stay noindex; release builds remain indexable",
    );
    if (referenceReview) assert.match(response.headers.get("x-robots-tag") || "", /noindex/);
    assert.ok(
      schema.some(
        (s) =>
          s["@type"] === "Organization" && s.legalName === "에이아이오 (AIO)",
      ),
    );
    if (path === "/") assert.ok(schema.some((s) => s["@type"] === "WebSite"));
    if (path.includes("/services/"))
      assert.ok(
        schema.some((s) => s["@type"] === "Service") &&
          schema.some((s) => s["@type"] === "BreadcrumbList"),
      );
    if (path.startsWith("/content/services/")) {
      // P2R 컨텐츠 사이트 서비스 랜딩: Service(offers) · FAQPage · BreadcrumbList · Organization
      const service = schema.find((s) => s["@type"] === "Service");
      assert.ok(service?.offers?.length >= 2, "content service offers");
      for (const offer of service.offers) {
        assert.equal(offer.priceCurrency, "KRW");
        assert.equal(offer.priceSpecification?.valueAddedTaxIncluded, false);
      }
      const faq = schema.find((s) => s["@type"] === "FAQPage");
      assert.ok(faq?.mainEntity?.length >= 4, "content service FAQ schema");
      for (const item of faq.mainEntity) {
        assert.ok(
          html.includes(item.name),
          "FAQ question is visible in server HTML",
        );
        assert.ok(
          html.includes(item.acceptedAnswer.text),
          "FAQ answer matches server HTML",
        );
      }
      const crumbs = schema.find((s) => s["@type"] === "BreadcrumbList");
      assert.deepEqual(
        crumbs?.itemListElement?.map((i) => new URL(i.item).pathname),
        ["/", "/content", path],
      );
      for (const section of ["hero", "pricing", "process", "faq", "inquiry"])
        assert.ok(
          html.includes(`data-cs-section="${section}"`),
          `${section} section`,
        );
      assert.ok(html.includes('class="cs-site"'), "content site shell");
      assert.doesNotMatch(html, /guide-header|guide-footer|floating-contact/);
      assert.doesNotMatch(html, /\sautoplay[\s=>]/i, "no autoplay attribute");
    }
    if (/\/insights\/./.test(path))
      assert.ok(
        schema.some((s) => s["@type"] === "Article") &&
          html.includes("최종 정리"),
      );
  }, path);
  titles.set(title, path);
  if (value("og:image")) images.add(value("og:image"));
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]*)"/g)) {
    const href = decode(match[1]);
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:"))
      continue;
    const url = new URL(href, canonical + path);
    if (
      url.origin === canonical &&
      !url.pathname.startsWith("/api/") &&
      !url.pathname.startsWith("/admin")
    )
      links.add(url.pathname + url.search + url.hash);
  }
  results.push({
    path,
    status: response.status,
    title,
    description: value("description"),
    canonical: value("og:url"),
    image: value("og:image"),
    schema: schema.map((s) => s["@type"]),
  });
}
for (const image of images) {
  const response = await fetch(base + new URL(image).pathname);
  const metadata = await sharp(
    Buffer.from(await response.arrayBuffer()),
  ).metadata();
  check(() => {
    assert.equal(response.status, 200);
    assert.equal(metadata.width, 1200);
    assert.equal(metadata.height, 630);
    assert.equal(metadata.format, "png");
  }, image);
}
for (const [path, size] of [
  ["/favicon-96.png", 96],
  ["/apple-touch-icon.png", 180],
  ["/brand/icon-192.png", 192],
  ["/brand/logo-512.png", 512],
]) {
  const response = await fetch(base + path);
  const metadata = await sharp(
    Buffer.from(await response.arrayBuffer()),
  ).metadata();
  check(() => {
    assert.equal(response.status, 200);
    assert.equal(metadata.width, size);
    assert.equal(metadata.height, size);
  }, path);
}
const ico = await fetch(base + "/favicon.ico");
const icon = Buffer.from(await ico.arrayBuffer());
check(() => {
  assert.equal(ico.status, 200);
  assert.equal(icon.readUInt16LE(2), 1);
  assert.equal(icon.readUInt16LE(4), 3);
}, "favicon ICO");
const manifest = await (await fetch(base + "/manifest.webmanifest")).json();
check(() => {
  assert.equal(manifest.start_url, "/");
  assert.equal(manifest.lang, "ko");
  assert.equal(manifest.icons.length, 2);
}, "manifest");
const robots = await (await fetch(base + "/robots.txt")).text();
check(() => {
  if (referenceReview) {
    assert.match(robots, /Disallow: \/\s/);
    assert.doesNotMatch(robots, /Allow:/);
  } else {
    assert.match(robots, /Allow: \/\s/);
    assert.match(robots, /Disallow: \/admin/);
  }
  assert.match(robots, /Sitemap: https:\/\/aio-make.com\/sitemap.xml/);
}, "robots");
const sitemap = await (await fetch(base + "/sitemap.xml")).text();
const listed = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) =>
  decode(m[1]),
);
check(() => {
  for (const path of paths) assert.ok(listed.includes(canonical + path), path);
  assert.ok(!listed.some((path) => /\/admin|\/api|\/ko(?:\/|$)|\?/.test(path)));
}, "sitemap");
for (const [oldPath, newPath] of [
  ["/ko/marketing?utm_source=qa", "/marketing?utm_source=qa"],
  ["/KO/lab", "/lab"],
  ["/en/video", "/content"],
  [
    "/video/work/example-webtoon?ref=legacy",
    "/content/work/example-webtoon?ref=legacy",
  ],
  ["/dev/services/website", "/lab/services/website"],
]) {
  const response = await fetch(base + oldPath, { redirect: "manual" });
  check(() => {
    assert.equal(response.status, 301);
    assert.ok(response.headers.get("location")?.endsWith(newPath));
  }, oldPath);
}
for (const path of [
  "/missing-release-page",
  "/lab/services/missing",
  "/content/work/missing",
  "/work",
  "/work?page=2",
  "/portfolio",
  "/content/work",
  "/content/work?service=webtoon",
  ...guideEntries("reference", "video").map(
    (entry) => `/content/work/${entry.slug}`,
  ),
  "/content/work/yofree-outing-webtoon",
]) {
  const response = await fetch(base + path, {
    headers: { "User-Agent": "Googlebot" },
    redirect: "manual",
  });
  const html = await response.text();
  check(() => {
    assert.equal(response.status, 404);
    assert.equal(response.headers.get("location"), null);
    assert.match(html, /noindex/);
  }, path);
}
for (const path of ["/admin/login", "/api/admin/inquiries"]) {
  const response = await fetch(base + path);
  check(
    () => assert.match(response.headers.get("x-robots-tag") || "", /noindex/),
    path,
  );
}
for (const target of links) {
  const url = new URL(target, canonical);
  const path = url.pathname;
  check(
    () => assert.equal(retiredPath(path), false),
    `retired internal link ${target}`,
  );
  let html = bodies.get(path);
  if (!html) {
    const response = await fetch(base + path, { redirect: "manual" });
    check(
      () =>
        assert.ok(
          response.status === 200 ||
            response.status === 301 ||
            response.status === 308,
        ),
      `internal link ${target} (${response.status})`,
    );
    if (response.status === 200) html = await response.text();
  }
  if (url.hash && url.hash !== "#" && html)
    check(
      () =>
        assert.ok(
          html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
        ),
      `anchor ${target}`,
    );
}
check(
  () =>
    assert.equal(
      (bodies.get("/").match(/id="main-faq-answer-/g) || []).length,
      5,
    ),
  "main FAQ server HTML",
);
check(() => {
  // /content 컨텐츠 사이트 홈(P2R WP-D): 컨텐츠 셸 안, 서버 HTML(R6: 서비스 카드 캐러셀 ch-depth, 카드마다 서비스 보기 링크)에 서비스 6종·링크가 모두 있고
  // 고객 작품 흔적·옛 셸·자리표시 문구가 없다.
  const html = bodies.get("/content");
  assert.match(html, /class="cs-site"/);
  assert.match(html, /class="cs-home"/);
  assert.doesNotMatch(html, /guide-page|guide-subnav|guide-header|floating-contact/);
  assert.match(html, /id="services"/);
  assert.match(html, /id="process"/);
  assert.match(html, /class="ch-gallery ch-gallery--depth"/);
  assert.match(html, /data-slot="home-hero-reel"/);
  assert.match(html, /data-cs-section="hero"/);
  for (const s of services.filter((s) => s.division === "video"))
    assert.ok(
      html.includes(`href="/content/services/${s.id}"`),
      `/content links ${s.id}`,
    );
  assert.equal((html.match(/class="ch-depth-card"/g) || []).length, 6);
  assert.equal((html.match(/ch-depth-service-link/g) || []).length, 6);
  // 공개판 카드는 연출 이미지에 '연출 예시' 표기를 유지한다(R6 홈 히어로 연출 이미지만 삭제됨)
  if (!referenceReview) assert.match(html, /연출 예시/);
  assert.doesNotMatch(html, /<video\b|\sautoplay[\s=>]/i, "reel slot is empty");
  assert.doesNotMatch(
    html,
    /reference-review|BWL|DR&#x27;s Secret|DR's Secret|닥터시크릿|힐러넷|HEALERNET|YoFree|요프리|제안용 시안|home-references|work-card|작업 사례|맞춤 견적|Blender|준비 중|공개 예정|coming soon/i,
  );
  assert.doesNotMatch(html, /href="\/content\/work|href="\/content\/insights/);
}, "/content home server HTML");
{
  // /content/contact (P2R WP-D): 서비스 선택 6개(폼 밖)·가격 기준·문의 폼, 없는 선택지 문구 없음
  const plain = bodies.get("/content/contact");
  const webtoon = await (
    await fetch(base + "/content/contact?service=webtoon", {
      headers: { "User-Agent": "Googlebot" },
    })
  ).text();
  check(() => {
    for (const html of [plain, webtoon]) {
      assert.match(html, /class="cs-site"/);
      assert.match(html, /data-cs-section="hero"/);
      assert.match(html, /id="inquiry"/);
      assert.equal((html.match(/<input[^>]*type="radio"/g) || []).length, 6);
      assert.ok(html.indexOf('type="radio"') < html.indexOf("<form"), "chooser outside form");
      assert.match(html, /가격 기준/);
      assert.match(html, /표시 금액은 모두 부가세 별도입니다/);
      assert.doesNotMatch(html, /모르겠어요|맞춤 견적/);
    }
    assert.doesNotMatch(plain, /<input[^>]*type="radio"[^>]*checked/);
    assert.match(webtoon, /<input[^>]*value="webtoon"[^>]*checked|<input[^>]*checked[^>]*value="webtoon"/);
  }, "/content/contact server HTML");
}
for (const s of services.filter((s) => s.division === "video"))
  check(() => {
    const html = bodies.get(`/content/services/${s.id}`);
    assert.doesNotMatch(html, /content-service-anchors/);
    assert.match(html, /id="pricing"/);
    assert.match(html, /id="inquiry"/);
    assert.ok(
      (html.match(new RegExp(`id="cs-faq-${s.id}-[0-9]+"`, "g")) || [])
        .length >= 4,
    );
  }, `${s.id} FAQ server HTML`);
const llms = await (await fetch(base + "/llms.txt")).text();
check(() => {
  for (const url of listed)
    assert.equal(retiredPath(new URL(url).pathname), false, url);
  for (const match of llms.matchAll(/https:\/\/aio-make\.com[^\s)]*/g))
    assert.equal(retiredPath(new URL(match[0]).pathname), false, match[0]);
}, "retired paths absent from sitemap and llms.txt");
await mkdir(reportPath.slice(0, reportPath.lastIndexOf("/")), {
  recursive: true,
});
await writeFile(
  reportPath,
  JSON.stringify(
    {
      base,
      checkedAt: new Date().toISOString(),
      pageCount: results.length,
      internalLinkCount: links.size,
      shareImageCount: images.size,
      results,
      errors,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify(
    {
      pages: results.length,
      internalLinks: links.size,
      shareImages: images.size,
      errors,
    },
    null,
    2,
  ),
);
assert.equal(errors.length, 0, "SEO release checks");
