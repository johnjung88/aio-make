// Prepare web derivatives in an ignored LOCAL directory. Customer originals are read only.
// Usage: node scripts/prepare-reference-media.mjs <catalog> <previous-review-dir> <output-report-dir> <bwl-root> <healernet-root>
import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join, extname, relative } from 'node:path';
import { spawn } from 'node:child_process';
import sharp from 'sharp';

const [catalogPath, previous, reportPath, bwl, hn] = process.argv.slice(2);
if (!hn) throw new Error('Five input paths required');
const roots = { bwl: resolve(bwl), hn: resolve(hn) };
const report = resolve(reportPath);
const out = resolve('public/reference-review');
await mkdir(out, {recursive:true});
await mkdir(report, {recursive:true});
const items = JSON.parse(await readFile(catalogPath, 'utf8'));
const manifest = [], prepared = {};
async function hash(path) {
  const h = createHash('sha256');
  for await (const chunk of createReadStream(path)) h.update(chunk);
  return h.digest('hex');
}
function source(item, path) {
  const full = resolve(roots[item.root], path);
  if (relative(roots[item.root], full).startsWith('..')) throw new Error('Source outside customer root');
  return full;
}
async function run(args) {
  await new Promise((ok, fail) => {
    const child = spawn('ffmpeg', ['-hide_banner','-loglevel','error','-nostdin', ...args], {windowsHide:true});
    let error = '';
    child.stderr.on('data', x => error += x);
    child.on('error', fail);
    child.on('exit', code => code === 0 ? ok() : fail(new Error(error)));
  });
}
async function image(item, file, name) {
  const target = join(out, item.id, name + '.webp');
  await sharp(file).rotate().resize({width:1600,height:2400,fit:'inside',withoutEnlargement:true}).webp({quality:86}).toFile(target);
  const info = await sharp(target).metadata();
  await record(item, file, target);
  return {src:`/reference-review/${item.id}/${name}.webp`,width:info.width,height:info.height};
}
async function record(item, original, derivative) {
  manifest.push({work:item.id,source:original,sourceBytes:(await stat(original)).size,sourceSha256:await hash(original),derivative:relative(resolve('.'), derivative).replaceAll('\\','/'),bytes:(await stat(derivative)).size,sha256:await hash(derivative),rights:'UNKNOWN/HOLD'});
}
async function video(item, file, name, presentation) {
  const target = join(out,item.id,name+'.mp4');
  await run(['-y','-i',file,'-map','0:v:0','-map','0:a?','-vf',"scale=w='min(1280,iw)':h='min(1280,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,fps=30",'-c:v','libx264','-preset','fast','-crf','25','-threads','2','-c:a','aac','-b:a','128k','-movflags','+faststart',target]);
  const poster = join(out,item.id,name+'-poster.jpg');
  await run(['-y','-ss',String(name==='hero' ? item.previewPosterSecond ?? 1.5 : 1.5),'-i',target,'-frames:v','1','-q:v','3',poster]);
  await record(item,file,target);
  const cover = await image(item,poster,name+'-poster');
  return {kind:'video',src:`/reference-review/${item.id}/${name}.mp4`,poster:cover.src,alt:`${item.brand} ${item.title}`,presentation};
}
for (const item of items) {
  await mkdir(join(out,item.id), {recursive:true});
  const media=[];
  if (item.video) media.push(await video(item,source(item,item.video),'hero',item.presentation));
  else if (item.cover || item.sourceHtml) {
    const file=item.cover ? source(item,item.cover) : join(previous,'yofree-shop-cover.png');
    const cover=await image(item,file,'hero');
    const mobile=item.mobileCover ? await image(item,source(item,item.mobileCover),'mobile') : null;
    media.push({kind:'image',...cover,alt:`${item.brand} ${item.title} PC 화면`,presentation:item.presentation,...(mobile ? {mobileSrc:mobile.src} : {})});
  }
  const gallery = (item.gallery ?? []).map(x=>source(item,x));
  if(item.galleryDir) {
    const dir=source(item,item.galleryDir);
    gallery.push(...(await readdir(dir)).filter(x=>/\.(png|jpe?g|webp)$/i.test(x)).sort((a,b)=>a.localeCompare(b,'ko',{numeric:true})).map(x=>join(dir,x)));
  }
  for(let i=0;i<gallery.length;i++) {
    const file=gallery[i], name=`gallery-${String(i+1).padStart(2,'0')}`;
    if(extname(file).toLowerCase()==='.mp4') media.push(await video(item,file,name,'portrait'));
    else media.push({kind:item.presentation==='webtoon'?'webtoon':'image',...await image(item,file,name),alt:`${item.brand} ${item.title} ${i+1}${item.presentation==='webtoon'?'페이지':'번째 이미지'}`,presentation:item.presentation});
  }
  prepared[item.id]=media;
  console.log(`${item.id}: ${media.length} media prepared`);
}
await writeFile('lib/prepared-work-media.ts', 'import type { WorkMedia } from "./work-catalog";\n\n// LOCAL REVIEW derivatives. Source evidence is in the project asset manifest.\nexport const preparedWorkMedia: Record<string, WorkMedia[]> = '+JSON.stringify(prepared,null,2)+';\n');
await writeFile(join(report,'ASSET_MANIFEST.json'),JSON.stringify(manifest,null,2));
console.log(JSON.stringify({works:items.length,derivatives:manifest.length,bytes:manifest.reduce((n,x)=>n+x.bytes,0)}));
