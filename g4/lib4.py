import math, itertools
_id = itertools.count(1)
def esc(s): return s.replace('&', '&amp;').replace('<', '&lt;')
def lighten(c, f):
    c = c.lstrip('#'); r, g, b = [int(c[i:i+2], 16) for i in (0, 2, 4)]
    return '#%02x%02x%02x' % tuple(int(v + (255 - v) * f) for v in (r, g, b))
def darken(c, f):
    c = c.lstrip('#'); r, g, b = [int(c[i:i+2], 16) for i in (0, 2, 4)]
    return '#%02x%02x%02x' % tuple(int(v * (1 - f)) for v in (r, g, b))
HEAD = '<svg width="680" height="%d" viewBox="0 0 720 %d" font-family="Tajawal" font-weight="700" font-size="15" text-anchor="middle">'
def defs(colors):
    n = next(_id); d = ''
    for i, c in enumerate(colors):
        d += f'<radialGradient id="g{n}_{i}" cx="36%" cy="30%" r="80%"><stop offset="0" stop-color="{lighten(c,.75)}"/><stop offset=".55" stop-color="{c}"/><stop offset="1" stop-color="{darken(c,.38)}"/></radialGradient>'
        d += f'<linearGradient id="l{n}_{i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{lighten(c,.45)}"/><stop offset="1" stop-color="{darken(c,.28)}"/></linearGradient>'
    d += f'<filter id="s{n}" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="#000" flood-opacity=".28"/></filter>'
    return n, f'<defs>{d}</defs>'
def fig(svg, cap, hz=False):
    return f'<div class="fig">{svg}<p class="figcap">{cap}</p></div>'
def lines(txt, x, y, lh=18, fill='#1d2433', size=14):
    out = ''
    for i, t in enumerate(txt.split('|')):
        out += f'<text x="{x}" y="{y + i*lh}" fill="{fill}" font-size="{size}">{esc(t)}</text>'
    return out
def chain(items, colors, note=''):
    """سلسلة: كرات مجسمة وأسهم. items: [(الاسم, الوصف)]"""
    n, d = defs(colors); k = len(items); H = 230
    s = HEAD % (H, H) + d
    step = 680 / k
    for i, (t, sub) in enumerate(items):
        x = 700 - step * (i + .5) + 0
        x = 720 - 20 - step * (i + .5)
        c = colors[i % len(colors)]
        s += f'<circle cx="{x}" cy="95" r="44" fill="url(#g{n}_{i % len(colors)})" filter="url(#s{n})"/>'
        s += f'<text x="{x}" y="101" fill="#fff" font-size="16" stroke="#0004" stroke-width=".6">{esc(t)}</text>'
        s += lines(sub, x, 168, 17, '#33415c', 13)
        if i < k - 1:
            xa = x - step / 2
            s += f'<path d="M{xa+16} 95 H{xa-16}" stroke="#d9a521" stroke-width="5" stroke-linecap="round"/><path d="M{xa-16} 95 l10 -9 M{xa-16} 95 l10 9" stroke="#d9a521" stroke-width="5" stroke-linecap="round"/>'
    if note: s += f'<text x="360" y="218" fill="#7a1f3d" font-size="14">{esc(note)}</text>'
    return s + '</svg>'
