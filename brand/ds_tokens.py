# -*- coding: utf-8 -*-
"""tokens.json for the Design System artifact (list format, light + dark), with contrast-checked usage notes."""
import json, sys
sys.path.insert(0, '.')
from build_brand import EM, GOLD, NEU, cr, LIGHT, DARK, mix
OUT = sys.argv[1]
T = []  # color tokens
def tok(name, light, dark=None, usage=''):
    T.append({'name': name, 'value': light if dark is None else {'light': light, 'dark': dark}, 'usage': usage})
def pair(fg, bg):
    return f"{cr(fg[0], bg[0])}:1 light, {cr(fg[1], bg[1])}:1 dark"
L, D = LIGHT, DARK
# ---- semantic first (what components use)
sem = {
 'bg': (L['bg'], D['bg'], 'Page background behind cards.'),
 'surface': ('#ffffff', D['surface'], 'Cards, sheets, secondary buttons, input fields.'),
 'surface-2': (L['surface-2'], D['surface-2'], 'Quiet fills: neutral badge, option number tiles, the alt primary button.'),
 'border': (L['border'], D['border'], 'Hairline around cards, controls and the empty state (1px).'),
 'text': (L['text'], D['text'], None), 'text-2': (L['text-2'], D['text-2'], None), 'text-muted': (L['text-muted'], D['text-muted'], None),
 'text-badge': ('#3f5550', D['text-2'], None), 'text-tab': ('#5f7169', D['text-muted'], None),
 'brand': (L['brand'], D['brand'], None), 'brand-strong': (L['brand-strong'], D['brand-strong'], None),
 'brand-soft': (L['brand-soft'], D['brand-soft'], 'Tinted fill for soft buttons, hovered rows, active rail item, brand badge.'),
 'brand-soft-line': (EM[100], '#1c4a39', 'Inset line around brand-soft fills.'),
 'brand-grad-from': (EM[800], EM[500], 'Start of the primary action gradient (135deg).'),
 'brand-grad-to': (EM[600], EM[400], 'End of the primary action gradient.'),
 'on-brand': ('#ffffff', D['on-brand'], None),
 'accent': (GOLD[500], GOLD[400], 'Gold: the app icon, store art and achievement marks. A fill or a mark, never body text.'),
 'accent-text': (L['accent-text'], D['accent-text'], None),
 'header': (L['header'], '#03110c', 'Top bar and the band behind the status bar.'),
 'focus': (EM[600], EM[400], None),
 'focus-halo': ('#ffffff', D['bg'], 'The 2px band between a focused element and its ring, so the ring reads on light, dark and coloured surfaces alike.'),
 'success': ('#166534', '#86efac', None), 'success-bg': ('#dcfce7', '#0f2e1f', 'Success badge and correct-answer fill.'), 'success-line': ('#bbf7d0', '#1f5b3a', 'Inset line on success-bg.'),
 'error': ('#b42318', '#fca5a5', None), 'error-bg': ('#fff1f0', '#3a1513', 'Wrong-answer fill, error empty state icon tile.'), 'error-line': ('#fecaca', '#6b2520', 'Inset line on error-bg.'),
 'warning': ('#92400e', '#fcd34d', None), 'warning-bg': ('#fef3c7', '#33240a', '«للحفظ» and repetition badges.'), 'warning-line': ('#fde68a', '#5c4210', 'Inset line on warning-bg.'),
 'info': ('#0f766e', '#5eead4', None), 'info-bg': ('#f0fdfa', '#0b2a28', 'Info boxes in the reader.'),
 'toast-bg': ('#052e25', '#1d4a3b', 'Toast fill (inverse of the page).'), 'toast-fg': ('#ecfdf5', '#ecfdf5', None), 'toast-bad-bg': ('#7a1d14', '#7a1d14', 'Toast fill for a failed action.'),
 'skel-base': ('#e6efea', '#12291f', 'Loading skeleton base.'), 'skel-shine': ('#f5faf7', '#1b3a2e', 'Loading skeleton highlight.'),
 'scrim': ('rgba(2,44,34,.45)', 'rgba(0,0,0,.6)', 'Backdrop behind the sheet.'),
 'tabs-bg': ('rgba(255,255,255,.94)', 'rgba(12,34,25,.94)', 'Bottom tab bar, blurred over content.'),
}
S = lambda k: (sem[k][0], sem[k][1])
notes = {
 'text': f"Body copy and headings on bg, surface and surface-2 ({pair(S('text'), S('surface'))} on surface).",
 'text-2': f"Card subtitles and strong secondary copy on surface ({pair(S('text-2'), S('surface'))}).",
 'text-muted': f"Captions, meta lines, inactive segments on surface and bg ({pair(S('text-muted'), S('surface'))} on surface; {pair(S('text-muted'), S('bg'))} on bg).",
 'text-badge': f"Neutral badge text on surface-2 ({pair(S('text-badge'), S('surface-2'))}).",
 'text-tab': f"Inactive bottom-tab labels on tabs-bg ({pair(S('text-tab'), ('#ffffff', '#0c2219'))}).",
 'brand': f"Links, active tab icon, brand text on surface ({pair(S('brand'), S('surface'))}).",
 'brand-strong': f"Text on brand-soft: soft buttons, brand badges, option numbers ({pair(S('brand-strong'), S('brand-soft'))}).",
 'on-brand': f"Label on the primary gradient (worst point under the label {min(cr('#ffffff', mix(EM[800], EM[600], t / 10)) for t in range(3, 8))}:1 light; {cr(D['on-brand'], EM[500])}:1 dark).",
 'accent-text': f"Gold as text (best-score numbers, small gold labels) on surface ({pair(S('accent-text'), S('surface'))}).",
 'focus': f"Keyboard focus ring: 3px solid, offset 2px, on a 2px focus-halo ({pair(S('focus'), S('surface'))} against the halo; non-text, 3:1 needed). Inside dark surfaces of the light theme (header, hero, flashcard back) use emerald-200 on an emerald-950 halo ({cr(EM[200], EM[950])}:1). App v3.4.1 draws exactly this.",
 'success': f"Correct / done text on success-bg ({pair(S('success'), S('success-bg'))}). Always paired with a check icon or the word.",
 'error': f"Wrong / failed text on error-bg ({pair(S('error'), S('error-bg'))}). Always paired with an x icon or the word.",
 'warning': f"Memorise / repeat badge text on warning-bg ({pair(S('warning'), S('warning-bg'))}).",
 'info': f"Info box text on info-bg ({pair(S('info'), S('info-bg'))}).",
 'toast-fg': f"Toast text on toast-bg ({pair(S('toast-fg'), S('toast-bg'))}) and on toast-bad-bg ({cr('#ecfdf5', '#7a1d14')}:1).",
}
for k, (l, d, u) in sem.items(): tok(k, l, d, notes.get(k, u))
# ---- primitives (same in both themes)
for k, v in EM.items(): tok(f'emerald-{k}', v, None, {700: 'Brand emerald; text-safe on white (5.48:1).', 600: 'Focus ring; gradient end.', 900: 'Deep ink for headings on light grounds.', 950: 'Deepest emerald: hero ground.'}.get(k, 'Emerald scale (the app’s brand ramp).'))
for k, v in GOLD.items(): tok(f'gold-{k}', v, None, {500: 'Icon gold (mid stop of the icon’s gold gradient).', 800: f'Gold dark enough for text on white ({cr(v, "#ffffff")}:1).', 300: 'Gold on deep emerald (titles in store art).'}.get(k, 'Gold scale, generated from gold-500.'))
for k, v in NEU.items(): tok(f'neutral-{k}', v, None, 'Green-tinted neutral (anchors match the app: 50, 100, 200, 600, 800, 900).')
tok('ivory', '#fbf6e8', None, 'Title colour on deep emerald in store art and the reel.')
GRADE = [('grade-1', '#0e7c86', 'الأول المتوسط'), ('grade-2', '#127a5d', 'الثاني المتوسط'), ('grade-3', '#5b2a86', 'الثالث المتوسط'), ('grade-4', '#2e7d32', 'الرابع العلمي'), ('grade-6', '#996f09', 'السادس العلمي')]
for n, v, g in GRADE: tok(n, v, None, f"Grade colour ({g}): grade chip and the top edge of its card; white label {cr('#ffffff', v)}:1.")
CHAPTER = [('chapter-indigo', '#4a3fb5'), ('chapter-teal', '#0e7c86'), ('chapter-red', '#d2453c'), ('chapter-orange', '#af6415'), ('chapter-magenta', '#c2185b'),
           ('chapter-blue', '#1d7bbe'), ('chapter-green', '#258656'), ('chapter-plum', '#a3479f'), ('chapter-cyan', '#008577'), ('chapter-olive', '#5f811c'),
           ('chapter-navy', '#283593'), ('chapter-gold', '#996f09'), ('chapter-forest', '#2e7d32'), ('chapter-violet', '#7a3fa0'), ('chapter-rust', '#c1551c'), ('chapter-crimson', '#c42a3c')]
