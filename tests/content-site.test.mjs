// P2R WP0 — 컨텐츠 사이트(AIO MAKE CONTENT STUDIO) 공통 규칙 테스트.
// 6개 서비스 데이터 파일을 반복 검사하는 일반 테스트다(BRIEF_P2R 8절). WP-A~D가 데이터를 채워도 같은 규칙이 적용된다.
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { contentLandings } from "../lib/content-site/index.ts";
import {
  CONTENT_SERVICES,
  CONTENT_SITE_ASSETS,
  MEDIA_TAGS,
} from "../lib/content-site/types.ts";
import { CS_COPY } from "../lib/content-site/copy.ts";
import { csRoute } from "../lib/content-site/theme-map.ts";
import { serviceJsonLd } from "../lib/content-site/schema.ts";
import {
  PRICING_COMMON_LINES,
  contentPricing,
  formatWon,
  planOptions,
  pricingPlans,
  startingPrice,
} from "../lib/content-pricing.ts";
import * as contentHome from "../lib/content-home.ts";
import { services } from "../lib/content.ts";

const ORDER = [
  "webtoon",
  "animation",
  "ai-influencer",
  "motion-graphics",
  "brand-film",
  "ad",
];
const REQUIRED =
  "웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상";
// PRICING_FINAL_2026-10-14.md 3~9번 금액(만 원 단위 문자열)
const FINAL_AMOUNTS = new Set([
  "7.5",
  "10",
  "12",
  "15",
  "17.5",
  "18",
  "25",
  "27",
  "30",
  "45",
  "55",
  "100",
]);
const ALLOWED_NUMBERS = new Set(["1", "2", "4", "5", "12", "20", "24", "30", "60"]);
const BANNED =
  /을 통해|를 통해|에 대해|아니라|없이|최고|최저|보장|1위|%|\d+배|혁신|차원이 다른|압도적|극대화|시너지|원스톱|완벽|최적|퀄리티|콘텐츠|운영 중|게시 중|팔로워|조회수|립싱크|목소리|고화질|coming soon|준비 중|공개 예정|곧 공개|맞춤 견적|작업 사례/i;
const CUSTOMER =
  /reference-review|BWL|DR's Secret|DR&#x27;s Secret|닥터시크릿|힐러넷|HEALERNET|YoFree|요프리|bwl-|yofree-|healernet-/i;

const read = (path) => readFileSync(path, "utf8");
/** 주석을 뺀 소스(블록 주석과 줄 처음의 // 주석) */
const code = (path) =>
  read(path)
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
const walkFiles = (dir) =>
  existsSync(dir)
    ? readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        return statSync(path).isDirectory() ? walkFiles(path) : [path];
      })
    : [];
const siteFiles = walkFiles("components/content-site");
const homeFiles = walkFiles("components/content-home");
const libFiles = walkFiles("lib/content-site");
const sentences = (text) =>
  text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

/** 모든 문자열을 {path, key, value}로 펼친다. faq 튜플은 question/answer 키로 바꾼다. */
function strings(value, path = []) {
  if (typeof value === "string") {
    const last = path[path.length - 1];
    const parent = path[path.length - 2];
    const grand = path[path.length - 3];
    let key = typeof last === "string" ? last : parent;
    if (grand === "faq" && typeof last === "number")
      key = last === 0 ? "question" : "answer";
    return [{ path: path.join("."), key, value }];
  }
  if (Array.isArray(value))
    return value.flatMap((v, i) => strings(v, [...path, i]));
  if (value && typeof value === "object")
    return Object.entries(value)
      .filter(([k]) => k !== "id")
      .flatMap(([k, v]) => strings(v, [...path, k]));
  return [];
}

const ALWAYS_PERIOD = new Set(["body", "answer", "description"]);

