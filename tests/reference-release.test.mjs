import test from "node:test";
import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import { publicWorkCatalog, reviewWorks, workMatchesService } from "../lib/work-catalog.ts";
import { guideEntries } from "../lib/guide-content.ts";

test("unapproved customer references never enter the public catalog or search feed", () => {
  const catalog = publicWorkCatalog(guideEntries("reference"));
  assert.ok(catalog.length > 0);
  assert.equal(catalog.filter(work => work.id.startsWith("AIO-WORK-")).length, 0);
  assert.ok(reviewWorks.every(work => work.visibility === "review"));
});

test("all 18 prepared works have descriptive media and complete ordered webtoon pages", () => {
  assert.equal(reviewWorks.length, 18);
  assert.equal(new Set(reviewWorks.map(work => work.canonicalPath)).size, 18);
  assert.equal(reviewWorks.flatMap(work => work.media).filter(media => media.kind === "video").length, 17);
  for (const work of reviewWorks) {
    assert.ok(work.media.length > 0, work.slug);
    assert.notEqual(work.purpose, work.scope, work.slug);
    for (const media of work.media) {
      assert.ok(media.src.startsWith("/reference-review/"));
      assert.ok(media.alt.length > 5);
      if (media.kind === "video") assert.ok(media.poster?.endsWith(".webp"));
    }
  }
  for (const [slug, pages] of [["bwl-brand-webtoon",4],["bwl-aqua-webtoon",3],["yofree-outing-webtoon",5],["yofree-night-webtoon",6]]) {
    const media = reviewWorks.find(work => work.slug === slug).media;
    assert.equal(media.length,pages);
    assert.ok(media.every((item,index) => item.src.includes(`gallery-${String(index+1).padStart(2,"0")}`)));
  }
});

test("related content is not represented as a marketing operations result", () => {
  const work = reviewWorks.find(work => work.slug === "bwl-aqua-ad");
  assert.equal(workMatchesService(work,"ai-influencer","video"), true);
  assert.equal(workMatchesService(work,"ai-influencer","marketing"), false);
});

test("prepared derivatives exist when local review is requested", async t => {
  if (process.env.AIO_VERIFY_LOCAL_MEDIA !== "1") return t.skip("Local media excluded from release checkout");
  for (const media of reviewWorks.flatMap(work => work.media)) {
    for (const path of [media.src,media.poster,media.mobileSrc].filter(Boolean)) {
      assert.ok((await stat(new URL("../public"+path,import.meta.url))).size>0,path);
    }
  }
});
