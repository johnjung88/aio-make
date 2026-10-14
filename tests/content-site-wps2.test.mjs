// R5 WP-S2 — AI 인플루언서 · 브랜드 홍보 영상 · SNS 광고 모션 계약(소스 정적 검사).
// 실제 시간차 프레임·화면 밖 정지·모바일 스와이프는 독립 검증(VERIFY_R5)이 브라우저에서 확인한다.
// 공통 규칙(CSS 범위·no-preference 안의 움직임·style= 0·autoPlay 0·client 섬 1개·고객 문자열)은 tests/content-site.test.mjs가 함께 적용한다.
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { creatorRoster } from "../lib/content-site/creator-roster.ts";
import { getExampleMedia } from "../lib/content-site/example-media.ts";

const read = (path) => readFileSync(path, "utf8");
const code = (path) => read(path).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const DIR = "components/content-site/services";
const AI = `${DIR}/ai-influencer`;
const FILM = `${DIR}/brand-film`;
const AD = `${DIR}/ad`;
/** @media (prefers-reduced-motion: no-preference) { … } 블록 본문 */
const motionBlock = (css) => {
  const start = css.indexOf("@media (prefers-reduced-motion: no-preference)");
  assert.ok(start >= 0, "no-preference block");
  let depth = 0;
  for (let i = css.indexOf("{", start); i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) return css.slice(start, i + 1);
  }
  return css.slice(start);
};

