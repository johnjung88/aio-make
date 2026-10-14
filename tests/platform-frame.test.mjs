// R7 WP-0: 플랫폼 프레임(components/platform-frame/**)과 공식 로고 자산 테스트.
// logos.ts는 직접 import하고, tsx·css는 소스를 읽어 계약을 확인한다.
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  LOGO_SIZE_DEFAULT,
  LOGO_SIZE_MAX,
  LOGO_SIZE_MIN,
  PLATFORM_TRADEMARK_NOTICE,
  getPlatformLogo,
  platformLogoIds,
  platformLogos,
} from "../components/platform-frame/logos.ts";

const read = (path) => readFileSync(path, "utf8");
const sha = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
const frameDir = "components/platform-frame";
const evidenceDir = "docs/renewal-2026-10-13/license-evidence-r7";
const logosEvidence = join(evidenceDir, "logos");
const frameSrc = read(join(frameDir, "platform-frame.tsx"));
const frameCss = read(join(frameDir, "platform-frame.css"));

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (name === "node_modules" || name === ".next") continue;
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|mjs)$/.test(name)) out.push(full);
  }
  return out;
}

test("로고 4개: 공식 출처 URL·받은 날짜가 있고, 파일이 있거나 UNKNOWN(src null)이다", () => {
  assert.deepEqual([...platformLogoIds].sort(), ["facebook", "instagram", "tiktok", "youtube"]);
  for (const id of platformLogoIds) {
    const logo = getPlatformLogo(id);
    assert.equal(logo.id, id);
    assert.match(logo.sourceUrl, /^https:\/\//);
    assert.match(logo.retrieved, /^\d{4}-\d{2}-\d{2}$/);
    if (logo.src === null) {
      assert.equal(logo.status, "unknown", `${id}: src가 없으면 unknown`);
    } else {
      assert.equal(logo.status, "official");
      assert.ok(logo.src.startsWith("/platform-logos/"), `${id}: 서비스 경로`);
      assert.ok(existsSync(join("public", logo.src)), `${id}: public 파일 존재`);
    }
  }
  assert.equal(platformLogos.instagram.name, "Instagram");
  assert.equal(platformLogos.youtube.name, "YouTube");
});

test("로고 근거: 원본·페이지 저장본이 있고 INDEX.sha256.txt의 SHA-256과 일치한다", () => {
  const files = readdirSync(logosEvidence).sort();
  assert.ok(files.includes("SOURCES.md"));
  for (const id of platformLogoIds) {
    assert.ok(
      files.some((f) => f.startsWith(`${id}_official_original`)),
      `${id}: 공식 원본 사본`,
    );
    assert.ok(
      files.some((f) => f.startsWith(`${id}_`) && f.includes("page")),
      `${id}: 근거 페이지 저장본`,
    );
  }
  const index = new Map(
    read(join(evidenceDir, "INDEX.sha256.txt"))
      .split(/\r?\n/)
      .map((line) => line.match(/^([0-9a-f]{64})\s+(.+)$/))
      .filter(Boolean)
      .map((m) => [m[2].trim(), m[1]]),
  );
  for (const f of files) {
    const key = `logos/${f}`;
    assert.ok(index.has(key), `INDEX에 ${key} 없음`);
    assert.equal(index.get(key), sha(join(logosEvidence, f)), `${key} SHA-256`);
  }
  // 서비스 파일(public)도 SHA를 INDEX에 남긴다
  for (const id of platformLogoIds) {
    const logo = getPlatformLogo(id);
    if (!logo.src) continue;
    const key = `public${logo.src}`;
    assert.equal(index.get(key), sha(join("public", logo.src)), `${key} SHA-256`);
  }
});

test("SOURCES.md는 4개 플랫폼의 공식 출처와 UNKNOWN·책임 기록을 담는다", () => {
  const doc = read(join(logosEvidence, "SOURCES.md"));
  for (const url of [
    "meta.com/brand/resources/instagram/instagram-brand",
    "meta.com/brand/resources/facebook/logo",
    "developers.google.com/youtube/branding",
    "developers.tiktok.com/doc/getting-started-design-guidelines",
  ]) {
    assert.ok(doc.includes(url), url);
  }
  assert.match(doc, /2026-10-15/);
  assert.match(doc, /UNKNOWN/);
  assert.match(doc, /prior written permission/);
});

test("lucide-react 브랜드 아이콘 import 0건, simple-icons 의존성·import 0건", () => {
  const banned = /^(Instagram|Facebook|Youtube|Twitter|Linkedin)(Icon)?$/;
  const roots = ["app", "components", "lib", "tests"].filter(existsSync);
  const offenders = [];
  for (const file of roots.flatMap((r) => walk(r))) {
    if (file.endsWith("platform-frame.test.mjs")) continue;
    const text = read(file);
    for (const m of text.matchAll(/import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*["']lucide-react["']/g)) {
      for (const spec of m[1].split(",")) {
        const name = spec.trim().split(/\s+as\s+/)[0].trim();
        if (banned.test(name)) offenders.push(`${file}: ${name}`);
      }
    }
    if (/lucide-react\/icons\/(instagram|facebook|youtube|twitter|linkedin)/i.test(text)) offenders.push(`${file}: deep import`);
    if (/simple-icons|@icons-pack\/react-simple-icons|react-icons\/(fa|si)/i.test(text)) offenders.push(`${file}: icon set`);
  }
  assert.deepEqual(offenders, []);
  for (const f of ["package.json", "package-lock.json"]) {
    assert.ok(!/simple-icons/i.test(read(f)), `${f}에 simple-icons`);
  }
});

test("프레임 외곽 비율 9:19.5(±0.5%)", () => {
  const m = frameCss.match(/\.pf\s*\{[^}]*aspect-ratio:\s*([\d.]+)\s*\/\s*([\d.]+)/);
  assert.ok(m, ".pf aspect-ratio");
  const ratio = Number(m[1]) / Number(m[2]);
  const target = 9 / 19.5;
  assert.ok(Math.abs(ratio - target) / target <= 0.005, `ratio ${ratio}`);
  assert.match(frameCss, /border-radius:\s*12cqw/); // 폭의 12%
});

test("로고 화면 크기 16~24px (CSS·기본값·width/height 속성)", () => {
  assert.ok(LOGO_SIZE_DEFAULT >= LOGO_SIZE_MIN && LOGO_SIZE_DEFAULT <= LOGO_SIZE_MAX);
  assert.equal(LOGO_SIZE_MIN, 16);
  assert.equal(LOGO_SIZE_MAX, 24);
  const m = frameCss.match(/\.pf-logo\s*\{[^}]*width:\s*(\d+)px[^}]*height:\s*(\d+)px/);
  assert.ok(m, ".pf-logo 크기");
  for (const v of [m[1], m[2]]) assert.ok(Number(v) >= 16 && Number(v) <= 24, `${v}px`);
  assert.match(frameSrc, /width=\{size\}/);
  assert.match(frameSrc, /height=\{size\}/);
});

test("PlatformFrame 계약: 7개 플랫폼, 4개 로고 id, 공식 파일만, 로고 없으면 이름 글자", () => {
  for (const kind of ["reels", "shorts", "tiktok", "feed45", "youtube169", "fbvideo", "webtoon"]) {
    assert.ok(frameSrc.includes(`"${kind}"`), kind);
  }
  assert.match(frameSrc, /logo\?: PlatformLogoId/);
  assert.match(frameSrc, /tag\?: string/);
  assert.match(frameSrc, /children\?: ReactNode/);
  assert.match(frameSrc, /from "\.\/logos"/);
  assert.match(frameSrc, /pf-logo-text/); // UNKNOWN 대체
  assert.match(frameSrc, /alt=\{logo\.name\}/);
  // lucide는 범용 아이콘만
  const lucide = frameSrc.match(/import\s*\{([^}]*)\}\s*from\s*"lucide-react"/);
  assert.ok(lucide);
  assert.deepEqual(
    lucide[1].split(",").map((s) => s.trim()).filter(Boolean).sort(),
    ["Bookmark", "Heart", "MessageCircle", "Music2", "Play", "Send", "Share2", "ThumbsUp"],
  );
  // 접근성: 장식은 숨기고 그룹 이름을 둔다
  assert.match(frameSrc, /role="group"/);
  assert.match(frameSrc, /aria-hidden="true"/);
});

test("콘텐츠 영역 화면비: 피드 4:5, 유튜브·페이스북 16:9, 쇼츠·릴스·틱톡은 전체 화면", () => {
  assert.match(frameCss, /data-platform="feed45"\]\s*\.pf-media\s*\{[^}]*aspect-ratio:\s*4\s*\/\s*5/);
  assert.match(frameCss, /data-platform="youtube169"\]\s*\.pf-media\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/);
  assert.match(frameCss, /data-platform="fbvideo"\]\s*\.pf-media\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/);
  assert.match(frameCss, /data-platform="reels"\]\s*\.pf-media[^{]*\{[^}]*position:\s*absolute[^}]*inset:\s*0/);
  assert.match(frameCss, /data-platform="webtoon"\]\s*\.pf-media\s*\{[^}]*flex:\s*1/);
});

