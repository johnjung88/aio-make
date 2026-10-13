import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  SHOW_STARTING_PRICE,
  contentHomeCta,
  contentHomeHero,
  contentHomeProcess,
  contentHomeProcessHead,
  contentHomeServices,
  contentHomeServicesHead,
  contentPricing,
  formatWon,
  startingPrice,
} from "../lib/content-home.ts";
import { divisions, services } from "../lib/content.ts";

const REQUIRED =
  "웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상";
const ORDER = [
  "webtoon",
  "animation",
  "ai-influencer",
  "motion-graphics",
  "brand-film",
  "ad",
];
const read = (path) => readFileSync(path, "utf8");
const componentDir = "components/content-home";
const componentFiles = readdirSync(componentDir).map((f) =>
  join(componentDir, f),
);
const sources = [...componentFiles, "lib/content-home.ts"].map((path) => ({
  path,
  text: read(path),
}));

/* 화면에 쓰이는 카피 문자열과 그 성격(한 문장 / 여러 문장 / 제목) */
const single = [
  contentHomeHero.eyebrow,
  contentHomeHero.lead,
  contentHomeHero.button,
  contentHomeHero.tag,
  contentHomeHero.image.alt,
  contentHomeServicesHead.lead,
  contentHomeServicesHead.toggle,
  contentHomeServicesHead.detailLink,
  contentHomeProcessHead.outputLabel,
  contentHomeCta.button,
  ...contentHomeServices.flatMap((s) => [
    s.label,
    s.kicker,
    s.line,
    s.imageTag,
    s.alt,
    ...s.uses,
    ...(s.scopeNote ? [s.scopeNote] : []),
  ]),
  ...contentHomeProcess.flatMap((s) => [s.label, s.title, s.output]),
];
const multi = [
  contentHomeServicesHead.note,
  contentHomeProcessHead.lead,
  contentHomeCta.lead,
  ...contentHomeServices.map((s) => s.description),
  ...contentHomeProcess.map((s) => s.body),
];
const h1 = [contentHomeHero.title];
const h2 = [
  contentHomeServicesHead.title,
  contentHomeProcessHead.title,
  contentHomeCta.title,
];
const allCopy = [...single, ...multi, ...h1, ...h2];
const sentences = (text) =>
  text
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

test("1. 서비스 6종 순서·라벨·링크·이미지", () => {
  assert.deepEqual(
    contentHomeServices.map((s) => s.id),
    ORDER,
  );
  assert.equal(contentHomeServices.map((s) => s.label).join(" · "), REQUIRED);
  for (const s of contentHomeServices) {
    assert.ok(
      services.some((x) => x.id === s.id && x.division === "video"),
      `${s.id} is a video service in lib/content.ts`,
    );
    assert.equal(s.href, `/content/services/${s.id}`);
    assert.ok(existsSync(join("public", s.image)), `${s.image} exists`);
    assert.equal(s.uses.length, 3);
  }
  assert.ok(existsSync(join("public", contentHomeHero.image.src)));
});

