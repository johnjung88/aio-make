"""히어로 영상 R7 제작 스크립트 (무료 로컬 도구만: ffmpeg, Python Playwright + 시스템 Chrome).

사용:
  python build.py extract            # public/ 영상에서 필요한 구간의 프레임을 .qa/hero-reel-r7/src 로 추출(오디오 제거)
  python build.py shots 3.0 12.5 ... # 지정 시각(초)의 단일 프레임을 hero-reel-r7/frames/test_*.png 로 저장
  python build.py render             # 1350프레임(45초 x 30fps)을 .qa/hero-reel-r7/frames 로 저장
  python build.py encode             # ffmpeg H.264 인코딩 -> public/content-home/hero-reel-r7.mp4, 포스터 webp
렌더는 Next 빌드/서버와 동시에 돌리지 않는다(Chrome 1개 프로세스만 사용).
"""
import subprocess, sys, time, pathlib

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[2]  # 저장소 루트
SRC = ROOT / ".qa" / "hero-reel-r7" / "src"
FR = ROOT / ".qa" / "hero-reel-r7" / "frames"
OUT_MP4 = ROOT / "public" / "content-home" / "hero-reel-r7.mp4"
OUT_WEBP = ROOT / "public" / "content-home" / "hero-reel-r7.webp"
FPS, DUR = 30, 45
N = FPS * DUR


def sh(cmd):
    print(" ".join(str(c) for c in cmd))
    subprocess.run([str(c) for c in cmd], check=True)


def extract():
    (SRC / "wt").mkdir(parents=True, exist_ok=True)
    (SRC / "bf").mkdir(parents=True, exist_ok=True)
    # 웹툰 소개 영상 16.0~18.0초 (오디오 제거 -an)
    sh(["ffmpeg", "-v", "error", "-y", "-ss", "16", "-t", "2", "-i", ROOT / "public/videos/webtoon-reference-v02.mp4", "-an", "-vf", "fps=30", "-q:v", "2", SRC / "wt" / "wt_%03d.jpg"])
    # 브랜드 필름 3.0~8.0초 (원본 무음)
    sh(["ffmpeg", "-v", "error", "-y", "-ss", "3", "-t", "5", "-i", ROOT / "public/content-examples/brand-film/brandfilm-motion.mp4", "-an", "-vf", "fps=30", "-q:v", "2", SRC / "bf" / "bf_%03d.jpg"])


def open_page(p):
    b = p.chromium.launch(channel="chrome", headless=True, args=["--allow-file-access-from-files", "--force-color-profile=srgb", "--hide-scrollbars", "--disable-lcd-text"])
    pg = b.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
    msgs = []
    pg.on("console", lambda m: msgs.append(m.text))
    pg.on("pageerror", lambda e: msgs.append("PAGEERROR " + str(e)))
    pg.goto((HERE / "index.html").as_uri())
    pg.evaluate("window.ready")
    return b, pg, msgs


def shots(ts):
    from playwright.sync_api import sync_playwright
    (HERE / "frames").mkdir(exist_ok=True)
    with sync_playwright() as p:
        b, pg, msgs = open_page(p)
        print("widths", pg.evaluate("JSON.stringify(window.CAPTION_WIDTHS)"))
        for t in ts:
            pg.evaluate(f"window.renderAsync({t})")
            f = HERE / "frames" / f"test_{t:06.2f}.png"
            pg.screenshot(path=str(f))
            print("saved", f)
        print("console", msgs)
        b.close()


def render(start=0, end=N, fmt="jpeg"):
    from playwright.sync_api import sync_playwright
    FR.mkdir(parents=True, exist_ok=True)
    t0 = time.time()
    with sync_playwright() as p:
        b, pg, msgs = open_page(p)
        for n in range(start, end):
            t = n / FPS
            pg.evaluate(f"window.renderAsync({t!r})")
            if fmt == "png":
                pg.screenshot(path=str(FR / f"f_{n:05d}.png"))
            else:
                pg.screenshot(path=str(FR / f"f_{n:05d}.jpg"), type="jpeg", quality=95)
            if n % 60 == 0:
                print(n, f"{time.time() - t0:.0f}s", flush=True)
        print("console", msgs)
        b.close()


def encode(ext="jpg"):
    OUT_MP4.parent.mkdir(parents=True, exist_ok=True)
    sh(["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-i", FR / f"f_%05d.{ext}",
        "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-maxrate", "2800k", "-bufsize", "5600k",
        "-vf", "scale=in_range=full:in_color_matrix=bt601:out_range=tv:out_color_matrix=bt709,format=yuv420p",
        "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "iec61966-2-1", "-color_range", "tv", "-profile:v", "high", "-r", str(FPS), "-movflags", "+faststart", OUT_MP4])
    # 포스터: 웹툰 장면 6~7초 지점
    sh(["ffmpeg", "-v", "error", "-y", "-ss", "6.4", "-i", OUT_MP4, "-frames:v", "1", "-vf", "scale=1280:-1", "-c:v", "libwebp", "-quality", "86", OUT_WEBP])


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "extract":
        extract()
    elif cmd == "shots":
        shots([float(x) for x in sys.argv[2:]])
    elif cmd == "render":
        a = int(sys.argv[2]) if len(sys.argv) > 2 else 0
        z = int(sys.argv[3]) if len(sys.argv) > 3 else N
        render(a, z)
    elif cmd == "encode":
        encode()
