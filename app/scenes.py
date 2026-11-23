# -*- coding: utf-8 -*-
"""Animated SVG scenes (SMIL) – one per chapter. Labels are Arabic, svg is LTR."""
F = 'font-family="Tajawal,Cairo,sans-serif" font-weight="700"'

def wrap(vb, body, cap):
    return f'''<figure class="scene"><svg viewBox="{vb}" {F} font-size="15" role="img" aria-label="{cap}">{body}</svg>
<figcaption><span class="dot"></span>{cap}</figcaption></figure>'''

S = {}

# 1 – nerve impulse along a neuron
S[1] = wrap("0 0 720 260", '''
<path id="ax1" d="M150 130 C250 130 300 130 560 130" fill="none"/>
<g fill="#ecebfb" stroke="#4a3fb5" stroke-width="4">
 <circle cx="110" cy="130" r="48"/>
 <path d="M70 100 L30 60 M66 150 L25 190 M100 84 L90 30 M120 178 L130 230 M150 105 L185 70" fill="none" stroke-linecap="round"/>
</g>
<circle cx="110" cy="130" r="17" fill="#4a3fb5"/>
<rect x="158" y="118" width="400" height="24" rx="12" fill="#f4f2ff" stroke="#4a3fb5" stroke-width="3"/>
<g fill="#c9c3f2" stroke="#4a3fb5" stroke-width="2">
 <rect x="180" y="114" width="60" height="32" rx="14"/><rect x="260" y="114" width="60" height="32" rx="14"/><rect x="340" y="114" width="60" height="32" rx="14"/><rect x="420" y="114" width="60" height="32" rx="14"/>
</g>
<path d="M558 130 L610 90 M558 130 L620 130 M558 130 L610 172" stroke="#4a3fb5" stroke-width="4" stroke-linecap="round"/>
<g fill="#4a3fb5"><circle cx="614" cy="88" r="7"/><circle cx="624" cy="130" r="7"/><circle cx="614" cy="174" r="7"/></g>
<circle r="11" fill="#ffcc33" stroke="#e08a00" stroke-width="3">
 <animateMotion dur="2.2s" repeatCount="indefinite" path="M150 130 C250 130 300 130 600 130"/>
 <animate attributeName="r" values="8;13;8" dur=".5s" repeatCount="indefinite"/>
</circle>
<circle cx="624" cy="130" r="18" fill="none" stroke="#ffcc33" stroke-width="4">
 <animate attributeName="r" values="8;30" dur="2.2s" repeatCount="indefinite"/>
 <animate attributeName="opacity" values="0;0;1;0" keyTimes="0;.8;.9;1" dur="2.2s" repeatCount="indefinite"/>
</circle>
<g fill="#30288a" font-size="16">
 <text x="110" y="205" text-anchor="middle">جسم الخلية</text>
 <text x="360" y="95" text-anchor="middle">المحور (الإيعاز العصبي يسري فيه)</text>
 <text x="640" y="225" text-anchor="middle">التشجرات</text>
 <text x="60" y="30" text-anchor="middle">التفرعات</text>
</g>''', 'الإيعاز العصبي ينتقل من جسم الخلية عبر المحور إلى التشجرات')

# 2 – elbow joint (hinge)
S[2] = wrap("0 0 720 280", '''
<rect x="150" y="118" width="230" height="34" rx="17" fill="#e3f4f5" stroke="#0e7c86" stroke-width="4"/>
<circle cx="380" cy="135" r="26" fill="#fff" stroke="#0e7c86" stroke-width="5"/>
<g>
 <animateTransform attributeName="transform" type="rotate" values="0 380 135;-75 380 135;0 380 135" dur="3s" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .2 1;.4 0 .2 1"/>
 <rect x="380" y="120" width="220" height="30" rx="15" fill="#e3f4f5" stroke="#0e7c86" stroke-width="4"/>
 <circle cx="612" cy="135" r="20" fill="#f6d3b8" stroke="#a0603a" stroke-width="3"/>
</g>
<circle cx="380" cy="135" r="9" fill="#d9a521"/>
<g fill="#095a61" font-size="16">
 <text x="265" y="190" text-anchor="middle">عظم العضد</text>
 <text x="380" y="215" text-anchor="middle">مفصل المرفق (رزّي)</text>
 <text x="380" y="240" text-anchor="middle" font-size="13" fill="#555">يتحرك في اتجاه واحد مثل مفصلة الباب</text>
 <text x="520" y="100" text-anchor="middle">الساعد</text>
</g>''', 'المفصل الرزّي في المرفق: حركة في اتجاه واحد')

# 3 – biceps contracts while forearm rises
S[3] = wrap("0 0 720 300", '''
<rect x="140" y="150" width="240" height="30" rx="15" fill="#fff" stroke="#9a2a22" stroke-width="4"/>
<circle cx="380" cy="165" r="16" fill="#fff" stroke="#9a2a22" stroke-width="4"/>
<g>
 <animateTransform attributeName="transform" type="rotate" values="0 380 165;-65 380 165;0 380 165" dur="3s" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .2 1;.4 0 .2 1"/>
 <rect x="380" y="152" width="210" height="26" rx="13" fill="#fff" stroke="#9a2a22" stroke-width="4"/>
 <circle cx="600" cy="165" r="18" fill="#f6d3b8" stroke="#a0603a" stroke-width="3"/>
</g>
<ellipse cx="265" cy="130" rx="95" ry="22" fill="#d2453c" opacity=".85">
 <animate attributeName="ry" values="22;40;22" dur="3s" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .2 1;.4 0 .2 1"/>
 <animate attributeName="rx" values="95;72;95" dur="3s" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .2 1;.4 0 .2 1"/>
</ellipse>
<ellipse cx="265" cy="200" rx="95" ry="18" fill="#f19a8f" opacity=".85">
 <animate attributeName="ry" values="18;12;18" dur="3s" repeatCount="indefinite"/>
</ellipse>
<g fill="#9a2a22" font-size="16">
 <text x="265" y="60" text-anchor="middle">العضلة ذات الرأسين: تنقبض فتقصر وتنتفخ</text>
 <text x="265" y="250" text-anchor="middle">ذات الثلاثة رؤوس: تنبسط</text>
 <text x="560" y="250" text-anchor="middle" fill="#555" font-size="13">الساعد يقترب من العضد</text>
</g>''', 'العضلات تعمل بأزواج متضادة: إحداهما تنقبض والأخرى تنبسط')

# 4 – peristalsis
S[4] = wrap("0 0 720 220", '''
<path d="M40 110 C160 60 260 160 380 110 S600 60 690 110" fill="none" stroke="#e0801b" stroke-width="64" stroke-linecap="round" opacity=".25"/>
<path id="gut" d="M40 110 C160 60 260 160 380 110 S600 60 690 110" fill="none" stroke="#9e5307" stroke-width="3" stroke-dasharray="2 10"/>
<circle r="22" fill="#a0603a" stroke="#6d3a12" stroke-width="3">
 <animateMotion dur="4s" repeatCount="indefinite" path="M40 110 C160 60 260 160 380 110 S600 60 690 110"/>
</circle>
<g fill="none" stroke="#e0801b" stroke-width="10" stroke-linecap="round">
 <circle r="34" opacity=".8"><animateMotion dur="4s" begin="-.35s" repeatCount="indefinite" path="M40 110 C160 60 260 160 380 110 S600 60 690 110"/></circle>
</g>
<g fill="#9e5307" font-size="16">
 <text x="80" y="190" text-anchor="middle">البلعوم</text>
 <text x="380" y="190" text-anchor="middle">المريء: حركة دودية تدفع اللقمة</text>
 <text x="660" y="190" text-anchor="middle">المعدة</text>
</g>''', 'الحركة الدودية: تنقبض العضلات خلف اللقمة فتدفعها إلى الأمام')

