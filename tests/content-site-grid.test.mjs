// WP0FIX — 컨텐츠 사이트 공통 셸 회귀 테스트.
// (WP0-1) .cs-col-N(폭)과 .cs-col-start-M(시작)이 함께 쓰일 때 span이 사라지지 않는지
//         theme.css 규칙을 1440px 기준으로 적용해 계산한다(VERIFY_G0: 문의 폼 카드 86px).
// (WP0-2) 모바일 헤더: 라벨을 유지하고, 전체 서비스는 숨김 메뉴 없이 직접 탐색한다(v15 사용자 요청).
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const THEME = "components/content-site/theme.css";
const VIEWPORT = 1440;
const COLS = 12;

const read = (path) => readFileSync(path, "utf8");
const walk = (dir) =>
  existsSync(dir)
    ? readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        return statSync(path).isDirectory() ? walk(path) : [path];
      })
    : [];

/** 주석을 뺀 CSS를 규칙 목록({selector, decls, media[]})으로 */
function cssRules(css) {
  const body = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules = [];
  const stack = [];
  let chunk = "";
  for (const ch of body) {
    if (ch === "{") {
      stack.push({ head: chunk.trim(), decls: "" });
      chunk = "";
    } else if (ch === "}") {
      const top = stack.pop();
      if (top) {
        top.decls += chunk;
        if (!top.head.startsWith("@"))
          rules.push({
            selector: top.head,
            decls: top.decls,
            media: stack.map((s) => s.head).filter((h) => h.startsWith("@media")),
          });
      }
      chunk = "";
    } else {
      chunk += ch;
      if (stack.length && ch === ";") {
        stack[stack.length - 1].decls += chunk;
        chunk = "";
      }
    }
  }
  return rules;
}
function splitTop(text, sep = ",") {
  const out = [];
  let depth = 0,
    cur = "";
  for (const ch of text) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === sep && depth === 0) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
/** 화면 폭 기준으로 @media 조건이 맞는지(폭 조건만 본다. 그 밖의 조건이 있으면 제외) */
function mediaMatches(list, width) {
  return list.every((head) => {
    const q = head.replace(/^@media\s*/, "");
    const parts = q.split(/\s+and\s+/);
    return parts.every((p) => {
      const min = p.match(/\(min-width:\s*(\d+)px\)/);
      if (min) return width >= Number(min[1]);
      const max = p.match(/\(max-width:\s*(\d+)px\)/);
      if (max) return width <= Number(max[1]);
      return false;
    });
  });
}

const GRID_CHILD = /^\.cs-site \.cs-grid > (.+)$/;
/** '.cs-site .cs-grid > X'에서 X가 classes에 맞으면 [specificity] (아니면 null) */
function matchChild(selector, classes) {
  const m = selector.match(GRID_CHILD);
  if (!m) return null;
  const simple = m[1].trim();
  if (simple === "*") return 2;
  const is = simple.match(/^:is\((.+)\)$/);
  const options = is ? splitTop(is[1]) : [simple];
  for (const opt of options) {
    const need = opt.split(".").filter(Boolean);
    if (!/^(\.[\w-]+)+$/.test(opt)) continue;
    if (need.every((c) => classes.includes(c))) return 2 + need.length;
  }
  return null;
}

/** 격자 자식 classes의 계산된 [시작 줄, 차지 열 수] (VIEWPORT 기준) */
function resolveColumn(rules, classes) {
  const hits = [];
  rules.forEach((rule, order) => {
    if (!mediaMatches(rule.media, VIEWPORT)) return;
    let spec = null;
    for (const s of splitTop(rule.selector)) {
      const v = matchChild(s, classes);
      if (v !== null) spec = Math.max(spec ?? 0, v);
    }
    if (spec !== null) hits.push({ spec, order, decls: rule.decls });
  });
  hits.sort((a, b) => a.spec - b.spec || a.order - b.order);
  const props = {};
  for (const hit of hits)
    for (const d of hit.decls.split(";")) {
      const i = d.indexOf(":");
      if (i < 0) continue;
      const prop = d.slice(0, i).trim();
      if (/^(grid-column(-start|-end)?|--cs-col-[\w-]+)$/.test(prop)) {
        const value = d.slice(i + 1).trim();
        if (prop === "grid-column") {
          const [start, end = "auto"] = value.split("/").map((v) => v.trim());
          props["grid-column-start"] = start;
          props["grid-column-end"] = value.includes("/") ? end : "auto";
        } else props[prop] = value;
      }
    }
  const sub = (v) =>
    v.replace(/var\((--[\w-]+)(?:,\s*([^)]+))?\)/g, (_, name, fb) => {
      assert.ok(name in props || fb, `undefined ${name} for ${classes.join(" ")}`);
      return name in props ? props[name] : fb;
    });
  const start = sub(props["grid-column-start"] ?? "auto");
  const end = sub(props["grid-column-end"] ?? "auto");
  const spanOf = (v) => Number(v.match(/^span\s+(\d+)$/)?.[1]);
  if (/^\d+$/.test(start)) {
    const s = Number(start);
    if (end === "-1") return [s, COLS + 1 - s];
    if (end.startsWith("span")) return [s, spanOf(end)];
    if (end === "auto") return [s, 1];
    return [s, Number(end) - s];
  }
  // 시작이 auto/span: 자동 배치. 시작 줄은 null
  if (start === "auto" && end === "-1") return [null, COLS];
  if (end.startsWith("span")) return [null, spanOf(end)];
  if (start.startsWith("span")) return [null, spanOf(start)];
  return [null, 1];
}

