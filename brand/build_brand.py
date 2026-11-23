# -*- coding: utf-8 -*-
"""Brand kit — ملازم الأحياء التفاعلية. Emerald (chlorophyll) + gold (achievement), anchored on the shipped v3.4 theme.css.
Outputs: out/brand-tokens.css, out/tokens.json, out/contrast.json and the icon / feature-graphic SVG+HTML sources."""
import json, colorsys, os
O = 'out'
def h2r(h): h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) / 255 for i in (0, 2, 4))
def r2h(r): return '#' + ''.join(f'{max(0,min(255,round(c*255))):02x}' for c in r)
def hsl(h): r, g, b = h2r(h); H, L, S = colorsys.rgb_to_hls(r, g, b); return H * 360, S, L
def fromhsl(H, S, L): return r2h(colorsys.hls_to_rgb((H % 360) / 360, max(0, min(1, L)), max(0, min(1, S))))
def lum(h):
    f = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = map(f, h2r(h)); return 0.2126 * r + 0.7152 * g + 0.0722 * b
def cr(a, b): la, lb = sorted([lum(a), lum(b)], reverse=True); return round((la + 0.05) / (lb + 0.05), 2)
def mix(a, b, t): return r2h(tuple(x + (y - x) * t for x, y in zip(h2r(a), h2r(b))))
SLOTS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

# ---- primary: the app's emerald scale as shipped (300 filled from the same Tailwind emerald family)
EM = {50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669',
      700: '#047857', 800: '#065f46', 900: '#053b2f', 950: '#022c22'}
# ---- secondary: gold, generated with the kit's HSL shade algorithm from the icon gold #dcab48
GOLD_BASE = '#dcab48'; H, S, L = hsl(GOLD_BASE)
rule = {50: (.95, None, .97), 100: (.92, None, .94), 200: (.88, None, .88), 300: (.82, None, .78), 400: (.75, None, .63), 500: (1, 1, None),
        600: (1.05, .85, None), 700: (1.08, .72, None), 800: (1.10, .58, None), 900: (1.12, .42, None), 950: (1.15, .25, None)}
GOLD = {k: (GOLD_BASE if k == 500 else fromhsl(H, S * sf, (abs_l if abs_l is not None else L * lf))) for k, (sf, lf, abs_l) in rule.items()}
# ---- neutrals: green-tinted greys; anchors are the values the app already uses, gaps interpolated in HSL on the same hue
ANCH = {50: '#f4f8f6', 100: '#eff5f2', 200: '#dde9e3', 600: '#56695f', 800: '#294239', 900: '#0f241d'}
NEU = {}
idx = {s: i for i, s in enumerate(SLOTS)}
for s in SLOTS:
    if s in ANCH: NEU[s] = ANCH[s]; continue
    if s == 950: h9, s9, l9 = hsl(ANCH[900]); NEU[s] = fromhsl(h9, s9, l9 * .62); continue
    lo = max(k for k in ANCH if k < s); hi = min(k for k in ANCH if k > s); t = (idx[s] - idx[lo]) / (idx[hi] - idx[lo])
    a, b = hsl(ANCH[lo]), hsl(ANCH[hi]); NEU[s] = fromhsl(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t)
SEM = {'success': ('#166534', '#dcfce7', '#bbf7d0'), 'error': ('#b42318', '#fff1f0', '#fecaca'),
       'warning': ('#92400e', '#fef3c7', '#fde68a'), 'info': ('#0f766e', '#f0fdfa', '#99f6e4')}
EXTRA = {'deep': '#043127', 'teal': '#0d9488', 'mint': '#5eead4', 'ivory': '#fbf6e8'}

LIGHT = {'bg': NEU[100], 'surface': '#ffffff', 'surface-2': NEU[50], 'surface-raised': '#ffffff', 'border': NEU[200], 'border-subtle': '#eaf2ee',
         'text': NEU[900], 'text-2': NEU[800], 'text-muted': NEU[600], 'brand': EM[700], 'brand-strong': EM[800], 'brand-soft': EM[50],
         'accent': GOLD[500], 'accent-text': None, 'header': EXTRA['deep'], 'on-brand': '#ffffff', 'focus': EM[600]}
# gold usable as text on white: darkest shade needed for 4.5:1
LIGHT['accent-text'] = next(GOLD[k] for k in (700, 800, 900) if cr(GOLD[k], '#ffffff') >= 4.5)
DARK = {'bg': '#06150f', 'surface': '#0c2219', 'surface-2': '#0f2a20', 'surface-raised': '#143428', 'border': '#24473a', 'border-subtle': '#1a3a2e',
        'text': '#eaf5ef', 'text-2': '#c4dbd0', 'text-muted': '#93ada2', 'brand': EM[400], 'brand-strong': EM[300], 'brand-soft': '#0f3326',
        'accent': GOLD[400], 'accent-text': GOLD[300], 'header': '#03110c', 'on-brand': '#03231a', 'focus': EM[400]}

# ---- contrast audit (WCAG 2.x)
def btn_text_min():  # primary button: 135deg gradient em-800 -> em-600, label spans roughly the middle 40%
    return min(cr('#ffffff', mix(EM[800], EM[600], t / 10)) for t in range(3, 8))
