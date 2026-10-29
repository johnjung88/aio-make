import fs from "node:fs/promises";
import sharp from "sharp";
import path from "node:path";
import crypto from "node:crypto";
const folder = "C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_RW2";
for (const width of [1440, 390])
  for (const mode of ["first", "full"]) {
    const files = [
      "content_" + width + "_" + mode + ".png",
      "marketing_" + width + "_" + mode + ".png",
    ];
    const targetWidth = width === 1440 ? 720 : 390;
    const buffers = await Promise.all(
      files.map((f) =>
        sharp(path.join(folder, f))
          .resize({ width: targetWidth })
          .png()
          .toBuffer(),
      ),
    );
    const meta = await Promise.all(buffers.map((b) => sharp(b).metadata()));
    const height = Math.max(...meta.map((m) => m.height));
    const label = Buffer.from(
      '<svg width="' +
        targetWidth * 2 +
        '" height="36"><rect width="100%" height="100%" fill="#28232f"/><text x="20" y="24" fill="white" font-size="16">CONTENT / reference</text><text x="' +
        (targetWidth + 20) +
        '" y="24" fill="white" font-size="16">MARKETING / W-RW2</text></svg>',
    );
    await sharp({
      create: {
        width: targetWidth * 2,
        height: height + 36,
        channels: 3,
        background: "#0d0b12",
      },
    })
      .composite([
        { input: label, top: 0, left: 0 },
        { input: buffers[0], top: 36, left: 0 },
        { input: buffers[1], top: 36, left: targetWidth },
      ])
      .png()
      .toFile(
        path.join(
          folder,
          "compare_content_marketing_" + width + "_" + mode + ".png",
        ),
      );
  }
const photos = "public/marketing-renewal";
const assets = [];
for (const f of (await fs.readdir(photos)).sort()) {
  if (!f.endsWith(".webp")) continue;
  const b = await fs.readFile(path.join(photos, f));
  const m = await sharp(b).metadata();
  assets.push({
    file: "/marketing-renewal/" + f,
    bytes: b.length,
    width: m.width,
    height: m.height,
    sha256: crypto.createHash("sha256").update(b).digest("hex"),
    kind: /^(feed|persona|material)-/.test(f)
      ? "AI-generated photo crop"
      : f.startsWith("preview-")
        ? "photo crop for interactive preview"
        : "HTML screen capture",
  });
}
await fs.mkdir("docs/renewal/w-rw2", { recursive: true });
await fs.writeFile(
  "docs/renewal/w-rw2/assets.json",
  JSON.stringify(
    {
      task: "W-RW2",
      generator:
        "Built-in image_gen (3 contact sheets) + HTML/Playwright + Sharp",
      brand: "가상 브랜드 카페 리프",
      count: assets.length,
      totalBytes: assets.reduce((n, a) => n + a.bytes, 0),
      assets,
    },
    null,
    2,
  ),
);
console.log({
  count: assets.length,
  totalBytes: assets.reduce((n, a) => n + a.bytes, 0),
});
