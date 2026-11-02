import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { buildPublicMediaIndex } from "../scripts/build-public-media-index.mjs";
import { assertServiceCaseMedia } from "../lib/service-case-media.ts";

test("build index records actual public media without including private folders or binary contents", async () => {
  const root = await mkdtemp(join(tmpdir(), "aio-media-index-"));
  try {
    const fixtures = ["service-detail-v15/nested/clip.mp4", "service-detail-v15/poster.webp", "images/cover.png", "service-detail-v15/private.txt", "reference-review/private.webp"];
    for (const path of fixtures) {
      await mkdir(join(root, "public", path, ".."), { recursive: true });
      await writeFile(join(root, "public", path), "binary fixture contents");
    }
    const paths = await buildPublicMediaIndex(root);
    assert.deepEqual(paths, ["/images/cover.png", "/service-detail-v15/nested/clip.mp4", "/service-detail-v15/poster.webp"]);
    const index = await readFile(join(root, "lib/generated/public-media-files.generated.json"), "utf8");
    assert.deepEqual(JSON.parse(index), paths);
    assert.ok(!index.includes("binary fixture contents") && !index.includes(root));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("case file check covers results, posters, process evidence and local cover fields without filesystem access", () => {
  const record = { assets: [{ src: "/service-detail-v15/clip.mp4", poster: "/service-detail-v15/poster.webp" }], stages: [{ asset: "/images/process.png" }] };
  const paths = ["/service-detail-v15/clip.mp4", "/service-detail-v15/poster.webp", "/images/process.png", "/images/cover.png"];
  const before = structuredClone(record);
  assert.doesNotThrow(() => assertServiceCaseMedia(record, ["/images/cover.png", "https://example.test/cover.png"], paths));
  for (const missing of paths) assert.throws(() => assertServiceCaseMedia(record, ["/images/cover.png"], paths.filter(path => path !== missing)), /public/);
  assert.deepEqual(record, before);
});
