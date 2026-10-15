// Prepare web derivatives in an ignored LOCAL directory. Customer originals are read only.
// Provenance (including content/media-manifest.json) is private build evidence, never a public asset.
// Usage: node scripts/prepare-reference-media.mjs <catalog> <previous-review-dir> <output-report-dir> <bwl-root> <healernet-root>
import {
  readFile,
  writeFile,
  mkdir,
  readdir,
  stat,
  link,
  rm,
  realpath,
} from "node:fs/promises";
import { createReadStream } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import { resolve, join, extname, relative, dirname, basename, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import sharp from "sharp";

async function legacyMain() {
  const [catalogPath, previous, reportPath, bwl, hn] = process.argv.slice(2);
  if (!hn) throw new Error("Five input paths required");
  const roots = { bwl: resolve(bwl), hn: resolve(hn) };
  const report = await assertPrivateReportDirectory(reportPath);
  const out = resolve("public/reference-review");
  await mkdir(out, { recursive: true });
  await mkdir(report, { recursive: true });
  const items = JSON.parse(await readFile(catalogPath, "utf8"));
  const manifest = [],
    prepared = {};
  async function hash(path) {
    const h = createHash("sha256");
    for await (const chunk of createReadStream(path)) h.update(chunk);
    return h.digest("hex");
  }
  function source(item, path) {
    const full = resolve(roots[item.root], path);
    if (relative(roots[item.root], full).startsWith(".."))
      throw new Error("Source outside customer root");
    return full;
  }
  async function run(args) {
    await new Promise((ok, fail) => {
      const child = spawn(
        "ffmpeg",
        ["-hide_banner", "-loglevel", "error", "-nostdin", ...args],
        { windowsHide: true },
      );
      let error = "";
      child.stderr.on("data", (x) => (error += x));
      child.on("error", fail);
      child.on("exit", (code) => (code === 0 ? ok() : fail(new Error(error))));
    });
  }
  async function image(item, file, name) {
    const target = join(out, item.id, name + ".webp");
    await createMissing(target, (temp) =>
      sharp(file)
        .rotate()
        .resize({
          width: 1600,
          height: 2400,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 86 })
        .toFile(temp),
    );
    const info = await sharp(target).metadata();
    await record(item, file, target);
    return {
      src: `/reference-review/${item.id}/${name}.webp`,
      width: info.width,
      height: info.height,
    };
  }
  async function record(item, original, derivative) {
    manifest.push({
      work: item.id,
      source: original,
      sourceBytes: (await stat(original)).size,
      sourceSha256: await hash(original),
      derivative: relative(resolve("."), derivative).replaceAll("\\", "/"),
      bytes: (await stat(derivative)).size,
      sha256: await hash(derivative),
      rights: "UNKNOWN/HOLD",
    });
  }
  async function video(item, file, name, presentation) {
    const target = join(out, item.id, name + ".mp4");
    await createMissing(target, (temp) =>
      run([
        "-n",
        "-i",
        file,
        "-map",
        "0:v:0",
        "-map",
        "0:a?",
        "-vf",
        "scale=w='min(1280,iw)':h='min(1280,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,fps=30",
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "25",
        "-threads",
        "2",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "+faststart",
        temp,
      ]),
    );
    const poster = join(out, item.id, name + "-poster.jpg");
    await createMissing(poster, (temp) =>
      run([
        "-n",
        "-ss",
        String(name === "hero" ? (item.previewPosterSecond ?? 1.5) : 1.5),
        "-i",
        target,
        "-frames:v",
        "1",
        "-q:v",
        "3",
        temp,
      ]),
    );
    await record(item, file, target);
    const cover = await image(item, poster, name + "-poster");
    return {
      kind: "video",
      src: `/reference-review/${item.id}/${name}.mp4`,
      poster: cover.src,
      alt: `${item.brand} ${item.title}`,
      presentation,
    };
  }
  for (const item of items) {
    await mkdir(join(out, item.id), { recursive: true });
    const media = [];
    if (item.video)
      media.push(
        await video(item, source(item, item.video), "hero", item.presentation),
      );
    else if (item.cover || item.sourceHtml) {
      const file = item.cover
        ? source(item, item.cover)
        : join(previous, "yofree-shop-cover.png");
      const cover = await image(item, file, "hero");
      const mobile = item.mobileCover
        ? await image(item, source(item, item.mobileCover), "mobile")
        : null;
      media.push({
        kind: "image",
        ...cover,
        alt: `${item.brand} ${item.title} PC 화면`,
        presentation: item.presentation,
        ...(mobile ? { mobileSrc: mobile.src } : {}),
      });
    }
    const gallery = (item.gallery ?? []).map((x) => source(item, x));
    if (item.galleryDir) {
      const dir = source(item, item.galleryDir);
      gallery.push(
        ...(await readdir(dir))
          .filter((x) => /\.(png|jpe?g|webp)$/i.test(x))
          .sort((a, b) => a.localeCompare(b, "ko", { numeric: true }))
          .map((x) => join(dir, x)),
      );
    }
    for (let i = 0; i < gallery.length; i++) {
      const file = gallery[i],
        name = `gallery-${String(i + 1).padStart(2, "0")}`;
      if (extname(file).toLowerCase() === ".mp4")
        media.push(await video(item, file, name, "portrait"));
      else
        media.push({
          kind: item.presentation === "webtoon" ? "webtoon" : "image",
          ...(await image(item, file, name)),
          alt: `${item.brand} ${item.title} ${i + 1}${item.presentation === "webtoon" ? "페이지" : "번째 이미지"}`,
          presentation: item.presentation,
        });
    }
    prepared[item.id] = media;
    console.log(`${item.id}: ${media.length} media prepared`);
  }
  await writeFile(
    join(report, "PREPARED_WORK_MEDIA.json"),
    JSON.stringify(prepared, null, 2),
  );
  await writeFile(
    join(report, "ASSET_MANIFEST.json"),
    JSON.stringify(manifest, null, 2),
  );
  console.log(
    JSON.stringify({
      works: items.length,
      derivatives: manifest.length,
      bytes: manifest.reduce((n, x) => n + x.bytes, 0),
    }),
  );
}

// Resolve existing parents too, so a junction cannot redirect a private-looking report into public.
async function physicalPath(path) {
  try {
    return await realpath(path);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return join(await physicalPath(dirname(path)), basename(path));
  }
}

export async function assertPrivateReportDirectory(
  directory,
  { publicDirectory = resolve("public") } = {},
) {
  const report = resolve(directory);
  const isInside = (parent, child) => {
    const rel = relative(parent, child);
    return !rel || (!rel.startsWith(`..\\`) && !rel.startsWith("../") && rel !== ".." && !isAbsolute(rel));
  };
  if (
    isInside(resolve(publicDirectory), report) ||
    isInside(await physicalPath(resolve(publicDirectory)), await physicalPath(report))
  ) {
    throw new Error("Report directory must be outside public: source paths and hashes are private");
  }
  return report;
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}
async function createMissing(target, render) {
  if (await exists(target)) return false;
  await mkdir(dirname(target), { recursive: true });
  const temp = join(dirname(target), `.aio-${randomUUID()}${extname(target)}`);
  try {
    await render(temp);
    // Exclusive creation also preserves files appearing during conversion.
    try {
      await link(temp, target);
    } catch (error) {
      if (error.code === "EEXIST") return false;
      throw error;
    }
    return true;
  } finally {
    await rm(temp, { force: true });
  }
}
async function ffmpeg(args) {
  await new Promise((done, fail) => {
    const child = spawn(
      "ffmpeg",
      ["-hide_banner", "-loglevel", "error", "-nostdin", "-n", ...args],
      { windowsHide: true },
    );
    let error = "";
    child.stderr.on("data", (chunk) => {
      error += chunk;
    });
    child.on("error", fail);
    child.on("exit", (code) =>
      code === 0 ? done() : fail(new Error(error || `ffmpeg exit ${code}`)),
    );
  });
}

// Called only by works:build --media. JSON source paths are build inputs.
export async function prepareWorkMedia(
  work,
  { publicDirectory = resolve("public") } = {},
) {
  const out = resolve(publicDirectory, "reference-review", work.slug);
  const targetFor = (path) => {
    const target = resolve(publicDirectory, `.${path}`);
    const rel = relative(out, target);
    if (
      !rel ||
      rel === ".." ||
      rel.startsWith("..\\") ||
      rel.startsWith("../") ||
      /^[A-Za-z]:/.test(rel)
    )
      throw new Error(
        `파생물은 /reference-review/${work.slug}/ 내부여야 합니다`,
      );
    return target;
  };
  let created = 0;
  for (let index = 0; index < work.media.length; index++) {
    const media = work.media[index];
    if (!media.source) continue;
    try {
      const original = resolve(media.source);
      const target = targetFor(media.src);
      for (const path of [
        target,
        ...(media.mobileSrc ? [targetFor(media.mobileSrc)] : []),
      ]) {
        const made = await createMissing(path, (temp) =>
          media.kind === "video"
            ? ffmpeg([
                "-i",
                original,
                "-map",
                "0:v:0",
                "-map",
                "0:a?",
                "-vf",
                "scale=w='min(1280,iw)':h='min(1280,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,fps=30",
                "-c:v",
                "libx264",
                "-preset",
                "fast",
                "-crf",
                "25",
                "-threads",
                "2",
                "-c:a",
                "aac",
                "-b:a",
                "128k",
                "-movflags",
                "+faststart",
                temp,
              ])
            : sharp(original)
                .rotate()
                .resize({
                  width: 1600,
                  height: 2400,
                  fit: "inside",
                  withoutEnlargement: true,
                })
                .webp({ quality: 86 })
                .toFile(temp),
        );
        if (made) created++;
      }
      if (media.kind === "video" && media.poster) {
        const cover = targetFor(media.poster);
        const made = await createMissing(cover, async (temp) => {
          const still = join(dirname(cover), `.aio-${randomUUID()}.png`);
          try {
            await ffmpeg(["-ss", "1.5", "-i", target, "-frames:v", "1", still]);
            await sharp(still)
              .rotate()
              .resize({
                width: 1600,
                height: 2400,
                fit: "inside",
                withoutEnlargement: true,
              })
              .webp({ quality: 86 })
              .toFile(temp);
          } finally {
            await rm(still, { force: true });
          }
        });
        if (made) created++;
      }
    } catch (error) {
      throw new Error(
        `${work.slug}.json: media.${index}.source: ${error.message}`,
      );
    }
  }
  return created;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  legacyMain().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
