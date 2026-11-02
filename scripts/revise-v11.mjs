import {readFile,writeFile,readdir,mkdir} from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
const edit=async(p,fn)=>writeFile(p,fn(await readFile(p,"utf8")));
const gen="C:/Users/PC/.codex/generated_images/01a0fb70-5ecc-7e63-9e53-1bb621c7c39c/";
await mkdir("public/creative-v11",{recursive:true});
for(const [name,id] of [["planning","308ab238-a9c0-4e18-86ec-f437ee12bc3c"],["video","bf57fedc-891e-4b04-8305-21617028e70a"],["marketing","44b3f5a5-0d76-4597-a7de-78456ab4939d"],["development","4ddd5a3c-289d-433e-941e-981e674d78b6"]]){
 await sharp(gen+"exec-"+id+".png").resize({width:1200}).webp({quality:85}).toFile("public/creative-v11/"+name+".webp");
}
const originals="I:/AIO_OS/01_WORK/01_외국인지원/01_콘텐츠/01_볼앤테일/01_1억의_구단주/02_웹툰/01_현행승인/S01_EP01/01_최종이미지";
await mkdir("public/webtoon-v11",{recursive:true});
const images=(await readdir(originals)).filter(n=>n.endsWith(".png")&&!n.startsWith("02_")).sort();
if(images.length!==24)throw Error("Expected 24 samples");
const manifest=[];
for(let i=0;i<images.length;i++){const dest="public/webtoon-v11/cut-"+String(i+1).padStart(2,"0")+".webp";await sharp(path.join(originals,images[i])).resize({width:800,withoutEnlargement:true}).webp({quality:85}).toFile(dest);manifest.push({source:path.join(originals,images[i]),output:dest})}
await mkdir("docs/renewal/iteration-v11",{recursive:true});
await writeFile("docs/renewal/iteration-v11/samples.json",JSON.stringify(manifest,null,2));
await edit("app/(public)/layout.tsx",s=>s.replace('import "@"','import "@"').replace('import { Suspense }','import { FloatingContact } from "@/components/floating-contact";\nimport "@/components/guide/fixes.css";\nimport { Suspense }').replace('import "@/components/guide/fixes.css";\n','').replace('import "@/components/guide/creative.css";','import "@/components/guide/creative.css";\nimport "@/components/guide/fixes.css";').replace('<Footer />','<Footer />\n      <FloatingContact />'));
await edit("lib/metadata.ts",s=>s.replace(/"마케팅 대행, 웹사이트·업무 자동화 개발, 영상 제작[^"]*"/,'"영상 제작부터 마케팅, 개발까지 필요한 일을 함께 완성합니다"').replaceAll('-v09.png','-v11.png'));
await edit("app/(public)/page.tsx",s=>s.replaceAll("AIO MAKE · 마케팅 대행·웹 개발·영상 제작","AIO MAKE | 영상·마케팅·웹사이트 제작"));
await edit("components/guide/team.jsx",s=>s.replace(/<span\s+style=\{\{[^}]*\}\}\s*>\s*\{"작업 역할"\}\s*<\/span>/g,"").replaceAll("함께 만드는 네 가지 역할","기획부터 완성까지 함께합니다").replaceAll("PROJECT ROLES","OUR EXPERTISE"));
await edit("components/guide/service-motion.tsx",s=>s.replace(/\s*<span className="motion-disclosure">[\s\S]*?<\/span>/,""));
await edit("components/guide/home-references.tsx",s=>s.replace(/\s*<p className="reference-disclosure">[\s\S]*?<\/p>/,""));
await edit("components/entries.tsx",s=>s.replaceAll('${division === "marketing" ? "is-light" : "is-dark"}',"is-dark").replaceAll("제작 방향 예시와 공개 확인을 마친 고객 사례를 소개합니다.","서비스별 작업과 제작 방향을 살펴보세요").replaceAll("제작 방향 예시","서비스 미리보기"));
await edit("components/guide/service-overview.tsx",s=>s.replace('const items = divisionServices(division);','const items = divisionServices(division).filter(s => marketing || ["shopping-mall","website"].includes(s.id)).sort((a,b) => marketing ? 0 : (a.id === "shopping-mall" ? -1 : b.id === "shopping-mall" ? 1 : 0));').replace('service-overview service-dark','service-overview service-dark ${marketing ? "" : "lab-specialist"}').replace('필요한 범위를 정하고','사업에 맞는 웹사이트와').replace('실제로 쓰는 결과물을 만듭니다','쇼핑몰을 만듭니다').replace('홈페이지와 카페24 쇼핑몰부터 업무 자동화와 프로그램까지. 범위와 가격, 인계 방법을 먼저 맞춥니다.','브랜드를 소개하는 웹사이트부터 판매를 시작하는 쇼핑몰까지, 기획·디자인·제작을 함께합니다').replace('아이디어를 구현하는 네 가지 방법','웹사이트와 쇼핑몰, 두 가지 제작 서비스').replace('홈페이지·카페24는 아래 가격 기준으로, 자동화·프로그램은 요청별 범위를 확인해 견적을 안내합니다.','웹사이트와 카페24 쇼핑몰의 제작 범위와 가격을 살펴보세요').replace('      <HomeReferences', '      {!marketing && <div className="lab-secondary review-container"><span>추가 개발이 필요하다면</span><Link href="/lab/services/automation">업무 자동화 ↗</Link><Link href="/lab/services/program">프로그램 개발 ↗</Link></div>}\n      <HomeReferences').replace('      <section className="service-next', '      {!marketing && <section className="service-faq review-container"><span className="review-eyebrow">FAQ</span><h2>제작 전에 궁금한 점</h2>{[["기획서가 없어도 의뢰할 수 있나요?","원하는 사이트와 참고 자료만 알려주셔도 됩니다 필요한 페이지와 기능부터 함께 정리합니다"],["웹사이트와 쇼핑몰의 차이는 무엇인가요?","사업 소개와 상담이 목적이면 웹사이트, 상품 판매가 목적이면 쇼핑몰을 권합니다"],["비용과 기간은 어떻게 정하나요?","아래 공개 가격을 기준으로 페이지·기능·자료와 일정을 확인한 뒤 견적을 안내합니다"],["완성 후 수정과 관리는 어떻게 하나요?","수정과 유지보수의 범위, 운영 비용과 인계 방법은 견적 단계에서 함께 정합니다"]].map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>}\n      <section className="service-next'));
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())await walk(p);else if(/\.(tsx?|jsx?)$/.test(p))await edit(p,s=>s.replace(/([가-힣])\.(?=\s|["'`<\\]|$)/g,"$1").replaceAll("AIO-MAKE. All rights reserved.","AIO MAKE · All rights reserved"));}}
for(const dir of ["app","components","lib"])await walk(dir);
console.log("v11 content and images prepared");
