import test from "node:test";
import assert from "node:assert/strict";
import {
  stat,
  readFile,
  readdir,
  mkdtemp,
  writeFile,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  publicWorkCatalog,
  reviewWorks,
  publicWorks,
  workMatchesService,
} from "../lib/work-catalog.ts";
import { workSchema } from "../lib/work-schema.ts";
import { guideEntries } from "../lib/guide-content.ts";
import { divisionServices } from "../lib/content.ts";
import { legacyDestination } from "../lib/redirects.ts";

const directory = new URL("../content/works/", import.meta.url);
const files = (await readdir(directory))
  .filter((name) => name.endsWith(".json"))
  .sort();
const records = await Promise.all(
  files.map(async (name) =>
    JSON.parse(await readFile(new URL(name, directory), "utf8")),
  ),
);
const catalogWorks = [...reviewWorks, ...publicWorks];

test("retired content entry URLs stay out of catalogs while other division entries and registered cases remain", () => {
  const entries = guideEntries("reference");
  assert.ok(entries.some((entry) => entry.division === "video"));
  const catalog = publicWorkCatalog(entries);
  assert.ok(
    !catalog.some((work) => work.canonicalPath.startsWith("/content/work")),
  );
  for (const division of ["marketing", "development"]) {
    const retained = entries.filter(
      (entry) =>
        entry.division === division &&
        entry.is_published &&
        entry.rights_confirmed,
    );
    assert.ok(retained.length > 0);
    for (const entry of retained)
      assert.ok(catalog.some((work) => work.id === entry.id));
  }
  assert.ok(
    catalogWorks.every((work) => work.canonicalPath === `/work/${work.slug}`),
  );
  for (const path of [
    "/work",
    "/content/work",
    "/content/work/example-webtoon",
    "/portfolio",
  ])
    assert.equal(legacyDestination(path), null, path);
});

test("unapproved customer references never enter the public catalog or sitemap source", async () => {
  const catalog = publicWorkCatalog(guideEntries("reference"));
  assert.ok(catalog.length > 0);
  const pending = records.filter(
    (work) => work.visibility === "review" || !work.rightsConfirmed,
  );
  for (const work of pending) {
    assert.ok(!catalog.some((item) => item.id === work.id), work.slug);
    assert.ok(
      !publicWorkCatalog([]).some((item) => item.slug === work.slug),
      work.slug,
    );
  }
  assert.ok(reviewWorks.every((work) => work.visibility === "review"));
  const sitemap = await readFile(
    new URL("../app/sitemap.ts", import.meta.url),
    "utf8",
  );
  assert.match(sitemap, /publicWorkCatalog\(\[\]\)/);
  assert.doesNotMatch(sitemap, /displayWorkCatalog|reviewWorks/);
});

test("every JSON becomes one catalog work with unchanged descriptive media and ordered webtoon pages", () => {
  const works = [...reviewWorks, ...publicWorks];
  assert.equal(works.length, files.length);
  assert.equal(
    new Set(works.map((work) => work.canonicalPath)).size,
    files.length,
  );
  for (const record of records) {
    assert.equal(workSchema.safeParse(record).success, true, record.slug);
    const work = works.find((item) => item.slug === record.slug);
    const expectedMedia = structuredClone(record.media);
    for (const media of expectedMedia) delete media.source;
    assert.deepEqual(work.media, expectedMedia);
    assert.notEqual(work.purpose, work.scope, work.slug);
    let page = 0;
    for (const media of work.media) {
      assert.ok(media.src.startsWith("/reference-review/"));
      assert.ok(media.alt.length > 5);
      if (media.kind === "video") assert.ok(media.poster?.endsWith(".webp"));
      if (media.kind === "webtoon") {
        page++;
        assert.ok(
          media.src.endsWith(`/gallery-${String(page).padStart(2, "0")}.webp`),
        );
      }
    }
  }
});