function checkCopy({ path, key, value }, { latin = true } = {}) {
  const where = `${path}: ${value}`;
  assert.doesNotMatch(value, BANNED, `banned word · ${where}`);
  assert.doesNotMatch(value, CUSTOMER, `customer name · ${where}`);
  assert.doesNotMatch(value, /\d만원|\d{1,3}(,\d{3})+원|\d원/, `amount format · ${where}`);
  // 금액: N만 원만, PRICING_FINAL 집합 안
  let rest = value;
  for (const m of value.matchAll(/(\d+(?:\.\d)?)만 원/g)) {
    assert.ok(FINAL_AMOUNTS.has(m[1]), `amount ${m[1]}만 원 not in PRICING_FINAL · ${where}`);
  }
  rest = rest
    .replace(/\d+(?:\.\d)?만 원/g, "")
    .replace(/9:16/g, "")
    .replace(/1080p/g, "")
    .replace(/87언니/g, "");
  for (const m of rest.matchAll(/\d+(?:\.\d+)?/g))
    assert.ok(ALLOWED_NUMBERS.has(m[0]), `number ${m[0]} not allowed · ${where}`);
  // 쉼표: 한 문장 1개 이하
  for (const s of sentences(value))
    assert.ok((s.match(/,/g) || []).length <= 1, `comma <= 1 · ${where}`);
  // 문장 끝에 쉼표절을 붙이지 않는다
  assert.doesNotMatch(value, /,\s*$/, `trailing comma · ${where}`);
  // 마침표
  const parts = sentences(value);
  if (parts.length > 1) {
    for (const p of parts) assert.match(p, /[.?!]$/, `each sentence ends · ${where}`);
  } else if (key === "question") {
    assert.match(value, /\?$/, `question ends with ? · ${where}`);
  } else if (ALWAYS_PERIOD.has(key)) {
    assert.match(value, /\.$/, `sentence field ends with period · ${where}`);
  } else {
    assert.doesNotMatch(value, /\.$/, `no period on title/label/lead · ${where}`);
  }
  // 영문: eyebrow(대문자 3단어 이하)와 허용 약어만
  if (key === "eyebrow") {
    assert.match(value, /^[A-Z][A-Z ]*[A-Z]$/, `eyebrow uppercase latin · ${where}`);
    assert.ok(value.split(" ").length <= 3, `eyebrow <= 3 words · ${where}`);
  } else if (latin) {
    for (const m of rest.matchAll(/[A-Za-z]+/g))
      assert.ok(["AI", "SNS", "BGM"].includes(m[0]), `latin "${m[0]}" · ${where}`);
  }
}

test("1. 서비스 6종: 순서·라벨이 고정 표기와 같고 lib/content.ts video 서비스에 있다", () => {
  assert.deepEqual(Object.keys(contentLandings), ORDER);
  assert.deepEqual(
    CONTENT_SERVICES.map((s) => s.id),
    ORDER,
  );
  assert.equal(
    Object.values(contentLandings)
      .map((d) => d.label)
      .join(" · "),
    REQUIRED,
  );
  assert.equal(CONTENT_SERVICES.map((s) => s.label).join(" · "), REQUIRED);
  for (const id of ORDER) {
    assert.equal(contentLandings[id].id, id);
    assert.ok(
      services.some((s) => s.id === id && s.division === "video"),
      `${id} is a video service`,
    );
  }
});

test("2. 가격: PRICING_FINAL 금액·주석과 정확히 같다", () => {
  const amounts = (id) =>
    pricingPlans(id).groups.map((g) => [g.key, g.plans.map((p) => p.amount)]);
  assert.deepEqual(amounts("ai-influencer"), [["plan", [100000, 300000, 1000000]]]);
  assert.deepEqual(amounts("brand-film"), [["plan", [250000, 450000]]]);
  assert.deepEqual(amounts("animation"), [["plan", [300000, 550000]]]);
  assert.deepEqual(amounts("motion-graphics"), [
    ["plan", [100000, 180000, 150000, 270000]],
  ]);
  assert.deepEqual(amounts("ad"), [["plan", [250000, 450000]]]);
  assert.deepEqual(amounts("webtoon"), [
    ["webtoon", [100000, 180000]],
    ["motion-comic", [75000, 120000]],
    ["bundle", [175000, 300000]],
  ]);
  const webtoon = pricingPlans("webtoon").groups;
  assert.deepEqual(
    webtoon.map((g) => [g.title, g.bundle]),
    [
      ["웹툰 제작", false],
      ["모션코믹", false],
      ["함께 제작", true],
    ],
  );
  assert.deepEqual(
    webtoon[2].plans.map((p) => [p.label, formatWon(p.amount)]),
    [
      ["웹툰 12컷 + 모션코믹 30초", "17.5만 원"],
      ["웹툰 24컷 + 모션코믹 60초", "30만 원"],
    ],
  );
  assert.deepEqual(
    pricingPlans("ai-influencer").groups[0].plans.map((p) => p.label),
    [
      "캐릭터 1명 세팅 + 이미지 5장",
      "세팅 + 30초 영상 1편",
      "세팅 + 이미지 총 20장 + 30초 영상 4편",
    ],
  );
  assert.deepEqual(
    pricingPlans("motion-graphics").groups[0].plans.map((p) => p.label),
    ["단순형 30초", "단순형 60초", "맞춤형 30초", "맞춤형 60초"],
  );
  // 서비스별 주석(원문)
  assert.deepEqual(pricingPlans("motion-graphics").notes, [
    "맞춤형은 브랜드 전용 캐릭터 제작 서비스 포함.",
  ]);
  assert.deepEqual(pricingPlans("ad").notes, [
    "제품·서비스 1개, 콘셉트 1개 기준. 세로형 9:16·1080p, 기본 자막·BGM 포함.",
    "다른 화면비 추가·광고 집행·계정 운영·매체비는 별도.",
  ]);
  assert.deepEqual(pricingPlans("ai-influencer").notes, [
    "총 20장에 세팅용 이미지 포함. 주 이미지 5장·영상 1편 구성 가능.",
    "계정 게시·운영 및 대량 제작은 별도 견적.",
  ]);
  assert.deepEqual(pricingPlans("webtoon").notes, [
    "모션코믹은 기존 웹툰을 영상화하는 가격입니다. 웹툰 신규 제작은 별도입니다.",
  ]);
  assert.deepEqual(pricingPlans("animation").notes, []);
  assert.deepEqual(pricingPlans("brand-film").notes, []);
  assert.deepEqual(PRICING_COMMON_LINES, [
    "표시 금액은 모두 부가세 별도입니다.",
    "기획안 전달 후 수정 2회, 최종안 전달 후 수정 1회가 포함됩니다.",
    "대량 제작과 정기 제작은 따로 견적을 드립니다.",
  ]);
  for (const id of ORDER) {
    const plans = planOptions(id);
    assert.ok(plans.length >= 2, `${id} has >= 2 plans`);
    assert.equal(new Set(plans.map((p) => p.key)).size, plans.length, `${id} keys`);
    assert.equal(new Set(plans.map((p) => p.option)).size, plans.length, `${id} options`);
    for (const p of plans)
      assert.ok(
        FINAL_AMOUNTS.has(formatWon(p.amount).replace("만 원", "")),
        `${id} ${p.option}`,
      );
    // 시작가는 가격표 첫 플랜과 같다
    assert.equal(startingPrice(id, true).amount, plans[0].amount, id);
  }
  assert.equal(formatWon(100000), "10만 원");
  assert.equal(formatWon(75000), "7.5만 원");
  assert.equal(formatWon(175000), "17.5만 원");
  assert.equal(formatWon(1000000), "100만 원");
  // lib/content-home.ts는 같은 값을 그대로 다시 내보낸다
  assert.equal(contentHome.contentPricing, contentPricing);
  assert.equal(contentHome.startingPrice, startingPrice);
  // 금액 리터럴은 lib/content-pricing.ts에만
  for (const path of [...libFiles, ...siteFiles, "lib/content-home.ts"])
    assert.doesNotMatch(read(path), /\b\d{2,3}000\b|\b1000000\b/, path);
});

