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

// 2026-10-14 사용자 결정: 3214(9b3def8) 원문을 유지하고 상담·브랜드 가이드만 빼서
// 개발 → 마케팅 → 컨텐츠 순서로 보여준다. 번호만 01~03으로 바뀐다.
const ORIGINAL_STEPS = {
  "journey-dev": {
    railLabel: "개발",
    title: "웹사이트와 쇼핑몰을\n가이드대로 만듭니다",
    lead: "정리한 브랜드 자료를 화면에 녹입니다. 방문한 고객이 제품을 살펴보고 문의나 구매로 이어지도록 동선을 설계합니다.",
  },
  "journey-marketing": {
    railLabel: "마케팅",
    title: "계획하고 운영하고\n데이터로 고칩니다",
    lead: "누구에게 어떤 메시지를 어느 채널에서 보여줄지 먼저 정합니다. 계획대로 SNS와 광고, 검색 노출을 운영하고 쌓인 데이터를 보며 계속 고칩니다.",
  },
  "journey-content": {
    railLabel: "컨텐츠",
    title: "채널에 맞는 컨텐츠를\n직접 만듭니다",
    lead: "같은 브랜드 가이드로 타깃과 플랫폼에 맞는 형식을 고릅니다. 웹툰부터 광고 영상까지 기획과 제작을 한 팀이 맡습니다.",
  },
};

test("three journey steps (development, marketing, content) keep the 3214 wording", () => {
  assert.deepEqual(
    journeySteps.map((step) => step.id),
    ["journey-dev", "journey-marketing", "journey-content"],
  );
  assert.deepEqual(
    journeySteps.map((step) => step.num),
    ["01", "02", "03"],
  );
  assert.deepEqual(
    journeySteps.map((step) => step.eyebrow),
    ["01 DEVELOPMENT", "02 MARKETING", "03 CONTENT"],
  );
  for (const step of journeySteps) {
    const original = ORIGINAL_STEPS[step.id];
    assert.equal(step.railLabel, original.railLabel, step.id);
    assert.equal(step.title, original.title, step.id);
    assert.equal(step.lead, original.lead, step.id);
  }
  assert.equal(journeyIntro.title, "상담부터 성과까지\n하나로 이어집니다");
  assert.equal(
    journeyIntro.lead,
    "필요한 단계만 맡기셔도 됩니다. 단계마다 하는 일과 결과물을 살펴보세요.",
  );
  assert.ok(
    !journeySteps.some((step) =>
      ["journey-consult", "journey-brand"].includes(step.id),
    ),
  );
  assert.ok(!journeySteps.some((step) => step.id === "journey-growth"));
  for (const title of [
    journeyIntro.title,
    ...journeySteps.map((s) => s.title),
  ]) {
    const lines = title.split("\n");
    assert.ok(lines.length <= 2, title);
    for (const line of lines)
      assert.ok(line.length <= 11, `${line} (${line.length})`);
  }
});

test("content tabs are the six video services and spell the required phrase", () => {
  // label·line·chips are frozen to the 3214 wording in lib/home-journey.ts so a
  // /content home copy change (lib/content-home.ts) does not change the main page.
  assert.deepEqual(
    contentTabs.map(({ id, label, line, chips }) => ({ id, label, line, chips })),
    [
      { id: "webtoon", label: "웹툰", line: "브랜드 이야기를 세로로 읽히는 컷으로 그립니다", chips: ["인스타툰", "상세페이지", "광고 소재"] },
      { id: "animation", label: "애니메이션", line: "캐릭터와 장면에 움직임을 더합니다", chips: ["릴스", "쇼츠", "캐릭터 영상"] },
      { id: "ai-influencer", label: "AI 인플루언서", line: "브랜드 전용 AI 가상인물을 만듭니다", chips: ["제품 소개", "숏폼 영상", "SNS 이미지"] },
      { id: "motion-graphics", label: "모션그래픽", line: "그래픽과 글자의 움직임으로 메시지를 전합니다", chips: ["제품 소개", "홈페이지", "행사 화면"] },
      { id: "brand-film", label: "브랜드 홍보 영상", line: "브랜드가 하는 일과 이유를 한 편에 담습니다", chips: ["홈페이지", "회사 소개", "전시"] },
      { id: "ad", label: "SNS 광고 영상", line: "피드에서 첫 장면으로 시선을 붙잡습니다", chips: ["릴스", "쇼츠", "피드 광고"] },
    ],
  );
  // The ids still match the /content services, so the service links resolve.
  assert.deepEqual(
    contentTabs.map((tab) => tab.id),
    contentHomeServices.map((service) => service.id),
  );
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

test("consult and brand guide panels are kept as data but not rendered", async () => {
  assert.ok(journeyModule.consultPanel && journeyModule.brandPanel);
  const tsx = await read("components/home/workflow-journey.tsx");
  for (const gone of ["consultPanel", "brandPanel", "ConsultBody", "BrandBody", "journey-consult", "journey-brand"])
    assert.ok(!tsx.includes(gone), gone);
  const css = await read("components/home/workflow-journey.css");
  assert.match(css, /\.wj \.wj-rail-fill \{[^}]*transform: scaleY\(0\.333333\)/);
  assert.match(css, /\.wj\[data-active="1"\] \.wj-rail-fill \{\s*transform: scaleY\(0\.666667\)/);
  assert.match(css, /\.wj\[data-active="2"\] \.wj-rail-fill \{\s*transform: scaleY\(1\)/);
  assert.ok(!css.includes('data-active="3"'));
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
  assert.ok(main.includes(REQUIRED));
  assert.ok(!main.includes("브랜드 홍보 및 SNS 광고 영상"));
  assert.ok(main.includes("브랜드 홍보 영상, SNS 광고 영상"));
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
  assert.doesNotMatch(main, /<HomeHero|<HomeServices/);
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
