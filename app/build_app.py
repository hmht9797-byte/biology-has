# -*- coding: utf-8 -*-
"""Build the interactive e-booklet: app/index.html + app/chapters.json"""
import re, json, os, sys
D = os.path.dirname(os.path.abspath(__file__)); R = os.path.dirname(D)
src = open(R + '/build.py', encoding='utf8').read()
ns = {'__file__': R + '/build.py'}; exec(src[:src.index('parts =')], ns)
proc = ns['proc']
sys.path.insert(0, D)
from scenes import S

TITLES = {1:'الجهاز العصبي',2:'الجهاز الهيكلي',3:'الجهاز العضلي',4:'الجهاز الهضمي',5:'جهاز الدوران',6:'جهاز التنفس',
          7:'الجهاز البولي والإخراج',8:'الجهاز التناسلي',9:'أعضاء الحس',10:'الإفراز',11:'المناعة والأمراض',12:'نموذج امتحان شامل'}
COL = {1:'#4a3fb5',2:'#0e7c86',3:'#d2453c',4:'#e0801b',5:'#c2185b',6:'#1e7fc4',7:'#2b9a63',8:'#a3479f',9:'#00897b',10:'#6a8f1f',11:'#283593',12:'#b8860b'}

# answer key for «اختبر نفسك»
back = proc(open(R + '/back.html', encoding='utf8').read())
keys = {}
for m in re.finditer(r'<div class="box c(\d+)"[^>]*>.*?<ol[^>]*>(.*?)</ol>', back, flags=re.S):
    keys[int(m[1])] = re.findall(r'<li>(.*?)</li>', m[2], flags=re.S)


def addkeys(h, keylist):
    def addk(m):
        items = re.findall(r'<li>(.*?)</li>', m[1], flags=re.S)
        out = ''.join(f'<li>{q}<span class="a">{keylist[n] if n < len(keylist) else ""}</span></li>' for n, q in enumerate(items))
        return f'<div class="self">{m[0][m[0].index(">")+1:m[0].index("<ol>")]}<ol class="qlist">{out}</ol>'
    return re.sub(r'<div class="self">.*?<ol>(.*?)</ol>', addk, h, count=1, flags=re.S)

def finish(h):
    h = h.replace(' pb"', '"').replace('class="pb ', 'class="')
    h = re.sub(r'(<table class="t".*?</table>)', r'<div class="tw">\1</div>', h, flags=re.S)
    mcq = []
    for li in re.findall(r'<ol class="mcq">(.*?)</ol>', h, flags=re.S):
        for q in re.findall(r'<li>(.*?)</li>', li, flags=re.S):
            stem = re.sub(r'<div class="opts">.*', '', q, flags=re.S).strip()
            opts = re.findall(r'<span( class="ok")?>(.*?)</span>', q)
            if len(opts) >= 2 and any(o[0] for o in opts):
                mcq.append({'q': stem, 'o': [o[1] for o in opts], 'a': [k for k, o in enumerate(opts) if o[0]][0]})
    cards = []
    for q, a in re.findall(r'<li><b>(.*?)</b><span class="ans">(.*?)</span></li>', h, flags=re.S):
        cards.append({'q': q, 'a': a})
    for li in re.findall(r'<ol class="qlist"[^>]*>(.*?)</ol>', h, flags=re.S):
        for q, a in re.findall(r'<li>(.*?)<span class="a">(.*?)</span></li>', li, flags=re.S):
            q = re.sub(r'<[^>]+>', '', q).strip()
            if 6 < len(q) < 160 and len(a) > 3: cards.append({'q': q, 'a': a})
    return h, mcq, cards

# ---------- grade 3 ----------
g3 = []
for i in range(1, 13):
    h = proc(open(f'{R}/ch{i}.html', encoding='utf8').read())
    h = re.sub(r'(<div class="ch-open(?: pb)?">.*?</div>\s*</div>\s*</div>)', lambda m: m[1] + S[i], h, count=1, flags=re.S)
    if i in keys: h = addkeys(h, keys[i])
    h, mcq, cards = finish(h)
    g3.append({'n': i, 't': TITLES[i], 'c': COL[i], 'lab': 'المراجعة الشاملة' if i == 12 else 'الفصل', 'html': h, 'mcq': mcq, 'cards': cards})

