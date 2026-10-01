import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const root = process.cwd();
const doc = path.join(root, 'docs/review-v06');
const list = JSON.parse(await fs.readFile(path.join(doc,'image-prompts.json'),'utf8')).assets;
await fs.mkdir(path.join(doc,'generated-originals'),{recursive:true});
await fs.mkdir(path.join(root,'public/creative-v06'),{recursive:true});
const manifest=[];
for (const asset of list) {
 const match=asset.output_hint.match(/as (C:\\.*?\.png) by default/);
 if(!match) throw new Error(`No output path: ${asset.key}`);
 const buffer=await fs.readFile(match[1]);
 await fs.writeFile(path.join(doc,'generated-originals',asset.key+'.png'),buffer);
 await sharp(buffer).webp({quality:88}).toFile(path.join(root,'public/creative-v06',asset.key+'.webp'));
 const meta=await sharp(buffer).metadata();
 manifest.push({key:asset.key,source:match[1],original:`generated-originals/${asset.key}.png`,web:`/creative-v06/${asset.key}.webp`,width:meta.width,height:meta.height,sha256:crypto.createHash('sha256').update(buffer).digest('hex')});
}
await fs.writeFile(path.join(doc,'image-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({copied:manifest.length,converted:manifest.length}));
