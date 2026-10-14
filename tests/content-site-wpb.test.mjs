// P2R WP-B — AI 인플루언서 · 모션그래픽 서비스 랜딩 전용 검사 (R6 WP-B 개정).
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
const strip = (text) => text.replace(/\/\*[\s\S]*?\*\//g, "");
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

test("B-2. R2 4계정 카드·피드: 확인된 4계정·AI 표기·허구 성과 없음 (R6 덱 개편 반영)", () => {
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
  // 히어로 카드마다 'AI 가상인물' 표기가 카드 안에 있고, 계정 소개에도 표기가 남는다
  assert.match(island, /<span className="cs-svc-ai-influencer-orbit-tag cs-t-caption">AI 가상인물<\/span>/);
  assert.match(island, /AI 가상인물 · 계정 소개/);
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
  assert.doesNotMatch(JSON.stringify(sig.brand), /계정 (게시|운영)|게시와 운영|게시·운영/);
  assert.doesNotMatch(island, /팔로워|조회수|좋아요|성과|구독자|운영 중|게시 중/);
  // 계정마다 탭 패널 id가 있고 계정 소개 섹션은 #sheet 앵커를 유지한다
  assert.match(island, /id=\{`creator-\$\{creator\.id\}`\}/);
  assert.match(landing, /id="sheet"/);
});

test("B-3. 두 랜딩은 서버 렌더 경계를 유지한다", () => {
  for (const dir of [AI, MG]) {
    const files = readdirSync(dir).filter((f) => f.endsWith(".tsx"));
    // R6: AI 인플루언서는 고유 client 섬 1개(creator-experience.tsx)만 허용. 모션그래픽은 MOTION STUDY 삭제로 client 섬이 없다
    const clients = files.filter((f) => /^\s*["']use client["']/.test(read(`${dir}/${f}`)));
    assert.deepEqual(clients, dir === AI ? ["creator-experience.tsx"] : [], dir);
    const landing = read(`${dir}/landing.tsx`);
    assert.doesNotMatch(landing, /^\s*["']use client["']/, `${dir}/landing.tsx`);
    assert.match(landing, /<ServiceHero\b/);
    assert.equal((landing.match(/\bpriority\b/g) ?? []).length <= 1, true, `${dir} priority <= 1`);
    for (const m of landing.matchAll(/data-cs-section="(\w+)"/g))
      assert.ok(["hero", "signature"].includes(m[1]), m[1]);
  }
});

test("B-4. R6 모션그래픽: MOTION STUDY 박스·단순형/맞춤형 2칸·ProductionNotes 삭제", () => {
  // 파일·훅·문구
  assert.equal(existsSync(`${MG}/type-composition.tsx`), false, "type-composition.tsx 삭제");
  const landing = read(`${MG}/landing.tsx`);
  const caseFile = read(`${MG}/character-case.tsx`);
  for (const text of [strip(landing), strip(caseFile)])
    assert.doesNotMatch(text, /TypeComposition|type-composition|compositionImage|slotImage|MEDIA_TAGS|ProductionNotes|cs-service-plan-compare|motion-bg-1/);
  for (const path of [`${MG}/landing.tsx`, `${MG}/character-case.tsx`, `${MG}/motion-graphics.css`, "lib/content-site/services/motion-graphics.ts"])
    assert.doesNotMatch(strip(read(path)), /MOTION STUDY|TYPE IN MOTION|단순형 가격 보기|맞춤형 가격 보기/, path);
  // CSS: composition/live/도형·글자 규칙과 키프레임이 없다
  const css = strip(read(`${MG}/motion-graphics.css`));
  assert.doesNotMatch(css, /-composition|-live|-modes|data-type-mode|-letter|-tumble|-stretch|-bounce|-pan\b|-comp\b|-plan|-pane|-stage|-glow/);
  assert.doesNotMatch(css, /(?:^|[;\s{])animation\s*:/);
  // 남은 키프레임은 히어로 예시 장식 두 개뿐
  assert.deepEqual([...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]).sort(), ["cs-svc-motion-graphics-drift", "cs-svc-motion-graphics-spin"]);
  // 단순형/맞춤형 설명은 데이터에서도 사라졌고 가격 섹션(공통)이 맡는다
  assert.deepEqual(Object.keys(motionGraphicsSignature), ["characterCase"]);
  assert.deepEqual(
    pricingPlans("motion-graphics").groups[0].plans.map((p) => p.label),
    ["단순형 30초", "단순형 60초", "맞춤형 30초", "맞춤형 60초"],
  );
  // 작품 영상 자동재생은 강제하지 않는다
  assert.doesNotMatch(landing, /autoPlay|setInterval/);
  // 섹션 순서: 히어로 → 화면 전환 시퀀스 → 캐릭터 제작 사례(가격은 공통 레지스트리가 뒤에 붙인다)
  assert.ok(landing.indexOf("<WorkSequence") < landing.indexOf("<CharacterCase"));
  assert.match(landing, /<ServiceHero\b/);
  const registry = read("components/content-site/service-landing.tsx");
  assert.ok(registry.indexOf("<Signature") < registry.indexOf("<CsPricing"));
});

test("B-5. R6 모션그래픽 캐릭터 제작 사례: 공개판은 일반 공정 3단계, 요프리 실물은 검토판 분기에만", () => {
  const c = motionGraphicsSignature.characterCase;
  assert.deepEqual(c.steps.map((step) => step.title), ["캐릭터 설정", "포즈 디자인", "모션 제작"]);
  assert.equal(c.title.replaceAll("\n", " "), "브랜드 전용 캐릭터는 이렇게 만듭니다");
  // 공개 데이터에는 고객명·제품명·수치·기간이 없다(설정 단계는 일반 서술: 성격·세계관 같은 구체 설정을 지어내지 않는다)
  assert.doesNotMatch(JSON.stringify(c), /reference-review|BWL|닥터시크릿|힐러넷|HEALERNET|YoFree|요프리|yofree|밸런스/i);
  assert.doesNotMatch(c.steps.map((step) => step.body).join(" ").replace(/30초/g, ""), /\d/);
  assert.equal(c.steps[0].body, "브랜드의 말투와 성격, 쓰는 장면의 규칙을 먼저 정합니다");
  assert.doesNotMatch(c.steps[0].body, /세계관|외형|귀여|밝은|친근/);
  assert.match(c.steps[1].body, /제품을 의인화한 점토 질감/);
  assert.match(c.steps[1].body, /이미지 생성 도구/);
  assert.match(c.steps[2].body, /배경을 제거한 컷아웃/);
  assert.match(c.steps[2].body, /30초 광고 영상/);
  // 서버 컴포넌트: client 섬이 아니고 환경 변수를 읽지 않으며, 검토판 분기는 서버가 넘긴 works 안에서만 고른다
  const code = strip(read(`${MG}/character-case.tsx`));
  assert.doesNotMatch(code, /^\s*["']use client["']/);
  assert.doesNotMatch(code, /process\.env|work-catalog|works\.server|generated/);
  assert.match(code, /const REVIEW_CASE = "yofree-mg30";/);
  assert.match(code, /works\?\.find\(\(work\) => work\.slug === REVIEW_CASE\)/);
  assert.match(code, /\{reviewWork \? <ReviewCase work=\{reviewWork\} \/> : null\}/);
  // 공개 단계 목록은 reviewWork와 무관하게 항상 렌더된다
  assert.ok(code.indexOf("c.steps.map") < code.indexOf("<ReviewCase work"));
  // 고객 slug는 서버 컴포넌트 한 곳에만 있고 데이터(lib)·landing·CSS에는 없다
  for (const path of ["lib/content-site/services/motion-graphics.ts", `${MG}/landing.tsx`, `${MG}/motion-graphics.css`])
    assert.doesNotMatch(read(path), /yofree|요프리|YoFree/i, path);
  // 검토 데이터: 실제 작품은 광고 3편(영상 4개)이고 검토판 선택에 들어온다. 6포즈 이미지는 아직 작품 데이터에 없다
  const work = JSON.parse(read("content/works/yofree-mg30.json"));
  assert.equal(work.primaryService, "motion-graphics");
  assert.equal(work.visibility, "review");
  assert.equal(work.rightsConfirmed, false);
  assert.ok(work.media.every((m) => m.kind === "video"));
});

test("B-6. R6 AI 인플루언서 히어로: 글 위 · 덱 아래 전체 폭, 카드 데스크톱 480x672 · 모바일 290x406, 잘리지 않는 기하", () => {
  const css = strip(read(`${AI}/ai-influencer.css`));
  const island = read(`${AI}/creator-experience.tsx`);
  const landing = read(`${AI}/landing.tsx`);
  // 레이아웃: wide 히어로(글 위 · 미디어 전체 폭), 모바일에서도 글 → 덱 순서
  assert.match(landing, /<ServiceHero data=\{data\} media=\{<CreatorDeck\/>\} wide\/>/);
  assert.match(css, /@media \(max-width: 767px\) \{[\s\S]*grid-template-areas: "heading" "copy" "media";/);
  // 카드 크기: 너비 한 변수에서 파생. 모바일 min(75vw, 290px), 768 이상 min(480px, 48vw), 높이 비 1.4(480x672 · 290x406)
  assert.match(css, /--svc-card-w: min\(75vw, 290px\);/);
  assert.match(css, /@media \(min-width: 768px\) \{\s*\.cs-svc-ai-influencer \{ --svc-card-w: min\(480px, 48vw\); \}/);
  assert.match(css, /--svc-card-h: calc\(var\(--svc-card-w\) \* 1\.4\);/);
  assert.equal(480 * 1.4, 672);
  assert.equal(Math.round(290 * 1.4), 406);
  // 덱 높이 · 옆 카드 간격 · 원근은 모두 카드 너비 비율 (고정 px가 아니다)
  assert.match(css, /--svc-orbit-h: calc\(var\(--svc-card-h\) \+ 24px\);/);
  assert.match(css, /--svc-side-x: calc\(var\(--svc-card-w\) \* \.625\);/);
  assert.match(css, /--svc-side-z: calc\(var\(--svc-card-w\) \* -\.354\);/);
  assert.match(css, /--svc-persp: calc\(var\(--svc-card-w\) \* 2\.3\);/);
  assert.match(css, /perspective: var\(--svc-persp\);/);
  assert.match(css, /--svc-side-turn: 42deg;/);
  // 컨테이너: 가로만 자르고(세로 그림자는 보이게) 모바일은 거터만큼 넓혀 화면 끝까지 쓴다
  assert.match(css, /\.cs-svc-ai-influencer-deck \{[^}]*overflow-x: clip;/);
  assert.doesNotMatch(css, /\.cs-svc-ai-influencer-deck \{[^}]*overflow: clip;/);
  assert.match(css, /\.cs-svc-ai-influencer-deck \{ margin-inline: calc\(var\(--cs-gutter\) \* -1\); \}/);
  // sizes: 모바일 카드는 뷰포트 75%, 데스크톱은 480
  assert.match(island, /sizes="\(max-width:767px\) 75vw, 480px"/);
  assert.doesNotMatch(island, /56vw|245px|120px/);
  // 기하 계산: 카드 너비 w의 비율로 옆 카드의 가로 끝을 투영해 컨테이너 안에 들어오는지 확인한다
  const theme = read("components/content-site/theme.css");
  assert.match(theme, /--cs-container: 1440px;/);
  assert.match(theme, /--cs-gutter: clamp\(20px, 4vw, 56px\);/);
  const gutter = (vw) => Math.min(56, Math.max(20, vw * 0.04));
  const half = (vw) => (Math.min(vw, 1440) - 2 * gutter(vw)) / 2;
  const persp = 2.3, sideX = 0.625, sideZ = -0.354, scale = 0.88, turn = (42 * Math.PI) / 180;
  const project = (x, z) => (x * persp) / (persp - z);
  // 오른쪽 옆 카드(rotateY(-42deg): 바깥 끝이 가까워진다)의 바깥·안쪽 끝
  const outer = project(sideX + (scale / 2) * Math.cos(turn), sideZ + (scale / 2) * Math.sin(turn));
  const inner = project(sideX - (scale / 2) * Math.cos(turn), sideZ - (scale / 2) * Math.sin(turn));
  assert.ok(outer > 0.9 && outer < 0.95, `outer ${outer}`);
  for (let vw = 768; vw <= 2560; vw += 8) {
    const w = Math.min(480, 0.48 * vw);
    assert.ok(w * outer <= half(vw), `desktop ${vw}px: side card extends ${Math.round(w * outer)} > half container ${Math.round(half(vw))}`);
    if (vw >= 1000) assert.equal(w, 480, `${vw}px card is 480`);
  }
  // 모바일 앞 카드는 뷰포트 75% 이내이고 컨테이너(거터 안) 폭 안에 완전히 들어온다. 옆 카드는 앞 카드 뒤에서 화면 끝으로 살짝 보인다
  for (let vw = 320; vw <= 767; vw += 4) {
    const w = Math.min(0.75 * vw, 290);
    assert.ok(w <= 0.75 * vw + 1e-9, `${vw}px card <= 75vw`);
    assert.ok(w <= vw - 2 * gutter(vw), `${vw}px front card fits the container`);
    assert.ok(inner * w < w / 2, `${vw}px side card starts behind the front card`);
  }
  assert.equal(Math.min(0.75 * 390, 290), 290);
});

test("B-7. R6 AI 인플루언서 히어로 덱: 카드 아래 이름 한 줄과 좌우 화살표만, 옛 요소 삭제", () => {
  const island = strip(read(`${AI}/creator-experience.tsx`));
  const css = strip(read(`${AI}/ai-influencer.css`));
  // 삭제: 피드 3컷 줄 · 이름 버튼 4개 · 타이머 막대 · 카피(카테고리·한 줄·링크·자체 IP 줄)
  const deck = island.slice(island.indexOf("export function CreatorDeck"), island.indexOf("function CreatorFeed"));
  assert.ok(deck.length > 200);
  for (const gone of ["deck-feed", "deck-select", "deck-timer", "deck-copy", "orbit-name", "계정과 피드 보기", "자체 IP", "creator.category", "creator.line", "creator.images", "aria-pressed"])
    assert.ok(!deck.includes(gone), `deck: ${gone}`);
  for (const gone of ["deck-feed", "deck-select", "deck-timer", "deck-copy", "orbit-name", "계정과 피드 보기", "자체 IP · AI 가상인물 4명"])
    assert.ok(!island.includes(gone), `island: ${gone}`);
  for (const gone of ["deck-feed", "deck-select", "deck-timer", "deck-copy", "orbit-name"])
    assert.ok(!css.includes(gone), `css: ${gone}`);
  // 남은 것: 이름 한 줄 + 이전/다음 화살표(44px)
  assert.match(island, /className="cs-svc-ai-influencer-deck-bar" role="group" aria-label="크리에이터 선택"/);
  assert.match(island, /aria-label="이전 크리에이터" onClick=\{\(\) => select\(active - 1\)\}/);
  assert.match(island, /aria-label="다음 크리에이터" onClick=\{\(\) => select\(active \+ 1\)\}/);
  assert.match(island, /<p className="cs-svc-ai-influencer-deck-name cs-t-label">\{creator\.name\}<\/p>/);
  assert.match(css, /deck-arrow \{[^}]*width: 44px;[^}]*height: 44px;/);
  // 자동 회전과 정지 조건은 유지
  assert.match(island, /const DECK_MS = 4000;/);
  assert.match(island, /useInViewPlay\(root, \{ threshold: \.3, pauseOnInteract: true \}\)/);
  assert.match(island, /useAdvance\(rotating, DECK_MS, active,/);
});

test("B-8. R6 AI 인플루언서 브랜드 전용 인물 제작: Types와 BeforePricing를 한 섹션으로, 3항목 텍스트 + 표기 고지 한 문장", () => {
  const landing = read(`${AI}/landing.tsx`);
  const css = strip(read(`${AI}/ai-influencer.css`));
  const brand = aiInfluencerSignature.brand;
  assert.equal(brand.items.length, 3);
  assert.deepEqual(brand.items.map((i) => i.title), ["캐릭터 기준", "이미지 구성", "영상 확장"]);
  assert.equal(brand.notice, "AI 가상인물 표기 · 광고 표기 · 플랫폼 합성 컨텐츠 설정을 함께 안내합니다");
  // 고지 문장은 영상 항목에 되풀이하지 않는다
  assert.doesNotMatch(brand.items[2].body, /표시|표기/);
  assert.match(landing, /\{brand\.notice\}/);
  // 박스 없는 텍스트 행(위 가는 선만): 테두리 + 면 + 패딩 카드가 아니다
  const rule = css.match(/\.cs-svc-ai-influencer-deliverables li \{[^}]*\}/)?.[0] ?? "";
  assert.match(rule, /border-top: 1px solid var\(--cs-line\)/);
  assert.doesNotMatch(rule, /background|border-radius|box-shadow|padding: 28px/);
  // 히어로 lead
  assert.equal(
    contentLandings["ai-influencer"].hero.lead,
    "얼굴과 말투, 관심사를 정해 브랜드 전용 AI 가상인물을 만들고 제품 이미지와 숏폼을 제작합니다",
  );
  // 계정 소개 섹션은 탭과 '모두 펼쳐 보기'를 유지하고, 소개 섹션이 브랜드 인물 섹션보다 먼저 온다
  assert.ok(landing.indexOf("function Signature") < landing.indexOf("function BeforePricing"));
  const island = read(`${AI}/creator-experience.tsx`);
  assert.match(island, /role="tablist" aria-label="계정 소개"/);
  assert.match(island, /네 계정 모두 펼쳐 보기/);
  // 계정 소개 패널은 박스가 없고(아래 선 없음) 피드 화면은 왼쪽 기준이다
  assert.doesNotMatch(css, /\.cs-svc-ai-influencer-panel \{[^}]*border-bottom/);
  assert.doesNotMatch(css, /\.cs-svc-ai-influencer-feed-ui \{[^}]*margin-inline: auto/);
  // 87언니는 AI 가상인물로만 표기한다
  assert.doesNotMatch(JSON.stringify(brand), /87언니/);
});
