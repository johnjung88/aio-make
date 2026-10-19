import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { contentLandings } from "../lib/content-site/index.ts";
import { r8Details } from "../lib/content-site/r8-details.ts";
import { r8Boards } from "../lib/content-site/r8-boards.ts";
import { getSlot } from "../lib/content-site/example-media.ts";

const brief = readFileSync("docs/renewal-2026-10-13/BRIEF_R8.md", "utf8");
const webtoonPageBrief = readFileSync("docs/renewal-2026-10-13/BRIEF_WEBTOON_PAGE_v16.md", "utf8");
const copyAlignmentBrief = readFileSync("docs/renewal-2026-10-13/BRIEF_COPY_ALIGNMENT_v17.md", "utf8");
test("R8 six services: every process step and FAQ matches the approved brief", () => {
  for (const [id, data] of Object.entries(contentLandings)) {
    const currentBrief = id === "webtoon" ? brief + "\n" + webtoonPageBrief + "\n" + copyAlignmentBrief : brief;
    assert.equal(data.process.steps.length, 6, id);
    assert.equal(data.faq.length, 7, id);
    for (const step of data.process.steps) for (const text of Object.values(step)) assert.ok(currentBrief.includes(text), `${id}: ${text}`);
    for (const [q, a] of data.faq.slice(0, 5)) {
      assert.ok(currentBrief.includes(q), q); assert.ok(currentBrief.includes(a), `${id}: ${a}`);
    }
  }
});
test("R8 sample boards: six documented cuts, source thumbnails, safe excluded ranges", () => {
  for (const [id, board] of Object.entries(r8Boards)) {
    assert.equal(board.cuts.length, 6, id);
    for (const cut of board.cuts) {
      assert.ok(cut.to > cut.from); assert.ok(existsSync(`public${cut.thumb}`));
      assert.ok(brief.includes(cut.scene)); assert.ok(brief.includes(cut.intent));
    }
    for (const sample of board.sample) {
      assert.ok(existsSync(`public${sample.poster}`));
      if (sample.src) assert.ok(existsSync(`public${sample.src}`));
    }
  }
  assert.equal(r8Boards["motion-graphics"].cuts.at(-1).to, 25.5);
  assert.ok(r8Details.ad.cuts.every(c => !/화장실/.test(c.copy)));
  assert.equal(r8Boards["brand-film"].chapters.length, 8);
});
test("R8 service hero slots can show posters before W2 media is connected", () => {
  for (const id of ["webtoon-hero-reel", "ai-hero-reel", "motion-hero-reel", "brandfilm-main", "ad-hero-reel"]) {
    const slot = getSlot(id); assert.equal(slot.kind, "video");
    assert.ok(existsSync(`public${slot.poster}`));
    if (slot.src) assert.ok(existsSync(`public${slot.src}`));
  }
});
