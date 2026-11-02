import fs from "node:fs/promises";
import sharp from "sharp";
import crypto from "node:crypto";
const root = "C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_F7/mk";
const rows = JSON.parse(
  await fs.readFile(`${root}/after/results.json`, "utf8"),
);
await fs.mkdir(`${root}/review`, { recursive: true });
await fs.mkdir(`${root}/reference`, { recursive: true });
for (const kind of ["pc", "m"])
  await fs.copyFile(
    `C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_F3/live6/content-${kind}-full.jpg`,
    `${root}/reference/content-${kind}-full.jpg`,
  );
for (const route of [...new Set(rows.map((row) => row.route))].filter(
  (route) => route !== "/content",
)) {
  const name = route.slice(1).replaceAll("/", "_");
  const group = rows.filter((row) => row.route === route);
  // Full-page overview includes every width, in before/after pairs.
  const thumbs = [];
  let maxHeight = 0;
  for (const row of group)
    for (const phase of ["before", "after"]) {
      const data = await sharp(`${root}/${phase}/${name}_${row.width}.png`)
        .resize({ width: 180 })
        .png()
        .toBuffer();
      const meta = await sharp(data).metadata();
      maxHeight = Math.max(maxHeight, meta.height);
      thumbs.push({ input: data, left: thumbs.length * 180, top: 0 });
    }
  await sharp({
    create: {
      width: 1800,
      height: maxHeight,
      channels: 3,
      background: "#28232e",
    },
  })
    .composite(thumbs)
    .jpeg({ quality: 85 })
    .toFile(`${root}/review/${name}-all.jpg`);
  for (let index = 0; index < group[0].reviewRegions.length; index++) {
    const clips = [];
    let height = 0;
    for (const row of group) {
      const r = row.reviewRegions[index];
      const input = `${root}/after/${name}_${row.width}.png`;
      const meta = await sharp(input).metadata();
      const top = Math.max(0, Math.floor(r.y));
      const clip = await sharp(input)
        .extract({
          left: Math.max(0, Math.floor(r.x)),
          top,
          width: Math.min(
            Math.floor(r.width),
            meta.width - Math.max(0, Math.floor(r.x)),
          ),
          height: Math.min(Math.ceil(r.height), meta.height - top),
        })
        .resize({ width: 360 })
        .png()
        .toBuffer();
      height = Math.max(height, (await sharp(clip).metadata()).height);
      clips.push({ input: clip, left: clips.length * 360, top: 0 });
    }
    await sharp({
      create: { width: 1800, height, channels: 3, background: "#28232e" },
    })
      .composite(clips)
      .jpeg({ quality: 90 })
      .toFile(`${root}/review/${name}-focus-${index}.jpg`);
  }
  // Compare the first content-height interval at native PC/mobile widths.
  for (const width of [1440, 390]) {
    const pair = [];
    for (const file of [`${name}_${width}`, `content_${width}`]) {
      const input = file.startsWith("content_")
        ? `${root}/reference/content-${width === 1440 ? "pc" : "m"}-full.jpg`
        : `${root}/after/${file}.png`;
      const m = await sharp(input).metadata();
      pair.push({
        input: await sharp(input)
          .extract({ left: 0, top: 0, width, height: Math.min(1800, m.height) })
          .png()
          .toBuffer(),
        left: pair.length * width,
        top: 0,
      });
    }
    await sharp({
      create: {
        width: width * 2,
        height: 1800,
        channels: 3,
        background: "#080808",
      },
    })
      .composite(pair)
      .jpeg({ quality: 85 })
      .toFile(`${root}/review/${name}-content-${width}.jpg`);
  }
}
const manifest = [];
async function scan(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await scan(path);
    else if (/\.(png|jpg)$/.test(path)) {
      const buffer = await fs.readFile(path);
      const m = await sharp(buffer).metadata();
      manifest.push({
        path: path.slice(root.length + 1),
        width: m.width,
        height: m.height,
        bytes: buffer.length,
        sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
      });
    }
  }
}
await scan(root);
await fs.writeFile(`${root}/manifest.json`, JSON.stringify(manifest, null, 2));
console.log(`verified ${manifest.length} images`);
