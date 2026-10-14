// P2R WP-B — AI 인플루언서 · 모션그래픽 서비스 랜딩 전용 검사.
// 공통 규칙(카피·CSS 역할 토큰·client 섬·고객 문자열)은 tests/content-site.test.mjs가 6개 서비스에 함께 적용한다.
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { pricingPlans } from "../lib/content-pricing.ts";
import { contentLandings } from "../lib/content-site/index.ts";
import { aiInfluencerSignature } from "../lib/content-site/services/ai-influencer.ts";
import { motionGraphicsSignature } from "../lib/content-site/services/motion-graphics.ts";
import { creatorRoster } from "../lib/content-site/creator-roster.ts";

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

test("B-1. R2 4계정 자산: 기존 87언니 5개 보존·새 파생본 매니페스트 SHA 일치", () => {
  const dir = "public/content-site/ai-influencer";
  const added = JSON.parse(read("docs/renewal-2026-10-13/CREATOR_ASSETS_R2.json"));
  assert.equal(added.length, 9);
  assert.deepEqual(readdirSync(dir).sort(), [...Object.keys(UNNIE87), ...added.map(a=>a.dest.replaceAll("\\", "/").split("/").at(-1))].sort());
  for (const [name, hash] of Object.entries(UNNIE87))
    assert.equal(
      createHash("sha256").update(readFileSync(`${dir}/${name}`)).digest("hex"),
      hash,
      name,
    );
  for (const asset of added)
    assert.equal(createHash("sha256").update(readFileSync(asset.dest)).digest("hex"), asset.outputSha256, asset.dest);
  for (const creator of creatorRoster)
    for (const source of [creator.portrait, ...creator.images.map(image=>image.src)])
      assert.ok(existsSync(`public${source}`), source);
});

