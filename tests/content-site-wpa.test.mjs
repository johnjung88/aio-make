// P2R WP-A / R6 WP-A — 웹툰 · 애니메이션 서비스 랜딩 전용 검사.
// R6: 웹툰은 표지 컷 1장 히어로 → 12컷 3D 책 리더 → 모션코믹(영상 + 한 줄 + 맡기는 방법 2개), 애니메이션은 대표 슬롯 히어로 → 영상 레퍼런스 그리드.
// 공통 규칙(카피·CSS 역할 토큰·client 섬·고객 문자열)은 tests/content-site.test.mjs가 6개 서비스에 함께 적용한다.
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { contentLandings } from "../lib/content-site/index.ts";
import { webtoonSignature } from "../lib/content-site/services/webtoon.ts";
import { animationReferenceIds, animationSignature } from "../lib/content-site/services/animation.ts";
import { formatWon, pricingPlans, startingPrice } from "../lib/content-pricing.ts";
import { getExampleMedia, getSlot } from "../lib/content-site/example-media.ts";
import { MEDIA_TAGS } from "../lib/content-site/types.ts";

const read = (path) => readFileSync(path, "utf8");
const code = (path) =>
  read(path)
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
const WT = "components/content-site/services/webtoon";
const AN = "components/content-site/services/animation";

test("A-1. 웹툰 가격: 함께 제작 합계 = 웹툰 제작 + 모션코믹(PRICING_FINAL 8번 17.5만·30만)", () => {
  const [webtoon, motion, bundle] = pricingPlans("webtoon").groups;
  assert.deepEqual(
    bundle.plans.map((p) => formatWon(p.amount)),
    ["17.5만 원", "30만 원"],
  );
  bundle.plans.forEach((plan, i) =>
    assert.equal(
      plan.amount,
      webtoon.plans[i].amount + motion.plans[i].amount,
      `${plan.label} = ${webtoon.plans[i].option} + ${motion.plans[i].option}`,
    ),
  );
  // 금액은 #pricing(CsPricing) 한 곳에서만 보인다(VERIFY_FINAL_P2R WP-A-1): 모션코믹 섹션은 금액 0
  const landing = code(`${WT}/landing.tsx`);
  assert.doesNotMatch(landing, /pricingPlans|formatWon|content-pricing/);
  assert.doesNotMatch(landing, /\d+(\.\d)?만 원/);
  // R6: 모션코믹 섹션에는 가격 링크도 없다(가격은 공통 #pricing 한 곳)
  assert.doesNotMatch(landing, /href="#pricing"/);
  assert.equal("priceLink" in webtoonSignature.motionComic, false);
  // 서비스 데이터(FAQ·고유 섹션)에도 금액 문장이 없다
  for (const id of ["webtoon", "animation"])
    assert.doesNotMatch(JSON.stringify(contentLandings[id]), /\d+(\.\d)?만 원(?!부터)/, id);
});