test("related content is not represented as a marketing operations result", () => {
  const work = catalogWorks.find((item) => item.slug === "bwl-aqua-ad");
  assert.equal(workMatchesService(work, "ai-influencer", "video"), true);
  assert.equal(workMatchesService(work, "ai-influencer", "marketing"), false);
});

test("the six content services match the four motion graphics works", () => {
  assert.deepEqual(
    divisionServices("video").map((service) => service.id),
    [
      "webtoon",
      "animation",
      "ai-influencer",
      "motion-graphics",
      "brand-film",
      "ad",
    ],
  );
  const matched = catalogWorks.filter((work) =>
    workMatchesService(work, "motion-graphics", "video"),
  );
  assert.deepEqual(
    matched.map((work) => work.slug).sort(),
    [
      "bwl-brand-motion",
      "healernet-motion",
      "yofree-mg-short",
      "yofree-mg30",
    ].sort(),
  );
  for (const slug of ["bwl-brand-motion", "healernet-motion"])
    assert.equal(
      workMatchesService(
        matched.find((work) => work.slug === slug),
        "brand-film",
        "video",
      ),
      true,
    );
  for (const slug of ["yofree-mg-short", "yofree-mg30"])
    assert.equal(
      workMatchesService(
        matched.find((work) => work.slug === slug),
        "ad",
        "video",
      ),
      true,
    );
  for (const slug of ["yofree-outing-motion", "yofree-night-motion"]) {
    const work = catalogWorks.find((item) => item.slug === slug);
    assert.equal(work.primaryService, "animation");
    assert.equal(workMatchesService(work, "webtoon", "video"), true);
  }
});

test("schema enforces service pairs, scope, poster, webtoon order and publication rights", () => {
  const original = records.find((work) => work.slug === "bwl-brand-motion");
  for (const override of [
    { primaryService: "unknown-service" },
    { relatedServices: [{ division: "marketing", id: "motion-graphics" }] },
    { scope: original.purpose },
    { media: [{ ...original.media[0], poster: undefined }] },
    { visibility: "public", rightsConfirmed: false },
    {
      visibility: "public",
      rightsConfirmed: true,
      productionStatus: "제작 후보",
    },
  ])
    assert.equal(
      workSchema.safeParse({ ...original, ...override }).success,
      false,
    );
  assert.equal(
    workSchema.safeParse({
      ...original,
      visibility: "public",
      rightsConfirmed: true,
    }).success,
    true,
  );
  const webtoon = records.find((work) => work.primaryService === "webtoon");
  assert.equal(
    workSchema.safeParse({ ...webtoon, media: [...webtoon.media].reverse() })
      .success,
    false,
  );
});