# 5 – beating heart and circulation
S[5] = wrap("0 0 720 300", '''
<path id="loopA" d="M360 150 C260 150 200 60 120 60 C60 60 60 240 120 240 C200 240 260 150 360 150" fill="none" stroke="#5aa9d6" stroke-width="6" opacity=".5"/>
<path id="loopB" d="M360 150 C460 150 520 60 600 60 C660 60 660 240 600 240 C520 240 460 150 360 150" fill="none" stroke="#d2453c" stroke-width="6" opacity=".5"/>
<g transform="translate(360 150)">
 <path d="M0 50 C-60 10 -70 -40 -35 -55 C-15 -62 0 -45 0 -35 C0 -45 15 -62 35 -55 C70 -40 60 10 0 50Z" fill="#c2185b" stroke="#8a0f3f" stroke-width="4">
  <animateTransform attributeName="transform" type="scale" values="1;1.12;1;1.06;1" dur="1s" repeatCount="indefinite"/>
 </path>
</g>
<g fill="#2b6cb0"><circle r="7"><animateMotion dur="3s" repeatCount="indefinite"><mpath href="#loopA"/></animateMotion></circle>
<circle r="7"><animateMotion dur="3s" begin="-1s" repeatCount="indefinite"><mpath href="#loopA"/></animateMotion></circle>
<circle r="7"><animateMotion dur="3s" begin="-2s" repeatCount="indefinite"><mpath href="#loopA"/></animateMotion></circle></g>
<g fill="#d2453c"><circle r="7"><animateMotion dur="3s" repeatCount="indefinite"><mpath href="#loopB"/></animateMotion></circle>
<circle r="7"><animateMotion dur="3s" begin="-1s" repeatCount="indefinite"><mpath href="#loopB"/></animateMotion></circle>
<circle r="7"><animateMotion dur="3s" begin="-2s" repeatCount="indefinite"><mpath href="#loopB"/></animateMotion></circle></g>
<g font-size="16">
 <text x="110" y="155" text-anchor="middle" fill="#125a8f">الرئتان</text>
 <text x="110" y="280" text-anchor="middle" fill="#125a8f" font-size="13">الدورة الصغرى</text>
 <text x="610" y="155" text-anchor="middle" fill="#8a0f3f">أنحاء الجسم</text>
 <text x="610" y="280" text-anchor="middle" fill="#8a0f3f" font-size="13">الدورة الكبرى</text>
 <text x="360" y="230" text-anchor="middle" fill="#8a0f3f">القلب ينبض</text>
</g>''', 'القلب يضخ الدم في دورتين: صغرى إلى الرئتين وكبرى إلى الجسم')

# 6 – breathing lungs + diaphragm
S[6] = wrap("0 0 720 320", '''
<rect x="350" y="20" width="20" height="80" rx="8" fill="#e5f1fb" stroke="#1e7fc4" stroke-width="3"/>
<path d="M360 100 L300 140 M360 100 L420 140" stroke="#1e7fc4" stroke-width="6" stroke-linecap="round"/>
<g fill="#9fd0f0" stroke="#125a8f" stroke-width="4">
 <path class="breathe" d="M300 130 C230 120 200 200 215 250 C240 265 300 260 330 245 C340 200 335 150 300 130Z"/>
 <path class="breathe" d="M420 130 C490 120 520 200 505 250 C480 265 420 260 390 245 C380 200 385 150 420 130Z"/>
</g>
<path d="M170 270 Q360 230 550 270" fill="none" stroke="#d2453c" stroke-width="7" stroke-linecap="round">
 <animate attributeName="d" values="M170 270 Q360 230 550 270;M170 270 Q360 290 550 270;M170 270 Q360 230 550 270" dur="4s" repeatCount="indefinite"/>
</path>
<g fill="#1e7fc4"><circle cx="360" cy="10" r="5"><animate attributeName="cy" values="0;110;0" dur="4s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0;1" dur="4s" repeatCount="indefinite"/></circle>
<circle cx="352" cy="10" r="4"><animate attributeName="cy" values="-20;100;-20" dur="4s" repeatCount="indefinite"/></circle></g>
<g font-size="16" fill="#125a8f">
 <text x="560" y="60">القصبة الهوائية</text>
 <text x="560" y="200">الرئتان تتمددان في الشهيق</text>
 <text x="560" y="300" fill="#9a2a22">الحجاب الحاجز ينخفض في الشهيق</text>
 <text x="40" y="200" fill="#333">الشهيق ↔ الزفير</text>
</g>''', 'في الشهيق ينخفض الحجاب الحاجز فتتسع الرئتان ويدخل الهواء')

# 7 – kidneys -> ureters -> bladder
S[7] = wrap("0 0 720 320", '''
<path d="M250 60 C190 60 180 170 250 170 C270 160 270 140 262 115 C270 90 270 70 250 60Z" fill="#c97b63" stroke="#7a3b26" stroke-width="4"/>
<path d="M470 60 C530 60 540 170 470 170 C450 160 450 140 458 115 C450 90 450 70 470 60Z" fill="#c97b63" stroke="#7a3b26" stroke-width="4"/>
<path id="u1" d="M262 120 C300 160 320 200 340 250" fill="none" stroke="#e6b800" stroke-width="6"/>
<path id="u2" d="M458 120 C420 160 400 200 380 250" fill="none" stroke="#e6b800" stroke-width="6"/>
<path d="M310 240 C310 300 410 300 410 240 C410 225 310 225 310 240Z" fill="#fff8d6" stroke="#2b9a63" stroke-width="4"/>
<rect x="318" y="270" width="84" height="20" rx="8" fill="#f2d24b" opacity=".8">
 <animate attributeName="y" values="285;250;285" dur="5s" repeatCount="indefinite"/>
 <animate attributeName="height" values="5;40;5" dur="5s" repeatCount="indefinite"/>
</rect>
<g fill="#e6b800"><circle r="6"><animateMotion dur="1.6s" repeatCount="indefinite"><mpath href="#u1"/></animateMotion></circle>
<circle r="6"><animateMotion dur="1.6s" begin="-.8s" repeatCount="indefinite"><mpath href="#u1"/></animateMotion></circle>
<circle r="6"><animateMotion dur="1.6s" begin="-.4s" repeatCount="indefinite"><mpath href="#u2"/></animateMotion></circle>
<circle r="6"><animateMotion dur="1.6s" begin="-1.2s" repeatCount="indefinite"><mpath href="#u2"/></animateMotion></circle></g>
<g font-size="16" fill="#196b42">
 <text x="120" y="110" text-anchor="middle">الكلية</text><text x="120" y="130" text-anchor="middle" font-size="13" fill="#555">ترشّح الدم</text>
 <text x="600" y="210" text-anchor="middle">الحالب (22 سم)</text>
 <text x="530" y="290" text-anchor="middle">المثانة تمتلئ بالبول</text>
</g>''', 'الكليتان ترشّحان الدم والبول ينزل بالحالبين إلى المثانة')