test("WP0-1. 격자 유틸리티: 폭과 시작이 함께 쓰여도 span이 유지된다(1440)", () => {
  const rules = cssRules(read(THEME));
  // 시작 유틸리티는 grid-column-start를 따로 선언하지 않는다(앞의 span을 지운다)
  for (const rule of rules)
    if (/\.cs-col-start-\d/.test(rule.selector))
      assert.doesNotMatch(rule.decls, /grid-column-start\s*:/, rule.selector);

  assert.deepEqual(resolveColumn(rules, ["cs-col-6", "cs-col-start-7"]), [7, 6]);
  assert.deepEqual(resolveColumn(rules, ["cs-col-4", "cs-col-start-9"]), [9, 4]);
  assert.deepEqual(resolveColumn(rules, ["cs-col-5"]), [null, 5]);
  assert.deepEqual(resolveColumn(rules, ["cs-col-7"]), [null, 7]);
  assert.deepEqual(resolveColumn(rules, ["cs-col-start-8"]), [8, 5]);
  assert.deepEqual(resolveColumn(rules, []), [1, 12]);
});

test("WP0-1. 격자 유틸리티: 소스의 모든 cs-col 조합이 12열 안에서 의도한 폭을 가진다", () => {
  const rules = cssRules(read(THEME));
  const files = [
    ...walk("components/content-site"),
    ...walk("components/content-home"),
    ...walk("app/(content-site)"),
  ].filter((f) => /\.tsx$/.test(f));
  let seen = 0;
  for (const path of files) {
    for (const m of read(path).matchAll(/className=["'`{]*([^"'`}]*\bcs-col-[^"'`}]*)/g)) {
      const classes = m[1].split(/\s+/).filter((c) => /^cs-col-(start-)?\d+$/.test(c));
      if (!classes.length) continue;
      seen++;
      const width = classes.find((c) => /^cs-col-\d+$/.test(c));
      const startClass = classes.find((c) => /^cs-col-start-\d+$/.test(c));
      const [start, span] = resolveColumn(rules, classes);
      const where = `${path}: ${classes.join(" ")}`;
      if (width) assert.equal(span, Number(width.split("-").pop()), `span · ${where}`);
      if (startClass) {
        assert.equal(start, Number(startClass.split("-").pop()), `start · ${where}`);
        assert.ok(start + span - 1 <= COLS, `fits 12 columns · ${where}`);
      }
    }
  }
  assert.ok(seen >= 2, "cs-col usages found");
});

test("WP0-2. 모바일 헤더: CONTENT STUDIO 라벨 유지 · 전체 서비스 직접 메뉴", () => {
  const rules = cssRules(read(THEME));
  for (const rule of rules)
    if (/\.cs-lockup-label\b/.test(rule.selector) && mediaMatches(rule.media, 390))
      assert.doesNotMatch(rule.decls, /display\s*:\s*none/, `label hidden: ${rule.selector}`);
  // <768 두 줄 잠금
  assert.ok(
    rules.some(
      (r) =>
        /\.cs-lockup$/.test(r.selector) &&
        mediaMatches(r.media, 360) &&
        !mediaMatches(r.media, 1440) &&
        /flex-direction\s*:\s*column/.test(r.decls),
    ),
    "stacked lockup on mobile",
  );
  const header = read("components/content-site/shell/header.tsx");
  assert.match(header, /className="cs-lockup-label cs-t-lockup"/);
  for (const label of ["홈", "인사이트", "레퍼런스", "상담 신청"])
    assert.ok(header.includes(label), label);
  assert.match(header, /<nav[^>]*aria-label="콘텐츠 전체 메뉴"/);
  assert.match(header, /CONTENT_SERVICES\.map/);
  assert.match(header, /href=\{contentServicePath\(service\.id\)\}/);
  assert.match(header, /aria-current=\{path\.startsWith/);
  assert.doesNotMatch(header, /각 서비스|aria-expanded|(?:^|\s)hidden=|<button\b/);
  const overrides = cssRules(read("components/content-site/shell/header-v15.css"));
  assert.ok(overrides.some((r) => /cs-header-v15-nav\b/.test(r.selector) && /overflow-x\s*:\s*auto/.test(r.decls)), "all links remain horizontally reachable");
  for (const rule of overrides)
    if (/\.cs-lockup-label\b/.test(rule.selector) && mediaMatches(rule.media, 390))
      assert.doesNotMatch(rule.decls, /display\s*:\s*none/, `label hidden: ${rule.selector}`);
  assert.doesNotMatch(header, /MotionToggle|cs-motion-toggle/);
});
