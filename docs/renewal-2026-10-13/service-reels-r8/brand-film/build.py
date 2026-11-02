from pathlib import Path
import runpy,sys
sys.path.insert(0,str(Path(__file__).resolve().parents[2]/'hero-reel-r8'))
sys.argv.insert(1,'brand-film')
runpy.run_path(str(Path(__file__).resolve().parents[2]/'hero-reel-r8/build.py'),run_name='__main__')
