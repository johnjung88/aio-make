import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import * as journeyModule from "../lib/home-journey.ts";
import {
  journeyIntro,
  journeySteps,
  contentTabs,
  requiredContentServices,
} from "../lib/home-journey.ts";
import { contentHomeServices } from "../lib/content-home.ts";
import {
  reviewWorks,
  publicWorks,
  workMatchesService,
} from "../lib/work-catalog.ts";
import { services } from "../lib/content.ts";

const REQUIRED =
  "웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상";
const AI_LABEL = "87언니(AI 가상인물) 출연 · 제안용 시안";
const FORBIDDEN =
  /을 통해|를 통해|에 대해|아니라|없이|최고|최저|보장|%|\d+배|운영 중|게시 중|팔로워|조회수|립싱크|목소리|고화질/;
const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const catalogWorks = [...reviewWorks, ...publicWorks];

// Load the server-only journey data in a child process with a given review
// flag (undefined = variable unset, as on production), the same way
// reference-release.test.mjs checks the catalog gate.
function journeyData(flag) {
  const url = new URL("../lib/home-journey-data.ts", import.meta.url).href;
  const code = `const m = await import(${JSON.stringify(url)}); console.log(JSON.stringify({config:{devProjects:m.devProjects,beforeShots:m.beforeShots,contentReviewSlugs:m.contentReviewSlugs,aiInfluencerDraft:m.aiInfluencerDraft},data:m.homeJourneyData([])}));`;
  const env = { ...process.env };
  delete env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW;
  if (flag !== undefined) env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW = flag;
  const result = spawnSync(
    process.execPath,
    [
      "--conditions=react-server",
      "--experimental-strip-types",
      "--input-type=module",
      "-e",
      code,
    ],
    { env, encoding: "utf8", windowsHide: true },
  );
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}
const review = journeyData("1");
const reviewData = review.config;
const offStates = {
  unset: journeyData(undefined),
  zero: journeyData("0"),
  true: journeyData("true"),
};
const publicData = offStates.zero.config;

// Customer work identifiers that must never appear while the flag is off.
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
  "before-pc",
  "before-mobile",
  "87언니",
  "DR's Secret",
  "힐러넷",
  "요프리",
  "YoFree",
  "BWL",
];

function strings(value, out = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => strings(item, out));
  else if (value && typeof value === "object")
    Object.values(value).forEach((item) => strings(item, out));
  return out;
}

test("five journey steps in order with readable titles", () => {
  assert.deepEqual(
    journeySteps.map((step) => step.id),
    [
      "journey-consult",
      "journey-brand",
      "journey-dev",
      "journey-content",
      "journey-marketing",
    ],
  );
  assert.ok(!journeySteps.some((step) => step.id === "journey-growth"));
  for (const title of [
    journeyIntro.title,
    ...journeySteps.map((s) => s.title),
  ]) {
    const lines = title.split("\n");
    assert.ok(lines.length <= 2, title);
    for (const line of lines)
      assert.ok(line.length <= 18, `${line} (${line.length})`);
    assert.doesNotMatch(title, /\.$/, title);
  }
});

test("content tabs are the six video services and spell the required phrase", () => {
  // label·line·chips come from the /content home data, not copies.
  for (const [index, tab] of contentTabs.entries()) {
    const source = contentHomeServices[index];
    assert.equal(tab.id, source.id);
    assert.equal(tab.label, source.label);
    assert.equal(tab.line, source.line);
    assert.deepEqual(tab.chips, source.uses);
  }
  assert.deepEqual(
    contentTabs.map((tab) => tab.id),
    [
      "webtoon",
      "animation",
      "ai-influencer",
      "motion-graphics",
      "brand-film",
      "ad",
    ],
  );
  assert.equal(contentTabs.map((tab) => tab.label).join(" · "), REQUIRED);
  assert.equal(requiredContentServices, REQUIRED);
  for (const tab of contentTabs)
    assert.ok(
      services.some((s) => s.id === tab.id && s.division === "video"),
      tab.id,
    );
});

test("every referenced slug exists and matches its step", async () => {
  const files = new Set(
    (await readdir(new URL("content/works/", root)))
      .filter((name) => name.endsWith(".json"))
      .map((name) => name.replace(/\.json$/, "")),
  );
  const contentSlugs = Object.entries(reviewData.contentReviewSlugs);
  assert.equal(contentSlugs.length, 6);
  for (const [service, slug] of contentSlugs) {
    assert.ok(files.has(slug), slug);
    const work = catalogWorks.find((item) => item.slug === slug);
    assert.ok(
      workMatchesService(work, service, "video"),
      `${slug} → ${service}`,
    );
  }
  const devSlugs = reviewData.devProjects.map((project) => project.slug);
  assert.deepEqual(devSlugs, ["bwl-store", "healernet-website", "yofree-shop"]);
  for (const slug of devSlugs) {
    assert.ok(files.has(slug), slug);
    assert.equal(
      catalogWorks.find((item) => item.slug === slug).division,
      "development",
    );
  }
  for (const slug of reviewData.aiInfluencerDraft.slugs)
    assert.ok(files.has(slug), slug);
});

