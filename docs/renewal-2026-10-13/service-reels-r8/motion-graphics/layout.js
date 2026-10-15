/* W2c render-only composition. Shared R8/R7 renderer and original assets stay read-only. */
const originalLockupW2c = lockup;
lockup = function(t, alpha = 1) {
  originalLockupW2c(t, alpha);
  const remaining = D.duration - (D.items.at(-1).start + t);
  if (remaining < .5) box(0, 0, W, H, `rgba(7,6,13,${1-clamp(remaining/.5)})`);
};

function captionW2c(item, portrait) {
  const y = portrait ? 870 : 492;
  const g = c.createLinearGradient(0, y - 110, 0, H);
  g.addColorStop(0, '#08061000');
  g.addColorStop(.46, '#080610db');
  g.addColorStop(1, '#080610fa');
  box(0, y - 110, W, H-y+110, g);
  if(D.id==='brand-film' && /^photo/.test(item.src)) box(0,480,W,H-480,'#080610');
  text(item.big, portrait ? 48 : 64, y, portrait ? 60 : 76, '#fff', 800, portrait ? 575 : W-128);
  text(item.small, portrait ? 48 : 64, y + (portrait ? 86 : 100), portrait ? 38 : 52, '#e6dcf7', 600, portrait ? 575 : W-128);
}

function stampW2c(item) {
  // This source's customer-name title and CTA are outside its actual product label.
  // Replace those two lines; retain packaging and the original AI disclosure pixels.
  box(640, 374, 620, 206, '#e9e2d2', 16);
  line(670, 390, 1198, 390, '#a8834b', 2);
  text(item.big, 670, 410, 70, '#211b19', 800, 530);
  text(item.small, 670, 502, 50, '#40352e', 600, 530);
}

service = function(t) {
  const item = D.items.find(i=>t>=i.start && t<i.end) || D.items.at(-1);
  const local=t-item.start, length=item.end-item.start;
  if(item.kind==='lockup') { lockup(local); return; }
  const portrait=W<H;
  if(portrait) {
    const tall = /^(sv|mgv)/.test(item.src);
    const ending = /^sv[34]$/.test(item.src);
    // Blur the footage behind its intact card; wide footage is never cropped to portrait.
    if(item.src && A[item.src] && !ending && item.src!=='mgv2' && !/^sv[12]$/.test(item.src)) {
      c.save(); c.filter='blur(28px)';
      picture(item.src,-35,-35,W+70,H+70,local,{fit:'cover',alpha:.22,mode:'fit',length});
      c.restore(); box(0,0,W,H,'#09061088');
    }
    const mediaY=tall?90:180, mediaH=tall?1000:670;
    if(item.src==='mgv2') {
      // Keep the whole bottle and remove the customer-name title above it by framing.
      const img=load(url(item.src,local,'fit',length));
      if(img?.complete && img.naturalWidth) c.drawImage(img,0,400,720,800,36,140,648,720);
    } else {
      // Keep the typography hook before the next source scene begins shrinking its headline.
      const hookTime=local/length*1.7;
      if(item.src==='sv1') picture(item.src,36,mediaY,W-72,mediaH,hookTime,{fit:'contain'});
      else visual({...item,length},local,36,mediaY,W-72,mediaH);
      if(/^sv[12]$/.test(item.src)) {
        const scale=1000/1280, x=(W-720*scale)/2;
        const img=load(item.src==='sv1'?url(item.src,hookTime):url(item.src,local,'fit',length));
        if(img?.complete && img.naturalWidth) {
          // Reuse a clean patch of this frame's own paper texture, without a visible cover box.
          if(item.src==='sv1') c.drawImage(img,50,240,630,64,x+50*scale,90+350*scale,630*scale,64*scale);
          else c.drawImage(img,52,1070,180,62,x+52*scale,90+320*scale,180*scale,62*scale);
        }
      }
    }
    if(ending) {
      // Native portrait source is 720x1280, contained in the 648x1000 card.
      const scale=1000/1280, x=(W-720*scale)/2;
      box(x+40*scale,90+847*scale,640*scale,149*scale,'#e9e2d2',12);
      text(item.big,x+52*scale,90+855*scale,60*scale,'#211b19',800,610*scale);
      text(item.small,x+52*scale,90+938*scale,38*scale,'#40352e',600,610*scale);
    } else captionW2c(item,true);
    // AI human scenes keep the disclosure throughout their complete shot.
    chip(/^ad[123]$/.test(item.src)?'AI 가상인물':'연출 예시',40,180,30);
  } else {
    if(D.id==='brand-film' && /^mountain/.test(item.src)) {
      // The only available robot footage is 854x480; keep its native size in a wide window.
      visual({...item,length},local,213,28,854,480);
    } else visual({...item,length},local,0,0,W,H);
    if(item.src==='mg6') {
      // Hide the source CASE/customer-name caption, retaining the actual bottle.
      box(62,170,560,290,'#101322',20);
      line(94,205,585,205,'#b9aeff',3);
      text(item.big,94,242,76,'#fff',800,490);
      text(item.small,94,350,52,'#e6dcf7',600,490);
    } else if(item.src==='s3' || (item.src==='s2' && local/length*6 >= .6)) {
      stampW2c(item);
    } else captionW2c(item,false);
    // Left placement leaves the source's top-right "사진 Magirus 공식" intact.
    chip(item.src==='s2'?'AI 가상인물':'연출 예시',40,32,28);
  }
  box(0,H-5,W*clamp(t/D.duration),5,'#b9aeff');
  if(D.id==='brand-film' && t>D.duration-.5) box(0,0,W,H,`rgba(7,6,13,${(t-D.duration+.5)/.5})`);
};
