// /content/contact (P2R WP-D) 테스트: 문구 규칙, 서비스 선택, 미선택 안내(VERIFY_G0 6), 소스 규칙.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { CONTACT_COPY } from "../components/content-site/contact/copy.ts";
import { PRICING_COMMON_LINES } from "../lib/content-pricing.ts";

const dir = "components/content-site/contact";
const files = readdirSync(dir).map((f) => join(dir, f));
const read = (path) => readFileSync(path, "utf8");
const code = (text) =>
  text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const BANNED =
  /을 통해|를 통해|에 대해|아니라|없이|최고|최저|보장|1위|%|\d+배|혁신|압도적|극대화|원스톱|완벽|최적|퀄리티|콘텐츠|맞춤 견적|작업 사례|coming soon|준비 중|모르겠어요/i;
const sentences = (text) =>
  text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

test("1. 문구 규칙: 금지어·쉼표·마침표·제목 줄 길이", () => {
  const { hero, chooser, basis, inquiry } = CONTACT_COPY;
  const all = [
    hero.eyebrow,
    hero.title,
    hero.lead,
    chooser.legend,
    chooser.required,
    chooser.hint,
    chooser.missing,
    basis.title,
    inquiry.title,
    inquiry.lead,
    inquiry.placeholder,
  ];
  for (const text of all) {
    assert.doesNotMatch(text, BANNED, text);
    for (const s of sentences(text))
      assert.ok((s.match(/,/g) || []).length <= 1, `comma <= 1 · ${s}`);
  }
  // R2 사용자 결정: 문의 카피도 문장 마침표 없이 표시
  for (const text of all)
    assert.doesNotMatch(text, /[가-힣]\.(?=\s|$)|\.$/, text);
  // h1 한 줄 9자 이하, h2 한 줄 11자 이하
  for (const line of hero.title.split("\n")) assert.ok(line.length <= 9, line);
  for (const line of inquiry.title.split("\n")) assert.ok(line.length <= 11, line);
  assert.match(hero.eyebrow, /^[A-Z][A-Z ]*[A-Z]$/);
  // 숫자: 플레이스홀더의 30초만
  for (const text of all)
    for (const m of text.matchAll(/\d+/g)) assert.equal(m[0], "30", text);
  // 가격 기준 3줄은 공통 주석 그대로
  assert.deepEqual(PRICING_COMMON_LINES, [
    "표시 금액은 모두 부가세 별도입니다",
    "기획안 전달 후 수정 2회, 최종안 전달 후 수정 1회가 포함됩니다",
    "대량 제작과 정기 제작은 따로 견적을 드립니다",
  ]);
});

test("2. 페이지 구성: 히어로 h1 · 가격 기준 · 서비스 선택(폼 밖) · 문의 폼", () => {
  const page = read(join(dir, "contact-page.tsx"));
  assert.doesNotMatch(page, /^\s*["']use client["']/, "page shell is a server component");
  assert.match(page, /<h1 id="cs-hero-title" className="cs-t-display">/);
  assert.match(page, /PRICING_COMMON_LINES\.map/);
  assert.match(page, /<ContactFlow/);
  const flow = read(join(dir, "contact-flow.tsx"));
  assert.match(flow, /^\s*["']use client["']/);
  // 서비스 선택은 6종(CONTENT_SERVICES 순서) 라디오, 같은 name(화살표 키 이동), 시작가 head
  assert.match(flow, /CONTENT_SERVICES\.map/);
  assert.match(flow, /type="radio"/);
  assert.match(flow, /name=\{`\$\{uid\}-service`\}/);
  assert.match(flow, /startingPrice\(s\.id\)/);
  assert.match(flow, /role="radiogroup"/);
  assert.match(flow, /aria-required="true"/);
  // 서비스 선택은 <form> 밖(CsInquiry 앞), 고른 서비스는 CsInquiry 고정 서비스로
  assert.ok(flow.indexOf("<fieldset") < flow.indexOf("<CsInquiry"));
  assert.match(flow, /<CsInquiry service=\{chosen\} copy=\{CONTACT_COPY\.inquiry\} \/>/);
  assert.doesNotMatch(flow, /<CsInquiry[^>]*\bchooser\b/);
  // ?service= 미리 선택
  assert.match(flow, /useState<ContentServiceId \| undefined>\(\s*initialService,?\s*\)/);
  const route = read("app/(content-site)/content/contact/page.tsx");
  assert.match(route, /isContentServiceId\(id\) \? id : undefined/);
});

test("3. 미선택 제출: 이 페이지의 안내만 나오고 없는 선택지를 가리키지 않는다(VERIFY_G0 6)", () => {
  const flow = read(join(dir, "contact-flow.tsx"));
  // 캡처 단계에서 제출을 멈춘다 → 공용 InquiryBridge의 '아직 모르겠어요' 문장이 실행되지 않는다
  assert.match(flow, /onSubmitCapture=\{onSubmitCapture\}/);
  assert.match(
    flow,
    /if \(chosen\) return;\s+event\.preventDefault\(\);\s+event\.stopPropagation\(\);\s+setMissing\(true\);/,
  );
  assert.match(flow, /role="alert"/);
  assert.match(flow, /\{copy\.missing\}/);
  assert.match(flow, /focus\(\{ preventScroll: true \}\)/);
  assert.equal(CONTACT_COPY.chooser.missing, "요청 서비스를 하나 골라주세요");
  for (const path of files) assert.doesNotMatch(read(path), /모르겠/, path);
});

test("4. 소스 규칙: 인라인 style·글자 리터럴·!important 0, 선택자 범위", () => {
  for (const path of files) {
    const text = code(read(path));
    assert.doesNotMatch(text, /style=/, path);
    assert.doesNotMatch(text, /\/content\/work|작업 사례|맞춤 견적|process\.env/, path);
    assert.doesNotMatch(text, /from\s+["']@\/lib\/content-site["']/, `${path} landing index`);
    assert.doesNotMatch(text, /\b\d{2,3}000\b/, `${path} amount literal`);
  }
  const css = code(read(join(dir, "contact.css")));
  assert.doesNotMatch(css, /!important/);
  assert.doesNotMatch(
    css,
    /(?:^|[;{\s])(font-size|line-height|letter-spacing|font-weight|font-family)\s*:/,
  );
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b|rgba?\(/i);
  for (const rule of css.matchAll(/([^{}]+)\{[^{}]*\}/g)) {
    const head = rule[1].trim();
    if (head.startsWith("@") || head === "") continue;
    for (const selector of head.split(","))
      assert.match(selector.trim(), /^\.cs-site \.cs-contact\b/, selector.trim());
  }
});