for n, v in CHAPTER: tok(n, v, None, f"Chapter colour (--cc in the app): number tile with white text ({cr('#ffffff', v)}:1), the dot on a unit tag, a card's top edge. Never a whole badge or card fill: red and pink chapters would read as errors.")
FONTS = [{'family': 'Cairo', 'file': f'fonts/cairo-{w}.ttf', 'weight': str(w)} for w in (400, 700, 800)] + [{'family': 'Tajawal', 'file': f'fonts/tajawal-{w}.ttf', 'weight': str(w)} for w in (400, 700)]
tokens = {
 'name': 'ملازم الأحياء التفاعلية', 'version': 1,
 'color': {'themes': [{'id': 'light', 'name': 'Light'}, {'id': 'dark', 'name': 'Dark'}], 'tokens': T},
 'type': {'fonts': FONTS, 'families': {'head': "Cairo, 'Segoe UI', Tahoma, sans-serif", 'body': "Tajawal, 'Segoe UI', Tahoma, sans-serif"},
  'groups': [
   {'name': 'Headings', 'family': 'head', 'styles': [
     {'name': 'display', 'fontSize': '44px', 'lineHeight': 1.25, 'fontWeight': 800, 'sample': 'ملازم الأحياء التفاعلية', 'usage': 'Hero title on the landing page and store art.'},
     {'name': 'h1', 'fontSize': '34px', 'lineHeight': 1.3, 'fontWeight': 800, 'sample': 'الفصل الأول: الخلية', 'usage': 'Chapter opener title.'},
     {'name': 'h2', 'fontSize': '28px', 'lineHeight': 1.4, 'fontWeight': 800, 'sample': 'مقدمة وتاريخ علم الخلية', 'usage': 'Lesson title in the reader.'},
     {'name': 'h3', 'fontSize': '22px', 'lineHeight': 1.5, 'fontWeight': 800, 'sample': 'المجهر الضوئي المركّب', 'usage': 'Card and section titles; sheet title.'},
     {'name': 'section', 'fontSize': '19px', 'lineHeight': 1.6, 'fontWeight': 800, 'sample': 'اختر صفّك', 'usage': 'Section heading on home screens (with the short emerald bar).'},
     {'name': 'button', 'fontSize': '16px', 'lineHeight': 1.2, 'fontWeight': 800, 'sample': 'السؤال التالي', 'usage': 'Primary button label.'},
     {'name': 'label', 'fontSize': '12.5px', 'lineHeight': 1.45, 'fontWeight': 800, 'sample': 'أتممت ٣ من ١٢', 'usage': 'Badges and chips.'}]},
   {'name': 'Text', 'family': 'body', 'styles': [
     {'name': 'body', 'fontSize': '15.5px', 'lineHeight': 1.85, 'fontWeight': 400, 'sample': 'الخلية هي الوحدة التركيبية والوظيفية لجميع الكائنات الحية.', 'usage': 'Reader text and card body.'},
     {'name': 'body-strong', 'fontSize': '15.5px', 'lineHeight': 1.85, 'fontWeight': 700, 'sample': 'الجواب: جهاز كولجي', 'usage': 'Key terms and answers inside body text.'},
     {'name': 'small', 'fontSize': '14px', 'lineHeight': 1.6, 'fontWeight': 400, 'sample': 'علم الأحياء، ٤ وحدات، ٣١٨ سؤالًا تفاعليًا', 'usage': 'Card subtitles, helper lines.'},
     {'name': 'caption', 'fontSize': '12.5px', 'lineHeight': 1.6, 'fontWeight': 400, 'sample': 'بطاقة ١ من ١٥، الصندوق ١', 'usage': 'Meta lines under cards and quizzes.'},
     {'name': 'tab', 'fontSize': '11.5px', 'lineHeight': 1.4, 'fontWeight': 800, 'sample': 'الاختبارات', 'usage': 'Bottom tab labels.'}]}]},
 'spacing': {'tokens': [{'name': f'space-{k}', 'value': f'{v}px', 'usage': u} for k, v, u in (
   (1, 4, 'Icon-to-label gap inside badges.'), (2, 8, 'Gap between buttons in a row; icon gap in buttons.'), (3, 12, 'Gap between cards in a grid; sheet row gap.'),
   (4, 16, 'Card padding; page side gutter on phones.'), (5, 20, 'Hero inner padding on phones.'), (6, 24, 'Space between sections.'), (8, 32, 'Space above a section heading.'), (12, 48, 'Empty-state vertical padding.'))]},
 'radius': {'tokens': [{'name': n, 'value': v, 'usage': u} for n, v, u in (
   ('radius-sm', '12px', 'Segment buttons, inputs.'), ('radius-control', '14px', 'Secondary buttons, sheet rows.'), ('radius-md', '16px', 'Primary buttons, segmented track.'),
   ('radius-lg', '22px', 'Cards, empty state, skeleton blocks.'), ('radius-sheet', '26px', 'Top corners of the bottom sheet.'), ('radius-xl', '28px', 'Hero panels.'), ('radius-pill', '999px', 'Badges, soft buttons, toast.'))]},
 'shadow': {'tokens': [
   {'name': 'shadow-1', 'value': {'light': '0 1px 2px rgba(4,49,39,.06), 0 1px 0 rgba(4,49,39,.04)', 'dark': '0 1px 2px rgba(0,0,0,.4)'}, 'usage': 'Resting cards and controls.'},
   {'name': 'shadow-2', 'value': {'light': '0 2px 4px rgba(4,49,39,.05), 0 10px 28px rgba(4,49,39,.08)', 'dark': '0 8px 24px rgba(0,0,0,.45)'}, 'usage': 'Hovered cards.'},
   {'name': 'shadow-3', 'value': {'light': '0 6px 14px rgba(4,49,39,.10), 0 22px 48px rgba(4,49,39,.14)', 'dark': '0 12px 36px rgba(0,0,0,.55)'}, 'usage': 'Toast, sheet, floating elements.'},
   {'name': 'shadow-brand', 'value': {'light': '0 8px 18px -8px rgba(5,150,105,.7)', 'dark': '0 8px 18px -8px rgba(52,211,153,.45)'}, 'usage': 'Under the primary gradient button.'}]},
 'size': {'tokens': [{'name': n, 'value': v, 'usage': u} for n, v, u in (
   ('tap-target', '44px', 'Minimum height of anything tappable.'), ('button-height', '48px', 'Primary button height.'), ('badge-height', '26px', 'Badge min-height.'), ('tab-height', '52px', 'Bottom tab button height.'))]},
}
json.dump(tokens, open(OUT, 'w'), ensure_ascii=False, indent=1)
import re
bad = []
for t in T:
    if t['name'] == 'focus' or not t['usage']: continue
    for v in re.findall(r'([0-9]+\.?[0-9]*):1', t['usage']):
        if float(v) < 4.5: bad.append((t['name'], v))
print('colors', len(T), '| contrast notes under 4.5 (excluding focus):', bad)
for t in T:
    if t['usage'] and ':1' in t['usage']: print(f"  {t['name']:14s} {t['usage'][:150]}")
