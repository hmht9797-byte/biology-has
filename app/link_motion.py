# -*- coding: utf-8 -*-
"""يربط الموشن غرافيك بالتطبيق: يقرأ app/motion/g<الصف>/c<الفصل>.json ويضعها في app/chapters.json تحت «motion».

    python3 app/link_motion.py

التطبيق يقرأ BOOK.motion["g2-c1"] (بيانات المشاهد) ويعرض بطاقة «شاهد ملخص الفصل - موشن غرافيك» في صفحة الفصل.
البناء الكامل app/build_app.py يضمّ الخريطة بالطريقة نفسها (motion_map أدناه).
كل شيء داخل التطبيق: الحركة SVG والموسيقى تولَّد بـ Web Audio، فلا ملفات فيديو ولا حاجة إلى الإنترنت.
"""
import json
import os
import re

D = os.path.dirname(os.path.abspath(__file__))
MOTION = os.path.join(D, 'motion')


def motion_map():
    out = {}
    if not os.path.isdir(MOTION):
        return out
    for g in sorted(os.listdir(MOTION)):
        if not re.fullmatch(r'g\d+', g):
            continue
        for f in sorted(os.listdir(os.path.join(MOTION, g)), key=lambda x: int(re.sub(r'\D', '', x) or 0)):
            m = re.fullmatch(r'c(\d+)\.json', f)
            if m:
                out[f'{g}-c{m.group(1)}'] = json.load(open(os.path.join(MOTION, g, f), encoding='utf8'))
    return out


if __name__ == '__main__':
    path = os.path.join(D, 'chapters.json')
    book = json.load(open(path, encoding='utf8'))
    book['motion'] = motion_map()
    json.dump(book, open(path, 'w', encoding='utf8'), ensure_ascii=False)
    print('app/chapters.json: motion =', len(book['motion']), 'فصلًا')
