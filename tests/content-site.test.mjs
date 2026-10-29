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
import { COMMON_FAQ } from "../lib/content-site/faq.ts";
import { csRoute } from "../lib/content-site/theme-map.ts";
import { serviceJsonLd } from "../lib/content-site/schema.ts";
import { DETAIL_COPY } from "../lib/content-site/service-detail-content.ts";
import { serviceCaseSchema } from "../lib/service-case-schema.ts";
import {
  PRICING_COMMON,
  PRICING_COMMON_LINES,
  contentPricing,
  formatWon,
  planOptions,
  pricingPlans,
  startingPrice,
  WEBTOON_PAGE_STANDARD,
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
const ALLOWED_NUMBERS = new Set(["1", "2", "3", "4", "5", "6", "12", "20", "24", "30", "60"]);
const APPROVED_R8 = readFileSync("docs/renewal-2026-10-13/BRIEF_R8.md", "utf8");
const BANNED =
  /을 통해|를 통해|에 대해|아니라|없이|최고|최저|보장|1위|%|\d+배|혁신|차원이 다른|압도적|극대화|시너지|원스톱|완벽|최적|퀄리티|콘텐츠|운영 중|게시 중|팔로워|조회수|립싱크|목소리|고화질|coming soon|준비 중|공개 예정|곧 공개|맞춤 견적|작업 사례/i;
const CUSTOMER =
  /reference-review|BWL|DR's Secret|DR&#x27;s Secret|닥터시크릿|힐러넷|HEALERNET|YoFree|요프리|MAXTECH|맥스테크|bwl-|yofree-|healernet-|maxtech-/i;

// v14/v15 authorization applies only to these named modules and explicit case IDs.
// It does not change the historical review catalog gate or existing client boundaries.
const DETAIL_CLIENT_MODULES = [
  "service-detail/additional-cases.tsx",
  "service-detail/character-details.tsx",
  "service-detail/experience.tsx",
  "service-detail/film-details.tsx",
  "service-detail/film-preview.tsx",
  "service-detail/record-detail.tsx",
  "service-detail/service-tools.tsx",
  "service-detail/shared.tsx",
  "service-detail/starting-board.tsx",
  "service-detail/webtoon-reader.tsx",
  "service-detail/webtoon.tsx",
];
const REFERENCE_CLIENT_MODULES = ["references/reference-library.tsx"];
const DETAIL_CUSTOMER_CLIENTS = new Set([
  "service-detail/character-details.tsx",
  "service-detail/film-details.tsx",
  "service-detail/webtoon.tsx",
]);
const APPROVED_CASE_IDS_V14 = [
  "CASE-AIO-BRAND-INTRO", "CASE-BWL-BRAND-AD", "CASE-BWL-BRAND-MOTION",
  "CASE-BWL-CLEANSER-AD", "CASE-BWL-CPLUS-AD", "CASE-CLUBOWNER-EP01",
  "CASE-HEALERNET-MOTION", "CASE-UNNIE87-MODEL", "CASE-YOFREE-CHARACTER",
  "CASE-YOFREE-JINSANG", "CASE-YOFREE-NIGHT", "CASE-YOFREE-OUTING", "CASE-YOFREE-SHORT",
];
const APPROVED_CASE_IDS_V15 = [...APPROVED_CASE_IDS_V14, "CASE-MAXTECH-BRANDFILM"].sort();
const YOFREE_MOTION_PAIRS_V15 = Array.from({ length: 6 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return { src: `/service-detail-v15/yofree-pose-${number}.mp4`, poster: `/service-detail-v15/yofree-character-${number}.webp` };
});
const PRIVATE_DETAIL_MARKERS = /AIO_SERVICE_CASE_V1|sourceWorkIds|sourceSHA256|source_sha256|[IC]:[\\/]|\/mnt\/|(?:09_TRANSFER|01_WORK|06_GITHUB)[\\/]|SUPABASE_SERVICE_ROLE_KEY|access_token|refresh_token|sk-[A-Za-z0-9]{12,}/;
const DETAIL_CSS_CONTRACTS = {
  "service-detail/detail.css": {
    scope: /^\.sd(?:[\s.:#>\[+~]|$)|^\.sd-[a-z]/,
    keyframes: ["sd-enter"],
  },
  "service-detail/character-details.css": {
    scope: /^(?:\.sd-(?:animation|ai)(?=[\s.:#>\[+~]|$)|:is\(\.sd-animation,\s*\.sd-ai\))/,
    keyframes: ["sd-character-entrance"],
  },
  "service-detail/film-details.css": {
    // The desktop type override adds .sd specificity only before this exact
    // three-service group; it does not permit a general .sd prefix in film CSS.
    scope: /^(?:\.sd-(?:motion|brand|ad)(?=[\s.:#>\[+~]|$)|(?:\.sd\s+)?:is\(\.sd-motion,\s*\.sd-brand,\s*\.sd-ad\)(?=[\s.:#>\[+~]|$))/,
    keyframes: ["sdFilmEnter", "sdFilmSideReveal"],
  },
  "service-detail/webtoon-detail.css": {
    scope: /^\.sd-webtoon(?=[\s.:#>\[+~]|$)/,
    keyframes: ["wt-page-one", "wt-page-two"],
  },
  "service-detail/experience.css": {
    scope: /^\.sd(?=[\s.:#>\[+~]|$)/,
    keyframes: [],
  },
  "service-detail/service-tools.css": {
    scope: /^\.sd(?=[\s.:#>\[+~]|$)/,
    keyframes: [],
  },
  "references/references.css": {
    scope: /^\.cr-page(?=[\s.:#>\[+~]|$)/,
    keyframes: [],
  },
  "shell/header-v15.css": {
    scope: /^\.cs-site\s+\.cs-header-v15(?=[-\s.:#>\[+~]|$)|^\.cs-site:has\(\.cs-header-v15\)$/,
    keyframes: [],
  },
};

const siteRelative = (path) => path.replaceAll("\\", "/").replace(/^components\/content-site\//, "");

const read = (path) => readFileSync(path, "utf8").replaceAll("\r\n", "\n");
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
    .split(/\n|(?<=[.?!])\s+|(?<=니다)\s+/)
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

function checkCopy({ path, key, value }, { latin = true } = {}) {
  const where = `${path}: ${value}`;
  assert.doesNotMatch(value, CUSTOMER, `customer name · ${where}`);
  if (APPROVED_R8.includes(value.replaceAll("\n", "\\n")) || /signature\.(cutBoard|grammar)/.test(path)) return;
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
  // v16: the user explicitly changed webtoon offers to page units and specified
  // a fixed digital page. These exact measurements are not performance claims.
  if (path.startsWith("webtoon.")) rest = rest
    .replace(/\b(?:1,024|1,536)px/g, "")
    .replace(/2:3/g, "")
    .replace(/\b(?:1|12|24)P\b/g, "");
  for (const m of rest.matchAll(/\d+(?:\.\d+)?/g))
    assert.ok(ALLOWED_NUMBERS.has(m[0]), `number ${m[0]} not allowed · ${where}`);
  // 쉼표: 한 문장 1개 이하
  for (const s of sentences(value.replace(/(?<=\d),(?=\d{3}(?:\D|$))/g, "")))
    assert.ok((s.match(/,/g) || []).length <= 1, `comma <= 1 · ${where}`);
  // 문장 끝에 쉼표절을 붙이지 않는다
  assert.doesNotMatch(value, /,\s*$/, `trailing comma · ${where}`);
  // Keep the earlier rule for unchanged services; v16 webtoon copy uses short sentences.
  assert.doesNotMatch(value, /[가-힣]\.(?=\s|$)|\.$/, `no sentence stops · ${where}`);
  if (key === "question") {
    assert.match(value, /\?$/, `question ends with ? · ${where}`);
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
      ["웹툰 12P + 모션코믹 30초", "17.5만 원"],
      ["웹툰 24P + 모션코믹 60초", "30만 원"],
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
    "맞춤형은 브랜드 전용 캐릭터 제작 서비스 포함",
  ]);
  assert.deepEqual(pricingPlans("ad").notes, [
    "제품·서비스 1개, 콘셉트 1개 기준 세로형 9:16·1080p, 기본 자막·BGM 포함",
    "다른 화면비 추가·광고 집행·계정 운영·매체비는 별도",
  ]);
  assert.deepEqual(pricingPlans("ai-influencer").notes, [
    "총 20장에 세팅용 이미지 포함 주 이미지 5장·영상 1편 구성 가능",
    "계정 게시·운영 및 대량 제작은 별도 견적",
  ]);
  assert.deepEqual(pricingPlans("webtoon").notes, [
    "모션코믹 단독 상품은 완성된 웹툰을 영상으로 편집하는 구성입니다 웹툰 신규 제작이 필요하면 함께 제작 세트를 선택하세요",
  ]);
  assert.deepEqual(WEBTOON_PAGE_STANDARD, { width: 1024, height: 1536, ratio: "2:3", label: "가로 1,024px × 세로 1,536px" });
  assert.deepEqual(pricingPlans("animation").notes, []);
  assert.deepEqual(pricingPlans("brand-film").notes, []);
  assert.deepEqual(PRICING_COMMON_LINES, [
    "표시 금액은 모두 부가세 별도입니다",
    "기획안 전달 후 수정 2회, 최종안 전달 후 수정 1회가 포함됩니다",
    "대량 제작과 정기 제작은 따로 견적을 드립니다",
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
          assert.ok(line.length <= 16 || APPROVED_R8.includes(value.replaceAll("\n", "\\n")), `${path} line <= 11: ${line}`);
    // R6: 히어로 facts는 없다(타입·6개 서비스 데이터 모두)
    assert.equal("facts" in data.hero, false, `${id} hero.facts removed`);
  }
  // 셸·공통 블록 고정 문구
  for (const entry of strings(CS_COPY, ["CS_COPY"]))
    checkCopy(entry, { latin: false });
});

test("4. FAQ·SEO", () => {
  // R6: 서비스 3 + 공통 2(수정 횟수 · 정기 제작). 부가세 별도는 히어로 가격 줄과 가격 주석에만 둔다
  const common = COMMON_FAQ;
  assert.equal(common.length, 2);
  assert.match(common[0][1], /기획안.*2회.*최종안.*1회.*추가 수정.*범위/);
  assert.match(common[1][1], /편수와 일정.*범위와 견적/);
  assert.ok(!common.some(([, a]) => /부가세/.test(a)), "common FAQ does not repeat the VAT note");
  const titles = new Set(),
    descriptions = new Set();
  for (const id of ORDER) {
    const { faq, seo } = contentLandings[id];
    // 서비스 문항은 3개가 기준이다(motion-graphics는 2개라 합계 4: WP-B가 한 문항을 더하면 5)
    assert.ok(faq.length === 7, `${id} FAQ = service 5 + common 2`);
    assert.deepEqual(faq.slice(-2), common, `${id} ends with common FAQ`);
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
    // 부가세 별도는 가격 블록 주석에서 한 번만 말한다(FAQ에 되풀이하지 않음)
    assert.match(PRICING_COMMON.vat, /부가세 별도/);
    for (const [, answer] of faq) assert.doesNotMatch(answer, /부가세/, `${id} FAQ repeats the VAT note`);
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

test("4-1. 새 상세의 화면 FAQ와 라우트 JSON-LD는 같은 FAQ를 사용한다", () => {
  const route = code("app/(content-site)/content/services/[service]/page.tsx");
  const detail = code("components/content-site/service-detail/index.tsx");
  assert.match(route, /import\s*\{\s*DETAIL_COPY\s*\}\s*from\s*["']@\/lib\/content-site\/service-detail-content["']/);
  assert.match(route, /serviceJsonLd\(service,\s*DETAIL_COPY\[service\]\.faq\)/);
  assert.match(detail, /copy\s*=\s*DETAIL_COPY\[id\]/);
  assert.match(detail, /copy\.faq\.map\(/);
  for (const id of ORDER) {
    const [baseService, , baseBreadcrumb] = serviceJsonLd(id);
    const [service, faq, breadcrumb] = serviceJsonLd(id, DETAIL_COPY[id].faq);
    assert.deepEqual(service, baseService, `${id} FAQ override preserves service, offers and VAT`);
    assert.deepEqual(breadcrumb, baseBreadcrumb, `${id} FAQ override preserves canonical breadcrumbs`);
    assert.equal(faq["@type"], "FAQPage");
    assert.deepEqual(faq.mainEntity.map((question) => [question.name, question.acceptedAnswer.text]), DETAIL_COPY[id].faq, `${id} current visible FAQ`);
  }
});

test("5. AI 인플루언서 범위·표기(FACTS_AI_INFLUENCER)", () => {
  const ai = contentLandings["ai-influencer"];
  const all = strings(ai).map((s) => s.value);
  assert.ok(all.some(s => /계정 게시와 운영.*따로 견적/.test(s)), "R8 Q38: operation boundary is explicit in FAQ and process");
  assert.ok(pricingPlans("ai-influencer").notes.includes("계정 게시·운영 및 대량 제작은 별도 견적"));
  for (const text of all)
    assert.doesNotMatch(
      text,
      /팔로워|조회수|성과|전환|운영 중|게시 중|고화질|목소리|립싱크|채택|계약|후기|동안|고객 납품/,
      text,
    );
  assert.match(MEDIA_TAGS.aiPerson, /AI 가상인물/);
  assert.deepEqual(MEDIA_TAGS, {
    sample:"제작 예시", sampleAi:"제작 예시 · AI 생성 장면 포함", webtoonReel:"웹툰 제작 예시", aiPersonSample:"AI 가상인물 출연 · 제안용 시안",
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
        /from\s+["'][^"']*(work-catalog|generated|home-journey-data|works\.server|service-cases\.server|\/db)[^"']*["']/,
        `${path} imports server data`,
      );
      assert.doesNotMatch(text, /from\s+["']@\/lib\/content-site["']/, `${path} imports all landing data`);
      if (!DETAIL_CUSTOMER_CLIENTS.has(siteRelative(path)))
        assert.doesNotMatch(text, CUSTOMER, `${path} client customer string`);
      else {
        assert.doesNotMatch(text, /reference-review/, `${path} cannot embed legacy private media paths`);
        assert.doesNotMatch(text, PRIVATE_DETAIL_MARKERS, `${path} cannot expose case-body markers, source locations or tokens`);
      }
    }
    assert.doesNotMatch(text, /process\.env/, `${path} reads env`);
    // R3 server renderers may look up a selected work by slug. Their rendered
    // OFF output and actual client bundles are checked in isolated production QA
  }
  for (const path of libFiles.filter((f) => !f.endsWith("works.server.ts"))) {
    const text = code(path);
    assert.ok(path.endsWith(".ts"), `${path} is .ts (no JSX)`);
    assert.doesNotMatch(text, /process\.env|from ["']react["']/, `${path} pure data`);
    if (path.replaceAll("\\", "/") !== "lib/content-site/service-detail-content.ts")
      assert.doesNotMatch(text, CUSTOMER, `${path} customer string`);
    else assert.doesNotMatch(text, PRIVATE_DETAIL_MARKERS, `${path} public copy contains private markers`);
    assert.doesNotMatch(text, /work-catalog|generated\/|home-journey-data|works\.server/, path);
  }
});

test("6-4. approved case IDs stay explicit and the original 85 media hashes remain frozen", () => {
  const seedText = read("content/service-cases-v14.json");
  const manifestText = read("content/service-detail-assets-v14.json");
  const seed = JSON.parse(seedText);
  const manifest = JSON.parse(manifestText);
  for (const record of seed) assert.equal(serviceCaseSchema.safeParse(record).success, true, record.caseId);
  assert.deepEqual(seed.map((record) => record.caseId).sort(), APPROVED_CASE_IDS_V15);
  assert.equal(manifest.assets.length, 85);
  // Freeze both the allowed paths and their hashes, so changing files plus the
  // manifest together cannot silently broaden this specific user authorization.
  const pinned = manifest.assets.map(({ path, sha256 }) => ({ path, sha256 }))
    .sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  assert.equal(createHash("sha256").update(JSON.stringify(pinned)).digest("hex"), "fe87e313f0baace2aa1e0f06961fbc423f193d02726176d368590e488255d852");
  const sourceLinks = manifest.assets.map(({ path, sourceId }) => ({ path, sourceId }))
    .sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  assert.equal(createHash("sha256").update(JSON.stringify(sourceLinks)).digest("hex"), "433b362a99d369c54b5ebcd6c7503556bbaf8d308b34235d0a9bb0143957a4fe", "the original public source identities must not be relabeled along with a manifest edit");
  assert.equal(new Set(sourceLinks.map((asset) => asset.sourceId)).size, 85);
  const approved = new Set(manifest.assets.map((asset) => asset.path));
  assert.equal(approved.size, 85);
  assert.deepEqual(walkFiles("public/service-detail-v14").map((path) => `/${path.replaceAll("\\", "/").replace(/^public\//, "")}`).sort(), [...approved].sort());
  for (const asset of manifest.assets) {
    assert.match(asset.path, /^\/service-detail-v14\/[a-z0-9-]+\.(?:webp|mp4)$/);
    const actual = readFileSync(join("public", asset.path));
    assert.equal(actual.length, asset.bytes, asset.path);
    assert.equal(createHash("sha256").update(actual).digest("hex"), asset.sha256, asset.path);
  }
  assert.doesNotMatch(manifestText, PRIVATE_DETAIL_MARKERS);
  // sourceWorkIds is legitimate server-only seed linkage, never public copy.
  for (const record of seed.filter((record) => APPROVED_CASE_IDS_V14.includes(record.caseId))) {
    for (const asset of record.assets) {
      if (asset.src.startsWith("/service-detail-v15/")) {
        assert.equal(record.caseId, "CASE-YOFREE-CHARACTER", "only the specifically revised character case adds v15 material to the original cases");
        assert.ok(YOFREE_MOTION_PAIRS_V15.some((pair) => pair.src === asset.src && pair.poster === asset.poster), `${record.caseId} must use its exact new motion/poster pairs`);
      } else {
        assert.ok(approved.has(asset.src), `${record.caseId} source must be approved`);
        if (asset.poster) assert.ok(approved.has(asset.poster), `${record.caseId} poster must be approved`);
      }
    }
    for (const stage of record.stages) if (stage.asset) assert.ok(approved.has(stage.asset), `${record.caseId} process image must be approved`);
    const { sourceWorkIds, ...publicRecord } = record;
    assert.ok(Array.isArray(sourceWorkIds));
    assert.doesNotMatch(JSON.stringify(publicRecord), PRIVATE_DETAIL_MARKERS);
  }
  for (const name of DETAIL_CLIENT_MODULES)
    assert.doesNotMatch(code(`components/content-site/${name}`), PRIVATE_DETAIL_MARKERS, name);
  const maxtech = seed.find((record) => record.caseId === "CASE-MAXTECH-BRANDFILM");
  assert.deepEqual(maxtech.sourceWorkIds, [], "unknown official work identity stays unfilled");
  assert.equal(maxtech.productionStatus, "draft");
  assert.match(maxtech.publicLabel, /시안/);
  const character = seed.find((record) => record.caseId === "CASE-YOFREE-CHARACTER");
  assert.equal(character.revision, 2);
  assert.deepEqual(character.sourceWorkIds, ["AIO-WORK-YOFREE-AD-02"], "new pose outputs stay connected to the existing canonical source identity");
  assert.equal(character.productionStatus, "draft");
  assert.match(character.publicLabel, /시안/);
  assert.equal(character.services.find((service) => service.id === "animation").relation, "direct");
  assert.deepEqual(character.assets.slice(0, 4).map(({ src, poster }) => ({ src, ...(poster ? { poster } : {}) })), [
    { src: "/service-detail-v14/yofree-character-03.webp" },
    { src: "/service-detail-v14/yofree-kinetic.mp4", poster: "/service-detail-v14/poster-yofree-kinetic.webp" },
    { src: "/service-detail-v14/yofree-premium.mp4", poster: "/service-detail-v14/poster-yofree-premium.webp" },
    { src: "/service-detail-v14/yofree-motioncomic.mp4", poster: "/service-detail-v14/poster-yofree-motioncomic.webp" },
  ], "the previous four results remain intact before the six new motions");
  assert.deepEqual(character.assets.slice(4).map(({ src, poster }) => ({ src, poster })), YOFREE_MOTION_PAIRS_V15);
});

test("6-5. the new reference library receives only approved public case fields through the server reader", () => {
  const route = code("app/(content-site)/content/references/page.tsx");
  const client = code("components/content-site/references/reference-library.tsx");
  assert.match(route, /await\s+allServiceCases\(\)/);
  assert.match(route, /new Map\(records\.map\(\(record\)\s*=>\s*\[record\.caseId,\s*record\]\)\)/);
  const fields = route.match(/unique\.map\(\(\{([^}]+)\}\)\s*=>\s*\(\{/);
  assert.ok(fields, "the reference route projects a named public-field list");
  assert.deepEqual(fields[1].split(",").map((field) => field.trim()).filter(Boolean).sort(), ["caseId", "title", "brand", "summary", "scope", "publicLabel", "productionStatus", "services", "assets"].sort());
  assert.doesNotMatch(route, /\.\.\.(?:record|entry)\b/);
  assert.doesNotMatch(client, PRIVATE_DETAIL_MARKERS);
  assert.doesNotMatch(client, /work-catalog|works\.server|service-cases\.server|reference-review|process\.env/);
  assert.match(client, /record\.publicLabel/);
  assert.match(client, /record\.productionStatus\s*===\s*"draft"/);
  assert.match(client, /record\.services\.some\(/);
  assert.match(client, /terms\.every\(/);
  assert.match(client, /setSelectedId\(null\)/);
});

test("6-6. the fourteen v15 assets retain their approved bytes, hashes, types and public source identities", () => {
  const manifestText = read("content/service-detail-assets-v15.json");
  const manifest = JSON.parse(manifestText);
  assert.equal(manifest.version, "v15");
  assert.equal(manifest.assets.length, 14);
  assert.doesNotMatch(manifestText, PRIVATE_DETAIL_MARKERS);
  const pinned = manifest.assets.map(({ path, bytes, sha256, kind, sourceId }) => ({ path, bytes, sha256, kind, sourceId }))
    .sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  assert.equal(createHash("sha256").update(JSON.stringify(pinned)).digest("hex"), "31f76da8d299d688d8658ad04d29d07ee7b15138b6cdc6391d64b1fa74d868c5", "new files and their manifest cannot be replaced together without a separately reviewed contract change");
  assert.equal(new Set(pinned.map((asset) => asset.sourceId)).size, 14);
  const expected = [
    ...YOFREE_MOTION_PAIRS_V15.flatMap(({ src, poster }) => [src, poster]),
    "/service-detail-v15/maxtech/hero-promo.mp4", "/service-detail-v15/maxtech/poster.webp",
  ].sort();
  const approved = new Set(pinned.map((asset) => asset.path));
  assert.equal(approved.size, 14);
  assert.deepEqual([...approved].sort(), expected);
  assert.deepEqual(walkFiles("public/service-detail-v15").map((path) => `/${path.replaceAll("\\", "/").replace(/^public\//, "")}`).sort(), expected, "unlisted extra public assets must not enter this authorization");
  for (const asset of manifest.assets) {
    assert.deepEqual(Object.keys(asset).sort(), ["path", "bytes", "sha256", "kind", "sourceId"].sort(), "public asset entries expose only the five approved fields");
    assert.match(asset.sourceId, /^(?:yofree-(?:character|pose)-0[1-6]|maxtech-(?:hero-promo|poster))$/);
    assert.equal(asset.kind, asset.path.endsWith(".mp4") ? "video" : "image");
    const actual = readFileSync(join("public", asset.path));
    assert.equal(actual.length, asset.bytes, asset.path);
    assert.equal(createHash("sha256").update(actual).digest("hex"), asset.sha256, asset.path);
  }
  const seed = JSON.parse(read("content/service-cases-v14.json"));
  for (const record of seed) {
    const paths = [...record.assets.flatMap(({ src, poster }) => [src, ...(poster ? [poster] : [])]), ...record.stages.flatMap(({ asset }) => asset ? [asset] : [])];
    for (const path of paths.filter((path) => path.startsWith("/service-detail-v15/")))
      assert.ok(approved.has(path), `${record.caseId} must reference an approved new asset`);
  }
  const maxtech = seed.find((record) => record.caseId === "CASE-MAXTECH-BRANDFILM");
  assert.deepEqual(maxtech.assets.map(({ src, poster }) => ({ src, poster })), [{ src: "/service-detail-v15/maxtech/hero-promo.mp4", poster: "/service-detail-v15/maxtech/poster.webp" }]);
});

/** works.server.ts를 검토 플래그(undefined = 미설정)로 자식 프로세스에서 불러 서비스별 사례를 받는다. */
function runWorksChild(flag, source) {
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

function selectedWorks(flag) {
  const url = new URL("../lib/content-site/works.server.ts", import.meta.url).href;
  const source = `const m = await import(${JSON.stringify(url)}); const out = {}; for (const id of ${JSON.stringify(ORDER)}) out[id] = { max: m.maxContentWorks(id), ...(await (async () => { const cards = await m.selectContentWorks(id); return { slugs: cards.map((w) => w.slug), placed: cards.filter((w) => w.placement).map((w) => w.slug), cards: cards.map((w) => ({ slug: w.slug, placement: w.placement, labels: w.signatureLabels, railLead: w.railLead, variantLabel: w.variantLabel, portraitPosters: w.media.filter((m) => m.kind === "video" && m.presentation === "portrait" && m.poster).length })) }; })()) }; console.log(JSON.stringify(out));`;
  return runWorksChild(flag, source);
}

/** 고정 데이터: 실제 검토 작품에 가상 광고 작품 2건(order가 요프리보다 앞)을 더해 pickContentWorks("ad")로 고른다 */
function pickedWithVirtualAdWorks() {
  const url = new URL("../lib/content-site/works.server.ts", import.meta.url).href;
  const catalogUrl = new URL("../lib/work-catalog.ts", import.meta.url).href;
  const source = `const m = await import(${JSON.stringify(url)}); const c = await import(${JSON.stringify(catalogUrl)}); const base = c.reviewWorks.find((w) => w.slug === "bwl-aqua-ad"); const virtual = [1, 2].map((n) => ({ ...base, id: "virtual-ad-" + n, slug: "virtual-ad-" + n, order: -100 + n })); const cards = m.pickContentWorks("ad", [...c.reviewWorks, ...virtual]); console.log(JSON.stringify(cards.map((w) => ({ slug: w.slug, placement: w.placement }))));`;
  return runWorksChild("1", source);
}

const TONE_LABELS = ["가벼운 키네틱 톤", "한지와 먹의 프리미엄 톤", "웹툰 모션코믹 톤"];

test("6-1. 사례 상한: 기본 4, SNS 광고만 5(placement 작품은 상한 밖). 광고는 시그니처 1건 + 목록 4건. 기본 빌드는 0", () => {
  const review = selectedWorks("1");
  for (const id of ORDER) {
    assert.equal(review[id].max, id === "ad" ? 5 : 4, id);
    const listed = review[id].slugs.filter((slug) => !review[id].placed.includes(slug));
    assert.ok(listed.length <= review[id].max, id);
  }
  // R7: yofree-mg30은 시그니처(ad-signature)로 옮겨 목록에서 빠진다. 목록은 정확히 4건이고 순서가 정해져 있다
  assert.deepEqual(
    review.ad.cards.filter((card) => card.placement).map((card) => [card.slug, card.placement]),
    [["yofree-mg30", "ad-signature"]],
  );
  assert.deepEqual(
    review.ad.slugs.filter((slug) => !review.ad.placed.includes(slug)),
    ["yofree-mg-short", "bwl-aqua-ad", "bwl-cplus-ad", "bwl-cleanser-ad"],
  );
  assert.equal(review.ad.slugs.length, 5);
  // 가상 광고 작품 2건을 더해도 요프리 2건이 상한에 밀려 빠지지 않는다
  const virtual = pickedWithVirtualAdWorks();
  const virtualListed = virtual.filter((card) => !card.placement).map((card) => card.slug);
  assert.deepEqual(virtual.filter((card) => card.placement).map((card) => card.slug), ["yofree-mg30"]);
  assert.equal(virtualListed[0], "yofree-mg-short", "9:16 영상이 많은 작품이 목록 첫 자리");
  assert.equal(virtualListed.length, 5, "목록은 상한 5까지, placement 작품은 따로");
  assert.ok(virtualListed.includes("virtual-ad-1") && virtualListed.includes("virtual-ad-2"));
  // 브랜드 광고 30초 시안은 SNS 광고에서 빠지고 브랜드 홍보 영상(brand-film)이 계속 고른다
  assert.equal(review.ad.slugs.includes("bwl-brand-ad"), false);
  assert.equal(review["brand-film"].slugs.includes("bwl-brand-ad"), true);
  for (const flag of [undefined, "0", "true"]) {
    const off = selectedWorks(flag);
    for (const id of ORDER) assert.deepEqual(off[id].slugs, [], `${flag} ${id}`);
  }
});

test("6-2. R7 사례 중복 방지: 광고는 yofree-mg30을 시그니처(ad-signature)에 두고 목록에서 뺀다, 모션그래픽은 character-case 유지", () => {
  const review = selectedWorks("1");
  assert.deepEqual(review["motion-graphics"].placed, ["yofree-mg30"]);
  assert.deepEqual(review.ad.placed, ["yofree-mg30"]);
  assert.deepEqual(review["ai-influencer"].placed, ["bwl-aqua-ad", "bwl-cplus-ad", "bwl-cleanser-ad"]);
  for (const id of ORDER.filter((id) => !["motion-graphics", "ad", "ai-influencer"].includes(id))) assert.deepEqual(review[id].placed, [], id);
  const placement = (id) => review[id].cards.find((card) => card.placement)?.placement;
  assert.equal(placement("ad"), "ad-signature");
  assert.equal(placement("motion-graphics"), "character-case");
  // 사례 목록은 placement 작품을 거른다(두 번 보이지 않는다)
  assert.match(code("components/content-site/service-landing.tsx"), /<CsWorks works=\{works\.filter\(\(work\) => !work\.placement\)\}/);
  // 시그니처 3장면 이름·레일 앞칸·안 수 표시는 서버가 만든 값이다
  const card = (slug) => review.ad.cards.find((item) => item.slug === slug);
  assert.deepEqual(card("yofree-mg30").labels, TONE_LABELS);
  assert.equal(card("yofree-mg30").railLead, true);
  assert.equal(card("yofree-mg-short").railLead, true);
  assert.equal(card("yofree-mg-short").variantLabel, "4안");
  assert.equal(review.ad.cards.filter((item) => item.railLead).length, 2);
  // 레일 앞 7칸 = 30초 3편(9:16 3개) + 4안(9:16 4개) 포스터, 시그니처 3장면 = 9:16 3편
  assert.equal(card("yofree-mg30").portraitPosters, 3);
  assert.equal(card("yofree-mg-short").portraitPosters, 4);
  assert.deepEqual(review.ad.cards.filter((item) => item.railLead).map((item) => item.slug), ["yofree-mg30", "yofree-mg-short"]);
  const adCode = code("components/content-site/services/ad/landing.tsx");
  assert.match(adCode, /item\.placement === "ad-signature"/);
  assert.match(adCode, /item\.placement === "ad-signature"/);
  assert.match(adCode, /review\.href/);
  assert.equal(review.ad.cards.filter((item) => item.variantLabel).length, 1);
  assert.equal(review["motion-graphics"].cards.some((item) => item.labels || item.railLead || item.variantLabel), false);
  assert.deepEqual(selectedWorks(undefined)["motion-graphics"].placed, []);
});

test("6-3. R7 누수: 시그니처 톤 라벨 3개와 고객 문자열은 works.server.ts 밖(client 섬·광고 landing·사례 블록·CSS·공개판 결과)에 0건", () => {
  // 톤 라벨은 서버 파일에만 있다
  const files = ["components", "lib", "app"]
    .flatMap(walkFiles)
    .filter((f) => /\.(tsx?|css|json)$/.test(f) && !f.replaceAll("\\", "/").endsWith("lib/content-site/works.server.ts"));
  for (const path of files) {
    const text = read(path);
    for (const label of TONE_LABELS) assert.ok(!text.includes(label), `${path} has tone label: ${label}`);
  }
  assert.ok(read("lib/content-site/works.server.ts").includes(TONE_LABELS[0]));
  // 광고 landing·client 섬·사례 블록·광고 CSS·공용 타입에는 고객명·slug·경로가 없다(서버가 props로 준다)
  for (const path of [
    "components/content-site/services/ad/landing.tsx",
    "components/content-site/services/ad/ad-reel.tsx",
    "components/content-site/services/ad/ad.css",
    "components/content-site/blocks/works.tsx",
    "lib/content-site/types.ts",
  ])
    assert.doesNotMatch(code(path), CUSTOMER, `${path} customer string`);
  // 공개판(검토 플래그 없음·"0"·"true")은 사례가 비어 있어 라벨·표시 필드가 직렬화 결과에 없다
  for (const flag of [undefined, "0", "true"]) {
    const text = JSON.stringify(selectedWorks(flag));
    for (const label of TONE_LABELS) assert.ok(!text.includes(label), `${flag} public result has ${label}`);
    assert.doesNotMatch(text, /yofree|ad-signature|railLead|variantLabel|labels/i, `${flag} public result`);
  }
  // 검토판 결과에는 있다(위 검사가 빈 검사가 아니라는 증거)
  assert.ok(JSON.stringify(selectedWorks("1")).includes(TONE_LABELS[2]));
  // 안 수 표시는 서버 값만 쓴다: 사례 블록은 "N안" 문자열을 만들지 않는다
  assert.doesNotMatch(code("components/content-site/blocks/works.tsx"), /\d안|\}안/);
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
            inMotionReduced: stack.some((s) => /^@media[^{]*prefers-reduced-motion:\s*reduce(?:\)|\s)/.test(s.head)),
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

function checkDetailCss(path, contract) {
  const css = code(path);
  const rules = cssRules(css);
  assert.deepEqual(cssKeyframes(css).sort(), [...contract.keyframes].sort(), `${path} named entrance animations`);
  assert.doesNotMatch(css, /@import\b|@font-face\b|url\s*\(/i, `${path} cannot introduce a font or unapproved asset load`);
  for (const rule of rules) {
    for (const selector of splitSelectors(rule.selector)) {
      if (siteRelative(path) === "service-detail/detail.css" && selector === ".cs-site:has(.sd)") {
        // The mobile bar is outside the .sd detail body but inside the same
        // .cs-site frame. Only a frame containing .sd receives these three
        // lavender tokens; neither the company main nor content home has .sd.
        // Keep this exact selector and declarations, not a broader frame prefix.
        assert.deepEqual(rule.decls.split(";").map((item) => item.replaceAll(/\s/g, "")).filter(Boolean).sort(), [
          "--cs-accent:#b9aeff", "--cs-accent-text:#b9aeff", "--cs-on-accent:#14102a",
        ].sort(), `${path} detail-frame mobile-bar colors only`);
      } else if (siteRelative(path) === "shell/header-v15.css" && selector === ".cs-site:has(.cs-header-v15)") {
        assert.match(rule.decls.trim(), /^--cs-header-h:\s*(?:76|112|116)px;?$/, "only the active content header reserves its exact frame height");
      } else assert.match(selector, contract.scope, `${path} detail-only selector: ${selector}`);
    }
    for (const declaration of rule.decls.split(";").filter((item) => /!important/.test(item))) {
      assert.equal(rule.inMotionReduced, true, `${path} !important only stops reduced-motion behavior`);
      assert.match(declaration.trim(), /^(?:animation|transition)\s*:\s*none\s*!important$|^scroll-behavior\s*:\s*auto\s*!important$/, `${path} !important declaration`);
    }
    for (const declaration of rule.decls.matchAll(/(?:^|;)\s*font-family\s*:\s*([^;]+)/g))
      assert.equal(declaration[1].trim(), "inherit", `${path} keeps the existing font family`);
    if (/(?:^|[;\s])animation\s*:\s*(?!none)[^;]+/.test(rule.decls) && !rule.inMotionOk)
      assert.ok(rules.some((item) => item.inMotionReduced && /animation\s*:\s*none/.test(item.decls)), `${path} entrance animation has an explicit reduced-motion stop`);
  }
}

test("7. CSS: 기존 역할 토큰 유지·새 상세 명시 범위·감소모션 예외만 허용", () => {
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
  assert.deepEqual(cssFiles.map(siteRelative).filter((path) => path.startsWith("service-detail/")).sort(), Object.keys(DETAIL_CSS_CONTRACTS).filter((path) => path.startsWith("service-detail/")).sort(), "new detail styles require an explicit scoped contract");
  for (const path of cssFiles) {
    const detailContract = DETAIL_CSS_CONTRACTS[siteRelative(path)];
    if (detailContract) { checkDetailCss(path, detailContract); continue; }
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
    const inlinePermissions = {
      "service-detail/experience.tsx": /style=\{\{\s*width:\s*`\$\{progress \* 100\}%`\s*\}\}/g,
      "service-detail/service-tools.tsx": /style=\{\{\s*"--compare-split":\s*`\$\{split\}%`\s*\}\s*as\s+CSSProperties\}/g,
    };
    const permission = inlinePermissions[siteRelative(path)];
    if (permission) {
      assert.equal([...text.matchAll(permission)].length, 1, `${path} one bounded presentation value`);
      assert.doesNotMatch(text.replace(permission, ""), /style=/, `${path} no additional inline style`);
    } else assert.doesNotMatch(text, /style=/, `${path} inline style`);
    assert.doesNotMatch(text, /\/content\/work/, path);
    assert.doesNotMatch(text, /작업 사례|맞춤 견적/, path);
  }
  for (const path of siteFiles)
    assert.doesNotMatch(
      read(path),
      /import[^;]*\b(GuideNav|ServiceNavigation)\b/,
      path,
    );
  // The original six client islands remain fixed; v14 adds seven named detail modules.
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
      ...REFERENCE_CLIENT_MODULES,
      ...DETAIL_CLIENT_MODULES,
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

test("8-4. the content header exposes all six service links and references without a hidden dropdown", () => {
  const header = code("components/content-site/shell/header.tsx");
  const css = code("components/content-site/shell/header-v15.css");
  assert.match(header, /CONTENT_SERVICES\.map\(\(service\)/);
  assert.match(header, /href=\{contentServicePath\(service\.id\)\}/);
  assert.match(header, /aria-label="콘텐츠 전체 메뉴"/);
  assert.match(header, /href="\/content\/references"/);
  assert.match(header, /href="\/content\/insights"/);
  assert.match(header, /href="\/content\/contact"/);
  assert.doesNotMatch(header, /<details\b|<summary\b|각 서비스|cs-services-menu/);
  assert.match(header, /aria-current=/);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /min-height:\s*44px/);
});

test("8-5. the global top action is public-route scoped, keyboard accessible and respects reduced motion", () => {
  const top = code("components/scroll-to-top.tsx");
  const css = code("components/scroll-to-top.css");
  assert.equal((code("app/layout.tsx").match(/<ScrollToTop\s*\/>/g) ?? []).length, 1, "the root layout owns one top action");
  const pageNavigation = code("components/page-navigation.tsx");
  assert.doesNotMatch(pageNavigation, /<button\b|맨 위로|scrollTo\(/, "the old company-page top action must not duplicate the root action");
  assert.match(pageNavigation, /new ResizeObserver\(measure\)/);
  assert.match(pageNavigation, /observer\.observe\(header\)/);
  assert.match(pageNavigation, /--site-header-height/);
  assert.match(pageNavigation, /observer\.disconnect\(\)/, "removing the button must preserve the guide header measurement cleanup");
  assert.match(top, /if\s*\(path\.startsWith\("\/admin"\)\)\s*return null/);
  assert.match(top, /aria-label="맨 위로 이동"/);
  assert.match(top, /tabIndex=\{visible\s*&&\s*!keyboard\s*\?\s*0\s*:\s*-1\}/);
  assert.match(top, /prefers-reduced-motion:\s*reduce/);
  assert.match(top, /heading\.focus\(\{\s*preventScroll:\s*true\s*\}\)/);
  assert.match(top, /Math\.min\(1,\s*Math\.max\(0,/);
  assert.doesNotMatch(top, PRIVATE_DETAIL_MARKERS);
  assert.doesNotMatch(top, /work-catalog|service-cases\.server|process\.env/);
  assert.equal((top.match(/style=/g) ?? []).length, 1);
  assert.match(top, /style=\{\{\s*"--top-progress":\s*progress\s*\}\s*as\s+CSSProperties\}/);
  for (const rule of cssRules(css)) for (const selector of splitSelectors(rule.selector))
    assert.ok(selector.startsWith(".aio-scroll-top") || selector === "body:has(.cs-mbar) .aio-scroll-top" || selector === "body:has(.floating-contact:not([hidden])) .aio-scroll-top", `top-only selector: ${selector}`);
});

test("8-6. v15 chapter progress and comparison allow only bounded user-facing presentation values", () => {
  const experience = code("components/content-site/service-detail/experience.tsx");
  const tools = code("components/content-site/service-detail/service-tools.tsx");
  assert.match(experience, /setProgress\(Math\.max\(0,\s*Math\.min\(1,/);
  assert.match(experience, /useCsMotion\(\)/);
  assert.match(experience, /prefers-reduced-motion:\s*no-preference/);
  assert.match(experience, /aria-label="상세 페이지 목차"/);
  assert.match(experience, /tabIndex=\{visible\s*\?\s*0\s*:\s*-1\}/);
  assert.match(experience, /media\.revert\(\)/);
  assert.match(tools, /type="range"\s+min=\{0\}\s+max=\{100\}/);
  assert.match(tools, /setSplit\(Number\(event\.target\.value\)\)/);
  assert.match(tools, /setSplit\(0\)/);
  assert.match(tools, /setSplit\(50\)/);
  assert.match(tools, /setSplit\(100\)/);
  for (const text of [experience, tools]) {
    assert.doesNotMatch(text, PRIVATE_DETAIL_MARKERS);
    assert.doesNotMatch(text, /work-catalog|works\.server|service-cases\.server|process\.env/);
  }
});

test("8-2. 문의: CsInquiry에 서비스 선택(chooser) 모드 없음, 미선택 문구는 이 사이트 문장만", () => {
  const inquiry = code("components/content-site/blocks/inquiry.tsx");
  assert.doesNotMatch(inquiry, /\bchooser\b|name="service"/);
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
    "app/(public)/marketing/services/[service]/page.tsx",
    "app/(public)/marketing/page.tsx",
  ]) {
    const text = code(path);
    assert.doesNotMatch(text, /content-service/, path);
    assert.doesNotMatch(text, /ContentHome/, path);
    assert.match(text, /d\.id === "video"\) notFound\(\)/, `${path} video branch → notFound`);
  }
  assert.equal(existsSync("app/(public)/[division]"), false);
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
  // R2 인사이트와 사례 상세도 컨텐츠 셸을 유지하며 삭제된 /content/work는 부활하지 않는다
  assert.equal(existsSync(`${group}/work`), false);
  for (const route of ["insights/page.tsx", "insights/[slug]/page.tsx", "projects/[slug]/page.tsx"])
    assert.ok(existsSync(`${group}/${route}`), route);
  const project = code(`${group}/projects/[slug]/page.tsx`);
  assert.match(project, /displayWorkCatalog\(\[\]\)/);
  assert.match(project, /if \(!work\) notFound\(\)/);
  assert.match(project, /work\.visibility === "review"[\s\S]*index:\s*false/);
  assert.match(project, /\/content\/services\/\$\{service\}#works/);
  const layout = code(`${group}/layout.tsx`);
  assert.match(layout, /import "@\/components\/content-site\/theme\.css"/);
  assert.doesNotMatch(layout, /components\/guide\/[\w-]+\.css|work-portfolio\.css/);
  assert.match(layout, /<Analytics/);
  assert.match(layout, /organizationSchema/);
  assert.doesNotMatch(layout, /\b(Header|Footer|FloatingContact|PageNavigation)\b/);
  for (const path of walkFiles(group).filter(path => !path.replaceAll("\\", "/").includes("/projects/")))
    assert.doesNotMatch(code(path), /robots/, `${path} does not override robots`);
  // 서비스 페이지: 6종 외는 404, 사례는 서버에서만
  const servicePage = read(`${group}/services/[service]/page.tsx`);
  assert.match(servicePage, /dynamicParams = false/);
  assert.match(servicePage, /if\s*\(!isContentServiceId\(service\)\)\s*notFound\(\)/);
  assert.match(servicePage, /import\s*\{\s*serviceCases\s*\}\s*from\s*["']@\/lib\/service-cases\.server["']/);
  assert.match(servicePage, /const\s+cases\s*=\s*await\s+serviceCases\(service\)/);
  assert.match(servicePage, /<ServiceDetail\s+id=\{service\}\s+cases=\{cases\}\s*\/>/);
  const caseServer = code("lib/service-cases.server.ts");
  assert.match(caseServer.trimStart(), /^import\s*["']server-only["'];/);
  assert.match(caseServer, /\.select\(["']id,body,is_published,rights_confirmed["']\)/);
  assert.match(caseServer, /entry\.is_published\s*&&\s*entry\.rights_confirmed\s*\?\s*["']published["']\s*:\s*["']draft["']/);
  assert.match(caseServer, /publicRecords\(mergeServiceCases\(seedServiceCases,\s*additions\)\)/);
  assert.match(caseServer, /casesForService\(await\s+allServiceCases\(\),\s*id\)/);
  assert.match(caseServer, /if\s*\(error\)\s*return\s*\[\]/);
  assert.match(servicePage, /serviceJsonLd/);
  // 레지스트리: 6종 모두 등록, 공통 블록 순서 고정
  // R6 순서: Hero → Signature → BeforePricing(AI) → Pricing(+포함·별도) → Process → Works(검토판) → FAQ → Inquiry → Related
  const registry = read("components/content-site/service-landing.tsx");
  assert.doesNotMatch(code("components/content-site/service-landing.tsx"), /CsTypes|CsScope/, "no Types/Scope section in landing");
  const order = [
    "<Hero",
    "<Signature",
    "<BeforePricing",
    "<CsPricing",
    "<CsProcess",
    "<CsWorks",
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
    webtoon: "ink",
    animation: "ink",
    "ai-influencer": "ink",
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
  // 벤치마크 v01 dist/assets 복사본(content/media-manifest.json SHA-256과 같아야 한다)
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

test("10-1. R2 공통 검정 바탕: 서비스별 색상 재정의 금지·글자 대비 4.5:1 이상", () => {
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
  const shared = block('.cs-site .cs-footer');
  assert.equal(token(shared, "cs-bg"), "#080808");
  assert.equal(token(shared, "cs-bg-2"), "#080808");
  assert.doesNotMatch(theme, /data-cs-theme="paper"/);
  for (const id of ORDER) {
    const svc = block(`.cs-site[data-cs-service="${id}"]`);
    const bg = token(svc, "cs-bg") ?? token(shared, "cs-bg");
    const bg2 = token(svc, "cs-bg-2") ?? token(shared, "cs-bg-2");
    assert.equal(bg, "#080808", `${id} black canvas`);
    assert.equal(bg2, bg, `${id} sections share the canvas`);
    for (const fg of [token(shared, "cs-fg"), token(shared, "cs-fg-2"), token(shared, "cs-fg-3"), token(svc, "cs-accent-text")])
      for (const surface of [bg, bg2])
        assert.ok(ratio(fg, surface) >= 4.5, `${id} ${fg} on ${surface}: ${ratio(fg, surface).toFixed(2)}`);
  }
});

/* ------------------------------------------------------------------------------------------
 * R6 WP-0 공통 계약(BRIEF_R6 1·2절): 타이포 한 벌 · 간격 · 박스 · 히어로 · 가격 · 진행 방식 · 관련 서비스 · 정렬
 * ------------------------------------------------------------------------------------------ */
const THEME = "components/content-site/theme.css";
/** 선택자가 정확히 같은 규칙들의 선언을 합쳐 돌려준다 */
function declsOf(css, selector) {
  return cssRules(css)
    .filter((r) => splitSelectors(r.selector).includes(selector))
    .map((r) => r.decls)
    .join(";");
}
const themeCode = () => code(THEME);
const token = (css, name) => css.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1].trim();
/** @media (min-width: Npx) { ... } 블록 본문 모음 */
function mediaBlocks(css, query) {
  const out = [];
  const head = `@media (min-width: ${query}px)`;
  let from = 0;
  while ((from = css.indexOf(head, from)) >= 0) {
    const open = css.indexOf("{", from);
    let depth = 0;
    let i = open;
    for (; i < css.length; i++) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}" && --depth === 0) break;
    }
    out.push(css.slice(open + 1, i));
    from = i;
  }
  return out.join("\n");
}

test("11. R6 타이포 한 벌: 홈·서비스·메인이 같은 H1·H2·H3·캡션 값을 쓴다", () => {
  const theme = themeCode();
  const globals = code("app/globals.css");
  assert.equal(token(theme, "cs-t-display-size"), "clamp(34px, 5vw, 72px)");
  assert.equal(token(theme, "cs-t-display-weight"), "750");
  assert.equal(token(theme, "cs-t-display-leading"), "1.2");
  assert.equal(token(theme, "cs-t-display-tracking"), "-0.04em");
  assert.equal(token(theme, "cs-t-h2-size"), "clamp(28px, 3.2vw, 44px)");
  assert.equal(token(theme, "cs-t-h2-weight"), "700");
  assert.equal(token(theme, "cs-t-h2-leading"), "1.3");
  assert.equal(token(theme, "cs-t-h2-tracking"), "-0.03em");
  assert.equal(token(theme, "cs-t-h3-size"), "clamp(20px, 1.6vw, 24px)");
  assert.equal(token(theme, "cs-t-h3-weight"), "650");
  assert.equal(token(theme, "cs-t-h3-leading"), "1.4");
  assert.equal(token(theme, "cs-t-body-size"), "16px");
  assert.equal(token(theme, "cs-t-body-leading"), "1.75");
  assert.equal(token(theme, "cs-t-caption-size"), "13px");
  // 덮어쓰기·폐지: 같은 토큰을 두 번 정의하지 않고 statement·service-display 토큰은 없다
  for (const name of ["cs-t-display-size", "cs-t-display-leading", "cs-t-h2-size", "cs-t-h2-leading"])
    assert.equal((theme.match(new RegExp(`--${name}:`, "g")) ?? []).length, 1, `${name} defined once`);
  for (const path of [...siteFiles, ...walkFiles("app/(content-site)")].filter((f) => /\.(css|tsx?)$/.test(f))) {
    assert.doesNotMatch(read(path), /cs-t-service-display-size|--cs-t-statement/, path);
  }
  assert.doesNotMatch(theme, /\.cs-t-statement/, "statement role removed");
  // 서비스 히어로 CSS는 제목·리드 글자 크기를 다시 정하지 않는다
  const editorial = code("components/content-site/services/service-editorial.css");
  assert.doesNotMatch(
    declsOf(editorial, ".cs-site .cs-service-editorial-heading .cs-t-display"),
    /font-size|line-height|letter-spacing/,
  );
  assert.doesNotMatch(
    declsOf(editorial, ".cs-site .cs-service-editorial-copy > .cs-t-lead"),
    /font-size|line-height/,
  );
  // 메인 --type-*가 컨텐츠 값과 같다(TYPE_STANDARD 9-3)
  for (const part of ["size", "weight", "leading", "tracking"]) {
    assert.equal(token(globals, `type-h1-${part}`), token(theme, `cs-t-display-${part}`), `h1 ${part}`);
    assert.equal(token(globals, `type-h2-${part}`), token(theme, `cs-t-h2-${part}`), `h2 ${part}`);
    assert.equal(token(globals, `type-h3-${part}`), token(theme, `cs-t-h3-${part}`), `h3 ${part}`);
  }
  assert.equal(token(globals, "type-caption-size"), token(theme, "cs-t-caption-size"));
});

test("11-1. R6 간격: 섹션 위아래 두 값 · 선과 --alt 삭제 · 거터 통일 · 읽기 폭", () => {
  const theme = themeCode();
  const globals = code("app/globals.css");
  assert.equal(token(theme, "cs-section-y"), "clamp(64px, 7vw, 96px)");
  assert.equal(token(theme, "cs-section-y-sm"), "clamp(40px, 4.5vw, 64px)");
  assert.equal(token(theme, "cs-measure"), "34em");
  assert.equal(token(theme, "cs-read"), "880px");
  assert.equal(token(theme, "cs-container"), "1440px");
  // 메인과 컨텐츠의 거터·섹션 간격이 같은 값
  assert.equal(token(theme, "cs-gutter"), "clamp(20px, 4vw, 56px)");
  assert.equal(token(globals, "gutter"), token(theme, "cs-gutter"));
  assert.equal(token(globals, "section-y"), token(theme, "cs-section-y"));
  assert.equal(token(globals, "section-y-sm"), token(theme, "cs-section-y-sm"));
  // 섹션 구분은 여백만: border-top 없음, --alt 없음
  assert.doesNotMatch(declsOf(theme, ".cs-site .cs-section"), /border/);
  assert.doesNotMatch(theme, /cs-section--alt/);
  for (const path of siteFiles.filter((f) => /blocks[\\/].*\.tsx$/.test(f) || /service-landing\.tsx$/.test(f)))
    assert.doesNotMatch(read(path), /cs-section--alt/, path);
  // 읽기 컨테이너: 880. 진행 방식·FAQ가 쓴다
  assert.match(declsOf(theme, ".cs-site .cs-container--read"), /max-width:\s*calc\(var\(--cs-read\)/);
  for (const file of ["process", "faq"])
    assert.match(read(`components/content-site/blocks/${file}.tsx`), /cs-container cs-container--read/, file);
  // 문단 폭은 --cs-measure 하나
  assert.match(declsOf(theme, ".cs-site .cs-head-lead"), /max-width:\s*var\(--cs-measure\)/);
  assert.match(declsOf(theme, ".cs-site .cs-faq-a"), /max-width:\s*var\(--cs-measure\)/);
  // 서비스 히어로 패딩은 공통 토큰
  const editorial = code("components/content-site/services/service-editorial.css");
  assert.match(
    declsOf(editorial, ".cs-site .cs-hero.cs-service-editorial-hero"),
    /padding-block:\s*var\(--cs-section-y-sm\)/,
  );
  // 히어로 최소 높이(100svh 계열) 없음
  assert.doesNotMatch(declsOf(theme, ".cs-site .cs-hero"), /min-height/);
  assert.doesNotMatch(mediaBlocks(theme, 1024), /\.cs-hero\s*\{[^}]*min-height/);
});

test("11-2. R6 박스: 항목 카드·박스 속 박스·가격 칩 틀 없음, 박스는 플랜·문의 폼·미디어·버튼만", () => {
  const theme = themeCode();
  for (const selector of [
    ".cs-site .cs-scope-col",
    ".cs-site .cs-insight-card",
    ".cs-site .cs-step",
    ".cs-site .cs-related-row",
    ".cs-site .cs-price",
  ]) {
    const decls = declsOf(theme, selector);
    assert.ok(decls.length > 0, selector);
    assert.doesNotMatch(decls, /background|border-radius|box-shadow/, `${selector} has a box frame`);
    assert.doesNotMatch(decls, /(?:^|;)\s*border\s*:/, `${selector} has a full border`);
  }
  assert.doesNotMatch(declsOf(theme, ".cs-site .cs-step-check"), /background|border|padding\s*:/, "step check is not a box");
  assert.doesNotMatch(theme, /\.cs-related-card/);
  // 플랜 박스와 문의 폼 카드는 틀을 유지한다
  assert.match(declsOf(theme, ".cs-site .cs-plan"), /border:\s*1px solid var\(--cs-line\)/);
  assert.doesNotMatch(declsOf(theme, ".cs-site .cs-plan"), /background/);
  assert.match(declsOf(theme, ".cs-site .cs-inquiry-card"), /border-radius:\s*var\(--cs-r-md\)/);
  assert.match(declsOf(theme, ".cs-site .cs-inquiry-card"), /padding:\s*var\(--cs-s5\)/);
  assert.match(mediaBlocks(theme, 768), /\.cs-inquiry-card\s*\{[^}]*padding:\s*var\(--cs-s6\)/);
});

test("11-3. R6 서비스 히어로: eyebrow · h1 · lead · 가격 한 줄 · 상담 신청 1개 · 미디어", () => {
  const hero = code("components/content-site/services/service-hero.tsx");
  const fn = hero.slice(hero.indexOf("export function ServiceHero"), hero.indexOf("export function FeaturedWork"));
  assert.doesNotMatch(fn, /facts|hero-facts|hero\.secondary|price\.note|hero\.note|가격 보기|startingPrice/);
  assert.equal((fn.match(/<a /g) ?? []).length, 1, "ServiceHero has exactly one button");
  assert.match(fn, /href="#inquiry"[^>]*>\{CS_COPY\.hero\.primary\}/);
  assert.match(fn, /<CsPrice id=\{data\.id\}\/>/);
  assert.deepEqual(Object.keys(CS_COPY.hero), ["primary"]);
  assert.equal(CS_COPY.hero.primary, "상담 신청");
  // 공개 export는 실제로 쓰이는 것만 남긴다(brand-film·motion-graphics·animation이 사용)
  for (const name of ["FeaturedWork", "ExampleFigure", "ProductionNotes"])
    assert.match(hero, new RegExp(`export function ${name}\\b`), name);
  // 사용되지 않던 blocks/hero.tsx(CsHero)와 blocks/types.tsx(CsTypes)는 삭제했다
  for (const dead of ["components/content-site/blocks/hero.tsx", "components/content-site/blocks/types.tsx"])
    assert.equal(existsSync(join(process.cwd(), dead)), false, `${dead} removed`);
  // 가격은 칩 틀 없는 한 줄 텍스트(.cs-price)
  assert.match(declsOf(themeCode(), ".cs-site .cs-price"), /display:\s*block/);
});

test("11-4. R6 가격: 360부터 2열 · 라벨/금액 2줄 · 카드마다 부가세·상담 링크 없음 · 배지 1개", () => {
  const theme = themeCode();
  assert.match(mediaBlocks(theme, 360), /\.cs-pricing-grid\[data-count="2"\]\s*\{[^}]*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(mediaBlocks(theme, 480), /\.cs-pricing-grid\s*\{[^}]*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(mediaBlocks(theme, 1024), /\.cs-pricing-grid\[data-count="3"\]\s*\{[^}]*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(declsOf(theme, ".cs-site .cs-plan"), /padding:\s*20px/);
  assert.match(mediaBlocks(theme, 480), /\.cs-plan\s*\{[^}]*padding:\s*var\(--cs-s5\)/);
  assert.match(declsOf(theme, ".cs-site .cs-plan"), /align-items:\s*flex-start/);
  assert.doesNotMatch(theme, /\.cs-plan\s+\.cs-link/);
  const pricing = code("components/content-site/blocks/pricing.tsx");
  assert.match(pricing, /id="pricing"/, "#pricing anchor stays");
  assert.doesNotMatch(pricing, /data-plan|c\.cta|c\.vat|부가세 별도|PRICING_COMMON_LINES|revisions|bulk/);
  assert.match(pricing, /PRICING_COMMON\.vat/);
  // R7: 알약 배지 없음. 묶음(함께 제작) 그룹은 보라 외곽 박스 1개이고 그룹 제목은 박스 안에 한 번만 쓴다
  assert.equal((pricing.match(/cs-pricing-badge/g) ?? []).length, 0, "no pill badge");
  assert.doesNotMatch(themeCode(), /cs-pricing-badge/);
  assert.doesNotMatch(pricing, /cs-plan-badge|index === 0/, "plan boxes share one structure (no badge inside a box)");
  assert.equal((pricing.match(/cs-pricing-group--bundle/g) ?? []).length, 1, "one outer bundle box");
  assert.match(pricing, /group\.bundle \?/, "outer box class only on the bundle group");
  assert.match(declsOf(theme, ".cs-site .cs-pricing-group--bundle"), /border:\s*1px solid var\(--cs-accent\)/);
  assert.match(declsOf(theme, ".cs-site .cs-plan--bundle"), /border:\s*0/, "inner cells have no border of their own");
  assert.match(declsOf(theme, ".cs-site .cs-plan-amount"), /margin-top:\s*auto/, "two amounts share one baseline row");
  assert.equal((pricing.match(/<h3 className="cs-t-label">\{plan\.label\}<\/h3>/g) ?? []).length, 1);
  assert.deepEqual(Object.keys(CS_COPY.pricing), ["eyebrow", "title", "bundle"]);
  // 웹툰 3그룹 순서·금액은 content-pricing 그대로
  assert.deepEqual(
    pricingPlans("webtoon").groups.map((g) => g.plans.map((p) => p.amount)),
    [
      [100000, 180000],
      [75000, 120000],
      [175000, 300000],
    ],
  );
  // 포함·별도 범위는 같은 섹션 아래 2열 텍스트(별도 Scope 섹션 없음)
  assert.match(pricing, /<CsScopeText scope=\{scope\}/);
  const scope = code("components/content-site/blocks/scope.tsx");
  assert.doesNotMatch(scope, /<section|CsSectionHead|id="scope"/);
  assert.match(scope, /keep\(scope.included\)/);
  assert.match(mediaBlocks(theme, 768), /\.cs-scope-grid\s*\{[^}]*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
});

test("11-5. R6 진행 방식: 박스 없는 텍스트 4행 · 번호/단계/한 줄/함께 확인", () => {
  const process = code("components/content-site/blocks/process.tsx");
  assert.match(process, /cs-container cs-container--read/);
  assert.match(process, /cs-step-body/);
  assert.match(process, /CS_COPY\.process\.check/);
  assert.doesNotMatch(process, /PRICING_COMMON|data-reveal/);
  for (const id of ORDER) assert.equal(contentLandings[id].process.steps.length, 6, id);
  const theme = themeCode();
  assert.match(declsOf(theme, ".cs-site .cs-step"), /border-top:\s*1px solid var\(--cs-line\)/);
  assert.doesNotMatch(declsOf(theme, ".cs-site .cs-steps"), /repeat\(/);
  assert.equal(token(theme, "cs-t-num-size"), "14px");
});

test("11-6. R6 문의: 폼 위 진행 순서 3단계 삭제", () => {
  const inquiry = code("components/content-site/blocks/inquiry.tsx");
  assert.doesNotMatch(inquiry, /cs-inquiry-steps|inquiry\.steps|stepsLabel/);
  assert.deepEqual(Object.keys(CS_COPY.inquiry).filter((k) => /steps/i.test(k)), []);
  assert.doesNotMatch(themeCode(), /cs-inquiry-steps/);
});

test("11-7. R6 관련 서비스: 박스 카드 없이 행 목록(서비스명 / 한 줄 설명 / 시작가), 1열 → 2열 → 3열", () => {
  const related = code("components/content-site/blocks/related.tsx");
  assert.match(related, /export function CsRelated\b/);
  assert.match(related, /contentHomeServices/, "one-line text comes from lib/content-home.ts (read-only)");
  assert.doesNotMatch(related, /cs-related-card|cs-section--alt/);
  const theme = themeCode();
  assert.match(declsOf(theme, ".cs-site .cs-related-list"), /grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(mediaBlocks(theme, 768), /\.cs-related-list\s*\{[^}]*repeat\(2,/);
  assert.match(mediaBlocks(theme, 1024), /\.cs-related-list\s*\{[^}]*repeat\(3,/);
  assert.match(declsOf(theme, ".cs-site .cs-related-row"), /min-height:\s*72px/);
  assert.match(declsOf(theme, ".cs-site .cs-related-row"), /border-top:\s*1px solid var\(--cs-line\)/);
  // 모든 서비스에 한 줄 설명이 있다
  for (const s of CONTENT_SERVICES) {
    const line = contentHome.contentHomeServices.find((h) => h.id === s.id)?.line;
    assert.ok(line && line.length > 0, `${s.id} line`);
  }
});

test("11-8. R8 pricing/process/FAQ are centered and inquiry/related keep their existing flow", () => {
  const css = themeCode();
  for (const selector of [".cs-pricing-groups", ".cs-plan", ".cs-pricing-notes", ".cs-scope-grid", ".cs-faq-q", ".cs-faq-a"])
    assert.ok(cssRules(css).some(rule => rule.selector.includes(selector) && /text-align:\s*center/.test(rule.decls)), selector);
  for (const block of ["pricing", "process", "faq"])
    assert.match(code(`components/content-site/blocks/${block}.tsx`), /align="center"/);
  assert.match(css, /cs-container--read-center\s*\{[^}]*margin-inline:auto/);
});
