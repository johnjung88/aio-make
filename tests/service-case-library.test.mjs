import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, unlink, rmdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { isSafeImageUrl, isSafeMediaUrl } from "../lib/domain.ts";
import {
  CASE_BODY_PREFIX,
  serviceCaseSchema,
  mergeServiceCases,
  casesForService,
  encodeServiceCaseBody,
  parseServiceCaseBody,
  serviceCasePresentation,
} from "../lib/service-case-schema.ts";

// Independent business fixtures: adding a work, revising its story, and displaying
// a proposal must never imply a new representative, customer acceptance or posting.
function representative() {
  return serviceCaseSchema.parse({
    caseId: "CASE-CLUBOWNER-EP01",
    slug: "clubowner-episode-one",
    revision: 2,
    title: "《1억의 구단주》 1화",
    brand: "AIO 자체 IP",
    summary: "구단 창단과 인물의 변화를 다룬 축구 웹툰입니다.",
    scope: "이야기 기획 · 캐릭터 · 원고 · 작화",
    publicLabel: "AIO 자체 IP · 완성 웹툰",
    productionStatus: "completed",
    publication: "published",
    sourceWorkIds: ["AIO-WORK-CLUBOWNER-EP01"],
    services: [{ id: "webtoon", relation: "direct", description: "같은 1화의 완성 웹툰" }],
    assets: [{ kind: "webtoon", src: "/service-detail-v14/webtoon-01.webp", alt: "1화 실제 완성 첫 페이지" }],
    featuredFor: ["webtoon"],
    order: 10,
  });
}

function proposal() {
  return serviceCaseSchema.parse({
    caseId: "CASE-YOFREE-CHARACTER",
    slug: "yofree-character-motion",
    revision: 1,
    title: "YoFree 캐릭터의 인사와 설명",
    brand: "YoFree",
    summary: "제품 캐릭터를 구축하고 실제 모션 장면에 활용한 제작 시안입니다.",
    scope: "캐릭터 이미지 · 포즈 자산 · 모션 편집",
    publicLabel: "고객 제안용 제작 시안 · 캐릭터·모션 활용",
    productionStatus: "draft",
    publication: "ready",
    sourceWorkIds: ["AIO-WORK-YOFREE-KINETIC"],
    services: [
      { id: "motion-graphics", relation: "direct", description: "실제 키네틱 모션 편집" },
      { id: "animation", relation: "usage", description: "캐릭터와 포즈가 쓰인 관련 모션 사례" },
    ],
    assets: [{ kind: "video", src: "/service-detail-v14/yofree-kinetic.mp4", poster: "/service-detail-v14/poster-yofree-kinetic.webp", alt: "요프리 캐릭터 모션 활용 시안" }],
    order: 30,
  });
}

// An operator can enter a useful result before a brief/process archive exists.
function minimalResult() {
  return {
    caseId: "CASE-BRAND-STORY-TWO",
    slug: "brand-story-two",
    revision: 1,
    title: "두 번째 브랜드 웹툰",
    brand: "테스트 브랜드",
    summary: "제품의 사용 상황을 이야기로 설명한 웹툰입니다.",
    scope: "브랜드 이야기 구성 · 웹툰 작화",
    publicLabel: "브랜드 웹툰 제작 시안",
    productionStatus: "draft",
    publication: "ready",
    services: [{ id: "webtoon", relation: "direct", description: "새로 쌓이는 브랜드 웹툰 사례" }],
    assets: [{ kind: "image", src: "/service-detail-v14/brand-story-two.webp", alt: "제품 사용 상황의 웹툰 첫 장면" }],
  };
}

