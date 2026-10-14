// /content 컨텐츠 사이트 홈(P3 → P2R WP-D → R5 WP-H 모션) 테스트.
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
  contentHomeServicesHead.autoplayPause,
  contentHomeServicesHead.autoplayPlay,
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
  // Read balanced media blocks so nested keyframes and whitespace do not change the contract
  let outsideMotion = body;
  const mediaBlocks = [...body.matchAll(/@media[^{}]+\{/g)];
  for (const match of mediaBlocks.reverse()) {
    if (!/prefers-reduced-motion\s*:\s*no-preference/.test(match[0])) continue;
    let depth = 1, end = match.index + match[0].length;
    while (end < body.length && depth) {
      if (body[end] === "{") depth++;
      if (body[end] === "}") depth--;
      end++;
    }
    outsideMotion = outsideMotion.slice(0, match.index) + outsideMotion.slice(end);
  }
  assert.doesNotMatch(outsideMotion, /transition\s*:/, "transition outside no-preference");
});

test("8-1. R5 3D 작업 갤러리: 조작과 접근성은 유지한다", () => {
  // Actual intermediate transform, active content and motion safety are browser contracts
  const showcase = read(join(componentDir, "service-showcase.tsx"));
  assert.match(showcase, /selections:\s*ContentSelection\[\]/);
  assert.match(showcase, /role="tablist"/);
  assert.match(showcase, /role="tabpanel"/);
  assert.match(showcase, /aria-selected=/);
  assert.match(showcase, /tabIndex=\{index\s*===\s*current\s*\?\s*0\s*:\s*-1\}/);
  for (const key of ["ArrowRight", "ArrowLeft", "Home", "End"])
    assert.ok(showcase.includes(`"${key}"`), key);
  assert.match(showcase, /aria-label="이전 서비스"/);
  assert.match(showcase, /aria-label="다음 서비스"/);
  assert.match(showcase, /video\.pause\(\)/);
  assert.doesNotMatch(showcase, /setInterval|autoPlay|className="ch-stage"/);
  assert.match(showcase, /\/content\/projects\//);
  // 모바일 스와이프: 가로 45px·가로 우세 1.2배만 넘기고, 세로 스크롤은 브라우저(touch-action: pan-y)가 처리
  assert.match(showcase, /Math\.abs\(dx\)>45 && Math\.abs\(dx\)>Math\.abs\(dy\)\*1\.2/);
  assert.match(showcase, /suppressClick\.current=true/);
  const css = code(read(join(componentDir, "content-home.css")));
  assert.match(css, /\.ch-depth-stage \{[^}]*touch-action:pan-y/);
  // All four step outputs remain reachable by labelled tabs and keyboard
  const tabs = read(join(componentDir, "process-tabs.tsx"));
  assert.match(tabs, /role="tablist"/);
  assert.match(tabs, /role="tabpanel"/);
  for (const key of ["ArrowDown", "ArrowUp", "Home", "End"]) assert.ok(tabs.includes(key));
  assert.match(tabs, /step\.output/);

  // 버튼은 컨텐츠 사이트 버튼(.cs-btn)만, 크기는 서비스 히어로와 같은 lg
  const home = read(join(componentDir, "content-home.tsx"));
  assert.equal((home.match(/cs-btn--lg/g) || []).length, 3);
  // R3는 cs-t-button 역할을 사용한다. 실제 첫 작품 위치/높이는 브라우저에서 검증한다
  assert.doesNotMatch(home, /className="t-button"/);
});

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test("8-2. R5 캐러셀 자동 넘김: 레퍼런스 수치와 정지 조건", () => {
  const showcase = code(read(join(componentDir, "service-showcase.tsx")));
  const css = code(read(join(componentDir, "content-home.css")));
  const m = homeCarouselMotion;
  // 레퍼런스 dist/app.js updateCarousel 관측값
  assert.equal(m.dwellMs, 3500);
  assert.equal(m.shiftDesktop, 365);
  assert.equal(m.shiftMobile, 212);
  assert.equal(m.depthDesktop, 170);
  assert.equal(m.depthMobile, 95);
  assert.equal(m.rotateDeg, 42);
  assert.deepEqual([...m.scale], [1, 0.88, 0.72]);
  assert.deepEqual([...m.opacity], [1, 0.85, 0.55]);
  assert.equal(m.transitionMs, 650);
  assert.ok(css.includes(`--ch-depth-shift:${m.shiftDesktop}px`));
  assert.ok(css.includes(`--ch-depth-shift:${m.shiftMobile}px`));
  assert.ok(css.includes(`--ch-depth-z:${m.depthDesktop}px`));
  assert.ok(css.includes(`--ch-depth-z:${m.depthMobile}px`));
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
  assert.ok(css.includes(".ch-depth-card { transition:transform .65s cubic-bezier(.22,.75,.23,1),opacity .5s ease,filter .5s ease; }"));

  // 자동 넘김: 진행 막대 CSS 애니메이션이 끝나면 다음 카드(타이머 없음). 막대 시간 = 데이터 값
  assert.match(showcase, /onAnimationEnd=\{advance\}/);
  assert.ok(showcase.includes('event.animationName!=="cs-ch-autoplay" || !running'));
  assert.ok(css.includes(`.ch-autoplay-fill { animation:cs-ch-autoplay ${m.dwellMs / 1000}s linear forwards; }`));
  assert.ok(css.includes(`.ch-autoplay-fill[data-dwell="video"] { animation-duration:${m.videoDwellMs / 1000}s; }`));
  assert.ok(css.includes('.ch-gallery[data-autoplay="paused"] .ch-autoplay-fill { animation-play-state:paused; }'));
  // 수동 조작은 막대를 처음부터(key={cycle}), 사용자가 직접 멈출 수 있다
  assert.ok(showcase.includes('<span key={cycle} className="ch-autoplay-fill"'));
  assert.ok(showcase.includes("setCycle(value=>value+1)"));
  assert.ok(showcase.includes("head.autoplayPause"));

  // 정지 조건: 화면 밖·탭 숨김(useStageActivity) · 헤더 움직임 토글 · reduced-motion · 사용자 멈춤 · hover · 키보드 포커스 · 터치 중 · 열린 상세
  for (const contract of [
    'const moving=inView && motion==="on" && !reduced;',
    "const autoplay=!reduced;",
    "const running=moving && !userPaused && !hover && !focusPause && !touching && !detailsOpen;",
    'data-autoplay={autoplay ? (running ? "running":"paused") : "off"}',
    'onPointerEnter={event=>{if(event.pointerType==="mouse")setHover(true);}}',
    'onPointerLeave={event=>{if(event.pointerType==="mouse")setHover(false);}}',
    'matches(":focus-visible")',
    "setTouching(true);",
    "onTouchCancel=",
    'addEventListener("toggle",update,true)',
    "useCsMotion()",
    // 자동 회전 중에는 스크린 리더 알림을 끄고, 멈췄을 때만 알린다
    'aria-live={running ? "off" : "polite"}',
    // 선택 카드 작품만 움직인다: 영상은 선택 카드에만 마운트해 muted 루프, 이미지는 켄번스
    "play={selected && moving}",
    "node.muted=true;node.play()",
    "muted loop playsInline",
    "controls={reduced}",
  ])
    assert.ok(showcase.includes(contract), contract);
  const activity = read(join(componentDir, "use-stage-activity.ts"));
  assert.match(activity, /IntersectionObserver/);
  assert.match(activity, /document\.hidden/);
  assert.match(activity, /prefers-reduced-motion: reduce/);
  assert.ok(css.includes('.ch-depth-card[data-pos="0"] .ch-kb { animation:cs-ch-kb '));
  assert.ok(css.includes('.ch-gallery[data-active="false"] .ch-kb { animation-play-state:paused; }'));
});

test("8-3. reduced-motion: 옆 카드를 숨기지 않고 루프·자동 넘김은 선언하지 않는다", () => {
  const css = code(read(join(componentDir, "content-home.css")));
  const blockEnd = (start) => {
    let depth = 1, end = start;
    while (end < css.length && depth) {
      if (css[end] === "{") depth++;
      if (css[end] === "}") depth--;
      end++;
    }
    return end;
  };
  const reducedBlocks = [...css.matchAll(/@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)\s*\{/g)];
  assert.ok(reducedBlocks.length >= 1);
  for (const block of reducedBlocks) {
    const body = css.slice(block.index, blockEnd(block.index + block[0].length));
    assert.doesNotMatch(body, /display\s*:\s*none/, "side cards stay visible");
    assert.doesNotMatch(body, /animation\s*:/, "no loop in reduced-motion");
  }
  // 모든 애니메이션 선언은 no-preference 안에만 있다
  let outside = css;
  for (const match of [...css.matchAll(/@media[^{}]+\{/g)].reverse()) {
    if (!/prefers-reduced-motion\s*:\s*no-preference/.test(match[0])) continue;
    outside = outside.slice(0, match.index) + outside.slice(blockEnd(match.index + match[0].length));
  }
  assert.doesNotMatch(outside, /(?:^|[;{\s])animation(?:-name)?\s*:/, "animation outside no-preference");
  // 쓰지 않는 이전 캐러셀(.ch-card)·목록·단계 탭·R2 작업 카드 규칙은 지웠다
  assert.doesNotMatch(css, /\.ch-card\b|\.ch-stage\b|\.ch-step-tab\b|\.ch-work-media\b/);
  // 누를 수 있는 곳은 44px 이상
  assert.match(css, /\.ch-hero-formats a \{[^}]*min-height:44px/);
  assert.match(css, /\.ch-detail-more summary \{[^}]*min-height:44px/);
  assert.match(css, /\.ch-depth-nav \.ch-arrow \{[^}]*width:44px; height:44px;/);
});

test("8-4. 홈 카드·쇼릴 소재 슬롯(사용자 Higgsfield 영상이 오면 데이터 한 줄 교체)", () => {
  assert.deepEqual(Object.keys(homeCardMedia), ORDER);
  for (const id of ORDER) {
    const slot = homeCardMedia[id];
    assert.equal(slot.slotId, `home-card-${id}`);
    assert.ok(existsSync(join("public", slot.poster)), `${slot.poster} exists`);
    assert.ok("video" in slot, `${id} keeps the video line`);
    if (slot.video !== undefined) {
      assert.match(slot.video, /^\/content-examples\/[\w-]+\.mp4$/);
      assert.ok(existsSync(join("public", slot.video)), `${slot.video} exists`);
    }
    const tag = id === "ai-influencer" ? MEDIA_TAGS.aiPerson : id === "webtoon" ? MEDIA_TAGS.ownWebtoon : MEDIA_TAGS.staged;
    assert.equal(slot.tag, tag, id);
  }
  assert.equal(contentHomeHero.reelSlot, "home-hero-reel");
  const showcase = read(join(componentDir, "service-showcase.tsx"));
  assert.ok(showcase.includes("homeCardMedia[selection.tab.id]"));
  assert.ok(showcase.includes("data-slot={media.slot ?? undefined}"));
  const tabs = read(join(componentDir, "process-tabs.tsx"));
  assert.ok(tabs.includes('homeCardMedia["motion-graphics"]'));
  const home = read(join(componentDir, "content-home.tsx"));
  assert.ok(home.includes("data-slot={hero.reelSlot}"));
});

test("8-5. 히어로와 제작 과정도 움직인다(연출 예시 표기 유지)", () => {
  const home = read(join(componentDir, "content-home.tsx"));
  const css = code(read(join(componentDir, "content-home.css")));
  // 연출 예시 이미지 층: 바깥 패럴랙스(scroll timeline) · 안쪽 드리프트, 화면 밖이면 HeroStage가 멈춘다
  assert.ok(home.includes("<HeroStage>"));
  assert.ok(home.includes('className="ch-hero-parallax"><div className="ch-hero-drift">'));
  assert.ok(home.includes('feature.tag ? <span className="cs-tag cs-tag--overlay cs-t-caption">{feature.tag}</span>'));
  assert.ok(css.includes(".ch-hero-drift { animation:cs-ch-drift "));
  assert.ok(css.includes("animation-timeline:scroll(root block)"));
  assert.match(css, /\.ch-hero-works\[data-active="false"\][^{]*\{ animation-play-state:paused; \}/);
  const stage = read(join(componentDir, "hero-stage.tsx"));
  assert.match(stage, /useStageActivity\(\)/);
  assert.match(stage, /useCsMotion\(\)/);
  // 과정 탭: 장면을 key로 다시 마운트해 탭마다 순차 진입을 재생하고, 선택 장면 안 재료는 계속 움직인다
  const tabs = read(join(componentDir, "process-tabs.tsx"));
  for (const contract of [
    'className="ch-making-art" data-step={current} key={current}',
    'data-active={moving ? "true":"false"}',
    'const moving=active && !reduced && motion==="on";',
  ])
    assert.ok(tabs.includes(contract), contract);
  for (const delay of [
    ".ch-storyboard figure:nth-child(4) { animation-delay:.36s",
    ".ch-track-clips span:nth-child(4) { animation-delay:.75s",
    '.ch-delivery-file[data-index="2"] { animation-delay:.3s',
    '.ch-delivery-file[data-index="2"] .ch-file-ok { animation-delay:.85s',
    "cs-board-focus 4.8s ease-in-out infinite",
    '.ch-making[data-active="false"] .ch-making-art',
    '.ch-making[data-still="true"] .ch-making-art :is(*) { animation:none; }',
  ])
    assert.ok(css.includes(delay), delay);
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
  assert.match(home, /hero\.video \?[^\n]*<HeroMedia\s*\/>[^\n]*: null/, "provided reel is optional and is not fabricated when absent");
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