test("3. 카피 규칙: 모든 서비스 데이터 문자열", () => {
  for (const id of ORDER) {
    const data = contentLandings[id];
    for (const entry of strings(data, [id])) checkCopy(entry);
    for (const line of data.hero.title.split("\n"))
      assert.ok(line.length <= 9, `${id} hero.title line <= 9: ${line}`);
    for (const { path, key, value } of strings(data, [id]))
      if (
        (key === "title" || key === "statement") &&
        !path.endsWith("hero.title") &&
        !path.endsWith("seo.title")
      )
        for (const line of value.split("\n"))
          assert.ok(line.length <= 11, `${path} line <= 11: ${line}`);
    assert.equal(data.hero.facts.length, 3, id);
  }
  // 셸·공통 블록 고정 문구
  for (const entry of strings(CS_COPY, ["CS_COPY"]))
    checkCopy(entry, { latin: false });
});

test("4. FAQ·SEO", () => {
  const common = [
    [
      "수정은 몇 번까지 할 수 있나요?",
      "기획안을 받은 뒤 2회, 최종안을 받은 뒤 1회 수정할 수 있습니다. 그 밖의 수정은 범위를 확인한 뒤 따로 안내합니다.",
    ],
    [
      "표시된 가격에 부가세가 포함되어 있나요?",
      "포함되어 있지 않습니다. 표시한 금액은 모두 부가세 별도입니다.",
    ],
    [
      "여러 편을 정기적으로 맡길 수 있나요?",
      "네. 편수와 일정을 알려주시면 범위와 견적을 따로 안내합니다.",
    ],
  ];
  const titles = new Set(),
    descriptions = new Set();
  for (const id of ORDER) {
    const { faq, seo } = contentLandings[id];
    assert.ok(faq.length >= 4, `${id} FAQ >= 4`);
    assert.deepEqual(faq.slice(-3), common, `${id} ends with common FAQ`);
    // 가격 주석 문장은 페이지에서 한 번만(VERIFY_FINAL_P2R SHARED-2)
    for (const [, answer] of faq)
      for (const line of PRICING_COMMON_LINES)
        assert.ok(!answer.includes(line), `${id} FAQ repeats pricing note: ${line}`);
    assert.doesNotMatch(
      read("components/content-site/blocks/process.tsx"),
      /PRICING_COMMON/,
      "process block does not repeat pricing note",
    );
    assert.equal(new Set(faq.map(([q]) => q)).size, faq.length, `${id} FAQ unique`);
    assert.ok(faq.some(([, a]) => /수정/.test(a)), `${id} revision FAQ`);
    assert.ok(faq.some(([, a]) => /부가세 별도/.test(a)), `${id} VAT FAQ`);
    assert.ok(seo.title.length <= 22, `${id} seo.title <= 22`);
    assert.ok(
      seo.description.length >= 60 && seo.description.length <= 120,
      `${id} description 60~120: ${seo.description.length}`,
    );
    assert.ok(seo.description.includes(startingPrice(id, true).head), `${id} head`);
    assert.ok(seo.description.includes("부가세 별도"), `${id} VAT`);
    titles.add(seo.title);
    descriptions.add(seo.description);
  }
  assert.equal(titles.size, 6);
  assert.equal(descriptions.size, 6);
  // JSON-LD: Service(offers) · FAQPage(화면 FAQ와 같은 문자열) · BreadcrumbList
  for (const id of ORDER) {
    const [service, faq, breadcrumb] = serviceJsonLd(id);
    assert.equal(service["@type"], "Service");
    assert.equal(service.url, `https://aio-make.com/content/services/${id}`);
    assert.ok(service.offers.length >= 2);
    for (const offer of service.offers) {
      assert.equal(offer.priceCurrency, "KRW");
      assert.equal(offer.priceSpecification.valueAddedTaxIncluded, false);
      assert.equal(offer.priceSpecification.price, offer.price);
    }
    assert.deepEqual(
      service.offers.map((o) => [o.name, o.price]),
      planOptions(id).map((p) => [p.option, p.amount]),
    );
    assert.equal(faq["@type"], "FAQPage");
    assert.deepEqual(
      faq.mainEntity.map((q) => [q.name, q.acceptedAnswer.text]),
      contentLandings[id].faq,
    );
    assert.equal(breadcrumb["@type"], "BreadcrumbList");
    assert.deepEqual(
      breadcrumb.itemListElement.map((i) => i.item),
      [
        "https://aio-make.com/",
        "https://aio-make.com/content",
        `https://aio-make.com/content/services/${id}`,
      ],
    );
  }
});

