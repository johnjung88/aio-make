import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { workSchema } from "../lib/work-schema.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
let input = resolve(root, "content/works");
let output = resolve(root, "lib/generated/works.generated.ts");
let media = false;
try {
  const args = process.argv.slice(2);
  for (let index = 0; index < args.length; index++) {
    if (args[index] === "--media") media = true;
    else if (
      ["--input-dir", "--output"].includes(args[index]) &&
      args[index + 1]
    ) {
      const option = args[index++];
      if (option === "--input-dir") input = resolve(args[index]);
      else output = resolve(args[index]);
    } else throw new Error(`알 수 없는 옵션: ${args[index]}`);
  }
  const files = (await readdir(input))
    .filter((name) => name.endsWith(".json"))
    .sort();
  if (!files.length) throw new Error(`${input}: JSON 파일이 없습니다`);
  const works = [],
    errors = [],
    ids = new Set(),
    slugs = new Set();
  for (const filename of files) {
    let parsed;
    try {
      parsed = JSON.parse(await readFile(resolve(input, filename), "utf8"));
    } catch (error) {
      errors.push(`${filename}: JSON: ${error.message}`);
      continue;
    }
    const result = workSchema.safeParse(parsed);
    if (!result.success) {
      errors.push(
        ...result.error.issues.map(
          (issue) =>
            `${filename}: ${issue.path.join(".") || "(root)"}: ${issue.message}`,
        ),
      );
      continue;
    }
    const work = result.data;
    if (basename(filename, ".json") !== work.slug)
      errors.push(`${filename}: slug: 파일명과 일치해야 합니다`);
    if (ids.has(work.id)) errors.push(`${filename}: id: 중복 ID ${work.id}`);
    if (slugs.has(work.slug))
      errors.push(`${filename}: slug: 중복 URL ${work.slug}`);
    ids.add(work.id);
    slugs.add(work.slug);
    works.push(work);
  }
  if (errors.length) throw new Error(errors.join("\n"));
  if (media) {
    const { prepareWorkMedia } = await import("./prepare-reference-media.mjs");
    for (const work of works)
      await prepareWorkMedia(work, {
        publicDirectory: resolve(root, "public"),
      });
  }
  // Source paths are build inputs only, never shipped to the browser.
  const runtimeWorks = works.map((work) => ({
    ...work,
    media: work.media.map((media) => {
      const item = { ...media };
      delete item.source;
      return item;
    }),
  }));
  const publicWorks = runtimeWorks.filter(
    (work) => work.visibility === "public" && work.rightsConfirmed,
  );
  // Next replaces typeof window and the public flag during client compilation.
  // Keep the records inside the conditional so the public client build can
  // remove pending customer data, including its media paths and copy.
  const generated =
    '// 자동 생성, 직접 수정 금지 — npm run works:build\nimport type { WorkRecord } from "../work-schema.ts";\n\n' +
    '// 검토 데이터는 서버 또는 명시적인 로컬 검토 브라우저에서만 사용합니다\n' +
    'export const generatedWorks: WorkRecord[] =\n  typeof window === "undefined" || process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1"\n    ? ' +
    JSON.stringify(runtimeWorks, null, 2) +
    "\n    : " +
    JSON.stringify(publicWorks, null, 2) +
    ";\n";
  await mkdir(dirname(output), { recursive: true });
  let existing;
  try {
    existing = await readFile(output, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (existing !== generated) await writeFile(output, generated);
  console.log(
    `works:build PASS — ${works.length} JSON → ${output}${media ? " (누락 미디어만 준비)" : ""}`,
  );
} catch (error) {
  console.error(`works:build FAIL\n${error.message}`);
  process.exitCode = 1;
}
