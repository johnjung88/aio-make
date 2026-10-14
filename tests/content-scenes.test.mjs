import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import sharp from "sharp";

// Real derivatives must remain attributable to intact source videos
test("R3 selected-work scene derivatives preserve source integrity and decode at declared size", async (t) => {
  const manifest = JSON.parse(readFileSync("docs/renewal-2026-10-13/SCENE_ASSETS_R3.json", "utf8"));
  assert.equal(manifest.assets.length, 9);
  const available = manifest.assets.filter(asset => existsSync(asset.output));
  if (!available.length && process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW !== "1")
    return t.skip("Local review derivatives excluded from public checkout");
  assert.equal(available.length, 9, "review artifacts cannot be partially missing");
  const sources = new Map();
  for (const asset of manifest.assets) {
    assert.ok(asset.output.startsWith(`public/reference-review/r3-scenes/${asset.slug}/`));
    assert.ok(Number.isFinite(asset.seconds) && asset.seconds >= 0);
    if (!sources.has(asset.source)) sources.set(asset.source, createHash("sha256").update(readFileSync(asset.source)).digest("hex"));
    assert.equal(sources.get(asset.source), asset.sourceSHA256, asset.source);
    assert.equal(createHash("sha256").update(readFileSync(asset.output)).digest("hex"), asset.outputSHA256, asset.output);
    const decoded = await sharp(asset.output).raw().toBuffer({ resolveWithObject: true });
    assert.equal(decoded.info.width, asset.width, asset.output);
    assert.equal(decoded.info.height, asset.height, asset.output);
  }
  assert.equal(sources.size, 3);
});
