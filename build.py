import re, sys, os, asyncio
D = os.path.dirname(os.path.abspath(__file__))
ICONS = {
 'bulb':('#0e7c86','<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>'),
 'target':('#34507a','<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>'),
 'key':('#b8860b','<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3 21 2M16 7l3 3M18 5l2 2"/>'),
 'link':('#2e7d32','<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>'),
 'pin':('#2449a8','<path d="M12 17v5M8 4h8M9 4v6l-3 4h12l-3-4V4"/>'),
 'alert':('#b3261e','<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>'),
 'spark':('#c98a00','<path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/>'),
 'flask':('#5d34a0','<path d="M9 3h6M10 3v6L4 19a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3L14 9V3"/>'),
 'help':('var(--c)','<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>'),
 'star':('#d9a521','<path d="M12 2l3.1 6.3 6.9 1-5 4.8 1.2 6.9-6.2-3.2-6.2 3.2 1.2-6.9-5-4.8 6.9-1z"/>'),
 'pencil':('var(--c)','<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>'),
 'check':('#2e7d32','<path d="M20 6 9 17l-5-5"/>'),
 'book':('#0b3c5d','<path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/>'),
 'leaf':('#1c7a4a','<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6"/>'),
 'award':('#d9a521','<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>'),
}
BOXICON = {'idea':'bulb','goals':'target','def':'key','analogy':'link','remember':'pin','warn':'alert',
           'trick':'spark','fact':'flask','why':'help','tip':'leaf','dyk':'bulb'}
def icon(n, size=None):
    col, p = ICONS[n]
    st = f'background:{col}' + (f';width:{size}px;height:{size}px' if size else '')
    return f'<span class="ic" style="{st}"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">{p}</svg></span>'
def proc(h):
    h = re.sub(r'<box type="(\w+)" t="([^"]*)">', lambda m: f'<div class="box {m[1]}"><div class="bh">{icon(BOXICON[m[1]])}{m[2]}</div>', h)
    h = h.replace('</box>', '</div>')
    # keep headings together with what follows
    h = re.sub(r'(<div class="chap-band(?: pb)?"[^>]*>.*?</h2></div></div>\s*)(<div class="lesson">.*?</h3></div>)?', lambda m: f'<div class="keep pb">{m[1]}{(m[2] or "").replace(chr(34)+"lesson"+chr(34), chr(34)+"lesson first"+chr(34))}</div>', h, flags=re.S)
    h = re.sub(r'(<div class="lesson">.*?</h3></div>)', r'<div class="keep pb">\1</div>', h, flags=re.S)
    h = re.sub(r'(<h4 class="sub">.*?</h4>)', r'<div class="keep">\1</div>', h, flags=re.S)
    h = re.sub(r'(<div class="eh">.*?</div>)(<div class="eb">\s*)(<h5>.*?</h5>)?', lambda m: f'<div class="keep">{m[1]}</div>{m[2]}{m[3] or ""}', h, flags=re.S)
    h = re.sub(r'(?<!</div>)(<h5>[^<]*</h5>)(?=\s*<ol)', r'<div class="keep">\1</div>', h)
    h = re.sub(r'\[\[(\w+)\]\]', lambda m: icon(m[1]), h)
    return h
parts = sys.argv[1:] if len(sys.argv) > 1 else ['front']+[f'ch{i}' for i in range(1,13)]+['back']
import json
import fillers3 as fillers
MODE = os.environ.get('MARK')=='1'
gaps = {} if MODE or not os.path.exists(D+'/gaps.json') else json.load(open(D+'/gaps.json'))
zooms = json.load(open(D+'/zoom.json')) if os.path.exists(D+'/zoom.json') else {}
BID=[0]
def blocks(h, ch):
    m = re.search(r'<div class="ch-open pb">.*?<h2>(.*?)</h2>', h, flags=re.S)
    if m and '<div class="box why">' in h:
        band = f'<div class="keep pb"><div class="rv-band">{icon("check")}<div><small>مراجعة الفصل</small><h2>{m[1]}</h2></div></div></div>'
        h = h.replace('<div class="box why">', band+'<div class="box why">', 1)
    i = h.find('<section'); j = h.rfind('</section>')
    if i < 0 or 'class="final"' in h[i:i+60]: return h
    oe = h.find('>', i)+1; inner = h[oe:j]
    idx = [m.start() for m in re.finditer(r'<div class="(?:keep pb|ch-open pb)">', inner)]
    if not idx: return h
    new = inner[:idx[0]]
    for a_, b_ in zip(idx, idx[1:]+[len(inner)]):
        k = BID[0]; BID[0] += 1
        z = zooms.get(str(k), 1)
        if MODE: ins = f'<div class="mk">MK{k}MK</div>'
        else: ins = fillers.make(ch, k, gaps.get(str(k), 0)/z)
        new += f'<div class="blk" style="zoom:{z}">{inner[a_:b_]}{ins}</div>'
    return h[:oe]+new+h[j:]
body=''
for p in parts:
    if not os.path.exists(f'{D}/{p}.html'): continue
    h = proc(open(f'{D}/{p}.html', encoding='utf8').read())
    ch = int(p[2:]) if p.startswith('ch') else 0
    body += blocks(h, ch) if ch else h
html = f'''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>ملزمة علم الأحياء – الثالث المتوسط</title>
<style>{open(D+"/style.css",encoding="utf8").read()}</style></head><body>{body}</body></html>'''
open(f'{D}/malzama.html','w',encoding='utf8').write(html)

FOOT = '''<div style="width:100%;font-family:Cairo;font-size:8.5pt;direction:rtl;padding:0 13mm;display:flex;justify-content:space-between;align-items:center;color:#5b6475">
<span>ملزمة علم الأحياء • الصف الثالث المتوسط</span>
<span style="color:#0b3c5d;font-weight:700">إعداد الأستاذ: حسن مجتبى الطويل</span>
<span style="background:#0b3c5d;color:#fff;border-radius:10px;padding:1px 10px;font-weight:700"><span class="pageNumber"></span></span></div>'''

open(D+'/foot.html','w',encoding='utf8').write(FOOT)
print('ok')