test("5. AI 인플루언서 범위·표기(FACTS_AI_INFLUENCER)", () => {
  const ai = contentLandings["ai-influencer"];
  const all = strings(ai).map((s) => s.value);
  assert.ok(
    !all.some((s) => /계정 (게시|운영)|게시와 운영|게시·운영/.test(s)),
    "account operation note only in pricing notes",
  );
  assert.ok(pricingPlans("ai-influencer").notes.includes("계정 게시·운영 및 대량 제작은 별도 견적."));
  for (const text of all)
    assert.doesNotMatch(
      text,
      /팔로워|조회수|성과|전환|운영 중|게시 중|고화질|목소리|립싱크|채택|계약|후기|동안|고객 납품/,
      text,
    );
  assert.match(MEDIA_TAGS.aiPerson, /AI 가상인물/);
  assert.deepEqual(MEDIA_TAGS, {
    staged: "연출 예시",
    aiPerson: "AI 가상인물 · 연출 예시",
    ownWebtoon: "1억의 구단주 · 제작 예시",
    ownWebtoonVideo: "1억의 구단주 영상 · 제작 예시",
    stagedMuted: "연출 예시 · 무음",
  });
  // AI 사람 이미지(creator)는 aiPerson 태그로만 쓴다
  const stub = read("components/content-site/services/ai-influencer/landing.tsx");
  if (stub.includes("CONTENT_SITE_ASSETS.creator"))
    assert.match(stub, /MEDIA_TAGS\.aiPerson/);
});

