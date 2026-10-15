/* R7's deterministic render(t)/renderAsync(t) contract, with a bounded image cache.
 * Canvas is captured by the same Playwright screenshot and ffmpeg pipeline.
 * No video playback, wall clock, random numbers, sound, or network inputs.
 */
const ROOT_URL = new URL('../../../', document.currentScript.src);
const D=window.REEL,A=window.ASSETS,W=D.w,H=D.h;
const canvas=document.querySelector('canvas');canvas.width=W;canvas.height=H;
const c=canvas.getContext('2d',{alpha:false});
const cache=new Map();let needed=new Set(),drawn=[],audit=[];
const clamp=x=>Math.max(0,Math.min(1,x));
const seg=(t,a,b)=>clamp((t-a)/(b-a));
const eIO=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const eO=x=>1-Math.pow(1-clamp(x),3);
const lerp=(a,b,t)=>a+(b-a)*t;
function box(x,y,w,h,fill,r=0){c.fillStyle=fill;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();}
function line(x,y,x2,y2,color,width=2){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke();}
function text(s,x,y,size=56,color='#fff',weight=700,max=W-x-40,align='left',family='PretendardR8'){
 c.font=`${weight} ${size}px ${family}`;c.fillStyle=color;c.textAlign=align;c.textBaseline='top';
 const words=s.split(' ');let rows=[],row='';
 for(const word of words){const next=row?row+' '+word:word;if(c.measureText(next).width>max&&row){rows.push(row);row=word;}else row=next;}
 if(row)rows.push(row);
 rows.forEach((value,i)=>{const width=c.measureText(value).width,xx=align==='center'?x-width/2:x,yy=y+i*size*1.2;if(yy+size*1.15<0||yy>H)return;drawn.push(value);audit.push({text:value,x:xx,y:yy,w:width,h:size*1.15});c.fillText(value,x,yy);});
 return rows.length*size*1.2;
}
function url(id,t=0,mode='normal',length=1){
 const a=A[id];if(!a)return '';
 if(a.kind==='image')return new URL(a.url,ROOT_URL).href;
 const frame=mode==='fit'?Math.min(a.frames-1,Math.floor(clamp(t/length)*a.frames)):Math.min(a.frames-1,Math.max(0,Math.floor(t*30)));
 return new URL(a.url+String(frame+1).padStart(4,'0')+'.jpg',ROOT_URL).href;
}
function load(u){
 if(!u)return null;needed.add(u);
 if(!cache.has(u)){const img=new Image();const p=new Promise((res,rej)=>{img.onload=()=>res(img);img.onerror=()=>rej(new Error('Missing image '+u));});img.src=u;cache.set(u,{img,p});}
 return cache.get(u).img;
}
function picture(id,x,y,w,h,t=0,{fit='contain',zoom=1,alpha=1,mode='normal',length=1}={}){
 const img=load(url(id,t,mode,length));if(!img?.complete||!img.naturalWidth)return;
 c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.globalAlpha*=alpha;
 const scale=(fit==='cover'?Math.max(w/img.naturalWidth,h/img.naturalHeight):Math.min(w/img.naturalWidth,h/img.naturalHeight))*zoom;
 const iw=img.naturalWidth*scale,ih=img.naturalHeight*scale;
 const ox=x+(w-iw)/2,oy=y+(h-ih)/2;
 c.drawImage(img,ox,oy,iw,ih);
 if(D.id==='hero' && id==='s1'){
  // Keep the mascot's actual label; remove the separate customer-name caption.
  c.drawImage(img,710,215,100,45,ox+710*scale,oy+268*scale,100*scale,45*scale);
 }
 if(D.id==='hero' && id==='hero-mg6'){
  // The CASE heading is a caption, distinct from the permitted bottle label.
  c.save();c.translate(ox,oy);c.scale(scale,scale);box(60,160,570,370,'#101322',20);
  line(94,200,585,200,'#b9aeff',3);text('제품',94,222,96,'#fff',800,490);
  text('제품을 실제 병으로 완성',94,342,68,'#e6dcf7',600,490);c.restore();
 }
 c.restore();
}
function background(t){
 const g=c.createRadialGradient(W*(.45+.05*Math.sin(t*.18)),H*.36,0,W*.5,H*.5,W*.9);g.addColorStop(0,'#24153c');g.addColorStop(.45,'#0f0b1d');g.addColorStop(1,'#05050a');box(0,0,W,H,g);
 c.save();c.globalAlpha=.12;const step=W/12;
 for(let i=-2;i<16;i++){const x=i*step+(t*8)%step;line(x,0,x-W*.12,H,'#b9aeff',1);}
 for(let y=0;y<H;y+=step)line(0,y,W,y,'#b9aeff',1);c.restore();
}
function chip(s,x,y,size=36){c.font=`700 ${size}px PretendardR8`;const w=c.measureText(s).width+36;box(x,y,w,size+26,'#181127',14);text(s,x+18,y+10,size,'#e9ddff',700,w-30);}
function visual(item,t,x,y,w,h){
 const k=item.kind,id=item.src,p=clamp(t/(item.length||2));
 box(x,y,w,h,'#100e1c');
 if(k==='image'||k==='clip'||k==='edit'){
  picture(id,x,y,w,h,t,{fit:'contain',zoom:k==='image'?1+.045*p:1,mode:'fit',length:item.length||2});
  if(k==='edit')for(let j=0;j<48;j++){const v=(Math.sin(j*2.3+t*7)+1)*.5;box(x+j*w/48,y+h*.86-v*h*.05,w/90,10+v*h*.1,'#b9aeff');}
 }else if(k==='identity'){
  picture(p<.45?'face':'body',x,y,w,h,t,{zoom:1+.025*p});
 }else if(k==='grid'||k==='aiboard'){
  const prefix=k==='aiboard'?'aicut':id, count=prefix==='face'?20:prefix==='adimg'?9:prefix==='aicut'?6:12;
  const cols=prefix==='face'?5:prefix==='adimg'||prefix==='aicut'?3:4,rows=Math.ceil(count/cols),gap=12;
  for(let n=0;n<count;n++){const entrance=eO((p*1.4-n/count)*6);if(!entrance)continue;const cw=(w-gap*(cols-1))/cols,ch=(h-gap*(rows-1))/rows;
   c.save();c.globalAlpha=entrance;const xx=x+(n%cols)*(cw+gap),yy=y+Math.floor(n/cols)*(ch+gap)+(1-entrance)*30;picture(prefix+(n+1),xx,yy,cw,ch,t,{fit:'cover',zoom:1+.025*Math.sin(t+n)});c.restore();
  }
 }else if(k==='scroll'){
  const hh=h*.82;const offset=p*hh*2.8;
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  for(let n=0;n<4;n++)picture('wt'+(n+2),x,y+n*(hh+18)-offset,w,hh,t,{fit:'contain'});c.restore();
 }else if(k==='script'){
  box(x,y,w,h,'#f4eee2');for(let j=0;j<10;j++)line(x+35,y+50+j*h/10,x+w-35,y+50+j*h/10,'#d5c9b4',1);
  const size=Math.min(w/11,58);text('장면 3',x+45,y+70,size,'#8c2b23',800,w-90);
  text('오랜만에 끝까지 본 경기',x+45,y+170,size,'#1c1a17',800,w-90);
  if(p>.15)text('처음부터 축구단을 만들 생각은 아니었다',x+45,y+h*.5,size*.8,'#1c1a17',600,w-90);
  box(x+45,y+h*.83,w*.72*eO(p),5,'#8c2b23');
 }else if(k==='poses'){
  box(x,y,w,h,'#f4eee2');for(let j=0;j<4;j++){const bounce=Math.abs(Math.sin(t*4+j))*h*.025;picture('mascot'+(j+1),x+j*w/4,y+bounce,w/4,h*.92);}
 }else if(k==='palette'){
  ['#8c2b23','#1c1a17','#f4eee2','#a8834b'].forEach((color,n)=>{const xx=x+n*w/4;box(xx+12,y+h*.12,w/4-24,h*.5,color,20);text(color.toUpperCase(),xx+20,y+h*.7,Math.min(w/25,42),'#fff',700,w/4-30);});
  line(x+30,y+h*.9,x+w-30,y+h*.9,'#a8834b',4);
 }else if(k==='beats'||k==='acts'||k==='wave'){
  if(k==='wave')picture(id,x,y,w,h,t,{alpha:.6});
  const count=k==='beats'?16:k==='acts'?12:32;
  for(let n=0;n<count;n++){const xx=x+30+n*(w-60)/count,v=k==='wave'?Math.sin(n*2+t*5)*.4+.5:.3+.6*((n*7)%11)/11;box(xx,y+h*.7-v*h*.35,(w-60)/count*.64,v*h*.35,'#b9aeff',3);}
  line(x+30+p*(w-60),y+30,x+30+p*(w-60),y+h-30,'#fff',4);
  text(k==='beats'?'129 BPM':k==='acts'?'12컷 · 25초':'작업·편집',x+35,y+30,Math.min(w/14,60),'#fff',800,w-70);
 }else if(k==='calendar'){
  const portrait=w/h<.8,cols=portrait?2:4,cw=w/cols,ch=h/(portrait?2:1);
  for(let n=0;n<4;n++){const xx=x+n%cols*cw,yy=y+Math.floor(n/cols)*ch;
   box(xx+12,yy+12,cw-24,ch-24,'#211831',20);text('DAY '+(n+1),xx+30,yy+45,Math.min(cw/6,48),'#b9aeff',700,cw-60);
   if(p>n/5){chip('예정',xx+30,yy+ch*.46,Math.min(cw/8,40));text('20:00',xx+30,yy+ch*.72,Math.min(cw/6,52),'#fff',600,cw-50);}
  }
 }else if(k==='profile'){
  const size=Math.min(w*.43,h*.42);c.save();c.beginPath();c.arc(x+w/2,y+h*.32,size/2,0,Math.PI*2);c.clip();picture('profile',x+(w-size)/2,y+h*.32-size/2,size,size);c.restore();
  const nsize=Math.min(w/7,h/7);for(let n=0;n<5;n++)picture('highlight'+(n+1),x+w*.05+n*w*.18,y+h*.62,nsize,nsize,0,{fit:'cover'});
  text('운영 계획 예시',x+w/2,y+h*.84,Math.min(w/14,48),'#ded3f1',700,w*.9,'center');
 }
}
function lockup(t,alpha=1){
 c.save();c.globalAlpha=alpha;const wide=W>H;
 text('AIO MAKE',W/2,H*(wide?.31:.38),wide?112:82,'#fff',800,W*.86,'center','UnboundedR8');
 text('CONTENT STUDIO',W/2,H*(wide?.46:.48),wide?48:37,'#b9aeff',700,W*.86,'center','UnboundedR8');
 text('웹툰부터 SNS 광고 영상까지',W/2,H*(wide?.62:.59),wide?56:36,'#f4edff',600,W*.86,'center');
 const ww=W*.52*eO(seg(t,0,1));box((W-ww)/2,H*.75,ww,3,'#b9aeff');c.restore();
}
function opening(t,opacity=1){
 c.save();c.globalAlpha=opacity;
 const ids=['wt1','s1','face','mg1','logo','ad1'],gap=28,cw=490,ch=276,ox=197,oy=210;
 ids.forEach((id,n)=>{const reveal=.25+.75*eO(seg(t,n*.18,n*.18+.7));const xx=ox+n%3*(cw+gap),yy=oy+Math.floor(n/3)*(ch+gap);
  c.save();c.globalAlpha*=reveal;box(xx,yy,cw,ch,'#21172f',16);picture(id,xx,yy,cw,ch,t,{fit:'cover',zoom:1+.03*Math.sin(t+n)});c.restore();});
 chip('AI 가상인물',1470,110,36);
 if(t>1){const a=eO(seg(t,1,2));c.globalAlpha*=a;box(120,760,1680,240,'#080610dd',20);text('브랜드에 필요한 컨텐츠를',960,780,104,'#fff',800,1680,'center');text('한 팀이 기획하고 만듭니다',960,915,64,'#e1d5f7',600,1680,'center');}
 c.restore();
}
function hero(t){
 if(t<4){opening(t);return;}
 if(t>=64){const fade=1-seg(t,66,68);lockup(t-64,fade);if(t>66)opening(0,1-fade);return;}
 const n=Math.min(5,Math.floor((t-4)/10)),s=D.scenes[n],local=t-4-n*10,k=Math.min(4,Math.floor(local/2)),u=local-k*2;
 text(String(n+1).padStart(2,'0')+' / 06',110,42,36,'#cfc0ec',600,500,'left','UnboundedR8');
 for(let j=0;j<6;j++)box(770+j*166,58,140,5,j<=n?'#b9aeff':'#37283f');
 if(n===2||n===5)chip('AI 가상인물',1470,95,36);else if(n===1||n===4)chip('연출 예시',1515,95,36);
 const titleHeight=text(s.title,110,170,80,'#fff',800,540);
 text(s.sub,110,190+titleHeight,56,'#d9cfeb',600,530);
 s.panels.forEach((panel,j)=>{text(String(j+1).padStart(2,'0')+' '+panel.label,110,600+j*82,64,j===k?'#c8b8ff':'#6e637f',j===k?800:600,550);});
 const advance=eIO(seg(u,1.6,2)),camera=k+advance;
 c.save();c.beginPath();c.rect(680,130,1130,690);c.clip();
 for(let j=Math.max(0,k-1);j<=Math.min(4,k+1);j++){
  const distance=j-camera,active=1-Math.min(1,Math.abs(distance));
  const expand=j===4?eIO(seg(u,.5,1.2)):0;
  const x=lerp(s.layout==='L2'?955+distance*500:700,680,expand),y=s.layout==='L2'?170:170+distance*786;
  const w=lerp(s.layout==='L2'?450:1066,1100,expand),h=s.layout==='L2'?650:600;
  c.save();c.globalAlpha=.35+.65*active;
  c.shadowColor='#8b5cf6';c.shadowBlur=active*32;
  box(x-3,y-3,w+6,h+6,active>.8?'#a996dd':'#3b304c',12);c.shadowBlur=0;
  visual({...s.panels[j],length:2},j===k?u:0,x,y,w,h);c.restore();
 }
 c.restore();
 // A solid caption band isolates the active label from adjacent scrolling panels.
 box(680,820,1130,235,'#0c0815',14);
 text(String(k+1).padStart(2,'0')+' '+s.panels[k].label,710,843,80,'#fff',800,1060);
 c.save();c.globalAlpha=eO(seg(u,.5,.85));text(s.panels[k].desc,710,950,56,'#ded1f5',600,1060);c.restore();
 if(n===2&&k===3)chip('예약 예시',1400,730,36);
 if(n===5&&k===2)chip('초안',1535,730,36);
}
function service(t){
 const item=D.items.find(i=>t>=i.start&&t<i.end)||D.items.at(-1),local=t-item.start,length=item.end-item.start;
 if(item.kind==='lockup'){lockup(local);return;}
 const portrait=W<H;
 if(portrait){
  if(item.src&&A[item.src]){c.save();c.filter='blur(28px)';picture(item.src,-35,-35,W+70,H+70,local,{fit:'cover',alpha:.3,mode:'fit',length});c.restore();box(0,0,W,H,'#09061055');}
  const tallSource=D.id==='ai-influencer'||D.id==='webtoon'||/^(sv|mgv)/.test(item.src);
  const diagram=item.kind==='calendar'||item.kind==='profile';
  const mediaY=diagram?180:H===1080?35:tallSource?90:180,mediaH=diagram?640:H===1080?850:tallSource?1000:670;
  c.save();c.translate(W/2,H/2);c.rotate(Math.sin(t*.5)*.008);c.translate(-W/2,-H/2);
  visual({...item,length},local,36,mediaY,W-72,mediaH);c.restore();
  const y=H===1080?790:860;
  const g=c.createLinearGradient(0,y-60,0,y+160);g.addColorStop(0,'#08061000');g.addColorStop(.35,'#080610ed');g.addColorStop(1,'#080610');box(0,y-60,W,H-y+60,g);
  text(item.big,48,y,60,'#fff',800,W-96);
  text(item.small,48,y+82,38,'#dfd3f2',600,W-96);
  chip(D.id==='ai-influencer'?'AI 가상인물':'연출 예시',40,H===1080?30:180,30);
 }else{
  visual({...item,length},local,0,0,W,H);
  const g=c.createLinearGradient(0,H*.5,0,H);g.addColorStop(0,'#07050c00');g.addColorStop(1,'#07050cf5');box(0,H*.5,W,H*.5,g);
  text(item.big,70,H-205,68,'#fff',800,W-140);
  text(item.small,70,H-110,42,'#e6dcf7',600,W-140);
  chip('연출 예시',W-230,35,28);
 }
 const progress=clamp(t/D.duration);box(0,H-5,W*progress,5,'#b9aeff');
}
function render(t){needed=new Set();drawn=[];audit=[];background(t);D.id==='hero'?hero(t):service(t);}
window.render=render;
window.renderAsync=async t=>{
 render(t);await Promise.all([...needed].map(u=>cache.get(u).p));render(t);
 for(const [u] of cache)if(!needed.has(u))cache.delete(u);
 if(cache.size>40)throw new Error('Image cache exceeded 40');
};
window.layoutAudit=()=>({text:drawn,overflow:audit.filter(b=>b.x<0||b.y<0||b.x+b.w>W+1||b.y+b.h>H+1),maxImages:cache.size});
window.ready=(async()=>{
 for(const [name,path,weight] of [['PretendardR8','public/fonts/PretendardVariable.woff2','45 930'],['UnboundedR8','public/fonts/Unbounded-latin.woff2','200 900']]){
  const f=new FontFace(name,`url(${new URL(path,ROOT_URL).href})`,{weight});await f.load();document.fonts.add(f);
 }
 await document.fonts.ready;await window.renderAsync(0);return true;
})();