test("S2-0. 서비스마다 고유 client 섬 1개, 죽은 파일 제거", () => {
  const clients = (dir) => readdirSync(dir).filter((f) => f.endsWith(".tsx") && /^\s*["']use client["']/.test(read(`${dir}/${f}`)));
  assert.deepEqual(clients(AI), ["creator-experience.tsx"]);
  assert.deepEqual(clients(FILM), ["film-timeline.tsx"]);
  assert.deepEqual(clients(AD), ["ad-reel.tsx"]);
  assert.equal(existsSync(`${FILM}/film-control.tsx`), false, "FilmControl은 어디서도 쓰지 않아 삭제");
  for (const dir of [AI, FILM, AD]) assert.doesNotMatch(code(`${dir}/landing.tsx`), /^\s*["']use client["']/);
});

test("S2-1. AI 인플루언서: 4장 3D 카드 자동 회전 · 정지 조건 · 조작 · 피드 순차 진입", () => {
  const island = code(`${AI}/creator-experience.tsx`);
  const css = code(`${AI}/ai-influencer.css`);
  // 약 4초 간격, hover·focus·터치·화면 밖·숨김 탭에서 멈추는 공용 훅
  assert.match(island, /const DECK_MS = 4000;/);
  assert.match(island, /useInViewPlay\(root, \{ threshold: \.3, pauseOnInteract: true \}\)/);
  assert.match(island, /useAdvance\(rotating, DECK_MS, active,/);
  // 클릭·스와이프·키보드 선택 유지, 가로로 분명히 민 경우만 넘김
  assert.match(island, /onClick=\{\(\) => select\(index\)\}/);
  assert.match(island, /Math\.abs\(dx\) > 45 && Math\.abs\(dx\) > Math\.abs\(dy\) \* 1\.2/);
  assert.match(island, /\["ArrowLeft", "ArrowRight", "Home", "End"\]/);
  // 앞·양옆·뒤 4자리: 컨텐츠 홈 캐러셀 수치
  for (const place of ["0", "1", "-1", "2"]) assert.match(css, new RegExp(`orbit-card\\[data-place="${place}"\\]`));
  assert.match(css, /--svc-side-turn: 42deg;/);
  // R6: 거리는 카드 너비 비율(480px 카드의 -170px = -.354w). 상세 기하는 content-site-wpb.test.mjs B-6
  assert.match(css, /--svc-side-z: calc\(var\(--svc-card-w\) \* -\.354\);/);
  assert.match(css, /scale\(\.88\)/);
  assert.match(css, /scale\(\.72\)/);
  // R6: 히어로 덱의 피드 3컷 줄은 삭제. 계정 소개(탭) 쪽 피드 썸네일이 순서대로 들어온다
  const motion = motionBlock(css);
  assert.match(motion, /cs-svc-ai-influencer-post-in/);
  assert.match(motion, /feed-thumbs button\[data-order="1"\][^{]*\{ animation-delay: 500ms; \}/);
  assert.match(motion, /transition-property: transform, opacity, filter;/);
  // 세로 스크롤을 막지 않는다
  assert.match(css, /\.cs-svc-ai-influencer-orbit \{[^}]*touch-action: pan-y;/);
  assert.match(css, /\.cs-svc-ai-influencer-feed-stage \{[^}]*touch-action: pan-y;/);
  // 탭 대상 44px 이상
  assert.match(css, /deck-arrow \{[^}]*width: 44px;[^}]*height: 44px;/);
  assert.match(css, /tabs button \{[^}]*min-height: 44px;/);
  // 문단은 움직이지 않는다: 움직임 블록에 문단·소개 선택자가 없다
  assert.doesNotMatch(motion, /deck-bar|profile|feed-caption|\.cs-t-(body|lead|small)/);
  // 카드 슬롯 4개(연출 예시 영상 슬롯이 오면 그대로 대체)
  assert.deepEqual(creatorRoster.map((c) => c.cardSlot), ["ai-card-1", "ai-card-2", "ai-card-3", "ai-card-4"]);
  assert.match(island, /slot\.kind === "video" \|\| slot\.src\.includes\(creator\.id\)/);
});

test("S2-2. 브랜드 영상: 보일 때만 자동재생 · 30/60 재배치 · 재생 헤드", () => {
  const island = code(`${FILM}/film-timeline.tsx`);
  const landing = code(`${FILM}/landing.tsx`);
  const css = code(`${FILM}/brand-film.css`);
  // 스크롤 연동 프레임 확대는 공용 MotionCanvas variant="brand-film"(ServiceHero 안)을 그대로 쓴다
  assert.match(landing, /<ServiceHero data=\{data\} wide/);
  assert.match(read(`${DIR}/service-motion.css`), /data-motion-variant="brand-film"\]\[data-motion-ready="true"\] \{ transform:scale\(calc\(\.88 \+ var\(--cs-frame-progress,1\) \* \.12\)\)/);
  // 공개판 메인 영상: 연출 예시 슬롯, 무음·반복·인라인, 보일 때만 play()
  assert.match(landing, /getExampleMedia\("brand-film", "main"\)/);
  assert.match(landing, /fallback=\{<FilmScreen /);
  assert.match(island, /<video ref=\{video\}[^>]*muted loop playsInline/);
  assert.match(island, /useInViewPlay\(root, \{ threshold: \.35 \}\)/);
  assert.match(island, /if \(playing && !held\) \{ node\.muted = true; node\.play\(\)/);
  // 30/60 전환마다 켜진 칸이 다시 들어온다(버전마다 다른 키프레임 이름) + 너비 재배치
  assert.match(island, /data-version=\{active\}/);
  assert.match(island, /data-on=\{on\}/);
  const motion = motionBlock(css);
  assert.match(motion, /track\[data-version="0"\] li\[data-on="true"\] \{ animation-name: cs-svc-brand-film-seg-a; \}/);
  assert.match(motion, /track\[data-version="1"\] li\[data-on="true"\] \{ animation-name: cs-svc-brand-film-seg-b; \}/);
  assert.match(motion, /transition-property: flex-grow,/);
  // 재생 헤드: 영상 currentTime/duration, 영상이 없으면 12초 루프 시계
  assert.match(island, /node\.currentTime \/ node\.duration/);
  assert.match(island, /setProperty\("--svc-playhead"/);
  assert.match(island, /const LOOP_MS = 12 \* 1000;/);
  assert.match(css, /left: calc\(var\(--svc-playhead, 0\) \* 100%\);/);
  // 재생/정지 44px
  assert.match(css, /\.cs-svc-brand-film-toggle \{[^}]*width: 44px;[^}]*height: 44px;/);
});

test("S2-3. SNS 광고(R6): 기울어진 3열 레일 9초 왕복만 남고 중앙 영상 카드는 없다 · 모바일 넘침 없음", () => {
  const island = code(`${AD}/ad-reel.tsx`);
  const landing = code(`${AD}/landing.tsx`);
  const css = code(`${AD}/ad.css`);
  // 공개판 조기 반환 제거: 레일은 작업물 유무와 관계없이 렌더된다
  assert.doesNotMatch(island, /if\s*\(\s*!enabled\s*\)\s*return children/);
  assert.doesNotMatch(landing, /enabled=/);
  assert.match(landing, /getExampleMedia\("ad", "rail"\)/);
  // 검토판은 실제 작업물만(연출 예시와 섞지 않음)
  assert.match(landing, /const media = work \? reviewCards\(works, work\) : examples\.map\(fromSlot\);/);
  // R6: 중앙 영상 카드 삭제(공개판 연출 예시 · 검토판 FeaturedWork · 진행 막대 · 재생 토글 · 그림자 · children 경로)
  for (const [name, text] of [["landing", landing], ["ad-reel", island], ["ad.css", css]])
    assert.doesNotMatch(text, /ad-center|centerExample|CenterMedia|CenterScreen|FeaturedWork|reel-center|ad-screen|screen-(bar|toggle|media)|svc-center-w|svc-progress|svc-screen-shadow|children/, `${name} 중앙 카드 흔적`);
  assert.doesNotMatch(landing, /<AdRail[^>]*>\s*\{/, "AdRail에 children을 넘기지 않는다");
  assert.match(island, /export function AdRail\(\{ columns, tag \}: \{ columns: RailCard\[\]\[\]; tag\?: string \}\)/);
  assert.doesNotMatch(island, /<video ref=\{video\}|toggle|aria-label=\{running/, "재생 토글 없음");
  assert.equal(getExampleMedia("ad").some((slot) => slot.id === "ad-center-1"), false, "ad-center-1 슬롯 삭제");
  // 레일이 히어로 미디어 칸 전체를 쓴다: 레일 장식은 aria-hidden 유지
  assert.match(island, /<div className="cs-svc-ad-rail" aria-hidden="true">/);
  assert.match(css, /\.cs-svc-ad-rail \{[^}]*position: absolute;[^}]*inset: 0;/);
  // 3열, 기울기 -11°, 9초 ease-in-out 왕복(R5의 2배 속도), 열마다 다른 방향·위상(주기 비율 유지)
  assert.equal((landing.match(/\["[mt]", "[mt]", "[mt]", "[mt]"\]/g) ?? []).length, 3);
  assert.match(css, /--svc-tilt: -11deg;/);
  assert.match(css, /rotate\(var\(--svc-tilt\)\)/);
  const motion = motionBlock(css);
  assert.match(motion, /animation-duration: 9s;/);
  assert.doesNotMatch(css, /animation-duration: 18s;/);
  assert.match(motion, /animation-direction: alternate;/);
  assert.match(motion, /animation-timing-function: ease-in-out;/);
  assert.match(motion, /rail-column\[data-column="1"\] \{ animation-name: cs-svc-ad-rail-down; animation-delay: -2\.25s; \}/);
  assert.match(motion, /rail-column\[data-column="2"\] \{ animation-delay: -4\.5s; \}/);
  // 화면 밖·숨김 탭·움직임 끔·키보드 초점에서 정지
  assert.match(island, /useInViewPlay\(root, \{ threshold: \.2 \}\)/);
  assert.match(motion, /\.cs-svc-ad-reel\[data-play="paused"\] \.cs-svc-ad-rail-column/);
  assert.match(motion, /\.cs-svc-ad-reel:focus-within \.cs-svc-ad-rail-column \{ animation-play-state: paused; \}/);
  // 움직임은 no-preference 블록에만
  assert.doesNotMatch(css.replace(motion, ""), /animation-|transition/);
  // 모바일: 레일은 보이고 레일 영역 밖으로 넘치지 않는다
  assert.match(css, /\.cs-svc-ad-reel \{[^}]*overflow: clip;/);
  assert.match(css, /\.cs-svc-ad-rail \{[^}]*overflow: clip;/);
  assert.doesNotMatch(css, /@media \(max-width: 767px\) \{[^@]*\.cs-svc-ad-rail[^{]*\{[^}]*display: none/);
});

test("S2-3b. SNS 광고(R6): 브랜드 광고 30초 시안은 브랜드 홍보 영상으로 이동 · 작업 순서 틀에는 WorkSequence만", () => {
  const work = JSON.parse(read("content/works/bwl-brand-ad.json"));
  assert.equal(work.primaryService, "brand-film");
  assert.equal(work.relatedServices.some((item) => item.id === "ad"), false);
  assert.equal(work.relatedServices.some((item) => item.id === "brand-film"), true);
  assert.match(read("lib/generated/works.generated.ts"), /"slug": "bwl-brand-ad",[\s\S]*?"primaryService": "brand-film",/);
  // 브랜드 홍보 페이지는 계속 이 작품을 우선 고른다
  assert.match(code(`${FILM}/landing.tsx`), /item\.slug === "bwl-brand-ad"/);
  // 광고 랜딩: 히어로 → WorkSequence 하나(ProductionNotes 삭제, 공통 가격 아래 포함·별도로 흡수)
  const landing = code(`${AD}/landing.tsx`);
  assert.equal((landing.match(/<WorkSequence /g) ?? []).length, 1);
  assert.doesNotMatch(landing, /ProductionNotes|한 제품, 한 콘셉트/);
  const data = read("lib/content-site/services/ad.ts");
  assert.match(data, /릴스와 쇼츠에서 제품 하나를 알리는 9:16 광고 영상을 기획하고 자막과 음악까지 편집합니다"/);
  assert.doesNotMatch(data, /collage|hook:|frames:/);
});
