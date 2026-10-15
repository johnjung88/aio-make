"""W2b local evidence: python audit.py baseline|preflight|final <service-id>.

Only the two assigned service folders, their output media and ignored .qa are written.
The existing deterministic R8 renderer is reused; no network or paid generation.
"""
from pathlib import Path
import hashlib
import json
import shutil
import subprocess
import sys

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
QA = ROOT / '.qa/r8-w2'
SHARED = HERE.parents[1] / 'hero-reel-r8'
sys.path.insert(0, str(SHARED))
from build import config, open_page, output, poster, sha
from sources import SOURCES

IDS = ('webtoon', 'ai-influencer')
FORBIDDEN = ('요프리', 'yofree', '힐러넷', 'healernet', 'bwl', "dr's secret", '닥터시크릿', '맥스테크', '화장실', 'cc by')


def write(id, name, data):
    (HERE.parent / id / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def baseline(id):
    backup = QA / 'w2b-baseline' / id
    backup.mkdir(parents=True, exist_ok=True)
    records = []
    for path in [output(id), poster(id)] + list((HERE.parent/id).glob('*')):
        if path.is_file() and path.name != 'baseline.json':
            dest = backup / path.name
            if not dest.exists():
                shutil.copy2(path, dest)
            records.append(dict(path=str(path.relative_to(ROOT)), sha256=sha(path), backup=str(dest.relative_to(ROOT))))
    src = (QA / 'render' / id).resolve()
    dest = (backup / 'render').resolve()
    assert src.is_relative_to((QA/'render').resolve()) and src.name in IDS
    assert dest.is_relative_to((QA/'w2b-baseline').resolve()) and dest.parent.name == id
    if src.exists() and not dest.exists():
        src.rename(dest)
    write(id, 'baseline.json', records)
    print(id, 'prior candidate, inputs and frame cache preserved', flush=True)


def source_audit(id):
    d = config(id)
    assert all(len(i['small']) <= 22 for i in d['items'])
    used = set(i['src'] for i in d['items'] if i['src'])
    if id == 'webtoon':
        used.discard('wt')
        used.update(f'wt{n}' for n in range(1,13))
    else:
        used.update(['body']+[f'face{n}' for n in range(1,21)]+[f'highlight{n}' for n in range(1,6)])
    stored = json.loads((QA/'source-manifest.json').read_text(encoding='utf-8'))
    records=[]
    for key in sorted(used):
        s = SOURCES[key]
        path = Path(s['source'])
        checksum = sha(path)
        assert checksum == stored[key]['sourceSha256'], (key, 'original changed')
        assert 'Magirus_공식' not in str(path) and '/웹/' not in path.as_posix()
        record = dict(id=key, source=str(path), sha256=checksum, originalUnchanged=True)
        if s['kind'] == 'clip':
            start, end = s['start'], s['start']+s['duration']
            if key == 'wtmotion':
                assert start == 18 and end == 24  # health claims and CC BY end card excluded
            if key.startswith('ai'):
                assert path.stem.endswith('_draft')  # original baked efficacy subtitles excluded
            record.update(start=start, end=end, frames=stored[key]['frames'])
        records.append(record)
    unit=d['music']['unitSeconds']
    snaps=[dict(time=i['start'], ideal=round(i['start']/unit)*unit,
                error=abs(i['start']-round(i['start']/unit)*unit)) for i in d['items']]
    assert max(s['error'] for s in snaps) <= 1/60+1e-8
    assert all(abs(a['end']-b['start'])<1e-8 for a,b in zip(d['items'],d['items'][1:]))
    write(id,'source-audit.json',dict(sources=records,cuts=snaps,
          originalAudio='discarded: JPEG extraction and H.264 picture encode -an; chosen music only',
          exclusion='webtoon uses only approved product/gift pages and motioncomic [18,24); AI uses uncaptioned drafts only'))
    return d


def bpm_audit(id,d):
    import numpy as np
    from scipy import signal
    path=ROOT/'.qa/r8-music'/d['music']['file']
    assert sha(path)==d['music']['sha256']
    raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-t','90','-ac','1','-ar','22050','-f','f32le','-'])
    wave=np.frombuffer(raw,np.float32)
    _,_,z=signal.stft(wave,fs=22050,nperseg=1024,noverlap=768)
    onset=np.maximum(np.diff(np.abs(z),axis=1),0).sum(axis=0)
    onset-=onset.mean()
    ac=signal.fftconvolve(onset,onset[::-1],mode='full')[len(onset)-1:]
    rate=22050/256
    bpms=np.arange(70,180,.02)
    scores=np.array([sum(np.interp(rate*60/b*k,np.arange(len(ac)),ac)/k for k in range(1,9)) for b in bpms])
    peaks,_=signal.find_peaks(scores,distance=50)
    top=sorted(peaks,key=lambda n:scores[n],reverse=True)[:8]
    selected=d['music']['bpm']
    nearest=min(peaks,key=lambda n:abs(bpms[n]-selected))
    assert abs(bpms[nearest]-selected)<1,(id,selected,bpms[nearest])
    evidence=ROOT/'docs/renewal-2026-10-13/license-evidence-r8'
    evidence_files=['INDEX.sha256.txt','TRACK_EVIDENCE_freepd_extracts.md','freepd_wayback_scoring_20251124.html','cc0_legalcode.html']
    declared={line.split(' *',1)[1]:line.split(' *',1)[0] for line in (evidence/'INDEX.sha256.txt').read_text(encoding='utf-8').splitlines() if ' *' in line}
    assert sha(path)==declared[path.name]
    assert all(sha(evidence/f)==declared[f] for f in evidence_files if f!='INDEX.sha256.txt')
    write(id,'music-audit.json',dict(file=str(path.relative_to(ROOT)),sha256=sha(path),title=d['music']['title'],composer=d['music']['composer'],
          selectedBpm=selected,nearestPeakBpm=round(float(bpms[nearest]),3),
          broadSearchPeaks=[dict(bpm=round(float(bpms[n]),3),score=round(float(scores[n]),4)) for n in top],
          analyzedSeconds=round(len(wave)/22050,3),cutGridSeconds=d['music']['unitSeconds'],
          halfBar=d['music']['halfBar'],musicStartSeconds=d['music']['onsetPhaseSeconds'],
          method='fresh 90 s mono 22050 Hz; positive STFT spectral flux; 70-180 BPM autocorrelation with 8 beat multiples',
          fade='80 ms in, 3 s out',normalization='two-pass loudnorm I=-16 TP=-1.5 LRA=11; AAC target 128k/48kHz',
          approvedLicenseIndexMatch=True,
          licenseEvidence=[dict(path=str((evidence/f).relative_to(ROOT)),sha256=sha(evidence/f)) for f in evidence_files],
          listening='NOT_RUN by worker; specified recommendation and supplied approval followed'))


def preflight(id):
    from playwright.sync_api import sync_playwright
    d=source_audit(id)
    bpm_audit(id,d)
    times=sorted(set(round(t,4) for i in d['items'] for t in [i['start']+1/30,(i['start']+i['end'])/2,i['end']-1/30]))
    middle={round((i['start']+i['end'])/2,4) for i in d['items']}
    previews=QA/'previews'/id
    previews.mkdir(parents=True,exist_ok=True)
    checks=[]
    with sync_playwright() as p:
        b,page,errors=open_page(p,id)
        try:
            for t in times:
                page.evaluate('(t)=>window.renderAsync(t)',t)
                if t in middle:
                    page.screenshot(path=str(previews/f'w2b_{t:06.3f}.png'))
                a=page.evaluate('window.layoutAudit()')
                bad=[s for s in a['text'] if any(word in s.lower() for word in FORBIDDEN)]
                if id=='ai-influencer':
                    assert 'AI 가상인물' in a['text'],t
                checks.append(dict(t=t,overflow=a['overflow'],forbidden=bad,maxImages=a['maxImages'],text=a['text']))
            assert not errors,errors
        finally:
            b.close()
    write(id,'layout-audit.json',dict(checks=checks,browserErrors=errors,ownedBrowserClosed=True))
    assert not any(x['overflow'] or x['forbidden'] for x in checks),checks
    print(id,'preflight PASS',len(checks),'layouts; hashes, exclusions and BPM checked; owned Chrome closed',flush=True)


def final(id):
    from PIL import Image,ImageDraw
    d=source_audit(id)
    path=output(id)
    data=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(path)],encoding='utf-8'))
    log=subprocess.run(['ffmpeg','-hide_banner','-i',str(path),'-vn','-af','loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True).stderr
    (QA/f'{id}-final-loudnorm.log').write_text(log,encoding='utf-8')
    stats=json.loads(log[log.rfind('{'):log.rfind('}')+1])
    v=next(s for s in data['streams'] if s['codec_type']=='video')
    a=next(s for s in data['streams'] if s['codec_type']=='audio')
    assert len(data['streams'])==2 and v['codec_name']=='h264' and a['codec_name']=='aac'
    assert (v['width'],v['height'])==(d['w'],d['h']) and v['avg_frame_rate']=='30/1'
    assert v['pix_fmt']=='yuv420p' and int(v['nb_frames'])==round(d['duration']*30)
    assert 29.5<=float(data['format']['duration'])<=30.5 and path.stat().st_size<=6000000
    assert abs(float(stats['input_i'])+16)<1
    decode=subprocess.run(['ffmpeg','-v','error','-threads','1','-i',str(path),'-f','null','-'],capture_output=True,text=True)
    assert decode.returncode==0 and not decode.stderr,decode.stderr
    # Check atom order without relying on a filename convention.
    atoms=[]
    with path.open('rb') as f:
        while f.tell()<path.stat().st_size:
            start=f.tell();header=f.read(8)
            if len(header)<8:break
            size=int.from_bytes(header[:4],'big');kind=header[4:].decode('ascii')
            if size==1:size=int.from_bytes(f.read(8),'big')
            if size==0:size=path.stat().st_size-start
            atoms.append(kind);f.seek(start+size)
    assert atoms.index('moov')<atoms.index('mdat')
    frames=QA/'frames'/id
    frames.mkdir(parents=True,exist_ok=True)
    times=sorted(set([1.,5.,10.,15.,20.,25.,28.] + [round((i['start']+i['end'])/2,3) for i in d['items']] +
          [round(i['start']+(i['end']-i['start'])*p,3) for i in d['items'] if i['kind'] in ('identity','grid','calendar') for p in (.1,.75,.95)]))
    thumbs=[]
    for t in times:
        frame=frames/f'w2b_{t:06.3f}.png'
        subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',str(path),'-frames:v','1',str(frame)],check=True)
        with Image.open(frame) as img:
            thumbs.append((t,img.convert('RGB').resize((360,round(img.height*360/img.width)))))
    cellh=max(im.height for _,im in thumbs)+26
    sheet=Image.new('RGB',(360*4,cellh*((len(thumbs)+3)//4)),'#14111a')
    draw=ImageDraw.Draw(sheet)
    for n,(t,im) in enumerate(thumbs):
        x,y=n%4*360,n//4*cellh
        draw.text((x+8,y+6),f'{id} {t:.3f}s / 360px',fill='white');sheet.paste(im,(x,y+26))
    contact=frames/'w2b-contact-360.jpg';sheet.save(contact,quality=94)
    result=dict(id=id,ffprobe=data,loudnorm=stats,bytes=path.stat().st_size,sha256=sha(path),posterSha256=sha(poster(id)),
          output=str(path.relative_to(ROOT)),poster=str(poster(id).relative_to(ROOT)),extractedFrameTimes=times,
          contactSheet=str(contact.relative_to(ROOT)),sourceAudioTracks=0,finalAudioSource=d['music']['file'],
          fullDecode='PASS: ffmpeg exit 0; stderr empty',faststart=atoms)
    write(id,'verification.json',result)
    inputs=[HERE.parent/id/'index.html',HERE.parent/id/'build.py',HERE.parent/id/'config.js',HERE/'layout.js',HERE/'audit.py']
    inputs += [SHARED/f for f in ['build.py','sources.py','timeline.py','renderer.js','assets.js']]
    inputs += [ROOT/'public/fonts/PretendardVariable.woff2',ROOT/'public/fonts/Unbounded-latin.woff2']
    write(id,'render-inputs.sha256.json',[dict(path=str(p.relative_to(ROOT)),sha256=sha(p)) for p in inputs])
    print(id,'final technical PASS',json.dumps(dict(duration=data['format']['duration'],bytes=path.stat().st_size,lufs=stats['input_i'],frames=len(times))),flush=True)


if __name__=='__main__':
    action,id=sys.argv[1:3]
    assert id in IDS
    {'baseline':baseline,'preflight':preflight,'final':final}[action](id)