# ---------- grade 1 (units) ----------
R1 = os.path.join(os.path.dirname(R), 'malzama')
src1 = open(R1 + '/build.py', encoding='utf8').read()
ns1 = {'__file__': R1 + '/build.py'}; exec(src1[:src1.index('parts =')], ns1)
from scenes import G1
back1 = ns1['proc'](open(R1 + '/back.html', encoding='utf8').read())
keys1 = {int(m[1]): re.findall(r'<li>(.*?)</li>', m[2], flags=re.S)
         for m in re.finditer(r'<div class="box u(\d)"[^>]*>.*?<ol[^>]*>(.*?)</ol>', back1, flags=re.S)}
T1 = {1: 'علم الأحياء والتكنولوجيا', 2: 'بناء جسم الكائن الحي', 3: 'الوراثة والتطوّر', 4: 'الإسعافات الأولية والدفاع المدني'}
C1 = {1: '#0e7c86', 2: '#7a3fa0', 3: '#d9601f', 4: '#c42a3c'}
g1 = []
for i in range(1, 5):
    h = ns1['proc'](open(f'{R1}/u{i}.html', encoding='utf8').read())
    st = h.index('<div class="unit-open'); en = h.index('\n</div>\n', st) + 8
    h = h[:en] + G1[i] + h[en:]
    if i in keys1: h = addkeys(h, keys1[i])
    h, mcq, cards = finish(h)
    g1.append({'n': i, 't': T1[i], 'c': C1[i], 'lab': 'الوحدة', 'html': h, 'mcq': mcq, 'cards': cards})

# ---------- grade 2 (chapters) ----------
R2 = os.path.join(os.path.dirname(R), 'malzama2')
src2 = open(R2 + '/build.py', encoding='utf8').read()
ns2 = {'__file__': R2 + '/build.py'}; exec(src2[:src2.index('parts =')], ns2)
from scenes import G2
back2 = ns2['proc'](open(R2 + '/back.html', encoding='utf8').read())
lists2 = [re.findall(r'<li>(.*?)</li>', m, flags=re.S) for m in re.findall(r'<div class="box c\d+"[^>]*>.*?<ol[^>]*>(.*?)</ol>', back2, flags=re.S)]
T2 = {1: 'علم التصنيف', 2: 'كيف تُصنَّف الكائنات الحية؟', 3: 'الكائنات الحية البسيطة', 4: 'مملكة النباتات', 5: 'مملكة الحيوانات', 6: 'البيئة ومكوّناتها', 7: 'التوازن في النظام البيئي', 8: 'نموذج امتحان شامل'}
C2 = {1: '#4a3fb5', 2: '#0e7c86', 3: '#e0801b', 4: '#2b9a63', 5: '#d2453c', 6: '#1e7fc4', 7: '#c2185b', 8: '#b8860b'}
g2 = []
for i in range(1, 9):
    h = ns2['proc'](open(f'{R2}/ch{i}.html', encoding='utf8').read())
    if i in G2: h = re.sub(r'(<div class="ch-open(?: pb)?">.*?</div>\s*</div>\s*</div>)', lambda m: m[1] + G2[i], h, count=1, flags=re.S)
    if i <= len(lists2): h = addkeys(h, lists2[i-1])
    h, mcq, cards = finish(h)
    g2.append({'n': i, 't': T2[i], 'c': C2[i], 'lab': 'المراجعة الشاملة' if i == 8 else 'الفصل', 'html': h, 'mcq': mcq, 'cards': cards})

