import { mkdir, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const roots = ["service-detail-v14", "service-detail-v15", "renewal", "portfolio", "images"];
const media = /\.(?:avif|gif|jpe?g|png|svg|webp|mp4|webm)$/i;

/** Build-time existence index keeps public media out of server function bundles. */
export async function buildPublicMediaIndex(root = process.cwd()) {
  const paths = [];
  async function walk(relative) {
    let entries;
    try {
      entries = await readdir(join(root, "public", relative), { withFileTypes: true });
    } catch (error) {
      if (error.code === "ENOENT") return;
      throw error;
    }
    for (const entry of entries) {
      const next = `${relative}/${entry.name}`;
      // Do not follow symlinks into private source folders or another workspace.
      if (entry.isDirectory()) await walk(next);
      else if (entry.isFile() && media.test(entry.name) && /^[\w/.-]+$/.test(next) && !next.includes("..")) paths.push(`/${next}`);
    }
  }
  for (const prefix of roots) await walk(prefix);
  paths.sort();
  const destination = join(root, "lib/generated/public-media-files.generated.json");
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(paths, null, 2)}\n`, "utf8");
  return paths;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const paths = await buildPublicMediaIndex();
  process.stdout.write(`Indexed ${paths.length} public media paths\n`);
}
