import sharp from "sharp";
import { mkdir, readFile, copyFile, writeFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
const entries = JSON.parse(await readFile("docs/renewal/assets.json", "utf8"));
await mkdir("public/renewal", { recursive: true });
await mkdir("docs/renewal/generated-originals", { recursive: true });
const chosen = process.argv.slice(2);
for (const entry of entries) {
  if (chosen.length && !chosen.includes(entry.name)) continue;
  entry.originalProjectPath ??=
    "docs/renewal/generated-originals/" + entry.name + "-v01.png";
  try {
    await access(entry.originalProjectPath);
  } catch {
    await copyFile(entry.source, entry.originalProjectPath);
  }
  const source = await readFile(entry.originalProjectPath);
  entry.sha256 = createHash("sha256").update(source).digest("hex");
  entry.originalWidth = (await sharp(source).metadata()).width;
  entry.output = "/renewal/" + entry.name + ".webp";
  const web = await sharp(source)
    .resize({
      width: entry.name === "hero" ? 1536 : 1100,
      withoutEnlargement: true,
    })
    .webp({ quality: 86 })
    .toBuffer();
  await writeFile("public" + entry.output, web);
  entry.webBytes = web.length;
  console.log(entry.name, web.length + " bytes");
}
await writeFile(
  "docs/renewal/assets.json",
  JSON.stringify(entries, null, 2) + "\n",
);
