import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, stat, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";
import { prepareWorkMedia } from "../scripts/prepare-reference-media.mjs";

test("media preparation creates missing image/video/poster and preserves existing files", async () => {
  const dir = await mkdtemp(join(tmpdir(), "aio-work-media-"));
  const rel = relative(resolve(tmpdir()), resolve(dir));
  assert.ok(
    rel && !rel.startsWith(".."),
    "fixture must remain within temporary directory",
  );
  try {
    const source = join(dir, "source.png");
    await sharp({
      create: { width: 48, height: 32, channels: 3, background: "#6b4dff" },
    })
      .png()
      .toFile(source);
    const work = {
      slug: "sample",
      media: [
        {
          kind: "image",
          src: "/reference-review/sample/hero.webp",
          mobileSrc: "/reference-review/sample/mobile.webp",
          source,
        },
      ],
    };
    assert.equal(await prepareWorkMedia(work, { publicDirectory: dir }), 2);
    const target = join(dir, "reference-review/sample/hero.webp");
    const before = await readFile(target);
    const modified = (await stat(target)).mtimeMs;
    assert.equal(
      await prepareWorkMedia(
        {
          ...work,
          media: [{ ...work.media[0], source: join(dir, "unavailable.png") }],
        },
        { publicDirectory: dir },
      ),
      0,
    );
    assert.deepEqual(await readFile(target), before);
    assert.equal((await stat(target)).mtimeMs, modified);
    await assert.rejects(
      prepareWorkMedia(
        {
          slug: "sample",
          media: [
            { kind: "image", src: "/reference-review/other/hero.webp", source },
          ],
        },
        { publicDirectory: dir },
      ),
      /sample\.json: media\.0\.source:/,
    );
    const probe = spawnSync("ffmpeg", ["-version"], { windowsHide: true });
    if (probe.error?.code === "ENOENT") return;
    assert.equal(probe.status, 0);
    const video = join(dir, "source.mp4");
    const made = spawnSync(
      "ffmpeg",
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-nostdin",
        "-n",
        "-f",
        "lavfi",
        "-i",
        "color=c=purple:s=48x32:r=30",
        "-t",
        "2",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        video,
      ],
      { encoding: "utf8", windowsHide: true },
    );
    assert.equal(made.status, 0, made.stderr);
    const clip = {
      slug: "clip",
      media: [
        {
          kind: "video",
          src: "/reference-review/clip/hero.mp4",
          poster: "/reference-review/clip/hero-poster.webp",
          source: video,
        },
      ],
    };
    assert.equal(await prepareWorkMedia(clip, { publicDirectory: dir }), 2);
    const videoBytes = await readFile(
      join(dir, "reference-review/clip/hero.mp4"),
    );
    assert.ok(videoBytes.length > 0);
    assert.equal(
      (
        await sharp(
          await readFile(join(dir, "reference-review/clip/hero-poster.webp")),
        ).metadata()
      ).format,
      "webp",
    );
    assert.equal(await prepareWorkMedia(clip, { publicDirectory: dir }), 0);
    assert.deepEqual(
      await readFile(join(dir, "reference-review/clip/hero.mp4")),
      videoBytes,
    );
  } finally {
    await rm(dir, {
      recursive: true,
      force: true,
      maxRetries: 10,
      retryDelay: 100,
    });
  }
});