// Execute the actual server module with only its I/O imports replaced. The
// publication/rights logic below is the production implementation, not a test copy.
function caseServer({ seed = [], rows = [], ready = true, error = null } = {}) {
  const source = readFileSync(new URL("../lib/service-cases.server.ts", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const calls = [];
  const query = {
    select(...args) { calls.push(["select", ...args]); return this; },
    eq(...args) { calls.push(["eq", ...args]); return this; },
    like(...args) { calls.push(["like", ...args]); return this; },
    order(...args) { calls.push(["order", ...args]); return this; },
    async range(from, to) { calls.push(["range", from, to]); return { data: rows.slice(from, to + 1), error }; },
  };
  const database = () => ({ from(name) { calls.push(["from", name]); return query; } });
  const imports = {
    "server-only": {},
    "@/content/service-cases-v14.json": structuredClone(seed),
    "./db": { database, databaseReady: () => ready },
    "./service-case-schema": { CASE_BODY_PREFIX, casesForService, mergeServiceCases, parseServiceCaseBody, serviceCaseSchema },
  };
  const module = { exports: {} };
  const require = (name) => {
    assert.ok(Object.hasOwn(imports, name), `server test refuses an unreviewed dependency: ${name}`);
    return imports[name];
  };
  new Function("require", "exports", "module", compiled)(require, module.exports, module);
  return { ...module.exports, calls };
}

test("result-only registration is usable without inventing a brief or production process", () => {
  const stored = serviceCaseSchema.parse(minimalResult());
  assert.equal(stored.assets.length, 1);
  assert.equal(stored.title, "두 번째 브랜드 웹툰");
  assert.equal(stored.scope, "브랜드 이야기 구성 · 웹툰 작화");
  assert.equal(stored.brief, "");
  assert.deepEqual(stored.decisions, []);
  assert.deepEqual(stored.stages, []);
  assert.deepEqual(stored.sourceWorkIds, []);
  assert.deepEqual(stored.featuredFor, []);
  assert.equal(casesForService([stored], "webtoon").length, 1);
});

test("adding a result extends only its connected service and preserves existing representatives and inputs", () => {
  const seed = [representative(), proposal()];
  const before = structuredClone(seed);
  const addition = minimalResult();
  const originalAddition = structuredClone(addition);
  const result = mergeServiceCases(seed, [addition]);

  assert.deepEqual(seed, before, "registering a case must not edit the seeded representatives");
  assert.deepEqual(addition, originalAddition, "normalization must not change the submitted draft object");
  assert.equal(result.length, 3);
  assert.deepEqual(result.find((item) => item.caseId === seed[0].caseId), before[0]);
  assert.deepEqual(result.filter((item) => item.featuredFor.includes("webtoon")).map((item) => item.caseId), [seed[0].caseId]);
  assert.deepEqual(casesForService(result, "webtoon").map((item) => item.caseId), [seed[0].caseId, addition.caseId]);
  assert.deepEqual(casesForService(result, "animation").map((item) => item.caseId), [seed[1].caseId]);
  assert.deepEqual(casesForService(result, "motion-graphics").map((item) => item.caseId), [seed[1].caseId]);
  for (const service of ["ai-influencer", "brand-film", "ad"])
    assert.deepEqual(casesForService(result, service), [], `new webtoon must not appear in ${service}`);
});

test("one cross-service proposal retains its real usage relation and proposal label in both services", () => {
  const record = proposal();
  for (const service of ["motion-graphics", "animation"]) {
    const [visible] = casesForService(mergeServiceCases([], [record]), service);
    assert.equal(visible.caseId, record.caseId);
    assert.equal(visible.publicLabel, record.publicLabel);
    assert.equal(visible.productionStatus, "draft");
    assert.equal(visible.publication, "ready");
  }
  assert.equal(casesForService([record], "animation")[0].services.find((item) => item.id === "animation").relation, "usage");
});

test("later process evidence enriches the same canonical case without creating a second work or changing the representative", () => {
  const original = representative();
  const originalSnapshot = structuredClone(original);
  const enriched = {
    ...structuredClone(original),
    revision: original.revision + 1,
    brief: "구단의 성장과 인물의 변화를 한 이야기로 구성했습니다.",
    decisions: [{ title: "행동으로 보여주기", description: "축구에 집중하는 변화를 자세와 반응으로 설명했습니다." }],
    stages: [{ title: "원고 장면 3 → 완성 05", description: "휴대전화를 내려놓고 경기에 몰입하는 같은 장면입니다.", asset: "/service-detail-v14/webtoon-05.webp" }],
  };
  const merged = mergeServiceCases([original], [enriched]);
  assert.equal(merged.length, 1);
  assert.equal(casesForService(merged, "webtoon").length, 1);
  assert.equal(merged[0].caseId, original.caseId);
  assert.equal(merged[0].slug, original.slug);
  assert.equal(merged[0].revision, 3);
  assert.deepEqual(merged[0].sourceWorkIds, original.sourceWorkIds);
  assert.deepEqual(merged[0].featuredFor, ["webtoon"]);
  assert.deepEqual(merged[0].assets, original.assets);
  assert.equal(merged[0].stages[0].asset, "/service-detail-v14/webtoon-05.webp");
  assert.deepEqual(original, originalSnapshot);
});

test("six new character motions enrich one proposal while preserving its previous results and representative", () => {
  const original = proposal();
  original.featuredFor = ["animation"];
  const snapshot = structuredClone(original);
  const motions = Array.from({ length: 6 }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return { kind: "video", src: `/service-detail-v15/yofree-pose-${number}.mp4`, poster: `/service-detail-v15/yofree-character-${number}.webp`, alt: `캐릭터 ${number} 동작 제작 시안`, width: 960, height: 960 };
  });
  const revision = serviceCaseSchema.parse({
    ...structuredClone(original),
    revision: 2,
    services: original.services.map((service) => service.id === "animation" ? { ...service, relation: "direct", description: "같은 캐릭터의 6종 짧은 동작 제작 시안" } : service),
    assets: [...original.assets, ...motions],
  });
  const records = mergeServiceCases([original], [revision]);
  assert.equal(records.length, 1, "additional motion assets must not create six new cases");
  assert.deepEqual(records[0].assets.slice(0, original.assets.length), snapshot.assets);
  assert.deepEqual(records[0].assets.slice(original.assets.length), motions);
  assert.deepEqual(records[0].sourceWorkIds, snapshot.sourceWorkIds);
  assert.equal(records[0].services.find((service) => service.id === "animation").relation, "direct");
  assert.deepEqual(records[0].featuredFor, ["animation"]);
  assert.equal(records[0].productionStatus, "draft");
  assert.equal(records[0].publicLabel, snapshot.publicLabel);
  const selected = serviceCasePresentation([revision], casesForService(records, "animation"), "animation", original.caseId);
  assert.equal(selected.useAuthoredJourney, true, "a revised canonical seed remains the baseline for its authored journey");
  assert.deepEqual(original, snapshot);
});

test("completed files still stay off service pages until their case publication is ready", () => {
  const record = representative();
  for (const publication of ["draft", "review"]) {
    const hidden = { ...record, publication };
    assert.equal(serviceCaseSchema.safeParse(hidden).success, true);
    assert.deepEqual(casesForService([hidden], "webtoon"), []);
  }
  for (const publication of ["ready", "published"])
    assert.equal(casesForService([{ ...record, publication }], "webtoon").length, 1);
});

test("a publicly viewable draft must keep an honest proposal label", () => {
  const record = proposal();
  for (const publication of ["ready", "published"]) {
    const honest = { ...record, publication };
    assert.equal(serviceCaseSchema.safeParse(honest).success, true);
    assert.equal(casesForService([honest], "animation")[0].publicLabel, record.publicLabel);
    assert.equal(serviceCaseSchema.safeParse({ ...honest, publicLabel: "고객 납품 완료" }).success, false);
  }
});

test("one submission cannot register the same case ID twice even with different URLs", () => {
  const first = minimalResult();
  const duplicate = { ...structuredClone(first), slug: "another-url-for-the-same-case", revision: 2 };
  assert.throws(() => mergeServiceCases([], [first, duplicate]), /중복/);
});

test("distinct case IDs cannot take the same existing case URL", () => {
  const existing = representative();
  const collision = { ...minimalResult(), slug: existing.slug };
  assert.throws(() => mergeServiceCases([existing], [collision]), /주소.*중복|중복.*주소/);
  assert.equal(existing.slug, "clubowner-episode-one");
});

test("new additions cannot share a URL with one another", () => {
  const first = minimalResult();
  const second = { ...proposal(), slug: first.slug };
  assert.throws(() => mergeServiceCases([], [first, second]), /중복/);
});

test("one existing work ID is recorded once per case", () => {
  const record = representative();
  record.sourceWorkIds.push(record.sourceWorkIds[0]);
  assert.equal(serviceCaseSchema.safeParse(record).success, false);
  assert.throws(() => mergeServiceCases([], [record]));
});

test("one service cannot be attached twice under different relation labels", () => {
  const record = proposal();
  record.services.push({ id: "animation", relation: "related", description: "중복 연결로 사례 수를 늘릴 수 없습니다." });
  assert.equal(serviceCaseSchema.safeParse(record).success, false);
  assert.throws(() => mergeServiceCases([], [record]));
});

test("an older editor revision cannot overwrite the newer case or its process evidence", () => {
  const current = representative();
  current.stages = [{ title: "검수", description: "현재 버전의 실제 검토 기록입니다." }];
  const before = structuredClone(current);
  const stale = { ...structuredClone(current), revision: current.revision - 1, stages: [] };
  assert.throws(() => mergeServiceCases([current], [stale]), /오래된.*버전/);
  assert.deepEqual(current, before);
});

test("video registration needs a real poster path rather than an empty player", () => {
  const record = proposal();
  delete record.assets[0].poster;
  const result = serviceCaseSchema.safeParse(record);
  assert.equal(result.success, false);
  assert.ok(result.error.issues.some((issue) => issue.path.join(".") === "assets.0.poster"));
  assert.throws(() => encodeServiceCaseBody(record));
});

test("asset URLs cannot point outside the site or escape the declared asset tree", () => {
  for (const src of [
    "https://example.test/clip.mp4",
    "//example.test/clip.mp4",
    "javascript:alert(1)",
    "C:\\work\\clip.mp4",
    "/service-detail-v14/../private.mp4",
    "/service-detail-v14/%2e%2e/private.mp4",
    "/service-detail-v14/clip.mp4?token=secret",
  ]) {
    const record = proposal();
    record.assets[0].src = src;
    assert.equal(serviceCaseSchema.safeParse(record).success, false, src);
    assert.throws(() => encodeServiceCaseBody(record), undefined, src);
  }
  const record = proposal();
  record.assets[0].poster = "https://example.test/poster.webp";
  assert.equal(serviceCaseSchema.safeParse(record).success, false);
});

test("admin media validation admits the two approved service trees without admitting other revisions or path escapes", () => {
  for (const path of ["/service-detail-v14/webtoon-05.webp", "/service-detail-v15/yofree-character-01.webp", "/service-detail-v15/maxtech/poster.webp"]) {
    assert.equal(isSafeImageUrl(path), true, path);
    assert.equal(isSafeMediaUrl(path), true, path);
  }
  for (const path of ["/service-detail-v14/clubowner-highlight.mp4", "/service-detail-v15/yofree-pose-01.mp4", "/service-detail-v15/maxtech/hero-promo.mp4"]) {
    assert.equal(isSafeImageUrl(path), false, path);
    assert.equal(isSafeMediaUrl(path), true, path);
  }
  for (const path of [
    "/service-detail-v13/example.webp", "/service-detail-v16/example.mp4", "/service-detail-v150/example.webp",
    "/service-detail-v15/../private.webp", "/service-detail-v15/%2e%2e/private.webp", "/service-detail-v15/maxtech/../private.mp4",
    "/service-detail-v15/maxtech/poster.webp?token=secret", "/service-detail-v15/maxtech/poster.webp#fragment",
    "//example.test/service-detail-v15/poster.webp", "https://example.test/service-detail-v15/clip.mp4", "C:\\service-detail-v15\\clip.mp4",
  ]) {
    assert.equal(isSafeImageUrl(path), false, path);
    assert.equal(isSafeMediaUrl(path), false, path);
  }
});

test("saved admin body restores the complete case, proposal status and service relations", async () => {
  const directory = await mkdtemp(join(tmpdir(), "aio-service-case-test-"));
  const file = join(directory, "admin-case-body.txt");
  const record = proposal();
  record.brief = "같은 캐릭터의 인사·설명·엔딩을 연결했습니다.";
  record.decisions = [{ title: "포즈 재사용", description: "원본 포즈와 실제 장면을 연결했습니다." }];
  record.stages = [{ title: "실제 출력", description: "관련 모션 활용 시안", asset: record.assets[0].src }];
  const expected = serviceCaseSchema.parse(record);
  try {
    const body = encodeServiceCaseBody(record);
    assert.ok(body.startsWith(CASE_BODY_PREFIX));
    await writeFile(file, body, "utf8");
    const restored = parseServiceCaseBody(await readFile(file, "utf8"));
    assert.deepEqual(restored, expected);
    assert.equal(encodeServiceCaseBody(restored), body);
    assert.equal(casesForService([restored], "animation")[0].publicLabel, expected.publicLabel);
  } finally {
    await unlink(file).catch((error) => { if (error.code !== "ENOENT") throw error; });
    await rmdir(directory);
  }
});

test("ordinary work bodies, malformed JSON and invalid case bodies never become public cases", () => {
  assert.equal(parseServiceCaseBody("일반 작품 소개 본문입니다."), null);
  assert.equal(parseServiceCaseBody(`${CASE_BODY_PREFIX}{not-json`), null);
  assert.equal(parseServiceCaseBody(`${CASE_BODY_PREFIX}${JSON.stringify({ caseId: "CASE-INCOMPLETE" })}`), null);
  const unsafe = proposal();
  unsafe.assets[0].src = "https://example.test/not-a-site-asset.mp4";
  assert.equal(parseServiceCaseBody(`${CASE_BODY_PREFIX}${JSON.stringify(unsafe)}`), null);
});

test("a newly added unfeatured case keeps the established representative and authored journey", () => {
  const original = representative();
  const addition = { ...minimalResult(), order: 0 };
  const records = casesForService(mergeServiceCases([original], [addition]), "webtoon");
  const selected = serviceCasePresentation([original], records, "webtoon", original.caseId);
  assert.equal(records.length, 2);
  assert.equal(selected.primary.caseId, original.caseId);
  assert.equal(selected.useAuthoredJourney, true);
  assert.deepEqual(records.find((record) => record.caseId === addition.caseId).featuredFor, []);
});

test("editing an existing case uses its new evidence instead of the old fixed journey", () => {
  const original = representative();
  const revision = {
    ...structuredClone(original),
    revision: original.revision + 1,
    summary: "수정된 실제 제작 범위와 결과를 설명합니다.",
    stages: [{ title: "보강된 검토 기록", description: "관리자에 추가한 현재 사례의 과정입니다." }],
  };
  const records = casesForService(mergeServiceCases([original], [revision]), "webtoon");
  const selected = serviceCasePresentation([original], records, "webtoon", original.caseId);
  assert.equal(selected.primary.caseId, original.caseId);
  assert.equal(selected.primary.summary, revision.summary);
  assert.equal(selected.primary.stages[0].title, "보강된 검토 기록");
  assert.equal(selected.useAuthoredJourney, false, "the previous static content must not conceal an admin revision");
});

test("making the representative private also suppresses the previous fixed journey", () => {
  const original = representative();
  const privateRevision = { ...structuredClone(original), revision: original.revision + 1, publication: "draft" };
  const records = casesForService(mergeServiceCases([original], [privateRevision]), "webtoon");
  const selected = serviceCasePresentation([original], records, "webtoon", original.caseId);
  assert.deepEqual(records, []);
  assert.equal(selected.primary, null);
  assert.equal(selected.useAuthoredJourney, false, "a hidden case must not reappear through the static fallback");
});

test("only explicit representative selection replaces the service lead case", () => {
  const original = representative();
  const addition = { ...minimalResult(), order: 9999 };
  const unchanged = serviceCasePresentation(
    [original], casesForService(mergeServiceCases([original], [addition]), "webtoon"), "webtoon", original.caseId,
  );
  assert.equal(unchanged.primary.caseId, original.caseId);
  const promoted = { ...addition, revision: 2, featuredFor: ["webtoon"] };
  const selected = serviceCasePresentation(
    [original], casesForService(mergeServiceCases([original], [promoted]), "webtoon"), "webtoon", original.caseId,
  );
  assert.equal(selected.primary.caseId, addition.caseId, "an explicit new selection wins even with a later list order");
  assert.equal(selected.useAuthoredJourney, false);
  assert.equal(original.featuredFor[0], "webtoon", "the seeded original remains intact");
});

test("the real all-service reader returns only approved seed cases when no database is configured", async () => {
  const draft = { ...minimalResult(), publication: "review" };
  const server = caseServer({ seed: [representative(), proposal(), draft], ready: false });
  assert.deepEqual((await server.allServiceCases()).map((record) => record.caseId), [representative().caseId, proposal().caseId]);
  assert.deepEqual((await server.serviceCases("animation")).map((record) => record.caseId), [proposal().caseId]);
  assert.deepEqual(server.calls, [], "the no-database path must perform no query");
});

test("the real server requires both publication and rights approval regardless of the body state", async () => {
  for (const is_published of [false, true]) for (const rights_confirmed of [false, true]) {
    const record = proposal();
    record.publication = "published";
    const server = caseServer({ rows: [{ id: "row-one", body: encodeServiceCaseBody(record), is_published, rights_confirmed }] });
    const visible = await server.allServiceCases();
    assert.equal(visible.length, Number(is_published && rights_confirmed), `${is_published}/${rights_confirmed}`);
    if (visible.length) {
      assert.equal(visible[0].publicLabel, record.publicLabel);
      assert.equal(visible[0].productionStatus, "draft");
    }
    assert.ok(server.calls.some((call) => call[0] === "eq" && call[1] === "type" && call[2] === "reference"));
    assert.ok(server.calls.some((call) => call[0] === "eq" && call[1] === "division" && call[2] === "video"));
  }
});

test("a private editor revision suppresses the public seed rather than falling back to old case details", async () => {
  const seed = representative();
  const privateRevision = { ...structuredClone(seed), revision: seed.revision + 1, summary: "비공개로 바꾼 현재 사례" };
  const server = caseServer({ seed: [seed], rows: [{ id: "private-override", body: encodeServiceCaseBody(privateRevision), is_published: false, rights_confirmed: true }] });
  assert.deepEqual(await server.allServiceCases(), []);
  assert.deepEqual(await server.serviceCases("webtoon"), []);
});

test("database errors and conflicting stored case IDs fail closed without re-exposing seeded content", async () => {
  const queryError = caseServer({ seed: [representative()], error: { message: "fixture query error" } });
  assert.deepEqual(await queryError.allServiceCases(), []);
  const record = proposal();
  const body = encodeServiceCaseBody(record);
  const conflict = caseServer({ seed: [representative()], rows: [
    { id: "first", body, is_published: true, rights_confirmed: true },
    { id: "second", body, is_published: true, rights_confirmed: true },
  ] });
  assert.deepEqual(await conflict.allServiceCases(), []);
});

test("ordinary editor entries and malformed case bodies never become library cards", async () => {
  const valid = proposal();
  const server = caseServer({ rows: [
    { id: "ordinary", body: "관리자의 일반 작품 본문", is_published: true, rights_confirmed: true },
    { id: "broken", body: `${CASE_BODY_PREFIX}{broken`, is_published: true, rights_confirmed: true },
    { id: "valid", body: encodeServiceCaseBody(valid), is_published: true, rights_confirmed: true },
  ] });
  assert.deepEqual((await server.allServiceCases()).map((record) => record.caseId), [valid.caseId]);
});

test("the all-service library reads a second database page and keeps cases beyond the former small-card cap", async () => {
  const rows = Array.from({ length: 101 }, (_, index) => {
    const suffix = String(index).padStart(3, "0");
    const record = { ...minimalResult(), caseId: `CASE-PAGE-${suffix}`, slug: `page-${suffix}` };
    return { id: `row-${suffix}`, body: encodeServiceCaseBody(record), is_published: true, rights_confirmed: true };
  });
  const server = caseServer({ rows });
  const records = await server.allServiceCases();
  assert.equal(records.length, 101);
  assert.equal(new Set(records.map((record) => record.caseId)).size, 101);
  assert.ok(records.some((record) => record.caseId === "CASE-PAGE-100"));
  assert.deepEqual(server.calls.filter((call) => call[0] === "range"), [["range", 0, 99], ["range", 100, 199]]);
});
