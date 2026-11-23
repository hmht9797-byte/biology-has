# -*- coding: utf-8 -*-
"""Build the Android APK of the interactive booklet without the Android SDK.

Steps: offline web assets -> javac -> dx -> binary manifest + resources.arsc
       -> aligned zip -> apksig (v1+v2).
"""
import os, re, json, struct, shutil, subprocess, zipfile, glob, io
from PIL import Image, ImageDraw, ImageFilter

A = os.path.dirname(os.path.abspath(__file__))
R = os.path.dirname(A)
T = '/tmp/claude-0/apk/tools'
OUT = A + '/build'
PKG = 'com.hassan.bio3'
LABEL = 'ملازم الأحياء'
VER_CODE, VER_NAME = 23, '3.5.0'
shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT + '/assets/fonts'); os.makedirs(OUT + '/classes')

def run(*cmd):
    subprocess.run(cmd, check=True)

# ---------- 1. offline web assets ----------
FONTS = {  # file -> (family, weight)
    'Iura6YBj_oCad4k1rzY.ttf': ('Tajawal', 400), 'Iurf6YBj_oCad4k1l4qkLrY.ttf': ('Tajawal', 700),
    'SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hOA-W1Q.ttf': ('Cairo', 400),
    'SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hAc5W1Q.ttf': ('Cairo', 700),
    'SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hEk5W1Q.ttf': ('Cairo', 800)}
ff = ''
for f, (fam, w) in FONTS.items():
    n = f'{fam.lower()}-{w}.ttf'
    shutil.copy(os.path.expanduser('~/.fonts/') + f, f'{OUT}/assets/fonts/{n}')
    ff += f"@font-face{{font-family:'{fam}';font-weight:{w};font-display:block;src:url('fonts/{n}') format('truetype')}}\n"
if not ff.count('Cairo') >= 3: raise SystemExit('fonts missing')

shell = open(R + '/app/index.html', encoding='utf8').read()
data = open(R + '/app/chapters.json', encoding='utf8').read().replace('</', '<\\/')
shell = re.sub(r'<link rel="preconnect"[^>]*>\s*', '', shell)
shell = re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>', f'<style>{ff}</style>', shell)
shell = shell.replace('<meta charset="utf-8">', '')
# the wrapper below carries the one viewport tag, in <head>; drop the shell's copy so the page has exactly one
shell, n_vp = re.subn(r'<meta name="viewport"[^>]*>\s*', '', shell)
assert n_vp == 1, 'viewport meta not found in index.html'
# the data is embedded in the APK: swap the network fetch for the embedded copy (and fail the build if the hook moved)
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
shutil.copy(R + '/app/three.min.js', OUT + '/assets/three.min.js')
open(OUT + '/assets/index.html', 'w', encoding='utf8').write(html)

# ---------- 2. launcher icon ----------
S = 432
img = Image.new('RGBA', (S, S))
g = Image.linear_gradient('L').rotate(-35, expand=False).resize((S, S))
top, bot = Image.new('RGB', (S, S), (91, 42, 134)), Image.new('RGB', (S, S), (22, 51, 107))
bg = Image.composite(bot, top, g)
pink = Image.new('RGB', (S, S), (224, 69, 123)); m = Image.new('L', (S, S), 0)
ImageDraw.Draw(m).ellipse((S * .45, -S * .3, S * 1.3, S * .55), fill=170); bg = Image.composite(pink, bg, m.filter(ImageFilter.GaussianBlur(60)))
mask = Image.new('L', (S, S), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, S - 1, S - 1), radius=96, fill=255)
img.paste(bg, (0, 0), mask)
d = ImageDraw.Draw(img); W = 22
# heart outline
heart = []
import math
for t in range(0, 361, 3):
    a = math.radians(t)
    x = 16 * math.sin(a) ** 3; y = 13 * math.cos(a) - 5 * math.cos(2 * a) - 2 * math.cos(3 * a) - math.cos(4 * a)
    heart.append((S / 2 + x * 9.2, S * .47 - y * 9.2))
d.line(heart + [heart[0]], fill=(255, 255, 255), width=W, joint='curve')
# ECG line across the heart
ecg = [(S * .17, S * .5), (S * .36, S * .5), (S * .42, S * .38), (S * .5, S * .64), (S * .57, S * .44), (S * .62, S * .5), (S * .83, S * .5)]
d.line(ecg, fill=(255, 211, 77), width=W - 4, joint='curve')
for p in (ecg[0], ecg[-1]): d.ellipse((p[0] - 9, p[1] - 9, p[0] + 9, p[1] + 9), fill=(255, 211, 77))
os.makedirs(OUT + '/res/drawable')
img.resize((192, 192), Image.LANCZOS).save(OUT + '/res/drawable/icon.png', optimize=True)
img.resize((512, 512), Image.LANCZOS).save(A + '/icon_preview.png')