checks = [
 ('Body text on page', LIGHT['text'], LIGHT['bg'], 4.5), ('Body text on card', LIGHT['text'], LIGHT['surface'], 4.5),
 ('Secondary text on card', LIGHT['text-muted'], LIGHT['surface'], 4.5), ('Secondary text on page', LIGHT['text-muted'], LIGHT['bg'], 4.5),
 ('Link / brand text on card', LIGHT['brand'], LIGHT['surface'], 4.5), ('Brand text on brand-soft', LIGHT['brand-strong'], LIGHT['brand-soft'], 4.5),
 ('Gold text on card', LIGHT['accent-text'], LIGHT['surface'], 4.5), ('White on header', '#ffffff', LIGHT['header'], 4.5),
 ('Gold on header (icon, titles)', GOLD[300], LIGHT['header'], 4.5), ('Ivory on deep emerald (store art)', EXTRA['ivory'], '#064534', 4.5),
 ('Success text', SEM['success'][0], SEM['success'][1], 4.5), ('Error text', SEM['error'][0], SEM['error'][1], 4.5),
 ('Warning text', SEM['warning'][0], SEM['warning'][1], 4.5), ('Info text', SEM['info'][0], SEM['info'][1], 4.5),
 ('Focus ring vs card (non-text)', LIGHT['focus'], LIGHT['surface'], 3.0),
 ('[dark] Body text', DARK['text'], DARK['bg'], 4.5), ('[dark] Secondary text on surface', DARK['text-muted'], DARK['surface'], 4.5),
 ('[dark] Brand text on surface', DARK['brand'], DARK['surface'], 4.5), ('[dark] Gold text on surface', DARK['accent-text'], DARK['surface'], 4.5),
 ('[dark] Button label on brand', DARK['on-brand'], DARK['brand'], 4.5)]
report = [dict(pair=n, fg=f, bg=b, ratio=cr(f, b), need=need, ok=cr(f, b) >= need) for n, f, b, need in checks]
report.append(dict(pair='White label on primary button gradient (worst point under the label)', fg='#ffffff', bg='em-800→em-600',
                   ratio=round(btn_text_min(), 2), need=4.5, ok=btn_text_min() >= 4.5))
json.dump(report, open(f'{O}/contrast.json', 'w'), indent=1, ensure_ascii=False)

TYPE = {'xs': (12.5, 1.6), 'sm': (14, 1.6), 'md': (15.5, 1.85), 'lg': (17, 1.8), 'xl': (19, 1.6), '2xl': (22, 1.5), '3xl': (28, 1.4), '4xl': (34, 1.3), 'display': (44, 1.25)}
SPACE = {'0': 0, '0-5': 2, '1': 4, '1-5': 6, '2': 8, '3': 12, '4': 16, '5': 20, '6': 24, '8': 32, '10': 40, '12': 48, '16': 64, '20': 80, '24': 96}
RAD = {'sm': 12, 'md': 16, 'lg': 22, 'xl': 28, 'pill': 999}

# ---------------------------------------------------------------- CSS (3 tiers)
L_ = []; w = L_.append
w('/* Brand kit — ملازم الأحياء التفاعلية (v1, matches app v3.4)\n   Tier 1 primitives · Tier 2 semantic (light / dark) · Tier 3 component. Components use Tier 2/3 only. */')
w(':root{')
w('  /* ---- Tier 1: primitives ---- */')
for nm, sc in (('emerald', EM), ('gold', GOLD), ('neutral', NEU)):
    w('  ' + ''.join(f'--color-{nm}-{k}:{v};' for k, v in sc.items()))