test("2. 시작가는 PRICING_FINAL 정본 값과 정확히 같다", () => {
  const expected = {
    webtoon: [100000, "웹툰 제작 12컷 10만 원부터 · 부가세 별도"],
    animation: [300000, "30만 원부터 · 30초 기준 · 부가세 별도"],
    "ai-influencer": [
      100000,
      "10만 원부터 · 캐릭터 1명 세팅 + 이미지 5장 기준 · 부가세 별도",
    ],
    "motion-graphics": [100000, "10만 원부터 · 단순형 30초 기준 · 부가세 별도"],
    "brand-film": [250000, "25만 원부터 · 30초 기준 · 부가세 별도"],
    ad: [250000, "25만 원부터 · 30초 기준 · 부가세 별도"],
  };
  assert.equal(SHOW_STARTING_PRICE, true);
  for (const id of ORDER) {
    const price = startingPrice(id);
    assert.ok(price, id);
    assert.equal(price.amount, expected[id][0], id);
    assert.equal(price.line, expected[id][1], id);
    assert.equal([price.head, ...price.rest].join(" · "), price.line);
    assert.match(price.line, /부가세 별도$/);
    assert.equal(startingPrice(id, false), null);
    if (id === "webtoon") {
      assert.equal(price.head, "웹툰 제작 12컷 10만 원부터");
      assert.equal(price.note, "모션코믹 영상화 옵션 · 30초 7.5만 원부터");
    } else {
      assert.equal(price.note, undefined, `${id} has no option line`);
      assert.match(price.head, /^\d+(\.\d)?만 원부터$/);
    }
  }
  assert.equal(formatWon(100000), "10만 원");
  assert.equal(formatWon(75000), "7.5만 원");
  assert.equal(formatWon(175000), "17.5만 원");
  assert.equal(formatWon(1000000), "100만 원");

  // PRICING_FINAL_2026-10-14.md 3~9번 (부가세 별도)
  const amounts = (key) => contentPricing[key].plans.map((p) => p.amount);
  assert.deepEqual(amounts("ai-influencer"), [100000, 300000, 1000000]);
  assert.deepEqual(amounts("brand-film"), [250000, 450000]);
  assert.deepEqual(amounts("animation"), [300000, 550000]);
  assert.deepEqual(amounts("motion-graphics"), [100000, 180000, 150000, 270000]);
  assert.deepEqual(amounts("webtoon"), [100000, 180000]);
  assert.deepEqual(amounts("motion-comic"), [75000, 120000]);
  assert.deepEqual(
    contentPricing["motion-comic"].bundles.map((b) => b.amount),
    [175000, 300000],
  );
  assert.deepEqual(amounts("ad"), [250000, 450000]);
  assert.deepEqual(contentPricing.common.revisions, [
    "기획안 전달 후 수정 2회",
    "최종안 전달 후 수정 1회",
  ]);
  assert.equal(contentPricing.common.vat, "부가세 별도");

  // 가격 표시 여부는 SHOW_STARTING_PRICE 하나로만 정한다.
  for (const { path, text } of sources.filter((s) =>
    s.path.startsWith(componentDir),
  )) {
    assert.doesNotMatch(text, /SHOW_STARTING_PRICE/, path);
    assert.doesNotMatch(text, /startingPrice\([^)]*,/, path);
  }
});

test("3. 금지 표현과 AI 인플루언서 범위 안내", () => {
  const banned =
    /을 통해|를 통해|에 대해|아니라|없이|최고|최저|보장|%|\d+배|운영 중|게시 중|팔로워|조회수|립싱크|목소리|고화질|콘텐츠|coming soon|준비 중|공개 예정|곧 공개/i;
  for (const text of allCopy) assert.doesNotMatch(text, banned, text);
  for (const s of contentHomeServices) {
    if (s.id === "ai-influencer")
      assert.equal(s.scopeNote, "계정 게시·운영은 별도 견적");
    else assert.equal("scopeNote" in s, false, s.id);
    for (const text of [s.line, s.description, ...s.uses])
      assert.doesNotMatch(text, /계정|게시|운영/, `${s.id}: ${text}`);
  }
});

test("4. 문장 규칙(쉼표·마침표·제목 줄 길이)", () => {
  for (const text of [...single, ...multi])
    for (const sentence of sentences(text))
      assert.ok(
        (sentence.match(/,/g) || []).length <= 1,
        `comma <= 1: ${sentence}`,
      );
  for (const text of multi) {
    const parts = sentences(text);
    assert.ok(parts.length >= 2, `multi-sentence: ${text}`);
    for (const p of parts) assert.match(p, /\.$/, p);
  }
  for (const text of [...single, ...h1, ...h2])
    assert.doesNotMatch(text, /\.$/, text);
  for (const t of h1)
    for (const line of t.split("\n"))
      assert.ok(line.length <= 10, `h1 line <= 10: ${line}`);
  for (const t of h2)
    for (const line of t.split("\n"))
      assert.ok(line.length <= 11, `h2 line <= 11: ${line}`);
  assert.equal(h1[0].split("\n").length, 2);
});

test("5. AI 인플루언서 이미지 표기", () => {
  const ai = contentHomeServices.find((s) => s.id === "ai-influencer");
  assert.match(ai.imageTag, /AI 가상인물/);
  assert.match(ai.alt, /가상인물/);
  for (const s of contentHomeServices.filter((s) => s.id !== "ai-influencer")) {
    assert.equal(s.imageTag, "연출 예시");
    assert.equal(s.alt, `${s.label} 연출 예시 이미지`);
  }
});

test("6. 컨텐츠 분과 summary", () => {
  const video = divisions.find((d) => d.id === "video");
  assert.ok(video.summary.includes(REQUIRED));
  assert.ok(!video.summary.includes("브랜드 홍보 및"));
});

test("7. /content는 ContentHome을 렌더한다", () => {
  // P2R WP0: /content는 컨텐츠 사이트 라우트 그룹이 처리한다.
  const page = read("app/(content-site)/content/page.tsx");
  assert.match(page, /import \{ ContentHome \} from "@\/components\/content-home\/content-home"/);
  assert.doesNotMatch(page, /StudioHome|studio-home/);
  assert.ok(existsSync("components/guide/studio-home.jsx"), "file kept");
});