# ---------- grade 6 (scientific) ----------
R6 = os.path.join(os.path.dirname(R), 'malzama6')
src6 = open(R6 + '/build.py', encoding='utf8').read()
ns6 = {'__file__': R6 + '/build.py'}; exec(src6[:src6.index('parts =')], ns6)
T6 = {1: 'الخلية', 2: 'الأنسجة', 3: 'التكاثر', 4: 'التكوين الجنيني', 5: 'الوراثة', 6: 'المراجعة الشاملة والنماذج'}
C6 = {1: '#4a3fb5', 2: '#0e7c86', 3: '#e0801b', 4: '#c2185b', 5: '#d2453c', 6: '#b8860b'}
g6 = []
for i in range(1, 7):
    h = ns6['proc'](open(f'{R6}/ch{i}.html', encoding='utf8').read())
    from scenes import G6
    if i in G6: h = re.sub(r'(<div class="ch-open(?: pb)?">.*?</div>\s*</div>\s*</div>)', lambda m: m[1] + G6[i], h, count=1, flags=re.S)
    h, mcq, cards = finish(h)
    g6.append({'n': i, 't': T6[i], 'c': C6[i], 'lab': 'المراجعة الشاملة' if i == 6 else 'الفصل', 'html': h, 'mcq': mcq, 'cards': cards})


# ---------- grade 4 (scientific): ecology & behaviour ----------
sys.path.insert(0, os.path.join(R, 'g4'))
import importlib
_FULL = [importlib.import_module('full%d' % i) for i in range(1, 11)]
CH4 = {}
for _m in _FULL: CH4.update(_m.CH)
T4 = {1: 'تصنيف الكائنات الحية', 2: 'علم البيئة والنظام البيئي', 3: 'السلسلة الغذائية ودورة العناصر', 4: 'المواطن البيئية والمناطق الأحيائية', 5: 'العوامل المؤثرة في البيئة',
      6: 'تلاؤم الحيوان مع البيئة', 7: 'تلاؤم النبات مع البيئة', 8: 'التلاؤم مع أنماط الحياة', 9: 'العلاقات والسلوك والتعاقب', 10: 'التلوث البيئي'}
C4 = {1: '#4a3fb5', 2: '#0e7c86', 3: '#2e7d32', 4: '#e0801b', 5: '#d2453c', 6: '#1e7fc4', 7: '#2b9a63', 8: '#a3479f', 9: '#c2185b', 10: '#6a8f1f'}
g4 = []
for i in range(1, 11):
    h = ns6['proc'](CH4[i])
    h, mcq, cards = finish(h)
    g4.append({'n': i, 't': T4[i], 'c': C4[i], 'lab': 'الفصل', 'html': h, 'mcq': mcq, 'cards': cards})

# ---------- extra question banks (qbank/gN.txt) ----------
import random, hashlib
def load_bank(path):
    bank = {}; cur = None
    for line in open(path, encoding='utf8'):
        line = line.strip()
        if line.startswith('## '): cur = bank.setdefault(int(line[3:]), {'mcq': [], 'cards': []}); continue
        if not line or cur is None: continue
        t, body = line[0], line[3:].strip()
        rnd = random.Random(hashlib.md5(body.encode()).hexdigest())
        if t == 'M':
            parts = [x.strip() for x in body.split(' | ')]
            q, opts = parts[0], parts[1:]
            order = list(range(len(opts))); rnd.shuffle(order)
            cur['mcq'].append({'q': q + ':', 'o': [opts[k] for k in order], 'a': order.index(0)})
        elif t in 'TF':
            st, _, fix = body.partition(' || ')
            cur['mcq'].append({'q': 'صح أم خطأ؟ ' + st.strip(), 'o': ['صح', 'خطأ'], 'a': 0 if t == 'T' else 1, 'tf': 1, **({'x': fix.strip()} if fix else {})})
        elif t == 'C':
            q, _, a = body.partition(' || ')
            cur['cards'].append({'q': q.strip(), 'a': a.strip()})
    return bank