def pyramid(levels, colors, title=''):
    """levels من القاعدة إلى القمة: [(نص,وصف)]"""
    n, d = defs(colors); k = len(levels); H = 60 + k * 62
    s = HEAD % (H, H) + d
    topw, botw, h = 70, 520, 56
    for i, (t, sub) in enumerate(levels):
        y = H - 30 - (i + 1) * (h + 6) + 6
        w1 = botw - (botw - topw) * i / k; w2 = botw - (botw - topw) * (i + 1) / k
        cx = 300
        pts = f'{cx-w1/2},{y+h} {cx+w1/2},{y+h} {cx+w2/2},{y} {cx-w2/2},{y}'
        s += f'<polygon points="{pts}" fill="url(#l{n}_{i % len(colors)})" filter="url(#s{n})" stroke="{darken(colors[i % len(colors)],.4)}" stroke-width="1.5"/>'
        s += f'<text x="{cx}" y="{y+h/2+5}" fill="#fff" font-size="16" stroke="#0005" stroke-width=".5">{esc(t)}</text>'
        s += f'<line x1="{cx+w1/2+10}" y1="{y+h/2}" x2="{cx+botw/2+40}" y2="{y+h/2}" stroke="#bbb" stroke-dasharray="4 3"/>'
        s += f'<text x="{cx+botw/2+45}" y="{y+h/2+5}" text-anchor="start" fill="#33415c" font-size="13">{esc(sub)}</text>'
    if title: s += f'<text x="300" y="22" fill="#7a1f3d" font-size="16">{esc(title)}</text>'
    return s.replace('viewBox="0 0 720', 'viewBox="0 0 720') + '</svg>'
def cycle(nodes, colors, center='', R=105):
    n, d = defs(colors); k = len(nodes); H = 330
    s = HEAD % (H, H) + d
    cx, cy = 360, 165
    pos = []
    for i in range(k):
        a = -math.pi / 2 - 2 * math.pi * i / k
        pos.append((cx + 1.55 * R * math.cos(a), cy + R * 1.18 * math.sin(a)))
    for i in range(k):
        x1, y1 = pos[i]; x2, y2 = pos[(i + 1) % k]
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        vx, vy = mx - cx, my - cy; L = math.hypot(vx, vy) or 1
        qx, qy = mx + vx / L * 22, my + vy / L * 22
        s += f'<path d="M{x1:.0f} {y1:.0f} Q{qx:.0f} {qy:.0f} {x2:.0f} {y2:.0f}" fill="none" stroke="#d9a521" stroke-width="5" stroke-linecap="round" opacity=".9"/>'
        ang = math.atan2(y2 - qy, x2 - qx)
        ax, ay = x2 - 40 * math.cos(ang), y2 - 40 * math.sin(ang)
        s += f'<polygon points="{ax+11*math.cos(ang):.0f},{ay+11*math.sin(ang):.0f} {ax-8*math.sin(ang):.0f},{ay+8*math.cos(ang):.0f} {ax+8*math.sin(ang):.0f},{ay-8*math.cos(ang):.0f}" fill="#d9a521"/>'
    for i, (x, y) in enumerate(pos):
        s += f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="66" ry="30" fill="url(#l{n}_{i % len(colors)})" filter="url(#s{n})"/>'
        s += lines(nodes[i], x, y + (4 if '|' not in nodes[i] else -3), 15, '#fff', 14)
    if center: s += f'<text x="{cx}" y="{cy+5}" fill="#7a1f3d" font-size="17">{esc(center)}</text>'
    return s + '</svg>'
def layers(items, colors, side=''):
    """طبقات أفقية متدرجة (مناطق البحيرة/البحر): [(اسم, وصف)]"""
    n, d = defs(colors); k = len(items); h = 62; H = 40 + k * h
    s = HEAD % (H, H) + d
    for i, (t, sub) in enumerate(items):
        y = 20 + i * h
        s += f'<rect x="40" y="{y}" width="640" height="{h-4}" rx="14" fill="url(#l{n}_{i % len(colors)})" filter="url(#s{n})"/>'
        s += f'<text x="360" y="{y+26}" fill="#fff" font-size="17" stroke="#0004" stroke-width=".5">{esc(t)}</text>'
        s += f'<text x="360" y="{y+46}" fill="#fff" font-size="13">{esc(sub)}</text>'
    return s + '</svg>'
