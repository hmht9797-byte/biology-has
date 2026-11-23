# -*- coding: utf-8 -*-
"""يولّد التعليق الصوتي العربي الفصيح لفصل واحد، مشهدًا مشهدًا.

    python3 scripts/tts.py g2-c1            (الصف 2، الفصل 1)

المخرجات في public/audio/<key>/:
    s01.mp3 … ، و manifest.json = [{file, duration, words:[{t, d, w}]}] بالثواني
المحرك: edge-tts بصوت ar-SA-HamedNeural مع توقيت كل كلمة (WordBoundary).
البديل التلقائي: gTTS (ar)، والتوقيت يُقدَّر من طول كل كلمة.
"""
import asyncio
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICE = 'ar-SA-HamedNeural'
RATE = '+6%'

# خلف وكيل يعيد توقيع TLS: يُستعمل ملف شهاداته (التحقق يبقى مفعّلًا)
CA = os.environ.get('SSL_CERT_FILE') or ('/root/.ccr/ca-bundle.crt' if os.path.exists('/root/.ccr/ca-bundle.crt') else None)
if CA:
    import certifi
    certifi.where = lambda: CA


def duration(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True, check=True)
    return round(float(out.stdout.strip()), 3)


async def edge(text, path):
    import edge_tts
    words = []
    com = edge_tts.Communicate(text, VOICE, rate=RATE, boundary='WordBoundary')
    with open(path, 'wb') as f:
        async for chunk in com.stream():
            if chunk['type'] == 'audio':
                f.write(chunk['data'])
            elif chunk['type'] == 'WordBoundary':
                words.append({'t': round(chunk['offset'] / 1e7, 3), 'd': round(chunk['duration'] / 1e7, 3), 'w': chunk['text']})
    return words


def gtts(text, path):
    from gtts import gTTS
    gTTS(text, lang='ar').save(path)
    toks = text.split()
    total = duration(path)
    weights = [len(t) + 2 for t in toks]
    acc, words = 0.15, []
    span = max(total - 0.3, 0.1)
    for t, w in zip(toks, weights):
        d = span * w / sum(weights)
        words.append({'t': round(acc, 3), 'd': round(d, 3), 'w': t})
        acc += d
    return words


def attach_punct(text, words):
    """تعيد علامات الوقف التي يحذفها محرك الصوت من الكلمات، لتنكسر الترجمة عندها"""
    toks = text.split()
    j = 0
    for w in words:
        while j < len(toks) and re.sub(r'[^\w]', '', toks[j]) != re.sub(r'[^\w]', '', w['w']):
            j += 1
        if j < len(toks):
            w['w'] = toks[j]
            j += 1
    return words


def chapter(key):
    m = re.match(r'^g(\d+)-c(\d+)$', key)
    if not m:
        raise SystemExit('المفتاح بصيغة g2-c1')
    cur = json.load(open(os.path.join(ROOT, 'data', 'curriculum.json'), encoding='utf8'))
    g = next(g for g in cur['grades'] if g['id'] == int(m[1]))
    return next(c for c in g['chapters'] if c['n'] == int(m[2]))


def main(key):
    ch = chapter(key)
    if not ch.get('scenes'):
        raise SystemExit(f'{key}: لا يوجد سكربت لهذا الفصل بعد')
    out = os.path.join(ROOT, 'public', 'audio', key)
    os.makedirs(out, exist_ok=True)
    manifest, engine = [], 'edge-tts'
    for i, sc in enumerate(ch['scenes'], 1):
        name = f's{i:02d}.mp3'
        path = os.path.join(out, name)
        text = sc['narration'].strip()
        try:
            words = asyncio.run(edge(text, path))
            if not words or os.path.getsize(path) < 1000:
                raise RuntimeError('edge-tts returned no audio')
        except Exception as e:  # noqa: BLE001 — أي فشل في الخدمة ينقلنا إلى البديل
            print(f'  edge-tts فشل ({type(e).__name__}: {e}); البديل gTTS', file=sys.stderr)
            engine = 'gTTS'
            words = gtts(text, path)
        manifest.append({'file': f'audio/{key}/{name}', 'duration': duration(path), 'words': attach_punct(text, words)})
    json.dump(manifest, open(os.path.join(out, 'manifest.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    total = sum(s['duration'] for s in manifest)
    print(json.dumps({'key': key, 'engine': engine, 'scenes': len(manifest), 'speech_seconds': round(total, 1)}, ensure_ascii=False))


if __name__ == '__main__':
    main(sys.argv[1])
