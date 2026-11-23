import re, json, unicodedata
def norm(s):
    s=re.sub(r'[ً-ْـ‌‏]','',s)
    s=s.replace('أ','ا').replace('إ','ا').replace('آ','ا').replace('ة','ه').replace('ى','ي').replace('ؤ','و').replace('ئ','ي')
    return re.sub(r'[\s\(\)\[\]،:؟?\-–_.]','',s)
papers=[]; cur=None
import os
_here = os.path.dirname(os.path.abspath(__file__))   # the grade-6 question papers now live inside the project, so it builds anywhere
for line in open(_here + '/qbank/wiz6_papers.md', encoding='utf8'):
    line=line.rstrip('\n')
    if line.startswith('## '):
        cur={'h':line[3:],'t':''}; papers.append(cur)
    elif cur is not None: cur['t']+=line+' '
for p in papers:
    p['n']=norm(p['t'])
    p['seg']=[norm(x) for x in re.split(r'(?=س\d+:)|(?=\s[أبجدهـ]\)\s)',p['t']) if x.strip()]
ANCH={'عرّف':['عرف'],'علل':['علل','فسر'],'فسّر':['فسر','علل'],'وظيفة':['وظيف','اهميه'],'موقع':['موقع'],'منشأ':['منشا'],'قارن':['قارن','الفرق'],'أكمل':['املا','اكمل','ضعما'],'ارسم':['ارسم','بالرسم'],'نوع نسيج':['نوعالنسيج','نوعاوطبيعه','نوعالنسيج'],'ماذا يحدث':['ماذايحدث','ماذاينتج'],'ماذا ينتج':['ماذاينتج','ماذايحدث','نتايج','نتائج'],'اشرح':['اشرح','وضح','كيف','تكلم'],'ما الطراز':['الطرزالوراثيه','الطرازالوراثي'],'ما نوع الوراثة':['نوعالوراثه','نوعالمورثه'],'ما نوع المورثة':['نوعالمورثه','نوعالوراثه'],'حدّد المسؤول':['المسوول','المسؤول'],'ما مميزات':['ميزات','ميزه'],'دور/طور':['دورا','طورا','دورايطور'],'ما المجموعة':['المجموعهالكروموسوميه'],'نوع التكاثر':['نوعالتكاثر','طريقهالتكاثر'],'عدّد':['عدد','اذكر','الصعوبات'],'ما أحداث':['احداث']}
def match(typ,keys,p):
    a=ANCH.get(typ)
    if not a: return any(k in p['n'] for k in keys)
    return any(any(x in sg for x in a) and any(k in sg for k in keys) for sg in p['seg'])
def label(h):
    m=re.match(r'(\d{4})\s*[–-]\s*(.*)',h)
    if m: y,r=m[1],m[2]
    else: y,r='',h
    r=re.sub(r'\(.*?\)','',r).strip()
    k='الدور الأول' in r and 'د١' or 'الدور الثاني' in r and 'د٢' or 'الدور الثالث' in r and 'د٣' or 'التمهيدي' in r and 'تمهيدي' or r
    if 'خارج' in r: k+=' (خارج العراق)'
    if 'تكميلي' in r: k+=' تكميلي'
    if 'محاولات' in r or 'محوّلات' in r: k+=' محاولات'
    if 'مقطوعة' in h: y='؟'; k='ترويسة مقطوعة'
    return {'y':y,'r':k,'full':h}
out={}; dropped=[]
cur=None
for line in open(_here + '/qbank/wiz6.txt',encoding='utf8'):
    line=line.strip()
    if line.startswith('## '): cur=int(line[3:]); out.setdefault(cur,[]); continue
    if not line.startswith('W:'): continue
    body=line[2:].strip()
    try:
        typ,rest=body.split(' | ',1); q,rest=rest.split(' | ',1) if rest.count(' | ')>=1 and False else (rest,None)
    except: continue
    # format: type | question | answer || keys
    parts=body.split(' | ')
    typ=parts[0].strip(); rest=' | '.join(parts[1:])
    qa,_,keys=rest.partition(' || ')
    q,_,a=qa.partition(' | ')
    q=q.strip();a=a.strip();keys=[norm(k) for k in keys.split(';;') if norm(k)]
    if not q or not a or not keys: dropped.append(('nokey/empty',q)); continue
    ys=[p for p in papers if match(typ,keys,p)]
    if not ys: dropped.append(('nomatch',typ,q)); continue
    if '[' in a or 'تقدّم الحل' in a: dropped.append(('junk',q)); continue
    out[cur].append({'t':typ,'q':q,'a':a,'y':[label(p['h']) for p in ys]})
json.dump(out,open(_here + '/qbank/wiz6.json','w',encoding='utf8'),ensure_ascii=False)
print({k:len(v) for k,v in out.items()}, 'dropped',len(dropped), 'papers',len(papers))
for d in dropped: print(d)
