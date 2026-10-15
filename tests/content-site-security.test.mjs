import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { assertPrivateReportDirectory } from "../scripts/prepare-reference-media.mjs";
import { creatorRoster } from "../lib/content-site/creator-roster.ts";
import { getExampleMedia } from "../lib/content-site/example-media.ts";

const privateMetadata = /요프리|yofree|힐러넷|healernet|\bBWL\b|DR(?:'|&#x27;|&#39;|&apos;)s Secret|닥터시크릿|맥스테크|maxtech|\b[A-Z]:[\\/]|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:\+82[- .]?)?0[1-9][0-9]?[- .]?[0-9]{3,4}[- .]?[0-9]{4}/i;

test("R8 W4: example catalog is server-only and creator deck receives selected cards", () => {
  const read = (file) => readFileSync(file, "utf8");
  assert.match(read("lib/content-site/example-media.ts"), /import "server-only"/);
  const deck = read("components/content-site/services/ai-influencer/creator-experience.tsx");
  assert.doesNotMatch(deck, /example-media|r8-media|EXAMPLE_MEDIA/);
  assert.match(deck, /cards\[index\]/);
  assert.match(read("components/content-site/services/ai-influencer/landing.tsx"), /<CreatorDeck cards=\{creatorCards\}/);
  // Every current creator still has the same selected image; the server passes four cards, not the catalog.
  for (const creator of creatorRoster) {
    const slot = getExampleMedia("ai-influencer", "card").find((item) => item.id === creator.cardSlot);
    assert.equal(slot?.src, creator.portrait);
  }
});

test("R8 W4: public metadata contains no customer, local source or contact information", () => {
  assert.ok(existsSync("content/media-manifest.json"), "private evidence retained");
  assert.equal(existsSync("public/content-examples/MANIFEST.json"), false, "old public evidence URL removed");
  const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = join(directory, entry.name);
    // Local review originals are explicitly outside this public metadata audit.
    if (file === join("public", "reference-review")) return [];
    return entry.isDirectory() ? walk(file) : /\.(json|txt|md|html|vtt)$/i.test(entry.name) ? [file] : [];
  });
  const files = walk("public");
  assert.ok(files.length > 0);
  for (const file of files) assert.doesNotMatch(readFileSync(file, "utf8"), privateMetadata, file);
});

test("R8 W4: preparation rejects provenance reports in public, including junction aliases", async () => {
  const root = mkdtempSync(join(tmpdir(), "aio-r8-w4-"));
  const publicDirectory = join(root, "public");
  mkdirSync(publicDirectory);
  const options = { publicDirectory };
  try {
    const privateReport = join(root, "content", "reports");
    assert.equal(await assertPrivateReportDirectory(privateReport, options), resolve(privateReport));
    assert.equal(await assertPrivateReportDirectory(join(root, "public-backup"), options), join(root, "public-backup"));
    for (const directory of [publicDirectory, join(publicDirectory, "reports", "nested"), join(root, "content", "..", "public", "report")]) {
      await assert.rejects(assertPrivateReportDirectory(directory, options), /Report directory must be outside public/);
    }
    const alias = join(root, "reports-alias");
    symlinkSync(publicDirectory, alias, process.platform === "win32" ? "junction" : "dir");
    await assert.rejects(assertPrivateReportDirectory(join(alias, "new-report"), options), /Report directory must be outside public/);
    assert.equal(existsSync(join(publicDirectory, "new-report")), false);
  } finally {
    assert.ok(root.startsWith(join(tmpdir(), "aio-r8-w4-")));
    rmSync(root, { recursive: true, force: true });
  }
});