# 8 – sperm swimming to egg
S[8] = wrap("0 0 720 260", '''
<circle cx="560" cy="130" r="80" fill="#f6e8f5" stroke="#73296f" stroke-width="4"/>
<circle cx="560" cy="130" r="66" fill="none" stroke="#a3479f" stroke-width="2" stroke-dasharray="6 4">
 <animateTransform attributeName="transform" type="rotate" values="0 560 130;360 560 130" dur="20s" repeatCount="indefinite"/>
</circle>
<circle cx="560" cy="130" r="22" fill="#a3479f"/>
<g>
 <animateMotion dur="4s" repeatCount="indefinite" path="M0 0 C80 -30 200 30 380 0" />
 <g transform="translate(60 130)">
  <ellipse rx="14" ry="10" fill="#d9a521" stroke="#8a5a00" stroke-width="2"/>
  <path d="M-14 0 c-14 -10 -24 10 -38 0 s-24 10 -38 0" fill="none" stroke="#8a5a00" stroke-width="3">
   <animate attributeName="d" values="M-14 0 c-14 -10 -24 10 -38 0 s-24 10 -38 0;M-14 0 c-14 10 -24 -10 -38 0 s-24 -10 -38 0;M-14 0 c-14 -10 -24 10 -38 0 s-24 10 -38 0" dur=".5s" repeatCount="indefinite"/>
  </path>
 </g>
</g>
<g font-size="16" fill="#73296f">
 <text x="560" y="240" text-anchor="middle">البيضة (أكبر بكثير)</text>
 <text x="120" y="200" text-anchor="middle">النطفة تسبح بذيلها</text>
</g>''', 'التلقيح: وصول النطفة إلى البيضة، ثم الإخصاب: اندماج النواتين')

# 9 – eye focusing light (normal)
S[9] = wrap("0 0 720 280", '''
<circle cx="470" cy="140" r="110" fill="#e9f6fb" stroke="#555" stroke-width="5"/>
<circle cx="470" cy="140" r="102" fill="none" stroke="#00897b" stroke-width="5" stroke-dasharray="320 400" transform="rotate(-60 470 140)"/>
<ellipse cx="372" cy="140" rx="14" ry="40" fill="#d4ecff" stroke="#1e7fc4" stroke-width="3"/>
<g stroke="#f2a33a" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="380" stroke-dashoffset="380">
 <path d="M60 80 L372 115 L578 140"><animate attributeName="stroke-dashoffset" values="380;0;0" keyTimes="0;.6;1" dur="3s" repeatCount="indefinite"/></path>
 <path d="M60 200 L372 165 L578 140"><animate attributeName="stroke-dashoffset" values="380;0;0" keyTimes="0;.6;1" dur="3s" repeatCount="indefinite"/></path>
 <path d="M60 140 L578 140"><animate attributeName="stroke-dashoffset" values="380;0;0" keyTimes="0;.6;1" dur="3s" repeatCount="indefinite"/></path>
</g>
<circle cx="578" cy="140" r="9" fill="#d2453c"><animate attributeName="opacity" values="0;0;1;1" keyTimes="0;.55;.65;1" dur="3s" repeatCount="indefinite"/></circle>
<path d="M30 70 L30 210" stroke="#333" stroke-width="5"/><path d="M18 82 L30 70 L42 82" fill="none" stroke="#333" stroke-width="5"/>
<g font-size="16">
 <text x="30" y="240" text-anchor="middle" fill="#333">الجسم</text>
 <text x="372" y="225" text-anchor="middle" fill="#125a8f">العدسة تجمع الضوء</text>
 <text x="610" y="40" text-anchor="middle" fill="#00574b">الشبكية</text>
 <text x="630" y="175" text-anchor="middle" fill="#9a2a22">الصورة على الشبكية</text>
</g>''', 'العين كالكاميرا: العدسة تجمع الأشعة فتسقط الصورة على الشبكية')

# 10 – hormone released into blood to target organ
S[10] = wrap("0 0 720 260", '''
<path id="bl" d="M200 130 C300 60 420 200 560 130" fill="none" stroke="#d2453c" stroke-width="26" opacity=".25" stroke-linecap="round"/>
<path d="M200 130 C300 60 420 200 560 130" fill="none" stroke="#d2453c" stroke-width="3" stroke-dasharray="4 8"/>
<path d="M110 90 C60 100 60 170 110 175 C150 180 180 150 170 120 C165 95 140 85 110 90Z" fill="#6a8f1f" stroke="#45600f" stroke-width="4"/>
<circle cx="610" cy="130" r="48" fill="#fff4e0" stroke="#b8860b" stroke-width="4">
 <animate attributeName="r" values="48;48;54;48" keyTimes="0;.7;.85;1" dur="3s" repeatCount="indefinite"/>
</circle>
<g fill="#ffd54a" stroke="#8a5300" stroke-width="2">
 <path d="M0 -8 L7 6 L-7 6Z"><animateMotion dur="3s" repeatCount="indefinite" path="M170 130 C300 60 420 200 580 130"/></path>
 <path d="M0 -8 L7 6 L-7 6Z"><animateMotion dur="3s" begin="-1s" repeatCount="indefinite" path="M170 130 C300 60 420 200 580 130"/></path>
 <path d="M0 -8 L7 6 L-7 6Z"><animateMotion dur="3s" begin="-2s" repeatCount="indefinite" path="M170 130 C300 60 420 200 580 130"/></path>
</g>
<g font-size="16">
 <text x="115" y="215" text-anchor="middle" fill="#45600f">غدة صمّاء</text>
 <text x="380" y="200" text-anchor="middle" fill="#9a2a22">الهورمون يُفرز في الدم مباشرة</text>
 <text x="610" y="215" text-anchor="middle" fill="#8a5300">العضو الهدف</text>
</g>''', 'الغدة الصمّاء تفرز الهورمون في الدم فيحمله إلى العضو الهدف')

