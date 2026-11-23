# -*- coding: utf-8 -*-
"""Insert the missing book figures (for memorization) into the booklets."""
import re
F = 'font-family="Tajawal" font-size="15" font-weight="700"'

def lead(pts):
    """pts: list of (x1,y1,x2,y2) leader lines (dot at x1,y1)."""
    s = '<g stroke="#d9a521" stroke-width="2" fill="#d9a521">'
    for x1, y1, x2, y2 in pts: s += f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"/><circle cx="{x1}" cy="{y1}" r="4"/>'
    return s + '</g>'

def labels(items):
    """items: (x,y,text,anchor)"""
    return '<g fill="#1d2433">' + ''.join(f'<text x="{x}" y="{y}" text-anchor="{a}">{t}</text>' for x, y, t, a in items) + '</g>'

def fig(vb, w, h, body, cap):
    return f'''<div class="fig"><svg width="{w}" height="{h}" viewBox="{vb}" {F}>{body}</svg></div>
<p class="figcap">{cap}</p>'''

BONE = fig("-190 0 760 330", 600, 270, '''
<path d="M60 60 C30 30 40 0 80 10 C100 -5 140 0 140 30 C150 55 130 70 125 85 L125 245 C130 260 150 275 140 300 C140 330 100 335 80 320 C40 330 30 300 60 270 C70 255 75 245 75 245 L75 85 C75 75 70 70 60 60Z" fill="#fbf3e2" stroke="#9e7a4a" stroke-width="4"/>
<path d="M75 85 L75 245 L125 245 L125 85Z" fill="#f3e2c0" stroke="#c49a5a" stroke-width="2"/>
<rect x="88" y="95" width="24" height="140" rx="10" fill="#d2453c" opacity=".75"/>
<g fill="#e8c9a8"><circle cx="70" cy="40" r="5"/><circle cx="95" cy="30" r="5"/><circle cx="120" cy="40" r="5"/><circle cx="85" cy="55" r="5"/><circle cx="110" cy="58" r="5"/><circle cx="72" cy="295" r="5"/><circle cx="100" cy="305" r="5"/><circle cx="125" cy="292" r="5"/><circle cx="95" cy="280" r="5"/></g>
<path d="M45 30 C60 0 120 -8 145 25" fill="none" stroke="#4fa3d9" stroke-width="5"/>
<path d="M45 300 C60 330 120 338 145 305" fill="none" stroke="#4fa3d9" stroke-width="5"/>
''' + lead([(130, 20, 260, 20), (100, 45, -60, 45), (125, 160, 260, 130), (100, 170, -60, 170), (75, 200, -60, 240), (100, 300, 260, 300)]) +
labels([(266, 25, 'الغضروف', 'start'), (-66, 50, 'النهاية الإسفنجية', 'end'), (266, 135, 'جسم العظم', 'start'), (-66, 175, 'نقي (نخاع) العظم', 'end'), (-66, 245, 'السمحاق (القشرة)', 'end'), (266, 305, 'النهاية الإسفنجية', 'start')]),
'شكل: المظهر الخارجي للعظم – عظم الفخذ (للحفظ)')

LARGE_INT = fig("-190 0 900 360", 640, 260, '''
<path d="M120 300 L120 80 Q120 50 150 50 L330 50 Q360 50 360 80 L360 260 Q360 300 320 300 L270 300" fill="none" stroke="#e0801b" stroke-width="40" stroke-linejoin="round"/>
<path d="M270 300 L270 340" stroke="#c46a10" stroke-width="30"/>
<path d="M60 230 Q100 230 120 255" fill="none" stroke="#f4c27a" stroke-width="22"/>
<path d="M112 315 Q100 345 90 345" fill="none" stroke="#c46a10" stroke-width="9" stroke-linecap="round"/>
<circle cx="120" cy="300" r="24" fill="#e0801b"/>
''' + lead([(120, 170, -40, 170), (240, 50, 240, 15), (360, 170, 470, 170), (270, 320, 470, 300), (270, 345, 470, 345), (120, 300, -40, 300), (95, 344, -40, 345), (70, 232, -40, 232)]) +
labels([(-46, 175, 'القولون الصاعد', 'end'), (240, 10, 'القولون المستعرض', 'middle'), (476, 175, 'القولون النازل', 'start'), (476, 305, 'المستقيم', 'start'), (476, 350, 'المخرج (الشرج)', 'start'), (-46, 305, 'الأعور', 'end'), (-46, 350, 'الزائدة الدودية', 'end'), (-46, 237, 'نهاية الأمعاء الدقيقة', 'end')]),
'شكل: الأمعاء الغليظة للإنسان (للحفظ)')

