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
  assert.match(hero, /CUTS\[COVER\]/);
  // R-3: 표지 컷은 리더 첫 장(컷 1)과 다른 컷이다
  assert.match(landing, /const COVER = 3;/);
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
  // R-3: 바로 위 히어로와 같은 이미지(src)를 쓰는 슬롯은 그리드에서 뺀다
  assert.match(landing, /animationReferenceIds\s*\.map\(\(id\) => getSlot\(id\)\)\s*\.filter\(\(slot\) => slot\.src\.trim\(\) !== "" && slot\.src !== HERO_SLOT\.src\)/);
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
  assert.match(landing, /const HERO_SLOT = getSlot\("animation-hero-1"\)/);
  assert.match(landing, /slot=\{HERO_SLOT\}/);
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

/* ------------------------------------------------------------------------------------------
 * R7 WP-4 — 푸터(모바일 가운데) · 하단 상담 바(모바일 전용·서비스색·가운데 묶음) · 함께 제작 가격 박스
 * ------------------------------------------------------------------------------------------ */
const THEME_CSS = "components/content-site/theme.css";
const SERVICES = ["webtoon", "animation", "ai-influencer", "motion-graphics", "brand-film", "ad"];
/** 중괄호 짝을 맞춰 `@media (query) { ... }` 본문을 모두 돌려준다 */
function mediaBody(css, query) {
  const out = [];
  let from = 0;
  while ((from = css.indexOf(`@media ${query}`, from)) >= 0) {
    const open = css.indexOf("{", from);
    let depth = 0;
    let i = open;
    for (; i < css.length; i++) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}" && --depth === 0) break;
    }
    out.push(css.slice(open + 1, i));
    from = i;
  }
  return out.join("\n");
}
const rgb = (hex) => hex.slice(1).match(/../g).map((h) => parseInt(h, 16));
const lum = ([r, g, b]) =>
  [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const mix = (accent, share, base) => accent.map((v, i) => v * share + base[i] * (1 - share));
const serviceTokens = (css, id) => {
  const start = css.indexOf(`.cs-site[data-cs-service="${id}"] {`);
  const block = start < 0 ? "" : css.slice(start, css.indexOf("}", start));
  const pick = (name) => block.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "i"))?.[1];
  return { accent: pick("cs-accent"), accentText: pick("cs-accent-text"), onAccent: pick("cs-on-accent") };
};

test("R7-1. 푸터: 767px 이하만 가운데, 768px 이상은 왼쪽 다열, 링크 글자 15px 이상", () => {
  const theme = code(THEME_CSS);
  const mobile = mediaBody(theme, "(max-width: 767px)");
  assert.match(mobile, /\.cs-site \.cs-footer \{[^}]*text-align:\s*center;/);
  assert.match(mobile, /\.cs-footer-col \{[^}]*align-items:\s*center;/);
  assert.match(mobile, /\.cs-footer-links--services \{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/, "service links: 2-column grid");
  assert.match(mobile, /\.cs-footer-legal \{[^}]*justify-content:\s*center/);
  // 가운데 정렬은 미디어 밖과 768px 이상 어디에도 없다
  const outside = theme.replace(/@media \(max-width: 767px\) \{(?:[^{}]|\{[^{}]*\})*\}/g, "");
  assert.doesNotMatch(outside.match(/\/\* -+ 푸터[\s\S]*?모바일 하단 바/)?.[0] ?? "", /text-align:\s*center|align-items:\s*center;\s*\n\s*gap:\s*var\(--cs-s3\)/);
  for (const q of ["(min-width: 768px)", "(min-width: 1024px)", "(min-width: 1440px)"])
    assert.doesNotMatch(mediaBody(theme, q).match(/\.cs-footer[^{]*\{[^}]*\}/g)?.join("") ?? "", /text-align:\s*center/, q);
  // 768~1023은 왼쪽 2열(브랜드 / 서비스·연락처)
  assert.match(mediaBody(theme, "(min-width: 768px) and (max-width: 1023px)"), /\.cs-col-5 \{[^}]*grid-column:\s*1 \/ 4/);
  // 글자: 링크 16 / 1024px 15 / 1440px 16, 소개 15, 사업자·법적 줄 14, 헤딩 13
  const footer = theme.match(/\.cs-site \.cs-footer \{[^}]*--cs-t-nav-size:[^}]*\}/)?.[0] ?? "";
  assert.match(footer, /--cs-t-nav-size:\s*16px/);
  assert.match(footer, /--cs-t-caption-size:\s*14px/);
  assert.match(footer, /--cs-t-eyebrow-size:\s*13px/);
  assert.match(mediaBody(theme, "(min-width: 1024px)"), /\.cs-footer \{ --cs-t-nav-size: 15px; \}/);
  assert.match(mediaBody(theme, "(min-width: 1440px)"), /\.cs-footer \{ --cs-t-nav-size: 16px; \}/);
  assert.match(theme, /\.cs-footer-intro \{[^}]*--cs-t-small-size:\s*15px/);
  const footerTsx = code("components/content-site/shell/footer.tsx");
  assert.match(footerTsx, /cs-footer-links cs-footer-links--services/);
  assert.match(footerTsx, /cs-footer-intro cs-t-small/);
  // 서비스 페이지 하단 바 높이만큼 푸터 아래 여백은 유지한다
  assert.match(mobile, /data-cs-page="service"\] \.cs-footer \{[^}]*var\(--cs-mbar-h\)/);
});