# 11 – antibodies attacking viruses
VIR = '''<g><polygon points="0,-18 16,-9 16,9 0,18 -16,9 -16,-9" fill="#f8d7e3" stroke="#c2185b" stroke-width="3"/><path d="M0 -18 v-8 M16 -9 l7 -4 M16 9 l7 4 M0 18 v8 M-16 9 l-7 4 M-16 -9 l-7 -4" stroke="#c2185b" stroke-width="3"/></g>'''
AB = '''<path d="M0 14 V0 M0 0 L-10 -12 M0 0 L10 -12" stroke="#283593" stroke-width="4" stroke-linecap="round" fill="none"/>'''
S[11] = wrap("0 0 720 280", f'''
<rect x="20" y="20" width="680" height="240" rx="24" fill="#f3f4fb"/>
<g transform="translate(200 90)">{VIR}<animateTransform attributeName="transform" type="translate" values="200 90;210 100;200 90" dur="3s" repeatCount="indefinite"/></g>
<g transform="translate(480 170)">{VIR}<animateTransform attributeName="transform" type="translate" values="480 170;470 160;480 170" dur="3.4s" repeatCount="indefinite"/></g>
<g>{AB}<animateMotion dur="3s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;.6;1" calcMode="linear" path="M80 230 L200 118"/></g>
<g>{AB}<animateMotion dur="3s" begin="-.5s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;.6;1" calcMode="linear" path="M330 240 L228 100"/></g>
<g>{AB}<animateMotion dur="3.4s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;.6;1" calcMode="linear" path="M640 60 L494 150"/></g>
<g>{AB}<animateMotion dur="3.4s" begin="-.7s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;.6;1" calcMode="linear" path="M620 250 L486 198"/></g>
<g font-size="16">
 <text x="200" y="45" text-anchor="middle" fill="#c2185b">جرثوم (مستضد)</text>
 <text x="360" y="150" text-anchor="middle" fill="#1a237e">الأجسام المضادة (Y) تلتصق بالجرثوم وتعطّله</text>
</g>''', 'المناعة المكتسبة: أجسام مضادة متخصصة تهاجم جرثومًا معيّنًا')

# 12 – trophy / stars
S[12] = wrap("0 0 720 220", '''
<g transform="translate(360 110)">
 <path d="M-50 -60 H50 V-20 C50 20 20 40 0 40 C-20 40 -50 20 -50 -20Z" fill="#ffd54a" stroke="#8a5a00" stroke-width="5"/>
 <path d="M-50 -45 C-90 -45 -85 0 -45 5 M50 -45 C90 -45 85 0 45 5" fill="none" stroke="#8a5a00" stroke-width="5"/>
 <rect x="-12" y="40" width="24" height="25" fill="#d9a521"/><rect x="-40" y="65" width="80" height="16" rx="5" fill="#8a5a00"/>
 <animateTransform attributeName="transform" type="translate" values="360 110;360 100;360 110" dur="2s" repeatCount="indefinite"/>
</g>
<g fill="#d9a521">
 <path d="M150 60 l6 14 15 2 -11 10 3 15 -13 -8 -13 8 3 -15 -11 -10 15 -2z"><animate attributeName="opacity" values=".2;1;.2" dur="1.6s" repeatCount="indefinite"/></path>
 <path d="M560 50 l6 14 15 2 -11 10 3 15 -13 -8 -13 8 3 -15 -11 -10 15 -2z"><animate attributeName="opacity" values="1;.2;1" dur="1.6s" repeatCount="indefinite"/></path>
 <path d="M600 150 l5 11 12 2 -9 8 2 12 -10 -6 -10 6 2 -12 -9 -8 12 -2z"><animate attributeName="opacity" values=".2;1;.2" dur="2.1s" repeatCount="indefinite"/></path>
 <path d="M110 160 l5 11 12 2 -9 8 2 12 -10 -6 -10 6 2 -12 -9 -8 12 -2z"><animate attributeName="opacity" values="1;.2;1" dur="2.1s" repeatCount="indefinite"/></path>
</g>''', 'أنت على بُعد خطوة من التميّز')

# ===================== Grade 1 (units) =====================
G1 = {}
# u1 – microscope: light travels up, specimen is magnified
G1[1] = wrap("0 0 720 300", '''
<rect x="120" y="262" width="160" height="16" rx="8" fill="#e3f4f5" stroke="#0e7c86" stroke-width="4"/>
<path d="M200 262 V230 M150 230 H250" stroke="#0e7c86" stroke-width="6" stroke-linecap="round"/>
<path d="M235 230 C275 190 270 120 230 80" fill="none" stroke="#0e7c86" stroke-width="8" stroke-linecap="round"/>
<rect x="170" y="40" width="34" height="110" rx="10" fill="#fff" stroke="#0e7c86" stroke-width="4" transform="rotate(-18 187 95)"/>
<rect x="150" y="200" width="100" height="10" rx="3" fill="#cfeaf7" stroke="#0e7c86" stroke-width="2"/>
<path d="M200 240 L200 205" stroke="#ffd54a" stroke-width="8" stroke-linecap="round" stroke-dasharray="8 8">
 <animate attributeName="stroke-dashoffset" values="16;0" dur=".6s" repeatCount="indefinite"/>
</path>
<path d="M210 205 L172 40" stroke="#ffd54a" stroke-width="6" stroke-linecap="round" stroke-dasharray="8 8" opacity=".85">
 <animate attributeName="stroke-dashoffset" values="16;0" dur=".6s" repeatCount="indefinite"/>
</path>
<path d="M300 150 L420 150" stroke="#d9a521" stroke-width="3" stroke-dasharray="6 6"/>
<circle cx="540" cy="150" r="110" fill="#f4fbfb" stroke="#0e7c86" stroke-width="5"/>
<g>
 <animateTransform attributeName="transform" type="scale" values="0.35;1;1;0.35" keyTimes="0;.35;.85;1" dur="5s" repeatCount="indefinite" additive="sum"/>
</g>
<g transform="translate(540 150)">
 <g>
  <animateTransform attributeName="transform" type="scale" values=".3;1;1;.3" keyTimes="0;.35;.85;1" dur="5s" repeatCount="indefinite"/>
  <g fill="#bfe6c9" stroke="#2b9a63" stroke-width="3">
   <rect x="-90" y="-60" width="60" height="45" rx="6"/><rect x="-28" y="-60" width="60" height="45" rx="6"/><rect x="34" y="-60" width="56" height="45" rx="6"/>
   <rect x="-90" y="-12" width="60" height="45" rx="6"/><rect x="-28" y="-12" width="60" height="45" rx="6"/><rect x="34" y="-12" width="56" height="45" rx="6"/>
   <rect x="-90" y="36" width="60" height="40" rx="6"/><rect x="-28" y="36" width="60" height="40" rx="6"/><rect x="34" y="36" width="56" height="40" rx="6"/>
  </g>
  <g fill="#2b6a3e"><circle cx="-60" cy="-38" r="7"/><circle cx="2" cy="-38" r="7"/><circle cx="62" cy="-38" r="7"/><circle cx="-60" cy="10" r="7"/><circle cx="2" cy="10" r="7"/><circle cx="62" cy="10" r="7"/><circle cx="-60" cy="56" r="7"/><circle cx="2" cy="56" r="7"/><circle cx="62" cy="56" r="7"/></g>
 </g>
</g>
<g font-size="16" fill="#095a61">
 <text x="300" y="30" text-anchor="middle">العدسة العينية</text>
 <text x="300" y="215">المنضدة والعيّنة</text>
 <text x="300" y="250">المرآة تعكس الضوء</text>
 <text x="540" y="290" text-anchor="middle">الصورة مكبَّرة: خلايا نباتية</text>
</g>''', 'المجهر الضوئي: الضوء يمر في العيّنة والعدسات فتظهر الخلايا مكبّرة')

