import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";
const root = "C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_F6/mk";
for (const phase of ["before", "after"]) {
  const results = JSON.parse(
    await fs.readFile(`${root}/${phase}/results.json`, "utf8"),
  );
  for (const r of results) {
    for (const m of r.media)
      if (m.src?.startsWith("/_next/image"))
        m.src = new URL(m.src, "http://localhost").searchParams.get("url");
    r.duplicate = r.media.filter(
      (m, i) => r.media.findIndex((n) => n.src === m.src) < i,
    );
  }
  await fs.writeFile(
    `${root}/${phase}/results.json`,
    JSON.stringify(results, null, 2),
  );
}
for (const target of [
  "marketing",
  "marketing_services_integrated",
  "marketing_services_sns",
  "marketing_services_ai-influencer",
  "marketing_services_seo",
  "about",
]) {
  const inputs = [];
  let height = 0;
  for (const [i, w] of [1440, 1280, 1170, 1024, 390].entries()) {
    const result = await sharp(`${root}/review/content_${target}_${w}.jpg`)
      .resize({ width: 400 })
      .jpeg()
      .toBuffer({ resolveWithObject: true });
    height = Math.max(height, result.info.height);
    inputs.push({ input: result.data, left: i * 400, top: 0 });
  }
  await sharp({
    create: { width: 2000, height, channels: 3, background: "#222" },
  })
    .composite(inputs)
    .jpeg({ quality: 90 })
    .toFile(`${root}/review/reference_${target}.jpg`);
}
const files = [];
async function walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (/\.(png|jpg)$/.test(file)) {
      const b = await fs.readFile(file);
      const m = await sharp(b).metadata();
      files.push({
        path: path.relative(root, file).replaceAll("\\", "/"),
        width: m.width,
        height: m.height,
        sha256: createHash("sha256").update(b).digest("hex"),
      });
    }
  }
}
await walk(root);
await fs.writeFile(`${root}/manifest.json`, JSON.stringify(files, null, 2));
const after = JSON.parse(await fs.readFile(`${root}/after/results.json`));
console.log(
  JSON.stringify(
    after
      .filter((r) => r.width === 1440 && r.route !== "/content")
      .map((r) => ({
        route: r.route,
        img: r.media.filter((m) => m.tag === "IMG").length,
        video: r.media.filter((m) => m.tag === "VIDEO").length,
        duplicate: r.duplicate.length,
      })),
    null,
    2,
  ),
);
console.log("captures", files.length);
