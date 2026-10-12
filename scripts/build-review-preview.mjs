// Local-only reviewer. Reads original customer files in place and writes no media to public/.
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { join, extname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const [catalogFile, outputDir, bwlRoot, hnRoot] = process.argv.slice(2);
if (!catalogFile || !outputDir || !bwlRoot || !hnRoot) {
  throw new Error("usage: node scripts/build-review-preview.mjs <catalog.json> <output> <bwl-root> <hn-root>");
}
const roots = { bwl: resolve(bwlRoot), hn: resolve(hnRoot) };
const items = JSON.parse(await readFile(catalogFile, "utf8"));
const featured = ["bwl-brand-motion", "yofree-outing-webtoon", "bwl-store", "healernet-website"];
items.sort((a, b) => {
  const aIndex = featured.indexOf(a.id), bIndex = featured.indexOf(b.id);
  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
  if (aIndex !== -1) return -1;
  if (bIndex !== -1) return 1;
  return 0;
});
const destination = resolve(outputDir);
await mkdir(join(destination, "posters"), { recursive: true });
const manifest = [];
const seen = new Set();
const allVideos = new Set();
const css = await readFile(new URL("../components/work-portfolio.css", import.meta.url), "utf8");
const unboundedFont = pathToFileURL(fileURLToPath(new URL("../public/fonts/Unbounded.ttf", import.meta.url))).href;
const pretendardFont = pathToFileURL(fileURLToPath(new URL("../public/fonts/PretendardVariable.woff2", import.meta.url))).href;

function original(item, relative) {
  const root = roots[item.root];
  if (!root || !relative || relative.includes("..")) throw new Error(`invalid original path: ${item.id} / ${relative}`);
  const full = resolve(root, relative);
  if (!full.startsWith(root + "\\")) throw new Error(`outside root: ${full}`);
  return full;
}
async function sha256(file) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest("hex");
}
async function addSource(item, kind, file) {
  const key = `${item.id}:${file}`;
  if (seen.has(key)) return;
  seen.add(key);
  const info = await stat(file);
  if (!info.isFile()) throw new Error(`not file: ${file}`);
  manifest.push({
    workId: item.id, kind, sourcePath: file, bytes: info.size,
    sha256: await sha256(file), productionStatus: item.status,
    aioPublicationRights: "UNKNOWN/HOLD",
  });
  if (extname(file).toLowerCase() === ".mp4") allVideos.add(file);
}
function mediaUrl(file) { return pathToFileURL(file).href; }
for (const item of items) {
  item.files = [];
  for (const key of ["cover", "mobileCover", "video", "sourceHtml"]) {
    if (!item[key]) continue;
    const file = original(item, item[key]);
    await addSource(item, key, file);
    if (key !== "sourceHtml") item.files.push(file);
  }
  for (const relative of item.gallery ?? []) {
    const file = original(item, relative);
    await addSource(item, "gallery", file);
    item.files.push(file);
  }
  if (item.galleryDir) {
    const folder = original(item, item.galleryDir);
    const names = (await readdir(folder)).filter((name) => /\.(png|jpe?g|webp)$/i.test(name))
      .sort((a, b) => a.localeCompare(b, "ko", { numeric: true }));
    if (!names.length) throw new Error(`empty gallery: ${folder}`);
    for (const name of names) {
      const file = join(folder, name);
      await addSource(item, "ordered-gallery", file);
      item.files.push(file);
    }
  }
}
const posterByVideo = {};
for (const video of allVideos) {
  const name = createHash("sha256").update(video).digest("hex").slice(0, 16) + ".jpg";
  const poster = join(destination, "posters", name);
  const result = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-ss", "1.5", "-i", video, "-frames:v", "1", "-q:v", "3", poster], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`poster failed: ${video}\n${result.stderr}`);
  posterByVideo[video] = mediaUrl(poster);
}
for (const item of items) {
  const cover = item.cover ? original(item, item.cover) : item.files.find((file) => /\.(png|jpe?g|webp)$/i.test(file));
  const video = item.video ? original(item, item.video) : null;
  let selectedPoster = null;
  if (video && item.previewPosterSecond) {
    selectedPoster = join(destination, "posters", `${item.id}-selected.jpg`);
    const result = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-ss", String(item.previewPosterSecond), "-i", video, "-frames:v", "1", "-q:v", "2", selectedPoster], { encoding: "utf8" });
    if (result.status !== 0) throw new Error(`selected poster failed: ${video}\n${result.stderr}`);
  }
  item.coverUrl = selectedPoster ? mediaUrl(selectedPoster) : cover ? mediaUrl(cover) : video ? posterByVideo[video] : item.sourceHtml ? mediaUrl(join(destination, "yofree-shop-cover.png")) : null;
  item.mobileCoverUrl = item.mobileCover ? mediaUrl(original(item, item.mobileCover)) : null;
  item.videoUrl = video ? mediaUrl(video) : null;
  item.galleryUrls = item.files
    .filter((file) => (item.presentation === "webtoon" || file !== cover) && file !== video)
    .map((file) => ({ src: mediaUrl(file), video: extname(file).toLowerCase() === ".mp4", poster: posterByVideo[file] ?? null }));
  item.sourceUrl = item.sourceHtml ? mediaUrl(original(item, item.sourceHtml)) : null;
}
const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
await writeFile(join(destination, "REVIEW_ASSETS_v02.csv"), [
  Object.keys(manifest[0]).join(","),
  ...manifest.map((row) => Object.values(row).map(csvCell).join(",")),
].join("\r\n") + "\r\n", "utf8");
const data = JSON.stringify(items.map(({ files, ...rest }) => rest)).replaceAll("<", "\\u003c");
const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>AIO MAKE · 레퍼런스 로컬 검토 시안 v02</title>
<style>@font-face{font-family:Unbounded;src:url("${unboundedFont}") format("truetype");font-weight:200 900}
@font-face{font-family:Pretendard;src:url("${pretendardFont}") format("woff2");font-weight:45 920}
body{--font-body:Pretendard;margin:0;font-family:Pretendard,Arial,sans-serif;background:#f4f3ef;color:#0d0d12}
header{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:22px 40px;border-bottom:1px solid #0d0d12}
header .logo{font-family:Unbounded,sans-serif;font-size:20px;font-weight:800;letter-spacing:-.08em}
header .logo em{display:inline-block;width:9px;height:9px;margin-left:3px;background:#6b4dff}
header .label{font-size:11px;font-weight:700;letter-spacing:.08em}
.review-banner{padding:11px 40px;background:#6b4dff;color:#fff;font-size:12px;font-weight:700}
.review-content{width:min(calc(100% - 80px),1360px);margin:auto}
.review-guide{display:flex;justify-content:space-between;gap:20px;border-top:1px solid #d4d2ce;padding:28px 0 55px;font-size:12px;color:#55535b}
.review-guide strong{color:#0d0d12}
.review-detail-gallery{border-top:1px solid #0d0d12;padding:45px 0 90px}
.review-detail-gallery h2{font-size:38px;letter-spacing:-.05em}
.review-detail-gallery figure{max-width:900px;margin:0 auto 35px}
.review-detail-gallery figure.webtoon{max-width:720px}
.review-detail-gallery img,.review-detail-gallery video{display:block;width:100%;height:auto;object-fit:contain;background:#e8e5e0}
.review-detail-gallery figcaption{padding:9px 0;font-size:12px}
.review-hero-video{display:block;width:100%;max-height:75vh;object-fit:contain;background:#1c1923}
.review-source{display:inline-block;border:1px solid #0d0d12;border-radius:40px;padding:12px 19px;color:#0d0d12;text-decoration:none;font-size:13px;font-weight:700}
@media(max-width:767px){header{padding:17px 18px}.review-banner{padding:11px 18px}.review-content{width:min(calc(100% - 36px),560px)}.review-guide{display:block}.review-guide span{display:block;margin-top:10px}.review-detail-gallery h2{font-size:29px}}
${css}</style></head><body><header><div class="logo">AIO MAKE<em></em></div><div class="label">REFERENCE / LOCAL REVIEW</div></header>
<div class="review-banner">내부 검토 시안 · 고객 자료의 AIO 게재 권리 UNKNOWN/HOLD · 외부 공개 금지</div>
<main id="app"></main>
<script>const works=${data};const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const qs=(o)=>"?"+new URLSearchParams(o);
const params=new URLSearchParams(location.search),id=params.get("work"),service=params.get("service")||"",page=Math.max(1,Number(params.get("page")||1));
const services=[...new Set(works.map(w=>w.service))];
function media(w){return '<div class="work-card-media work-media-'+esc(w.presentation)+'">'+(w.presentation==="site"?'<span class="work-browser-bar" aria-hidden="true"><i></i><i></i><i></i></span>':'')+(w.coverUrl?'<picture class="work-card-picture">'+(w.mobileCoverUrl?'<source media="(max-width:767px)" srcset="'+esc(w.mobileCoverUrl)+'">':'')+'<img src="'+esc(w.coverUrl)+'" alt="'+esc(w.brand+' '+w.title+' 대표 장면')+'"></picture>':'<span class="work-card-placeholder">'+esc(w.brand)+'</span>')+(w.videoUrl?'<span class="work-card-play" aria-hidden="true">▶</span>':'')+'<span class="work-card-open" aria-hidden="true">↗</span></div>'}
function card(w){return '<a class="work-card" href="'+qs({work:w.id})+'">'+media(w)+'<div class="work-card-meta"><span>'+esc(w.service)+'</span><span>'+esc(w.status)+'</span></div><h2><span>'+esc(w.brand)+'</span><strong>'+esc(w.title)+'</strong></h2><p>'+esc(w.summary)+'</p></a>'}
function index(){const matches=works.filter(w=>!service||w.service===service),count=Math.ceil(matches.length/12),current=Math.min(page,count||1),shown=matches.slice((current-1)*12,current*12);return '<div class="work-page"><section class="work-index"><div class="work-index-heading"><span class="work-eyebrow">AIO MAKE / SELECTED WORK</span><h1>레퍼런스<span>.</span></h1><p>웹사이트부터 영상과 웹툰까지,<br>작업의 목적과 제작 범위를 살펴보세요</p></div><div class="work-index-toolbar"><nav class="work-filter-menu" aria-label="서비스 필터"><a href="?" '+(!service?'aria-current="page"':'')+'>전체</a>'+services.map(s=>'<a href="'+qs({service:s})+'" '+(s===service?'aria-current="page"':'')+'>'+esc(s)+'</a>').join('')+'</nav><span class="work-count">'+String(matches.length).padStart(2,"0")+' PROJECTS</span></div><div class="work-grid">'+shown.map(card).join('')+'</div><nav class="work-pagination" aria-label="페이지">'+Array.from({length:count},(_,n)=>'<a href="'+qs({service,page:n+1})+'" '+(n+1===current?'aria-current="page"':'')+'>'+(n+1)+'</a>').join('')+'</nav><div class="review-guide"><strong>실제 파일 연결 · 원본 위치 유지</strong><span>웹툰 페이지 순서 / 영상 재생 / 서비스 필터 / 페이지 링크를 확인할 수 있습니다</span></div></section></div>'}
function detail(w){const ordered=w.presentation==="webtoon";const hero=w.videoUrl?'<video class="review-hero-video" controls preload="none" poster="'+esc(w.coverUrl)+'" aria-label="'+esc(w.title)+'"><source src="'+esc(w.videoUrl)+'"></video>':w.coverUrl?'<figure class="work-detail-hero work-media-'+esc(w.presentation)+'"><picture class="work-detail-picture">'+(w.mobileCoverUrl?'<source media="(max-width:767px)" srcset="'+esc(w.mobileCoverUrl)+'">':'')+'<img src="'+esc(w.coverUrl)+'" alt="'+esc(w.title)+' 대표 장면"></picture></figure>':'';
const gallery=w.galleryUrls.map((m,n)=>'<figure class="'+(ordered?'webtoon':'')+'">'+(m.video?'<video controls preload="none" poster="'+esc(m.poster||'')+'"><source src="'+esc(m.src)+'"></video>':'<img loading="lazy" src="'+esc(m.src)+'" alt="'+esc(w.title+' '+(n+1)+'번째 장면')+'">')+'<figcaption>'+String(n+1).padStart(2,'0')+' / '+esc(w.title)+'</figcaption></figure>').join('');
return '<div class="work-page"><article class="work-detail"><a class="work-back" href="?">← 전체 작업</a><div class="work-detail-heading"><span class="work-eyebrow">'+esc(w.brand)+' / '+esc(w.service)+'</span><h1>'+esc(w.title)+'</h1><p>'+esc(w.summary)+'</p></div>'+hero+'<div class="work-detail-facts"><section><span>01 / 목적</span><h2>무엇을 만들었나요</h2><p>'+esc(w.summary)+'</p></section><section><span>02 / 제작 상태</span><h2>현재 어디까지인가요</h2><p>'+esc(w.status)+'</p><p>게재 권리 UNKNOWN/HOLD · 내부 검토용</p></section></div>'+(ordered?'<a class="work-read-link" href="#read-story">웹툰 1페이지부터 읽기 ↓</a>':'')+(w.sourceUrl?'<p><a class="review-source" href="'+esc(w.sourceUrl)+'">원본 시연 열기 ↗</a></p>':'')+(gallery?'<section id="read-story" class="review-detail-gallery"><h2>'+esc(ordered?'순서대로 읽기':'더 살펴보기')+'</h2>'+gallery+'</section>':'')+'<section class="work-related"><h2>관련 작업</h2><div class="work-grid">'+works.filter(x=>x.id!==w.id&&x.brand===w.brand).slice(0,2).map(card).join('')+'</div></section></article></div>'}
document.getElementById("app").innerHTML=id?(works.find(w=>w.id===id)?detail(works.find(w=>w.id===id)):'<p class="review-content">해당 작업이 없습니다. <a href="?">목록으로</a></p>'):index();</script></body></html>`;
await writeFile(join(destination, "대표시안_로컬검토_v02.html"), html, "utf8");
console.log(JSON.stringify({ works: items.length, sourceAssets: manifest.length, videos: allVideos.size, output: destination }));
