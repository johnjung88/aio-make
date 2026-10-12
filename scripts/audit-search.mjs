import {writeFile, mkdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {lookup} from 'node:dns/promises';
const base=process.env.AIO_QA_BASE||'https://aio-make.com';
const output=resolve(process.argv[2]);
await mkdir(output,{recursive:true});
const headers={'User-Agent':'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'};
async function get(url,manual=false){try {const r=await fetch(url,{headers,redirect:manual?'manual':'follow',signal:AbortSignal.timeout(25000)});return {url,status:r.status,finalUrl:r.url,location:r.headers.get('location'),robotsHeader:r.headers.get('x-robots-tag'),type:r.headers.get('content-type'),body:await r.text()};}catch(e){return {url,error:e.message,cause:e.cause?.code};}}
const robots=await get(base+'/robots.txt'), sitemap=await get(base+'/sitemap.xml');
const urls=[...(sitemap.body||'').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1].replaceAll('&amp;','&'));
const rows=[];
const parseAttrs=t=>Object.fromEntries([...t.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
for(let i=0;i<urls.length;i+=4){await Promise.all(urls.slice(i,i+4).map(async url=>{
 const request=base+new URL(url).pathname+new URL(url).search;
 const r=await get(request), html=r.body||'';
 const meta=[...html.matchAll(/<meta\b[^>]*>/g)].map(m=>parseAttrs(m[0]));
 const links=[...html.matchAll(/<link\b[^>]*>/g)].map(m=>parseAttrs(m[0]));
 const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>{try{return JSON.parse(m[1]);}catch{return {error:'invalid JSON'};}});
 rows.push({url,status:r.status,error:r.error,title:html.match(/<title>(.*?)<\/title>/)?.[1],description:meta.find(m=>m.name==='description')?.content,canonical:links.find(l=>l.rel==='canonical')?.href,robots:meta.find(m=>m.name==='robots')?.content,robotsHeader:r.robotsHeader,h1:(html.match(/<h1[\s>]/g)||[]).length,schemaTypes:schemas.map(x=>x['@type']),schemaErrors:schemas.filter(x=>x.error).length,googleVerification:!!meta.find(m=>m.name==='google-site-verification'),naverVerification:!!meta.find(m=>m.name==='naver-site-verification')});
 }));}
const probes=[];
for(const path of ['/content','/video','/video/services/webtoon?source=check','/ko','/llms.txt','/does-not-exist-seo-check']){const {body,...r}=await get(base+path,true);probes.push(r);}
if(base==='https://aio-make.com'){for(const url of ['http://aio-make.com/','https://www.aio-make.com/']){const {body,...r}=await get(url,true);probes.push(r);}}
let dns;try{dns=await lookup('www.aio-make.com');}catch(e){dns={error:e.code};}
const duplicate=(key)=>Object.entries(Object.groupBy(rows,r=>r[key])).filter(([k,v])=>k!=='undefined'&&v.length>1).map(([value,items])=>({value,urls:items.map(r=>r.url)}));
const result={checkedAt:new Date().toISOString(),base,robots,sitemap:{...sitemap,body:undefined,urlCount:urls.length},rows,probes,wwwDns:dns,duplicateTitles:duplicate('title'),duplicateDescriptions:duplicate('description'),accountSubmission:'NOT_VERIFIED_BY_HTTP',indexing:'NOT_VERIFIED_BY_HTTP'};
await writeFile(join(output,'SEARCH_HTTP.json'),JSON.stringify(result,null,2));
await writeFile(join(output,'robots.txt'),robots.body||'');await writeFile(join(output,'sitemap.xml'),sitemap.body||'');
console.log(JSON.stringify({base,pages:rows.length,non200:rows.filter(r=>r.status!==200),badH1:rows.filter(r=>r.h1!==1).map(r=>r.url),noindex:rows.filter(r=>r.robots?.includes('noindex')).length,missingMetadata:rows.filter(r=>!r.title||!r.description||!r.canonical).map(r=>r.url),duplicateTitles:result.duplicateTitles,duplicateDescriptions:result.duplicateDescriptions,probes,wwwDns:dns,verification:rows[0]&&{google:rows[0].googleVerification,naver:rows[0].naverVerification}}));
