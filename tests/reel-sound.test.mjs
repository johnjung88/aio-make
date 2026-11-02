import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { contentHomeHero } from "../lib/content-home.ts";
import { getSlot } from "../lib/content-site/example-media.ts";

test("v10 connected reels keep geometry, codecs and budgets; the home uses the exact user-selected v02", () => {
  const rows = [
    ["hero", contentHomeHero.video, 1920, 1080, 59.06, 59.08, 14097604],
    ["webtoon", getSlot("webtoon-hero-reel"), 720, 1080, 29.5, 30.5, 6000000],
    ["ai", getSlot("ai-hero-reel"), 720, 1280, 29.5, 30.5, 6000000],
    ["motion", getSlot("motion-hero-reel"), 1280, 720, 29.5, 30.5, 6000000],
    ["brand", getSlot("brandfilm-main"), 1280, 720, 29.5, 30.5, 6000000],
    ["ad", getSlot("ad-hero-reel"), 720, 1280, 29.5, 30.5, 6000000],
  ];
  for (const [id, slot, w, h, min, max, bytes] of rows) {
    const path = `public${slot.src}`;
    const data = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_format", "-show_streams", "-of", "json", path], { encoding: "utf8" }));
    const picture = data.streams.find(s => s.codec_type === "video");
    const audio = data.streams.filter(s => s.codec_type === "audio");
    assert.equal(picture.codec_name, "h264", id);
    assert.deepEqual([picture.width, picture.height], [w, h], id);
    assert.equal(picture.avg_frame_rate, "30/1", id);
    assert.equal(audio.length, 1, id);
    assert.equal(audio[0].codec_name, "aac", id);
    assert.ok(Number(data.format.duration) >= min && Number(data.format.duration) <= max, id);
    assert.ok(statSync(path).size <= bytes, id);
    assert.ok(statSync(`public${slot.poster}`).size > 0, id);
  }
  const lineage = JSON.parse(readFileSync("content/approved-main-assets-20261019.json", "utf8"));
  const approved = {
    "/content-renewal-20261019/content-hero-v02.mp4": [14097604, "2eaf074e040b600ca24239631a9c61f332373cb90eeffe409eeff57ecfb605c8"],
    "/content-renewal-20261019/content-hero-v02.webp": [47282, "39f6b1e7736a7fa1368a3c56b20c9222a0a5f2a6d6d3503fe8cdf23afb045690"],
  };
  assert.deepEqual([contentHomeHero.video.src, contentHomeHero.video.poster], Object.keys(approved));
  for (const [url, [bytes, sha256]] of Object.entries(approved)) {
    const entry = lineage.assets.find(asset => asset.publicPath === url);
    assert.ok(entry, `${url} has private provenance`);
    assert.match(entry.sourceId, /MG-20261019-01_콘텐츠히어로_v02/);
    assert.equal(entry.bytes, bytes);
    assert.equal(entry.sha256, sha256);
    const file = readFileSync(`public${url}`);
    assert.equal(file.length, bytes);
    assert.equal(createHash("sha256").update(file).digest("hex"), sha256, url);
  }
});

test("v10 sound controls announce the actual mute state and coordinate audible hero reels", () => {
  const read = path => readFileSync(path, "utf8");
  for (const path of ["components/content-home/hero-video.tsx", "components/content-site/services/reel-player.tsx"]) {
    const source = read(path);
    assert.match(source, /useReelSound/);
    if (path === "components/content-home/hero-video.tsx") {
      assert.match(source, /aria-pressed=\{!actualMuted\}/);
      assert.match(source, /useState\(true\)/);
      assert.match(source, /onVolumeChange[\s\S]*?setActualMuted\(event\.currentTarget\.muted\)/, "native controls update the announced sound state");
      assert.match(source, /muted=\{muted\}/, "shared sound coordinator still drives the video");
    } else assert.match(source, /aria-pressed=\{!muted\}/);
    assert.match(source, /소리 켜기/);
    assert.match(source, /소리 끄기/);
    assert.doesNotMatch(source, /autoPlay/);
  }
  assert.match(read("components/content-site/services/reel-player.tsx"), /hero && <button/);
  assert.doesNotMatch(read("components/content-site/services/cut-board.tsx"), /소리 켜기/);
  const coordinator = read("components/content-site/services/reel-sound.ts");
  assert.match(coordinator, /useState\(true\)/);
  assert.match(coordinator, /detail !== ref.current/);
  assert.match(coordinator, /document.hidden/);
  assert.match(read("components/content-site/shell/footer.tsx"), /FreePD\(CC0\) · Kevin MacLeod · Bryan Teoh · Rafael Krux/);
});
