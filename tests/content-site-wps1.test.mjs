// R5 WP-S1 — 공개판 연출 예시 소재 · 고객 정보 경계 · 공용 모션 런타임 검사.
// 실행: node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/content-site-wps1.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { EXAMPLE_MEDIA, focusData, getExampleMedia, getSlot } from "../lib/content-site/example-media.ts";
import { MEDIA_TAGS } from "../lib/content-site/types.ts";

const CUSTOMER =
  /reference-review|BWL|DR's Secret|DR&#x27;s Secret|닥터시크릿|힐러넷|HEALERNET|YoFree|요프리|bwl-|yofree-|healernet-/i;
const SERVICES = ["webtoon", "animation", "ai-influencer", "motion-graphics", "brand-film", "ad"];
const SV = "components/content-site/services";
const read = (path) => readFileSync(path, "utf8");
const code = (path) => read(path).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? walk(path) : [path];
});
const isClient = (path) => /^\s*["']use client["']/.test(read(path));
const sha = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");

test("S1-1. 고객 정보 경계: 장면 전환 client 섬에는 고객 slug·이름·경로가 없고 서버가 장면 목록을 정한다", () => {
  // 지적 사항: R4 scene-sequence.tsx(client)가 고객 slug별 발췌 시점 표와 /reference-review 경로를 번들에 담았다
  const scene = read(`${SV}/scene-sequence.tsx`);
  assert.ok(isClient(`${SV}/scene-sequence.tsx`));
  assert.doesNotMatch(scene, CUSTOMER, "scene-sequence client bundle customer string");
  assert.doesNotMatch(code(`${SV}/scene-sequence.tsx`), /\bslug\b/, "client receives computed scenes, not slugs");
  assert.match(scene, /scenes: readonly SceneFrame\[\]/);
  // 서버 분기: server-only, 검토 작품(work)이 있을 때만 발췌 경로를 만들고 없으면 연출 예시 슬롯만
  const sequence = code(`${SV}/work-sequence.tsx`);
  assert.ok(!isClient(`${SV}/work-sequence.tsx`));
  assert.match(sequence, /^\s*import "server-only";/);
  assert.match(sequence, /if \(work && review\)/);
  assert.match(sequence, /getExampleMedia\(service, "scene"\)/);
  assert.doesNotMatch(sequence, /process\.env/);
  // 서비스 아래 모든 client 섬에 고객 문자열 0(WP-S2 파일 포함 전체 감시)
  for (const path of walk(SV).filter((f) => /\.tsx?$/.test(f) && isClient(f)))
    assert.doesNotMatch(read(path), CUSTOMER, `${path} client customer string`);
  // 공개 예시 데이터·매니페스트에도 고객 문자열 0
  assert.doesNotMatch(read("lib/content-site/example-media.ts"), CUSTOMER);
  assert.doesNotMatch(read("public/content-examples/MANIFEST.json"), CUSTOMER);
  // 내 랜딩은 고객 작품을 서버에서 slug로만 찾고 공개판 대체 화면은 슬롯을 쓴다
  for (const id of ["webtoon", "animation", "motion-graphics"])
    assert.ok(!isClient(`${SV}/${id}/landing.tsx`), id);
});

test("S1-2. 공개판(플래그 미설정): 세 서비스의 서버 선택 작품은 0개라 장면 전환은 연출 예시 분기만 탄다", () => {
  const url = new URL("../lib/content-site/works.server.ts", import.meta.url).href;
  const source = `const m = await import(${JSON.stringify(url)}); const out = {}; for (const id of ["webtoon","animation","motion-graphics"]) out[id] = (await m.selectContentWorks(id)).map((w) => w.slug); console.log(JSON.stringify(out));`;
  const env = { ...process.env };
  delete env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW;
  delete env.ENABLE_LEGACY_SUPABASE;
  const result = spawnSync(process.execPath, ["--conditions=react-server", "--experimental-strip-types", "--input-type=module", "-e", source], { env, encoding: "utf8", windowsHide: true });
  assert.equal(result.status, 0, result.stderr);
  const works = JSON.parse(result.stdout);
  for (const [id, slugs] of Object.entries(works)) assert.deepEqual(slugs, [], id);
  for (const service of ["animation", "motion-graphics"]) {
    const scenes = getExampleMedia(service, "scene");
    assert.equal(scenes.length, 3, service);
    for (const slot of scenes) assert.doesNotMatch(JSON.stringify(slot), CUSTOMER, slot.id);
  }
});

test("S1-3. 연출 예시 슬롯: 6개 서비스 · ID 규칙 · 파일 존재 · 표기 · 한 줄 교체 API", () => {
  const ids = EXAMPLE_MEDIA.map((slot) => slot.id);
  assert.equal(new Set(ids).size, ids.length, "unique ids");
  for (const slot of EXAMPLE_MEDIA) {
    const prefix = { "motion-graphics": "motion", "brand-film": "brandfilm", "ai-influencer": "ai" }[slot.service] ?? slot.service;
    assert.match(slot.id, new RegExp(`^${prefix}-(${slot.section}-\\d+|main)$`), slot.id);
    assert.ok(SERVICES.includes(slot.service), slot.id);
    assert.ok(existsSync(join("public", slot.src)), slot.src);
    if (slot.poster) assert.ok(existsSync(join("public", slot.poster)), slot.poster);
    if (slot.kind === "video") assert.ok(slot.poster, `${slot.id} video poster`);
    assert.ok(Object.values(MEDIA_TAGS).includes(slot.label), `${slot.id} label from MEDIA_TAGS`);
    assert.match(slot.label, /예시/, slot.id);
    assert.ok(slot.width > 0 && slot.height > 0, slot.id);
  }
  for (const service of SERVICES) assert.ok(getExampleMedia(service).length >= 1, service);
  // AI 생성 인물은 AI 가상인물 표기
  for (const slot of EXAMPLE_MEDIA.filter((s) => s.src.includes("creator")))
    assert.equal(slot.label, MEDIA_TAGS.aiPerson, slot.id);
  // WP-S2가 쓰는 슬롯
  for (const id of ["ai-card-1", "brandfilm-main", "ad-rail-1", "ad-rail-6", "motion-bg-1", "animation-scene-3", "webtoon-cut-12"])
    assert.equal(getSlot(id).id, id);
  assert.throws(() => getSlot("missing-slot-1"));
  assert.deepEqual(focusData([72, 48]), { "data-fx": "70", "data-fy": "50" });
  assert.deepEqual(focusData(), {});
});

test("S1-4. 복사 소재 매니페스트: AIO 생성물만 · SHA 일치 · 타사 캡처·로고 제외", () => {
  const manifest = JSON.parse(read("public/content-examples/MANIFEST.json"));
  const listed = new Set(manifest.files.map((f) => f.path));
  // 서비스별 하위 폴더(WP-S1 슬롯)의 파일은 모두 출처가 기록돼 있다. 루트의 다른 WP 파일은 각자 관리
  const onDisk = SERVICES.filter((id) => existsSync(`public/content-examples/${id}`))
    .flatMap((id) => walk(`public/content-examples/${id}`))
    .map((p) => p.replaceAll("\\", "/"));
  for (const path of onDisk) assert.ok(listed.has(path), `${path} missing from MANIFEST`);
  for (const file of manifest.files) {
    assert.equal(sha(file.path), file.sha256, file.path);
    assert.match(file.source, /aio-service-pages-v01\/dist\/assets\/[\w-]+\.(webp|mp4)$/);
    assert.doesNotMatch(file.source, /captures|favicon|woff2|\/qa\//);
    assert.match(file.generator, /AIO 자체/);
    assert.match(file.promptReference, /IMAGE_PROMPTS\.json/);
  }
  // 슬롯이 가리키는 복사본은 모두 매니페스트에 있다
  for (const slot of EXAMPLE_MEDIA.filter((s) => s.src.startsWith("/content-examples/")))
    assert.ok(listed.has(`public${slot.src}`), slot.src);
});

test("S1-5. 공용 런타임: 화면 밖·숨김 탭 정지 계약과 재사용 훅", () => {
  const runtime = code(`${SV}/motion-runtime.tsx`);
  for (const name of ["useInViewPlay", "useAutoCycle", "useMotionProgress", "MotionCanvas", "LoopVideo", "WorkPreview"])
    assert.match(runtime, new RegExp(`export function ${name}\\b`), name);
  assert.match(runtime, /node\.dataset\.play = next \? "running" : "paused"/);
  assert.match(runtime, /document\.hidden/);
  assert.match(runtime, /visibilitychange/);
  assert.match(runtime, /prefers-reduced-motion: reduce/);
  assert.match(runtime, /mode === "pin"/);
  const css = code(`${SV}/service-motion.css`);
  assert.match(css, /\.cs-site\[data-cs-theme\] \[data-play="paused"\] \*,[\s\S]*?animation-play-state: paused;/);
  // WP-S1 규칙은 롱핸드만. 축약형이 남은 곳은 WP-S2 구역(R4 creator·film·ad)뿐
  for (const m of css.matchAll(/([^{}]+)\{[^}]*(?:^|[;\s{])animation\s*:/g))
    assert.match(m[1], /cs-creator|cs-film|cs-ad-/, `shorthand outside WP-S2 zone: ${m[1].trim()}`);
  // 인라인 style 0(테스트 8 규칙), 제목 줄 지연은 CSS
  for (const path of [`${SV}/motion-runtime.tsx`, `${SV}/scene-sequence.tsx`, `${SV}/work-sequence.tsx`, `${SV}/service-hero.tsx`, `${SV}/webtoon/webtoon-experience.tsx`, `${SV}/motion-graphics/type-composition.tsx`])
    assert.doesNotMatch(read(path), /style=/, path);
  assert.match(css, /\.cs-motion-title-line:nth-child\(2\) \{ animation-delay:110ms; \}/);
});

test("S1-6. 장면 전환·리더·구성 버튼: 깊이 전환 · 모바일 자동 순환 · 44px 이상 · 세로 스크롤 공존", () => {
  const scene = code(`${SV}/scene-sequence.tsx`);
  assert.match(scene, /useMotionProgress\(root, progress =>[\s\S]*\{ mode: "pin" \}\)/);
  assert.match(scene, /useInViewPlay\(stage, \{ threshold: \.35, pauseOnInteract: true \}\)/);
  assert.match(scene, /if \(!playing \|\| wide \|\| stopped\) return;/);
  const css = code(`${SV}/service-motion.css`);
  assert.match(css, /\.cs-scene-frame \{[^}]*clip-path:inset\(0 0 0 100%\); transform:translateZ\(180px\) scale\(1\.12\);/);
  assert.match(css, /\.cs-scene-frame\[data-side="before"\] \{[^}]*translateZ\(-320px\)/);
  assert.match(css, /\.cs-scene-screen \{[^}]*touch-action:pan-y/);
  assert.match(css, /\.cs-scene-arrows \.cs-btn \{ min-width:48px; min-height:48px; \}/);
  assert.match(css, /\.cs-scene-tabs button \{[^}]*min-height:64px/);
  assert.match(code(`${SV}/webtoon/webtoon.css`), /\.cs-svc-webtoon-book-controls \.cs-btn \{\s*min-width: 48px;\s*min-height: 48px;/);
  assert.match(code(`${SV}/motion-graphics/motion-graphics.css`), /\.cs-svc-motion-graphics-modes \.cs-btn \{\s*min-height: 44px;/);
  // 문단은 움직이지 않는다: 루프·전환 대상은 제목 줄·이미지·도형·글자 장식뿐
  for (const path of [`${SV}/service-motion.css`, `${SV}/webtoon/webtoon.css`, `${SV}/motion-graphics/motion-graphics.css`, `${SV}/animation/animation.css`])
    assert.doesNotMatch(code(path), /\.cs-t-(body|lead|small)[^{]*\{[^}]*animation-name/, path);
});
