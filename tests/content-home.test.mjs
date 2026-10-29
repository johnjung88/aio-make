// /content 홈 v10: 승인된 v07 배치와 실제 제작물, 사용자 지정 v02 히어로 계약.
// 데이터(lib/content-home.ts)와 소스(components/content-home/**)를 직접 읽는다.
// 16:9 히어로 → 3D 갤러리(순서·정지/재개·실제 작품 보기) → 4단계 → 6서비스 → 상담.
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import {
  SHOW_STARTING_PRICE,
  contentHomeCta,
  contentHomeHero,
  contentHomeProcess,
  contentHomeProcessHead,
  contentHomeServices,
  contentHomeServicesHead,
  contentPricing,
  homeCardMedia,
  homeCarouselMotion,
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
  /을 통해|를 통해|에 대해|아니라|없이|최고|최저|보장|1위|%|\d+배|혁신|차원이 다른|압도적|극대화|시너지|원스톱|완벽|최적|퀄리티|운영 중|게시 중|팔로워|조회수|립싱크|목소리|고화질|coming soon|준비 중|공개 예정|곧 공개|맞춤 견적|쇼릴/i;
const read = (path) => readFileSync(path, "utf8").replaceAll("\r\n", "\n");
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
// JSX/스타일 포맷 변경은 동작 변경이 아니다. 복합 구문 비교는 공백을 정규화한다.
const compact = (text) => text.replace(/\s+/g, "");
const hasSource = (text, snippet) => compact(text).includes(compact(snippet));
const lineage = JSON.parse(read("content/approved-main-assets-20261019.json"));
const assertPublicAsset = (url) => {
  assert.match(url, /^\/content-renewal-20261019\/[\w.-]+$/);
  const entry = lineage.assets.find((asset) => asset.publicPath === url);
  assert.ok(entry, `${url} has private provenance`);
  const bytes = readFileSync(join("public", url));
  assert.equal(bytes.length, entry.bytes, `${url} copied size`);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), entry.sha256, `${url} copied SHA`);
  return entry;
};
const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** 중괄호 짝이 맞는 블록 끝 위치 */
const blockEnd = (text, start) => {
  let depth = 1,
    end = start;
  while (end < text.length && depth) {
    if (text[end] === "{") depth++;
    if (text[end] === "}") depth--;
    end++;
  }
  return end;
};
/** 지정한 @media 머리말(정규식)에 해당하는 블록 본문들을 모은다 */
const mediaBodies = (css, head) =>
  [...css.matchAll(/@media[^{}]+\{/g)]
    .filter((m) => head.test(m[0]))
    .map((m) => css.slice(m.index + m[0].length, blockEnd(css, m.index + m[0].length) - 1));
/** 선택자 하나의 선언부 */
const declsOf = (css, selector) => {
  const m = css.match(new RegExp(`(?:^|[}\\s])${escape(selector)}\\s*\\{([^}]*)\\}`));
  return m ? m[1] : null;
};

const cssText = read(join(componentDir, "content-home.css"));
const css = code(cssText);
const showcaseText = read(join(componentDir, "service-showcase.tsx"));
const showcase = code(showcaseText);
const homeText = read(join(componentDir, "content-home.tsx"));
const home = code(homeText);

/* 화면에 쓰이는 카피 문자열과 그 성격(한 문장 / 여러 문장 / 제목) */
const single = [
  contentHomeHero.videoPause,
  contentHomeHero.videoPlay,
  contentHomeServicesHead.eyebrow,
  contentHomeServicesHead.detailLink,
  contentHomeProcessHead.eyebrow,
  contentHomeCta.eyebrow,
  contentHomeCta.button,
  ...contentHomeServices.flatMap((s) => [s.label, s.line]),
  ...contentHomeProcess.flatMap((s) => [s.label, s.text]),
];
const multi = [contentHomeCta.lead];
const h2 = [
  contentHomeServicesHead.title,
  contentHomeProcessHead.title,
  contentHomeCta.title,
];
const eyebrows = [
  contentHomeServicesHead.eyebrow,
  contentHomeProcessHead.eyebrow,
  contentHomeCta.eyebrow,
];
const allCopy = [...single, ...multi, ...h2];
const sentences = (text) =>
  text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

test("1. 서비스 6종 순서·라벨·링크·한 줄 설명", () => {
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
    assert.ok(s.line && s.line.length > 0, `${s.id} keeps the one-line text (CsRelated reads it)`);
    // 설명 블록이 사라져 쓰이지 않는 필드는 데이터에서도 지웠다
    assert.deepEqual(Object.keys(s).sort(), ["href", "id", "label", "line"], s.id);
  }
});

