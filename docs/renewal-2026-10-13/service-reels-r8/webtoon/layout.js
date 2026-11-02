/* W2b composition for the two assigned reels. Shared renderer stays read-only. */
function lockupW2b(t) {
  text('AIO MAKE',W/2,H*.38,68,'#fff',800,W*.88,'center','UnboundedR8');
  text('CONTENT STUDIO',W/2,H*.49,32,'#b9aeff',700,W*.88,'center','UnboundedR8');
  text('웹툰부터 SNS 광고 영상까지',W/2,H*.60,36,'#f4edff',600,W*.88,'center');
  const ww=W*.52*eO(seg(t,0,.7));box((W-ww)/2,H*.75,ww,3,'#b9aeff');
}

function captionW2b(item) {
  const y=D.id==='webtoon'?790:870;
  const g=c.createLinearGradient(0,y-60,0,H);
  g.addColorStop(0,'#08061000');g.addColorStop(.30,'#080610f2');g.addColorStop(1,'#080610');
  box(0,y-60,W,H-y+60,g);
  // Portrait captions end before the platform's rightmost 12% control area.
  const max=D.id==='ai-influencer'?575:W-96;
  text(item.big,48,y,60,'#fff',800,max);
  text(item.small,48,y+84,38,'#dfd3f2',600,max);
}

function identityW2b(local,length) {
  const p=clamp(local/length),wipe=eIO(seg(p,.32,.68));
  picture('face',36,120,W-72,780,local,{fit:'contain',zoom:1+.035*p});
  c.save();c.beginPath();c.rect(36,120,(W-72)*wipe,780);c.clip();
  picture('body',36,120,W-72,780,local,{fit:'contain',zoom:1+.02*p});c.restore();
}

function gridW2b(item,local,length) {
  const ai=D.id==='ai-influencer',count=ai?20:12,cols=ai?5:4,rows=ai?4:3;
  const x=36,y=ai?260:62,w=W-72,h=ai?540:690,gap=10;
  const p=clamp(local/length),prefix=ai?'face':'wt';
  for(let n=0;n<count;n++) {
    const entrance=eO((p*1.7-n/count)*6);
    if(!entrance)continue;
    const cw=(w-gap*(cols-1))/cols,ch=(h-gap*(rows-1))/rows;
    const xx=x+n%cols*(cw+gap),yy=y+Math.floor(n/cols)*(ch+gap)+(1-entrance)*24;
    c.save();c.globalAlpha=entrance;
    picture(prefix+(n+1),xx,yy,cw,ch,local,{fit:'cover',zoom:1+.018*Math.sin(local+n)});
    c.restore();
  }
  if(ai) {
    // All twenty references fill first; one then comes forward on the final beat.
    const reveal=eIO(seg(p,.84,1));
    if(reveal>0) {
      const ww=lerp(122,260,reveal),hh=lerp(127,440,reveal);
      box((W-ww)/2-4,y+(h-hh)/2-4,ww+8,hh+8,'#b9aeff',8);
      picture('face7',(W-ww)/2,y+(h-hh)/2,ww,hh,local,{fit:'cover'});
    }
  }
}

function calendarW2b(local,length) {
  const p=clamp(local/length),w=(W-72)/2,h=265;
  for(let n=0;n<4;n++) {
    const x=36+n%2*w,y=260+Math.floor(n/2)*(h+10);
    box(x+8,y,w-16,h,'#211831',20);
    text('DAY '+(n+1),x+28,y+26,40,'#b9aeff',700,w-56);
    if(p>n/5) {
      chip('예정',x+28,y+104,32);
      text('20:00',x+28,y+184,44,'#fff',600,w-56);
    }
  }
  text('운영 계획 예시',W/2,812,30,'#ded3f1',700,W-96,'center');
}

service=function(t) {
  const item=D.items.find(i=>t>=i.start&&t<i.end)||D.items.at(-1);
  const local=t-item.start,length=item.end-item.start;
  if(item.kind==='lockup')lockupW2b(local);
  else {
    if(item.src&&A[item.src]) {
      c.save();c.filter='blur(28px)';
      picture(item.src,-35,-35,W+70,H+70,local,{fit:'cover',alpha:.25,mode:'fit',length});
      c.restore();box(0,0,W,H,'#09061077');
    }
    if(item.kind==='identity')identityW2b(local,length);
    else if(item.kind==='grid')gridW2b(item,local,length);
    else if(item.kind==='calendar')calendarW2b(local,length);
    else if(item.kind==='profile')visual({...item,length},local,36,235,W-72,580);
    else {
      const ai=D.id==='ai-influencer',mediaY=ai?90:35,mediaH=ai?1000:850;
      c.save();c.translate(W/2,H/2);c.rotate(Math.sin(t*.5)*.006);c.translate(-W/2,-H/2);
      visual({...item,length},local,36,mediaY,W-72,mediaH);c.restore();
    }
    captionW2b(item);
  }
  // AI disclosure persists through every cut and the end lockup.
  chip(D.id==='ai-influencer'?'AI 가상인물':'연출 예시',40,D.id==='ai-influencer'?180:30,30);
  box(0,H-5,W*clamp(t/D.duration),5,'#b9aeff');
  const remaining=D.duration-t;
  if(remaining<.35) {
    box(0,0,W,H,`rgba(7,6,13,${1-clamp(remaining/.35)})`);
    if(D.id==='ai-influencer')chip('AI 가상인물',40,180,30);
  }
};
