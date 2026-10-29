// Three distinct crops per source for the interactive channel previews.
import sharp from "sharp";
for (let i = 0; i < 4; i++)
  for (let j = 0; j < 3; j++)
    await sharp("public/marketing-renewal/material-" + i + ".webp")
      .resize(j === 2 ? 360 : 480, j === 0 ? 600 : j === 1 ? 360 : 640, {
        fit: "cover",
        position: j === 1 ? "north" : "centre",
      })
      .webp({ quality: 90 })
      .toFile("public/marketing-renewal/preview-" + i + "-" + j + ".webp");