test("8. 소스 규칙: 인라인 style·옛 구성 요소·글자 리터럴 금지", () => {
  for (const { path, text } of sources) {
    assert.doesNotMatch(text, /style=/, path);
    assert.doesNotMatch(text, /HomeReferences|GuideMedia/, path);
    assert.doesNotMatch(text, /\/content\/work|작업 사례/, path);
  }
  const showcase = read(join(componentDir, "service-showcase.tsx"));
  assert.doesNotMatch(showcase, /wheel|scroll-snap|setInterval|setTimeout/);
  const css = read(join(componentDir, "content-home.css"));
  assert.ok(
    componentFiles.filter((f) => f.endsWith(".css")).length === 1,
    "one CSS file",
  );
  assert.doesNotMatch(css, /!important/);
  assert.doesNotMatch(css, /Unbounded|Pretendard|JetBrains/);
  assert.doesNotMatch(css, /scroll-snap/);
  const body = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const typeProp =
    /(?:^|[;{\s])(font-size|line-height|letter-spacing|font-weight|font-family)\s*:\s*([^;}]+)/g;
  // 규칙 단위로 선택자와 선언을 나눠 예외 두 가지만 허용한다.
  for (const rule of body.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = rule[1].trim();
    for (const decl of rule[2].matchAll(typeProp)) {
      const [, prop, rawValue] = decl;
      const value = rawValue.trim();
      if (value.startsWith("var(")) continue;
      const allowed =
        prop === "font-weight" &&
        value === "700" &&
        /\.ch-price-amount$/.test(selector);
      assert.ok(allowed, `${selector} { ${prop}: ${value} }`);
    }
  }
  assert.ok(
    /\.ch-display-num\s*\{[^}]*font-family:\s*var\(--ff-display\)/.test(body),
  );
  // font-family 선언은 장식 번호 하나뿐이다.
  assert.equal((body.match(/font-family\s*:/g) || []).length, 1);
  // @media 블록 안에는 글자 속성 선언이 없다.
  let depth = 0,
    inMedia = false,
    mediaDepth = 0,
    chunk = "";
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === "{") {
      if (/@media[^{]*$/.test(chunk) && !inMedia) {
        inMedia = true;
        mediaDepth = depth;
      }
      depth++;
      chunk = "";
    } else if (ch === "}") {
      depth--;
      if (inMedia && depth === mediaDepth) inMedia = false;
      chunk = "";
    } else {
      chunk += ch;
      if (inMedia)
        assert.doesNotMatch(
          chunk,
          /(?:^|[;\s])(font-size|line-height|letter-spacing|font-weight|font-family)\s*:/,
        );
    }
  }
});

test("9. 메인 컨텐츠 탭 한 줄 설명 공유(P4가 있을 때만)", (t) => {
  if (!existsSync("lib/home-journey.ts")) {
    t.skip("lib/home-journey.ts 없음: P4 미적용, 공유 보류");
    return;
  }
  const journey = read("lib/home-journey.ts");
  for (const s of contentHomeServices)
    assert.ok(journey.includes(s.line) || /content-home/.test(journey), s.id);
});

test("10. 히어로 쇼릴 슬롯은 커밋 상태에서 비어 있다", () => {
  assert.equal(contentHomeHero.video, undefined);
  const lib = read("lib/content-home.ts");
  assert.match(
    lib,
    /export type HeroVideo = \{ src: string; poster: string \}/,
  );
  assert.match(lib, /video: undefined as HeroVideo \| undefined/);
  const hero = read(join(componentDir, "hero-media.tsx"));
  assert.match(hero, /\{video \? <HeroVideoLayer video=\{video\} \/> : null\}/);
  const home = read(join(componentDir, "content-home.tsx"));
  assert.match(home, /hero\.video \? null :/);
});

test("11. 삭제된 경로를 되살리지 않는다", () => {
  for (const file of readdirSync(".").filter((f) => /^next\.config\./.test(f)))
    assert.doesNotMatch(read(file), /\/content\/work/, file);
  const primitives = read("components/guide/primitives.tsx");
  const nav = primitives.slice(
    primitives.indexOf("export function GuideNav"),
    primitives.indexOf("<nav", primitives.indexOf("export function GuideNav")),
  );
  assert.ok(nav.length > 0);
  assert.doesNotMatch(nav, /작업 사례|\/content\/work/);
  assert.match(nav, /!studio/, "cases tab stays excluded for the content division");
});