# u2 – mitosis: one cell becomes two
G1[2] = wrap("0 0 720 280", '''
<g transform="translate(360 135)">
 <ellipse rx="110" ry="85" fill="#f2eaf8" stroke="#7a3fa0" stroke-width="5">
  <animate attributeName="rx" values="90;90;150;150;90" keyTimes="0;.25;.55;.95;1" dur="6s" repeatCount="indefinite"/>
  <animate attributeName="opacity" values="1;1;1;0;1" keyTimes="0;.55;.6;.65;1" dur="6s" repeatCount="indefinite"/>
 </ellipse>
 <circle r="30" fill="#c9a7ef" stroke="#55286f" stroke-width="3">
  <animate attributeName="opacity" values="1;0;0;1" keyTimes="0;.2;.95;1" dur="6s" repeatCount="indefinite"/>
 </circle>
 <g stroke="#c2185b" stroke-width="7" stroke-linecap="round">
  <path d="M-6 -22 L6 22 M6 -22 L-6 22"><animateTransform attributeName="transform" type="translate" values="0 0;0 0;-70 0;-70 0;0 0" keyTimes="0;.3;.5;.95;1" dur="6s" repeatCount="indefinite"/></path>
  <path d="M-6 -22 L6 22 M6 -22 L-6 22"><animateTransform attributeName="transform" type="translate" values="0 0;0 0;70 0;70 0;0 0" keyTimes="0;.3;.5;.95;1" dur="6s" repeatCount="indefinite"/></path>
 </g>
 <g fill="#f2eaf8" stroke="#7a3fa0" stroke-width="5" opacity="0">
  <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.58;.65;.95;1" dur="6s" repeatCount="indefinite"/>
  <circle cx="-85" r="70" fill-opacity=".6"/><circle cx="85" r="70" fill-opacity=".6"/>
 </g>
</g>
<g font-size="16" fill="#55286f">
 <text x="360" y="265" text-anchor="middle">الانقسام الخيطي: خلية أمّ ← خليتان بنتان متشابهتان بالعدد نفسه من الكروموسومات</text>
</g>''', 'الانقسام الخيطي: تتضاعف الكروموسومات ثم تنقسم الخلية إلى خليتين')

# u3 – rotating DNA double helix
pts = []
import math as _m
for k in range(13):
    y = 30 + k * 18
    pts.append(y)
rungs = ''.join(f'<line x1="0" y1="{y}" x2="0" y2="{y}" stroke="{["#d9601f","#2b9a63","#1e7fc4","#c2185b"][k%4]}" stroke-width="5"><animate attributeName="x1" values="{-60*_m.sin(k*.55):.0f};{60*_m.sin(k*.55):.0f};{-60*_m.sin(k*.55):.0f}" dur="4s" repeatCount="indefinite"/><animate attributeName="x2" values="{60*_m.sin(k*.55):.0f};{-60*_m.sin(k*.55):.0f};{60*_m.sin(k*.55):.0f}" dur="4s" repeatCount="indefinite"/></line>' for k, y in enumerate(pts))
G1[3] = wrap("0 0 720 290", f'''
<g transform="translate(250 0)">{rungs}
 <g fill="#9c4012">{''.join(f'<circle cy="{y}" r="7"><animate attributeName="cx" values="{-60*_m.sin(k*.55):.0f};{60*_m.sin(k*.55):.0f};{-60*_m.sin(k*.55):.0f}" dur="4s" repeatCount="indefinite"/></circle><circle cy="{y}" r="7"><animate attributeName="cx" values="{60*_m.sin(k*.55):.0f};{-60*_m.sin(k*.55):.0f};{60*_m.sin(k*.55):.0f}" dur="4s" repeatCount="indefinite"/></circle>' for k, y in enumerate(pts))}</g>
</g>
<g transform="translate(520 140)" stroke-linecap="round">
 <path d="M-30 -60 C-10 -20 -10 20 -30 60" stroke="#d9601f" stroke-width="22" fill="none"/>
 <path d="M30 -60 C10 -20 10 20 30 60" stroke="#d9601f" stroke-width="22" fill="none"/>
 <circle r="13" fill="#9c4012"/>
</g>
<g font-size="16" fill="#9c4012">
 <text x="250" y="280" text-anchor="middle">DNA: يحمل الصفات الوراثية</text>
 <text x="520" y="240" text-anchor="middle">كروموسوم</text>
 <text x="520" y="262" text-anchor="middle" font-size="13" fill="#555">في الإنسان 46 كروموسومًا</text>
</g>''', 'المادة الوراثية DNA تلتف حلزونيًا وتنتظم داخل الكروموسومات')

# u4 – first aid: pulsing cross + heartbeat line
G1[4] = wrap("0 0 720 260", '''
<g transform="translate(140 130)">
 <circle r="80" fill="#fbe7ea"><animate attributeName="r" values="70;90;70" dur="1.2s" repeatCount="indefinite"/></circle>
 <path d="M-20 -60 H20 V-20 H60 V20 H20 V60 H-20 V20 H-60 V-20 H-20Z" fill="#c42a3c"/>
</g>
<path d="M260 140 H360 L380 100 L400 190 L420 70 L440 140 H500 L515 120 L530 160 L545 140 H690" fill="none" stroke="#c42a3c" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="560" stroke-dashoffset="560">
 <animate attributeName="stroke-dashoffset" values="560;0;0" keyTimes="0;.7;1" dur="2.4s" repeatCount="indefinite"/>
</path>
<g font-size="16" fill="#8e1a28">
 <text x="140" y="245" text-anchor="middle">الإسعافات الأولية</text>
 <text x="480" y="225" text-anchor="middle">تحقّق من النبض والتنفس، واطلب الإسعاف فورًا</text>
</g>''', 'الإسعاف الأولي: مساعدة سريعة ومؤقتة للمصاب حتى وصول المختصين')

# ===================== Grade 2 (chapters) =====================
G2 = {}
# ch1 – ranks narrowing: dots filtered level by level
_rk = ['المملكة','الشعبة','الصنف','الرتبة','العائلة','الجنس','النوع']
_bars = ''.join(f'<rect x="{60+k*22}" y="{20+k*36}" width="{600-k*44}" height="30" rx="8" fill="#4a3fb5" opacity="{1-k*0.1:.2f}"><animate attributeName="opacity" values="{1-k*0.1:.2f};1;{1-k*0.1:.2f}" begin="{k*0.5}s" dur="3.5s" repeatCount="indefinite"/></rect><text x="350" y="{41+k*36}" text-anchor="middle" fill="#fff" font-size="15">{'١٢٣٤٥٦٧'[k]}- {r}</text>' for k, r in enumerate(_rk))
G2[1] = wrap("0 0 700 290", _bars + '''
<circle cx="600" cy="0" r="9" fill="#d9a521"><animate attributeName="cy" values="0;262;262" keyTimes="0;.8;1" dur="3.5s" repeatCount="indefinite"/></circle>''', 'مراتب التصنيف: من المملكة الكبيرة حتى النوع الواحد')