test("A-1b. 웹툰 가격 표시: 히어로 한 줄과 12컷|24컷 한 줄 2칸 그룹 3개(순서·금액 정본)", () => {
  // 히어로 가격 한 줄(BRIEF_R6 5절): 보조 문장 없음, 금액은 정본 첫 플랜
  const price = startingPrice("webtoon", true);
  assert.equal(price.line, "12컷 10만 원부터 · 부가세 별도");
  assert.equal(price.amount, pricingPlans("webtoon").groups[0].plans[0].amount);
  assert.equal(price.note, undefined);
  assert.doesNotMatch(read("lib/content-pricing.ts"), /모션코믹 영상화 옵션/);
  // 그룹 3개 순서 · 금액 그대로, 그룹마다 플랜 2개 → 공통 격자가 360px부터 2열이라 390px에서도 한 줄 2칸
  const groups = pricingPlans("webtoon").groups;
  assert.deepEqual(groups.map((g) => g.title), ["웹툰 제작", "모션코믹", "함께 제작"]);
  assert.deepEqual(
    groups.map((g) => g.plans.map((p) => p.amount)),
    [
      [100000, 180000],
      [75000, 120000],
      [175000, 300000],
    ],
  );
  for (const g of groups) assert.equal(g.plans.length, 2, g.key);
  const theme = code("components/content-site/theme.css");
  assert.match(
    theme,
    /@media \(min-width: 360px\) \{\s*\.cs-site \.cs-pricing-grid\[data-count="2"\] \{\s*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/,
  );
  // 박스 안 라벨·금액은 왼쪽 정렬(공통 .cs-plan)
  const plan = theme.match(/\.cs-site \.cs-plan \{[^}]*\}/)?.[0] ?? "";
  assert.match(plan, /align-items: flex-start;/);
  assert.doesNotMatch(plan, /text-align:\s*center/);
  // 서비스 CSS가 가격 박스를 건드리지 않는다
  assert.doesNotMatch(code(`${WT}/webtoon.css`), /cs-plan|cs-pricing/);
  assert.doesNotMatch(code(`${AN}/animation.css`), /cs-plan|cs-pricing/);
});

test("A-2. 웹툰 리더: 《1억의 구단주》 cut-01..12 슬롯, 표지·리더 같은 sizes, 3D 넘김 리더 접근성", () => {
  for (let i = 1; i <= 12; i++)
    assert.ok(
      existsSync(join("public", "webtoon-v11", `cut-${String(i).padStart(2, "0")}.webp`)),
      `cut ${i}`,
    );
  // R5: 컷 경로·설명은 example-media 슬롯 webtoon-cut-1..12 한 곳(교체는 한 줄)
  const cuts = getExampleMedia("webtoon", "cut");
  assert.deepEqual(cuts.map((c) => c.id), Array.from({ length: 12 }, (_, i) => `webtoon-cut-${i + 1}`));
  assert.deepEqual(cuts.map((c) => c.src), Array.from({ length: 12 }, (_, i) => `/webtoon-v11/cut-${String(i + 1).padStart(2, "0")}.webp`));
  assert.equal(new Set(cuts.map((c) => c.alt)).size, 12);
  for (const cut of cuts) assert.equal(cut.label, MEDIA_TAGS.ownWebtoon, cut.id);
  assert.throws(() => getSlot("webtoon-key-1"), /webtoon-key-1/, "R6: 표지는 컷 1을 쓰므로 key 슬롯 삭제");
  const landing = read(`${WT}/landing.tsx`);
  assert.match(landing, /getExampleMedia\("webtoon", "cut"\)/);
  // 표지·리더가 같은 sizes 상수를 쓴다(같은 /_next/image 주소). 스크롤 펼침은 없다
  assert.equal((landing.match(/sizes=\{CUT_SIZES\}/g) ?? []).length, 2);
  assert.match(landing, /id="reader"/);
  assert.match(landing, /label=\{r\.label\}/);
  assert.equal(webtoonSignature.reader.label, "1억의 구단주 12컷 넘겨 보기");
  assert.equal(webtoonSignature.reader.title, "12컷 한 회를\n직접 넘겨보세요");
  // 리더: 키보드 영역 · 버튼 · 스와이프(pan-y) · 3D 넘김(책등 기준 rotateY) · 전체 이어 읽기
  const ui = read(`${WT}/webtoon-experience.tsx`);
  assert.match(ui, /role="region"/);
  assert.match(ui, /tabIndex=\{0\}/);
  assert.match(ui, /aria-label="이전 컷"/);
  assert.match(ui, /aria-label="다음 컷"/);
  assert.match(ui, /onTouchStart/);
  assert.match(ui, /aria-live="polite"/);
  assert.match(ui, /<details/);
  assert.match(ui, /loading="lazy"/);
  // R6: 표지에서 리더로 가는 "12컷 넘겨 읽기" 링크는 없다
  assert.doesNotMatch(ui, /href="#reader"|넘겨 읽기/);
  const css = code(`${WT}/webtoon.css`);
  assert.match(css, /\.cs-svc-webtoon-book-stage \{[^}]*perspective:[^}]*touch-action: pan-y/);
  assert.match(css, /\.cs-svc-webtoon-page \{[^}]*transform-origin: left center/);
  assert.match(css, /\[data-state="flipped"\] \{ transform: rotateY\(-180deg\); \}/);
  assert.match(css, /backface-visibility: hidden/);
  assert.match(css, /@keyframes cs-svc-webtoon-sweep/);
  // 책은 열의 왼쪽 선에서 시작한다(가운데 정렬 없음)
  assert.doesNotMatch(css.match(/\.cs-svc-webtoon \.cs-svc-webtoon-book \{[^}]*\}/)?.[0] ?? "", /margin-inline: auto/);
  // 히어로 표지(서버가 그리는 컷 1장)만 priority, client 리더에는 없다
  assert.equal((code(`${WT}/webtoon-experience.tsx`).match(/\bpriority\b/g) ?? []).length, 0);
  assert.equal((code(`${WT}/landing.tsx`).match(/\bpriority\b/g) ?? []).length, 1);
});