test("6. 고객 데이터 경계: client 파일은 서버 전용 모듈을 import하지 않는다", () => {
  const server = read("lib/content-site/works.server.ts");
  assert.match(server.trimStart(), /^import "server-only";/);
  const gates = [...server.matchAll(/process\.env\.NEXT_PUBLIC_AIO_REFERENCE_REVIEW([^\n]*)/g)];
  assert.ok(gates.length >= 1);
  for (const g of gates) assert.match(g[1], /^\s*===\s*"1"/, "exact '1' gate");
  for (const path of siteFiles.filter((f) => /\.(tsx?|jsx?)$/.test(f))) {
    const text = code(path);
    const client = /^\s*["']use client["']/.test(text);
    if (client) {
      assert.doesNotMatch(
        text,
        /from\s+["'][^"']*(work-catalog|generated|home-journey-data|works\.server)[^"']*["']/,
        `${path} imports server data`,
      );
      assert.doesNotMatch(text, /from\s+["']@\/lib\/content-site["']/, `${path} imports all landing data`);
    }
    assert.doesNotMatch(text, /process\.env/, `${path} reads env`);
    assert.doesNotMatch(text, CUSTOMER, `${path} customer string`);
  }
  for (const path of libFiles.filter((f) => !f.endsWith("works.server.ts"))) {
    const text = code(path);
    assert.ok(path.endsWith(".ts"), `${path} is .ts (no JSX)`);
    assert.doesNotMatch(text, /process\.env|from ["']react["']/, `${path} pure data`);
    assert.doesNotMatch(text, CUSTOMER, `${path} customer string`);
    assert.doesNotMatch(text, /work-catalog|generated\/|home-journey-data|works\.server/, path);
  }
});

/** works.server.ts를 검토 플래그(undefined = 미설정)로 자식 프로세스에서 불러 서비스별 사례 slug를 받는다. */
function selectedWorks(flag) {
  const url = new URL("../lib/content-site/works.server.ts", import.meta.url).href;
  const source = `const m = await import(${JSON.stringify(url)}); const out = {}; for (const id of ${JSON.stringify(ORDER)}) out[id] = { max: m.maxContentWorks(id), slugs: (await m.selectContentWorks(id)).map((w) => w.slug) }; console.log(JSON.stringify(out));`;
  const env = { ...process.env };
  delete env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW;
  delete env.ENABLE_LEGACY_SUPABASE;
  if (flag !== undefined) env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW = flag;
  const result = spawnSync(
    process.execPath,
    ["--conditions=react-server", "--experimental-strip-types", "--input-type=module", "-e", source],
    { env, encoding: "utf8", windowsHide: true },
  );
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test("6-1. 사례 상한: 기본 4, SNS 광고만 6(명세 6-4 매핑 전체). 기본 빌드는 0", () => {
  const review = selectedWorks("1");
  for (const id of ORDER) {
    assert.equal(review[id].max, id === "ad" ? 6 : 4, id);
    assert.ok(review[id].slugs.length <= review[id].max, id);
  }
  assert.deepEqual(
    [...review.ad.slugs].sort(),
    ["bwl-aqua-ad", "bwl-brand-ad", "bwl-cleanser-ad", "bwl-cplus-ad", "yofree-mg-short", "yofree-mg30"],
  );
  for (const flag of [undefined, "0", "true"]) {
    const off = selectedWorks(flag);
    for (const id of ORDER) assert.deepEqual(off[id].slugs, [], `${flag} ${id}`);
  }
});

/* CSS 파서: 주석 제거 후 규칙(선택자, 선언, @media 안 여부)을 돌려준다.
 * @keyframes 본문의 단계(from·to·N%)는 선택자가 아니므로 규칙으로 내지 않는다. 키프레임 이름은 cssKeyframes()가 따로 돌려준다. */
const KEYFRAMES_HEAD = /^@(?:-webkit-)?keyframes\b/;
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
        const inKeyframes = stack.some((s) => KEYFRAMES_HEAD.test(s.head));
        if (!top.head.startsWith("@") && !inKeyframes)
          rules.push({
            selector: top.head,
            decls: top.decls,
            inMedia: stack.some((s) => s.head.startsWith("@media")),
            inMotionOk: stack.some((s) =>
              /^@media[^{]*prefers-reduced-motion:\s*no-preference/.test(s.head),
            ),
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
/** @keyframes 이름 목록(주석 제거 후) */
const cssKeyframes = (css) =>
  [...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/@(?:-webkit-)?keyframes\s+([^\s{]+)/g)].map(
    (m) => m[1],
  );
/** 괄호 안(:where(), :has()) 쉼표는 나누지 않는다 */
function splitSelectors(selector) {
  const out = [];
  let depth = 0,
    cur = "";
  for (const ch of selector) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
const TYPE_PROP =
  /(?:^|[;\s])(font-size|line-height|letter-spacing|font-weight|font-family)\s*:\s*([^;]+)/g;

function checkCss(path, { serviceId } = {}) {
  const css = code(path);
  assert.doesNotMatch(css, /!important/, `${path} !important`);
  // 키프레임 이름도 범위를 지킨다: 서비스 CSS는 cs-svc-<id>-, 그 밖(theme·홈)은 cs-
  for (const name of cssKeyframes(css))
    assert.ok(
      name.startsWith(serviceId ? `cs-svc-${serviceId}-` : "cs-"),
      `${path} keyframes name: ${name}`,
    );
  for (const rule of cssRules(css)) {
    const selectors = splitSelectors(rule.selector);
    for (const decl of rule.decls.matchAll(TYPE_PROP)) {
      const [, prop, raw] = decl;
      const value = raw.trim();
      assert.ok(!rule.inMedia, `${path} type prop in @media: ${rule.selector} { ${prop} }`);
      if (/\.cs-brand\b/.test(rule.selector)) continue;
      assert.ok(
        value.startsWith("var(--cs-t-") || value === "inherit",
        `${path} ${rule.selector} { ${prop}: ${value} }`,
      );
    }
    if (serviceId) {
      // 움직임: 축약형 animation 0(토글의 play-state를 덮는다), 애니메이션·트랜지션은 no-preference 안에서만
      assert.doesNotMatch(rule.decls, /(?:^|[;\s])animation\s*:/, `${path} animation shorthand: ${rule.selector}`);
      if (/(?:^|[;\s])(animation-[\w-]+|transition[\w-]*)\s*:/.test(rule.decls))
        assert.ok(rule.inMotionOk, `${path} motion outside no-preference: ${rule.selector}`);
      for (const s of selectors)
        assert.ok(
          s.startsWith(`.cs-svc-${serviceId}`),
          `${path} selector must start with .cs-svc-${serviceId}: ${s}`,
        );
      for (const m of rule.decls.matchAll(/(?:^|[;\s])color\s*:\s*([^;]+)/g))
        assert.match(
          m[1].trim(),
          /^(var\(--cs-|inherit|currentColor|transparent)/,
          `${path} new text color: ${rule.selector}`,
        );
    } else if (path.endsWith("theme.css")) {
      for (const s of selectors)
        assert.ok(
          s.startsWith(".cs-site") || /^(html|body):has\(\.cs-site\)/.test(s),
          `${path} unscoped selector: ${s}`,
        );
    }
  }
}

test("7. CSS: 역할 토큰만·@media 안 글자 속성 0·!important 0·서비스 선택자 범위", () => {
  // 파서 자체 점검: @keyframes 단계는 규칙이 아니다(@media 안·밖 모두)
  const sample =
    ".cs-svc-x .a { opacity: 1; } @keyframes cs-svc-x-k { from { opacity: 0; } 50% { opacity: 0.5; } to { opacity: 1; } }" +
    " @media (prefers-reduced-motion: no-preference) { @keyframes cs-svc-x-m { 0% { transform: none; } 100% { transform: none; } } .cs-svc-x .b { animation-name: cs-svc-x-m; } }";
  assert.deepEqual(
    cssRules(sample).map((r) => [r.selector, r.inMedia]),
    [
      [".cs-svc-x .a", false],
      [".cs-svc-x .b", true],
    ],
  );
  assert.deepEqual(cssKeyframes(sample), ["cs-svc-x-k", "cs-svc-x-m"]);
  // 키프레임 분리 파일은 없다(서비스 스타일은 <id>.css 한 파일)
  assert.deepEqual(
    siteFiles.filter((f) => f.endsWith(".keyframes.css")),
    [],
  );
  const cssFiles = siteFiles.filter((f) => f.endsWith(".css"));
  assert.ok(cssFiles.some((f) => f.endsWith("theme.css")));
  for (const path of cssFiles) {
    const match = path.replaceAll("\\", "/").match(/services\/([^/]+)\/\1\.css$/);
    checkCss(path, { serviceId: match?.[1] });
  }
  for (const id of ORDER)
    assert.ok(
      existsSync(`components/content-site/services/${id}/${id}.css`),
      `${id} css file`,
    );
  // 글자 역할 크기: 12px 미만·반 픽셀 금지
  const theme = read("components/content-site/theme.css");
  for (const m of theme.matchAll(/--cs-t-[\w-]+-size:\s*([^;]+);/g))
    for (const px of m[1].matchAll(/(\d+(?:\.\d+)?)px/g)) {
      assert.ok(Number(px[1]) >= 12, `size >= 12px: ${m[0]}`);
      assert.ok(Number.isInteger(Number(px[1])), `no half pixel: ${m[0]}`);
    }
  for (const role of [
    "display",
    "h2",
    "statement",
    "h3",
    "lead",
    "body",
    "small",
    "caption",
    "eyebrow",
    "label",
    "price",
    "price-sm",
    "num",
    "nav",
    "button",
    "chip",
  ])
    assert.match(theme, new RegExp(`\\.cs-site \\.cs-t-${role} \\{`), role);
});

test("7-1. CSS: /content 홈(components/content-home)", () => {
  for (const path of homeFiles.filter((f) => f.endsWith(".css"))) checkCss(path);
});

test("8. 소스: style= 0 · /content/work 0 · 작업 사례 0 · 맞춤 견적 0 · 메인 내비 import 0", () => {
  for (const path of [...siteFiles, ...homeFiles]) {
    const text = code(path);
    assert.doesNotMatch(text, /style=/, `${path} inline style`);
    assert.doesNotMatch(text, /\/content\/work/, path);
    assert.doesNotMatch(text, /작업 사례|맞춤 견적/, path);
  }
  for (const path of siteFiles)
    assert.doesNotMatch(
      read(path),
      /import[^;]*\b(GuideNav|ServiceNavigation)\b/,
      path,
    );
  // 공용 client 섬은 6개(frame·header·mobile-bar·motion-toggle·inquiry·reveal)
  const shared = siteFiles.filter(
    (f) =>
      !/services[\\/]|contact[\\/]/.test(f) &&
      /\.tsx$/.test(f) &&
      /^\s*["']use client["']/.test(read(f)),
  );
  assert.deepEqual(
    shared.map((f) => f.replaceAll("\\", "/").replace("components/content-site/", "")).sort(),
    [
      "blocks/inquiry.tsx",
      "shell/frame.tsx",
      "shell/header.tsx",
      "shell/mobile-bar.tsx",
      "shell/motion-toggle.tsx",
      "ui/reveal.tsx",
    ],
  );
  // 서비스마다 고유 client 컴포넌트는 1개 이하
  for (const id of ORDER) {
    const own = siteFiles.filter(
      (f) =>
        f.replaceAll("\\", "/").includes(`services/${id}/`) &&
        /\.tsx$/.test(f) &&
        /^\s*["']use client["']/.test(read(f)),
    );
    assert.ok(own.length <= 1, `${id} client islands <= 1`);
  }
  // 서버 HTML에 autoplay 속성 없음(자동재생은 frame.tsx가 마운트 후 play)
  for (const path of siteFiles.filter((f) => /\.tsx$/.test(f)))
    assert.doesNotMatch(read(path), /\bautoPlay\b/, path);
});

test("8-2. 문의: CsInquiry에 서비스 선택(chooser) 모드 없음, 미선택 문구는 이 사이트 문장만", () => {
  const inquiry = code("components/content-site/blocks/inquiry.tsx");
  assert.doesNotMatch(inquiry, /\bchooser\b|type="radio"/);
  assert.match(inquiry, /unselectedMessage=\{CS_COPY\.inquiry\.serviceMissing\}/);
  assert.equal(CS_COPY.inquiry.serviceMissing, "요청 서비스를 하나 골라주세요");
  // '아직 모르겠어요' 선택지는 컨텐츠 사이트에 없으므로 그 선택지를 가리키는 문장도 없다
  for (const path of [...siteFiles, ...homeFiles, ...libFiles])
    assert.doesNotMatch(read(path), /모르겠/, path);
  // 기본 문장은 공용 InquiryBridge의 기본값으로만 남고(메인·개발 폼용) prop으로 바뀐다
  const bridge = code("components/guide/inquiry-bridge.tsx");
  assert.match(bridge, /setError\(unselectedMessage\)/);
  assert.equal((bridge.match(/아직 모르겠어요/g) ?? []).length, 1);
});

test("8-3. 공용 미디어: 조작 막대가 있는 영상의 태그는 박스 밖, 자막 트랙은 선택", () => {
  const media = code("components/content-site/ui/media.tsx");
  assert.match(media, /const controls = props\.controls \?\? !props\.autoplay;/);
  // 박스 안 태그는 조작 막대가 없을 때만, 있으면 .cs-media-stack 안에서 박스 다음
  assert.match(media, /\{props\.tag && !controls \? <CsTag>\{props\.tag\}<\/CsTag> : null\}/);
  assert.match(
    media,
    /<div className="cs-media-stack">\s*\{video\}\s*<CsTag>\{props\.tag\}<\/CsTag>\s*<\/div>/,
  );
  assert.match(media, /captions\?: \{ src: string; label: string; srcLang\?: string; default\?: boolean \}/);
  assert.match(media, /\{props\.captions \? \(\s*<track\s+kind="captions"/);
  const theme = code("components/content-site/theme.css");
  assert.match(theme, /\.cs-site \.cs-media-stack > \.cs-tag \{\s*align-self: flex-start;/);
  // 서비스 CSS가 조작 막대 영상 태그를 따로 옮기지 않는다(공용 규칙 하나)
  for (const path of siteFiles.filter((f) => f.endsWith(".css") && !f.endsWith("theme.css")))
    assert.doesNotMatch(code(path), /video-media > \.cs-tag|:has\(> video\[controls\]\)/, path);
});

test("8-1. 소스: /content 홈은 GuideNav를 쓰지 않는다", () => {
  for (const path of homeFiles)
    assert.doesNotMatch(read(path), /import[^;]*\b(GuideNav|ServiceNavigation)\b/, path);
});

test("9. 라우트·삭제·리다이렉트", () => {
  assert.equal(existsSync("components/content-service"), false);
  assert.equal(existsSync("lib/content-service-plans.ts"), false);
  for (const path of [
    "app/(public)/[division]/services/[service]/page.tsx",
    "app/(public)/[division]/page.tsx",
  ]) {
    const text = code(path);
    assert.doesNotMatch(text, /content-service/, path);
    assert.doesNotMatch(text, /ContentHome/, path);
    assert.match(text, /d\.id === "video"\) notFound\(\)/, `${path} video branch → notFound`);
  }
  for (const file of readdirSync(".").filter((f) => /^next\.config\./.test(f)))
    assert.doesNotMatch(read(file), /\/content\/work/, file);
  const group = "app/(content-site)/content";
  for (const path of [
    `${group}/layout.tsx`,
    `${group}/page.tsx`,
    `${group}/contact/page.tsx`,
    `${group}/services/[service]/page.tsx`,
  ])
    assert.ok(existsSync(path), path);
  // 그룹에 없는 하위 경로는 (public)/[division]이 계속 처리한다
  for (const sub of ["insights", "work"])
    assert.equal(existsSync(`${group}/${sub}`), false, `${sub} stays in (public)`);
  const layout = code(`${group}/layout.tsx`);
  assert.match(layout, /import "@\/components\/content-site\/theme\.css"/);
  assert.doesNotMatch(layout, /components\/guide\/[\w-]+\.css|work-portfolio\.css/);
  assert.match(layout, /<Analytics/);
  assert.match(layout, /organizationSchema/);
  assert.doesNotMatch(layout, /\b(Header|Footer|FloatingContact|PageNavigation)\b/);
  for (const path of walkFiles(group))
    assert.doesNotMatch(code(path), /robots/, `${path} does not override robots`);
  // 서비스 페이지: 6종 외는 404, 사례는 서버에서만
  const servicePage = read(`${group}/services/[service]/page.tsx`);
  assert.match(servicePage, /dynamicParams = false/);
  assert.match(servicePage, /selectContentWorks/);
  assert.match(servicePage, /serviceJsonLd/);
  // 레지스트리: 6종 모두 등록, 공통 블록 순서 고정
  const registry = read("components/content-site/service-landing.tsx");
  const order = [
    "<Hero",
    "<CsTypes",
    "<Signature",
    "<CsWorks",
    "<BeforePricing",
    "<CsPricing",
    "<CsProcess",
    "<CsScope",
    "<CsFaq",
    "<CsInquiry",
    "<CsRelated",
  ].map((tag) => registry.indexOf(tag));
  assert.ok(order.every((i) => i > 0), "all blocks present");
  assert.deepEqual([...order].sort((a, b) => a - b), order, "section order");
  for (const id of ORDER) {
    assert.ok(existsSync(`components/content-site/services/${id}/landing.tsx`), id);
    assert.ok(existsSync(`lib/content-site/services/${id}.ts`), id);
  }
});

test("10. 테마 맵·자산", () => {
  assert.deepEqual(csRoute("/content"), { theme: "ink", service: "home", page: "home" });
  assert.deepEqual(csRoute("/content/contact"), {
    theme: "ink",
    service: "contact",
    page: "contact",
  });
  const themes = {
    webtoon: "paper",
    animation: "paper",
    "ai-influencer": "paper",
    "motion-graphics": "ink",
    "brand-film": "ink",
    ad: "ink",
  };
  for (const id of ORDER)
    assert.deepEqual(csRoute(`/content/services/${id}`), {
      theme: themes[id],
      service: id,
      page: "service",
      serviceId: id,
    });
  assert.equal(csRoute("/content/services/editing").service, "home");
  // 벤치마크 v01 dist/assets 복사본(MANIFEST.json SHA-256과 같아야 한다)
  const sha = {
    "hero.webp": "59790ca5952628e6eca342aa5b609f5f1e6f60633f4b51e8b859993eedfcad02",
    "brand.webp": "e238c98eb08f046021599410f613a61495e34cb5a74b33fdefbdaec15686ea22",
    "animation.webp": "ac8b9c60caadde32f4b04b283bee7e61eb9576e8a446c8f13034105be59a4fb6",
    "creator.webp": "9e8aeb3b56b8b02913bad5a4fa954aaf0f29e38231c06b9a106726f90a44dc45",
    "webtoon.webp": "c5f9c0de937c3b190e3a5de484cf3a8f6d992eda30922307a469611a0f6267bf",
    "brand-motion.mp4": "1c6f0bbdb7a1ccca1f6ad1372f33b295fffb7d338dcf4883d38204b439e52539",
  };
  for (const [name, hash] of Object.entries(sha))
    assert.equal(
      createHash("sha256").update(readFileSync(`public/content-site/${name}`)).digest("hex"),
      hash,
      name,
    );
  for (const asset of Object.values(CONTENT_SITE_ASSETS))
    assert.ok(existsSync(join("public", asset.src)), asset.src);
});

test("10-1. paper 서비스 색: 서비스마다 --cs-bg-2, 그 위 글자 대비 4.5:1 이상", () => {
  const theme = code("components/content-site/theme.css");
  const block = (selector) => {
    const at = theme.indexOf(`${selector} {`);
    assert.ok(at >= 0, selector);
    return theme.slice(at, theme.indexOf("}", at));
  };
  const token = (text, name) => text.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "i"))?.[1];
  const luminance = (hex) => {
    const [r, g, b] = hex
      .slice(1)
      .match(/../g)
      .map((h) => parseInt(h, 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  const paper = block('.cs-site[data-cs-theme="paper"]');
  for (const id of ["webtoon", "animation", "ai-influencer"]) {
    const svc = block(`.cs-site[data-cs-service="${id}"]`);
    const bg = token(svc, "cs-bg");
    const bg2 = token(svc, "cs-bg-2");
    assert.ok(bg && bg2, `${id} defines --cs-bg and --cs-bg-2`);
    assert.notEqual(bg2, token(paper, "cs-bg-2"), `${id} own --cs-bg-2`);
    assert.ok(ratio(bg, bg2) > 1.04, `${id} bg-2 differs from bg`);
    for (const fg of [token(paper, "cs-fg"), token(paper, "cs-fg-2"), token(paper, "cs-fg-3"), token(svc, "cs-accent-text")])
      for (const surface of [bg, bg2])
        assert.ok(ratio(fg, surface) >= 4.5, `${id} ${fg} on ${surface}: ${ratio(fg, surface).toFixed(2)}`);
  }
});
