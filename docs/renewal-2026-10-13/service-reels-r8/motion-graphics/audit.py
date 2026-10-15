"""W2c evidence only: preserve prior outputs, check sources/BPM/layout/final media.

python .../motion-graphics/audit.py baseline <id>
python .../motion-graphics/audit.py preflight <id>
python .../motion-graphics/audit.py final <id>
Shared R8 build.py remains the rendering/encoding entrypoint for each owned service.
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
sys.path.insert(0, str(HERE.parents[1] / 'hero-reel-r8'))
from build import config, open_page, output, poster, sha
from sources import SOURCES

IDS = ('motion-graphics', 'brand-film', 'ad')
FORBIDDEN = ('요프리', 'yofree', '힐러넷', 'healernet', 'bwl', "dr's secret", '닥터시크릿', '맥스테크', '화장실', 'cc by')


def write(id, name, data):
    (HERE.parent / id / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def baseline(id):
    backup = QA / 'w2c-baseline' / id
    backup.mkdir(parents=True, exist_ok=True)
    records = []
    for path in [output(id), poster(id)]:
        if path.exists():
            dest = backup / path.name
            if not dest.exists():
                shutil.copy2(path, dest)
            records.append(dict(path=str(path.relative_to(ROOT)), sha256=sha(path), backup=str(dest.relative_to(ROOT))))
    src = (QA / 'render' / id).resolve()
    dest = backup / 'render'
    assert src.is_relative_to((QA / 'render').resolve()) and src.name in IDS
    if src.exists() and not dest.exists():
        src.rename(dest)
    write(id, 'baseline.json', records)
    print('preserved prior outputs and frame cache', id, flush=True)


def source_audit(id):
    d = config(id)
    assert all(len(i['small']) <= 22 for i in d['items'])
    used = list(dict.fromkeys(i['src'] for i in d['items'] if i['src']))
    records = []
    stored = json.loads((QA / 'source-manifest.json').read_text(encoding='utf-8'))
    for key in used:
        s = SOURCES[key]
        path = Path(s['source'])
        checksum = sha(path)
        assert checksum == stored[key]['sourceSha256'], (key, 'original changed')
        start, end = s['start'], s['start'] + s['duration']
        name = path.name
        if 'HEALERNET_MG_V1' in name:
            assert end <= 25.5
        if 'HEALERNET_MG_V2' in name:
            assert end <= 12.4
        if name == 'brand.mp4':
            assert all(end <= a + 1e-6 or start >= b - 1e-6 for a, b in [(4.4, 6.2), (18.8, 20.6)])
        assert 'Magirus_공식' not in str(path) and '/웹/' not in path.as_posix()
        records.append(dict(id=key, source=str(path), start=start, end=end, sha256=checksum, originalUnchanged=True))
    unit = d['music']['unitSeconds']
    snaps = [dict(time=i['start'], ideal=round(i['start']/unit)*unit,
                  error=abs(i['start']-round(i['start']/unit)*unit)) for i in d['items']]
    assert max(s['error'] for s in snaps) <= 1/60 + 1e-8
    write(id, 'source-audit.json', dict(sources=records, cuts=snaps, originalAudio='discarded: frame extraction and picture encode -an; only chosen music is muxed'))
    return d


def bpm_audit(id, d):
    import numpy as np
    from scipy import signal
    path = ROOT / '.qa/r8-music' / d['music']['file']
    assert sha(path) == d['music']['sha256']
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(path), '-t', '90', '-ac', '1', '-ar', '22050', '-f', 'f32le', '-'])
    wave = np.frombuffer(raw, np.float32)
    _, _, z = signal.stft(wave, fs=22050, nperseg=1024, noverlap=768)
    onset = np.maximum(np.diff(np.abs(z), axis=1), 0).sum(axis=0)
    onset -= onset.mean()
    ac = signal.fftconvolve(onset, onset[::-1], mode='full')[len(onset)-1:]
    rate = 22050/256
    # Broad search, independent of the selected cut grid; record metrical alternatives.
    bpms = np.arange(70, 180, .02)
    scores = np.array([sum(np.interp(rate*60/b*k, np.arange(len(ac)), ac)/k for k in range(1, 9)) for b in bpms])
    peaks, _ = signal.find_peaks(scores, distance=50)
    top = sorted(peaks, key=lambda n: scores[n], reverse=True)[:8]
    selected = d['music']['bpm']
    nearest = min(peaks, key=lambda n: abs(bpms[n]-selected))
    assert abs(bpms[nearest]-selected) < 1, (id, selected, bpms[nearest])
    write(id, 'music-audit.json', dict(file=str(path.relative_to(ROOT)), sha256=sha(path), selectedBpm=selected,
          nearestPeakBpm=round(float(bpms[nearest]), 3), broadSearchPeaks=[dict(bpm=round(float(bpms[n]), 3), score=round(float(scores[n]), 4)) for n in top],
          analyzedSeconds=round(len(wave)/22050, 3),
          method='up to 90 s mono 22050 Hz; positive STFT spectral flux; 70-180 BPM autocorrelation with 8 beat multiples',
          listening='NOT_RUN; computational beat-grid verification, not human listening',
          note='Goodnightmare also admits a 3:2 interpretation; Motions has weak/half-time pulses. The approved 130/120/130 grid is retained.',
          cutGridSeconds=d['music']['unitSeconds'], musicStartSeconds=d['music']['onsetPhaseSeconds'],
          fade='80 ms in, 3 s out', normalization='two-pass loudnorm I=-16 TP=-1.5 LRA=11; AAC 128k/48kHz'))


def preflight(id):
    from playwright.sync_api import sync_playwright
    d = source_audit(id)
    bpm_audit(id, d)
    # Inspect both sides of each cut plus its middle, not just representative frames.
    times = sorted(set(round(t, 4) for i in d['items'] for t in [i['start']+1/30, (i['start']+i['end'])/2, i['end']-1/30]))
    middle_times = {round((i['start']+i['end'])/2, 4) for i in d['items']}
    previews = QA/'previews'/id
    previews.mkdir(parents=True,exist_ok=True)
    checks=[]
    with sync_playwright() as p:
        b,page,errors=open_page(p,id)
        try:
            for t in times:
                page.evaluate('(t)=>window.renderAsync(t)', t)
                if t in middle_times:
                    page.screenshot(path=str(previews/f'w2c_{t:06.3f}.png'))
                a=page.evaluate('window.layoutAudit()')
                bad=[s for s in a['text'] if any(word in s.lower() for word in FORBIDDEN)]
                checks.append(dict(t=t, overflow=a['overflow'], forbidden=bad, maxImages=a['maxImages'], text=a['text']))
            assert not errors, errors
        finally:
            b.close()
    write(id,'layout-audit.json',dict(checks=checks, browserErrors=errors, ownedBrowserClosed=True))
    assert not any(x['overflow'] or x['forbidden'] for x in checks), checks
    print(id, 'preflight PASS', len(checks), 'layouts; original hashes, exclusions, grid and BPM checked; Chrome closed',flush=True)


def final(id):
    from PIL import Image, ImageDraw
    d=source_audit(id)
    path=output(id)
    data=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(path)],encoding='utf-8'))
    log=subprocess.run(['ffmpeg','-hide_banner','-i',str(path),'-vn','-af','loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True).stderr
    stats=json.loads(log[log.rfind('{'):log.rfind('}')+1])
    (QA/f'{id}-final-loudnorm.log').write_text(log,encoding='utf-8')
    v=next(s for s in data['streams'] if s['codec_type']=='video')
    a=next(s for s in data['streams'] if s['codec_type']=='audio')
    assert len(data['streams'])==2 and v['codec_name']=='h264' and a['codec_name']=='aac'
    assert (v['width'],v['height'])==(d['w'],d['h']) and v['avg_frame_rate']=='30/1'
    assert int(v['nb_frames']) == round(d['duration']*30)
    assert 29.5<=float(data['format']['duration'])<=30.5 and path.stat().st_size<=6000000
    assert abs(float(stats['input_i'])+16)<1
    frames=QA/'frames'/id
    frames.mkdir(parents=True,exist_ok=True)
    times=sorted(set([1.,5.,10.,15.,20.,25.,28.] + [round((i['start']+i['end'])/2,3) for i in d['items']]))
    for t in times:
        subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',str(path),'-frames:v','1',str(frames/f'w2c_{t:06.3f}.png')],check=True)
    thumbs=[]
    for t in times:
        img=Image.open(frames/f'w2c_{t:06.3f}.png').convert('RGB')
        img=img.resize((360,round(img.height*360/img.width)))
        thumbs.append((t,img))
    cellh=max(im.height for _,im in thumbs)+28
    sheet=Image.new('RGB',(360*5,cellh*((len(thumbs)+4)//5)),'#14111a')
    draw=ImageDraw.Draw(sheet)
    for n,(t,im) in enumerate(thumbs):
        x,y=n%5*360,n//5*cellh
        draw.text((x+8,y+6),f'{id} {t:.3f}s / 360px',fill='white')
        sheet.paste(im,(x,y+28))
    contact=frames/'w2c-contact-360.jpg'
    sheet.save(contact,quality=94)
    result=dict(id=id,ffprobe=data, loudnorm=stats, bytes=path.stat().st_size, sha256=sha(path), posterSha256=sha(poster(id)),
                output=str(path.relative_to(ROOT)), poster=str(poster(id).relative_to(ROOT)), extractedFrameTimes=times,
                contactSheet=str(contact.relative_to(ROOT)), sourceAudioTracks=0, finalAudioSource=d['music']['file'])
    write(id,'verification.json',result)
    (QA/f'{id}-spec.json').write_text(json.dumps(dict(id=id,duration=float(data['format']['duration']),
        width=v['width'],height=v['height'],fps=v['avg_frame_rate'],audio=a['codec_name'],audioBitrate=a['bit_rate'],
        bytes=path.stat().st_size,loudnorm=stats,sha256=result['sha256'],posterSha256=result['posterSha256']),indent=2)+'\n',encoding='utf-8')
    print(id,'final technical PASS',json.dumps(dict(duration=data['format']['duration'],bytes=path.stat().st_size,lufs=stats['input_i'],frames=len(times))),flush=True)


if __name__=='__main__':
    action,id=sys.argv[1:3]
    assert id in IDS
    {'baseline':baseline,'preflight':preflight,'final':final}[action](id)
