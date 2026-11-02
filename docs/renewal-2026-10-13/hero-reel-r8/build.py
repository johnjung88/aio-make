"""R7 HTML -> Playwright JPEG frames -> H.264/AAC, one browser/reel at a time.

python build.py hero prepare      # all read-only inputs, normalized small images
python build.py <id> shots        # layout previews before rendering
python build.py <id> render       # restart owned Chrome after each 600 frames
python build.py <id> encode       # muted picture, 2-pass normalized selected music
python build.py <id> verify       # ffprobe + final loudnorm + >=5 extracted frames
Service folders also have build.py wrappers with the same commands.
"""
from pathlib import Path
import hashlib, json, math, subprocess, sys, time
from sources import ROOT, QA, SOURCES, TRACKS
from timeline import config

HERE=Path(__file__).resolve().parent
def sha(path): return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def run(args, **kwargs):
    return subprocess.run([str(a) for a in args], check=True, **kwargs)
def output(id):
    return ROOT/('public/content-home/hero-reel-r8.mp4' if id=='hero' else f'public/content-examples/{id}/service-reel-r8.mp4')
def poster(id):
    return output(id).with_name('hero-reel-r8.webp' if id=='hero' else 'service-reel-r8-poster.webp')
def folder(id):
    return HERE if id=='hero' else HERE.parent/'service-reels-r8'/id