LIVER = fig("-200 0 860 280", 620, 210, '''
<path d="M40 90 C40 30 180 20 330 40 C420 50 450 80 440 110 C420 150 330 160 260 190 C200 215 120 220 80 190 C50 170 40 130 40 90Z" fill="#9c4a3a" stroke="#6b2b20" stroke-width="4"/>
<path d="M260 45 C250 100 240 150 230 205" fill="none" stroke="#6b2b20" stroke-width="3" stroke-dasharray="6 5"/>
<path d="M170 195 C150 225 175 245 195 225 C205 215 200 200 190 192Z" fill="#7fbf5a" stroke="#3d7a27" stroke-width="3"/>
<path d="M190 200 C200 230 215 250 215 270" fill="none" stroke="#5a9b3c" stroke-width="5"/>
''' + lead([(120, 110, -40, 110), (360, 90, 470, 90), (180, 215, -40, 230), (212, 258, 470, 258)]) +
labels([(-46, 115, 'الفص الأيمن (الكبير)', 'end'), (476, 95, 'الفص الأيسر (الصغير)', 'start'), (-46, 235, 'كيس الصفراء (المرارة)', 'end'), (476, 263, 'القناة الصفراوية', 'start')]),
'شكل: كبد الإنسان (للحفظ)')

KIDNEY = fig("-200 0 880 330", 620, 240, '''
<path d="M200 20 C80 20 60 160 90 230 C120 300 230 320 270 260 C285 235 275 210 260 195 C245 180 245 140 260 125 C280 105 285 75 265 50 C250 30 230 20 200 20Z" fill="#c97b63" stroke="#7a3b26" stroke-width="5"/>
<path d="M195 40 C110 45 95 160 115 220 C135 280 215 295 245 250 C230 225 225 205 230 190 C215 175 215 145 230 128 C250 110 250 75 235 58 C225 46 210 40 195 40Z" fill="#e8b49c"/>
<g fill="#b8503a"><path d="M130 90 L185 130 L140 140Z"/><path d="M118 170 L185 165 L130 200Z"/><path d="M150 245 L195 195 L190 255Z"/><path d="M175 60 L200 120 L160 85Z"/></g>
<path d="M225 120 C205 150 205 190 230 215 C245 195 250 145 225 120Z" fill="#f6e2b8" stroke="#9e7a4a" stroke-width="2"/>
<path d="M240 200 C280 240 300 280 320 320" fill="none" stroke="#e6b800" stroke-width="12"/>
<path d="M262 150 L330 140" stroke="#d2453c" stroke-width="10"/><path d="M262 172 L330 175" stroke="#1e5fa8" stroke-width="10"/>
''' + lead([(100, 120, -40, 80), (150, 130, -40, 140), (225, 165, -40, 210), (300, 290, 470, 300), (325, 140, 470, 120), (325, 175, 470, 185)]) +
labels([(-46, 85, 'القشرة', 'end'), (-46, 145, 'اللب (الأهرامات)', 'end'), (-46, 215, 'الحوض', 'end'), (476, 305, 'الحالب', 'start'), (476, 125, 'الشريان الكلوي', 'start'), (476, 190, 'الوريد الكلوي', 'start')]),
'شكل: مقطع طولي في الكلية (للحفظ)')

NAIL = fig("-200 0 920 260", 640, 190, '''
<path d="M20 120 C20 60 60 40 120 40 L420 40 C470 40 490 80 490 120 C490 170 450 200 400 200 L120 200 C60 200 20 180 20 120Z" fill="#f6d3b8" stroke="#a0603a" stroke-width="3"/>
<rect x="140" y="95" width="320" height="40" rx="18" fill="#efe6dc" stroke="#9e9a92" stroke-width="2"/>
<path d="M220 62 L470 62 Q485 62 485 75 L470 78 L220 78Z" fill="#fff7f0" stroke="#c9b9a8" stroke-width="3"/>
<path d="M150 70 L220 70" stroke="#e8c9b2" stroke-width="10" stroke-linecap="round"/>
<path d="M140 82 L460 82" stroke="#e98f8f" stroke-width="5"/>
<path d="M130 60 C150 55 190 58 215 64" fill="none" stroke="#a0603a" stroke-width="4"/>
''' + lead([(350, 68, 350, 15), (180, 70, -40, 50), (330, 83, 520, 110), (205, 61, -40, 100), (300, 115, -40, 160), (430, 170, 520, 190)]) +
labels([(350, 12, 'جسم الظفر (صفيحة متقرنة)', 'middle'), (-46, 55, 'جذر الظفر', 'end'), (526, 115, 'فراش الظفر', 'start'), (-46, 105, 'الجليدة (الجلد المحيط)', 'end'), (-46, 165, 'عظم الإصبع', 'end'), (526, 195, 'الجلد', 'start')]),
'شكل: تركيب الأظفر – التشريح الداخلي (للحفظ)')