w('  ' + ''.join(f'--color-{k}:{v};' for k, v in EXTRA.items()))
for k, (fg, bg, ln) in SEM.items(): w(f'  --color-{k}:{fg};--color-{k}-bg:{bg};--color-{k}-line:{ln};')
w("  --font-heading:'Cairo','Segoe UI',Tahoma,sans-serif;--font-body:'Tajawal','Segoe UI',Tahoma,sans-serif;")
w('  ' + ''.join(f'--text-{k}:{s}px;--leading-{k}:{lh};' for k, (s, lh) in TYPE.items()))
w('  --weight-regular:400;--weight-bold:700;--weight-heavy:800;')
w('  ' + ''.join(f'--space-{k}:{v}px;' for k, v in SPACE.items()))
w('  ' + ''.join(f'--radius-{k}:{v}px;' for k, v in RAD.items()))
w('  --shadow-1:0 1px 2px rgba(4,49,39,.06),0 1px 0 rgba(4,49,39,.04);--shadow-2:0 2px 4px rgba(4,49,39,.05),0 10px 28px rgba(4,49,39,.08);--shadow-3:0 6px 14px rgba(4,49,39,.10),0 22px 48px rgba(4,49,39,.14);')
w('  --ease:cubic-bezier(.22,.8,.26,1);--duration-fast:150ms;--duration-med:250ms;--tap-target:44px;')
w('  /* ---- Tier 2: semantic (light) ---- */')
w('  ' + ''.join(f'--color-{k}:{v};' for k, v in LIGHT.items()))
w('  --gradient-brand:linear-gradient(135deg,var(--color-emerald-800),var(--color-emerald-600));')
w('  --gradient-hero:linear-gradient(155deg,var(--color-emerald-950) 0%,#064e3b 48%,#0b4f48 100%);')
w('  --gradient-gold:linear-gradient(180deg,var(--color-gold-200),var(--color-gold-500) 55%,var(--color-gold-700));')
w('  /* ---- Tier 3: component ---- */')
w('  --button-height-lg:48px;--button-height-md:var(--tap-target);--button-height-sm:36px;--button-padding-x:var(--space-4);')
w('  --button-radius:var(--radius-md);--button-radius-secondary:14px;--button-font:var(--weight-heavy) 16px/1.2 var(--font-heading);')
w('  --button-bg:var(--gradient-brand);--button-fg:var(--color-on-brand);--button-secondary-bg:var(--color-surface);--button-secondary-fg:var(--color-emerald-900);--button-secondary-border:var(--color-border);')
w('  --card-bg:var(--color-surface);--card-border:1px solid var(--color-border);--card-radius:var(--radius-lg);--card-padding:var(--space-4);--card-shadow:var(--shadow-1);--card-shadow-hover:var(--shadow-2);')
w('  --input-height:var(--tap-target);--input-padding-x:var(--space-3);--input-radius:var(--radius-sm);--input-border:1px solid var(--color-border);')
w('  --chip-height:26px;--chip-radius:var(--radius-pill);--chip-font:var(--weight-heavy) var(--text-xs)/1.45 var(--font-heading);')
w('  --sheet-radius:26px 26px 0 0;--toast-radius:var(--radius-pill);--focus-ring:0 0 0 3px var(--color-surface),0 0 0 6px var(--color-focus);')
w('}')
dark = ''.join(f'--color-{k}:{v};' for k, v in DARK.items())
w(f'[data-theme="dark"]{{{dark}--shadow-1:0 1px 2px rgba(0,0,0,.4);--shadow-2:0 8px 24px rgba(0,0,0,.45);--gradient-brand:linear-gradient(135deg,var(--color-emerald-500),var(--color-emerald-400));--button-secondary-fg:var(--color-text);}}')
w(f'@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{{dark}--shadow-1:0 1px 2px rgba(0,0,0,.4);--shadow-2:0 8px 24px rgba(0,0,0,.45);--gradient-brand:linear-gradient(135deg,var(--color-emerald-500),var(--color-emerald-400));--button-secondary-fg:var(--color-text);}}}}')
open(f'{O}/brand-tokens.css', 'w').write('\n'.join(L_) + '\n')

tok = {'color': {'emerald': {k: {'value': v} for k, v in EM.items()}, 'gold': {k: {'value': v} for k, v in GOLD.items()},
                 'neutral': {k: {'value': v} for k, v in NEU.items()}, **{k: {'value': v} for k, v in EXTRA.items()},
                 **{k: {'value': f, 'bg': {'value': b}, 'line': {'value': l}} for k, (f, b, l) in SEM.items()}},
       'semantic': {'light': {k: {'value': v} for k, v in LIGHT.items()}, 'dark': {k: {'value': v} for k, v in DARK.items()}},
       'typography': {'font': {'heading': {'value': 'Cairo'}, 'body': {'value': 'Tajawal'}},
                      'size': {k: {'value': f'{s}px', 'lineHeight': lh} for k, (s, lh) in TYPE.items()}, 'weight': {'regular': 400, 'bold': 700, 'heavy': 800}},
       'spacing': {k: {'value': f'{v}px'} for k, v in SPACE.items()}, 'radius': {k: {'value': f'{v}px'} for k, v in RAD.items()},
       'component': {'button': {'height': {'lg': '48px', 'md': '44px', 'sm': '36px'}, 'radius': '16px', 'radiusSecondary': '14px', 'paddingX': '16px'},
                     'card': {'radius': '22px', 'padding': '16px', 'border': '1px'}, 'input': {'height': '44px', 'radius': '12px', 'paddingX': '12px'},
                     'chip': {'height': '26px', 'radius': '999px'}},
       'meta': {'name': 'ملازم الأحياء التفاعلية', 'mood': 'premium, educational, warm', 'grid': '4px base, 8px rhythm', 'accessibility': 'WCAG 2.2 AA'}}
json.dump(tok, open(f'{O}/tokens.json', 'w'), indent=1, ensure_ascii=False)
json.dump({'EM': EM, 'GOLD': GOLD, 'NEU': NEU, 'LIGHT': LIGHT, 'DARK': DARK, 'SEM': SEM, 'EXTRA': EXTRA, 'TYPE': TYPE, 'SPACE': SPACE, 'RAD': RAD},
          open(f'{O}/palette.json', 'w'), indent=1)
print('gold', GOLD); print('neutral', NEU); print('accent-text', LIGHT['accent-text'])
for r in report: print(('OK  ' if r['ok'] else 'FAIL'), f"{r['ratio']:>5}:1 (need {r['need']})  {r['pair']}")