# ---------- 3. compile + dex ----------
AJ = T + '/android-4.1.1.4.jar'
run('javac', '-nowarn', '--release', '8', '-cp', AJ, '-d', OUT + '/classes', *glob.glob(A + '/src/**/*.java', recursive=True))
run('java', '-cp', T + '/dalvik-dx-16.0.1.jar', 'com.android.dx.command.Main', '--dex', '--min-sdk-version=24',
    '--output=' + OUT + '/classes.dex', OUT + '/classes')

# ---------- 4. binary AndroidManifest.xml ----------
NS = 'http://schemas.android.com/apk/res/android'
ATTR = {'versionCode': 0x0101021b, 'versionName': 0x0101021c, 'minSdkVersion': 0x0101020c, 'targetSdkVersion': 0x01010270,
        'label': 0x01010001, 'icon': 0x01010002, 'name': 0x01010003, 'exported': 0x01010010, 'configChanges': 0x0101001f,
        'hardwareAccelerated': 0x010102d3, 'allowBackup': 0x01010280}
T_REF, T_STR, T_INT, T_HEX, T_BOOL = 0x01, 0x03, 0x10, 0x11, 0x12
# element tree: (tag, [(ns?, name, type, value)], children)
manifest = ('manifest', [(0, 'versionCode', T_INT, VER_CODE), (0, 'versionName', T_STR, VER_NAME), (None, 'package', T_STR, PKG)], [
    ('uses-sdk', [(0, 'minSdkVersion', T_INT, 24), (0, 'targetSdkVersion', T_INT, 34)], []),
    ('application', [(0, 'label', T_STR, LABEL), (0, 'icon', T_REF, 0x7f010000), (0, 'allowBackup', T_BOOL, True),
                     (0, 'hardwareAccelerated', T_BOOL, True)], [
        ('activity', [(0, 'name', T_STR, PKG + '.MainActivity'), (0, 'exported', T_BOOL, True),
                      (0, 'configChanges', T_HEX, 0x04a0 | 0x0400 | 0x0080 | 0x0800), (0, 'label', T_STR, LABEL)], [
            ('intent-filter', [], [
                ('action', [(0, 'name', T_STR, 'android.intent.action.MAIN')], []),
                ('category', [(0, 'name', T_STR, 'android.intent.category.LAUNCHER')], [])])])])])

def u16pool(strings):
    """UTF-16 string pool chunk."""
    offs, body = [], b''
    for s in strings:
        offs.append(len(body)); e = s.encode('utf-16-le')
        body += struct.pack('<H', len(s)) + e + b'\0\0'
    while len(body) % 4: body += b'\0'
    hdr = 28; start = hdr + 4 * len(strings)
    return struct.pack('<HHIIIIII', 1, hdr, start + len(body), len(strings), 0, 0, start, 0) + b''.join(struct.pack('<I', o) for o in offs) + body

def axml(root):
    # string order: attribute names with resource ids first (resource map), then the rest
    attr_names = []
    def walk(n):
        for a in n[1]:
            if a[0] == 0 and a[1] not in attr_names: attr_names.append(a[1])
        for c in n[2]: walk(c)
    walk(root)
    strings = list(attr_names)
    def sid(s):
        if s not in strings: strings.append(s)
        return strings.index(s)
    sid('android'); sid(NS)
    chunks = []
    def node(n):
        tag, attrs, kids = n
        body = b''
        attrs = sorted(attrs, key=lambda a: ATTR.get(a[1], 0xffffffff) if a[0] == 0 else 0)  # sorted by res id
        for ns, name, typ, val in attrs:
            nsi = sid(NS) if ns == 0 else 0xffffffff
            if typ == T_STR: raw = sid(val); data = raw
            else:
                raw = 0xffffffff
                data = (0xffffffff if val else 0) if typ == T_BOOL else val
            body += struct.pack('<IIIHBBI', nsi, sid(name), raw, 8, 0, typ, data)
        ext = struct.pack('<IIHHHHHH', 0xffffffff, sid(tag), 20, 20, len(attrs), 0, 0, 0)
        chunks.append(struct.pack('<HHIII', 0x0102, 16, 16 + len(ext) + len(body), 1, 0xffffffff) + ext + body)
        for k in kids: node(k)
        chunks.append(struct.pack('<HHIIIII', 0x0103, 16, 24, 1, 0xffffffff, 0xffffffff, sid(tag)))
    node(root)
    ns_start = struct.pack('<HHIIIII', 0x0100, 16, 24, 1, 0xffffffff, sid('android'), sid(NS))
    ns_end = struct.pack('<HHIIIII', 0x0101, 16, 24, 1, 0xffffffff, sid('android'), sid(NS))
    pool = u16pool(strings)
    resmap = struct.pack('<HHI', 0x0180, 8, 8 + 4 * len(attr_names)) + b''.join(struct.pack('<I', ATTR[a]) for a in attr_names)
    body = pool + resmap + ns_start + b''.join(chunks) + ns_end
    return struct.pack('<HHI', 0x0003, 8, 8 + len(body)) + body

