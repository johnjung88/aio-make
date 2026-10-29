import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import {
  cardHeightFor,
  cardPlan,
  cardWidthSteps,
  depthDistance,
  depthPos,
  isSwipe,
  nearestIndex,
  platformCards,
  platformMotion,
  wrapIndex,
} from "../lib/home-journey-platforms.ts";
import {
  contentTabs,
  emptyJourneyData,
  fallbackContentSelection,
} from "../lib/home-journey.ts";
import { homeCarouselMotion, homeCardMedia } from "../lib/content-home.ts";
import { reviewWorks } from "../lib/work-catalog.ts";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const exists = async (path) => (await stat(new URL(`public${path}`, root))).size > 0;

const IDS = [
  "webtoon",
  "animation",
  "ai-influencer",
  "motion-graphics",
  "brand-film",
  "ad",
];

// BRIEF_R7 §2-5 service → frame mapping table
const MAPPING = {
  webtoon: { platform: "webtoon", logo: undefined, sponsored: false },
  animation: { platform: "youtube169", logo: "youtube", sponsored: false },
  "ai-influencer": { platform: "reels", logo: "instagram", sponsored: false },
  "motion-graphics": { platform: "tiktok", logo: "tiktok", sponsored: false },
  "brand-film": { platform: "fbvideo", logo: "facebook", sponsored: false },
  ad: { platform: "feed45", logo: "instagram", sponsored: true },
};

const customerWords = [
  ...new Set(
    reviewWorks.flatMap((work) => [
      work.slug,
      work.brand,
      ...work.brand.split(" · "),
      work.title,
      ...work.media.flatMap((media) =>
        [media.src, media.poster, media.mobileSrc].filter(Boolean),
      ),
    ]),
  ),
  "reference-review",
  "87언니",
  "DR's Secret",
  "힐러넷",
  "요프리",
  "YoFree",
  "BWL",
];

const publicPlans = emptyJourneyData.contentSelections.map(cardPlan);
const component = await read("components/home/journey-content.tsx");
const hook = await read("components/home/use-depth-carousel.ts");
const css = await read("components/home/journey-content.css");
const platformsLib = await read("lib/home-journey-platforms.ts");

test("six cards map services to platform frames exactly as the R7 table", () => {
  assert.deepEqual(Object.keys(platformCards), IDS);
  assert.deepEqual(
    contentTabs.map((tab) => tab.id),
    IDS,
  );
  assert.deepEqual(
    publicPlans.map((plan) => plan.id),
    IDS,
  );
  for (const plan of publicPlans) {
    const expected = MAPPING[plan.id];
    assert.equal(plan.platform, expected.platform, plan.id);
    assert.equal(plan.logo, expected.logo, plan.id);
    assert.equal(plan.sponsored, expected.sponsored, plan.id);
  }
  // Logos are the four official ones only; the webtoon viewer has none.
  assert.deepEqual(
    [...new Set(publicPlans.map((plan) => plan.logo).filter(Boolean))].sort(),
    ["facebook", "instagram", "tiktok", "youtube"],
  );
  assert.equal(platformCards.webtoon.viewerTitle, "1억의 구단주 · 1화");
  // One-line caption under the card: service name · platform and ratio.
  assert.deepEqual(
    publicPlans.map((plan) => plan.caption),
    [
      "웹툰 · 세로 스크롤",
      "애니메이션 · YouTube 16:9",
      "AI 인플루언서 · Instagram 릴스 9:16",
      "모션그래픽 · TikTok 9:16",
      "브랜드 홍보 영상 · Facebook 피드 16:9",
      "SNS 광고 영상 · Instagram 피드 4:5",
    ],
  );
});

