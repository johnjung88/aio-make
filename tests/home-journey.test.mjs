import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import ts from "typescript";
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
const read = async (path) => (await readFile(new URL(path, root), "utf8")).replaceAll("\r\n", "\n");
const catalogWorks = [...reviewWorks, ...publicWorks];

// Load the server-only journey data in a child process with a given review
// flag (undefined = variable unset, as on production), the same way
// reference-release.test.mjs checks the catalog gate.
function journeyData(flag) {
  const url = new URL("../lib/home-journey-data.ts", import.meta.url).href;
  const code = `const m = await import(${JSON.stringify(url)}); console.log(JSON.stringify({config:{devProjectConfig:m.devProjectConfig,beforeShots:m.beforeShots,contentReviewSlugs:m.contentReviewSlugs,aiInfluencerDraft:m.aiInfluencerDraft},data:m.homeJourneyData([])}));`;
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
// 2026-10-15(R6) 사용자 결정: 문장 끝 마침표만 없애고 나머지 원문은 그대로 둔다.
// 2026-10-15(R7): 문장 사이 마침표 대신 줄바꿈으로 문장마다 한 줄을 쓴다(문구는 그대로).
// 2026-10-15(R8): 세 단계 리드를 사용자가 정한 문구로 교체했다(M6, M8, M10).
const ORIGINAL_STEPS = {
  "journey-dev": {
    railLabel: "개발",
    title: "웹사이트와 쇼핑몰을\n가이드대로 만듭니다",
    lead: "새롭게 기획한 브랜드 가이드를\n문의나 구매로 이어지도록 설계",
  },
  "journey-marketing": {
    railLabel: "마케팅",
    title: "계획하고 운영하고\n데이터로 고칩니다",
    lead: "어느 채널에, 어떻게 보여줄지 계획하고\n반응을 확인하고 다음 계획에 반영합니다",
  },
  "journey-content": {
    railLabel: "컨텐츠",
    title: "채널에 맞는 컨텐츠를\n직접 만듭니다",
    lead: "브랜드 가이드로 기준을 잡고\n웹툰부터 SNS 영상까지 직접 제작",
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
  assert.equal(journeyIntro.title, "기획부터 성과까지\n하나로 이어집니다");
  // R8 M4: the HOW WE WORK subtitle is gone.
  assert.equal("lead" in journeyIntro, false);
  assert.equal("journeyClosing" in journeyModule, false);
  // R6: no sentence ends with a period.
  for (const text of journeySteps.map((step) => step.lead))
    assert.ok(!/[.。]\s*$/.test(text), text);
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
  // label·line are frozen to the 3214 wording in lib/home-journey.ts so a
  // /content home copy change (lib/content-home.ts) does not change the main page.
  assert.deepEqual(
    contentTabs.map(({ id, label, line }) => ({ id, label, line })),
    [
      { id: "webtoon", label: "웹툰", line: "브랜드 이야기를 세로로 읽히는 컷으로 그립니다" },
      { id: "animation", label: "애니메이션", line: "캐릭터와 장면에 움직임을 더합니다" },
      { id: "ai-influencer", label: "AI 인플루언서", line: "브랜드 전용 AI 가상인물을 만듭니다" },
      { id: "motion-graphics", label: "모션그래픽", line: "그래픽과 글자의 움직임으로 메시지를 전합니다" },
      { id: "brand-film", label: "브랜드 홍보 영상", line: "브랜드가 하는 일과 이유를 한 편에 담습니다" },
      { id: "ad", label: "SNS 광고 영상", line: "피드에서 첫 장면으로 시선을 붙잡습니다" },
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
  // R7: the development step shows the single DR's Secret case.
  const devSlugs = [reviewData.devProjectConfig.slug];
  assert.deepEqual(devSlugs, ["bwl-store"]);
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
  const devSlugs = [reviewData.devProjectConfig.slug];
  const keys = Object.keys(reviewData.beforeShots);
  assert.deepEqual(keys, ["bwl-store"]);
  for (const key of keys) assert.ok(devSlugs.includes(key));
  // Flag off: customer data is absent from the module values.
  assert.deepEqual(publicData.beforeShots, {});
  assert.equal(publicData.devProjectConfig, null);
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
  const faq = await read("lib/home-faq.ts");
  assert.ok(faq.includes("브랜드 홍보 영상, SNS 광고 영상"));
  assert.ok(main.includes("const faqData = homeFaq"));
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

// R6 WP-M: 메인 `/` 왼쪽 정렬 · 분야 카드 4줄 · 공통 섹션 간격 · 닫는 문구
test("main hero is centered with the agreed copy and two buttons", async () => {
  const main = await read("components/guide/main.jsx");
  const css = await read("components/guide/ux.css");
  const hero = main.slice(
    main.indexOf('<section className="main-hero">'),
    main.indexOf('<ShowcaseVideo kind="brand" />'),
  );
  for (const text of [
    "분야별 ",
    "전문가들",
    "와 함께 일합니다",
    "컨텐츠·마케팅·개발, ",
    "필요한 일만",
    " 골라 맡기고 결과를 함께 확인하세요",
    "견적 문의",
    "제작 예시 살펴보기",
  ])
    assert.ok(hero.includes(text), text);
  assert.equal(hero.match(/<GuideLink/g).length, 2);
  assert.ok(!/textAlign|alignItems/.test(hero), "no inline alignment");
  const block = css.slice(css.indexOf(".guide-main .main-hero-inner {"));
  const inner = block.slice(0, block.indexOf("}"));
  assert.match(inner, /align-items: center;/);
  assert.match(inner, /text-align: center;/);
  assert.doesNotMatch(inner, /flex-start|text-align: left/);
  // R8 M1: eyebrow, lead (max-width) and the button row are centered as well.
  const rule = (selector) => {
    const start = css.indexOf(selector);
    assert.ok(start >= 0, selector);
    return css.slice(start, css.indexOf("}", start));
  };
  assert.match(rule(".guide-main .main-hero-eyebrow {"), /justify-content: center;/);
  assert.match(rule(".guide-main .main-hero-lead {"), /margin: 0 auto;/);
  assert.match(rule(".guide-main .main-hero-actions {"), /justify-content: center;/);
});

test("division cards are 01 개발 · 02 마케팅 · 03 컨텐츠 with four lines each", async () => {
  const main = await read("components/guide/main.jsx");
  const css = await read("components/guide/ux.css");
  const section = main.slice(
    main.indexOf('id="divisions"'),
    main.indexOf("<WorkflowJourney"),
  );
  // Same order and numbers as the workflow (개발 → 마케팅 → 컨텐츠).
  const order = ["/lab", "/marketing", "/content"].map((href) =>
    section.indexOf(`href="${href}"`),
  );
  assert.ok(order.every((index) => index > 0));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
  const cards = section.split('className="main-division"').slice(1);
  assert.equal(cards.length, 3);
  const expected = [
    ["01", "개발", "개발 상담하기 →"],
    ["02", "마케팅", "마케팅 상담하기 →"],
    ["03", "컨텐츠", "컨텐츠 상담하기 →"],
  ];
  cards.forEach((card, index) => {
    const [num, name, cta] = expected[index];
    assert.ok(card.includes(`{"${num}"}`), num);
    assert.ok(card.includes(`{"${name}"}`), name);
    assert.ok(card.includes(`{"${cta}"}`), cta);
    // number+name / one line / services / link: four text rows
    for (const cls of [
      "main-division-name",
      "main-division-line",
      "home-division-services",
      "main-division-cta",
    ])
      assert.equal(card.split(cls).length - 1, 1, `${num} ${cls}`);
  });
  assert.deepEqual(
    journeySteps.map((step) => step.railLabel),
    expected.map(([, name]) => name),
  );
  // English names, status chips and the old numbering are gone.
  for (const gone of [
    "Studio",
    '"Marketing"',
    '"Lab"',
    "바로 의뢰 가능",
    "문의 가능",
    "01 · CONTENT",
    "02 · MARKETING",
    "03 · DEV",
  ])
    assert.ok(!main.includes(gone), gone);
  // R8 M2: the h2 is centered by class (no inline alignment).
  assert.ok(!/textAlign/.test(section));
  assert.match(css, /\.main-divisions-title \{[^}]*text-align: center;/);
  assert.match(
    css,
    /\.main-division-body \{[^}]*grid-template-rows: auto auto 1fr auto;/,
  );
});

test("main sections use one section spacing token and no inline layout", async () => {
  const main = await read("components/guide/main.jsx");
  const css = await read("components/guide/ux.css");
  const wj = await read("components/home/workflow-journey.css");
  // Everything above the contact form is class based (no inline style).
  const upper = main.slice(
    main.indexOf("render() {"),
    main.indexOf("{sent ? ("),
  );
  assert.ok(!/style=/.test(upper), "no inline style above the form");
  assert.ok(!upper.includes("clamp(80px,10vw,140px)"));
  assert.ok(!upper.includes("maxWidth"));
  const block = css.slice(css.indexOf("/* Main page `/` (R6 WP-M)"));
  assert.ok(block.length > 0);
  // Colors are tokens (--ink, --violet, --lavender, --main-*) except white.
  const declarations = block
    .replace(/--main-[a-z0-9-]+:[^;]*;/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");
  assert.doesNotMatch(declarations, /#(?!fff\b)[0-9a-f]{3,6}\b/i);
  assert.ok(!/main-standard-caption/.test(block), "OUR STANDARD caption rule is gone");
  // Hero, divisions, standard, FAQ and contact all use --section-y.
  for (const selector of [
    ".main-hero-inner",
    ".main-divisions",
    ".main-standard-inner",
    ".main-faq",
    ".main-contact-inner",
  ]) {
    const start = block.indexOf(`.guide-main ${selector} {`);
    assert.ok(start >= 0, selector);
    assert.match(
      block.slice(start, block.indexOf("}", start)),
      /padding-block: var\(--section-y\);/,
      selector,
    );
  }
  assert.match(wj, /\.wj \{[^}]*padding-block: var\(--section-y\);/);
  // R7: step gap 64 (360-767) / 80 (768) / 88 (1024) / 96 (1440).
  assert.match(wj, /--wj-step-gap: 64px;/);
  assert.match(wj, /--wj-step-gap: 80px;/);
  assert.match(wj, /--wj-step-gap: 88px;/);
  assert.match(wj, /--wj-step-gap: 96px;/);
});

test("OUR STANDARD is a centered closing line without a caption", async () => {
  const main = await read("components/guide/main.jsx");
  const section = main.slice(
    main.indexOf('<section className="main-standard">'),
    main.indexOf('<div className="l-container main-faq">'),
  );
  assert.ok(section.includes("만드는 일의 끝은,"));
  assert.ok(section.includes("고객이 쓰기 시작하는 순간"));
  assert.ok(section.includes("입니다"));
  assert.ok(!section.includes("기획 · 제작 · 검수 · 인계"));
  assert.ok(!section.includes("main-standard-caption"));
  assert.ok(!section.includes("AIO MAKE의 작업 기준"));
  assert.ok(!/style=|textAlign|alignItems/.test(section));
  const css = await read("components/guide/ux.css");
  const inner = css.slice(css.indexOf(".guide-main .main-standard-inner {"));
  const rule = inner.slice(0, inner.indexOf("}"));
  assert.match(rule, /align-items: center;/);
  assert.match(rule, /text-align: center;/);
  assert.doesNotMatch(rule, /flex-start|text-align: left/);
});

test("R8 main journey: centered heads, removed subtitle, closing row, notices and dev caption", async () => {
  const tsx = await read("components/home/workflow-journey.tsx");
  const css = await read("components/home/workflow-journey.css");
  // M3/M4: intro is centered and holds eyebrow + title only.
  const intro = tsx.slice(tsx.indexOf('<header className="wj-intro">'), tsx.indexOf("</header>"));
  assert.ok(intro.includes("journeyIntro.title"));
  assert.ok(!intro.includes("journeyIntro.lead"));
  assert.ok(!intro.includes("wj-lead"));
  assert.match(css, /\.wj \.wj-intro \{[^}]*text-align: center;/);
  // M7/M9/M16: every step head (eyebrow, title, lead) is centered in the right column.
  const head = css.slice(css.indexOf(".wj .wj-step > .wj-eyebrow,"));
  assert.match(
    head.slice(0, head.indexOf("}")),
    /\.wj \.wj-step > \.wj-eyebrow,\s*\.wj \.wj-step > \.wj-step-title,\s*\.wj \.wj-step > \.wj-lead \{\s*text-align: center;/,
  );
  assert.match(css, /\.wj \.wj-step > \.wj-lead \{\s*margin-inline: auto;/);
  // The mobile step marker row is centered too.
  assert.match(css, /\.wj \.wj-step > \.wj-eyebrow \{[^}]*justify-content: center;/);
  // M11: closing consultation row is gone.
  for (const gone of ["wj-closing", "journeyClosing", "wj-button"]) {
    assert.ok(!tsx.includes(gone), `workflow-journey.tsx: ${gone}`);
    assert.ok(!css.includes(gone), `workflow-journey.css: ${gone}`);
  }
  assert.ok(!tsx.includes("어디서부터 시작할지"));
  // M12: trademark notice is not rendered in the marketing and content steps.
  for (const file of ["journey-marketing", "journey-content"]) {
    const src = await read(`components/home/${file}.tsx`);
    const styles = await read(`components/home/${file}.css`);
    assert.ok(!src.includes("PLATFORM_TRADEMARK_NOTICE"), `${file}.tsx`);
    assert.ok(!/wj-mk-notice|wjc-notice/.test(src + styles), `${file}`);
    assert.ok(!src.includes("각 회사의 상표입니다"), `${file}.tsx`);
  }
  // M13: the dev compare has no caption.
  const compare = await read("components/home/journey-dev-compare.tsx");
  const data = await read("lib/home-journey-data.ts");
  assert.ok(!compare.includes("model.caption"));
  assert.ok(!data.includes("기존 공식몰 첫 화면 · 2026-10-10 캡처"));
  assert.ok(!data.includes("2026-10-10 캡처"));
  assert.equal("caption" in (review.data.devProject.before ?? {}), false);
});

test("R8 rail is enlarged: 280px, heading-size label, 16px number, tall rows", async () => {
  const css = await read("components/home/workflow-journey.css");
  const tsx = await read("components/home/workflow-journey.tsx");
  assert.match(css, /--wj-rail-w: 250px;/);
  assert.match(css, /@media \(min-width: 1280px\) \{\s*\.wj \{\s*--wj-rail-w: 280px;/);
  assert.match(css, /--wj-rail-label-size: clamp\(22px, 1\.8vw, 26px\);/);
  assert.match(css, /--wj-rail-num-size: 16px;/);
  assert.match(css, /--wj-rail-pad-y: 22px;/);
  assert.match(
    css,
    /\.wj \.wj-rail-link \{[^}]*padding: var\(--wj-rail-pad-y\) 0 var\(--wj-rail-pad-y\) var\(--wj-s5\);/,
  );
  assert.match(
    css,
    /\.wj-rail-label \{\s*font-size: var\(--wj-rail-label-size\);\s*font-weight: var\(--type-h3-weight\);/,
  );
  assert.match(css, /\.wj-rail-link \.wj-num \{\s*font-size: var\(--wj-rail-num-size\);/);
  assert.match(css, /\.wj \.wj-rail-list \{\s*display: grid;\s*gap: var\(--wj-s4\);/);
  // Layout and fill still use the same variable and the three-step fill.
  assert.match(css, /grid-template-columns: var\(--wj-rail-w\) minmax\(0, 1fr\);/);
  assert.ok(tsx.includes('className="wj-rail-fill"'));
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
  // R7 WP-3: journey-content.css follows the same type rules but is the one sheet
  // allowed to use scroll-snap (mobile card swipe).
  const sheets = await Promise.all(
    ["workflow-journey.css", "journey-dev.css", "journey-content.css"].map(
      async (name) =>
        (await read(`components/home/${name}`)).replace(/\/\*[\s\S]*?\*\//g, ""),
    ),
  );
  const css = sheets.join(" ");
  const baseCss = sheets.slice(0, 2).join(" ");
  assert.ok(!css.includes("!important"));
  const typeProp =
    /(?:^|[;{\s])(font-size|line-height|letter-spacing|font-weight|font-family)\s*:\s*([^;}]*)/g;
  for (const [, prop, value] of css.matchAll(typeProp))
    assert.match(value.trim(), /^var\(/, `${prop}: ${value}`);
  // No type declarations inside any @media block.
  for (const sheet of sheets) {
    let index = 0;
    while ((index = sheet.indexOf("@media", index)) !== -1) {
      let depth = 0;
      let end = sheet.indexOf("{", index);
      for (let i = end; i < sheet.length; i++) {
        if (sheet[i] === "{") depth++;
        else if (sheet[i] === "}" && --depth === 0) {
          end = i;
          break;
        }
      }
      const block = sheet.slice(index, end);
      assert.doesNotMatch(
        block,
        /(?:^|[;{\s])(font-size|line-height|letter-spacing|font-weight|font-family)\s*:/,
      );
      index = end;
    }
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
  assert.ok(!baseCss.includes("scroll-snap"));
});

test("review gate: only the single approved main case is public; other customer work stays gated", () => {
  // Review build: the server selects customer work (so the scan below is real).
  assert.ok(review.data.devProject);
  const reviewText = JSON.stringify(review);
  for (const word of ["reference-review", "before-pc", "87언니", "DR's Secret"])
    assert.ok(reviewText.includes(word), word);
  assert.ok(
    review.data.contentSelections.some((selection) =>
      reviewWorks.some((work) => work.slug === selection.work?.slug),
    ),
  );
  for (const [state, off] of Object.entries(offStates)) {
    assert.equal(off.config.devProjectConfig, null, state);
    assert.deepEqual(off.config.beforeShots, {}, state);
    assert.deepEqual(off.config.contentReviewSlugs, {}, state);
    assert.deepEqual(off.config.aiInfluencerDraft, { slugs: [], caption: "" });
    assert.deepEqual(off.data.devProject, review.data.devProject, `${state}: exactly the approved main case`);
    assert.equal(off.data.contentSelections.length, 6, state);
    for (const selection of off.data.contentSelections)
      assert.ok(
        !selection.work || publicWorks.some((w) => w.slug === selection.work.slug),
        `${state}: ${selection.work?.slug}`,
      );
    const text = JSON.stringify({ ...off, data: { ...off.data, devProject: null } });
    for (const word of customerWords)
      assert.ok(!text.includes(word), `${state}: ${word}`);
  }
});

test("client journey modules protect private data; v10 exposes only allowlisted public home assets and copy", async () => {
  const ledger = JSON.parse(await read("content/approved-main-assets-20261019.json"));
  assert.equal(ledger.version, "v10");
  const approvedHomePaths = new Set();
  for (const entry of ledger.assets) {
    assert.match(entry.publicPath, /^\/content-renewal-20261019\/[\w.-]+\.(?:mp4|webp)$/);
    assert.ok(!approvedHomePaths.has(entry.publicPath), "no duplicate approved URL");
    approvedHomePaths.add(entry.publicPath);
    const bytes = await readFile(new URL(`public${entry.publicPath}`, root));
    assert.equal(bytes.byteLength, entry.bytes, entry.publicPath);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), entry.sha256, entry.publicPath);
  }
  // This is an exact public-copy allowlist, not a module/brand-wide privacy exemption.
  // Original paths, review slugs, titles outside this set, catalog imports and env reads remain checked.
  const approvedHomeLiterals = new Set([
    ...approvedHomePaths,
    "1억의 구단주 1화의 실제 완성 페이지 05와 21",
    "《1억의 구단주》 · 웹툰 제작",
    "자체 기획 IP의 실제 완성 페이지입니다. 원고와 장면 구성을 정리해 인물의 행동과 대사를 컷으로 옮겼습니다",
    "요프리 제품을 캐릭터로 만든 세 가지 포즈",
    "요프리 · 캐릭터 활용",
    "제품을 캐릭터로 만들고 표정과 포즈를 정리한 실제 제작물입니다. 캐릭터와 모션을 설계하는 작업 방식을 보여줍니다",
    "자체 기획 AI 가상인물 87언니의 얼굴과 전신 기준 이미지",
    "87언니 · AI 가상인물",
    "자체 기획 AI 가상인물의 얼굴과 전신 기준 이미지입니다. 인물의 외형과 스타일을 먼저 정리하고 이미지 제작에 활용합니다",
    "DR’s Secret 브랜드 모션 영상",
    "DR’s Secret · 브랜드 모션",
    "브랜드 이미지와 문구를 움직임으로 구성한 실제 제작 영상입니다",
    "힐러넷 기업 소개 모션 영상",
    "힐러넷 · 기업 소개 영상",
    "회사의 서비스와 정보를 장면과 문구로 정리한 실제 제작 영상입니다",
    "C Plus 제품을 소개하는 세로 광고 영상",
    "C Plus · SNS 광고 영상",
    "제품을 짧은 세로 화면에 담은 실제 제작 영상입니다. 도입 장면부터 제품 소개까지 화면의 흐름을 확인할 수 있습니다",
  ]);
  const publicHomeScanText = (text) => {
    assert.doesNotMatch(text, /I:[\\/]|01_WORK|ASSET_LINEAGE|asset-manifest|source_sha256|source_map/, "private provenance never enters client home data");
    const sourceFile = ts.createSourceFile("content-home.ts", text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    assert.equal(sourceFile.parseDiagnostics.length, 0, "public home data is valid TypeScript");
    const ranges = [];
    const visit = (node) => {
      if (ts.isStringLiteralLike(node)) {
        const value = node.text;
        if (value.startsWith("/content-renewal-20261019/"))
          assert.ok(approvedHomePaths.has(value), `${value} is not in the approved asset ledger`);
        if (approvedHomeLiterals.has(value)) ranges.push([node.getStart(sourceFile), node.end]);
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
    const parts = [];
    let offset = 0;
    for (const [start, end] of ranges.sort((a, b) => a[0] - b[0])) {
      parts.push(text.slice(offset, start), '""');
      offset = end;
    }
    return parts.join("") + text.slice(offset);
  };
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
      /from\s+["'][^"']*(home-journey-data|home-main-approved|generated\/works)/,
      `${file} imports customer data`,
    );
    assert.doesNotMatch(
      text,
      /import\s+\{[^}]*\}\s+from\s+["'][^"']*work-catalog/,
      `${file}: only type imports from work-catalog`,
    );
    assert.ok(!text.includes("process.env"), `${file} reads the env`);
    const privateScan = file === "lib/content-home.ts" ? publicHomeScanText(text) : text;
    for (const word of customerWords)
      assert.ok(!privateScan.includes(word), `${file}: ${word}`);
  }
  const server = await read("lib/home-journey-data.ts");
  assert.match(server, /^import "server-only";$/m);
  const approved = await read("lib/home-main-approved.ts");
  assert.match(approved, /^import "server-only";$/m);
  assert.doesNotMatch(approved, /from\s+["'][^"']*(work-catalog|generated\/works|db)["']|process\.env/, "the public exception does not import the private catalog or database");
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

// R7 WP-1: 메인 #work 링크 줄 삭제, 개발 단계 1사례, 전후 비교와 상세 모달
test("R7 main work step has no link rows, tabs or chips in dev, marketing and content", async () => {
  const files = [
    "components/home/workflow-journey.tsx",
    "components/home/journey-dev.tsx",
    "components/home/journey-dev-compare.tsx",
    "components/home/journey-detail-dialog.tsx",
    "components/home/journey-content.tsx",
    "lib/home-journey.ts",
    "lib/home-journey-data.ts",
  ];
  for (const file of files) {
    const text = await read(file);
    for (const gone of [
      "작업 자세히 보기",
      "서비스 자세히 보기",
      "웹사이트 제작",
      "통합 마케팅",
      "SNS 대행 운영",
      "SEO·AEO·GEO",
      "컨텐츠 서비스 전체 보기",
      "LinkRow",
      "devServiceLinks",
      "devFallbackTabs",
      "stepLinks",
      "wj-links",
      "wj-chips",
    ])
      assert.ok(!text.includes(gone), `${file}: ${gone}`);
  }
  // The shopping-mall frame is the only public development case.
  const lib = await read("lib/home-journey.ts");
  assert.ok(lib.includes('title: "쇼핑몰 제작"'));
  // The development step no longer uses the tab list or the HoldFrame placeholder.
  const dev = await read("components/home/journey-dev.tsx");
  for (const gone of ["JourneyTabList", "journey-tabs", 'role="tablist"', "HoldFrame", "beforeHold"])
    assert.ok(!dev.includes(gone), gone);
  assert.ok(!/beforeHold/.test(lib));
  const css = await read("components/home/workflow-journey.css");
  for (const gone of [".wj-links", ".wj-chip", ".wj-cycle", ".wj-node", ".wj-loop", ".wj-branches", ".wj-compare", ".wj-dialog"])
    assert.ok(!css.includes(gone), gone);
  // Mobile timeline no longer indents the step body (start x = section gutter).
  assert.ok(!/\.wj \.wj-steps \{[^}]*padding-left/.test(css));
  assert.ok(!/\.wj \.wj-steps::before/.test(css));
  assert.match(css, /\.wj \.wj-lead \{[^}]*white-space: pre-line;[^}]*text-wrap: balance;/);
  assert.match(css, /\.wj \.wj-lead-line \{[^}]*display: block;[^}]*text-wrap: balance;/);
  assert.doesNotMatch(css, /\.wj \.wj-lead \{[^}]*text-wrap: pretty/);
  // 16px lead below 480px keeps the marketing lead within 3 lines at 430px.
  assert.match(css, /@media \(max-width: 479\.98px\) \{\s*\.wj \{\s*--wj-step-lead-size: 16px;/);
  assert.match(css, /--wj-lead-gap: 32px;/);
  assert.match(css, /--wj-lead-gap: 40px;/);
  assert.match(css, /--wj-lead-gap: 48px;/);
});

test("R7 step leads put each sentence on its own line", () => {
  for (const step of journeySteps) {
    const lines = step.lead.split("\n");
    assert.equal(lines.length, 2, step.id);
    for (const line of lines)
      assert.ok(line.trim() === line && line.length > 0, step.id);
  }
});

test("v11 development step holds one approved DR’s Secret v03 home pair and no other customer", async () => {
  const project = review.data.devProject;
  assert.equal(project.title, "DR’s Secret 쇼핑몰");
  assert.ok(project.before && project.afterMobile);
  assert.equal(project.before.pc.width, 1440);
  // The detail object carries only what the dialog shows.
  assert.deepEqual(Object.keys(project.detail).sort(), [
    "description",
    "purpose",
    "scope",
    "status",
    "title",
  ]);
  assert.ok(!("work" in project) && !("config" in project));
  assert.equal(project.detail.status, "PC·모바일 디자인 시안 v03");
  assert.match(project.detail.description, /실제 주문과 결제는 받지 않는 레퍼런스/);
  assert.match(project.detail.scope, /같은 홈 디자인 시안 v03/);
  assert.deepEqual([project.after.width, project.after.height], [1440, 1000]);
  assert.deepEqual([project.afterMobile.width, project.afterMobile.height], [390, 1000]);
  assert.equal(project.after.src, "/company-main-20261019-v11/development/after-home-pc-v03.png");
  assert.equal(project.afterMobile.src, "/company-main-20261019-v11/development/after-home-mobile-v03.png");
  const approved = {
    "before-home-pc.webp": [50306, "be4b1c1288a5127a407a3bc0cb154468a98d8a0abf3b1c23db43782493965c34"],
    "before-home-mobile.webp": [25600, "22c2832e87cbf9cfdbbd0afa2703ab9cfc39bf82ac95db47b6ba153d9daa4281"],
    "after-home-pc-v03.png": [347014, "a942f900539e773b4cce95ac55696db8e5c02fce28872370884b23d93f6b5c26"],
    "after-home-mobile-v03.png": [135750, "606e73b29afa5bef09a2e047581d7020fe90691465ca2e771ea4b0d396f2ee87"],
  };
  const base = "/company-main-20261019-v11/development/";
  assert.deepEqual([project.before.pc.src, project.before.mobile.src, project.after.src, project.afterMobile.src], Object.keys(approved).map(name => base + name));
  const provenance = JSON.parse(await read("content/approved-main-assets-20261019.json")).development;
  assert.equal(provenance.sameHomePair, true);
  assert.equal(provenance.version, "v03");
  assert.equal(provenance.pairId, "bwl-store-home-v03");
  assert.deepEqual(provenance.afterSourceIds, ["bwl-store-home-v03/index-1440-viewport.png", "bwl-store-home-v03/index-390-viewport.png"]);
  for (const [name, [bytes, sha256]] of Object.entries(approved)) {
    const file = await readFile(new URL(`public${base}${name}`, root));
    assert.equal(file.byteLength, bytes, name);
    assert.equal(createHash("sha256").update(file).digest("hex"), sha256, name);
    const entry = provenance.assets.find(asset => asset.publicPath === base + name);
    assert.equal(entry?.sha256, sha256, `${name} links to the recorded source SHA`);
    assert.equal(entry?.bytes, bytes);
  }
  const text = JSON.stringify({
    project,
    devProjectConfig: review.config.devProjectConfig,
    beforeShots: review.config.beforeShots,
  });
  assert.doesNotMatch(text, /힐러넷|HEALERNET|healernet-|요프리|YoFree|yofree-/i);
});

test("R7 comparison: desktop slider keys, mobile before/after switch, tap threshold, intro hint", async () => {
  const text = await read("components/home/journey-dev-compare.tsx");
  assert.match(text, /role="slider"/);
  assert.match(text, /aria-valuemin=\{0\}/);
  assert.match(text, /aria-valuemax=\{100\}/);
  assert.match(text, /aria-valuetext=/);
  assert.match(text, /devCopy\.beforeValue/);
  for (const key of ["ArrowLeft", "ArrowRight", "Home", "End"])
    assert.ok(text.includes(`"${key}"`), key);
  assert.match(text, /event\.shiftKey \? 20 : 5/);
  assert.match(text, /aria-pressed=\{value === item\.value\}/);
  assert.match(text, /TAP_SLOP = 6/);
  assert.match(text, /setPointerCapture/);
  assert.match(text, /prefers-reduced-motion: reduce/);
  assert.match(text, /setPos\(35\)[\s\S]*setPos\(65\)[\s\S]*setPos\(50\)/);
  // The slider is a sibling of the open buttons, never nested inside a button.
  const stage = text.slice(text.indexOf('className="wj-cmp-handle"'));
  assert.ok(stage.indexOf('role="slider"') < stage.indexOf('className="wj-cmp-hit"'));
  const css = await read("components/home/journey-dev.css");
  assert.match(css, /\.wj \.wj-cmp-stage \{[^}]*touch-action: pan-y;/);
  assert.match(css, /\.wj \.wj-cmp-unit--pc \.wj-cmp-stage \{\s*aspect-ratio: 16 \/ 10;/);
  assert.match(css, /\.wj \.wj-cmp-unit--mobile \.wj-cmp-stage \{\s*aspect-ratio: 390 \/ 844;/);
  assert.match(css, /--wj-m-h: min\(70svh, 520px\);/);
  assert.match(css, /--wj-m-h: min\(70svh, 560px\);/);
  assert.match(css, /max-width: 880px;/);
  assert.match(css, /clip-path: inset\(0 0 0 calc\(var\(--wj-cmp-pos, 50\) \* 1%\)\)/);
  assert.match(css, /\.wj-cmp-handle::after \{[^}]*width: 44px;[^}]*height: 44px;/);
  // The BEFORE/AFTER switch shows only under 768px.
  assert.match(css, /\.wj \.wj-cmp-seg \{\s*display: none;/);
  assert.match(css, /@media \(max-width: 767\.98px\) \{[\s\S]*\.wj \.wj-cmp-seg \{\s*display: grid;/);
  // Original captures are used as they are: no crop or zoom to hide the scrollbar.
  assert.doesNotMatch(css, /scale\(1\.|object-position: [^;]*right/);
  assert.ok(!/\sstyle=/.test(text));
});

test("R7 detail dialog: native dialog, ESC, close button, backdrop, focus return, full-screen sheet", async () => {
  const dialog = await read("components/home/journey-detail-dialog.tsx");
  assert.match(dialog, /<dialog/);
  assert.match(dialog, /aria-labelledby=\{titleId\}/);
  assert.match(dialog, /event\.target === event\.currentTarget/);
  assert.match(dialog, /event\.key !== "Tab"/);
  assert.match(dialog, /onClose=\{onClosed\}/);
  const dev = await read("components/home/journey-dev.tsx");
  assert.match(dev, /dialog\.current\?\.showModal\(\)/);
  assert.match(dev, /opener\.current\?\.focus\(\)/);
  // No link inside the dialog.
  assert.doesNotMatch(dialog, /<Link|<a\s|href=/);
  const css = await read("components/home/journey-dev.css");
  assert.match(css, /html:has\(dialog\[open\]\) \{\s*overflow: hidden;/);
  assert.match(css, /overscroll-behavior: contain;/);
  assert.match(css, /\.wj \.wj-detail \{\s*width: 100%;[\s\S]*?height: 100dvh;/);
  assert.match(css, /width: min\(720px, 94vw\);/);
  assert.match(css, /width: min\(1120px, 92vw\);/);
  assert.match(css, /max-height: 90dvh;/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  // Public dialog copy: title, one sentence and the four step list.
  const lib = await read("lib/home-journey.ts");
  assert.ok(
    lib.includes(
      "기존 화면을 점검하고 브랜드 가이드를 적용해 PC·모바일 화면과 문의·구매 동선을 설계합니다",
    ),
  );
  assert.equal(journeyModule.devFallbackSteps.length, 4);
});

test("v11 public journey data includes only the approved case and excludes private catalog detail", () => {
  for (const [state, off] of Object.entries(offStates)) {
    assert.deepEqual(off.data.devProject, review.data.devProject, state);
    assert.deepEqual(Object.keys(off.data.devProject).sort(), ["after", "afterMobile", "before", "detail", "title"]);
    const text = JSON.stringify({ ...off, data: { ...off.data, devProject: null } });
    assert.ok(!text.includes('"detail"'), state);
    assert.doesNotMatch(
      text,
      /힐러넷|HEALERNET|healernet-|요프리|YoFree|yofree-|reference-review|bwl-/i,
      state,
    );
  }
});
