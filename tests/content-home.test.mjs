// /content 컨텐츠 사이트 홈(P3 → P2R WP-D) 테스트.
// 데이터(lib/content-home.ts)와 소스(components/content-home/**)를 직접 읽는다.
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
import * as pricing from "../lib/content-pricing.ts";
import { MEDIA_TAGS } from "../lib/content-site/types.ts";
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
const BANNED =
  /을 통해|를 통해|에 대해|아니라|없이|최고|최저|보장|1위|%|\d+배|혁신|차원이 다른|압도적|극대화|시너지|원스톱|완벽|최적|퀄리티|콘텐츠|운영 중|게시 중|팔로워|조회수|립싱크|목소리|고화질|coming soon|준비 중|공개 예정|곧 공개|맞춤 견적|작업 사례|쇼릴/i;
const read = (path) => readFileSync(path, "utf8");
const componentDir = "components/content-home";
const componentFiles = readdirSync(componentDir).map((f) =>
  join(componentDir, f),
);
const tsxFiles = componentFiles.filter((f) => f.endsWith(".tsx"));
const sources = [...componentFiles, "lib/content-home.ts"].map((path) => ({
  path,
  text: read(path),
}));
/** 주석을 뺀 소스 */
const code = (text) =>
  text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

/* 화면에 쓰이는 카피 문자열과 그 성격(한 문장 / 여러 문장 / 제목) */
const single = [
  contentHomeHero.eyebrow,
  contentHomeHero.lead,
  contentHomeHero.button,
  contentHomeHero.secondary,
  contentHomeHero.tag,
  contentHomeHero.image.alt,
  contentHomeHero.videoPause,
  contentHomeHero.videoPlay,
  contentHomeServicesHead.eyebrow,
  contentHomeServicesHead.lead,
  contentHomeServicesHead.toggle,
  contentHomeServicesHead.carouselLabel,
  contentHomeServicesHead.tabsLabel,
  contentHomeServicesHead.prev,
  contentHomeServicesHead.next,
  contentHomeServicesHead.detailLink,
  contentHomeProcessHead.eyebrow,
  contentHomeProcessHead.tabsLabel,
  contentHomeProcessHead.outputLabel,
  contentHomeCta.eyebrow,
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
const eyebrows = [
  contentHomeHero.eyebrow,
  contentHomeServicesHead.eyebrow,
  contentHomeProcessHead.eyebrow,
  contentHomeCta.eyebrow,
  ...contentHomeServices.map((s) => s.kicker),
];
const allCopy = [...single, ...multi, ...h1, ...h2];
const sentences = (text) =>
  text
    .split(/(?<=[.?!])\s+/)
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

test("2. 시작가는 PRICING_FINAL 정본 값과 같고 lib/content-pricing.ts에서 온다", () => {
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

  // 가격 모듈 위치(VERIFY_P34 P3-5): lib/content-home.ts는 같은 값을 다시 내보내기만 하고,
  // 화면 컴포넌트는 lib/content-pricing.ts에서 바로 가져온다. 금액 리터럴은 content-pricing.ts에만.
  assert.equal(pricing.startingPrice, startingPrice);
  assert.equal(pricing.contentPricing, contentPricing);
  assert.equal(pricing.SHOW_STARTING_PRICE, SHOW_STARTING_PRICE);
  const detail = read(join(componentDir, "service-detail.tsx"));
  assert.match(detail, /import \{ startingPrice \} from "@\/lib\/content-pricing"/);
  for (const { path, text } of sources)
    assert.doesNotMatch(text, /\b\d{2,3}000\b|\b1000000\b/, `${path} amount literal`);
  // 가격 표시 여부는 SHOW_STARTING_PRICE 하나로만 정한다(컴포넌트에 분기·강제 표시 없음).
  for (const { path, text } of sources.filter((s) =>
    s.path.startsWith(componentDir),
  )) {
    assert.doesNotMatch(text, /SHOW_STARTING_PRICE/, path);
    assert.doesNotMatch(text, /startingPrice\([^)]*,/, path);
    assert.doesNotMatch(text, /CsPrice\b/, `${path} CsPrice always shows`);
  }
});

test("3. 금지 표현과 AI 인플루언서 범위 안내", () => {
  for (const text of allCopy) assert.doesNotMatch(text, BANNED, text);
  for (const s of contentHomeServices) {
    if (s.id === "ai-influencer")
      assert.equal(s.scopeNote, "계정 게시·운영은 별도 견적");
    else assert.equal("scopeNote" in s, false, s.id);
    for (const text of [s.line, s.description, ...s.uses])
      assert.doesNotMatch(text, /계정|게시|운영/, `${s.id}: ${text}`);
  }
  // 영문은 eyebrow·kicker(대문자 3단어 이하)와 허용 약어만
  for (const e of eyebrows) {
    assert.match(e, /^[A-Z][A-Z ]*[A-Z]$/, e);
    assert.ok(e.split(" ").length <= 3, e);
  }
  for (const text of allCopy.filter((t) => !eyebrows.includes(t)))
    for (const m of text.matchAll(/[A-Za-z]+/g))
      assert.ok(["AI", "SNS", "p"].includes(m[0]), `latin "${m[0]}" · ${text}`);
});

test("4. R2 문장 규칙: 화면 카피 마침표 금지·제목 줄 길이", () => {
  for (const text of [...single, ...multi])
    for (const sentence of sentences(text))
      assert.ok(
        (sentence.match(/,/g) || []).length <= 1,
        `comma <= 1: ${sentence}`,
      );
  for (const text of allCopy)
    assert.doesNotMatch(text, /[가-힣]\.(?=\s|$)|\.$/, text);
  // R2 자연스러운 카피 허용: h1 한 줄 12자 이하, 실제 줄바꿈·넘침은 4폭 브라우저 검증
  for (const t of h1)
    for (const line of t.split("\n"))
      assert.ok(line.length <= 12, `h1 line <= 12: ${line}`);
  for (const t of h2)
    for (const line of t.split("\n"))
      assert.ok(line.length <= 11, `h2 line <= 11: ${line}`);
  assert.equal(h1[0].split("\n").length, 2);
  assert.ok(contentHomeHero.title.includes(contentHomeHero.accent));
});

test("5. 이미지 표기(MEDIA_TAGS)", () => {
  const ai = contentHomeServices.find((s) => s.id === "ai-influencer");
  assert.equal(ai.imageTag, MEDIA_TAGS.aiPerson);
  assert.match(ai.alt, /가상인물/);
  for (const s of contentHomeServices.filter((s) => s.id !== "ai-influencer")) {
    assert.equal(s.imageTag, MEDIA_TAGS.staged);
    assert.equal(s.alt, `${s.label} 연출 예시 이미지`);
  }
  assert.equal(contentHomeHero.tag, MEDIA_TAGS.staged);
  assert.match(contentHomeHero.image.alt, /연출 예시/);
});

test("6. 컨텐츠 분과 summary", () => {
  const video = divisions.find((d) => d.id === "video");
  assert.ok(video.summary.includes(REQUIRED));
  assert.ok(!video.summary.includes("브랜드 홍보 및"));
});

test("7. /content는 컨텐츠 사이트 라우트에서 ContentHome을 렌더한다", () => {
  const page = read("app/(content-site)/content/page.tsx");
  assert.match(page, /import \{ ContentHome \} from "@\/components\/content-home\/content-home"/);
  assert.doesNotMatch(page, /StudioHome|studio-home/);
  assert.ok(existsSync("components/guide/studio-home.jsx"), "file kept");
});

test("8. 소스 규칙: 컨텐츠 사이트 체계(.cs-t-* 역할·--cs-* 토큰)만 쓴다", () => {
  for (const { path, text } of sources) {
    assert.doesNotMatch(text, /style=/, path);
    assert.doesNotMatch(text, /HomeReferences|GuideMedia|GuideNav|ServiceNavigation/, path);
    assert.doesNotMatch(text, /\/content\/work|작업 사례|\/insights/, path);
    assert.doesNotMatch(text, /components\/guide\//, `${path} guide import`);
  }
  // W2 역할 클래스·메인 셸 클래스 0(.t-*, .eyebrow, .l-container, .guide-page)
  for (const path of tsxFiles) {
    const text = read(path);
    for (const m of text.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
      const classes = (m[1] ?? m[2]).split(/\s+/);
      for (const c of classes)
        assert.ok(
          !/^(t-[\w-]+|eyebrow|l-container|guide-[\w-]+|content-home)$/.test(c),
          `${path} legacy class ${c}`,
        );
    }
    assert.doesNotMatch(text, /\bautoPlay\b/, `${path} autoplay attribute`);
  }
  const showcase = code(read(join(componentDir, "service-showcase.tsx")));
  assert.doesNotMatch(showcase, /wheel|scroll-snap|setInterval|setTimeout/);
  assert.ok(
    componentFiles.filter((f) => f.endsWith(".css")).length === 1,
    "one CSS file",
  );
  const body = code(read(join(componentDir, "content-home.css")));
  assert.doesNotMatch(body, /!important/);
  // 글자 속성 선언 0(역할 클래스가 정한다)
  assert.doesNotMatch(
    body,
    /(?:^|[;{\s])(font-size|line-height|letter-spacing|font-weight|font-family)\s*:/,
  );
  // 색은 --cs-* 토큰과 그 color-mix만: 숫자 색 리터럴·메인 사이트 토큰 0
  assert.doesNotMatch(body, /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i, "color literal");
  assert.doesNotMatch(
    body,
    /var\(--(ink|paper|violet|lavender|muted|line|radius|type-|ff-|gutter|container|section-y|site-header-height|service-nav-height|ch-(bg|surface|text|line|accent|action|glow))/,
    "main-site or old --ch-* color token",
  );
  // 모든 규칙은 .cs-site .cs-home 안
  const withoutKeyframes = body.replace(/@keyframes\s+[\w-]+\s*\{(?:[^{}]*\{[^{}]*\})*\s*\}/g, "");
  for (const rule of withoutKeyframes.matchAll(/([^{}]+)\{[^{}]*\}/g)) {
    const head = rule[1].trim();
    if (head.startsWith("@") || head === "") continue;
    for (const selector of head.split(","))
      assert.match(selector.trim(), /^\.cs-site \.cs-home\b/, `scope: ${selector.trim()}`);
  }
  // 트랜지션은 reduced-motion: no-preference 안에서만
  const outsideMotion = body.replace(
    /@media \(prefers-reduced-motion: no-preference\)\s*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g,
    "",
  ).replace(
    /@media \(hover: hover\) and \(prefers-reduced-motion: no-preference\)\s*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g,
    "",
  );
  assert.doesNotMatch(outsideMotion, /transition\s*:/, "transition outside no-preference");
});

test("8-1. R2 수동 작업 갤러리: 카드 안 이동·접근 가능한 서비스 선택·결과물 공개", () => {
  const css = code(read(join(componentDir, "content-home.css")));
  // 3D 사본 대신 실제 작업 한 장을 수동으로 선택한다
  assert.doesNotMatch(css, /preserve-3d/);
  const showcase = read(join(componentDir, "service-showcase.tsx"));
  assert.match(showcase, /selections: ContentSelection\[\]/);
  assert.match(showcase, /role="tablist"/);
  assert.match(showcase, /role="tabpanel"/);
  assert.match(showcase, /aria-selected=/);
  assert.match(showcase, /tabIndex=\{index === current \? 0 : -1\}/);
  for (const key of ["ArrowRight", "ArrowLeft", "Home", "End"])
    assert.ok(showcase.includes(`"${key}"`), key);
  assert.match(showcase, /className="ch-work-card"[\s\S]*className="ch-work-nav"[\s\S]*aria-label="이전 서비스"[\s\S]*aria-label="다음 서비스"/);
  assert.match(showcase, /video\.pause\(\)/);
  assert.doesNotMatch(showcase, /setInterval|autoPlay|className="ch-stage"/);
  assert.match(showcase, /\/content\/projects\//);
  // 제작 단계는 내용을 숨기지 않는 순서 목록이다
  const tabs = read(join(componentDir, "process-tabs.tsx"));
  assert.match(tabs, /<ol className="ch-process-rows"/);
  assert.match(tabs, /step\.output/);
  assert.doesNotMatch(tabs, /role="tab|hidden=|useState/);
  // 버튼은 컨텐츠 사이트 버튼(.cs-btn)만, 크기는 서비스 히어로와 같은 lg
  const home = read(join(componentDir, "content-home.tsx"));
  assert.equal((home.match(/cs-btn--lg/g) || []).length, 3);
  assert.doesNotMatch(home, /t-button/);
  // 히어로 높이는 컨텐츠 헤더 기준(고정 문의 바 없음)
  assert.match(css, /calc\(100svh - var\(--cs-header-h\)\)/);
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
  const media = read(join(componentDir, "hero-media.tsx"));
  assert.doesNotMatch(media, /^\s*["']use client["']/, "hero-media stays a server component");
  assert.match(media, /\{video \? <HeroVideoLayer video=\{video\} \/> : null\}/);
  const video = read(join(componentDir, "hero-video.tsx"));
  assert.match(video, /^\s*["']use client["']/);
  assert.match(video, /useCsMotion/, "header motion toggle pauses the reel");
  assert.match(video, /prefers-reduced-motion: reduce/);
  assert.match(video, /if \(!mounted\) return null;/, "no <video> in server HTML");
  const home = read(join(componentDir, "content-home.tsx"));
  assert.match(home, /hero\.video \? null :/, "staged tag only without a reel");
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

test("12. 제작 과정은 서비스 페이지와 같은 네 단계·같은 수정 기준", () => {
  assert.deepEqual(
    contentHomeProcess.map((s) => s.label),
    ["상담", "기획", "제작", "납품"],
  );
  assert.equal(contentHomeProcess.length, 4);
  assert.match(contentHomeProcessHead.lead, /기획안 수정 2회/);
  assert.match(contentHomeProcessHead.lead, /최종안 수정 1회/);
  assert.match(contentHomeProcess[1].body, /두 번까지 수정/);
  assert.match(contentHomeProcess[2].body, /한 번 수정/);
  // 근거 없는 업무 약속(권리 확인)과 미확인 납품 항목(원본 파일)을 쓰지 않는다
  for (const s of contentHomeProcess)
    assert.doesNotMatch(s.body, /권리|원본/, s.body);
});

test("13. theme.css의 WP0 임시 다리 블록이 없다", () => {
  const theme = read("components/content-site/theme.css");
  assert.doesNotMatch(theme, /\.content-home|임시 다리|--service-nav-height|--site-header-height/);
  assert.doesNotMatch(theme, /\.cs-site [^{]*\.t-(h1|h2|h3|lead|body|small|caption|chip|button)\b/);
});
