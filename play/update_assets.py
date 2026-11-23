# -*- coding: utf-8 -*-
"""يحدّث صفحة نسخة المتجر: play/BiologyBooklet/app/src/main/assets/index.html
من app/index.html وapp/chapters.json (البيانات تُضمَّن داخل الصفحة، والخطوط من مجلد assets/fonts نفسه).

هو الخطوة الأولى من android/build_apk.py نفسها، دون الحاجة إلى ~/.fonts ولا أدوات بناء APK.
الاستخدام (بعد python3 app/build_app.py أو python3 g5/build_g5.py):
    python3 play/update_assets.py
ثم ابنِ ملف المتجر كما في «اقرأني_خطوات_النشر.txt».
"""
import os
import re
import shutil
import sys

R = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = R + '/play/BiologyBooklet/app/src/main/assets'

# الترتيب نفسه في android/build_apk.py (FONTS)، فتخرج الصفحة مطابقة لما يبنيه
FONTS = [('Tajawal', 400), ('Tajawal', 700), ('Cairo', 400), ('Cairo', 700), ('Cairo', 800)]
ff = ''
for fam, w in FONTS:
    n = f'{fam.lower()}-{w}.ttf'
    if not os.path.exists(f'{ASSETS}/fonts/{n}'):
        raise SystemExit(f'الخط غير موجود: {ASSETS}/fonts/{n}')
    ff += f"@font-face{{font-family:'{fam}';font-weight:{w};font-display:block;src:url('fonts/{n}') format('truetype')}}\n"

shell = open(R + '/app/index.html', encoding='utf8').read()
data = open(R + '/app/chapters.json', encoding='utf8').read().replace('</', '<\\/')
shell = re.sub(r'<link rel="preconnect"[^>]*>\s*', '', shell)
shell = re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>', f'<style>{ff}</style>', shell)
shell = shell.replace('<meta charset="utf-8">', '')
shell, n_vp = re.subn(r'<meta name="viewport"[^>]*>\s*', '', shell)
assert n_vp == 1, 'viewport meta not found in index.html'
FETCH = "fetch('chapters.json').then(r=>{if(!r.ok)throw r.status;return r.json()})"
assert shell.count(FETCH) == 1, 'chapters.json fetch hook not found in index.html'
shell = shell.replace(FETCH, 'Promise.resolve(window.BOOK)')
shell = shell.replace('<script>\nconst $=', f'<script>window.BOOK={data};</script>\n<script>\nconst $=', 1)
assert 'window.BOOK=' in shell
html = ('<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">'
        '</head><body>' + shell + '</body></html>')
html = html.replace('window.THREE_SRC="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"', 'window.THREE_SRC="three.min.js"')
assert 'THREE_SRC="three.min.js"' in html
shutil.copy(R + '/app/three.min.js', ASSETS + '/three.min.js')
open(ASSETS + '/index.html', 'w', encoding='utf8').write(html)
print(f'{ASSETS}/index.html  {len(html.encode()) // 1024} KB')
