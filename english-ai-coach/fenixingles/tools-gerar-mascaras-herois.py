import json, sys, colorsys
import numpy as np
from PIL import Image, ImageDraw
C="/home/user/Esp32-envguard/english-ai-coach/fenixingles/public/characters/"
OUT=sys.argv[1]
# per hero: eye y center, head (cx,cy,r) for hair, suit hue ranges, neck y
CFG={
 "nova": dict(eyes=[(241,111,11),(290,109,11)], ex=(200,320), eye_y=110, head=(265,110,95), neck=165, suit=[(165,205)], smin=.28),
 "tita": dict(eyes=[(232,94,10),(277,85,10)], ex=(200,310), eye_y=92,  head=(255,85,80),  neck=140, suit=[(205,250)], smin=.28),
 "raio": dict(eyes=[(291,100,11),(340,91,11)], ex=(260,370), eye_y=95,  head=(275,100,105), neck=160, suit=[(245,305)], smin=.18),
 "fenix":dict(eyes=[(235,86,10),(277,92,10)], ex=(200,310), eye_y=90,  head=(255,85,80),  neck=140, suit=[(345,360),(0,52)], smin=.6),
 "astra":dict(eyes=[(221,107,10),(262,94,10)], ex=(195,305), eye_y=105, head=(250,100,85), neck=160, suit=[(285,345)], smin=.22),
 "onda": dict(eyes=[(265,94,10),(304,102,10)], ex=(215,330), eye_y=90,  head=(270,90,85),  neck=150, suit=[(180,232)], smin=.28),
}
def hsv(a):
    r,g,b=[a[...,i]/255. for i in range(3)]
    mx=np.max(a[...,:3],2)/255.; mn=np.min(a[...,:3],2)/255.; d=mx-mn
    h=np.zeros_like(mx)
    m=d>1e-6
    rc=np.where(m,(mx-r)/np.where(m,d,1),0); gc=np.where(m,(mx-g)/np.where(m,d,1),0); bc=np.where(m,(mx-b)/np.where(m,d,1),0)
    h=np.where(r==mx,bc-gc,np.where(g==mx,2+rc-bc,4+gc-rc)); h=(h/6)%1*360; h=np.where(m,h,0)
    s=np.where(mx>0,d/np.where(mx>0,mx,1),0); return h,s,mx
def label_components(mask):
    # simple flood labeling
    H,W=mask.shape; lab=np.zeros((H,W),int); n=0; comps=[]
    for y in range(H):
        for x in range(W):
            if mask[y,x] and not lab[y,x]:
                n+=1; st=[(y,x)]; lab[y,x]=n; pts=[]
                while st:
                    cy,cx=st.pop(); pts.append((cy,cx))
                    for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
                        yy,xx=cy+dy,cx+dx
                        if 0<=yy<H and 0<=xx<W and mask[yy,xx] and not lab[yy,xx]: lab[yy,xx]=n; st.append((yy,xx))
                comps.append(pts)
    return comps
meta={}
for k,c in CFG.items():
    im=Image.open(C+f"heroi-{k}.webp").convert("RGBA"); a=np.asarray(im).astype(float); H,W=a.shape[:2]
    h,s,v=hsv(a); al=a[...,3]>200
    yy,xx=np.mgrid[0:H,0:W]
    L=np.zeros((H,W),np.uint8)
    eyes=np.zeros((H,W),bool)
    for ex_,ey_,er_ in c["eyes"]:
        eyes|=al&(((yy-ey_)**2+(xx-ex_)**2)<er_*er_)&~((s<.2)&(v>.8))&(v<.8)
    # skin
    hh=h
    hx,hy,hr=c['head']; headm=(((yy-hy)**2+(xx-hx)**2)<hr*hr)&(yy<c['neck'])
    smax=np.where(headm,.88,.735 if k=='tita' else .7)
    skin0=al&(((hh>=3)&(hh<=38)))&(s>.18)&(s<.7)&(v>.72)
    eyes&=~skin0
    skin=al&(((hh>=3)&(hh<=38)))&(s>.18)&(s<smax)&(v>.55)&~eyes
    # hair: in head circle, dark warm
    hx,hy,hr=c["head"]
    inhead=((yy-hy)**2+(xx-hx)**2)<hr*hr
    if k=="raio": inhead|=(xx>175)&(xx<420)&(yy<250)
    vmax=.62 if k=="fenix" else .5
    hair=al&inhead&((yy<c["neck"])|(k=="raio"))&(((hh<=45)|(hh>=340)))&(v<vmax)&(s>.2)&~eyes&~skin
    # tira do cabelo as linhas do rosto (buracos dentro da pele)
    ns=Image.fromarray(((~skin)*255).astype(np.uint8)).copy()
    for x0 in range(0,W,3):
        for y0 in (0,H-1):
            if ns.getpixel((x0,y0))==255: ImageDraw.floodfill(ns,(x0,y0),128)
    for y0 in range(0,H,3):
        for x0 in (0,W-1):
            if ns.getpixel((x0,y0))==255: ImageDraw.floodfill(ns,(x0,y0),128)
    inside=np.asarray(ns)==255
    hair&=~inside
    # suit
    hm=np.zeros((H,W),bool)
    for lo,hi in c["suit"]: hm|=(hh>=lo)&(hh<=hi)
    suit=al&hm&(s>c["smin"])&~eyes&~hair&~skin
    if k=="fenix": suit&=~(inhead&(yy<c["neck"]))
    for i,m in ((4,skin),(2,hair),(1,suit)): L[m]=i
    from PIL import ImageFilter
    L=np.asarray(Image.fromarray(L).filter(ImageFilter.ModeFilter(5))).copy()
    L[~al]=0; L[eyes]=3
    ref={}
    for i,name in ((1,"suit"),(2,"hair"),(3,"eyes"),(4,"skin")):
        m=L==i
        if m.sum()==0: continue
        ang=np.deg2rad(h[m]); hmean=(np.rad2deg(np.arctan2(np.sin(ang).mean(),np.cos(ang).mean()))+360)%360
        rgb=a[m][:,:3]/255.; mx=rgb.max(1); mn=rgb.min(1); l=(mx+mn)/2; d=mx-mn
        sl=np.where(d>0,d/(1-np.abs(2*l-1)+1e-6),0)
        ref[name]=[round(float(hmean),1),round(float(np.median(sl)),3),round(float(l.mean()),3)]
    meta[k]=ref
    Image.fromarray(np.dstack([L*60,np.full_like(L,0),np.full_like(L,0)]).astype(np.uint8),"RGB").save(f"{OUT}/heroi-{k}-mask.png",optimize=True)
    # viz
    col=np.array([[0,0,0,0],[255,0,255,170],[0,255,0,170],[255,255,0,230],[0,160,255,120]],np.uint8)
    ov=Image.fromarray(col[L]); vi=im.copy(); vi.alpha_composite(ov); bg=Image.new("RGBA",im.size,(255,255,255,255)); bg.alpha_composite(im)
    pair=Image.new("RGB",(W*2,H),"white"); pair.paste(bg.convert("RGB"),(0,0)); b2=Image.new("RGBA",im.size,(255,255,255,255)); b2.alpha_composite(vi); pair.paste(b2.convert("RGB"),(W,0)); pair.resize((W,H//2)).save(f"seg/viz-{k}.png")
json.dump(meta,open("seg/meta.json","w"),indent=0); print(json.dumps(meta))