def merge(chs, bank):
    for c in chs:
        b = bank.get(c['n'])
        if not b: continue
        seen = {re.sub(r'<[^>]+>|[\s:؟?]', '', m['q']) for m in c['mcq']}
        c['mcq'] += [m for m in b['mcq'] if re.sub(r'[\s:؟?]', '', m['q']) not in seen]
        seenc = {re.sub(r'<[^>]+>|\s', '', k['q']) for k in c['cards']}
        c['cards'] += [k for k in b['cards'] if re.sub(r'\s', '', k['q']) not in seenc]
merge(g1, load_bank(D + '/qbank/g1.txt')); merge(g2, load_bank(D + '/qbank/g2.txt')); merge(g3, load_bank(D + '/qbank/g3.txt')); merge(g6, load_bank(D + '/qbank/g6.txt')); merge(g4, load_bank(D + '/qbank/g4.txt'))
import subprocess; subprocess.run(['python3', D + '/build_wiz.py'], check=True)
_w = json.load(open(D + '/qbank/wiz6.json', encoding='utf8'))
WZP = {'عرّف':'عرّف: ','علل':'علّل: ','فسّر':'فسّر: ','قارن':'قارن بين ','وظيفة':'ما وظيفة (أهمية) ','موقع':'ما موقع ','منشأ':'ما منشأ ','أكمل':'أكمل: ','نوع نسيج':'ما نوع النسيج: ','نوع التكاثر':'ما نوع التكاثر: ','ارسم':'ارسم: ','اشرح':'اشرح: ','عدّد':'عدّد: ','ما الطراز':'ما الطراز ','ما المجموعة':'ما المجموعة ','ما نوع الوراثة':'ما نوع الوراثة: ','حدّد المسؤول':'حدّد المسؤول ','ماذا ينتج':'ماذا ينتج ','ماذا يحدث':'ماذا يحدث: ','ما أحداث':'ما أحداث ','ما مميزات':'ما مميزات ','ما هو':'ما هو ','ما الخطوات':'ما الخطوات ','ما طرق':'ما طرق ','ما الحالات':'ما الحالات ','ما أهم':'ما أهم ','ما الصفات':'ما الصفات ','ما المقصود':'ما المقصود بـ','احسب':'احسب: ','إلى ماذا تشير':'إلى ماذا تشير: '}
WZB = {'عرّف':'تعريف','علل':'تعليل','فسّر':'تعليل','قارن':'مقارنة','وظيفة':'وظيفة','موقع':'موقع','منشأ':'منشأ','أكمل':'أكمل الفراغ','نوع نسيج':'نوع النسيج','نوع التكاثر':'نوع التكاثر','ارسم':'رسم','مسألة':'مسألة وراثية','ما الطراز':'وراثة','ما نوع الوراثة':'وراثة','ما نوع المورثة':'وراثة','حدّد المسؤول':'حدّد المسؤول','دور/طور':'دور/طور','ما المجموعة':'مجموعة كروموسومية','اشرح':'شرح','ما أحداث':'شرح','ماذا يحدث':'ماذا يحدث','ماذا ينتج':'ماذا ينتج','ما هو':'تتابع القواعد','عدّد':'عدّد','ما مميزات':'مميزات'}
for c in g6:
    items = []
    for k in _w.get(str(c['n']), []):
        ys = []
        for y in k['y']:
            s_ = (y['y'] + ' ' + y['r']).strip()
            if s_ not in ys: ys.append(s_)
        t0 = k['t']; q0 = k['q']
        q0 = WZP.get(t0, '') + q0
        items.append({'t': WZB.get(t0, 'عام'), 'q': q0, 'a': k['a'], 'y': ys, 'n': len(ys)})
    items.sort(key=lambda x: -x['n'])
    if items: c['wz'] = items

# ---------- grade 3 ministerial questions (teacher's file, see build_wiz3.py) ----------
subprocess.run(['python3', D + '/build_wiz3.py'], check=True)
_w3 = json.load(open(D + '/qbank/wiz3.json', encoding='utf8'))
for c in g3:
    items = _w3.get(str(c['n']), [])
    if items: c['wz'] = items