# ch2 – bacteria dividing (binary fission) in five-kingdom colours
G2[2] = wrap("0 0 700 240", '''
<g transform="translate(350 110)">
 <rect x="-50" y="-22" width="100" height="44" rx="22" fill="#c8f0d5" stroke="#196b42" stroke-width="4">
  <animate attributeName="width" values="100;170;170;100" keyTimes="0;.4;.6;1" dur="4s" repeatCount="indefinite"/>
  <animate attributeName="x" values="-50;-85;-85;-50" keyTimes="0;.4;.6;1" dur="4s" repeatCount="indefinite"/>
  <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;.55;.6;.95;1" dur="4s" repeatCount="indefinite"/>
 </rect>
 <g opacity="0" fill="#c8f0d5" stroke="#196b42" stroke-width="4">
  <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.55;.6;.95;1" dur="4s" repeatCount="indefinite"/>
  <rect x="-100" y="-22" width="90" height="44" rx="22"><animate attributeName="x" values="-90;-130;-130" keyTimes="0;.5;1" dur="4s" repeatCount="indefinite"/></rect>
  <rect x="10" y="-22" width="90" height="44" rx="22"><animate attributeName="x" values="0;40;40" keyTimes="0;.5;1" dur="4s" repeatCount="indefinite"/></rect>
 </g>
</g>
<g font-size="16" fill="#095a61"><text x="350" y="200" text-anchor="middle">مملكة البدائيات: بكتريا عصوية بلا غشاء نووي تنقسم إلى اثنتين</text></g>''', 'البكتريا كائنات بدائية وحيدة الخلية تتكاثر بالانقسام')

# ch3 – amoeba crawling with pseudopod
G2[3] = wrap("0 0 700 250", '''
<g>
 <animateTransform attributeName="transform" type="translate" values="0 0;120 0;240 0;0 0" keyTimes="0;.45;.9;1" dur="8s" repeatCount="indefinite"/>
 <path fill="#fdf0e1" stroke="#e0801b" stroke-width="4">
  <animate attributeName="d" dur="2s" repeatCount="indefinite" values="M120 90 C90 80 80 150 110 165 C120 190 180 190 200 165 C240 160 245 110 210 100 C200 70 150 70 120 90Z;M120 90 C90 80 80 150 110 165 C120 190 180 190 200 165 C270 170 300 120 230 100 C200 70 150 70 120 90Z;M120 90 C90 80 80 150 110 165 C120 190 180 190 200 165 C240 160 245 110 210 100 C200 70 150 70 120 90Z"/>
 </path>
 <ellipse cx="160" cy="130" rx="18" ry="13" fill="#e0a060" stroke="#9e5307" stroke-width="2"/>
 <circle cx="130" cy="120" r="8" fill="#d4ecff" stroke="#1e7fc4" stroke-width="2"/>
</g>
<circle cx="560" cy="130" r="10" fill="#2b9a63"><animate attributeName="opacity" values="1;1;0;1" keyTimes="0;.8;.9;1" dur="8s" repeatCount="indefinite"/></circle>
<g font-size="16" fill="#9e5307"><text x="350" y="225" text-anchor="middle">الأميبا تمدّ قدمًا كاذبة ويندفع السايتوبلازم نحوها فتتحرك نحو الغذاء</text></g>''', 'حركة الأميبا بالأقدام الكاذبة')

# ch4 – photosynthesis in a leaf
G2[4] = wrap("0 0 700 270", '''
<circle cx="80" cy="60" r="32" fill="#ffd54a"/>
<g stroke="#e0a800" stroke-width="4" stroke-dasharray="10 10"><path d="M110 80 L260 120"><animate attributeName="stroke-dashoffset" values="20;0" dur=".6s" repeatCount="indefinite"/></path><path d="M100 95 L250 150"><animate attributeName="stroke-dashoffset" values="20;0" dur=".6s" repeatCount="indefinite"/></path></g>
<path d="M240 140 C300 40 470 40 520 130 C470 220 300 230 240 140Z" fill="#7ccf96" stroke="#196b42" stroke-width="4"/>
<path d="M240 140 L520 130 M320 136 L300 100 M380 134 L360 90 M440 132 L420 95 M320 137 L300 175 M380 135 L365 180 M440 132 L425 172" stroke="#196b42" stroke-width="2.5" fill="none"/>
<g font-size="15" font-weight="800">
 <text fill="#555"><animateMotion dur="3s" repeatCount="indefinite" path="M600 60 L470 110"/>CO₂</text>
 <text fill="#1e7fc4"><animateMotion dur="3s" begin="-1.5s" repeatCount="indefinite" path="M300 260 L340 170"/>H₂O</text>
 <text fill="#d2453c"><animateMotion dur="3s" begin="-.7s" repeatCount="indefinite" path="M470 170 L620 230"/>O₂</text>
</g>
<g font-size="16" fill="#196b42"><text x="380" y="262" text-anchor="middle">البناء الضوئي: ضوء + CO₂ + ماء ← غذاء + أوكسجين</text></g>''', 'الورقة مصنع الغذاء: البناء الضوئي في الطبقة العمادية')

# ch5 – frog metamorphosis
G2[5] = wrap("0 0 700 250", '''
<path d="M0 200 Q350 170 700 200 L700 250 L0 250Z" fill="#9fd0f0"/>
<g>
 <animateMotion dur="9s" repeatCount="indefinite" path="M60 160 L620 140"/>
 <ellipse rx="22" ry="15" fill="#6d4c41"><animate attributeName="fill" values="#6d4c41;#5aa469;#3f9a52" dur="9s" repeatCount="indefinite"/><animate attributeName="rx" values="16;26;34" dur="9s" repeatCount="indefinite"/></ellipse>
 <path d="M18 0 C40 -12 50 12 70 0" fill="none" stroke="#6d4c41" stroke-width="7"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.55;.75;1" dur="9s" repeatCount="indefinite"/><animate attributeName="d" values="M18 0 C40 -12 50 12 70 0;M18 0 C40 12 50 -12 70 0;M18 0 C40 -12 50 12 70 0" dur=".6s" repeatCount="indefinite"/></path>
 <g stroke="#2c7a3d" stroke-width="5" stroke-linecap="round" opacity="0"><animate attributeName="opacity" values="0;0;1;1" keyTimes="0;.35;.5;1" dur="9s" repeatCount="indefinite"/><path d="M-14 10 l-14 14 M14 10 l14 14"/></g>
 <g fill="#3f9a52" opacity="0"><animate attributeName="opacity" values="0;0;1;1" keyTimes="0;.7;.8;1" dur="9s" repeatCount="indefinite"/><circle cx="-12" cy="-16" r="8"/><circle cx="12" cy="-16" r="8"/></g>
</g>
<g font-size="15" fill="#9a2a22" text-anchor="middle"><text x="90" y="40">أبو ذنيبة</text><text x="350" y="40">ظهور الأطراف</text><text x="610" y="40">ضفدع بالغ بلا ذيل</text></g>
<g font-size="16" fill="#9a2a22"><text x="350" y="235" text-anchor="middle">الاستحالة: يفقد الذيل والخياشيم وتظهر الأطراف</text></g>''', 'دورة حياة الضفدع: من أبي ذنيبة إلى الضفدع البالغ')