def write_config(id):
    data=config(id)
    folder(id).mkdir(parents=True, exist_ok=True)
    (folder(id)/'config.js').write_text('window.REEL='+json.dumps(data,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
    return data

def prepare():
    from music import analyze
    if not (QA/'music-analysis.json').exists(): analyze()
    catalog={}; hashes={}
    for id, spec in SOURCES.items():
        path=Path(spec['source'])
        if path not in hashes: hashes[path]=sha(path)
        target=QA/'assets'/id
        target.mkdir(parents=True,exist_ok=True)
        if spec['kind']=='image':
            dest=target/'image.webp'
            if not dest.exists(): run(['ffmpeg','-v','error','-y','-threads','1','-i',path,'-frames:v','1','-vf',f"scale='min({spec['width']},iw)':-2",'-c:v','libwebp','-quality','88','-threads','1',dest])
            catalog[id]=dict(url=dest.relative_to(ROOT).as_posix(),**spec,sourceSha256=hashes[path],sha256=sha(dest))
        else:
            total=round(spec['duration']*30)
            if len(list(target.glob('f_*.jpg')))<total:
                run(['ffmpeg','-v','error','-y','-threads','1','-ss',spec['start'],'-i',path,'-t',spec['duration'],'-an','-vf',f"fps=30,scale='min({spec['width']},iw)':-2",'-q:v','3','-threads','1',target/'f_%04d.jpg'])
            frames=len(list(target.glob('f_*.jpg')))
            assert frames>0,id
            catalog[id]=dict(url=(target/'f_').relative_to(ROOT).as_posix(),frames=frames,**spec,sourceSha256=hashes[path])
        print('prepared',id,flush=True)
    assert all(sha(p)==s for p,s in hashes.items()),'original changed'
    (QA/'source-manifest.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2),encoding='utf-8')
    (HERE/'assets.js').write_text('window.ASSETS='+json.dumps(catalog,ensure_ascii=False)+';\n',encoding='utf-8')
    for id in TRACKS: write_config(id)

def open_page(p,id):
    d=config(id)
    browser=p.chromium.launch(channel='chrome',headless=True,args=['--allow-file-access-from-files','--force-color-profile=srgb','--hide-scrollbars','--disable-lcd-text','--disable-dev-shm-usage'])
    page=browser.new_page(viewport=dict(width=d['w'],height=d['h']),device_scale_factor=1)
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto((folder(id)/'index.html').as_uri())
    page.evaluate('window.ready')
    return browser,page,errors

def shots(id):
    from playwright.sync_api import sync_playwright
    d=write_config(id); dest=QA/'previews'/id;dest.mkdir(parents=True,exist_ok=True)
    times=[1,5,13,23,33,43,53,63,65,67] if id=='hero' else [1,5,10,15,20,25,28]
    checks=[]
    with sync_playwright() as p:
        b,page,errors=open_page(p,id)
        try:
            for t in times:
                page.evaluate('(t)=>window.renderAsync(t)',min(t,d['duration']-.1))
                page.screenshot(path=str(dest/f'{t:05.1f}.png'))
                checks.append(dict(t=t,layout=page.evaluate('window.layoutAudit()')))
        finally:b.close()
    result=dict(checks=checks,errors=errors)
    (dest/'layout.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    assert not errors,errors
    assert not any(x['layout']['overflow'] for x in checks),result

def render(id,start=0,end=None):
    from playwright.sync_api import sync_playwright
    d=write_config(id); total=round(d['duration']*30); end=min(end or total,total)
    dest=QA/'render'/id;dest.mkdir(parents=True,exist_ok=True);t0=time.time()
    for a in range(start,end,600):
        with sync_playwright() as p:
            b,page,errors=open_page(p,id)
            try:
                for n in range(a,min(a+600,end)):
                    path=dest/f'f_{n:05}.jpg'
                    if path.exists():continue
                    page.evaluate('(t)=>window.renderAsync(t)',n/30)
                    page.screenshot(path=str(path),type='jpeg',quality=95)
                    if n%90==0:print(id,n,total,f'{time.time()-t0:.1f}s',flush=True)
                assert not errors,errors
            finally:b.close()
    print('render complete; owned Chrome and Playwright stopped',id,flush=True)

def encode(id):
    d=config(id);dest=output(id);dest.parent.mkdir(parents=True,exist_ok=True)
    silent=QA/f'{id}-silent.mp4'
    run(['ffmpeg','-v','error','-y','-framerate','30','-i',QA/'render'/id/'f_%05d.jpg','-an','-c:v','libx264','-threads','2','-preset','slow','-crf','23','-maxrate','1150k' if id=='hero' else '1250k','-bufsize','2300k' if id=='hero' else '2500k','-vf','scale=in_range=full:in_color_matrix=bt601:out_range=tv:out_color_matrix=bt709,format=yuv420p','-colorspace','bt709','-color_primaries','bt709','-color_trc','iec61966-2-1','-color_range','tv','-profile:v','high','-movflags','+faststart',silent])
    music=ROOT/'.qa/r8-music'/d['music']['file'];duration=d['duration'];phase=d['music']['onsetPhaseSeconds']
    fades=f'atrim=duration={duration},asetpts=PTS-STARTPTS,afade=t=in:d=0.08,afade=t=out:st={duration-3}:d=3'
    measure=run(['ffmpeg','-hide_banner','-ss',phase,'-i',music,'-af',fades+',loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True).stderr
    (QA/f'{id}-music-loudnorm.log').write_text(measure,encoding='utf-8')
    stats=json.loads(measure[measure.rfind('{'):measure.rfind('}')+1])
    norm='loudnorm=I=-16:TP=-1.5:LRA=11:linear=true:measured_I={input_i}:measured_TP={input_tp}:measured_LRA={input_lra}:measured_thresh={input_thresh}:offset={target_offset}'.format(**stats)
    run(['ffmpeg','-v','error','-y','-i',silent,'-ss',phase,'-i',music,'-map','0:v:0','-map','1:a:0','-c:v','copy','-af',fades+','+norm,'-c:a','aac','-b:a','128k','-ar','48000','-t',duration,'-movflags','+faststart',dest])
    run(['ffmpeg','-v','error','-y','-ss','5','-i',dest,'-frames:v','1','-c:v','libwebp','-quality','88',poster(id)])

def verify(id):
    d=config(id); path=output(id)
    data=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(path)],text=True,encoding='utf-8'))
    measured=run(['ffmpeg','-hide_banner','-i',path,'-vn','-af','loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True).stderr
    (QA/f'{id}-final-loudnorm.log').write_text(measured,encoding='utf-8')
    stats=json.loads(measured[measured.rfind('{'):measured.rfind('}')+1])
    v=next(s for s in data['streams'] if s['codec_type']=='video');a=next(s for s in data['streams'] if s['codec_type']=='audio')
    result=dict(id=id,duration=float(data['format']['duration']),width=v['width'],height=v['height'],fps=v['avg_frame_rate'],audio=a['codec_name'],audioBitrate=a['bit_rate'],bytes=path.stat().st_size,loudnorm=stats,sha256=sha(path),posterSha256=sha(poster(id)))
    assert (v['width'],v['height'])==(d['w'],d['h']) and a['codec_name']=='aac'
    assert path.stat().st_size<=(12000000 if id=='hero' else 6000000)
    assert (67<=result['duration']<=69) if id=='hero' else (29.5<=result['duration']<=30.5)
    assert abs(float(stats['input_i'])+16)<1
    frames=QA/'frames'/id;frames.mkdir(parents=True,exist_ok=True)
    times=[1,5,13,23,33,43,53,63,65] if id=='hero' else [1,5,10,15,20,25,28]
    for t in times:
        run(['ffmpeg','-v','error','-y','-ss',t,'-i',path,'-frames:v','1',frames/f'{t:05.1f}.png'])
    (QA/f'{id}-spec.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(result,ensure_ascii=False),flush=True)

def main():
    id,command=sys.argv[1:3]
    if command=='prepare':prepare()
    elif command=='shots':shots(id)
    elif command=='render':render(id,*[int(x) for x in sys.argv[3:]])
    elif command=='encode':encode(id)
    elif command=='verify':verify(id)
    else:raise ValueError(command)
if __name__=='__main__':main()