test("v11 public cards use exactly the approved actual media and retain their source context", async () => {
  const sources = publicPlans.map((plan) => {
    const { media } = plan;
    if (media.kind === "strip") return media.pages.map((page) => page.src);
    return [media.src, ...(media.kind === "video" ? [media.poster] : [])];
  });
  assert.deepEqual(sources[0], [1, 5, 21].map(page => `/content-renewal-20261019/webtoon-${String(page).padStart(2, "0")}.webp`));
  assert.deepEqual(sources.slice(1), [
    ["/content-renewal-20261019/yofree-character-02.webp"],
    ["/content-renewal-20261019/ai-full.webp"],
    [
      "/content-renewal-20261019/bwl-brand-motion.mp4",
      "/content-renewal-20261019/poster-bwl-brand-motion.webp",
    ],
    ["/content-renewal-20261019/healernet-motion.mp4", "/content-renewal-20261019/poster-healernet-motion.webp"],
    ["/content-renewal-20261019/bwl-cplus-ad.mp4", "/content-renewal-20261019/poster-bwl-cplus-ad.webp"],
  ]);
  assert.equal(homeCardMedia.animation.images.length, 3);
  assert.deepEqual(homeCardMedia.animation.images, [2, 3, 6].map(page => `/content-renewal-20261019/yofree-character-${String(page).padStart(2, "0")}.webp`));
  assert.match(component, /homeCardMedia\.animation\.images\?\.map/, "the existing animation media slot shows all three actual poses");
  const ledger = JSON.parse(await read("content/approved-main-assets-20261019.json"));
  const approvedUrls = new Set(ledger.assets.map(asset => asset.publicPath));
  for (const src of new Set([...sources.flat(), ...homeCardMedia.animation.images])) {
    assert.match(src, /^\/content-renewal-20261019\/[\w.-]+\.(?:mp4|webp)$/);
    assert.ok(approvedUrls.has(src), `${src} has approved private lineage`);
    assert.ok(await exists(src), src);
    const entry = ledger.assets.find(asset => asset.publicPath === src);
    const bytes = await readFile(new URL(`public${src}`, root));
    assert.equal(bytes.byteLength, entry.bytes, src);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), entry.sha256, src);
    if (src.endsWith(".mp4")) assert.equal(bytes.toString("ascii", 4, 8), "ftyp", src);
  }
  assert.deepEqual(publicPlans.map(plan => plan.tag), [
    "자체 기획 IP", "캐릭터·모션 활용", "AI 가상인물", "브랜드 모션", "기업 소개 영상", "제품 광고 영상",
  ]);
  assert.deepEqual(publicPlans.map(plan => plan.note), [
    "《1억의 구단주》 · 웹툰 제작", "요프리 · 캐릭터 활용", "87언니 · AI 가상인물",
    "DR’s Secret · 브랜드 모션", "힐러넷 · 기업 소개 영상", "C Plus · SNS 광고 영상",
  ]);
  // Only these individually allowlisted files and display labels bypass the old review gate.
  // Other catalog identifiers and source paths still cannot enter the public card payload.
  let text = JSON.stringify(publicPlans);
  const approvedLiterals = [...approvedUrls, ...Object.values(homeCardMedia).flatMap(media => [media.caseLabel, media.alt])];
  for (const value of approvedLiterals) text = text.replaceAll(JSON.stringify(value), '""');
  for (const word of customerWords)
    assert.ok(!text.includes(word), `public card data: ${word}`);
  assert.doesNotMatch(text, /I:[\\/]|01_WORK|source_sha256|ASSET_LINEAGE|reference-review|before-pc|before-mobile/);
  assert.ok(!text.includes("AI 가상 예시"));
  // Actual work is not covered by a staged kinetic-text overlay.
  assert.deepEqual(
    publicPlans.map((plan) => plan.media.kind),
    ["strip", "image", "image", "video", "video", "video"],
  );
  assert.deepEqual(
    publicPlans.map((plan) => plan.kinetic),
    [false, false, false, false, false, false],
  );
  assert.match(css, /\.wjc-card \.pf-media > video\s*\{[^}]*object-fit:\s*contain;/, "actual video is never cropped into the platform frame");
});

