// P2R WP-B — AI 인플루언서 · 모션그래픽 서비스 랜딩 전용 검사.
// 공통 규칙(카피·CSS 역할 토큰·client 섬·고객 문자열)은 tests/content-site.test.mjs가 6개 서비스에 함께 적용한다.
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { contentLandings } from "../lib/content-site/index.ts";
import { aiInfluencerSignature } from "../lib/content-site/services/ai-influencer.ts";
import { motionGraphicsSignature } from "../lib/content-site/services/motion-graphics.ts";

const read = (path) => readFileSync(path, "utf8");
const AI = "components/content-site/services/ai-influencer";
const MG = "components/content-site/services/motion-graphics";

// 87언니(자체 AI 가상인물) 공개용 webp. 원본 PNG를 가로 1080px 이하로 줄인 파생본(RESULT_WPB 자산 표).
const UNNIE87 = {
  "unnie87-face.webp": "198a2b4d9ef0f9b83fb70dff3e599d6fd3954b4acf65a1a9386164fcb6a46bc6",
  "unnie87-front.webp": "7718c9f119a9be060dde12a131e72f79453ee17dfe622e574733b055e634f2af",
  "unnie87-side.webp": "580dd17e481a5623b7367ae91563dc9436322cd7ce33afb2ab3af50f0133f3c6",
  "unnie87-full.webp": "9a87f6ef79c727f6bbf3ad81756f21459d1119b644d0ed5722f1f36c714d20e0",
  "unnie87-street.webp": "379351437d5784e6ab186a46c89dd339f3e7f7f2c46d753112b1c18a04cd5854",
};

test("B-1. 87언니 공개 자산: 정해진 5개만, SHA 일치, 랜딩이 쓰는 경로와 같다", () => {
  const dir = "public/content-site/ai-influencer";
  assert.deepEqual(readdirSync(dir).sort(), Object.keys(UNNIE87).sort());
  for (const [name, hash] of Object.entries(UNNIE87))
    assert.equal(
      createHash("sha256").update(readFileSync(`${dir}/${name}`)).digest("hex"),
      hash,
      name,
    );
  const landing = read(`${AI}/landing.tsx`);
  const used = [...landing.matchAll(/"\/content-site\/ai-influencer\/([\w-]+\.webp)"/g)].map((m) => m[1]);
  assert.deepEqual([...new Set(used)].sort(), Object.keys(UNNIE87).sort());
});

test("B-2. AI 가상인물 표기: 사람 이미지마다 aiPerson 태그와 'AI로 만든 가상인물' alt", () => {
  const landing = read(`${AI}/landing.tsx`);
  const media = landing.match(/<CsMedia\b[\s\S]*?\/>/g) ?? [];
  assert.ok(media.length >= 2);
  for (const block of media) assert.match(block, /tag=\{MEDIA_TAGS\.aiPerson\}/, block);
  const sig = aiInfluencerSignature;
  for (const alt of [sig.persona.alt, ...sig.sheet.views.map((v) => v.alt)])
    assert.match(alt, /· AI로 만든 가상인물$/, alt);
  // 87언니는 늘 'AI 가상인물'과 함께 보인다
  assert.match(sig.persona.role, /AI 가상인물/);
  assert.match(sig.sheet.profile.role, /AI 가상인물/);
  assert.deepEqual(sig.disclosure.items.slice(0, 2), ["AI 가상인물 표기", "광고 표기"]);
  // 계정 운영은 별도 견적 한 줄(히어로 note)로만
  assert.equal(contentLandings["ai-influencer"].hero.note, "계정 게시·운영 및 대량 제작은 별도 견적");
  assert.match(landing, /id="sheet"/);
  assert.match(landing, /href="#sheet"/);
});

test("B-3. 두 랜딩: 서버 컴포넌트, 히어로 계약(data-cs-section·aria-labelledby·CsHeroCopy)", () => {
  for (const dir of [AI, MG]) {
    const files = readdirSync(dir).filter((f) => f.endsWith(".tsx"));
    for (const f of files)
      assert.doesNotMatch(read(`${dir}/${f}`), /^\s*["']use client["']/, `${dir}/${f}`);
    const landing = read(`${dir}/landing.tsx`);
    assert.match(landing, /data-cs-section="hero"/);
    assert.match(landing, /aria-labelledby=\{HERO_TITLE_ID\}/);
    assert.match(landing, /<CsHeroCopy\b/);
    assert.equal((landing.match(/\bpriority\b/g) ?? []).length <= 1, true, `${dir} priority <= 1`);
    for (const m of landing.matchAll(/data-cs-section="(\w+)"/g))
      assert.ok(["hero", "signature"].includes(m[1]), m[1]);
  }
});

test("B-4. 모션그래픽 움직임: 축약형 animation 0, 루프는 reduced-motion no-preference 안, 키프레임 이름 일치", () => {
  const css = read(`${MG}/motion-graphics.css`).replace(/\/\*[\s\S]*?\*\//g, "");
  assert.doesNotMatch(css, /(?:^|[;\s{])animation\s*:/, "no animation shorthand (keeps the motion toggle's play-state)");
  const motionBlock = css.match(/@media \(prefers-reduced-motion: no-preference\) \{([\s\S]*)\}\s*$/);
  assert.ok(motionBlock, "motion block is last");
  const outside = css.slice(0, motionBlock.index);
  assert.doesNotMatch(outside, /animation-|transition/, "animation only inside no-preference");
  const used = new Set(
    [...motionBlock[1].matchAll(/animation-name:\s*([\w-]+)/g)].map((m) => m[1]).filter((n) => n !== "none"),
  );
  // 키프레임은 서비스 CSS 한 파일 안(분리 파일 없음)
  assert.equal(existsSync(`${MG}/motion-graphics.keyframes.css`), false);
  const defined = new Set([...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]));
  for (const name of defined) assert.match(name, /^cs-svc-motion-graphics-/);
  assert.deepEqual([...used].sort(), [...defined].sort());
  // @keyframes 단계에는 transform 말고 다른 속성이 없다(첫 프레임 = 정지 구도)
  for (const block of css.matchAll(/@keyframes[\s\S]*?\{((?:[^{}]*\{[^{}]*\})*)\s*\}/g))
    for (const decl of block[1].matchAll(/([\w-]+)\s*:/g)) assert.equal(decl[1], "transform");
  // 움직임 토글로 멈추면 정지 구도(animation-name: none)
  assert.match(motionBlock[1], /\[data-motion="paused"\][\s\S]*animation-name:\s*none/);
});

test("B-5. 모션그래픽 장식 무대: aria-hidden, 문자열은 데이터에서, 태그 '연출 예시'", () => {
  const landing = read(`${MG}/landing.tsx`);
  assert.match(landing, /className="cs-svc-motion-graphics-comp"[^>]*aria-hidden="true"/);
  assert.equal(motionGraphicsSignature.stage.title, motionGraphicsSignature.frame.word);
  assert.equal(motionGraphicsSignature.stage.title.split("\n").length, 2);
  const tags = landing.match(/<CsTag overlay>\{MEDIA_TAGS\.(\w+)\}<\/CsTag>/g) ?? [];
  assert.equal(tags.length, 3);
  for (const t of tags) assert.match(t, /MEDIA_TAGS\.staged/);
  assert.deepEqual(
    motionGraphicsSignature.compare.plans.map((p) => p.name),
    ["단순형", "맞춤형"],
  );
  assert.doesNotMatch(landing, /keyframes\.css/);
});
