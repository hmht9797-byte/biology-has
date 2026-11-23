# -*- coding: utf-8 -*-
"""يربط خريطة الفيديوهات src/data/motionVideos.json بالتطبيق: يضعها في app/chapters.json تحت المفتاح «motion».

    python3 motion-generator/scripts/link_app.py

التطبيق يقرأ BOOK.motion["g2-c1"] = {url, poster, seconds} ويعرض بطاقة «شاهد ملخص الفصل» في صفحة الفصل.
البناء الكامل app/build_app.py يضمّ الخريطة بالطريقة نفسها (motion_map أدناه).
الفيديوهات لا تدخل حزمة APK/AAB: التطبيق يشغّلها من رابطها.
"""
import json
import os

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MAP = os.path.join(REPO, 'src', 'data', 'motionVideos.json')


def motion_map():
    if not os.path.exists(MAP):
        return {}
    v = json.load(open(MAP, encoding='utf8')).get('videos', {})
    return {k: {'url': x['url'], 'poster': x.get('poster'), 'seconds': x.get('seconds')} for k, x in v.items() if x.get('url')}


if __name__ == '__main__':
    path = os.path.join(REPO, 'app', 'chapters.json')
    book = json.load(open(path, encoding='utf8'))
    book['motion'] = motion_map()
    json.dump(book, open(path, 'w', encoding='utf8'), ensure_ascii=False)
    print('app/chapters.json: motion =', ', '.join(book['motion']) or '(لا فيديوهات)')