test("review selections use the server-selected work and keep its labels", () => {
  const tab = (id) => contentTabs.find((item) => item.id === id);
  const media = (extra = {}) => ({
    kind: "image",
    src: "/x/a.webp",
    width: 100,
    height: 200,
    alt: "A",
    ...extra,
  });
  const selection = (id, workMedia, shown, extra = {}) => ({
    tab: tab(id),
    work: { title: "작품 제목", media: workMedia },
    media: shown,
    caption: "출처 줄",
    tag: "제작 후보",
    ...extra,
  });
  const webtoon = cardPlan(
    selection(
      "webtoon",
      [
        { kind: "image", src: "/w/1.webp", width: 1024, height: 1536, alt: "1" },
        { kind: "video", src: "/w/v.mp4", alt: "v" },
        { kind: "webtoon", src: "/w/2.webp", alt: "2" },
      ],
      media({ src: "/w/1.webp" }),
    ),
  );
  assert.equal(webtoon.media.kind, "strip");
  assert.deepEqual(
    webtoon.media.pages.map((page) => page.src),
    ["/w/1.webp", "/w/2.webp"],
  );
  assert.equal(webtoon.media.pages[1].width, 1024);
  assert.equal(webtoon.title, "작품 제목");
  assert.equal(webtoon.tag, "제작 후보");
  assert.equal(webtoon.note, "출처 줄");
  const single = cardPlan(
    selection("webtoon", [{ kind: "image", src: "/w/1.webp", alt: "1" }], media()),
  );
  assert.equal(single.media.kind, "image");
  const video = cardPlan(
    selection(
      "ad",
      [{ kind: "video", src: "/v/h.mp4", alt: "v" }],
      media({ kind: "video", src: "/v/h.mp4", poster: "/v/p.webp" }),
    ),
  );
  assert.deepEqual(video.media, {
    kind: "video",
    src: "/v/h.mp4",
    poster: "/v/p.webp",
    width: 100,
    height: 200,
    alt: "A",
  });
  assert.equal(video.platform, "feed45");
  assert.equal(video.kinetic, false);
  // A reviewed motion card never gets the kinetic overlay (it is a real work).
  assert.equal(
    cardPlan(selection("motion-graphics", [media()], media())).kinetic,
    false,
  );
  // A work without a tag shows no in-frame tag in the review build.
  assert.equal(
    cardPlan(selection("ad", [media()], media(), { tag: null })).tag,
    null,
  );
  // ContentSelection keeps its shape.
  assert.deepEqual(
    Object.keys(fallbackContentSelection(contentTabs[0])).sort(),
    ["caption", "media", "tab", "tag", "work"],
  );
});

