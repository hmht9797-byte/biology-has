# -*- coding: utf-8 -*-
"""الصف الخامس العلمي: يحوّل بيانات الفصول إلى ملزمة داخل التطبيق.

المدخل: g5/data/chapterN.json (N = 1…7) بواجهات g5/types.ts
        (ChapterData: أقسام فيها خلاصة، بطاقات تعريف/تعليل/مصطلح، مراحل، مقارنات، أسئلة اختيار).
المخرج: فصول بصيغة التطبيق {n, t, c, lab, html, mcq, cards}، و html بعناصر الملزمة نفسها
        المستعملة في بقية الصفوف (ch-open، lesson، box def/why/fact، steps، flow، table.t، wrapup).

الاستخدام:
  python3 g5/build_g5.py   يضيف الصف (أو يحدّثه) في app/chapters.json ويعيد بناء app/index.html.
  build_app.py يستدعي grade() في البناء الكامل، فيبقى المصدر واحدًا.
"""
import html as _html
import json
import os
import re
import sys

G = os.path.dirname(os.path.abspath(__file__))
R = os.path.dirname(G)

GRADE = {'id': 5, 'name': 'الخامس العلمي', 'sub': 'التشريح والوظيفة، ٧ فصول', 'c': '#1d7bbe'}
# ألوان الفصول من رموز chapter-* في نظام التصميم (كلها 4.5:1 على الأقل مع النص الأبيض)
COL = {1: '#258656', 2: '#1d7bbe', 3: '#af6415', 4: '#4a3fb5', 5: '#c42a3c', 6: '#7a3fa0', 7: '#0e7c86'}
ORD = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع']

# أيقونات رؤوس الصناديق كما في ملازم الصفوف الأخرى (شبكة 24، خط 2.2، أبيض على دائرة ملوّنة)
ICON = {
    'key': '<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3 21 2M16 7l3 3M18 5l2 2"/>',
    'why': '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
    'pin': '<path d="M12 17v5M8 4h8M9 4v6l-3 4h12l-3-4V4"/>',
    'flask': '<path d="M9 3h6M10 3v6L4 19a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3L14 9V3"/>',
    'check': '<path d="M20 6 9 17l-5-5"/>',
}
# رسم بسيط لافتتاحية كل فصل (أبيض شبه شفاف، مثل رسوم افتتاحيات الرابع العلمي)
ART = {
    1: '<path d="M75 128c-30 0-44-26-44-50 0-22 14-36 30-36 7 0 10 3 14 3s7-3 14-3c16 0 30 14 30 36 0 24-14 50-44 50Z"/><path d="M75 45c0-12 6-20 16-24"/>',
    2: '<path d="M75 28v46M75 60c-10 8-18 8-26 4-12 8-20 30-18 52 2 10 12 12 22 6 10-6 12-26 12-40M75 60c10 8 18 8 26 4 12 8 20 30 18 52-2 10-12 12-22 6-10-6-12-26-12-40"/>',
    3: '<path d="M60 30c-26 0-36 26-30 52 6 26 30 40 42 30 8-8 0-20 4-32 4-12 14-18 10-32-4-12-14-18-26-18Z"/><path d="M76 82h34v40"/>',
    4: '<circle cx="86" cy="30" r="12"/><path d="M84 46 70 84l24 18-6 30M70 84l-20 34M80 56l26 12M78 58l-26 6"/>',
    5: '<path d="M75 126S28 96 28 60c0-18 12-30 26-30 10 0 17 6 21 14 4-8 11-14 21-14 14 0 26 12 26 30 0 36-47 66-47 66Z"/><path d="M40 72h20l8-16 12 30 8-14h22"/>',
    6: '<circle cx="50" cy="56" r="16"/><path d="M62 66l50 40M36 46 20 30M44 40 40 18M60 44l16-20M112 106l14 2M112 106l4 16M112 106l12-8"/>',
    7: '<path d="M52 36c-14 6-20 24-14 40 8 22 30 22 37 46 7-24 29-24 37-46 6-16 0-34-14-40-10-4-20 0-23 10-3-10-13-14-23-10Z"/><circle cx="75" cy="128" r="6"/>',
}