test("works build rejects an invalid temporary JSON with filename and field and leaves output untouched", async () => {
  const dir = await mkdtemp(join(tmpdir(), "aio-invalid-work-"));
  try {
    const invalid = {
      ...records[0],
      slug: "invalid-work",
      primaryService: "unknown-service",
    };
    await writeFile(join(dir, "invalid-work.json"), JSON.stringify(invalid));
    const output = join(dir, "generated.ts");
    await writeFile(output, "preserved output");
    const result = spawnSync(
      process.execPath,
      [
        "--experimental-strip-types",
        fileURLToPath(new URL("../scripts/build-works.mjs", import.meta.url)),
        "--input-dir",
        dir,
        "--output",
        output,
      ],
      { encoding: "utf8", windowsHide: true },
    );
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stderr, /invalid-work\.json: primaryService:/);
    assert.equal(await readFile(output, "utf8"), "preserved output");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("works build is deterministic and display visibility requires the exact local review flag", async () => {
  const dir = await mkdtemp(join(tmpdir(), "aio-work-build-"));
  try {
    const output = join(dir, "generated.ts");
    const script = fileURLToPath(
      new URL("../scripts/build-works.mjs", import.meta.url),
    );
    for (let index = 0; index < 2; index++) {
      const result = spawnSync(
        process.execPath,
        ["--experimental-strip-types", script, "--output", output],
        { encoding: "utf8", windowsHide: true },
      );
      assert.equal(result.status, 0, result.stderr);
      assert.equal(
        (await readFile(output, "utf8")).replaceAll("\r\n", "\n"),
        (await readFile(
          new URL("../lib/generated/works.generated.ts", import.meta.url),
          "utf8",
        )).replaceAll("\r\n", "\n"),
      );
    }
    const catalogUrl = new URL("../lib/work-catalog.ts", import.meta.url).href;
    const code = `const {displayWorkCatalog, publicWorkCatalog} = await import(${JSON.stringify(catalogUrl)}); console.log(JSON.stringify({display:displayWorkCatalog([]).length, public:publicWorkCatalog([]).length}));`;
    for (const flag of ["0", "1", "true"]) {
      const result = spawnSync(
        process.execPath,
        ["--experimental-strip-types", "--input-type=module", "-e", code],
        {
          env: { ...process.env, NEXT_PUBLIC_AIO_REFERENCE_REVIEW: flag },
          encoding: "utf8",
          windowsHide: true,
        },
      );
      assert.equal(result.status, 0, result.stderr);
      assert.deepEqual(JSON.parse(result.stdout), {
        display: publicWorks.length + (flag === "1" ? reviewWorks.length : 0),
        public: publicWorks.length,
      });
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("registered work enters the public catalog only with both publication values", () => {
  const generatedUrl = new URL(
    "../lib/generated/works.generated.ts",
    import.meta.url,
  ).href;
  const catalogUrl = new URL("../lib/work-catalog.ts", import.meta.url).href;
  for (const [visibility, rightsConfirmed, expected] of [
    ["review", true, false],
    ["public", false, false],
    ["public", true, true],
  ]) {
    const code = `const {generatedWorks} = await import(${JSON.stringify(generatedUrl)}); const work = generatedWorks.find(w=>w.slug==='bwl-brand-motion'); work.visibility=${JSON.stringify(visibility)}; work.rightsConfirmed=${rightsConfirmed}; const {publicWorkCatalog,publicWorks}=await import(${JSON.stringify(catalogUrl)}); console.log(JSON.stringify({catalog:publicWorkCatalog([]).some(w=>w.slug===work.slug),registered:publicWorks.some(w=>w.slug===work.slug)}));`;
    const result = spawnSync(
      process.execPath,
      ["--experimental-strip-types", "--input-type=module", "-e", code],
      { encoding: "utf8", windowsHide: true },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(result.stdout), {
      catalog: expected,
      registered: expected,
    });
  }
});

test("public browser data excludes pending customer references with the review flag off", () => {
  const generatedUrl = new URL(
    "../lib/generated/works.generated.ts",
    import.meta.url,
  ).href;
  for (const flag of ["0", "1", "true"]) {
    const code = `globalThis.window = {}; const {generatedWorks} = await import(${JSON.stringify(generatedUrl)}); console.log(JSON.stringify(generatedWorks.map(work => work.slug)));`;
    const result = spawnSync(
      process.execPath,
      ["--experimental-strip-types", "--input-type=module", "-e", code],
      {
        env: { ...process.env, NEXT_PUBLIC_AIO_REFERENCE_REVIEW: flag },
        encoding: "utf8",
        windowsHide: true,
      },
    );
    assert.equal(result.status, 0, result.stderr);
    const expected = records.filter(
      (work) =>
        flag === "1" || (work.visibility === "public" && work.rightsConfirmed),
    );
    assert.deepEqual(
      JSON.parse(result.stdout),
      expected.map((work) => work.slug),
    );
  }
});

test("prepared derivatives exist when local review is requested", async (t) => {
  if (process.env.AIO_VERIFY_LOCAL_MEDIA !== "1")
    return t.skip("Local media excluded from release checkout");
  for (const media of catalogWorks.flatMap((work) => work.media)) {
    for (const path of [media.src, media.poster, media.mobileSrc].filter(
      Boolean,
    )) {
      assert.ok(
        (await stat(new URL("../public" + path, import.meta.url))).size > 0,
        path,
      );
    }
  }
});
