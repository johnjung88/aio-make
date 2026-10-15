"""Repeatable onset analysis; no music copies are stored outside .qa/."""
import json, subprocess, hashlib
import numpy as np
from scipy import signal
from sources import ROOT, QA, TRACKS

def analyze():
    result = {}
    for reel, (file, expected, duration, title, composer) in TRACKS.items():
        path = ROOT / '.qa/r8-music' / file
        raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(path), '-t', '90', '-ac', '1', '-ar', '22050', '-f', 'f32le', '-'])
        wave = np.frombuffer(raw, np.float32)
        _, _, z = signal.stft(wave, fs=22050, nperseg=1024, noverlap=768)
        magnitude = np.abs(z)
        onset = np.maximum(np.diff(magnitude, axis=1), 0).sum(axis=0)
        onset /= max(float(np.std(onset)), 1e-8)
        rate = 22050 / 256
        ac = signal.fftconvolve(onset-onset.mean(), (onset-onset.mean())[::-1], mode='full')[len(onset)-1:]
        bpms = np.arange(expected*.965, expected*1.035, .02)
        scores = [sum(np.interp(rate*60/bpm*k, np.arange(len(ac)), ac)/k for k in range(1, 9)) for bpm in bpms]
        bpm = float(bpms[np.argmax(scores)])
        # Integer BPM within 0.18 of the optimum avoids sub-frame drift from FFT bins.
        if abs(bpm-round(bpm)) < .18:
            bpm = float(round(bpm))
        beat = 60/bpm
        phases = np.arange(0, beat, .005)
        energy = [float(np.interp(np.arange(phase, min(duration, 30), beat)*rate, np.arange(len(onset)), onset).mean()) for phase in phases]
        phase = float(phases[np.argmax(energy)])
        # AI's slow groove uses the approved half-bar grid. Other cuts are full bars.
        unit = beat * (2 if reel == 'ai-influencer' else 4)
        units = round(duration/unit)
        seconds = units*unit
        if reel == 'hero':
            seconds = 68.0  # approved 34 bars at confirmed 120 BPM
        result[reel] = dict(file=file, sha256=hashlib.sha256(path.read_bytes()).hexdigest(), title=title, composer=composer,
                            bpm=round(bpm, 3), beatSeconds=beat, onsetPhaseSeconds=phase, unitSeconds=unit, units=units,
                            duration=round(seconds*30)/30, method='spectral-flux autocorrelation, 8 beat multiples, 90s; phase energy grid 5ms',
                            halfBar=reel=='ai-influencer', expectedBpm=expected)
        print(reel, json.dumps(result[reel], ensure_ascii=False), flush=True)
    QA.mkdir(parents=True, exist_ok=True)
    (QA/'music-analysis.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    return result

if __name__ == '__main__':
    analyze()
