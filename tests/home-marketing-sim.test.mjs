import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import {
  calendarScene,
  countUpMs,
  improveScene,
  insightScene,
  loopHintMs,
  marketingBrand,
  marketingImages,
  marketingScenes,
  marketingStages,
  operateScenes,
  platformOrder,
  scenesOfStage,
  searchScene,
  stageProgress,
} from "../lib/home-journey-marketing.ts";
import {
  PLATFORM_TRADEMARK_NOTICE,
  platformLogos,
} from "../components/platform-frame/logos.ts";
import * as journeyModule from "../lib/home-journey.ts";

// R7 WP-2: 마케팅 4단계 스테퍼 + 폰 시뮬레이터 (BRIEF_R7 §2-3·§2-4)
const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const strip = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

const TSX = "components/home/journey-marketing.tsx";
const CSS = "components/home/journey-marketing.css";
const LIB = "lib/home-journey-marketing.ts";

// BRIEF §2-4-3 표의 값. 화면 수치는 이 값만 쓴다(구현이 만든 숫자는 없다).
const EXPECTED = {
  stages: [
    ["01", "플랜 기획", "SEO·AEO·GEO 분석과 설계"],
    ["02", "운영", "게시·댓글·검색 노출 관리"],
    ["03", "데이터 확인", "채널·검색 성과 모아 보기"],
    ["04", "성과 개선", "다음 플랜에 반영"],
  ],
  descs: [
    "고객이 검색창과 AI 답변에서 무엇을 묻는지 먼저 찾고, 채널마다 무엇을 언제 올릴지 정합니다",
    "정한 일정에 맞춰 채널별 규격으로 올리고, 댓글과 메시지, 검색 노출을 함께 관리합니다",
    "채널별 조회와 반응, 사이트 유입, 검색 키워드를 한 화면에 모아 무엇이 통했는지 확인합니다",
    "반응이 좋은 형식과 문장을 다음 플랜에 반영하고, 검색과 AI 답변에 쓰일 문단을 보강합니다",
  ],
  query: "건성 피부 수분크림 추천",
  searchRows: [
    "검색 결과 7위 → 목표 3위 안",
    "자주 묻는 질문 답변 문단 0개 → 4개",
    "AI 요약 인용 출처 0곳 → 브랜드 페이지 인용",
  ],
  calendar: [
    ["월", "instagram", "아침 루틴 15초"],
    ["수", "youtube", "성분 한 줄 설명"],
    ["금", "tiktok", "보습 비교 챌린지"],
    ["토", "facebook", "후기 모음 피드"],
  ],
  instagram: {
    stats: ["86", "1.2만", "180"],
    tiles: ["2.4만", "8,930", "1.1만"],
  },
  youtube: { stats: ["8,240명"], tiles: ["3.1만회", "9,870회", "1.2만회"] },
  tiktok: {
    stats: ["96", "2.6만", "18.4만"],
    tiles: ["5.2만", "7,600", "1.9만"],
  },
  facebook: { stats: ["1,040명"], reactions: ["126", "18", "9"] },
  kpis: ["3.8만", "6.1만", "1,920", "412"],
  bars: [
    ["instagram", "2.6만"],
    ["tiktok", "2.1만"],
    ["youtube", "1.1만"],
    ["facebook", "3,200"],
  ],
  keywords: ["수분크림 추천", "건성 피부 보습", "성분 비교"],
  variants: [
    ["제품 소개형", "9,800"],
    ["사용 장면형", "2.3만"],
  ],
  faq: "FAQ 문단 4개 추가 → AI 요약 인용 1곳",
};

test("stage copy matches the brief table word for word", () => {
  assert.equal(marketingStages.length, 4);
  marketingStages.forEach((stage, index) => {
    assert.deepEqual(
      [stage.num, stage.title, stage.task],
      EXPECTED.stages[index],
    );
    assert.equal(stage.desc, EXPECTED.descs[index]);
  });
});

