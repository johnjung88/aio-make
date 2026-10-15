import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { contentHomeHero } from "../lib/content-home.ts";
import { getSlot } from "../lib/content-site/example-media.ts";

test("R8 six connected reels have H.264 picture, AAC music, approved geometry and download budgets", () => {
  const rows = [
    ["hero", contentHomeHero.video, 1920, 1080, 67, 69, 12000000],
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
});

test("R8 sound controls have explicit pressed state and remain exclusive to hero reels", () => {
  const read = path => readFileSync(path, "utf8");
  for (const path of ["components/content-home/hero-video.tsx", "components/content-site/services/reel-player.tsx"]) {
    const source = read(path);
    assert.match(source, /useReelSound/);
    assert.match(source, /aria-pressed=\{!muted\}/);
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