test("card links open the service page in a new tab with a plain label", () => {
  for (const plan of publicPlans) {
    assert.equal(plan.href, `/content/services/${plan.id}`);
    assert.equal(plan.linkLabel, `${plan.label} 서비스 보기, 새 탭`);
  }
  assert.equal(publicPlans[0].linkLabel, "웹툰 서비스 보기, 새 탭");
  assert.match(component, /className="wjc-open"/);
  assert.match(component, /href=\{plan\.href\}/);
  assert.match(component, /aria-label=\{plan\.linkLabel\}/);
  assert.match(component, /\{\.\.\.newTabProps\}/);
  assert.match(component, /import \{ newTabProps \} from "@\/lib\/new-tab"/);
  // Only the active card is the link; other cards are select buttons.
  assert.match(component, /\{selected \? \(\s*<a[\s\S]*?\) : \(\s*<button[\s\S]*?className="wjc-select"/);
});

test("no tabs, chips, prev/next buttons, link rows or metrics on the cards", () => {
  for (const gone of [
    "JourneyTabList",
    "journey-tabs",
    "role=\"tablist\"",
    "role=\"tab\"",
    "contentCopy",
    "wj-tabs",
    "wj-tab ",
    "wj-chips",
    "wj-stage-nav",
    "wj-step-button",
    "이전",
    "다음",
    "서비스 자세히 보기",
    "작업 자세히 보기",
    "컨텐츠 서비스 전체 보기",
    "AI 가상 예시",
    "조회",
    "좋아요",
    "팔로워",
  ])
    assert.ok(!component.includes(gone), `journey-content.tsx: ${gone}`);
  for (const gone of ["조회", "좋아요", "팔로워", "AI 가상 예시"])
    assert.ok(!platformsLib.includes(gone), `platforms lib: ${gone}`);
  // The six progress marks are plain buttons (no tab role) with a pressed-style current marker.
  assert.match(component, /className="wjc-dot"/);
  assert.match(component, /aria-current=\{index === current \? "true" : undefined\}/);
  assert.ok(!/<button[^>]*onClick=\{\(\) => select\(current [+-]/.test(component));
});

test("only the active card mounts a <video> and reduced motion mounts none", () => {
  assert.equal(component.split("<video").length - 1, 1);
  assert.match(
    component,
    /if \(selected && !reduced\) return <CardVideo media=\{media\} play=\{play\} \/>;/,
  );
  assert.match(component, /play=\{selected && moving\}/);
  assert.match(component, /preload="metadata"/);
  assert.ok(!/\sautoPlay|\sautoplay/.test(component));
  assert.match(component, /node\.play\(\)\.catch/);
  // The webtoon strip loads every cut only for the active card.
  assert.match(component, /if \(selected && !reduced && media\.pages\.length > 1\)/);
});

test("card outer size table: same 9:19.5 frame, width steps match the CSS", () => {
  assert.deepEqual(
    cardWidthSteps.map((step) => [step.from, step.width]),
    [
      [0, 200],
      [390, 216],
      [430, 232],
      [768, 240],
      [1024, 248],
      [1440, 280],
    ],
  );
  assert.deepEqual(
    cardWidthSteps.map((step) => Math.round(cardHeightFor(step.width))),
    [433, 468, 503, 520, 537, 607],
  );
  for (const [from, width] of [
    [0, "200px"],
    [390, "216px"],
    [430, "232px"],
    [768, "240px"],
    [1024, "248px"],
  ])
    assert.match(
      css,
      new RegExp(
        `${from ? `@media \\(min-width: ${from}px\\) \\{\\s*` : ""}\\.wj \\.wjc \\{[^}]*--wjc-w: ${width};`,
      ),
      `${from}px`,
    );
  assert.match(css, /--wjc-w: min\(280px, calc\(68svh \* 9 \/ 19\.5\)\);/);
  // Every card is one width (no per-service size) and the stage adds 24px.
  assert.ok(!/\.wjc-card\[data-service[^{]*\{[^}]*(width|height):/.test(css));
  assert.match(css, /height: calc\(var\(--wjc-w\) \* 19\.5 \/ 9 \+ 24px\);/);
  const frame = css.slice(css.indexOf(".wj .wjc-card {"));
  assert.match(frame, /width: var\(--wjc-w\);/);
});

test("R7-fix1: the 3D track does not swallow clicks, so side cards stay clickable at 768+", () => {
  const desktop = css.slice(css.indexOf("/* ---- 3D 캐러셀(768px 이상)"));
  assert.match(desktop, /\.wj \.wjc-track \{[^}]*transform-style: preserve-3d;[^}]*pointer-events: none;/);
  assert.match(desktop, /\.wj \.wjc-card \{[^}]*pointer-events: auto;/);
  // Hidden and far cards stay non-interactive.
  assert.match(desktop, /\[data-pos="hidden"\] \{[^}]*pointer-events: none;/);
});

test("mobile is scroll-snap with no 3D or blur; 3D starts at 768", () => {
  const split = css.indexOf("/* ---- 3D 캐러셀(768px 이상)");
  assert.ok(split > 0);
  const base = css.slice(0, split);
  const desktop = css.slice(split);
  assert.match(base, /scroll-snap-type: x mandatory;/);
  assert.match(base, /scroll-snap-align: center;/);
  assert.doesNotMatch(base, /rotateY|perspective|preserve-3d|translate3d/);
  assert.doesNotMatch(css, /blur\(|filter:|backdrop-filter/);
  assert.match(desktop, /@media \(min-width: 768px\) \{/);
  assert.match(desktop, /perspective: 1400px;/);
  assert.match(desktop, /transform-style: preserve-3d;/);
  assert.match(desktop, /scroll-snap-type: none;/);
  for (const pos of ["-2", "-1", "0", "1", "2", "hidden"])
    assert.ok(desktop.includes(`[data-pos="${pos}"]`), pos);
  // Side cards: shift per width, ±2 hidden only in the 1024-1439 band.
  assert.match(css, /--wjc-shift: 190px;/);
  assert.match(css, /--wjc-shift: 200px;/);
  assert.match(css, /--wjc-shift: 230px;/);
  assert.match(css, /--wjc-shift2: 330px;/);
  assert.match(css, /--wjc-shift2: 400px;/);
  assert.match(css, /--wjc-side-scale: 0\.84;/);
  assert.match(css, /@media \(min-width: 1024px\) and \(max-width: 1439\.98px\)/);
  // Motion only moves transform/opacity and only for the active card in view.
  assert.match(css, /\.wjc\[data-run="true"\] \.wjc-card\[data-active="true"\] \.wjc-roll-a/);
  assert.match(css, /transition:\s*transform 0\.65s ease,\s*opacity 0\.5s ease;/);
});

test("carousel math: wrap, positions, swipe threshold, nearest card", () => {
  assert.equal(wrapIndex(-1, 6), 5);
  assert.equal(wrapIndex(6, 6), 0);
  assert.equal(depthDistance(5, 0, 6), -1);
  assert.deepEqual(
    [0, 1, 2, 3, 4, 5].map((index) => depthPos(index, 0, 6)),
    [0, 1, 2, "hidden", -2, -1],
  );
  assert.deepEqual(
    [0, 1, 2, 3, 4, 5].map((index) => depthPos(index, 5, 6)),
    [1, 2, "hidden", -2, -1, 0],
  );
  assert.equal(isSwipe(46, 0), true);
  assert.equal(isSwipe(-60, 40), true);
  assert.equal(isSwipe(45, 0), false);
  assert.equal(isSwipe(60, 60), false);
  assert.equal(isSwipe(50, 45), false);
  assert.equal(nearestIndex([100, 300, 500], 340), 1);
  assert.equal(nearestIndex([100, 300, 500], 0), 0);
  // Timings and input thresholds equal the /content 3D cards.
  assert.equal(platformMotion.dwellMs, homeCarouselMotion.dwellMs);
  assert.equal(platformMotion.videoDwellMs, homeCarouselMotion.videoDwellMs);
  assert.equal(platformMotion.desktopMin, 768);
});

test("carousel hook: stage activity, pause rules, keys, swipe only in 3D", () => {
  assert.match(
    hook,
    /import \{ useStageActivity \} from "@\/components\/content-home\/use-stage-activity"/,
  );
  assert.match(hook, /const running = moving && !hover && !focusPause && !touching;/);
  assert.match(hook, /const moving = inView && !reduced;/);
  assert.match(hook, /setTimeout\(/);
  assert.match(hook, /`\(min-width: \$\{platformMotion\.desktopMin\}px\)`/);
  for (const key of ["ArrowRight", "ArrowLeft", "Home", "End"])
    assert.ok(hook.includes(`"${key}"`), key);
  assert.match(hook, /matches\(":focus-visible"\)/);
  assert.match(hook, /event\.pointerType === "mouse"/);
  assert.match(hook, /if \(!desktop\) \{\s*touch\.current = null;\s*return;/);
  assert.match(hook, /scrollTo\(\{ left: target, behavior: reduced \? "auto" : "smooth" \}\)/);
  assert.match(hook, /\.querySelectorAll\("video"\)\.forEach\(\(video\) => video\.pause\(\)\)/);
  // The hook reuses the /content hook without editing content-home files.
  assert.ok(!/addEventListener\(\s*["']wheel/.test(hook + component));
  assert.ok(!/\sstyle=/.test(component));
});

test("RW1 main reuses the operational content gallery with server selections", async () => {
const journey=await read('components/home/workflow-journey.tsx');
 assert.ok(journey.includes('import { ServiceShowcase } from "@/components/content-home/service-showcase"'));
 assert.match(journey, /<ServiceShowcase\s+selections=\{data.contentSelections\}/);
 assert.doesNotMatch(journey,/ProductionCase|JourneyContent/);
});

test("card frames use PlatformFrame only, with official logos and no brand icons", () => {
  assert.match(component, /import \{ PlatformFrame \} from "@\/components\/platform-frame\/platform-frame"/);
  assert.ok(!/from "lucide-react"/.test(component + hook));
  assert.ok(!/<svg/.test(component));
});