E = lambda s: _html.escape(str(s), quote=False)
AR = lambda s: re.sub(r'\d', lambda m: '٠١٢٣٤٥٦٧٨٩'[int(m[0])], str(s))


def num(sid):
    """ترقيم القسم كما يطبعه الكتاب: c1-s4-2 ← «2-4-1» (الأدق يسارًا)؛ bdo يمنع النص العربي من قلبه."""
    m = re.match(r'^c(\d+)-s([\d-]+)$', sid)
    parts = [m[1], *m[2].split('-')][::-1]
    return f'<bdo dir="ltr">{AR("-".join(parts))}</bdo>'


def head(cls, icon, color, title):
    return (f'<div class="box {cls}"><div class="bh"><span class="ic" style="background:{color}"><svg viewBox="0 0 24 24" fill="none" '
            f'stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">{ICON[icon]}</svg></span>{E(title)}</div>')


def hook(c):
    return f'<small class="hk">مفتاح الحفظ: {E(c["memoryHook"])}</small>' if c.get('memoryHook') else ''


def term(front):
    """«عرّف: التغذية (Nutrition)» أو «ما المقصود بـ X؟» ← اسم المفهوم."""
    t = re.sub(r'^\s*(عرّف|عرف)\s*:\s*', '', front)
    t = re.sub(r'^\s*ما المقصود ب(ـ)?\s*', '', t)
    return t.strip().rstrip('؟?.:').strip()


def section(s):
    out = [f'<div class="keep"><div class="lesson"><div class="n">{num(s["id"])}</div><h3>{E(s["title"])}</h3></div></div>']
    out.append('<ul class="pts">' + ''.join(f'<li>{E(p)}</li>' for p in s['coreSummary']) + '</ul>')

    defs = [c for c in s['flipCards'] if c['type'] == 'تعريف']
    if defs:
        out.append(head('def', 'key', '#b8860b', 'تعاريف') + '<ul>' + ''.join(
            f'<li><b>{E(term(c["front"]))}:</b> {E(c["back"])}{hook(c)}</li>' for c in defs) + '</ul></div>')

    steps = s.get('processSteps') or []
    if steps:
        out.append('<div class="keep"><h4 class="sub">المراحل بالترتيب</h4></div>')
        if len(steps) <= 7:
            out.append('<div class="flow">' + '<span class="ar">←</span>'.join(f'<span class="st">{E(p["title"])}</span>' for p in steps) + '</div>')
        out.append('<ol class="steps">' + ''.join(
            f'<li><b>{E(p["title"])}:</b> {E(p["summary"])}<small class="io">المكان: {E(p["location"])}'
            + (f'، المدخلات: {E("، ".join(p["inputs"]))}' if p['inputs'] else '')
            + (f'، المخرجات: {E("، ".join(p["outputs"]))}' if p['outputs'] else '') + '.</small></li>' for p in steps) + '</ol>')

    for t in s.get('comparisons') or []:
        rows = ''.join(f'<tr><td><b>{E(r["criteria"])}</b></td><td>{E(r["colA"])}</td><td>{E(r["colB"])}</td></tr>' for r in t['rows'])
        out.append(f'<div class="keep"><h4 class="sub">{E(t["title"])}</h4></div><div class="tw"><table class="t cmp5">'
                   f'<tr><th>وجه المقارنة</th><th>{E(t["colAHeader"])}</th><th>{E(t["colBHeader"])}</th></tr>{rows}</table></div>')

    why = [c for c in s['flipCards'] if c['type'] == 'تعليل']
    if why:
        out.append(head('why', 'why', 'var(--c)', 'علّل') + '<ol>' + ''.join(
            f'<li><b>{E(re.sub(r"^\s*علل\s*:\s*", "", c["front"]))}</b><span class="ans">{E(c["back"])}{hook(c)}</span></li>' for c in why) + '</ol></div>')

    terms = [c for c in s['flipCards'] if c['type'] == 'مصطلح']
    if terms:
        out.append('<div class="keep"><h4 class="sub">اكتب المصطلح العلمي</h4></div><ol class="qlist">' + ''.join(
            f'<li>{E(c["front"])}<span class="a">{E(c["back"])}</span></li>' for c in terms) + '</ol>')

    if s.get('enrichmentNote'):
        paras = [p for p in re.split(r'\n\s*\n', s['enrichmentNote']) if p.strip()]
        out.append(head('fact', 'flask', '#5d34a0', 'معلومة إثرائية (للاطلاع)') + ''.join(f'<p>{E(p.strip())}</p>' for p in paras) + '</div>')
    return '\n'.join(out)


