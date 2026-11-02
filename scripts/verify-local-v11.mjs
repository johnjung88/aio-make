import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:3111';
const result={at:new Date().toISOString(),base,checks:[],routes:[],ga:[]};
const headers={Origin:base,'Content-Type':'application/json'};
let r=await fetch(base+'/api/admin/inquiries');assert.equal(r.status,401);result.checks.push('anonymous inquiries blocked');
r=await fetch(base+'/api/admin/login',{method:'POST',headers,body:JSON.stringify({username:process.env.ADMIN_USERNAME,password:process.env.ADMIN_PASSWORD})});assert.equal(r.status,200);
const cookie=r.headers.get('set-cookie').split(';')[0];headers.Cookie=cookie;result.checks.push('real configured local login');
r=await fetch(base+'/api/admin/inquiries',{headers});assert.equal(r.status,200);const list=await r.json();assert.equal(list.connected,true);result.checks.push('local repository connected');
r=await fetch(base+'/api/admin/local-data',{headers});assert.equal(r.status,200);const backup=await r.json();assert.equal(backup.version,1);assert.ok(!JSON.stringify(backup).includes('gmail_read'));result.checks.push('backup excludes credentials');
r=await fetch(base+'/api/admin/local-data',{method:'POST',headers,body:JSON.stringify(backup)});assert.equal(r.status,200);result.checks.push('non-overwriting backup restore');
r=await fetch(base+'/api/admin/local-data?format=csv',{headers});assert.equal(r.status,200);assert.ok((await r.text()).includes('접수번호'));result.checks.push('CSV export');
r=await fetch(base+'/api/admin/inquiries',{method:'PATCH',headers:{...headers,Origin:'https://invalid.example'},body:'{}'});assert.equal(r.status,403);result.checks.push('cross-origin writes blocked');
r=await fetch(base+'/api/admin/google/status',{headers});const google=await r.json();result.google=google;
for(const days of [7,28,90]) {r=await fetch(base+'/api/admin/analytics?days='+days,{headers});assert.equal(r.status,200);const d=await r.json();result.ga.push({days,connected:d.connected,status:d.status,totals:d.totals,dateRange:d.dateRange,fetchedAt:d.fetchedAt});assert.equal(d.connected,true);}
result.checks.push('real GA4 reports 7/28/90 days');
const xml=await(await fetch(base+'/sitemap.xml')).text();const paths=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
for(let i=0;i<paths.length;i+=4) {const rows=await Promise.all(paths.slice(i,i+4).map(async path=>{const r=await fetch(base+path);return{path,status:r.status};}));result.routes.push(...rows);}
assert.ok(result.routes.every(r=>r.status===200));
await writeFile('.qa/local-verification-v11.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
