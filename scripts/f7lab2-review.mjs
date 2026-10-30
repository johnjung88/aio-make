import sharp from "sharp";
import fs from "node:fs/promises";
const root = "C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_F7/lab/f7lab2";
await fs.mkdir(`${root}/review`, { recursive: true });
const comparison = [];
for (const width of [1440, 1280, 1170, 1024, 390]) {
  const pieces = [];
  let top = 0;
  for (const name of [
    `price_automation_${width}.png`,
    `price_program_${width}.png`,
    `lab_services_website_${width}_signature.png`,
    `related_website_${width}.png`,
    `related_shopping-mall_${width}.png`,
    `related_automation_${width}.png`,
    `related_program_${width}.png`,
    `insight_cards_${width}.png`,
    `program_article_${width}.png`,
  ]) {
    const file = await sharp(`${root}/after/${name}`)
      .resize({ width: 800 })
      .png()
      .toBuffer({ resolveWithObject: true });
    pieces.push({ input: file.data, left: 0, top });
    top += file.info.height + 20;
  }
  await sharp({
    create: { width: 800, height: top, channels: 3, background: "#343434" },
  })
    .composite(pieces)
    .png()
    .toFile(`${root}/review/changed_${width}.png`);
  const buffers = [];
  for (const phase of ["before", "after"]) {
    buffers.push(
      await sharp(`${root}/${phase}/content_${width}.png`)
        .extract({ left: 0, top: 0, width, height: 1800 })
        .raw()
        .toBuffer(),
    );
  }
  let changed = 0;
  for (let i = 0; i < buffers[0].length; i++)
    if (buffers[0][i] !== buffers[1][i]) changed++;
  comparison.push({ width, comparedHeight: 1800, changedChannels: changed });
  await sharp({
    create: {
      width: width * 2,
      height: 1800,
      channels: 3,
      background: "#080808",
    },
  })
    .composite(
      await Promise.all(
        ["before", "after"].map(async (phase, i) => ({
          input: await sharp(`${root}/${phase}/content_${width}.png`)
            .extract({ left: 0, top: 0, width, height: 1800 })
            .png()
            .toBuffer(),
          left: i * width,
          top: 0,
        })),
      ),
    )
    .png()
    .toFile(`${root}/review/content_${width}.png`);
}
await fs.writeFile(
  `${root}/content-comparison.json`,
  JSON.stringify(comparison, null, 2),
);
console.log(comparison);