test("before captures exist only for real captures and only in the review build", async () => {
  const devSlugs = reviewData.devProjects.map((project) => project.slug);
  const keys = Object.keys(reviewData.beforeShots);
  assert.deepEqual(keys.sort(), ["bwl-store", "healernet-website"]);
  for (const key of keys) assert.ok(devSlugs.includes(key));
  assert.ok(!keys.includes("yofree-shop"));
  // Flag off: customer data is absent from the module values.
  assert.deepEqual(publicData.beforeShots, {});
  assert.deepEqual(publicData.devProjects, []);
  assert.deepEqual(publicData.contentReviewSlugs, {});
  assert.equal(publicData.aiInfluencerDraft.caption, "");
  const offText = JSON.stringify(publicData);
  for (const word of [
    "before-pc",
    "before-mobile",
    "87언니",
    "reference-review",
    "DR's Secret",
    "힐러넷",
    "요프리",
    "YoFree",
    "BWL",
  ])
    assert.ok(!offText.includes(word), word);
  if (process.env.AIO_VERIFY_LOCAL_MEDIA !== "1") return;
  for (const shot of Object.values(reviewData.beforeShots))
    for (const media of [shot.pc, shot.mobile])
      assert.ok(
        (await stat(new URL("public" + media.src, root))).size > 0,
        media.src,
      );
});

test("copy avoids banned phrasing and keeps the AI influencer facts", async () => {
  for (const data of [journeyModule, reviewData, publicData])
    for (const value of strings(data))
      assert.doesNotMatch(value, FORBIDDEN, value);
  for (const file of await readdir(new URL("components/home/", root))) {
    if (!file.endsWith(".tsx")) continue;
    // Korean UI strings in the components: quoted literals and JSX text.
    const text = await read(`components/home/${file}`);
    const copy =
      text.match(/"[^"\n]*[가-힣][^"\n]*"|>[^<>{}\n]*[가-힣][^<>{}\n]*</g) ??
      [];
    for (const value of copy)
      assert.doesNotMatch(value, FORBIDDEN, `${file}: ${value}`);
  }
  assert.equal(reviewData.aiInfluencerDraft.caption, AI_LABEL);
  assert.deepEqual(reviewData.aiInfluencerDraft.slugs, [
    "bwl-aqua-ad",
    "bwl-cplus-ad",
    "bwl-cleanser-ad",
  ]);
  const ai = contentTabs.find((tab) => tab.id === "ai-influencer");
  assert.match(ai.fallback.tag, /AI 가상인물/);
  const sources = [
    await read("lib/home-journey.ts"),
    await read("lib/home-journey-data.ts"),
    ...(await Promise.all(
      (await readdir(new URL("components/home/", root))).map((file) =>
        read(`components/home/${file}`),
      ),
    )),
  ].join("\n");
  assert.ok(!sources.includes("인물 중심 세로 영상 시안"));
  assert.ok(!sources.includes("AI 생성 여부 확인 중"));
});

test("main page uses the journey, the six-service wording and no #process section", async () => {
  const main = await read("components/guide/main.jsx");
  const cards = await read("components/home/home-services.tsx");
  for (const label of REQUIRED.split(" · ")) assert.ok(cards.includes(label), label);
  assert.match(main, /<HomeServices data=\{this\.props\.journey\}/);
  assert.ok(!main.includes("브랜드 홍보 및 SNS 광고 영상"));
  assert.doesNotMatch(main, /import\s*\{\s*HomeReferences\s*\}/);
  assert.ok(main.includes("<WorkflowJourney data={this.props.journey} />"));
  const page = await read("app/(public)/page.tsx");
  assert.ok(page.includes("journey={homeJourneyData(entries)}"));
  for (const gone of [
    'id="process"',
    "main-method",
    "method-intro",
    "AI로 효율을 높이고",
    "전문가가 품질을 지킵니다",
  ])
    assert.ok(!main.includes(gone), gone);
  assert.ok(main.includes("OUR STANDARD"));
  assert.ok(!main.includes('href="#process"'));
});

test("about page lists the six content services", async () => {
  const about = await read("components/guide/about.jsx");
  assert.ok(about.includes(REQUIRED));
  assert.ok(!about.includes("브랜드 홍보 및"));
});

test("no link points at the removed main #process section", async () => {
  async function walk(dir) {
    const out = [];
    for (const entry of await readdir(new URL(dir, root), {
      withFileTypes: true,
    })) {
      const path = `${dir}${entry.name}`;
      if (entry.isDirectory()) out.push(...(await walk(`${path}/`)));
      else if (/\.(tsx?|jsx?|mjs)$/.test(entry.name)) out.push(path);
    }
    return out;
  }
  for (const dir of ["components/", "app/", "lib/"])
    for (const file of await walk(dir)) {
      const text = await read(file);
      assert.ok(!text.includes("/#process"), file);
    }
});

