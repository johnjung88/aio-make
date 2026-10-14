// P2R WP-A — 웹툰 · 애니메이션 서비스 랜딩 전용 검사.
// 공통 규칙(카피·CSS 역할 토큰·client 섬·고객 문자열)은 tests/content-site.test.mjs가 6개 서비스에 함께 적용한다.
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
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
  // 금액은 #pricing(CsPricing) 한 곳에서만 보인다(VERIFY_FINAL_P2R WP-A-1): 모션코믹 섹션은 금액 0, 가격 섹션으로 링크만
  const landing = code(`${WT}/landing.tsx`);
  assert.doesNotMatch(landing, /pricingPlans|formatWon|content-pricing/);
  assert.doesNotMatch(landing, /\d+(\.\d)?만 원/);
  assert.match(landing, /href="#pricing"/);
  // 서비스 데이터(FAQ·고유 섹션)에도 금액 문장이 없다
  for (const id of ["webtoon", "animation"])
    assert.doesNotMatch(JSON.stringify(contentLandings[id]), /\d+(\.\d)?만 원(?!부터)/, id);
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
  assert.match(landing, /<figcaption/);
  // 표지·리더 태그는 자체 웹툰 표기
  assert.equal((landing.match(/MEDIA_TAGS\.ownWebtoon\b/g) ?? []).length, 2);
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
  assert.deepEqual(clientFiles(WT), []);
  assert.deepEqual(clientFiles(AN), ["before-motion.tsx"]);
});

test("A-5. 애니메이션은 캐릭터·장면·움직임의 제작 범위를 유지한다", () => {
  const landing = code(`${AN}/landing.tsx`);
  for (const label of ["캐릭터의 기준", "장면별 이미지", "움직임과 편집"])
    assert.ok(landing.includes(label), label);
  assert.doesNotMatch(landing, /from ["'][^"']*before-motion|role="tablist"|hidden=/);
});

test("A-6. 애니메이션 공개 fallback 자산과 연출 예시 표기를 유지한다", () => {
  const landing = read(`${AN}/landing.tsx`);
  for (const src of ["/creative-v06/video-animation.webp", "/renewal/animation-sample.webp"]) {
    assert.ok(existsSync(join("public", src)), src);
  }
  assert.ok(existsSync("public/content-site/animation.webp"));
  const media = landing.match(/<CsMedia\b[\s\S]*?\/>/g) ?? [];
  assert.ok(media.length >= 1);
  for (const m of media) assert.match(m, /tag=\{MEDIA_TAGS\.staged\}/);
  for (const block of media) assert.match(block, /sizes="[^"\n]*vw/);
  assert.equal((landing.match(/\bpriority\b/g) ?? []).length, 1);
  // 장면 파생본의 출처/선명도 및 공개 fallback은 실제 렌더 검증 대상
});

test("A-7. R2 애니메이션·웹툰 장식: 무한 루프 없이 정지 구도를 제공한다", () => {
  for (const [dir, file] of [[AN,"animation.css"],[WT,"webtoon.css"]]) {
    const css = code(`${dir}/${file}`);
    assert.doesNotMatch(css, /animation\s*:|animation-name|@keyframes/);
  }
  assert.doesNotMatch(code(`${AN}/landing.tsx`), /autoPlay|setInterval|keyframes\.css/);
});

test("A-8. 데이터: 고유 섹션 문구가 랜딩 데이터 signature와 같은 객체다", () => {
  assert.equal(contentLandings.webtoon.signature, webtoonSignature);
  assert.equal(contentLandings.animation.signature, animationSignature);
  assert.equal(webtoonSignature.cover.title, "1억의 구단주");
  // 모션코믹 섹션은 맡기는 방법 2개 + 가격 링크. '신규 제작은 별도' 문장은 가격 주석 한 곳에만 둔다(WP-A-1)
  assert.deepEqual(
    webtoonSignature.motionComic.ways.map((w) => w.title),
    ["웹툰과 함께 맡길 때", "모션코믹만 맡길 때"],
  );
  assert.equal("note" in webtoonSignature.motionComic, false);
  for (const id of ["webtoon", "animation"]) {
    const text = JSON.stringify(contentLandings[id]);
    assert.doesNotMatch(text, /새로 그리는 비용|신규 제작은 별도/, id);
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
    for (const title of [contentLandings[id].hero.title, contentLandings[id].types.title])
      assert.ok(title.split("\n").at(-1).replace(/\s/g, "").length >= 3, `${id}: ${title}`);
  assert.doesNotMatch(contentLandings.webtoon.hero.title, /^브랜드 이야기를/);
});