test("A-2b. 웹툰 히어로: 표지 컷 1장만(캡션·링크·부채 없음), 읽기 → 모션코믹 순서, 스크롤 펼침 삭제", () => {
  const data = contentLandings.webtoon;
  assert.equal(data.hero.eyebrow, "WEBTOON");
  assert.equal(data.hero.title, "제품의 이야기를\n웹툰 한 편으로");
  assert.equal(
    data.hero.lead,
    "제품을 만나는 순간부터 사용하는 장면까지 12컷·24컷 이야기로 엮어 컷별 이미지로 전달합니다",
  );
  const landing = code(`${WT}/landing.tsx`);
  const hero = landing.match(/function Hero[\s\S]*?\n\}\n/)?.[0] ?? "";
  assert.match(hero, /<ServiceHero/);
  assert.equal((hero.match(/<CsMedia/g) ?? []).length, 1);
  assert.match(hero, /ratio="2x3"/);
  assert.match(hero, /CUTS\[0\]/);
  assert.match(hero, /tag=\{MEDIA_TAGS\.ownWebtoon\}/);
  assert.doesNotMatch(hero, /figcaption|<h2|<a |cs-link/);
  assert.doesNotMatch(landing, /WebtoonCover|WebtoonUnfold|Unfold/);
  // Signature 순서: Reader → MotionComic
  const signature = landing.match(/function Signature[\s\S]*?\n\}\n/)?.[0] ?? "";
  assert.ok(signature.indexOf("<Reader") > -1 && signature.indexOf("<Reader") < signature.indexOf("<MotionComic"));
  assert.equal((landing.match(/data-cs-section="signature"/g) ?? []).length, 2);
  // 펼침 관련 데이터·소스·CSS 삭제
  assert.equal("unfold" in webtoonSignature, false);
  assert.equal("cover" in webtoonSignature, false);
  const all = `${read(`${WT}/webtoon-experience.tsx`)}\n${read(`${WT}/webtoon.css`)}\n${read("lib/content-site/services/webtoon.ts")}`;
  assert.doesNotMatch(all, /unfold|WebtoonCover|useMotionProgress/i);
  // 죽은 CSS 계열(표지 카드·캡션·폰 틀·스크롤 틀·글로우·칩·스크롤 색)
  assert.doesNotMatch(
    code(`${WT}/webtoon.css`),
    /cover-card|cover-caption|cover-media|-phone|-scroll|-glow|-chip|scroll-thumb|svc-cover-/,
  );
  assert.doesNotMatch(landing, /cs-section--alt/);
  // 읽기 섹션은 칩·힌트를 두지 않는다
  assert.deepEqual(Object.keys(webtoonSignature.reader), ["eyebrow", "title", "lead", "label"]);
  // 웹툰 부채(공통 모션의 떠오름·벌어짐)는 삭제됐으므로 표지 보호 규칙과 부채 규칙이 모두 없다
  assert.doesNotMatch(code(`${WT}/webtoon.css`), /animation-name: none/);
  const motionCss = code("components/content-site/services/service-motion.css");
  assert.doesNotMatch(motionCss, /webtoon-fan|data-motion-variant="webtoon"|data-panel|cs-float/);
  assert.doesNotMatch(code("components/content-site/services/service-editorial.css"), /svc-webtoon-cover|data-feed-index|cs-service-sequence|plan-compare/);
});