test("screen numbers are exactly the brief table values", () => {
  assert.equal(searchScene.query, EXPECTED.query);
  assert.deepEqual(
    searchScene.rows.map((row) => row.text),
    EXPECTED.searchRows,
  );
  assert.deepEqual(
    searchScene.rows.map((row) => row.key),
    ["SEO", "AEO", "GEO"],
  );
  assert.deepEqual(
    calendarScene.rows.map((row) => [row.day, row.platform, row.title]),
    EXPECTED.calendar,
  );
  for (const id of ["instagram", "youtube", "tiktok"]) {
    assert.deepEqual(
      operateScenes[id].stats.map((stat) => stat.value),
      EXPECTED[id].stats,
      id,
    );
    assert.deepEqual(
      operateScenes[id].tiles.flatMap((tile) => (tile.value ? [tile.value] : [])),
      EXPECTED[id].tiles,
      id,
    );
  }
  assert.deepEqual(
    operateScenes.facebook.stats.map((stat) => stat.value),
    EXPECTED.facebook.stats,
  );
  assert.deepEqual(
    operateScenes.facebook.reactions.map((item) => item.value),
    EXPECTED.facebook.reactions,
  );
  assert.deepEqual(
    insightScene.kpis.map((kpi) => kpi.value),
    EXPECTED.kpis,
  );
  assert.equal(insightScene.range, "지난 7일");
  assert.deepEqual(
    insightScene.bars.map((bar) => [bar.platform, bar.value]),
    EXPECTED.bars,
  );
  assert.deepEqual(insightScene.keywords, EXPECTED.keywords);
  assert.deepEqual(
    improveScene.variants.map((v) => [v.name, v.value]),
    EXPECTED.variants,
  );
  assert.equal(improveScene.variants.filter((v) => v.winner).length, 1);
  assert.equal(improveScene.variants.find((v) => v.winner).name, "사용 장면형");
  assert.equal(improveScene.winnerBadge, "다음 달 기본 형식");
  assert.equal(improveScene.faq, EXPECTED.faq);
});