# ---------- required-diagrams gallery ----------
FIGT = {
 (1,1):['المجهر الضوئي المركّب وأجزاؤه','المراتب التصنيفية'],
 (1,2):['الخلية الحيوانية ومكوّناتها','الخلية النباتية ومكوّناتها','دورة الخلية','أطوار الانقسام الخيطي'],
 (1,3):['تركيب الكروموسوم','من الكروموسوم إلى الجين والـ DNA','تركيب الـ DNA (الحلزون المزدوج)'],
 (2,1):['مراتب التصنيف السبعة (القط الأليف)'],
 (2,2):['التماثل والمضاهاة','الممالك الخمس (تصنيف وايتكر)','أشكال البكتريا'],
 (2,3):['الأميبا','البراميسيوم','اليوغلينا'],
 (2,4):['مقطع عرضي في الورقة'],
 (2,5):['دورة حياة الضفدع'],
 (2,6):['المكوّنات الحية في النظام البيئي','دورة الكاربون – الأوكسجين','دورة الماء'],
 (2,7):['الاحتباس الحراري'],
 (3,1):['الخلية العصبية'],
 (3,2):['التركيب المجهري للعظم','المظهر الخارجي للعظم (الفخذ)','تركيب السن','أقسام العمود الفقري','تركيب الفقرة'],
 (3,3):['أنواع العضلات الثلاثة'],
 (3,4):['الجهاز الهضمي','كبد الإنسان','الأمعاء الغليظة','الزغابة المعوية'],
 (3,5):['خلايا الدم','تركيب القلب'],
 (3,6):['الجهاز التنفسي'],
 (3,7):['مقطع طولي في الكلية','الجهاز البولي','تركيب الأظفر','طبقات الجلد'],
 (3,8):['البيضة والنطفة'],
 (3,9):['مناطق التذوق في اللسان','تركيب العين','عيوب البصر وعلاجها','تركيب الأذن'],
 (3,10):['مواقع الغدد الصم','الغدة الدرقية','تركيب البنكرياس'],
 (3,11):['أنواع المناعة','تركيب الفيروس'],
 (6,1):['الخلية بدائية النواة (البكتيريا)','الغشاء البلازمي (الفسيفساء المائع)','الخلية الحيوانية وعضياتها','تركيب المايتوكوندريا','تركيب البلاستيدة الخضراء','تركيب النواة','تأثير المحاليل في الخلايا','أطوار الانقسام الخيطي'],
 (6,2):['أنواع النسيج الأساس','النسيج الظهاري البسيط','مقطع في العظم المصمت','العصبونة'],
 (6,3):['تركيب الزهرة','تكاثر البلعم البكتيري','الكيس الجنيني','تركيب النطفة'],
 (6,4):['الزايكوت والتفلج والأريمة والمعيدة'],
 (6,5):['مربع بونيت للهجين الأحادي','نموذج DNA'],
}
HIFZ = {'الخلية بدائية النواة (البكتيريا)','تركيب المايتوكوندريا','تركيب البلاستيدة الخضراء','الخلية الحيوانية وعضياتها','أطوار الانقسام الخيطي','مقطع في العظم المصمت','العصبونة','تركيب الزهرة','الكيس الجنيني','تركيب النطفة','مراحل التكوين الجنيني المبكر','نموذج DNA','النسيج الظهاري البسيط','المظهر الخارجي للعظم (الفخذ)','كبد الإنسان','الأمعاء الغليظة','مقطع طولي في الكلية','تركيب الأظفر','تركيب البنكرياس',
        'الخلية النباتية ومكوّناتها','أطوار الانقسام الخيطي','دورة الكاربون – الأوكسجين','تركيب العين','تركيب الأذن','تركيب القلب',
        'الجهاز التنفسي','الجهاز الهضمي','الخلية العصبية','تركيب الفقرة','تركيب السن','طبقات الجلد','مقطع عرضي في الورقة',
        'الخلية الحيوانية ومكوّناتها','المجهر الضوئي المركّب وأجزاؤه','تركيب الكروموسوم','الأميبا','البراميسيوم','اليوغلينا'}
