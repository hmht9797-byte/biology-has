# -*- coding: utf-8 -*-
"""App-icon family from one drawing (the reel's microscope + cell mark): legacy launcher, Play 512, adaptive layers, monochrome."""
import os, json
os.makedirs('out/icon', exist_ok=True)
P = json.load(open('out/palette.json'))
DEFS = '''<defs><linearGradient id="ig" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#11815d"/><stop offset=".5" stop-color="#064534"/><stop offset="1" stop-color="#02231a"/></linearGradient>
<linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe7ad"/><stop offset=".55" stop-color="#dcab48"/><stop offset="1" stop-color="#a87020"/></linearGradient>
<radialGradient id="cg" cx=".4" cy=".38" r=".7"><stop offset="0" stop-color="#8ef0c8" stop-opacity=".5"/><stop offset="1" stop-color="#12a57b" stop-opacity=".08"/></radialGradient>
<radialGradient id="hl" cx=".22" cy=".18" r=".75"><stop offset="0" stop-color="#5eead4" stop-opacity=".22"/><stop offset="1" stop-color="#5eead4" stop-opacity="0"/></radialGradient>
<linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>'''
CELL = '''<circle cx="190" cy="200" r="122" fill="url(#cg)" stroke="#a8f2d4" stroke-opacity=".4" stroke-width="4"/>
<circle cx="160" cy="176" r="34" fill="#0b5a43" stroke="#a8f2d4" stroke-opacity=".55" stroke-width="4"/><circle cx="153" cy="170" r="11" fill="#a8f2d4" fill-opacity=".65"/>
<ellipse cx="220" cy="268" rx="22" ry="10" transform="rotate(-28 220 268)" fill="none" stroke="#a8f2d4" stroke-opacity=".6" stroke-width="4"/>
<circle cx="112" cy="250" r="6" fill="#a8f2d4" fill-opacity=".6"/><circle cx="230" cy="120" r="5" fill="#a8f2d4" fill-opacity=".55"/>'''
SCOPE = '''<g fill="{f}">
 <path d="M318 402c0-44 66-58 66-130 0-58-44-96-96-104" fill="none" stroke="{f}" stroke-width="30" stroke-linecap="round"/>
 <rect x="150" y="398" width="250" height="36" rx="18"/><rect x="196" y="316" width="168" height="22" rx="11"/>
 <g transform="rotate(-32 262 178)"><rect x="236" y="96" width="52" height="150" rx="18"/><rect x="242" y="62" width="40" height="40" rx="9"/><rect x="249" y="244" width="26" height="40" rx="7"/></g>
 <circle cx="292" cy="170" r="22"/><circle cx="366" cy="300" r="15" fill="{knob}" stroke="{f}" stroke-width="8"/></g>'''
ART = CELL + SCOPE.format(f='url(#gd)', knob='#0b5a43')
MONO = SCOPE.format(f='#fff', knob='none')   # themed icon: microscope silhouette only (the translucent cell does not survive one-colour tinting)
SV = lambda body, bg='': f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">{DEFS}{bg}{body}</svg>'
FIT = 'translate(256 258) scale({s}) translate(-234 -248)'
files = {
 # legacy launcher (API 24-25) and in-app / marketing use: rounded square, transparent corners
 'launcher_legacy.svg': SV('<rect x="6" y="6" width="500" height="500" rx="120" fill="url(#ig)"/><rect x="6" y="6" width="500" height="500" rx="120" fill="url(#hl)"/>'
                           '<rect x="20" y="20" width="472" height="472" rx="108" fill="none" stroke="url(#gd)" stroke-width="5" opacity=".9"/>'
                           f'<g transform="{FIT.format(s=.94)}">{ART}</g>'
                           '<path d="M6 126A120 120 0 0 1 126 6h260a120 120 0 0 1 120 120v70C380 250 160 250 6 196z" fill="url(#gl)"/>'),
 # Google Play 512: full-bleed square with no frame or corners of its own; Play applies its own corner mask (30% radius in the current spec)
 'play_512.svg': SV('<rect width="512" height="512" fill="url(#ig)"/><rect width="512" height="512" fill="url(#hl)"/>'
                    f'<g transform="{FIT.format(s=.94)}">{ART}</g><path d="M0 0h512v196C380 250 160 250 0 196z" fill="url(#gl)"/>'),
 # adaptive icon (API 26+): 108dp layers, art inside the 66dp safe circle
 'adaptive_bg.svg': SV('<rect width="512" height="512" fill="url(#ig)"/><rect width="512" height="512" fill="url(#hl)"/>'),
 'adaptive_fg.svg': SV(f'<g transform="{FIT.format(s=.56)}">{ART}</g>'),
 'adaptive_mono.svg': SV(f'<g transform="translate(256 258) scale(.62) translate(-275 -248)">{MONO}</g>'),
}
for n, s in files.items(): open('out/icon/' + n, 'w').write(s)
print('written', list(files))