test("사용자 결정: 'AI 가상 예시' 표기 없음, 틀에 조회·좋아요 숫자 없음, 상표 고지 문구 고정", () => {
  for (const [name, text] of [
    ["platform-frame.tsx", frameSrc],
    ["platform-frame.css", frameCss],
    ["logos.ts", read(join(frameDir, "logos.ts")).replace(/^\/\*[\s\S]*?\*\//, "")],
  ]) {
    assert.ok(!/AI\s*가상\s*예시/.test(text), `${name}: 'AI 가상 예시'`);
  }
  assert.equal(
    PLATFORM_TRADEMARK_NOTICE,
    "Instagram, Facebook, YouTube, TikTok은 각 회사의 상표입니다",
  );
  // JSX 글자(태그 사이 텍스트)에 숫자 지표가 없다. 허용 글자는 "광고"뿐이다
  const jsxText = [...frameSrc.matchAll(/>([^<>{}\n]+)</g)].map((m) => m[1].trim()).filter(Boolean);
  assert.ok(jsxText.every((t) => !/\d/.test(t)), `숫자 글자: ${jsxText}`);
  const code = frameSrc.replace(/\/\*[\s\S]*?\*\//, "");
  assert.ok(!/팔로워|조회수|좋아요|구독자/.test(code));
  assert.ok(!/제휴|파트너|인증|공식 계정/.test(code.replace(/--.*$/gm, "")));
});

test("공식 로고 파일은 정사각 PNG 또는 SVG이고 원본과 비율이 같다", () => {
  for (const id of ["instagram", "facebook", "tiktok"]) {
    const buf = readFileSync(join("public/platform-logos", `${id}.png`));
    assert.equal(buf.subarray(1, 4).toString(), "PNG");
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    assert.equal(w, h, `${id} 정사각`);
    const orig = readFileSync(join(logosEvidence, `${id}_official_original.png`));
    assert.equal(orig.readUInt32BE(16), orig.readUInt32BE(20));
    assert.ok(w <= orig.readUInt32BE(16), `${id}: 축소만`);
  }
  assert.equal(
    sha("public/platform-logos/youtube.svg"),
    sha(join(logosEvidence, "youtube_official_original.svg")),
    "YouTube는 원본 바이트 그대로",
  );
});