# ch6 – water cycle
G2[6] = wrap("0 0 700 280", '''
<rect width="700" height="280" fill="#eef7fd"/>
<circle cx="620" cy="50" r="30" fill="#ffd54a"/>
<path d="M0 220 Q170 205 350 220 L350 280 L0 280Z" fill="#5aa9d6"/>
<path d="M350 220 Q500 160 700 200 L700 280 L350 280Z" fill="#a5d6a7"/>
<g fill="#fff" stroke="#9fb8c9" stroke-width="2"><ellipse cx="270" cy="60" rx="70" ry="26"/><ellipse cx="320" cy="50" rx="50" ry="24"/></g>
<g fill="#1e7fc4">
 <circle r="5"><animateMotion dur="3s" repeatCount="indefinite" path="M120 215 L230 80"/><animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite"/></circle>
 <circle r="5"><animateMotion dur="3s" begin="-1.5s" repeatCount="indefinite" path="M170 215 L260 80"/><animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite"/></circle>
</g>
<g stroke="#1e7fc4" stroke-width="3" stroke-linecap="round">
 <line x1="240" y1="95" x2="234" y2="112"><animateTransform attributeName="transform" type="translate" values="0 0;-20 110" dur="1.2s" repeatCount="indefinite"/></line>
 <line x1="280" y1="95" x2="274" y2="112"><animateTransform attributeName="transform" type="translate" values="0 0;-20 110" dur="1.2s" begin="-.4s" repeatCount="indefinite"/></line>
 <line x1="320" y1="90" x2="314" y2="107"><animateTransform attributeName="transform" type="translate" values="0 0;-20 110" dur="1.2s" begin="-.8s" repeatCount="indefinite"/></line>
</g>
<g font-size="15" fill="#125a8f"><text x="80" y="150">١- التبخر</text><text x="300" y="25" text-anchor="middle">٢- التكاثف</text><text x="345" y="150">٣- الهطول</text><text x="520" y="150" fill="#196b42">٤- النتح</text></g>
<path d="M520 190 l14 -40 l14 40z" fill="#2b9a63"/>
<circle cx="534" cy="140" r="4" fill="#1e7fc4"><animate attributeName="cy" values="150;90" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite"/></circle>''', 'دورة الماء: تبخّر ← تكاثف ← هطول، والنباتات تنتح')

# ch7 – greenhouse effect: rays trapped
G2[7] = wrap("0 0 700 270", '''
<rect width="700" height="270" fill="#fff8f0"/>
<path d="M0 230 Q350 200 700 230 L700 270 L0 270Z" fill="#a5d6a7"/>
<path d="M20 70 Q350 10 680 70" fill="none" stroke="#c2185b" stroke-width="16" opacity=".3"/>
<circle cx="70" cy="40" r="26" fill="#ffd54a"/>
<g fill="#e0a800"><circle r="7"><animateMotion dur="3s" repeatCount="indefinite" path="M90 60 L260 220 L380 50 L500 215 L560 140"/></circle>
<circle r="7"><animateMotion dur="3s" begin="-1.5s" repeatCount="indefinite" path="M100 70 L300 220 L420 45 L560 220 L620 120"/></circle></g>
<g transform="translate(350 100)"><rect x="-7" y="-30" width="14" height="50" rx="7" fill="#fff" stroke="#d2453c" stroke-width="3"/><circle cy="28" r="12" fill="#d2453c"/><rect x="-3" y="-10" width="6" height="34" fill="#d2453c"><animate attributeName="y" values="5;-24;5" dur="3s" repeatCount="indefinite"/><animate attributeName="height" values="19;48;19" dur="3s" repeatCount="indefinite"/></rect></g>
<g font-size="15" fill="#8a0f3f"><text x="350" y="30" text-anchor="middle">غازات الدفيئة (CO₂) تحبس الحرارة</text></g>
<g font-size="16" fill="#196b42"><text x="350" y="255" text-anchor="middle">الاحتباس الحراري: الأشعة لا تعود إلى الفضاء فترتفع حرارة الأرض</text></g>''', 'الاحتباس الحراري مثل البيت الزجاجي')

# ---------------- grade 6 ----------------
G6 = {}
G6[1] = wrap("0 0 720 280", '''
<defs><radialGradient id="g6c" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fffdf5"/><stop offset="1" stop-color="#ffd98a"/></radialGradient></defs>
<ellipse cx="360" cy="135" rx="250" ry="105" fill="url(#g6c)" stroke="#b8860b" stroke-width="4">
 <animate attributeName="rx" values="230;250;270;250;230" dur="6s" repeatCount="indefinite"/></ellipse>
<path d="M360 30v210" stroke="#b8860b" stroke-width="3" stroke-dasharray="6 6"><animate attributeName="opacity" values="0;0;1;1;0" dur="6s" repeatCount="indefinite"/></path>
<g stroke="#9aa5b8" stroke-width="1.4"><path d="M130 135L360 75M130 135L360 135M130 135L360 195M590 135L360 75M590 135L360 135M590 135L360 195"/></g>
<g fill="#4a3fb5"><circle cx="130" cy="135" r="9"/><circle cx="590" cy="135" r="9"/></g>
<g stroke-width="7" stroke-linecap="round">
 <g stroke="#c62f45"><path d="M0 -14v28"><animateTransform attributeName="transform" type="translate" values="350 75;350 75;200 100;180 105;350 75" dur="6s" repeatCount="indefinite"/></path>
 <path d="M0 -14v28"><animateTransform attributeName="transform" type="translate" values="370 75;370 75;520 100;540 105;370 75" dur="6s" repeatCount="indefinite"/></path></g>
 <g stroke="#2449a8"><path d="M0 -14v28"><animateTransform attributeName="transform" type="translate" values="350 135;350 135;200 135;180 135;350 135" dur="6s" repeatCount="indefinite"/></path>
 <path d="M0 -14v28"><animateTransform attributeName="transform" type="translate" values="370 135;370 135;520 135;540 135;370 135" dur="6s" repeatCount="indefinite"/></path></g>
 <g stroke="#1c7a4a"><path d="M0 -14v28"><animateTransform attributeName="transform" type="translate" values="350 195;350 195;200 170;180 165;350 195" dur="6s" repeatCount="indefinite"/></path>
 <path d="M0 -14v28"><animateTransform attributeName="transform" type="translate" values="370 195;370 195;520 170;540 165;370 195" dur="6s" repeatCount="indefinite"/></path></g>
</g>
<text x="360" y="268" text-anchor="middle" fill="#5b6475">الاستوائي ← الانفصالي ← النهائي: تتباعد الكروماتيدات نحو القطبين وتتخصر الخلية</text>
''', 'الانقسام الخيطي: الكروموسومات على خط الاستواء ثم تفترق إلى القطبين')

G6[2] = wrap("0 0 720 240", '''
<g stroke="#8a1d4a" stroke-width="5" fill="none" stroke-linecap="round"><path d="M640 120l40-40M640 120l50 0M640 130l40 40M630 110l10-45"/></g>
<circle cx="620" cy="120" r="36" fill="#f8bbd0" stroke="#8a1d4a" stroke-width="3"/><circle cx="624" cy="118" r="12" fill="#4a148c"/>
<path d="M584 120H110" stroke="#8a1d4a" stroke-width="6"/>
<g fill="#ffe0b2" stroke="#e08a00" stroke-width="2"><rect x="480" y="108" width="80" height="24" rx="12"/><rect x="380" y="108" width="80" height="24" rx="12"/><rect x="280" y="108" width="80" height="24" rx="12"/><rect x="180" y="108" width="80" height="24" rx="12"/></g>
<g stroke="#8a1d4a" stroke-width="4" fill="none" stroke-linecap="round"><path d="M110 120l-40-30M110 120l-50 0M110 120l-40 30"/></g>
<circle r="11" fill="#ffd54f" stroke="#e65100" stroke-width="3"><animateMotion dur="2.4s" repeatCount="indefinite" path="M690 80L640 120L110 120L60 120"/><animate attributeName="r" values="8;12;8" dur=".6s" repeatCount="indefinite"/></circle>
<g text-anchor="middle" fill="#1d2433"><text x="660" y="40">التشجرات</text><text x="620" y="185">جسم الخلية</text><text x="380" y="95">الغلاف النخاعيني</text><text x="60" y="175">النهايات</text></g>
<text x="360" y="225" text-anchor="middle" fill="#5b6475">السيال العصبي يدخل من التشجرات ويخرج عبر المحور بعيدًا عن جسم الخلية</text>
''', 'العصبونة: مسار السيال العصبي من التشجرات إلى نهايات المحور')