test("R7-2. 하단 상담 바: 모바일 전용, 가운데 한 묶음, 서비스 포인트색, 대비 4.5 이상", () => {
  const theme = code(THEME_CSS);
  // 기본은 숨김, 표시는 767px 이하 미디어 안에서만. 768px 이상 미디어에는 .cs-mbar 규칙이 없다
  assert.match(theme, /\.cs-site \.cs-mbar \{\s*display:\s*none;\s*\}/);
  const mobile = mediaBody(theme, "(max-width: 767px)");
  const bar = mobile.match(/\.cs-site \.cs-mbar \{[^}]*\}/)?.[0] ?? "";
  assert.match(bar, /position:\s*fixed/);
  assert.match(bar, /display:\s*flex/);
  assert.match(bar, /justify-content:\s*center/);
  assert.match(bar, /background:\s*color-mix\(in srgb, var\(--cs-accent\) 22%, var\(--cs-bg\)\)/);
  assert.match(bar, /border-top:\s*1px solid color-mix\(in srgb, var\(--cs-accent\) 45%, transparent\)/);
  for (const q of ["(min-width: 768px)", "(min-width: 1024px)", "(min-width: 1440px)"])
    assert.doesNotMatch(mediaBody(theme, q), /\.cs-mbar/, `${q} has no bottom bar rule`);
  // 텍스트가 남는 폭을 모두 차지해 버튼을 오른쪽 끝으로 미는 flex:1 이 없다
  assert.doesNotMatch(theme.match(/\.cs-site \.cs-mbar-text \{[^}]*\}/)?.[0] ?? "", /flex:\s*1 1 auto/);
  assert.match(theme, /\.cs-site \.cs-mbar \.cs-btn \{[^}]*background:\s*var\(--cs-accent\);[^}]*color:\s*var\(--cs-on-accent\)/);
  assert.match(theme, /\.cs-site \.cs-mbar-text \.cs-t-caption \{[^}]*color:\s*var\(--cs-accent-text\)/);
  // 6서비스 모두: 버튼(on-accent/accent), 서비스명(accent-text), 시작가·기본 글자(fg #f7f5f2)가 22% 바탕 위에서 4.5 이상
  const base = rgb("#080808");
  const fg = rgb("#f7f5f2");
  for (const id of SERVICES) {
    const { accent, accentText, onAccent } = serviceTokens(theme, id);
    assert.ok(accent && accentText && onAccent, `${id} tokens`);
    const bg = mix(rgb(accent), 0.22, base);
    assert.ok(contrast(rgb(onAccent), rgb(accent)) >= 4.5, `${id} button ${contrast(rgb(onAccent), rgb(accent)).toFixed(2)}`);
    assert.ok(contrast(rgb(accentText), bg) >= 4.5, `${id} service name`);
    assert.ok(contrast(fg, bg) >= 4.5, `${id} price`);
  }
  // 컴포넌트: 모든 서비스에 같은 바(서비스 페이지에서만), 문구는 CS_COPY
  const tsx = code("components/content-site/shell/mobile-bar.tsx");
  assert.match(tsx, /if \(!serviceId\) return null;/);
});