PANCREAS = fig("-150 0 900 290", 640, 210, '''
<path d="M30 120 C30 60 110 50 120 90 L120 220 C120 250 30 250 30 200Z" fill="none" stroke="#e0801b" stroke-width="26"/>
<path d="M120 110 C170 90 250 120 330 100 C380 88 420 80 450 95 C460 110 440 125 410 128 C340 140 260 160 190 170 C150 176 125 165 120 150Z" fill="#f4c27a" stroke="#c46a10" stroke-width="3"/>
<path d="M130 135 C220 130 330 115 440 104" fill="none" stroke="#9e5307" stroke-width="3"/>
<g fill="#c2185b"><circle cx="230" cy="140" r="7"/><circle cx="300" cy="125" r="6"/><circle cx="360" cy="112" r="6"/><circle cx="270" cy="150" r="5"/></g>
''' + lead([(150, 140, 150, 260), (270, 120, 270, 20), (430, 110, 520, 80), (230, 140, 520, 160), (330, 117, 520, 220), (60, 200, -40, 230)]) +
labels([(150, 275, 'الرأس', 'middle'), (270, 15, 'الجسم', 'middle'), (526, 85, 'الذيل', 'start'), (526, 165, 'جزر لانكرهانز (الأنسولين)', 'start'), (526, 225, 'القناة البنكرياسية', 'start'), (-46, 235, 'الاثنا عشري', 'end')]),
'شكل: تركيب البنكرياس (للحفظ)')

PLANT = fig("-200 0 880 330", 620, 240, '''
<rect x="40" y="30" width="400" height="260" rx="10" fill="#cfe9d8" stroke="#196b42" stroke-width="8"/>
<rect x="56" y="46" width="368" height="228" rx="6" fill="#f2fbf5" stroke="#3fb26b" stroke-width="2"/>
<rect x="180" y="80" width="200" height="160" rx="30" fill="#d4ecff" stroke="#1e7fc4" stroke-width="2"/>
<circle cx="110" cy="110" r="30" fill="#c8a2e8" stroke="#73296f" stroke-width="3"/><circle cx="118" cy="104" r="9" fill="#73296f"/>
<g fill="#3fb26b" stroke="#196b42" stroke-width="2"><ellipse cx="90" cy="200" rx="18" ry="9"/><ellipse cx="130" cy="250" rx="18" ry="9"/><ellipse cx="400" cy="70" rx="16" ry="8"/><ellipse cx="405" cy="255" rx="16" ry="8"/></g>
<g fill="#e0801b"><rect x="140" y="160" width="26" height="12" rx="6"/><rect x="390" y="150" width="24" height="11" rx="6"/></g>
''' + lead([(440, 40, 500, 25), (424, 110, 500, 100), (280, 160, 500, 175), (110, 125, -40, 110), (118, 104, -40, 60), (90, 200, -40, 200), (153, 166, -40, 260)]) +
labels([(506, 30, 'الجدار الخلوي', 'start'), (506, 105, 'الغشاء البلازمي', 'start'), (506, 180, 'الفجوة العصارية', 'start'), (-46, 115, 'النواة', 'end'), (-46, 65, 'النويّة', 'end'), (-46, 205, 'البلاستيدات الخضراء', 'end'), (-46, 265, 'المايتوكوندريا', 'end')]),
'شكل: الخلية النباتية ومكوّناتها')

MITOSIS = fig("0 0 760 230", 640, 200, '''
<g transform="translate(760 0) scale(-1 1)"><g stroke="#7a3fa0" stroke-width="3" fill="#f2eaf8">
 <circle cx="80" cy="90" r="58"/><circle cx="230" cy="90" r="58"/><circle cx="380" cy="90" r="58"/><ellipse cx="530" cy="90" rx="78" ry="55"/>
 <circle cx="660" cy="60" r="38"/><circle cx="660" cy="140" r="38"/></g>
<circle cx="80" cy="90" r="26" fill="#c8a2e8" stroke="#55286f" stroke-width="2"/>
<g stroke="#c2185b" stroke-width="5" stroke-linecap="round"><path d="M70 80l6 18M86 78l-6 20"/><path d="M220 70l8 16M238 70l-8 16M222 100l8 16M240 100l-8 16"/><path d="M380 62v14M372 66l16 6M380 104v14M372 108l16 6"/><path d="M490 80v20M505 80v20M555 80v20M570 80v20"/><path d="M660 50v14M660 130v14"/></g>
<g stroke="#9e9a92" stroke-width="1.5"><path d="M330 90 L430 90M335 70 L425 110M335 110 L425 70"/></g>
</g><g fill="#55286f" text-anchor="middle"><text x="680" y="175">١- تضاعف الكروموسومات</text><text x="530" y="195">٢- تصطف في الوسط</text><text x="380" y="175">٣- تنفصل نحو القطبين</text><text x="230" y="195">٤- تنقسم الخلية</text><text x="100" y="205">خليتان بنتان</text></g>
<g fill="#d9a521"><path d="M606 90 l14 -6 v12z"/><path d="M456 90 l14 -6 v12z"/><path d="M306 90 l14 -6 v12z"/><path d="M136 90 l14 -6 v12z"/></g>
''', 'شكل: أطوار الانقسام الخيطي الأربعة (خلية ← خليتان متماثلتان)')

