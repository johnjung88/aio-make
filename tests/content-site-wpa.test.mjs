// P2R WP-A — 웹툰 · 애니메이션 서비스 랜딩 전용 검사.
// 공통 규칙(카피·CSS 역할 토큰·client 섬·고객 문자열)은 tests/content-site.test.mjs가 6개 서비스에 함께 적용한다.
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { contentLandings } from "../lib/content-site/index.ts";
import { webtoonSignature } from "../lib/content-site/services/webtoon.ts";
import { animationSignature } from "../lib/content-site/services/animation.ts";
import { formatWon, pricingPlans } from "../lib/content-pricing.ts";

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
  // 화면 분해 줄(웹툰 제작 12컷 10만 원 + 모션코믹 30초 7.5만 원)은 가격 파일에서만 계산한다
  const landing = code(`${WT}/landing.tsx`);
  assert.match(landing, /pricingPlans\("webtoon"\)\.groups/);
  assert.match(landing, /data-plan=\{plan\.key\}/);
  assert.doesNotMatch(landing, /\d+(\.\d)?만 원/);
});

test("A-2. 웹툰 리더: 《1억의 구단주》 cut-01..12, 첫 컷은 표지와 같은 sizes, 스크롤 영역 접근성", () => {
  for (let i = 1; i <= 12; i++)
    assert.ok(
      existsSync(join("public", "webtoon-v11", `cut-${String(i).padStart(2, "0")}.webp`)),
      `cut ${i}`,
    );
  const landing = read(`${WT}/landing.tsx`);
  // 장면 설명 12개(alt), 중복 없음
  const scenes = landing.match(/const CUTS = \[([\s\S]*?)\]\.map/)?.[1] ?? "";
  const alts = [...scenes.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  assert.equal(alts.length, 12);
  assert.equal(new Set(alts).size, 12);
  assert.match(landing, /\/webtoon-v11\/cut-\$\{String\(i \+ 1\)\.padStart\(2, "0"\)\}\.webp/);
  // 표지와 리더가 같은 sizes 상수를 쓴다(같은 /_next/image 주소)
  assert.equal((landing.match(/sizes=\{CUT_SIZES\}/g) ?? []).length, 2);
  // #reader 섹션 + 키보드로 스크롤되는 영역
  assert.match(landing, /id="reader"/);
  assert.match(landing, /href="#reader"/);
  assert.match(landing, /role="region"/);
  assert.match(landing, /tabIndex=\{0\}/);
  assert.match(landing, /aria-label=\{r\.label\}/);
  assert.match(landing, /loading="lazy"/);
  // 히어로 표지만 priority
  assert.equal((landing.match(/\bpriority\b/g) ?? []).length, 1);
  assert.equal(webtoonSignature.reader.label, "1억의 구단주 12컷 세로 보기");
});

test("A-3. 웹툰 모션코믹 영상: 소개 영상 · poster · controls · preload none · 태그", () => {
  const landing = read(`${WT}/landing.tsx`);
  assert.match(landing, /"\/videos\/webtoon-reference-v02\.mp4"/);
  assert.match(landing, /"\/videos\/webtoon-reference-poster\.jpg"/);
  assert.ok(existsSync("public/videos/webtoon-reference-v02.mp4"));
  assert.ok(existsSync("public/videos/webtoon-reference-poster.jpg"));
  const video = landing.match(/<CsMedia\s+kind="video"[\s\S]*?\/>/)?.[0] ?? "";
  assert.match(video, /\bcontrols\b/);
  assert.match(video, /preload="none"/);
  assert.match(video, /poster=/);
  assert.match(video, /tag=\{MEDIA_TAGS\.ownWebtoonVideo\}/);
  assert.doesNotMatch(video, /\bautoplay\b/);
  assert.match(landing, /<figcaption/);
  // 표지·리더 태그는 자체 웹툰 표기
  assert.equal((landing.match(/MEDIA_TAGS\.ownWebtoon\b/g) ?? []).length, 2);
});

test("A-4. 두 랜딩: 히어로 계약 · 고유 섹션 data-cs-section · 웹툰은 client 섬 0, 애니메이션은 1", () => {
  for (const dir of [WT, AN]) {
    const landing = code(`${dir}/landing.tsx`);
    assert.doesNotMatch(landing, /^\s*["']use client["']/);
    assert.match(landing, /CsHero(Copy)?\b/);
    assert.ok((landing.match(/data-cs-section="signature"/g) ?? []).length >= 2, dir);
    assert.match(landing, /aria-labelledby=/);
  }
  assert.match(code(`${AN}/landing.tsx`), /data-cs-section="hero"/);
  assert.match(code(`${AN}/landing.tsx`), /aria-labelledby=\{HERO_TITLE_ID\}/);
  const clientFiles = (dir) =>
    readdirSync(dir)
      .filter((f) => f.endsWith(".tsx"))
      .filter((f) => /^\s*["']use client["']/.test(read(join(dir, f))));
  assert.deepEqual(clientFiles(WT), []);
  assert.deepEqual(clientFiles(AN), ["before-motion.tsx"]);
});

test("A-5. 애니메이션 탭: JS 없으면 세 항목 목록, 마운트 후 APG 탭(←/→·Home·End), 숨은 사본은 heading 없음", () => {
  const tabs = code(`${AN}/before-motion.tsx`);
  assert.match(tabs, /data-mode="list"/);
  assert.match(tabs, /data-mode="tabs"/);
  assert.match(tabs, /useState\(false\)/);
  assert.match(tabs, /role="tablist"/);
  assert.match(tabs, /role="tab"/);
  assert.match(tabs, /role="tabpanel"/);
  assert.match(tabs, /aria-selected=/);
  assert.match(tabs, /aria-controls=/);
  for (const key of ["ArrowRight", "ArrowLeft", "Home", "End"]) assert.match(tabs, new RegExp(key));
  // 사본(is-sizer)은 aria-hidden이고 h3를 쓰지 않는다
  const sizer = tabs.match(/if \(sizer\)\s*return \(([\s\S]*?)\);/)?.[1] ?? "";
  assert.match(sizer, /aria-hidden="true"/);
  assert.doesNotMatch(sizer, /<h\d/);
  // 서버 데이터·전체 랜딩 데이터 import 없음, 그림은 aria-hidden + 연출 예시 태그
  assert.doesNotMatch(tabs, /from\s+["']@\/lib\/content-site["']/);
  assert.match(tabs, /cs-svc-animation-art-inner" aria-hidden="true"/);
  assert.match(tabs, /MEDIA_TAGS\.staged/);
  // 탭 3개 = 데이터 3개(이야기 · 캐릭터 · 장면 구성)
  assert.deepEqual(
    animationSignature.beforeMotion.items.map((i) => i.title),
    ["이야기", "캐릭터", "장면 구성"],
  );
  assert.equal(animationSignature.beforeMotion.frames.length, 4);
  assert.equal(animationSignature.beforeMotion.views.length, 2);
});

test("A-6. 애니메이션 미디어: 연출 예시 태그, 히어로와 그림체 첫 카드는 같은 sizes, 자산 존재", () => {
  const landing = read(`${AN}/landing.tsx`);
  for (const src of ["/creative-v06/video-animation.webp", "/renewal/animation-sample.webp"]) {
    assert.match(landing, new RegExp(`"${src.replaceAll("/", "\\/").replaceAll(".", "\\.")}"`));
    assert.ok(existsSync(join("public", src)), src);
  }
  assert.ok(existsSync("public/content-site/animation.webp"));
  const media = landing.match(/<CsMedia\b[\s\S]*?\/>/g) ?? [];
  assert.equal(media.length, 2);
  for (const m of media) assert.match(m, /tag=\{MEDIA_TAGS\.staged\}/);
  assert.equal((landing.match(/sizes: CHARACTER_SIZES|sizes=\{CHARACTER_SIZES\}/g) ?? []).length, 2);
  assert.equal((landing.match(/\bpriority\b/g) ?? []).length, 1);
  assert.equal(
    animationSignature.styles.items.length,
    (landing.match(/const STYLE_MEDIA = \[([\s\S]*?)\] as const/)?.[1].match(/src:/g) ?? []).length,
  );
});

test("A-7. 애니메이션 움직임: 후광 루프는 reduced-motion no-preference 안·축약형 animation 0·키프레임 이름 일치", () => {
  const css = code(`${AN}/animation.css`);
  const keyframes = code(`${AN}/animation.keyframes.css`);
  assert.doesNotMatch(css, /(?:^|[;\s{])animation\s*:/);
  assert.doesNotMatch(css, /@keyframes/);
  const names = [...keyframes.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]);
  assert.deepEqual(names, ["cs-svc-animation-halo"]);
  // animation-name 선언은 모두 no-preference 블록 안
  const noPref = css.match(/@media \(prefers-reduced-motion: no-preference\) \{([\s\S]*?)\n\}/)?.[1] ?? "";
  const used = [...css.matchAll(/animation-name:\s*([\w-]+)/g)].map((m) => m[1]);
  assert.deepEqual(used, ["cs-svc-animation-halo"]);
  assert.match(noPref, /animation-name:\s*cs-svc-animation-halo/);
  assert.match(code(`${AN}/landing.tsx`), /import "\.\/animation\.keyframes\.css"/);
  // 웹툰은 루프 애니메이션이 없다
  assert.doesNotMatch(code(`${WT}/webtoon.css`), /animation|@keyframes/);
});

test("A-8. 데이터: 고유 섹션 문구가 랜딩 데이터 signature와 같은 객체다", () => {
  assert.equal(contentLandings.webtoon.signature, webtoonSignature);
  assert.equal(contentLandings.animation.signature, animationSignature);
  assert.equal(webtoonSignature.cover.title, "1억의 구단주");
  assert.equal(
    webtoonSignature.motionComic.note,
    "기존 웹툰을 영상화하는 가격입니다. 웹툰을 새로 그리는 비용은 별도입니다.",
  );
});