def split_title(title):
    m = re.match(r'^(.*?)\s*\(([^()]*[A-Za-z][^()]*)\)\s*$', title)
    return (m[1].strip(), m[2].strip()) if m else (title, '')


def chapter(ch):
    n = ch['id']
    ar, en = split_title(ch['title'])
    inside = ''.join(f'<li>{num(s["id"])} {E(s["title"])}</li>' for s in ch['sections'])
    opener = (f'<div class="ch-open"><div class="big">{n}</div><span class="tag">الفصل {ORD[n - 1]}</span><h2>{E(ar)}</h2>'
              + (f'<div class="en2">{E(en)}</div>' if en else '')
              + f'<div class="art"><svg width="150" height="150" viewBox="0 0 150 150" fill="none" stroke="#fff" stroke-width="6" '
                f'stroke-linecap="round" stroke-linejoin="round" opacity=".9">{ART[n]}</svg></div>'
              + f'<div class="inside"><h3>في هذا الفصل (حسب تسلسل الكتاب)</h3><ol>{inside}</ol></div></div>')
    wrap = ('<div class="wrapup"><div class="summary"><div class="bh"><span class="ic" style="background:#2e7d32"><svg viewBox="0 0 24 24" fill="none" '
            f'stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">{ICON["check"]}</svg></span> خلاصة الفصل في دقيقة</div><ul>'
            + ''.join(f'<li>{E(s["coreSummary"][0])}</li>' for s in ch['sections']) + '</ul></div></div>')
    body = '\n'.join(section(s) for s in ch['sections'])
    html = f'<section class="g5c{n}">\n{opener}\n{body}\n{wrap}\n</section>'

    mcq = [{'q': E(q['question']), 'o': [E(o) for o in q['options']], 'a': q['correctIndex'], 'x': E(q['explanation']), 'xl': 'الشرح'}
           for s in ch['sections'] for q in s['quiz']]
    cards = [{'q': E(c['front']), 'a': E(c['back']) + hook(c)} for s in ch['sections'] for c in s['flipCards']]
    return {'n': n, 't': ar, 'c': COL[n], 'lab': 'الفصل', 'html': html, 'mcq': mcq, 'cards': cards}


def chapters():
    return [chapter(json.load(open(f'{G}/data/chapter{n}.json', encoding='utf8'))) for n in range(1, 8)]


def grade():
    return {**GRADE, 'chapters': chapters()}


def insert(book, g5):
    """يضع الصف الخامس بين الرابع والسادس (ويستبدله إن كان موجودًا)."""
    grades = [g for g in book['grades'] if g['id'] != g5['id']]
    at = next((i for i, g in enumerate(grades) if g['id'] > g5['id']), len(grades))
    book['grades'] = grades[:at] + [g5] + grades[at:]
    return book


if __name__ == '__main__':
    path = R + '/app/chapters.json'
    book = insert(json.load(open(path, encoding='utf8')), grade())
    json.dump(book, open(path, 'w', encoding='utf8'), ensure_ascii=False)
    sys.path.insert(0, R + '/app')
    from build_shell import write_index
    write_index()
    g5 = next(g for g in book['grades'] if g['id'] == 5)
    print('g5', 'chapters', len(g5['chapters']), 'mcq', sum(len(c['mcq']) for c in g5['chapters']),
          'cards', sum(len(c['cards']) for c in g5['chapters']), '| grades:', [g['id'] for g in book['grades']])