test("A-3. 웹툰 모션코믹 영상: 소개 영상 · poster · controls · preload none · 태그, 캡션 없음", () => {
  const landing = read(`${WT}/landing.tsx`);
  assert.match(landing, /"\/videos\/webtoon-reference-v02\.mp4"/);
  // poster는 영상 속 《1억의 구단주》 장면 프레임(로고 엔드카드 jpg는 메인 사이트용으로 남긴다)
  assert.match(landing, /poster: "\/webtoon-v11\/motion-comic-poster\.webp"/);
  assert.doesNotMatch(code(`${WT}/landing.tsx`), /webtoon-reference-poster/);
  assert.ok(existsSync("public/videos/webtoon-reference-v02.mp4"));
  assert.equal(
    createHash("sha256").update(readFileSync("public/webtoon-v11/motion-comic-poster.webp")).digest("hex"),
    "83933fce9da7b4ab80cba45abf36580da6561c3d48a961df754faf12f81fb305",
  );
  const video = landing.match(/<CsMedia\s+kind="video"[\s\S]*?\/>/)?.[0] ?? "";
  assert.match(video, /\bcontrols\b/);
  assert.match(video, /preload="none"/);
  assert.match(video, /poster=/);
  assert.match(video, /tag=\{MEDIA_TAGS\.ownWebtoonVideo\}/);
  assert.doesNotMatch(video, /\bautoplay\b/);
  // R6: 태그가 캡션을 대신한다(같은 사실을 두 번 쓰지 않는다). 한 줄 설명은 섹션 lead 하나
  assert.doesNotMatch(landing, /<figcaption/);
  assert.equal("caption" in webtoonSignature.motionComic, false);
  // 표지·리더 태그는 자체 웹툰 표기
  assert.equal((landing.match(/MEDIA_TAGS\.ownWebtoon\b/g) ?? []).length, 2);
  // 맡기는 방법 2개는 텍스트(번호 칩 없음), 위 가는 선만 쓰고 박스 장식은 없다
  assert.equal(webtoonSignature.motionComic.ways.length, 2);
  const css = code(`${WT}/webtoon.css`);
  assert.doesNotMatch(css, /way-num/);
  const way = css.match(/\.cs-svc-webtoon \.cs-svc-webtoon-way \{[^}]*\}/)?.[0] ?? "";
  assert.match(way, /border-top: 1px solid var\(--cs-line\)/);
  assert.doesNotMatch(way, /background|border-radius|box-shadow/);
});