open(OUT + '/AndroidManifest.xml', 'wb').write(axml(manifest))

# ---------- 5. resources.arsc (one drawable: icon) ----------
def arsc():
    gpool = u16pool(['res/drawable/icon.png'])
    tpool = u16pool(['drawable']); kpool = u16pool(['icon'])
    spec = struct.pack('<HHIBBHI', 0x0202, 16, 20, 1, 0, 0, 1) + struct.pack('<I', 0)
    config = struct.pack('<I', 64) + b'\0' * 60
    hdr = 8 + 4 + 4 + 4 + 64
    entries = struct.pack('<HHI', 8, 0, 0) + struct.pack('<HBBI', 8, 0, T_STR, 0)
    typ = struct.pack('<HHIBBHII', 0x0201, hdr, hdr + 4 + len(entries), 1, 0, 0, 1, hdr + 4) + config + struct.pack('<I', 0) + entries
    name = PKG.encode('utf-16-le').ljust(256, b'\0')
    phdr = 288
    pbody = tpool + kpool + spec + typ
    pkg = struct.pack('<HHII', 0x0200, phdr, phdr + len(pbody), 0x7f) + name + struct.pack('<IIIII', phdr, 1, phdr + len(tpool), 1, 0) + pbody
    body = gpool + pkg
    return struct.pack('<HHII', 0x0002, 12, 12 + len(body), 1) + body
open(OUT + '/resources.arsc', 'wb').write(arsc())

# ---------- 6. zip (stored entries aligned to 4 bytes) ----------
unsigned = OUT + '/unsigned.apk'
entries = [('AndroidManifest.xml', OUT + '/AndroidManifest.xml', True), ('classes.dex', OUT + '/classes.dex', True),
           ('resources.arsc', OUT + '/resources.arsc', False), ('res/drawable/icon.png', OUT + '/res/drawable/icon.png', False)]
for f in sorted(glob.glob(OUT + '/assets/**/*', recursive=True)):
    if os.path.isfile(f): entries.append((os.path.relpath(f, OUT), f, not f.endswith('.png')))
with open(unsigned, 'wb') as fp, zipfile.ZipFile(fp, 'w') as z:
    for arc, path, deflate in entries:
        zi = zipfile.ZipInfo(arc, date_time=(2026, 1, 1, 0, 0, 0))
        zi.compress_type = zipfile.ZIP_DEFLATED if deflate else zipfile.ZIP_STORED
        if not deflate:
            off = fp.tell() + 30 + len(arc.encode())
            pad = (-(off + 4)) % 4
            zi.extra = struct.pack('<HH', 0xd935, pad) + b'\0' * pad
        z.writestr(zi, open(path, 'rb').read())

# ---------- 7. sign ----------
ks = A + '/release.p12'
if not os.path.exists(ks):
    run('keytool', '-genkeypair', '-keystore', ks, '-storetype', 'PKCS12', '-storepass', 'bio3pass', '-keypass', 'bio3pass',
        '-alias', 'bio3', '-keyalg', 'RSA', '-keysize', '2048', '-validity', '10000',
        '-dname', 'CN=Hassan Mujtaba Al-Taweel, O=Biology Booklet, C=IQ')
cp = T + '/apksig-2.3.0.jar'
run('javac', '-nowarn', '-cp', cp, '-d', OUT + '/signer', A + '/signer/Sign.java')
final = R + '/ملازم_الأحياء_المتوسط.apk'
run('java', '--add-exports', 'java.base/sun.security.x509=ALL-UNNAMED', '--add-exports', 'java.base/sun.security.pkcs=ALL-UNNAMED', '--add-exports', 'java.base/sun.security.util=ALL-UNNAMED', '-cp', cp + ':' + OUT + '/signer', 'Sign', unsigned, final, ks, 'bio3pass', 'bio3')
print('APK', final, os.path.getsize(final) // 1024, 'KB')