test("journey CSS uses role tokens only", async () => {
  const css = (await read("components/home/workflow-journey.css")).replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );
  assert.ok(!css.includes("!important"));
  const typeProp =
    /(?:^|[;{\s])(font-size|line-height|letter-spacing|font-weight|font-family)\s*:\s*([^;}]*)/g;
  for (const [, prop, value] of css.matchAll(typeProp))
    assert.match(value.trim(), /^var\(/, `${prop}: ${value}`);
  // No type declarations inside any @media block.
  let index = 0;
  while ((index = css.indexOf("@media", index)) !== -1) {
    let depth = 0;
    let end = css.indexOf("{", index);
    for (let i = end; i < css.length; i++) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}" && --depth === 0) {
        end = i;
        break;
      }
    }
    const block = css.slice(index, end);
    assert.doesNotMatch(
      block,
      /(?:^|[;{\s])(font-size|line-height|letter-spacing|font-weight|font-family)\s*:/,
    );
    index = end;
  }
  const tsx = await Promise.all(
    (await readdir(new URL("components/home/", root)))
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => read(`components/home/${file}`)),
  );
  for (const text of tsx) {
    assert.ok(!/\sstyle=/.test(text), "no inline style");
    assert.ok(
      !/addEventListener\(\s*["']wheel/.test(text),
      "no wheel listener",
    );
  }
  assert.ok(!css.includes("scroll-snap"));
});

test("review gate: unset, 0 and true select no customer work data", () => {
  // Review build: the server selects customer work (so the scan below is real).
  assert.ok(review.data.devProjects.length > 0);
  const reviewText = JSON.stringify(review);
  for (const word of ["reference-review", "before-pc", "87언니", "DR's Secret"])
    assert.ok(reviewText.includes(word), word);
  assert.ok(
    review.data.contentSelections.some((selection) =>
      reviewWorks.some((work) => work.slug === selection.work?.slug),
    ),
  );
  for (const [state, off] of Object.entries(offStates)) {
    assert.deepEqual(off.config.devProjects, [], state);
    assert.deepEqual(off.config.beforeShots, {}, state);
    assert.deepEqual(off.config.contentReviewSlugs, {}, state);
    assert.deepEqual(off.config.aiInfluencerDraft, { slugs: [], caption: "" });
    assert.deepEqual(off.data.devProjects, [], state);
    assert.equal(off.data.contentSelections.length, 6, state);
    for (const selection of off.data.contentSelections)
      assert.ok(
        !selection.work || publicWorks.some((w) => w.slug === selection.work.slug),
        `${state}: ${selection.work?.slug}`,
      );
    const text = JSON.stringify(off);
    for (const word of customerWords)
      assert.ok(!text.includes(word), `${state}: ${word}`);
  }
});

test("client journey modules hold no customer data and never import it", async () => {
  const clientFiles = [
    "lib/home-journey.ts",
    "lib/content-home.ts",
    ...(await readdir(new URL("components/home/", root)))
      .filter((file) => /\.tsx?$/.test(file))
      .map((file) => `components/home/${file}`),
    ...(await readdir(new URL("components/content-home/", root)))
      .filter((file) => /\.tsx?$/.test(file))
      .map((file) => `components/content-home/${file}`),
  ];
  for (const file of clientFiles) {
    const text = await read(file);
    // R2 ContentHome은 서버에서 자료를 선택하고 직렬화한 선택지만 클라이언트 갤러리에 준다
    if (file.startsWith("components/") && !/^\s*["']use client["']/.test(text)) continue;
    assert.doesNotMatch(
      text,
      /from\s+["'][^"']*(home-journey-data|generated\/works)/,
      `${file} imports customer data`,
    );
    assert.doesNotMatch(
      text,
      /import\s+\{[^}]*\}\s+from\s+["'][^"']*work-catalog/,
      `${file}: only type imports from work-catalog`,
    );
    assert.ok(!text.includes("process.env"), `${file} reads the env`);
    for (const word of customerWords)
      assert.ok(!text.includes(word), `${file}: ${word}`);
  }
  const server = await read("lib/home-journey-data.ts");
  assert.match(server, /^import "server-only";$/m);
  const gates = server.match(/process\.env\.[^\n]*/g);
  assert.equal(gates.length, 4);
  for (const gate of gates)
    assert.equal(gate, 'process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1"');
  // Unset is compiled as "0", so every `=== "1"` gate folds in client code.
  const config = await read("next.config.ts");
  assert.match(
    config,
    /NEXT_PUBLIC_AIO_REFERENCE_REVIEW:\s*process\.env\.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1" \? "1" : "0"/,
  );
});
