import fs from 'node:fs';
const spec=fs.readFileSync('C:/AIO-PC2/30-handoff/15_메인_리뉴얼/45_기획_서비스상세.MD','utf8');
const ids=['website','shopping-mall','automation','program'];
const result={};
for(let i=0;i<4;i++){
 const n=i+6, section=spec.split(`## ${n}. 개발`)[1].split(`## ${n+1}.`)[0];
 const faq=section.split('FAQ:')[1].split(`### ${n}.4`)[0].split('\n').filter(l=>l.startsWith('|')&&!l.includes('질문 |')&&!l.includes('---')).map(l=>l.split('|').slice(1,-1).map(v=>v.trim().replaceAll('↵','\n')));
 const table=section.split(`### ${n}.4`)[1].split(`### ${n}.5`)[0];
 const slots={};
 for(const line of table.split('\n').filter(l=>/^\| S/.test(l))){const cells=line.split('|').slice(1,-1).map(v=>v.trim()); const text=cells[2];const quotes=[...text.matchAll(/"([^"]+)"/g)].map(m=>m[1].replaceAll('↵','\n')); slots[cells[0]]={eyebrow:text.match(/`([^`]+)`/)?.[1]||'',title:quotes[0]||'',lead:quotes[1]||'',body:cells[3]};}
 const decision=section.split(`### ${n}.3`)[1].split('FAQ:')[0].split('\n').filter(l=>l.startsWith('|')).map(l=>l.split('|').slice(1,-1).map(v=>v.trim()));
 result[ids[i]]={slots,faq,decision};
}
fs.writeFileSync('lib/lab-renewal-content.json',JSON.stringify(result,null,2)+'\n');