CARBON = fig("0 0 700 300", 620, 270, '''
<rect width="700" height="300" rx="16" fill="#f3faf6"/>
<circle cx="70" cy="60" r="32" fill="#ffd54a"/>
<path d="M220 230 l30 -90 l30 90z" fill="#2b9a63"/><rect x="243" y="230" width="14" height="30" fill="#6d4c41"/>
<g transform="translate(470 210)"><ellipse rx="40" ry="26" fill="#bdbdbd"/><circle cx="-26" cy="-22" r="12" fill="#bdbdbd"/></g>
<rect x="580" y="200" width="70" height="50" fill="#9e9e9e"/><rect x="600" y="160" width="16" height="40" fill="#757575"/>
<g fill="none" stroke-width="4" stroke-linecap="round">
 <path d="M410 70 C330 60 300 100 270 140" stroke="#555"/><path d="M262 132 l8 10 l4 -12" stroke="#555"/>
 <path d="M280 150 C330 120 380 110 430 120" stroke="#1e7fc4"/><path d="M425 112 l8 8 l-10 4" stroke="#1e7fc4"/>
 <path d="M470 180 C470 120 450 90 420 80" stroke="#555"/><path d="M608 150 C600 100 520 75 440 72" stroke="#555"/>
</g>
<g font-size="15">
 <text x="430" y="66" fill="#333">CO₂ في الهواء</text>
 <text x="340" y="155" fill="#125a8f">O₂</text>
 <text x="180" y="285" fill="#196b42">البناء الضوئي (يسحب CO₂)</text>
 <text x="420" y="270" fill="#9a2a22">التنفس (يطلق CO₂)</text>
 <text x="560" y="280" fill="#555">الاحتراق والتحلل</text>
</g>''', 'شكل: دورة الكاربون – الأوكسجين في الطبيعة')

def insert(path, anchor, block, after=True):
    s = open(path, encoding='utf8').read()
    if block.split('<p class="figcap">')[1][:20] in s: return
    i = s.index(anchor)
    if anchor.startswith('<tr'): i = s.rfind('<table', 0, i)
    if after == 'beforecols': i = s.rfind('<div class="cols"', 0, i); after = False
    if after:
        j = s.index('\n', i) + 1
        s = s[:j] + block + '\n' + s[j:]
    else:
        s = s[:i] + block + '\n' + s[i:]
    open(path, 'w', encoding='utf8').write(s)

R3, R1, R2 = '/home/user/malzama3/', '/home/user/malzama/', '/home/user/malzama2/'
insert(R3 + 'ch2.html', '<div class="flow"><span class="st">نهايتان إسفنجيتان</span>', BONE)
insert(R3 + 'ch4.html', '<tr><th>وجه المقارنة</th><th>الأمعاء الدقيقة</th><th>الأمعاء الغليظة</th></tr>', LARGE_INT, after=False)
insert(R3 + 'ch4.html', '<div class="card"><h5>الكبد</h5>', LIVER, after='beforecols')
insert(R3 + 'ch7.html', '<div class="card" style="margin-bottom:8px"><h5>الكليتان</h5>', KIDNEY, after='beforecols')
insert(R3 + 'ch7.html', '<div class="card"><h5>الأظافر</h5>', NAIL, after='beforecols')
insert(R3 + 'ch10.html', '<tr><td><b>البنكرياس</b> (Pancreas)', PANCREAS)
insert(R1 + 'u2.html', '<tr><th>وجه المقارنة</th><th>الخلية الحيوانية</th><th>الخلية النباتية</th></tr>', PLANT, after=False)
insert(R2 + 'ch6.html', '<h4 class="sub">١- دورة الكاربون – الأوكسجين</h4>', CARBON)
insert(R1 + 'u2.html', '<h5>الانقسام الخيطي: خلية ← خليتان', MITOSIS)
print('done')