def hub(center, spokes, colors):
    """مركز وفروع (خريطة مجسمة)"""
    n, d = defs(colors); k = len(spokes); H = 330
    s = HEAD % (H, H) + d
    cx, cy = 360, 165
    for i, t in enumerate(spokes):
        a = -math.pi / 2 + 2 * math.pi * i / k
        x, y = cx + 235 * math.cos(a), cy + 125 * math.sin(a)
        s += f'<line x1="{cx}" y1="{cy}" x2="{x:.0f}" y2="{y:.0f}" stroke="#bbb" stroke-width="3"/>'
    for i, t in enumerate(spokes):
        a = -math.pi / 2 + 2 * math.pi * i / k
        x, y = cx + 235 * math.cos(a), cy + 125 * math.sin(a)
        s += f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="72" ry="30" fill="url(#l{n}_{i % len(colors)})" filter="url(#s{n})"/>' + lines(t, x, y + (5 if '|' not in t else -3), 16, '#fff', 14)
    s += f'<circle cx="{cx}" cy="{cy}" r="52" fill="url(#g{n}_0)" filter="url(#s{n})"/>' + lines(center, cx, cy + (5 if '|' not in center else -3), 17, '#fff', 15)
    return s + '</svg>'
# ---------- HTML helpers ----------
def lesson(n, t): return f'<div class="lesson"><div class="n">{n}</div><h3>{t}</h3></div>\n'
def box(kind, t, body): return f'<box type="{kind}" t="{t}">{body}</box>\n'
def sub(t): return f'<h4 class="sub">{t}</h4>\n'
def table(head, rows, widths=None, long=False):
    h = '<table class="t%s">' % (' long' if long else '')
    h += '<tr>' + ''.join(f'<th{(" style=%swidth:%s%s" % (chr(34), widths[i], chr(34))) if widths and widths[i] else ""}>{c}</th>' for i, c in enumerate(head)) + '</tr>'
    for r in rows: h += '<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>'
    return h + '</table>\n'
def flow(steps):
    return '<div class="flow">' + '<span class="ar">←</span>'.join(f'<span class="st">{s}</span>' for s in steps) + '</div>\n'
def cmap(root, kids):
    return f'<div class="cmap"><div class="root">{root}</div><div class="stem"></div><div class="kids">' + ''.join(f'<div class="kid"><b>{b}</b>{t}</div>' for b, t in kids) + '</div></div>\n'
def cols(cards, three=False):
    return f'<div class="{"cols3" if three else "cols"}">' + ''.join(f'<div class="card"{(" style=%sborder-top-color:%s%s" % (chr(34), c, chr(34))) if c else ""}><h5>{h}</h5><p>{p}</p></div>' for h, p, c in cards) + '</div>\n'
def qlist(items):
    return '<div class="self"><div class="bh">[[pencil]] أسئلة الفصل مع الإجابات</div><ol class="qlist">' + ''.join(f'<li>{q}<span class="a">{a}</span></li>' for q, a in items) + '</ol></div>\n'
def wrap(points, selfq):
    return '<div class="wrapup"><div class="summary"><div class="bh">[[check]] خلاصة الفصل في دقيقة</div><ul>' + ''.join(f'<li>{p}</li>' for p in points) + '</ul></div><div class="self"><div class="bh">[[pencil]] اختبر نفسك</div><ol>' + ''.join(f'<li>{q}</li>' for q in selfq) + '</ol></div></div>\n'
def opener(cls, n, title, en, hook, toc, goal, art=''):
    return (f'<section class="{cls}">\n<div class="ch-open pb"><div class="big">{n}</div><span class="tag">الفصل {["","الأول","الثاني","الثالث","الرابع","الخامس","السادس","السابع","الثامن","التاسع","العاشر"][n]}</span>'
            f'<h2>{title}</h2><div class="en2">{en}</div><div class="hook">{hook}</div><div class="art">{art}</div>'
            f'<div class="inside"><h3>في هذا الفصل (حسب تسلسل الكتاب)</h3><ol>' + ''.join(f'<li>{t}</li>' for t in toc) + f'</ol><div class="goal">[[target]] الهدف: {goal}</div></div></div>\n')
ART = '<svg width="150" height="150" viewBox="0 0 150 150" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9">%s</svg>'