G6[3] = wrap("0 0 720 300", '''
<ellipse cx="360" cy="230" rx="140" ry="55" fill="#c8e6c9" stroke="#2e7d32" stroke-width="3"/>
<ellipse cx="380" cy="230" rx="90" ry="34" fill="#fff8e1" stroke="#f9a825" stroke-width="2"/>
<circle cx="310" cy="230" r="11" fill="#ffccbc" stroke="#d84315" stroke-width="2"/>
<g fill="#e1bee7" stroke="#6a1b9a" stroke-width="2"><circle cx="390" cy="222" r="7"/><circle cx="402" cy="236" r="7"/></g>
<path d="M360 20v170" stroke="#43a047" stroke-width="16" opacity=".35"/>
<ellipse cx="360" cy="18" rx="40" ry="12" fill="#c0ca33" stroke="#827717" stroke-width="2"/>
<circle cx="360" cy="22" r="9" fill="#ffca28" stroke="#e65100" stroke-width="2"/>
<path d="M360 26V210Q340 230 318 230" fill="none" stroke="#e65100" stroke-width="3" stroke-dasharray="320" stroke-dashoffset="320"><animate attributeName="stroke-dashoffset" values="320;0;0" dur="5s" repeatCount="indefinite"/></path>
<circle r="5" fill="#1565c0"><animateMotion dur="5s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;.6;1" path="M360 26V210Q340 230 314 230"/></circle>
<circle r="5" fill="#1565c0"><animateMotion dur="5s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;.7;1" path="M360 26V210Q380 230 396 229"/></circle>
<g text-anchor="middle" fill="#1d2433"><text x="470" y="30">حبة لقاح على الميسم</text><text x="470" y="120">أنبوب اللقاح عبر القلم</text><text x="225" y="236">البيضة</text><text x="530" y="236">النواتان القطبيتان</text></g>
<text x="200" y="292" text-anchor="middle" fill="#2e7d32" direction="rtl">نطفة + بيضة ← زايكوت 2n</text><text x="520" y="292" text-anchor="middle" fill="#6a1b9a" direction="rtl">نطفة + نواتان قطبيتان ← سويداء 3n</text>
''', 'الإخصاب المضاعف: نطفتان تنزلان في أنبوب اللقاح إلى الكيس الجنيني')

def _cells(n, cx, cy):
    import math
    if n == 1: return f'<circle cx="{cx}" cy="{cy}" r="44" fill="#ffcc80" stroke="#bf6a00" stroke-width="2.5"/>'
    pos = {2: [(-22, 0), (22, 0)], 4: [(-22, -22), (22, -22), (-22, 22), (22, 22)],
           8: [(x, y) for x in (-33, -11, 11, 33) for y in (-14, 14)]}[n]
    r = {2: 22, 4: 21, 8: 12}[n]
    return ''.join(f'<circle cx="{cx+x}" cy="{cy+y}" r="{r}" fill="#ffcc80" stroke="#bf6a00" stroke-width="2"/>' for x, y in pos)
_st = ''
for k, (n, lab) in enumerate([(1, 'زايكوت'), (2, 'خليتان'), (4, '4 خلايا'), (8, '8 خلايا')]):
    vals = ';'.join('1' if j == k else '0' for j in range(4)) + ';' + ('1' if k == 0 else '0')
    _st += f'<g opacity="0"><animate attributeName="opacity" values="{vals}" dur="6s" calcMode="discrete" repeatCount="indefinite"/>{_cells(n,360,120)}<text x="360" y="200" text-anchor="middle" fill="#8a4b00" font-size="18">{lab}</text></g>'
G6[4] = wrap("0 0 720 260", _st + '''
<g fill="#1d2433" text-anchor="middle" font-size="14"><text x="120" y="60">التفلج:</text><text x="120" y="84">انقسامات خيطية</text><text x="120" y="108">سريعة متتالية</text><text x="600" y="60">حجم الجنين</text><text x="600" y="84">يبقى ثابتًا تقريبًا</text><text x="600" y="108">والخلايا تصغر</text></g>
<text x="360" y="245" text-anchor="middle" fill="#5b6475">الزايكوت ← 2 ← 4 ← 8 … ← الأريمة ← المعيدة</text>
''', 'التفلج: الزايكوت ينقسم إلى خلايا أصغر فأصغر')

_ps = '<g stroke="#4527a0" stroke-width="2.5" fill="#ede7f6"><rect x="260" y="70" width="200" height="160" rx="10"/></g><path d="M360 70v160M260 150h200" stroke="#4527a0" stroke-width="2.5"/>'
for k, (x, y, t, c) in enumerate([(410, 118, 'TT', '#2e7d32'), (310, 118, 'Tt', '#2e7d32'), (410, 198, 'Tt', '#2e7d32'), (310, 198, 'tt', '#b3261e')]):
    b = 1 + k * 0.6
    _ps += f'<text x="{x}" y="{y}" text-anchor="middle" font-size="26" fill="{c}" opacity="0">{t}<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;{b/6:.2f};{(b+0.3)/6:.2f};.92;1" dur="6s" repeatCount="indefinite"/></text>'
G6[5] = wrap("0 0 720 270", _ps + '''
<g font-size="24" fill="#c62f45" text-anchor="middle"><text x="410" y="58">T<animate attributeName="y" values="0;58;58" keyTimes="0;.12;1" dur="6s" repeatCount="indefinite"/></text><text x="310" y="58">t<animate attributeName="y" values="0;58;58" keyTimes="0;.12;1" dur="6s" repeatCount="indefinite"/></text>
<text x="490" y="118">T<animate attributeName="x" values="720;490;490" keyTimes="0;.12;1" dur="6s" repeatCount="indefinite"/></text><text x="490" y="198">t<animate attributeName="x" values="720;490;490" keyTimes="0;.12;1" dur="6s" repeatCount="indefinite"/></text></g>
<g text-anchor="middle" fill="#1d2433"><text x="130" y="110">Tt × Tt</text><text x="130" y="150" fill="#2e7d32">مظهريًا 3 : 1</text><text x="130" y="185" fill="#4527a0">جينيًا 1 : 2 : 1</text></g>
<text x="360" y="258" text-anchor="middle" fill="#5b6475">تدخل الأمشاج إلى مربع بونيت فتتكون تراكيب الأبناء</text>
''', 'قانون الانعزال: مربع بونيت لتزاوج هجينين')
