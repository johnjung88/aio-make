"""Approved local sources, read only. Original sound never enters the render."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
QA = ROOT / '.qa/r8-w2'
H = Path('I:/AIO_OS/01_WORK/01_에이전시/01_영업관리/03_잠재고객/261010_힐러넷/02_컨텐츠 자료')
B = H.parents[1] / '261010_BWL/02_컨텐츠 자료'
M = H.parents[1] / '261013_맥스테크/02_웹사이트/02_컨텐츠/영상'
U = Path('I:/AIO_OS/01_WORK/05_MCN/02_AI 인플루언서/03_기록하는87/01_계정관리/02_브랜드·캐릭터자산')
S = H / '모션그래픽/요프리/MG-20261012-03_v01/S1_키네틱'
MG = H / '모션그래픽/힐러넷/MG-20261010-01_v02/out'
Y = H / '영상/요프리/02_브랜드영상_16x9'
BA = B / '영상/04_닥터 시크릿_아쿠아세럼'
SOURCES = {}

def image(id, path, width=1000):
    SOURCES[id] = dict(kind='image', source=str(path), width=width)

def clip(id, path, start, duration, width=1280):
    SOURCES[id] = dict(kind='clip', source=str(path), start=start, duration=duration, width=width)

for n in range(1, 13):
    image(f'wt{n}', ROOT / f'public/webtoon-v11/cut-{n:02}.webp', 800)
for n in range(1, 21):
    image(f'face{n}', U / f'character/soul_dataset/{n:02}.png', 600)
image('face', U / 'character/기준이미지/I03_얼굴후보_02_의장생성.png', 800)
image('body', U / 'character/기준이미지/I03_전신후보_03_다리8퍼줄임.png', 800)
image('profile', U / 'profile/profile.png', 600)
for n, name in enumerate(['기록', '기준', '루틴', '질문', '안내'], 1):
    # Names are resolved against the original directory, without modifying it.
    matches = list((U / 'profile').glob(f'highlight_{n:02}_*.png'))
    if matches:
        image(f'highlight{n}', matches[0], 400)
for n, path in enumerate(sorted((S / 'assets/img').glob('mascot_*.png')), 1):
    image(f'mascot{n}', path, 500)
image('alignment', S / 'out/S1_cut_beat_alignment.png', 1280)
for n, path in enumerate(sorted((Y / '02_이미지/02_확정/②진상품').glob('S*.png')), 1):
    image(f'adimg{n}', path, 1000)
image('otherwt1', H / '웹툰/03_완성/제작본_v01/버전1_외출편/04_요프리를고르다.png', 800)
image('otherwt2', B / '웹툰/03_아쿠아부스트세럼10/읽는순서/02_오늘의보습루틴.png', 800)
image('otherwt3', H / '웹툰/03_완성/제작본_v01/버전2_밤편/04_선물에담은메모.png', 800)
clip('comic', ROOT / 'public/videos/webtoon-reference-v02.mp4', 9, 2)
clip('wtmotion', H / '모션그래픽/요프리/01_웹툰_모션그래픽/out/v04/yofree_webtoon_v04.mp4', 18, 6, 720)
for id, start, dur in [('mg1', .5, 2), ('mg2', 3, 2), ('mg3', 6, 4), ('mg4', 10, 6), ('mg5', 17, 2), ('mg6', 19, 4)]:
    clip(id, MG / 'HEALERNET_MG_V1_30s_16x9_후보v02.mp4', start, dur)
clip('mgv1', MG / 'HEALERNET_MG_V2_15s_9x16_후보v02.mp4', .2, 2, 720)
clip('mgv2', MG / 'HEALERNET_MG_V2_15s_9x16_후보v02.mp4', 9.7, 2, 720)
for id, start, dur in [('s1', 1.9, 2), ('s2', 21.7, 6), ('s3', 27.7, 2)]:
    clip(id, S / 'out/YOFREE_MG30_S1_키네틱_16x9_후보v01.mp4', start, dur)
for id, start, dur in [('sv1', 0, 2), ('sv2', 1.9, 2), ('sv3', 25.7, 2), ('sv4', 27.7, 2)]:
    clip(id, S / 'out/YOFREE_MG30_S1_키네틱_9x16_후보v01.mp4', start, dur, 720)
clip('ad1', Y / '04_편집/②진상품_완성_v1/brand.mp4', 8.3, 4)
clip('ad2', Y / '04_편집/②진상품_완성_v1/brand.mp4', 14.8, 4)
clip('ad3', Y / '04_편집/②진상품_완성_v1/brand.mp4', 20.6, 2)
clip('addraft', Y / '03_영상/01_드래프트/②진상품/D02_상소두루마리.mp4', .4, 2)
clip('logo', M / 'v05_홍보영상/최종/hero-promo.mp4', .5, 2)
clip('photo1', M / 'v05_홍보영상/최종/hero-promo.mp4', 52.6, 1.8)
clip('photo2', M / 'v05_홍보영상/최종/hero-promo.mp4', 54.4, 1.8)
clip('photo3', M / 'v05_홍보영상/최종/hero-promo.mp4', 56.2, 1.8)
clip('logoend', M / 'v05_홍보영상/최종/hero-promo.mp4', 58.1, 3.7)
for kind in ['highrise', 'airport', 'mountain']:
    for n in range(1, 4):
        clip(f'{kind}{n}', M / f'v05_편집/최종/{kind}-{n:02}.mp4', 0 if n == 1 else 1, 2)
clip('highres', M / 'v05_사용자생성/사다리차_영상 6.mp4', .5, 2)
clip('airportres', M / 'v05_사용자생성/공항_영상_추가.mp4', 1, 2)
for id, name in [('ai1', 'K1'), ('ai2', 'K2'), ('ai3', 'K3'), ('ai4', 'C4')]:
    clip(id, BA / f'03_영상/87언니/01_시안/{name}_draft.mp4', 0, 4, 720)
clip('aiproduct2', B / '영상/05_닥터 시크릿_C플러스세럼/03_영상/87언니/01_시안/C3_draft.mp4', .2, 2, 720)
clip('aiproduct3', B / '영상/06_닥터 시크릿_클렌저1/03_영상/01_시안/C3_draft.mp4', .2, 2, 720)

# The hero's two-second windows are distinct from longer service film windows.
clip('hero-mg3', MG / 'HEALERNET_MG_V1_30s_16x9_후보v02.mp4', 6.5, 2)
clip('hero-mg4', MG / 'HEALERNET_MG_V1_30s_16x9_후보v02.mp4', 11, 2)
clip('hero-mg6', MG / 'HEALERNET_MG_V1_30s_16x9_후보v02.mp4', 20, 2)
clip('hero-photo', M / 'v05_홍보영상/최종/hero-promo.mp4', 52.6, 2)
clip('hero-ad1', Y / '04_편집/②진상품_완성_v1/brand.mp4', 8.3, 2)
clip('hero-ad2', Y / '04_편집/②진상품_완성_v1/brand.mp4', 14.8, 2)
for n,name in enumerate(['K1.png','K2.png','K3.png','C4_펴바르기.png','K4.png','K2.png'],1):
    image(f'aicut{n}', BA / '02_이미지/87언니/02_확정' / name, 600)

TRACKS = {
    'hero': ('r8-m01-arpent.mp3', 120, 68, 'Arpent', 'Kevin MacLeod'),
    'webtoon': ('r8-m02-slice-of-life.mp3', 145, 30, 'Slice of Life', 'Bryan Teoh'),
    'ai-influencer': ('r8-m03-patron-saint.mp3', 85, 30, 'Patron Saint of Heists', 'Bryan Teoh'),
    'motion-graphics': ('r8-m04-goodnightmare.mp3', 130, 30, 'Goodnightmare', 'Kevin MacLeod'),
    'brand-film': ('r8-m05-motions.mp3', 120, 30, 'Motions', 'Rafael Krux'),
    'ad': ('r8-m06-backbeat.mp3', 129.2, 30, 'Backbeat', 'Kevin MacLeod'),
}
