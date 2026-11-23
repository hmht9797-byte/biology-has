# -*- coding: utf-8 -*-
"""يجمع app/index.html من shell.html وstyle.css وtheme.css وملفات JS (البيانات تبقى في chapters.json).
يستدعيه build_app.py (البناء الكامل) وg5/build_g5.py (تحديث الصف الخامس وحده)."""
import os
import re

D = os.path.dirname(os.path.abspath(__file__))
R = os.path.dirname(D)


def read(p):
    return open(p, encoding='utf8').read()


def write_index():
    css = re.sub(r'@page[^{]*\{[^}]*\}', '', read(R + '/style.css'))
    js = read(D + '/lab3d.js') + '\n' + read(D + '/extras.js') + '\n' + read(D + '/wiz.js') + '\n' + read(D + '/motion_engine.js') + '\n' + read(D + '/motion_player.js')
    shell = read(D + '/shell.html').replace('/*BOOKCSS*/', css).replace('/*THEMECSS*/', read(D + '/theme.css')).replace('/*EXTRAJS*/', js)
    open(D + '/index.html', 'w', encoding='utf8').write(shell)
