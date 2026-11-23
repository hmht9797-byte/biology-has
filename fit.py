import re,json,os,subprocess
D=os.path.dirname(os.path.abspath(__file__))
def measure():
    subprocess.run(['pdftotext','-bbox',D+'/body.pdf',D+'/mk.html'],check=True)
    t=open(D+'/mk.html').read(); pages=t.split('<page ')
    res={}
    for pi,pg in enumerate(pages[1:],1):
        for m in re.finditer(r'yMin="([\d.]+)" xMax="[\d.]+" yMax="([\d.]+)">MK(\d+)MK</word>',pg):
            res[int(m[3])]=(pi,(841.92-18*72/25.4-float(m[1]))/72*25.4)
    return res
if __name__=='__main__':
    import sys
    res=measure(); mode=sys.argv[1]
    if mode=='gaps':
        json.dump({str(k):round(v[1],1) for k,v in res.items()},open(D+'/gaps.json','w'))
        print('gaps',sorted(round(v[1]) for v in res.values()))
    else:
        zooms=json.load(open(D+'/zoom.json')) if os.path.exists(D+'/zoom.json') else {}
        prev=None; changed=0
        for k in sorted(res):
            pg,gap=res[k]
            n = pg-prev if prev else 1
            prev=pg
            last=265-gap
            if n>=2 and last<75:
                total=(n-1)*265+last
                z0=float(zooms.get(str(k),1))
                z=round(z0*((n-1)*265-8)/total,3)
                if z>=0.84: zooms[str(k)]=z; changed+=1; print('block',k,'pages',n,'last',round(last),'zoom',z)
        json.dump(zooms,open(D+'/zoom.json','w')); print('changed',changed)