test("B-2. R2 계정 카드·피드: 확인된 4계정·AI 표기·허구 성과 없음", () => {
  // R5: 계정 카드·피드는 client 섬(creator-experience.tsx)이 렌더한다. 랜딩은 섹션과 표기 문구만 둔다
  const landing = read(`${AI}/landing.tsx`);
  const island = read(`${AI}/creator-experience.tsx`);
  assert.deepEqual(creatorRoster.map(c=>c.name).sort(), ["기록하는87", "옆집엄마", "그레이스의정원", "쌀만드는아저씨"].sort());
  assert.equal(new Set(creatorRoster.map(c=>c.id)).size, 4);
  for (const creator of creatorRoster) {
    assert.match(creator.bio, /AI 가상인물/);
    assert.equal(creator.images.length, 3);
    assert.doesNotMatch(JSON.stringify(creator), /팔로워|조회수|좋아요|게시물 \d|성과|구독자/);
  }
  // 인물 이미지의 대체 문구는 모두 'AI 가상인물'로 끝난다(장식 썸네일 alt=""만 예외)
  const images = island.match(/<Image\b[\s\S]*?\/>/g) ?? [];
  assert.ok(images.length >= 3);
  for (const block of images)
    if (!/alt=""/.test(block)) assert.match(block, /alt=\{`[^`]*AI 가상인물`\}/, block);
  assert.match(island, /<span className="cs-t-caption">AI 가상인물<\/span>/);
  assert.match(island, /AI 가상인물 · 계정 소개/);
  assert.match(island, /자체 IP · AI 가상인물 4명/);
  assert.match(landing, /자체 IP 계정 소개 · 피드 구성 예시/);
  const sig = aiInfluencerSignature;
  for (const alt of [sig.persona.alt, ...sig.sheet.views.map((v) => v.alt)])
    assert.match(alt, /· AI로 만든 가상인물$/, alt);
  // 87언니는 늘 'AI 가상인물'과 함께 보인다
  assert.match(sig.persona.role, /AI 가상인물/);
  assert.match(sig.sheet.profile.role, /AI 가상인물/);
  assert.deepEqual(sig.disclosure.items.slice(0, 2), ["AI 가상인물 표기", "광고 표기"]);
  // 계정 게시·운영 별도 견적은 가격 주석 한 곳에만(VERIFY_FINAL_P2R WP-B-1). 랜딩 데이터(히어로·범위·FAQ)에는 없다
  const ai = contentLandings["ai-influencer"];
  assert.equal(ai.hero.note, undefined);
  const notes = pricingPlans("ai-influencer").notes.filter((n) => /계정/.test(n));
  assert.deepEqual(notes, ["계정 게시·운영 및 대량 제작은 별도 견적"]);
  const flat = JSON.stringify({ ...ai, signature: undefined });
  assert.doesNotMatch(flat, /계정 (게시|운영)|게시와 운영|게시·운영/);
  assert.doesNotMatch(island, /팔로워|조회수|좋아요|성과|구독자|운영 중|게시 중/);
  // 히어로 덱의 링크가 계정 소개 섹션으로 이어지고, 계정마다 탭 패널 id가 있다
  assert.match(island, /href="#sheet"/);
  assert.match(island, /id=\{`creator-\$\{creator\.id\}`\}/);
  assert.match(landing, /id="sheet"/);
});

test("B-3. 두 랜딩은 서버 렌더 경계를 유지한다", () => {
  for (const dir of [AI, MG]) {
    const files = readdirSync(dir).filter((f) => f.endsWith(".tsx"));
    // R5: AI 인플루언서는 고유 client 섬 1개(creator-experience.tsx)만 허용. 모션그래픽도 live 구성 1개(type-composition.tsx, WP-S1)
    const clients = files.filter((f) => /^\s*["']use client["']/.test(read(`${dir}/${f}`)));
    assert.deepEqual(clients, dir === AI ? ["creator-experience.tsx"] : ["type-composition.tsx"], dir);
    const landing = read(`${dir}/landing.tsx`);
    assert.doesNotMatch(landing, /^\s*["']use client["']/, `${dir}/landing.tsx`);
    assert.match(landing, /<ServiceHero\b/);
    assert.equal((landing.match(/\bpriority\b/g) ?? []).length <= 1, true, `${dir} priority <= 1`);
    for (const m of landing.matchAll(/data-cs-section="(\w+)"/g))
      assert.ok(["hero", "signature"].includes(m[1]), m[1]);
  }
});

test("B-4. R5 모션그래픽: 도형 루프·글자 반복 스태거·배치 전환이 함께 움직이고 화면 밖에서 멈춘다", () => {
  const css = read(`${MG}/motion-graphics.css`).replace(/\/\*[\s\S]*?\*\//g, "");
  // 롱핸드만(움직임 토글 play-state 유지), 도형마다 다른 주기·지연
  assert.doesNotMatch(css, /(?:^|[;\s{])animation\s*:/);
  for (const name of ["drift", "spin", "tumble", "stretch", "bounce", "letter-a", "letter-b", "letter-c"])
    assert.match(css, new RegExp(`@keyframes cs-svc-motion-graphics-${name}\\b`), name);
  assert.match(css, /animation-delay: calc\(var\(--w\) \* 220ms \+ var\(--l\) \* 70ms\)/);
  // 배치가 바뀌면 글자 애니메이션 이름이 바뀌어 진입이 다시 시작되고, 도형·글자는 같은 배치 변수(--tx·--ty·--ts)로 함께 옮겨진다
  for (const mode of [1, 2]) {
    assert.match(css, new RegExp(`\\[data-type-mode="${mode}"\\] \\.cs-svc-motion-graphics-live-letter \\{ animation-name: cs-svc-motion-graphics-letter-`));
    assert.match(css, new RegExp(`\\[data-type-mode="${mode}"\\] \\[data-shape="ring"\\] \\{ --tx`));
    assert.match(css, new RegExp(`\\[data-type-mode="${mode}"\\] \\[data-word="1"\\] \\{ --tx`));
  }
  assert.match(css, /transition: left 900ms[^;]*scale 900ms/);
  const ui = read(`${MG}/type-composition.tsx`);
  assert.match(ui, /useInViewPlay\(stage, \{[^}]*pauseOnInteract: true/);
  assert.match(ui, /useAutoCycle\(MODES\.length/);
  assert.match(ui, /aria-pressed=\{mode===index\}/);
  // 작품 영상 자동재생은 강제하지 않는다
  assert.doesNotMatch(read(`${MG}/landing.tsx`), /autoPlay|setInterval/);
});

test("B-5. 모션그래픽 단순형과 맞춤형의 제작 범위 데이터 유지", () => {
  const landing = read(`${MG}/landing.tsx`);
  // 구도 글자는 히어로·단순형·맞춤형·스타일 프레임마다 다르고 모두 두 줄(WP-B-4)
  const words = [
    motionGraphicsSignature.stage.title,
    ...motionGraphicsSignature.compare.plans.map((p) => p.word),
    motionGraphicsSignature.frame.word,
  ];
  assert.equal(new Set(words).size, words.length, "composition words differ");
  for (const w of words) assert.equal(w.split("\n").length, 2, w);
  assert.deepEqual(
    motionGraphicsSignature.compare.plans.map((p) => p.name),
    ["단순형", "맞춤형"],
  );
  assert.doesNotMatch(landing, /keyframes\.css/);
});