test("2. 시작가는 PRICING_FINAL 정본 값과 같고 lib/content-pricing.ts에서 온다", () => {
  const expected = {
    webtoon: [100000, "12P 10만 원부터 · 부가세 별도"],
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
    assert.equal(price.note, undefined, `${id} has no option line`);
    if (id === "webtoon") assert.equal(price.head, "12P 10만 원부터");
    else assert.match(price.head, /^\d+(\.\d)?만 원부터$/);
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
  assert.match(showcase, /import \{ startingPrice \} from "@\/lib\/content-pricing"/);
  assert.ok(hasSource(showcase, "const price = startingPrice(service.id);"));
  assert.match(showcase, /className="ch-depth-price cs-t-small"[\s\S]*?\{price\.head\}/);
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

test("3. 금지 표현과 영문 규칙", () => {
  for (const text of allCopy) assert.doesNotMatch(text, BANNED, text);
  // 영문은 eyebrow(대문자 3단어 이하)와 허용 약어만
  for (const e of eyebrows) {
    assert.match(e, /^[A-Z][A-Z ]*[A-Z]$/, e);
    assert.ok(e.split(" ").length <= 3, e);
  }
  for (const text of allCopy.filter((t) => !eyebrows.includes(t)))
    for (const m of text.matchAll(/[A-Za-z]+/g))
      assert.ok(["AI", "SNS", "p"].includes(m[0]), `latin "${m[0]}" · ${text}`);
  // 서비스 한 줄 설명에 계정 게시·운영 약속이 없다
  for (const s of contentHomeServices)
    assert.doesNotMatch(s.line, /계정|게시|운영/, `${s.id}: ${s.line}`);
});

test("4. 승인된 v07 카피: 문장 끝 마침표·쉼표와 제목 줄 길이", () => {
  for (const text of [...single, ...multi])
    for (const sentence of sentences(text))
      assert.ok(
        (sentence.match(/,/g) || []).length <= 1,
        `comma <= 1: ${sentence}`,
      );
  for (const text of allCopy)
    assert.doesNotMatch(text, /\.$/, text);
  for (const t of h2)
    for (const line of t.split("\n"))
      assert.ok(line.length <= 16, `approved h2 line remains compact: ${line}`);
  // v07에서 확인한 카피와 가운데 머리 배치를 유지한다.
  assert.equal(contentHomeProcessHead.title, "기획을 확인하고\n단계마다 함께 다듬습니다");
  assert.equal("lead" in contentHomeProcessHead, false, "process lead is deleted");
  assert.equal("lead" in contentHomeServicesHead, false, "services lead is deleted");
});

test("4-1. 섹션 머리: 가운데 정렬, 승인된 강조 키워드와 부제 없는 배치", () => {
  // 강조 키워드는 제목 안에 한 번 있는 그대로의 글자다(스크린리더 문장 유지)
  assert.equal(contentHomeServicesHead.titleEm, "완성");
  assert.equal(contentHomeProcessHead.titleEm, "함께");
  for (const [title, em] of [
    [contentHomeServicesHead.title, contentHomeServicesHead.titleEm],
    [contentHomeProcessHead.title, contentHomeProcessHead.titleEm],
  ]) {
    assert.equal(title.split(em).length, 2, `${em} appears once in ${title}`);
    assert.doesNotMatch(em, /\n/);
  }
  // 렌더: 두 머리 모두 align="center" + emphasis, lead 없음
  assert.match(showcase, /<CsSectionHead id="ch-services-title"[^>]*emphasis=\{heading\.titleEm\}[^>]*align="center"/);
  assert.doesNotMatch(showcase, /<CsSectionHead[^>]*lead=/);
  assert.match(home, /emphasis=\{processHead\.titleEm\}\s+align="center"/);
  assert.doesNotMatch(showcase + home, /head\.lead|processHead\.lead/);
  // CsSectionHead: align prop은 기본 start(다른 페이지 영향 없음), 강조는 <em> 안의 같은 글자
  const head = code(read("components/content-site/ui/section-head.tsx"));
  assert.match(head, /align = "start"/);
  assert.match(head, /align\?: "start" \| "center"/);
  assert.match(head, /"cs-head-main cs-col-7"/, "start keeps the 7-column head");
  assert.match(head, /<em className="cs-head-em">\{emphasis\}<\/em>/);
  // theme.css: 가운데 변형은 머리 안 글자만 가운데로, 강조는 accent-text 색(eyebrow와 같은 대비 토큰)
  const theme = code(read("components/content-site/theme.css"));
  assert.match(declsOf(theme, ".cs-site .cs-head--center .cs-head-main"), /align-items:\s*center;[^}]*text-align:\s*center;/);
  assert.match(declsOf(theme, ".cs-site .cs-head--center .cs-head-lead"), /margin-inline:\s*auto;/);
  assert.match(declsOf(theme, ".cs-site .cs-head-em"), /color:\s*var\(--cs-accent-text\);/);
  assert.match(declsOf(theme, ".cs-site .cs-head-em"), /font-style:\s*normal;/);
});

test("5. 표시 태그: 홈 카드 슬롯 태그와 공통 문구", () => {
  assert.equal(MEDIA_TAGS.staged, "연출 예시");
  assert.equal(MEDIA_TAGS.aiPerson, "AI 가상인물 · 연출 예시");
  assert.equal(MEDIA_TAGS.ownWebtoon, "1억의 구단주 · 제작 예시");
  // 캡션이 선택 소재의 태그를 그대로 보여 준다(연출 예시를 실제 작업물처럼 보이지 않게)
  assert.match(showcase, /selection.tab.id === "ai-influencer"[\s\S]*AI 가상인물/);
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
  // 스크롤 휠·스냅·반복 타이머 없음(자동 회전은 단발 setTimeout을 effect가 다시 잰다)
  assert.doesNotMatch(showcase, /wheel|scroll-snap|setInterval/);
  assert.ok(
    componentFiles.filter((f) => f.endsWith(".css")).length === 1,
    "one CSS file",
  );
  assert.doesNotMatch(css, /!important/);
  // 글자 속성 선언 0(역할 클래스가 정한다)
  assert.doesNotMatch(
    css,
    /(?:^|[;{\s])(font-size|line-height|letter-spacing|font-weight|font-family)\s*:/,
  );
  // 색은 --cs-* 토큰과 그 color-mix만: 숫자 색 리터럴·메인 사이트 토큰 0
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i, "color literal");
  assert.doesNotMatch(
    css,
    /var\(--(ink|paper|violet|lavender|muted|line|radius|type-|ff-|gutter|container|section-y|site-header-height|service-nav-height|ch-(bg|surface|text|line|accent|action|glow))/,
    "main-site or old --ch-* color token",
  );
  // 모든 규칙은 .cs-site .cs-home 안
  const withoutKeyframes = css.replace(/@keyframes\s+[\w-]+\s*\{(?:[^{}]*\{[^{}]*\})*\s*\}/g, "");
  for (const rule of withoutKeyframes.matchAll(/([^{}]+)\{[^{}]*\}/g)) {
    const head = rule[1].trim();
    if (head.startsWith("@") || head === "") continue;
    // Commas inside :is()/:where() are part of one selector
    const selectors = []; let depth = 0, current = "";
    for (const ch of head) {
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (ch === "," && depth === 0) { selectors.push(current); current = ""; }
      else current += ch;
    }
    selectors.push(current);
    for (const selector of selectors)
      assert.match(selector.trim(), /^\.cs-site \.cs-home\b/, `scope: ${selector.trim()}`);
  }
  // 트랜지션은 reduced-motion: no-preference 안에서만
  let outsideMotion = css;
  for (const match of [...css.matchAll(/@media[^{}]+\{/g)].reverse()) {
    if (!/prefers-reduced-motion\s*:\s*no-preference/.test(match[0])) continue;
    outsideMotion = outsideMotion.slice(0, match.index) + outsideMotion.slice(blockEnd(css, match.index + match[0].length));
  }
  assert.doesNotMatch(outsideMotion, /transition\s*:/, "transition outside no-preference");
});

test("8-1. 3D 작업 갤러리: 탭 칩 줄이 없고 조작과 접근성은 유지한다", () => {
  assert.match(showcase, /selections:\s*ContentSelection\[\]/);
  // 서비스 탭 칩 줄(role=tablist·aria-selected·탭 id·aria-labelledby 연결·탭 포커스 이동) 삭제
  assert.doesNotMatch(showcase, /role="tab(list|panel)?"|aria-selected|ch-gallery-tabs|ch-tab\b|ch-service-panel|buttons\.current/);
  assert.doesNotMatch(css, /\.ch-gallery-tabs|\.ch-tab\b/);
  for (const key of ["ArrowRight", "ArrowLeft", "Home", "End"])
    assert.ok(hasSource(showcase, `"${key}"`), key);
  assert.match(showcase, /aria-label="이전 서비스"/);
  assert.match(showcase, /aria-label="다음 서비스"/);
  assert.match(showcase, /video\.pause\(\)/);
  assert.doesNotMatch(showcase, /autoPlay|className="ch-stage"/);
  assert.match(showcase, /HomeCasePreview/, "actual case stays within the home page");
  // 스크린 리더 알림 문장은 남긴다
  assert.ok(hasSource(showcase, "`${current+1} / ${count} ${activeService.label}`"));
  assert.ok(hasSource(showcase, 'aria-live={running ? "off" : "polite"}'));
  // 섹션 제목 연결은 aria-labelledby 하나(탭 id 아님)
  assert.match(showcase, /aria-labelledby="ch-services-title"/);
  // 모바일 스와이프: 가로 45px·가로 우세 1.2배만 넘기고, 세로 스크롤은 브라우저(touch-action: pan-y)가 처리
  assert.match(compact(showcase), /Math\.abs\(dx\)>45&&Math\.abs\(dx\)>Math\.abs\(dy\)\*1\.2/);
  assert.match(compact(showcase), /suppressClick\.current=true/);
  assert.match(css, /\.ch-depth-stage\s*\{[^}]*touch-action:\s*pan-y/);
  // 카드 전체를 덮는 이동 링크와 선택 버튼 위에서 시작한 스와이프도 넘긴다(그 밖의 링크·버튼·조작 막대 영상은 제외)
  assert.ok(hasSource(showcase, '!target.closest(".ch-depth-open, .ch-depth-select") && target.closest("video[controls], a, button")'));
  // 버튼은 컨텐츠 사이트 버튼(.cs-btn)만, 크기는 서비스 히어로와 같은 lg. 히어로 버튼은 없고 상담 띠 하나뿐
  assert.equal((homeText.match(/cs-btn--lg/g) || []).length, 1);
  assert.doesNotMatch(homeText, /className="t-button"/);
});

test("8-2. 캐러셀 자동 회전: 레퍼런스 수치, 타이머 시계, 정지 조건", () => {
  const m = homeCarouselMotion;
  // 레퍼런스 dist/app.js updateCarousel 관측값
  assert.equal(m.dwellMs, 3500);
  assert.equal(m.videoDwellMs, 5200);
  assert.equal(m.shiftDesktop, 365);
  assert.equal(m.shiftMobile, 212);
  assert.equal(m.depthDesktop, 170);
  assert.equal(m.depthMobile, 95);
  assert.equal(m.rotateDeg, 42);
  assert.deepEqual([...m.scale], [1, 0.88, 0.72]);
  assert.deepEqual([...m.opacity], [1, 0.85, 0.55]);
  assert.equal(m.transitionMs, 650);
  assert.ok(hasSource(css, `--ch-depth-shift:${m.shiftDesktop}px`));
  assert.ok(hasSource(css, `--ch-depth-shift:${m.shiftMobile}px`));
  assert.ok(hasSource(css, `--ch-depth-z:${m.depthDesktop}px`));
  assert.ok(hasSource(css, `--ch-depth-z:${m.depthMobile}px`));
  for (const [pos, rotate, scale, opacity] of [
    ["-1", "42deg", ".88", ".85"],
    ["1", "-42deg", ".88", ".85"],
    ["-2", "42deg", ".72", ".55"],
    ["2", "-42deg", ".72", ".55"],
  ]) {
    const rule = css.match(new RegExp(`${escape(`.ch-depth-card[data-pos="${pos}"] {`)}([^}]*)\\}`));
    assert.ok(rule, `pos ${pos}`);
    assert.ok(rule[1].includes(`rotateY(${rotate})`), `pos ${pos} rotate`);
    assert.ok(rule[1].includes(`scale(${scale})`), `pos ${pos} scale`);
    assert.ok(rule[1].includes(`opacity:${opacity}`), `pos ${pos} opacity`);
  }
  assert.ok(hasSource(css, ".ch-depth-card { transition:transform .65s cubic-bezier(.22,.75,.23,1),opacity .5s ease,filter .5s ease; }"));

  // 시계: animationend가 아니라 useEffect 안의 단발 타이머. 머무는 시간은 데이터 값(이미지 dwellMs, 영상 videoDwellMs)
  assert.doesNotMatch(showcase, /onAnimationEnd|animationName|animationend|cs-ch-autoplay|ch-autoplay|setCycle|cycle/);
  assert.doesNotMatch(css, /ch-autoplay|cs-ch-autoplay/);
  assert.ok(hasSource(showcase, 'const dwellMs=cards[current]?.kind==="video" ? homeCarouselMotion.videoDwellMs : homeCarouselMotion.dwellMs;'));
  const compactShowcase = compact(showcase);
  const effect = compactShowcase.slice(compactShowcase.indexOf("useEffect(()=>{if(!running)return;"));
  assert.ok(effect.startsWith("useEffect(()=>{if(!running)return;"), "timer effect exits when not running");
  for (const part of [
    "const timer=window.setTimeout(()=>{",
    "setCurrent(value=>(value+1)%count);",
    "},dwellMs);",
    "return ()=>window.clearTimeout(timer);",
    // 정지 해제(running 변화)와 카드 변경(current)·머무는 시간 변경 때마다 처음부터 다시 잰다
    "},[running,current,dwellMs,count,root]);",
  ])
    assert.ok(hasSource(effect, part), part);

  // 정지 조건: 화면 밖·탭 숨김(useStageActivity) · 헤더 움직임 토글 · reduced-motion · hover · 키보드 포커스 · 터치 중
  for (const contract of [
    'const moving=inView && motion==="on" && !reduced && !manualPaused && !previewId;',
    "const autoplay=!reduced;",
    "const running=moving && !hover && !focusPause && !touching;",
    'data-autoplay={autoplay ? (running ? "running":"paused") : "off"}',
    'onPointerEnter={event=>{if(event.pointerType==="mouse")setHover(true);}}',
    'onPointerLeave={event=>{if(event.pointerType==="mouse")setHover(false);}}',
    'matches(":focus-visible")',
    "setTouching(true);",
    "onTouchCancel=",
    "useCsMotion()",
    // 선택 카드 작품만 움직인다: 영상은 선택 카드에만 마운트해 muted 루프, 이미지는 켄번스
    "play={selected && moving}",
    "node.muted=true;node.play()",
    "muted loop playsInline",
    "controls={reduced}",
  ])
    assert.ok(hasSource(showcase, contract), contract);
  // v07의 명시적 정지/재개와 실제 작품 dialog가 열린 동안 자동 넘김도 멈춘다.
  assert.match(showcase, /setManualPaused/);
  assert.match(showcase, /setPreviewId/);
  const activity = read(join(componentDir, "use-stage-activity.ts"));
  assert.match(activity, /IntersectionObserver/);
  assert.match(activity, /document\.hidden/);
  assert.match(activity, /prefers-reduced-motion: reduce/);
  assert.ok(hasSource(css, '.ch-depth-card[data-pos="0"] .ch-kb { animation:cs-ch-kb '));
  assert.ok(hasSource(css, '.ch-gallery[data-active="false"] .ch-kb { animation-play-state:paused; }'));
});

test("8-3. 컨트롤: 화살표·01/06·정지/재개, 44px와 감소모션", () => {
  assert.match(showcase, /className="ch-gallery-tools"/);
  assert.ok(hasSource(showcase, 'String(current+1).padStart(2,"0")'));
  assert.ok(hasSource(showcase, 'String(count).padStart(2,"0")'));
  assert.ok(hasSource(showcase, 'aria-pressed={manualPaused}'));
  assert.ok(hasSource(showcase, 'disabled={reduced || motion!=="on"}'));
  assert.match(showcase, /자동 넘김 재개/);
  assert.match(showcase, /자동 넘김 일시정지/);
  assert.equal((showcase.match(/<button type="button" className="ch-arrow /g) || []).length, 2);
  assert.ok(hasSource(showcase, 'className="ch-arrow ch-arrow--prev cs-t-button" aria-label="이전 서비스" onClick={()=>select(current-1)}>←'));
  assert.ok(hasSource(showcase, 'className="ch-arrow ch-arrow--next cs-t-button" aria-label="다음 서비스" onClick={()=>select(current+1)}>→'));
  // 화살표는 스테이지(.ch-depth-stage) 안에 있다
  const stage = showcase.slice(showcase.indexOf('<div className="ch-depth-stage"'));
  assert.ok(stage.indexOf("ch-arrow--prev") > 0 && stage.indexOf("ch-arrow--next") > stage.indexOf("ch-arrow--prev"));
  assert.ok(stage.indexOf("ch-arrow--next") < stage.indexOf("aria-live"), "arrows are inside the stage, before the live region");
  // 44px, 스테이지 좌우 가장자리 세로 중앙
  const arrow = declsOf(css, ".cs-site .cs-home .ch-arrow");
  assert.ok(arrow, "arrow rule");
  assert.match(arrow, /position:absolute;\s*top:50%;/);
  assert.match(arrow, /width:44px;\s*height:44px;/);
  assert.match(arrow, /margin-top:-22px;/);
  assert.match(declsOf(css, ".cs-site .cs-home .ch-arrow--prev"), /left:0;/);
  assert.match(declsOf(css, ".cs-site .cs-home .ch-arrow--next"), /right:0;/);
  // 모바일(≤767px): 카드(280px) 옆 여백에 44px 버튼이 들어가지 않아 스테이지 아래 양끝으로 내린다. 카드와 겹치지 않는다
  const mobile = mediaBodies(css, /max-width:\s*767px/).join("\n");
  assert.match(mobile, /\.ch-depth-stage \{[^}]*--ch-depth-w:280px/);
  assert.match(mobile, /\.ch-arrow \{[^}]*top:auto;[^}]*bottom:var\(--cs-s3\);[^}]*margin-top:0;/);
  // 카드 맨 아래와 화살표 사이에 자리가 있다: 모바일 스테이지 높이 − (카드 top + 미디어 + 캡션 최소 높이) ≥ 화살표 44 + 여백 12 (캡션이 최소 높이보다 길어질 여유 포함)
  const stageH = Number(mobile.match(/\.ch-depth-stage \{[^}]*height:(\d+)px/)[1]);
  const cardTop = Number(declsOf(css, ".cs-site .cs-home .ch-depth-card").match(/top:(\d+)px/)[1]);
  const mediaH = Number(mobile.match(/\.ch-depth-media \{ height:(\d+)px/)[1]);
  const captionH = Number(mobile.match(/\.ch-depth-caption \{ min-height:(\d+)px/)[1]);
  assert.ok(stageH - (cardTop + mediaH + captionH + 2) >= 44 + 12, `mobile arrows clear of cards: ${stageH} - ${cardTop + mediaH + captionH + 2}`);
  // 누를 수 있는 곳은 44px 이상: 서비스 링크는 .cs-link(최소 44px), 영상 버튼 44px
  assert.match(declsOf(css, ".cs-site .cs-home .ch-hero-pause"), /width:\s*44px;\s*height:\s*44px;/);
  // reduced-motion: 루프·자동 넘김은 선언하지 않고 옆 카드는 숨기지 않는다
  for (const block of mediaBodies(css, /prefers-reduced-motion\s*:\s*reduce/)) {
    assert.doesNotMatch(block, /display\s*:\s*none/, "side cards stay visible");
    assert.doesNotMatch(block, /animation\s*:/, "no loop in reduced-motion");
  }
  // 모든 애니메이션 선언은 no-preference 안에만 있다
  let outside = css;
  for (const match of [...css.matchAll(/@media[^{}]+\{/g)].reverse()) {
    if (!/prefers-reduced-motion\s*:\s*no-preference/.test(match[0])) continue;
    outside = outside.slice(0, match.index) + outside.slice(blockEnd(css, match.index + match[0].length));
  }
  assert.doesNotMatch(outside, /(?:^|[;{\s])animation(?:-name)?\s*:/, "animation outside no-preference");
  // 쓰지 않는 이전 규칙은 새로 쓴 CSS에 없다
  assert.doesNotMatch(css, /\.ch-card\b|\.ch-stage\b|\.ch-step-tab\b|\.ch-work-media\b|\.ch-hero-formats|\.ch-detail|\.ch-chip|\.ch-making|\.ch-brief|\.ch-storyboard|\.ch-delivery|\.ch-production|\.ch-track/);
});

test("8-4. 실제 제작물 슬롯: 공개 파일·비공개 계보·실제 MP4와 대응 포스터", () => {
  assert.deepEqual(Object.keys(homeCardMedia), ORDER);
  for (const id of ORDER) {
    const slot = homeCardMedia[id];
    assert.equal(slot.slotId, `home-card-${id}`);
    assertPublicAsset(slot.poster);
    for (const image of slot.images ?? []) assertPublicAsset(image);
    assert.ok(slot.alt && slot.caseLabel && slot.caseNote, `${id} supplies an accurate case label`);
    assert.ok("video" in slot, `${id} keeps the video line`);
    if (slot.video !== undefined) {
      assertPublicAsset(slot.video);
      assert.equal(readFileSync(join("public", slot.video)).toString("ascii", 4, 8), "ftyp", `${id} is an MP4, not an image placeholder`);
    }
    assert.ok(slot.tag, `${id} preserves media context`);
    if (id === "ai-influencer") assert.equal(slot.tag, MEDIA_TAGS.aiPerson);
    if (id === "webtoon") assert.equal(slot.tag, MEDIA_TAGS.ownWebtoon);
  }
  assert.equal(contentHomeHero.reelSlot, "home-hero-reel");
  assert.ok(hasSource(showcase, "homeCardMedia[selection.tab.id]"));
  assert.ok(hasSource(showcase, "data-slot={media.slot ?? undefined}"));
  assert.ok(hasSource(read(join(componentDir, "film-stage.tsx")), "data-slot={contentHomeHero.reelSlot}"));
  assert.equal(homeCardMedia.animation.tag, "캐릭터·모션 활용", "related competence is not a customer animation delivery claim");
  assert.deepEqual(ORDER.filter(id => homeCardMedia[id].video), ["motion-graphics", "brand-film", "ad"]);
});

test("8-5. W-H3 필름 히어로: 유한 작품 선택과 원본 소개 영상 보존", () => {
  const film = code(read(join(componentDir, "film-stage.tsx")));
  assert.ok(hasSource(home, '<FilmStage />'));
  assert.equal((film.match(/<h1\b/g) || []).length, 1);
  assert.match(film, /기획한 이야기가/);
  assert.match(film, /움직이는 장면으로/);
  assert.match(film, /aria-pressed=\{index === selected\}/);
  assert.match(film, /ArrowRight/);
  assert.match(film, /ArrowLeft/);
  assert.match(film, /onTouchEnd/);
  assert.match(film, /<HomeCasePreview/);
  assert.match(film, /contentHomeHero\.video\.src/);
  assert.match(film, /preload="none"/);
  assert.doesNotMatch(film, /setInterval|setTimeout|autoPlay/);
  assert.equal(contentHomeHero.reelSlot, "home-hero-reel");
});

test("8-6. 실제 작품 dialog와 서비스 링크를 구분하고 옆 카드는 선택 이동", () => {
  assert.equal(contentHomeServicesHead.detailLink, "서비스 보기");
  // 캡션: 서비스명 · 시작가 / 한 줄 / 표시 태그 · 서비스 보기 →
  for (const part of [
    '<p className="ch-depth-title"><span className="cs-t-h3">{service.label}</span>',
    '<p className="ch-depth-line cs-t-small">{service.line}</p>',
    '<Link className="cs-link ch-depth-service-link" href={service.href} {...contentLinkProps(service.href,path)} tabIndex={selected ? undefined : -1} aria-label={`${service.label} ${head.detailLink}`}>{head.detailLink} <span aria-hidden="true">→</span>{contentLinkProps(service.href,path).target && <NewTabHint/>}</Link>',
  ])
    assert.ok(hasSource(showcase, part), part);
  // 카드 자체 링크: 선택된 카드에만, 같은 서비스 주소. 옆 카드는 선택 버튼(이동 없음)
  assert.ok(hasSource(showcase, '{selected && linkable ? <Link className="ch-depth-open" href={service.href} {...contentLinkProps(service.href,path)} tabIndex={-1} aria-hidden="true"/>:null}'));
  assert.ok(hasSource(showcase, "const linkable=!(reduced && cards[index].kind===\"video\");"));
  assert.ok(hasSource(showcase, '{!selected && !hidden ? <button className="ch-depth-select" type="button" tabIndex={-1} aria-label={`${selection.tab.label} 선택`} onClick={()=>select(index)}/>:null}'));
  // 서비스 6곳 모두 공개판에서 도달 가능: 카드마다 service.href 링크가 렌더되고 주소는 /content/services/<id>
  for (const s of contentHomeServices) assert.equal(s.href, `/content/services/${s.id}`);
  assert.equal((showcase.match(/href=\{service\.href\}/g) || []).length, 2, "caption link + whole-card link");
  assert.doesNotMatch(showcase, /selected && selection\.work \? <Link className="cs-link" href=\{`\/content\/projects[^`]*`\}>작업 자세히/);
  // 설명 블록(.ch-depth-detail)·활용처 칩·아코디언은 없다
  assert.doesNotMatch(showcase, /ServiceDetail|ch-depth-detail|role="tabpanel"|<details|ch-chips/);
  assert.doesNotMatch(css, /ch-depth-detail|ch-detail|ch-chips?\b|ch-svc-|ch-price-block|ch-note/);
  const preview = code(read(join(componentDir, "home-case-preview.tsx")));
  assert.match(preview, /<dialog\b/);
  assert.match(preview, /aria-labelledby="home-case-title"/);
  assert.match(preview, /dialog\.showModal\(\)/);
  assert.match(preview, /onClose=\{onClose\}/, "native Escape close updates preview state");
  assert.match(preview, /trigger\?\.focus\(/, "closing restores focus to the opener");
  assert.match(preview, /video\.pause\(\)/, "closing stops preview audio/video");
  assert.match(preview, /controls playsInline/, "actual MP4 can be controlled by the user");
  assert.match(preview, /media\.video/);
  assert.match(preview, /media\.caseNote/);
  assert.match(preview, /HomeArtwork/, "image cases preserve actual work images");
  // CSS: 캡션의 링크·작품 버튼만 직접 받고 빈 곳은 카드 링크가 받는다.
  assert.match(declsOf(css, ".cs-site .cs-home .ch-depth-caption"), /pointer-events:none;/);
  assert.match(css, /\.ch-depth-caption\s+:where\(a(?:,\s*button)?\)\s*\{[^}]*pointer-events:\s*auto;/);
  assert.match(css, /\.ch-depth-open,\s*\.cs-site \.cs-home \.ch-depth-select \{ position:absolute; inset:0;/);
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

test("10. 사용자 지정 v02 히어로: 정본 해시·16:9·기본 무음과 소리/재생 조작", () => {
  assert.deepEqual(contentHomeHero.video, {
    src: "/content-renewal-20261019/content-hero-v02.mp4",
    poster: "/content-renewal-20261019/content-hero-v02.webp",
  });
  const videoEntry = assertPublicAsset(contentHomeHero.video.src);
  const posterEntry = assertPublicAsset(contentHomeHero.video.poster);
  assert.equal(videoEntry.sha256, "2eaf074e040b600ca24239631a9c61f332373cb90eeffe409eeff57ecfb605c8");
  assert.equal(posterEntry.sha256, "39f6b1e7736a7fa1368a3c56b20c9222a0a5f2a6d6d3503fe8cdf23afb045690");
  assert.match(videoEntry.sourceId, /MG-20261019-01_콘텐츠히어로_v02.*web_v02\.mp4$/);
  assert.equal(statSync(join("public", contentHomeHero.video.src)).size, 14097604);
  const lib = read("lib/content-home.ts");
  assert.match(
    lib,
    /export type HeroVideo = \{ src: string; poster: string \}/,
  );
  assert.match(lib, /content-hero-v02\.mp4/);
  const media = read(join(componentDir, "hero-media.tsx"));
  assert.doesNotMatch(media, /^\s*["']use client["']/, "hero-media stays a server component");
  assert.match(media, /if \(!video\) return null;/);
  assert.match(media, /<HeroVideoLayer video=\{video\} \/>/);
  assert.match(media, /src=\{video\.poster\}/, "underlay is the reel's own poster, not a staged image");
  const video = read(join(componentDir, "hero-video.tsx"));
  assert.match(video, /^\s*["']use client["']/);
  assert.match(video, /useCsMotion/, "header motion toggle pauses the reel");
  assert.match(video, /prefers-reduced-motion: reduce/);
  assert.match(video, /if \(!mounted\) return null;/, "no <video> in server HTML");
  assert.match(video, /muted=\{muted\}/);
  assert.match(video, /useReelSound/);
  assert.match(video, /className="ch-hero-pause"/);
  assert.match(video, /className="ch-hero-sound cs-t-caption"/);
  assert.match(video, /aria-pressed=\{!actualMuted\}/);
  assert.match(video, /onVolumeChange[\s\S]*?setActualMuted/, "native controls and the sound button announce the same current state");
  const sound = code(read("components/content-site/services/reel-sound.ts"));
  assert.match(sound, /useState\(true\)/, "sound starts muted");
  assert.match(video, /소리 켜기/);
  assert.match(video, /소리 끄기/);
  assert.match(video, /IntersectionObserver/);
  assert.match(video, /document\.hidden/);
  assert.match(compact(video), /if\(wantPlay&&active\)/, "offscreen/hidden hero does not keep playing");
  // 영상 층·재생 버튼 CSS는 슬롯 안에서만 쓰인다
  assert.match(declsOf(css, ".cs-site .cs-home .ch-hero-video"), /position:\s*absolute;\s*inset:\s*0;/);
  assert.match(declsOf(css, ".cs-site .cs-home .ch-hero-video"), /object-fit:\s*contain;/, "59s reel is never cropped");
  assert.match(declsOf(css, ".cs-site .cs-home .ch-hero-img"), /object-fit:\s*contain;/, "the paired poster is never cropped");
  assert.match(declsOf(css, ".cs-site .cs-home .ch-hero-pause"), /position:\s*absolute;/);
  assert.doesNotMatch(video, /autoPlay|autoplay=/);
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

test("12. 제작 과정: 승인된 4단계·실제 작화·구매자가 확인하는 범위", () => {
  assert.deepEqual(
    contentHomeProcess.map((s) => s.label),
    ["상담", "기획", "제작", "납품"],
  );
  assert.equal(contentHomeProcess.length, 4);
  // R8 C5·C6: 받는 것 줄은 데이터·라벨·렌더에서 모두 삭제, 설명은 승인된 한 문장 그대로
  assert.deepEqual(
    contentHomeProcess.map((s) => s.text),
    [
      "목적과 채널, 제작 분량을 정합니다",
      "이야기와 문구, 장면 구성을 함께 확인합니다",
      "확인한 기획으로 장면을 만들고 수정 사항을 반영합니다",
      "최종 검수 후 합의한 형식으로 결과물을 전달합니다",
    ],
  );
  for (const s of contentHomeProcess) {
    assert.deepEqual(Object.keys(s).sort(), ["art", "label", "text"], s.label);
    assert.doesNotMatch(s.text, /[.。]$/, s.text);
    assert.doesNotMatch(s.text, /권리|원본|무제한|보장/, s.text);
  }
  assert.deepEqual(Object.keys(contentHomeProcessHead).sort(), ["eyebrow", "title", "titleEm"]);
  // 수정 횟수와 화면비 추가는 이제 과정 표에 없고 lib/content-pricing.ts의 확정 사실로만 남는다
  assert.deepEqual(pricing.contentPricing.common.revisions, ["기획안 전달 후 수정 2회", "최종안 전달 후 수정 1회"]);
  assert.ok(pricing.contentPricing.ad.notes.some((n) => /다른 화면비 추가/.test(n)), "pricing basis for the aspect-ratio fact");

  // 단계마다 장면 그림 종류(art)가 하나씩 있다: 체크리스트 · 콘티 · 흐림→선명 · 화면비 틀
  assert.deepEqual(contentHomeProcess.map((s) => s.art), ["checklist", "storyboard", "refine", "frames"]);

  // 구조: 장식 패널·탭 없이 ol > li 4행, 행마다 그림(aria-hidden) · 번호·단계(h3) · 설명 한 문장
  const steps = code(read(join(componentDir, "process-steps.tsx")));
  assert.doesNotMatch(steps, /^\s*["']use client["']/m, "table is a server component");
  assert.doesNotMatch(steps, /role="tab|tabpanel|useState|homeCardMedia|useStageActivity/);
  for (const part of [
    '<ProcessRun count={steps.length}>',
    '<li',
    'key={step.label}',
    'className="ch-step"',
    '<div className="ch-step-art" aria-hidden="true">',
    '<div className="ch-art-stage" data-art={step.art}>',
    '<h3 className="ch-step-name cs-t-h3">',
    '<span className="ch-step-num cs-t-num" aria-hidden="true">',
    "{String(index + 1).padStart(2, \"0\")}",
    '<p className="ch-step-text cs-t-small">{step.text}</p>',
  ])
    assert.ok(hasSource(steps, part), part);
  // 받는 것 줄·확인하는 것 라벨은 렌더에 없다
  assert.doesNotMatch(steps, /ch-step-output|ch-step-check|outputLabel|checkLabel|step\.output|step\.check|받는 것/);
  // 과정의 기획 그림은 실제 완성 컷을 콘티로 오인시키지 않고 문서형 장식으로 구분한다.
  assert.match(steps, /이야기.*캐릭터.*컷 구성/);
  assert.match(steps, /\/content-renewal-20261019\/webtoon-/);
  assertPublicAsset("/content-renewal-20261019/webtoon-05.webp");
  assertPublicAsset("/content-renewal-20261019/webtoon-21.webp");
  // 진행 모션의 시작 신호만 client(process-run.tsx): observer + reduced-motion이면 완료 상태 유지, 루프·타이머 없음
  const run = code(read(join(componentDir, "process-run.tsx")));
  assert.match(run, /^\s*["']use client["']/m);
  assert.match(run, /IntersectionObserver/);
  assert.match(run, /prefers-reduced-motion: reduce/);
  assert.match(run, /observer\.disconnect\(\)/, "one-shot: observer is released after the first run");
  assert.doesNotMatch(run, /setInterval|setTimeout|requestAnimationFrame/);
  assert.ok(hasSource(home, '<div className="cs-container cs-container--read">'));
  assert.ok(hasSource(home, "<ProcessSteps />"));
  assert.ok(hasSource(home, "eyebrow={processHead.eyebrow}") && hasSource(home, "title={processHead.title}"));
  assert.doesNotMatch(homeText + steps, /ProcessTabs|cs-t-statement|CONTENT BRIEF|예시/);

  // v11: 같은 단계 구조에서 그림+이름을 가운데 묶고 설명도 가운데 정렬한다.
  const row = declsOf(css, ".cs-site .cs-home .ch-step");
  assert.match(row, /border-top:\s*1px solid var\(--cs-line\);/);
  assert.doesNotMatch(row, /border:|border-(left|right|bottom)|background|box-shadow|border-radius|transform/);
  assert.match(row, /display:\s*flex;/);
  assert.match(row, /align-items:\s*center;/);
  assert.match(declsOf(css, ".cs-site .cs-home .ch-step-top"), /justify-content:\s*center;/);
  assert.match(declsOf(css, ".cs-site .cs-home .ch-step-text"), /text-align:\s*center;/);
  const wide = mediaBodies(css, /min-width:\s*768px/).join("\n");
  assert.match(wide, /\.ch-steps \{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\);/, "768: 2x2");
  const wider = mediaBodies(css, /min-width:\s*1024px/).join("\n");
  assert.match(wider, /\.ch-steps \{[^}]*grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\);/, "1024: 4 columns");
  // 컨테이너는 읽기 폭 880 제한 없이 전체 폭(--cs-container)을 쓴다
  assert.match(declsOf(css, ".cs-site .cs-home .ch-process .cs-container--read"), /max-width:\s*var\(--cs-container\);/);
  const textRules = [...css.matchAll(/([^{}]*\.ch-step(?:-name|-num|-text)?\s*)\{([^}]*)\}/g)];
  assert.ok(textRules.length >= 4, "step text rules found");
  assert.doesNotMatch(css, /ch-step-(?:check|output)/, "deleted output/check rules are gone");
  assert.doesNotMatch(row, /"art output"|"output"|"check/, "no leftover grid areas");
  for (const [, selector, decls] of textRules)
    assert.doesNotMatch(decls, /box-shadow|border-radius|rotate|transform|animation|background\s*:|border\s*:/, selector.trim());
  // 장면 그림은 허용된 이미지 틀: 모션은 no-preference 안에서만(data-run ready/run), 데이터 없으면 완료 상태 정지
  const motion = mediaBodies(css, /prefers-reduced-motion:\s*no-preference/).join("\n");
  assert.match(motion, /\.ch-steps\[data-run="ready"\] \.ch-step::before/);
  assert.match(motion, /\.ch-steps\[data-run="run"\] \.ch-step::before \{[^}]*calc\(var\(--i\) \* 1\.2s\)/, "1.2s step interval");
  assert.doesNotMatch(css.replace(/@media \(prefers-reduced-motion: no-preference\) \{[\s\S]*$/, ""), /transition|animation/ , "no motion outside the no-preference block");
  assert.doesNotMatch(css, /\.ch-(?:step|art)[^{}]*\{[^}]*(?:infinite|animation)/, "process motion does not loop");
  // 간격은 공통 토큰
  assert.match(declsOf(css, ".cs-site .cs-home .ch-process"), /padding-block:\s*var\(--cs-section-y\);/);
});

test("12-1. v11 간격·정렬: 공통 토큰 유지, 제작 과정과 문의 가운데 정렬", () => {
  // .cs-home --cs-section-y 덮어쓰기와 R2~R5 덧씌움 삭제
  assert.doesNotMatch(css, /--cs-section-y\s*:|--cs-section-y-sm\s*:|--cs-gutter\s*:|--cs-container\s*:/);
  assert.doesNotMatch(css, /R2 work-led|R3:|R4→R5/);
  for (const sel of [".ch-hero", ".ch-services", ".ch-process", ".ch-cta"]) {
    const d = declsOf(css, `.cs-site .cs-home ${sel}`);
    assert.ok(d, sel);
    assert.doesNotMatch(d, /border-top|border-bottom|min-height/, `${sel} no section line`);
  }
  assert.match(declsOf(css, ".cs-site .cs-home .ch-hero"), /padding-block:\s*var\(--cs-s5\) var\(--cs-section-y-sm\);/);
  assert.match(declsOf(css, ".cs-site .cs-home .ch-services"), /padding-block:\s*var\(--cs-section-y\);/);
  assert.match(declsOf(css, ".cs-site .cs-home .ch-cta"), /padding-block:\s*var\(--cs-section-y-sm\);/);
  // 사용자 지정 영역만 가운데로 정리하고 기존 히어로 비율·섹션 배치는 유지한다.
  assert.match(declsOf(css, ".cs-site .cs-home .ch-step-text"), /text-align:\s*center;/);
  assert.equal((css.match(/margin-inline:\s*auto/g) || []).length, 1);
  assert.match(declsOf(css, ".cs-site .cs-home .ch-hero-reel"), /margin-inline:\s*auto;/);
  assert.match(declsOf(css, ".cs-site .cs-home .ch-cta-inner"), /align-items:\s*center;[\s\S]*text-align:\s*center;/);
  assert.match(declsOf(css, ".cs-site .cs-home .ch-cta-copy"), /align-items:\s*center;/);
  assert.match(declsOf(css, ".cs-site .cs-home .ch-cta h2"), /white-space:\s*pre-line;/);
  // 상담 띠(CTA)는 유지
  assert.equal(contentHomeCta.href, "/content/contact");
  assert.equal(contentHomeCta.button, "상담 신청");
  assert.ok(hasSource(home, '<Link className="cs-btn cs-btn--lg ch-cta-button" href={cta.href}>'));
});

test("13. theme.css의 WP0 임시 다리 블록이 없다", () => {
  const theme = read("components/content-site/theme.css");
  assert.doesNotMatch(theme, /\.content-home|임시 다리|--service-nav-height|--site-header-height/);
  assert.doesNotMatch(theme, /\.cs-site [^{]*\.t-(h1|h2|h3|lead|body|small|caption|chip|button)\b/);
});
