"""Le (OCR) as legendas queimadas para obter texto e tempos.

Uso: python3 scripts/ocr_captions.py ORIGINAL.mp4 saida.json pasta_tmp
"""
import subprocess, numpy as np, sys, json, os
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
F=sys.argv[1]; out=sys.argv[2]; tmp=sys.argv[3]; os.makedirs(tmp,exist_ok=True)
W,H,Y0=1080,110,1090
p=subprocess.run(["ffmpeg","-v","error","-i",F,"-vf",f"crop={W}:{H}:0:{Y0}","-f","rawvideo","-pix_fmt","rgb24","-"],capture_output=True)
fr=np.frombuffer(p.stdout,np.uint8).reshape(-1,H,W,3).astype(int)
fps=30000/1001
r,g,b=fr[...,0],fr[...,1],fr[...,2]
mask=((r>215)&(g>215)&(b>215))|((b>190)&(r<150)&(b-r>70))
# runs of similar masks
groups=[]; cur=None
for i,m in enumerate(mask):
    n=m.sum()
    if cur is not None and n>0 and (np.logical_xor(m,cur["m"]).sum()<0.25*max(n,cur["n"])):
        cur["end"]=i; continue
    if cur is not None and cur["n"]==0 and n==0: cur["end"]=i; continue
    cur={"start":i,"end":i,"m":m,"n":n}; groups.append(cur)
def ocr(gi):
    gr=groups[gi]
    if gr["n"]<150: return ""
    img=np.where(gr["m"],0,255).astype(np.uint8)
    ys,xs=np.where(gr["m"]); img=img[max(0,ys.min()-10):ys.max()+10, max(0,xs.min()-10):xs.max()+10]
    img=np.pad(img,20,constant_values=255)
    fn=f"{tmp}/g{gi}.png"; Image.fromarray(img).save(fn)
    return subprocess.run(["tesseract",fn,"stdout","-l","por","--psm","7"],capture_output=True,text=True,env={**os.environ,"OMP_THREAD_LIMIT":"1"}).stdout.strip()
with ThreadPoolExecutor(4) as ex: texts=list(ex.map(ocr,range(len(groups))))
res=[{"s":round(g["start"]/fps,3),"e":round((g["end"]+1)/fps,3),"t":t} for g,t in zip(groups,texts)]
json.dump(res,open(out,"w"),ensure_ascii=False,indent=0)
for x in res: print(x["s"],x["e"],x["t"])
