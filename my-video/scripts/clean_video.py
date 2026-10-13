"""Remove legendas/textos queimados no video original (inpainting).

Uso: python3 scripts/clean_video.py ORIGINAL.mp4 public/base.mp4
"""
import subprocess, numpy as np, sys, cv2
F, OUT = sys.argv[1], sys.argv[2]
W,H=1080,1920; fps=30000/1001
dec=subprocess.Popen(["ffmpeg","-v","error","-i",F,"-f","rawvideo","-pix_fmt","bgr24","-"],stdout=subprocess.PIPE)
enc=subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","bgr24","-s",f"{W}x{H}","-r","30000/1001","-i","-","-i",F,
  "-map","0:v","-map","1:a","-c:v","libx264","-crf","14","-preset","medium","-pix_fmt","yuv420p","-c:a","copy",OUT],stdin=subprocess.PIPE)
k=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(9,9))
regions=[(1085,1225,0,W,0,99)]           # caption band + end URL
regions.append((270,430,40,720,4.6,9.6))  # lower third
i=0
while True:
    buf=dec.stdout.read(W*H*3)
    if len(buf)<W*H*3: break
    f=np.frombuffer(buf,np.uint8).reshape(H,W,3).copy(); t=i/fps
    for y0,y1,x0,x1,t0,t1 in regions:
        if not (t0<=t<=t1): continue
        roi=f[y0:y1,x0:x1].astype(int); b,g,r=roi[...,0],roi[...,1],roi[...,2]
        m=(((r>170)&(g>170)&(b>170))|((b>150)&(b-r>60)&(b>g))).astype(np.uint8)*255
        if m.sum()<255*40: continue
        m=cv2.dilate(m,k,iterations=1)
        f[y0:y1,x0:x1]=cv2.inpaint(np.ascontiguousarray(f[y0:y1,x0:x1]),m,6,cv2.INPAINT_TELEA)
    enc.stdin.write(f.tobytes()); i+=1
enc.stdin.close(); enc.wait(); print("frames",i)