test("every number rendered in a scene comes from the data file", async () => {
  const tsx = await read(TSX);
  // The component holds no Korean text and no digit literal of its own.
  const code = tsx.replace(/^\s*\/\/[^\n]*/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
  assert.doesNotMatch(code, /[가-힣]/, "Korean copy lives in lib/home-journey-marketing.ts");
  const literals = [...code.matchAll(/"(?:[^"\\\n])*"/g)].map((m) => m[0]);
  const jsxText = code.match(/>[^<>{}\n]*\d[^<>{}\n]*</g) ?? [];
  assert.deepEqual(
    literals.filter(
      (text) => /\d/.test(text) && !/^"(?:\d+px|[^"]*\.css|[^"]*\.webp)"$/.test(text) && !/^"[^"]*(?:px|--mk)[^"]*"$/.test(text),
    ),
    [],
  );
  assert.deepEqual(jsxText, []);
  // The bar lengths in CSS are the view ratios of the data (longest bar = 100).
  const views = { "2.6만": 26000, "2.1만": 21000, "1.1만": 11000, "3,200": 3200 };
  const max = Math.max(...Object.values(views));
  const css = strip(await read(CSS));
  for (const bar of insightScene.bars) {
    assert.equal(bar.ratio, Math.round((views[bar.value] / max) * 100), bar.value);
    assert.match(
      css,
      new RegExp(
        `\\.wj-mk-bar-fill\\[data-r="${bar.ratio}"\\]\\s*\\{\\s*--r:\\s*${bar.ratio / 100}`,
      ),
    );
  }
});

test("virtual brand is one fictional skincare account with an initial avatar", () => {
  assert.equal(marketingBrand.name, "하루결");
  assert.equal(marketingBrand.handle, "@harugyeol.daily");
  assert.equal(marketingBrand.initial, "결");
  assert.equal(marketingBrand.category, "스킨케어");
  // Feed thumbnails are the repository's own product and ribbon images.
  assert.equal(marketingImages.length, 3);
  return Promise.all(
    marketingImages.map(async (src) =>
      assert.ok((await stat(new URL(`public${src}`, root))).size > 0, src),
    ),
  );
});

test("timeline: four 6 second stages, 24 second loop, platforms every 1.5 seconds", () => {
  assert.equal(
    marketingScenes.reduce((sum, scene) => sum + scene.duration, 0),
    24000,
  );
  for (const stage of [0, 1, 2, 3])
    assert.equal(
      scenesOfStage(stage).reduce((sum, i) => sum + marketingScenes[i].duration, 0),
      6000,
      `stage ${stage}`,
    );
  assert.deepEqual(
    marketingScenes.filter((scene) => scene.platform).map((scene) => scene.duration),
    [1500, 1500, 1500, 1500],
  );
  assert.deepEqual(platformOrder, ["instagram", "youtube", "tiktok", "facebook"]);
  assert.deepEqual(
    marketingScenes.map((scene) => scene.id),
    ["search", "calendar", "instagram", "youtube", "tiktok", "facebook", "insight", "improve"],
  );
  assert.equal(countUpMs, 600);
  assert.equal(loopHintMs, 800);
  // Stage fill runs from the start to the end of each scene's share of its stage.
  assert.deepEqual(stageProgress(0), { from: 0, to: 50 });
  assert.deepEqual(stageProgress(1), { from: 50, to: 100 });
  assert.deepEqual(stageProgress(2), { from: 0, to: 25 });
  assert.deepEqual(stageProgress(5), { from: 75, to: 100 });
  assert.deepEqual(stageProgress(6), { from: 0, to: 100 });
  assert.deepEqual(stageProgress(7), { from: 0, to: 100 });
});

test("official logos only: all four platforms, no look-alike icons", async () => {
  for (const id of platformOrder) assert.equal(platformLogos[id].status, "official", id);
  const files = [TSX, "lib/home-journey-marketing.ts"];
  for (const file of files) {
    const text = await read(file);
    assert.doesNotMatch(
      text,
      /from\s+["']lucide-react["'][^;]*\b(Instagram|Facebook|Youtube|Twitter|Linkedin)\b/,
      file,
    );
    assert.doesNotMatch(text, new RegExp(["simple", "icons"].join("-")), file);
  }
  const tsx = await read(TSX);
  const lucide = tsx.match(/import\s*\{([^}]*)\}\s*from\s*"lucide-react"/)[1];
  assert.doesNotMatch(lucide, /Instagram|Facebook|Youtube|Twitter|Linkedin/);
  assert.match(tsx, /PlatformLogoMark/);
  // Every platform appears as a logo button and in the calendar / bars.
  assert.match(tsx, /platformOrder\.map\(\(id\)/);
});

test("no 'AI virtual example' mark, no performance claims, no trademark notice line (R8 M12)", async () => {
  for (const file of [TSX, CSS, LIB]) {
    const text = await read(file);
    assert.ok(!text.includes("AI 가상 예시"), file);
    assert.ok(!text.includes("연출 예시"), file);
  }
  const lib = strip(await read(LIB));
  assert.doesNotMatch(lib, /달성|평균|보장|공식 파트너|인증|제휴/);
  const tsx = await read(TSX);
  assert.equal(tsx.match(/PLATFORM_TRADEMARK_NOTICE/g), null);
  assert.equal(tsx.match(/wj-mk-notice/g), null);
  assert.ok(!(await read(CSS)).includes("wj-mk-notice"));
  // The shared constant stays in logos.ts for other uses.
  assert.equal(
    PLATFORM_TRADEMARK_NOTICE,
    "Instagram, Facebook, YouTube, TikTok은 각 회사의 상표입니다",
  );
});

test("autoplay never runs under reduced motion and stops on hover, focus, touch and choice", async () => {
  const tsx = await read(TSX);
  assert.match(
    tsx,
    /const running = active && !reduced && !hover && !focusIn && !held;/,
  );
  // The only scene advance is one timeout that exists only while running.
  assert.equal(tsx.match(/setSceneIndex\(\(index\) => \(index \+ 1\)/g).length, 1);
  assert.match(
    tsx,
    /useEffect\(\(\) => \{\s*if \(!running\) return;\s*const timer = window\.setTimeout\(\s*\(\) => setSceneIndex\(\(index\) => \(index \+ 1\) % SCENE_COUNT\)/,
  );
  // Reduced motion starts in the reduced state, so server and first paint are static.
  assert.match(tsx, /useState\(true\);\s*useEffect\(\(\) => \{\s*const media = window\.matchMedia\(\s*"\(prefers-reduced-motion: reduce\)"/);
  // Counting and typing run only while the section is animated.
  assert.match(tsx, /const animate = active && !reduced;/);
  assert.match(tsx, /if \(!parts \|\| !animate\)/);
  // Section must be at least half visible; hidden tabs stop.
  assert.match(tsx, /threshold: 0\.5/);
  assert.match(tsx, /!document\.hidden/);
  assert.match(tsx, /event\.pointerType === "mouse"/);
  assert.match(tsx, /:focus-visible/);
  assert.match(tsx, /onTouchStart=\{\(\) => setHeld\(true\)\}/);
  assert.match(tsx, /const choose = useCallback\(\(index: number\) => \{\s*setSceneIndex\(index\);\s*setHeld\(true\);/);
  // The selection hold is released when the section leaves the screen.
  assert.match(tsx, /if \(!active\) setHeld\(false\);/);
  // No scroll or wheel listeners, no animation frame loop for autoplay.
  assert.ok(!/addEventListener\(\s*["'](scroll|wheel)/.test(tsx));
  assert.ok(!/\sstyle=/.test(tsx), "no inline style");
});

test("only one scene is mounted and animated at a time", async () => {
  const tsx = await read(TSX);
  assert.equal(tsx.match(/className="wj-mk-scene"/g).length, 1);
  assert.equal(tsx.match(/\{screen\}/g).length, 1);
  assert.match(tsx, /key=\{`\$\{scene\.id\}-\$\{epoch\}`\}/);
  const css = strip(await read(CSS));
  assert.match(css, /\.wj \.wj-mk-scene \{[^}]*animation: wj-mk-in 300ms/);
  assert.match(css, /transition: transform 600ms ease-out/);
  assert.ok(!/filter:\s*blur|perspective|rotate[XYZ]?\(/.test(css), "no 3D or blur");
  // The reduced-motion block turns every animation and transition off.
  assert.match(
    css,
    /@media \(prefers-reduced-motion: reduce\) \{\s*\.wj \.wj-mk \*,[\s\S]*?transition: none;\s*animation: none;/,
  );
});

test("number and title share one row with no eyebrow margin", async () => {
  const css = strip(await read(CSS));
  assert.match(css, /\.wj \.wj-mk-step-head \{[^}]*display: flex;[^}]*align-items: center;[^}]*gap: 8px;[^}]*margin: 0;/);
  assert.match(css, /\.wj \.wj-mk-num \{[^}]*margin: 0;[^}]*font-size: 14px;[^}]*font-weight: 650;/);
  assert.match(css, /\.wj \.wj-mk-name \{[^}]*margin: 0;[^}]*font-size: 20px;[^}]*font-weight: 650;/);
  assert.match(css, /\.wj-mk-name \{[^}]*font-size: 22px;/); // 1440
  assert.match(css, /\.wj \.wj-mk-task \{[^}]*font-size: 13px;[^}]*font-weight: 600;/);
  assert.match(css, /\.wj \.wj-mk-desc \{[^}]*font-size: 15px;[^}]*line-height: 1.7;/);
  const tsx = await read(TSX);
  assert.ok(!/eyebrow/.test(tsx), "the global .eyebrow margin is not used");
  assert.match(
    tsx,
    /<span className="wj-mk-step-head">\s*<span className="wj-mk-num">\{item\.num\}<\/span>\s*<span className="wj-mk-name">\{item\.title\}<\/span>/,
  );
});

test("phone frame is 9:19.5 and sized per the layout table", async () => {
  const css = strip(await read(CSS));
  assert.match(css, /\.wj \.wj-mk-phone \{[^}]*aspect-ratio: 9 \/ 19\.5;/);
  assert.match(css, /\.wj \.wj-mk \{\s*--mk-w: 232px;/);
  assert.match(css, /@media \(min-width: 390px\) \{\s*\.wj \.wj-mk \{\s*--mk-w: 240px;/);
  assert.match(css, /@media \(min-width: 430px\) \{\s*\.wj \.wj-mk \{\s*--mk-w: 248px;/);
  assert.match(css, /@media \(min-width: 768px\) \{\s*\.wj \.wj-mk \{\s*--mk-w: 260px;/);
  assert.match(css, /@media \(min-width: 1440px\) \{\s*\.wj \.wj-mk \{\s*--mk-w: 300px;/);
  assert.match(css, /width: min\(var\(--mk-w\), calc\(68svh \* 9 \/ 19\.5\)\)/);
  // Two columns from 768 (list | phone), never four columns.
  assert.match(css, /grid-template-columns: minmax\(0, 1fr\) var\(--mk-w\);/);
  assert.ok(!/repeat\(4/.test(css));
  // Platform buttons are 44px with a 20px logo; progress hit area is 44px.
  assert.match(css, /\.wj \.wj-mk-logo \{[^}]*width: 44px;[^}]*height: 44px;/);
  assert.match(css, /\.wj \.wj-mk-seg \{[^}]*min-height: 44px;/);
  assert.match(css, /\.wj \.wj-mk-track \{[^}]*height: 4px;/);
  assert.match(css, /\.wj \.wj-mk-progress \{\s*display: flex;\s*gap: 6px;/);
  assert.match(css, /@media \(min-width: 768px\)[\s\S]*?\.wj \.wj-mk-progress \{\s*display: none;/);
  // Logos inside the screen stay in the 16-24px range.
  assert.match(css, /\.wj-mk-body \.pf-logo \{\s*width: 16px;\s*height: 16px;/);
  assert.match(css, /\.wj-mk-logo \.pf-logo \{\s*width: 20px;\s*height: 20px;/);
  // Old four-box cycle CSS is gone.
  const journeyCss = await read("components/home/workflow-journey.css");
  for (const gone of [".wj-cycle", ".wj-node", ".wj-loop", ".wj-branches"])
    assert.ok(!journeyCss.includes(gone), gone);
});

test("stepper and phone are wired as buttons with names and pressed state", async () => {
  const tsx = await read(TSX);
  assert.match(tsx, /aria-pressed=\{index === stage\}/);
  assert.match(tsx, /aria-current=\{index === stage \? "step" : undefined\}/);
  assert.match(tsx, /aria-pressed=\{scene\.platform === id\}/);
  assert.match(tsx, /aria-label=\{marketingCopy\.logoButton\(getPlatformLogo\(id\)\.name\)\}/);
  // Platform buttons jump to the platform's scene.
  assert.match(tsx, /marketingScenes\.findIndex\(\(s\) => s\.platform === id\)/);
  // Loop graphic: arrow appears near the end of stage 04 and blinks row 01.
  assert.match(tsx, /scene\.duration - loopHintMs/);
  assert.match(tsx, /data-blink=\{index === 0 && showLoop && stage === 3\}/);
});

test("main journey uses the simulator and the old marketing panel is removed", async () => {
  const wj = await read("components/home/workflow-journey.tsx");
  assert.match(wj, /"journey-marketing": <JourneyMarketing \/>/);
  assert.match(wj, /import \{ JourneyMarketing \} from "\.\/journey-marketing";/);
  assert.ok(!wj.includes("MarketingBody"));
  assert.ok(!wj.includes("marketingPanel"));
  assert.equal(journeyModule.marketingPanel, undefined);
  const lib = await read("lib/home-journey.ts");
  assert.ok(!lib.includes("marketingPanel"));
  // The step lead keeps its copy and the section links stay removed.
  const step = journeyModule.journeySteps.find((s) => s.id === "journey-marketing");
  assert.equal(step.lead.split("\n").length, 2);
  for (const gone of ["통합 마케팅", "SNS 대행 운영", "SEO·AEO·GEO →"]) {
    for (const file of [TSX, LIB, "components/home/workflow-journey.tsx"])
      assert.ok(!(await read(file)).includes(gone), `${file}: ${gone}`);
  }
});

test("marketing module holds no customer data and no server-only import", async () => {
  for (const file of [TSX, LIB]) {
    const text = await read(file);
    assert.doesNotMatch(text, /home-journey-data|generated\/works|reference-review|work-catalog/, file);
    assert.ok(!text.includes("process.env"), file);
  }
  // The scene screens use no real brand name.
  const lib = await read(LIB);
  assert.doesNotMatch(lib, /힐러넷|HEALERNET|요프리|YoFree|DR's Secret|87언니/);
});