figs = []
for gid, chs in ((1, g1), (2, g2), (3, g3), (4, g4), (6, g6)):
    for c in chs:
        names = FIGT.get((gid, c['n']), [])
        for i, m in enumerate(re.finditer(r'<div class="fig[^"]*">\s*(<svg.*?</svg>)\s*(?:<p class="figcap">(.*?)</p>)?', c['html'], flags=re.S)):
            t = names[i] if i < len(names) else f"شكل من {c['t']}"
            if gid in (4, 6) and m[2]:
                t = re.sub(r'\s*\([^()]*\)\s*$', '', re.sub(r'^شكل[^:]*:\s*', '', re.sub(r'<[^>]+>', '', m[2]))).strip() or t
            figs.append({'g': gid, 'ch': c['n'], 'ct': c['t'], 'c': c['c'], 't': t, 'h': 1 if t in HIFZ else 0, 'svg': m[1]})

book = {'grades': [
    {'id': 1, 'name': 'الأول المتوسط', 'sub': 'علم الأحياء، ٤ وحدات', 'c': '#0e7c86', 'chapters': g1},
    {'id': 2, 'name': 'الثاني المتوسط', 'sub': 'التصنيف والتنوّع والبيئة، ٧ فصول', 'c': '#127a5d', 'chapters': g2},
    {'id': 3, 'name': 'الثالث المتوسط', 'sub': 'الإنسان وصحته، ١١ فصلًا', 'c': '#5b2a86', 'chapters': g3},
    {'id': 4, 'name': 'الرابع العلمي', 'sub': 'علم البيئة والسلوك، ١٠ فصول', 'c': '#2e7d32', 'chapters': g4},
    {'id': 6, 'name': 'السادس العلمي', 'sub': 'الموسوعة الهجينة، ٥ فصول + نماذج', 'c': '#b8860b', 'chapters': g6}]}
book['figs'] = figs
# chapter / grade colours carry white text (number tiles, grade chips): darken any that is under 4.5:1 on white, keeping its hue
def _lum(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]; c = [x / 12.92 if x <= .03928 else ((x + .055) / 1.055) ** 2.4 for x in c]
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]
def _ok(h): return 1.05 / (_lum(h) + .05) >= 4.5
def _dark(h):
    r, g, b_ = (int(h[i:i + 2], 16) for i in (1, 3, 5)); k = 1.0
    while not _ok('#%02x%02x%02x' % (round(r * k), round(g * k), round(b_ * k))): k -= .01
    return '#%02x%02x%02x' % (round(r * k), round(g * k), round(b_ * k))
DARK = {}
def _fix(o):
    if isinstance(o, dict):
        for k, v in o.items():
            if k == 'c' and isinstance(v, str) and len(v) == 7 and v.startswith('#') and not _ok(v.lower()): o[k] = DARK.setdefault(v.lower(), _dark(v.lower()))
            else: _fix(v)
    elif isinstance(o, list):
        for v in o: _fix(v)
_fix(book); print('darkened chapter colours:', DARK)
json.dump(book, open(D + '/chapters.json', 'w', encoding='utf8'), ensure_ascii=False)

css = open(R + '/style.css', encoding='utf8').read()
css = re.sub(r'@page[^{]*\{[^}]*\}', '', css)
shell = open(D + '/shell.html', encoding='utf8').read().replace('/*BOOKCSS*/', css).replace('/*THEMECSS*/', open(D + '/theme.css', encoding='utf8').read()).replace('/*EXTRAJS*/', open(D + '/lab3d.js', encoding='utf8').read() + '\n' + open(D + '/extras.js', encoding='utf8').read() + '\n' + open(D + '/wiz.js', encoding='utf8').read())
open(D + '/index.html', 'w', encoding='utf8').write(shell)
for nm, gg in (('g1', g1), ('g2', g2), ('g3', g3), ('g4', g4), ('g6', g6)): print(nm, 'mcq', sum(len(c['mcq']) for c in gg), 'cards', sum(len(c['cards']) for c in gg))
print('json KB', os.path.getsize(D+'/chapters.json')//1024)