test("R7-3. 웹툰 함께 제작: 보라 외곽 박스 1개 · 알약 배지 0 · 두 금액 같은 행 · 외곽 최대 폭 880", () => {
  const theme = code(THEME_CSS);
  const tsx = code("components/content-site/blocks/pricing.tsx");
  assert.doesNotMatch(tsx + theme, /cs-pricing-badge/);
  assert.equal((tsx.match(/cs-pricing-group--bundle/g) ?? []).length, 1);
  assert.match(tsx, /data-count=\{Math\.min\(group\.plans\.length, 4\)\}/);
  // 그룹 제목은 외곽 박스 안에 한 번(h3는 칸마다 라벨 1개)
  assert.equal((tsx.match(/className="cs-pricing-title /g) ?? []).length, 1);
  const outer = theme.match(/\.cs-site \.cs-pricing-group--bundle \{[^}]*\}/)?.[0] ?? "";
  assert.match(outer, /border:\s*1px solid var\(--cs-accent\)/);
  assert.match(outer, /background:\s*color-mix\(in srgb, var\(--cs-accent\) 14%, transparent\)/);
  assert.match(outer, /border-radius:\s*var\(--cs-r-md\)/);
  // 안쪽 칸: 개별 테두리 없음, 가운데 세로선은 간격 한가운데 1px
  const cell = theme.match(/\.cs-site \.cs-plan--bundle \{[^}]*\}/)?.[0] ?? "";
  assert.match(cell, /border:\s*0/);
  assert.match(theme, /\.cs-plan--bundle \+ \.cs-plan--bundle::before \{[^}]*width:\s*1px/);
  // 두 금액은 같은 행의 아래쪽에 붙는다(라벨 줄 수와 관계없이 y 동일), 2개 플랜 그룹은 최대 폭 880
  assert.match(theme, /\.cs-site \.cs-plan-amount \{[^}]*margin-top:\s*auto/);
  assert.match(theme, /\.cs-site \.cs-pricing-group\[data-count="2"\] \{[^}]*max-width:\s*880px/);
  // 금액·순서는 PRICING_FINAL 그대로
  assert.deepEqual(
    pricingPlans("webtoon").groups.map((g) => g.title),
    ["웹툰 제작", "모션코믹", "함께 제작"],
  );
});

test("R7-fix1. 푸터: 768~1023 서비스 열 간격, 768px 이상 사업자 정보 가로 흐름과 높이 목표 간격", () => {
  const theme = code(THEME_CSS);
  // 768~1023: 2열 격자에 열 간격이 있어 "브랜드 홍보 영상"과 "SNS 광고 영상"이 붙지 않는다(24px 이상)
  const tablet = mediaBody(theme, "(min-width: 768px) and (max-width: 1023px)");
  assert.match(tablet, /\.cs-footer-links--services \{[^}]*column-gap:\s*var\(--cs-s6\)/);
  // 768px 이상: 위 여백 48, 사업자 정보는 줄바꿈 가로 흐름, 아래 블록 간격 48 (높이 640/600/600 이내)
  const wide = mediaBody(theme, "(min-width: 768px)");
  assert.match(wide, /\.cs-site \.cs-footer \{ padding-block: 48px var\(--cs-s7\); \}|\.cs-site \.cs-footer \{\s*padding-block:\s*48px var\(--cs-s7\);/);
  assert.match(wide, /\.cs-footer-biz \{[^}]*display:\s*flex;[^}]*flex-wrap:\s*wrap;/);
  assert.match(wide, /\.cs-footer-bottom \{ margin-top: 48px; \}/);
  // 링크 글자는 줄이지 않는다
  assert.match(mediaBody(theme, "(min-width: 1024px)"), /\.cs-footer \{ --cs-t-nav-size: 15px; \}/);
});