test("A-4. 두 랜딩은 서버에서 작품을 렌더하고 기존 client 경계를 유지한다", () => {
  for (const dir of [WT, AN]) {
    const landing = code(`${dir}/landing.tsx`);
    assert.doesNotMatch(landing, /^\s*["']use client["']/);
    assert.match(landing, /ServiceHero\b/);
    assert.ok((landing.match(/data-cs-section="signature"/g) ?? []).length >= 1, dir);
    assert.match(landing, /aria-labelledby=/);
  }
  // 히어로 DOM·모바일 순서·실제 작품 게이트는 브라우저 OFF/ON에서 검증한다
  const clientFiles = (dir) =>
    readdirSync(dir)
      .filter((f) => f.endsWith(".tsx"))
      .filter((f) => /^\s*["']use client["']/.test(read(join(dir, f))));
  // R6: 웹툰 client 섬은 webtoon-experience.tsx(리더) 하나, 애니메이션은 client 파일이 없다(공용 LoopVideo만 쓴다)
  assert.deepEqual(clientFiles(WT), ["webtoon-experience.tsx"]);
  assert.deepEqual(clientFiles(AN), []);
  assert.equal(existsSync(`${AN}/before-motion.tsx`), false);
});

test("A-5. 애니메이션: 영상 레퍼런스 영역(16:9 슬롯 그리드, 채워진 슬롯만, 빈 면 한 줄)과 삭제 항목", () => {
  const landing = code(`${AN}/landing.tsx`);
  // 레퍼런스: 슬롯 id 목록 → getSlot → src가 있는 슬롯만 렌더, 칸마다 ExampleFigure(영상은 src + poster, 이미지는 정지 화면)
  assert.match(landing, /animationReferenceIds\.map\(\(id\) => getSlot\(id\)\)\.filter\(\(slot\) => slot\.src\.trim\(\) !== ""\)/);
  assert.match(landing, /REFERENCES\.length > 0/);
  assert.match(landing, /<ul className="cs-svc-animation-refs"/);
  assert.match(landing, /<ExampleFigure className="cs-svc-animation-ref" slot=\{slot\}/);
  assert.match(landing, /cs-svc-animation-empty/);
  assert.match(landing, /\{r\.empty\}/);
  assert.equal(animationSignature.reference.empty, "영상 레퍼런스를 순서대로 추가합니다");
  // 삭제: 스크롤 고정 구간 · 제작 메모 · 검토판 대표 작품 · 숨 쉬는 링
  assert.doesNotMatch(landing, /WorkSequence|ProductionNotes|FeaturedWork|selectContentWorks/);
  assert.doesNotMatch(landing, /캐릭터의 기준|장면별 이미지|움직임과 편집/);
  assert.doesNotMatch(landing, /from ["'][^"']*before-motion|role="tablist"|hidden=/);
  const css = code(`${AN}/animation.css`);
  assert.doesNotMatch(css, /halo|hop|::after|::before|hero-board|style-list|plan-list/);
  // 그리드: 모바일 1열, 768부터 2열, 칸 비율은 슬롯 비율과 관계없이 16:9
  assert.match(css, /\.cs-svc-animation-refs \{[^}]*grid-template-columns: minmax\(0, 1fr\);/);
  assert.match(css, /@media \(min-width:768px\) \{\s*\.cs-svc-animation \.cs-svc-animation-refs \{\s*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/);
  assert.match(css, /\.cs-svc-animation-ref\.cs-example-figure\[data-aspect\] \.cs-example-frame \{\s*aspect-ratio: 16 \/ 9;/);
  assert.match(css, /\.cs-svc-animation-empty \{[^}]*aspect-ratio: 16 \/ 9;/);
  // 시작 목록: 연출 예시 장면 3장, 모두 채워져 있고 같은 표기
  assert.deepEqual([...animationReferenceIds], ["animation-scene-1", "animation-scene-2", "animation-scene-3"]);
  for (const id of animationReferenceIds) {
    const slot = getSlot(id);
    assert.equal(slot.aspect, "16x9", id);
    assert.equal(slot.label, MEDIA_TAGS.staged, id);
    assert.notEqual(slot.src.trim(), "", id);
    assert.ok(existsSync(join("public", slot.src)), slot.src);
    if (slot.kind === "video") assert.ok(slot.poster, `${id} video has poster`);
  }
  // 섹션: 히어로 다음 레퍼런스(signature) 한 개
  assert.equal((landing.match(/data-cs-section="signature"/g) ?? []).length, 1);
  // 히어로: 텍스트 + 대표 슬롯 1개, 가격 한 줄
  assert.match(landing, /slot=\{getSlot\("animation-hero-1"\)\}/);
  assert.equal((landing.match(/<ServiceHero/g) ?? []).length, 1);
  assert.equal(contentLandings.animation.hero.title, "캐릭터와 장면을\n움직이는 영상으로");
  assert.equal(startingPrice("animation", true).line, "30만 원부터 · 30초 기준 · 부가세 별도");
  assert.deepEqual(pricingPlans("animation").groups[0].plans.map((p) => p.amount), [300000, 550000]);
});

test("A-6. 애니메이션 공개판: 대표 슬롯과 레퍼런스 장면을 연출 예시 슬롯으로 채운다", () => {
  const landing = code(`${AN}/landing.tsx`);
  assert.match(landing, /getSlot\("animation-hero-1"\)/);
  assert.equal((landing.match(/\bpriority\b/g) ?? []).length, 1);
  const scenes = getExampleMedia("animation", "scene");
  assert.deepEqual(scenes.map((s) => s.id), ["animation-scene-1", "animation-scene-2", "animation-scene-3"]);
  // 레퍼런스 목록은 example-media 장면 슬롯과 같은 순서다
  assert.deepEqual([...animationReferenceIds], scenes.map((s) => s.id));
  for (const slot of [...scenes, getSlot("animation-hero-1")]) {
    assert.ok(existsSync(join("public", slot.src)), slot.src);
    assert.equal(slot.label, MEDIA_TAGS.staged, slot.id);
    assert.match(slot.alt, /연출 예시$/, slot.id);
  }
  for (const src of ["/creative-v06/video-animation.webp", "/renewal/animation-sample.webp"])
    assert.ok(existsSync(join("public", src)), src);
  // 고객 작품은 이 랜딩 코드에 없다(공통 CsWorks 목록으로만)
  assert.doesNotMatch(read(`${AN}/landing.tsx`), /yofree|요프리|night-motion/i);
});

test("A-7. 움직임: 웹툰 루프·전환은 no-preference 안에서만, 애니메이션 CSS에는 자체 루프가 없다", () => {
  const wt = code(`${WT}/webtoon.css`);
  assert.match(wt, /@keyframes cs-svc-/, "webtoon.css");
  assert.doesNotMatch(wt, /(?:^|[;\s{])animation\s*:/, "webtoon shorthand");
  const an = code(`${AN}/animation.css`);
  assert.doesNotMatch(an, /@keyframes|(?:^|[;\s{])animation[-\w]*\s*:|transition/, "animation.css has no motion of its own");
  // 리더는 화면 밖 data-play, 스크롤 고정 구간(pin)은 쓰지 않는다
  const ui = read(`${WT}/webtoon-experience.tsx`);
  assert.match(ui, /useInViewPlay\(stage/);
  assert.doesNotMatch(ui, /mode: "pin"|useMotionProgress/);
  assert.doesNotMatch(code(`${AN}/landing.tsx`), /autoPlay|setInterval|keyframes\.css/);
  // 두 서비스 CSS에 스크롤 고정(sticky)·긴 vh 구간이 없다
  assert.doesNotMatch(wt, /sticky|\d+vh/);
  assert.doesNotMatch(an, /sticky|\d+vh/);
});

test("A-8. 데이터: 고유 섹션 문구가 랜딩 데이터 signature와 같은 객체다", () => {
  assert.equal(contentLandings.webtoon.signature, webtoonSignature);
  assert.equal(contentLandings.animation.signature, animationSignature);
  // 모션코믹 섹션은 영상 + 한 줄 + 맡기는 방법 2개. '신규 제작은 별도' 문장은 가격 주석 한 곳에만 둔다(WP-A-1)
  assert.deepEqual(
    webtoonSignature.motionComic.ways.map((w) => w.title),
    ["웹툰과 함께 맡길 때", "모션코믹만 맡길 때"],
  );
  assert.equal("note" in webtoonSignature.motionComic, false);
  // 죽은 데이터 삭제: 그림체 3종 · 움직이기 전 확인 탭은 더 이상 없다
  assert.deepEqual(Object.keys(animationSignature), ["reference"]);
  assert.ok(animationSignature.reference.title.split("\n").at(-1).length >= 3);
  for (const id of ["webtoon", "animation"]) {
    const text = JSON.stringify(contentLandings[id]);
    assert.doesNotMatch(text, /새로 그리는 비용|신규 제작은 별도/, id);
    assert.doesNotMatch(text, /styles|beforeMotion|BEFORE MOTION|CUT BY CUT/, id);
  }
  // 한 페이지 안에서 같은 문장(마침표로 끝나는 문장)이 두 번 나오지 않는다(서비스 데이터 범위, 칩·제목 제외)
  for (const id of ["webtoon", "animation"]) {
    const all = [];
    const walk = (v) =>
      typeof v === "string"
        ? all.push(...v.split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter((s) => /[.?!]$/.test(s) && s.length > 4))
        : Array.isArray(v)
          ? v.forEach(walk)
          : v && typeof v === "object"
            ? Object.values(v).forEach(walk)
            : null;
    walk(contentLandings[id]);
    const seen = new Set();
    for (const s of all) {
      assert.ok(!seen.has(s), `${id} repeats: ${s}`);
      seen.add(s);
    }
  }
  // 줄바꿈 제목의 마지막 줄은 3글자 이상(WP-A-4), 웹툰 h1은 브랜드 홍보 영상 h1과 같은 구절로 시작하지 않는다(WP-A-6)
  for (const id of ["webtoon", "animation"])
    for (const title of [contentLandings[id].hero.title])
      assert.ok(title.split("\n").at(-1).replace(/\s/g, "").length >= 3, `${id}: ${title}`);
  assert.doesNotMatch(contentLandings.webtoon.hero.title, /^브랜드 이야기를/);
});
