// R5 FIX1 — VERIFY_R5 결함 1·2·3·5·6 회귀 검사(소스 정적 검사). 실제 스와이프·스크롤 프레임은 독립 검증이 브라우저에서 확인한다.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getExampleMedia } from "../lib/content-site/example-media.ts";

const read = (path) => readFileSync(path, "utf8");
const code = (path) => read(path).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const SV = "components/content-site/services";
const CUSTOMER = /reference-review|BWL|DR's Secret|닥터시크릿|힐러넷|HEALERNET|YoFree|요프리|bwl-|yofree-|healernet-/i;

test("FIX1-1. 홈 캐러셀: 영상 위에서 시작한 가로 스와이프도 넘어간다(조작 막대 영상·링크·버튼만 제외)", () => {
  const showcase = code("components/content-home/service-showcase.tsx");
  const css = code("components/content-home/content-home.css");
  assert.match(showcase, /closest\("video\[controls\], a, button"\)/);
  assert.doesNotMatch(showcase, /closest\("video, a, button"\)/);
  assert.match(css, /\.ch-depth-media > video:not\(\[controls\]\) \{ pointer-events:none; \}/);
  assert.match(css, /\.ch-depth-stage \{[^}]*touch-action:pan-y/);
  // 탭·클릭으로 여는 동작과 44px 조작은 그대로
  assert.match(showcase, /className="ch-depth-select"[^>]*onClick=\{\(\)=>select\(index\)\}/);
  assert.match(showcase, /suppressClick\.current=true/);
  // AI 인플루언서 덱은 대상 제외 없이 무대 전체에서 스와이프를 받는다
  const deck = code(`${SV}/ai-influencer/creator-experience.tsx`);
  assert.doesNotMatch(deck, /closest\("video/);
  assert.match(deck, /className="cs-svc-ai-influencer-orbit" \{\.\.\.swipe\}/);
});

test("FIX1-2. 브랜드 영상 프레임 확대: 모바일에서도 보이도록 .88에서 시작하고 상단 절반 기준 진행값을 쓴다", () => {
  const runtime = code(`${SV}/motion-runtime.tsx`);
  const css = code(`${SV}/service-motion.css`);
  assert.match(runtime, /frame: trackFrame = false/);
  assert.match(runtime, /"--cs-frame-progress", Math\.max\(0, Math\.min\(1, 1 - rect\.top \/ \(innerHeight \* \.5\)\)\)/);
  assert.match(runtime, /frame: variant === "brand-film"/);
  assert.match(css, /transform:scale\(calc\(\.88 \+ var\(--cs-frame-progress,1\) \* \.12\)\); border-radius:calc\(28px - var\(--cs-frame-progress,1\) \* 28px\); overflow:clip;/);
  // 축소만 하므로 가로 넘침이 없다(scale <= 1)
  assert.doesNotMatch(css, /brand-film"\]\[data-motion-ready="true"\] \{[^}]*scale\(1\.[0-9]/);
});

test("FIX1-3. SNS 광고 공개판: 장면 전환 묶음이 예시 슬롯 3컷으로 렌더되고 고객 문자열이 없다", () => {
  const landing = code(`${SV}/ad/landing.tsx`);
  assert.match(landing, /<WorkSequence work=\{work\} portrait service="ad" labels=/);
  const scenes = getExampleMedia("ad", "scene");
  assert.equal(scenes.length, 3);
  for (const slot of scenes) {
    assert.equal(slot.aspect, "9x16");
    assert.doesNotMatch(JSON.stringify(slot), CUSTOMER);
  }
  const sequence = code(`${SV}/work-sequence.tsx`);
  assert.match(sequence, /portrait=\{slots\.every\(slot => slot\.aspect === "9x16"\)\}/);
  assert.match(code(`${SV}/service-motion.css`), /\.cs-scene-chapter--ad \.cs-scene-screen\[data-portrait="true"\] \.cs-scene-image \{ object-fit:cover; \}/);
});

test("FIX1-5·6. 광고 레일 태그는 한 줄, 애니메이션 히어로 태그는 위쪽에 둔다", () => {
  const ad = code(`${SV}/ad/ad.css`);
  assert.match(ad, /\.cs-svc-ad-reel-tag \.cs-tag \{[^}]*white-space: nowrap;[^}]*text-overflow: ellipsis;/);
  const animation = code(`${SV}/animation/animation.css`);
  assert.match(animation, /\.cs-svc-animation-hero-example > \.cs-tag \{ top: 12px; bottom: auto; \}/);
  assert.match(animation, /\.cs-svc-animation-hero-example \{ max-width: min\(100%, max\(300px, calc\(\(100svh - 240px\) \* 2 \/ 3\)\)\)/);
});
