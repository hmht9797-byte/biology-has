# -*- coding: utf-8 -*-
import sys, os
P = sys.argv[1]
def w(path, text): os.makedirs(os.path.dirname(f'{P}/{path}'), exist_ok=True); open(f'{P}/{path}', 'w', encoding='utf-8').write(text.strip() + '\n')
I = lambda d: f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{d}</svg>'
CHECK = I('<path d="M20 6 9 17l-5-5"/>'); X = I('<path d="M18 6 6 18M6 6l12 12"/>'); NEXT = I('<path d="m15 18-6-6 6-6"/>')
BOOK = I('<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>')
CUBE = I('<path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>')
TEST = I('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>')
CARDS = I('<rect x="3" y="6" width="13" height="15" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12"/>')
USER = I('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>')
STAR = I('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>')
TAG = I('<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>')
BOOKMARK = I('<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/>')
REFRESH = I('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>')
INBOX = I('<path d="M3 13h5l1 3h6l1-3h5"/><path d="M5 5h14l2 8v6H3v-6z"/>')
def prev(group, h, body, sub=''):
    return f'<!-- @dsCard group="{group}" height={h}{f" subtitle={chr(34)}{sub}{chr(34)}" if sub else ""} -->\n<!doctype html>\n<html lang="ar" dir="rtl"><head><meta charset="utf-8"></head><body>\n{body}\n</body></html>'
# ---------------- components
w('components/Badge/preview.html', prev('Display', 96, f'''<div class="ds">
 <span class="ds-badge">{BOOK}أتممت ٠ من ١٢</span><span class="ds-badge success">{CHECK}مكتمل</span>
 <span class="ds-badge success">{STAR}أفضل نتيجة ٨/١٠</span><span class="ds-badge warning">{BOOKMARK}للحفظ</span>
 <span class="ds-badge brand">٢٠٢٤</span><span class="ds-badge solid">تعريف</span></div>''', 'neutral · success · warning · brand · solid'))
w('components/Badge/README.md', '''# Badge
شارة صغيرة تقول حالة شيء أو صفته في كلمتين؛ كل الشارات في التطبيق شكل واحد بألوان مختلفة.

- **ما يقدّمه المستخدِم:** نص قصير (كلمة إلى ثلاث)، ونغمة واحدة: `neutral` (الافتراضية) أو `success` أو `warning` أو `brand` أو `solid`، وأيقونة اختيارية 14px قبل النص.
- **متى:** التقدّم («أتممت ٣ من ١٢»)، الحالة («مكتمل»)، التنبيه («للحفظ»)، سنة السؤال الوزاري أو نوعه.
- الارتفاع `badge-height` والخط نمط `label`؛ الحواف `radius-pill`.
- `success` لا يُعتمد عليه بلونه وحده: ضع معه أيقونة صح أو كلمة «مكتمل».
- لا تضع الشارة فوق رسم أو صورة؛ في بطاقات الرسوم تجلس في صف مستقل تحت الرسم.
- لا تستعمل `solid` لأكثر من شارة واحدة في البطاقة.''')
w('components/Button/preview.html', prev('Actions', 150, f'''<div class="ds">
 <button class="ds-btn">السؤال التالي{NEXT}</button>
 <button class="ds-btn alt">عرض الإجابة</button>
 <button class="ds-btn secondary">{REFRESH}إعادة</button>
 <button class="ds-btn soft">{CHECK}الإجابة</button>
 <button class="ds-btn secondary" aria-pressed="true">{TAG}الأسماء</button>
 <button class="ds-btn" disabled>التالي</button></div>''', 'primary · alt · secondary · soft · toggle on · disabled'))
w('components/Button/README.md', '''# Button
زر الفعل: الأساسي بتدرّج الزمرد للفعل الذي وُجدت الشاشة من أجله، والثانوي الأبيض لما سواه.

- **ما يقدّمه المستخدِم:** فعل يبدأ بفعل أمر أو اسم الفعل («ابدأ المذاكرة»، «السؤال التالي»، «علّم الفصل كمكتمل»)، وأيقونة اختيارية.
- **الأساسي** (`ds-btn`): ارتفاع `button-height`، حواف `radius-md`، تدرّج من `brand-grad-from` إلى `brand-grad-to` بزاوية 135°، نص `on-brand` بنمط `button`، ظل `shadow-brand`. زر أساسي واحد في الشاشة.
- **البديل** (`alt`): نفس الحجم على `surface-2`، لزرّ ثانٍ تحت الأساسي.
- **الثانوي** (`secondary`): ارتفاع `tap-target`، حواف `radius-control`، أبيض بخط داخلي `border` — للتنقّل (السابق، رجوع، إعادة).
- **الناعم** (`soft`): كبسولة `brand-soft` بارتفاع `tap-target` لأفعال داخل النص («الإجابة»).
- **مبدّل** (`secondary` مع `aria-pressed="true"`): حين يعمل يأخذ تعبئة `brand-soft` وخطًا داخليًا 1.5px بلون `focus`؛ لا يأخذ أبدًا تدرّج الزر الأساسي، حتى لا يبدو مبدّلان كزرّين أساسيين (الأسماء، تدوير تلقائي، اختبر نفسك).
- عند الضغط يصغر إلى 0.98؛ التركيز حلقة `focus` 3px على هالة `focus-halo` 2px، فتبقى ظاهرة على الفاتح والداكن والملوّن.
- أيقونة «التالي» تشير إلى اليسار لأن الواجهة من اليمين إلى اليسار.''')
w('components/Card/preview.html', prev('Surfaces', 210, f'''<div class="ds">
 <a class="ds-card" href="#"><span class="gn">الأول</span><b>الصف الأول المتوسط</b><small>علم الأحياء، ٤ وحدات، ٣١٨ سؤالًا تفاعليًا</small><div class="bar"><i style="width:50%"></i></div><small>أتممت ٢ من ٤</small></a>
 <a class="ds-card hover" href="#"><span class="gn">السادس</span><b>الصف السادس العلمي</b><small>الموسوعة الهجينة، ٥ فصول + نماذج</small><div class="bar"><i style="width:0%"></i></div><small>أتممت ٠ من ٦</small></a></div>''', 'resting · hover'))
w('components/Card/README.md', '''# Card
سطح أبيض يحمل عنصرًا واحدًا يُفتح بلمسة: صف، فصل، مجسّم، رسم، نمط اختبار.

- **ما يقدّمه المستخدِم:** عنوان (نمط `section` أو 17px/800)، سطر وصف بنمط `small` بلون `text-muted`، وما يخصّه: رقم الصف، شريط تقدّم، شارات.
- `surface` مع خط `border` بسماكة 1px، حواف `radius-lg`، حشوة `space-4`، ظل `shadow-1`؛ عند المرور يرتفع 3px ويأخذ `shadow-2` وخط `brand-soft-line`.
- البطاقة كلها هي الهدف القابل للضغط (رابط أو زر)، لا زر صغير داخلها.
- البطاقات في شبكة بفجوة `space-3`؛ لا تمدّ بطاقة وحيدة على عرض الشبكة.
- لون الفصل (`chapter-*`، و`--cc` في التطبيق) يلوّن رقم البطاقة فقط، لا خلفيتها.
- عرض شريط التقدّم يساوي النسبة المكتوبة تحته بالضبط: «أتممت ٠ من ٦» شريط فارغ.''')
w('components/SegmentedControl/preview.html', prev('Navigation', 90, '''<div class="ds"><div class="ds-seg" role="tablist"><button class="on" role="tab" aria-selected="true">الأول</button><button role="tab" aria-selected="false">الثاني</button><button role="tab" aria-selected="false">الثالث</button><button role="tab" aria-selected="false">الرابع</button><button role="tab" aria-selected="false">السادس</button></div></div>'''))
w('components/SegmentedControl/README.md', '''# SegmentedControl
مبدّل بين خيارات متساوية في الشاشة نفسها، مثل الصف في المختبر أو الرسوم.

- **ما يقدّمه المستخدِم:** من ٢ إلى ٥ خيارات قصيرة، والخيار المختار.
- مسار `surface` بخط `border` وحواف `radius-md` وحشوة 5px؛ كل زر ارتفاعه `tap-target` وحوافه `radius-sm`؛ كل زر يحمل `aria-selected` (true للمختار، false لغيره)، والأسهم تنقل بين الخيارات.
- المختار بتدرّج الزمرد ونص `on-brand`؛ غير المختار `text-muted`.
- أكثر من ٥ خيارات: استعمل قائمة أو شارات قابلة للتمرير.''')
w('components/BottomTabs/preview.html', prev('Navigation', 96, f'''<div class="ds"><nav class="ds-tabs" aria-label="الأقسام"><button class="on" aria-current="page">{BOOK}الملازم</button><button>{CUBE}المختبر</button><button>{TEST}الاختبارات</button><button>{CARDS}البطاقات</button><button>{USER}تواصل</button></nav></div>'''))
w('components/BottomTabs/README.md', '''# BottomTabs
شريط التنقّل الرئيسي أسفل الهاتف بخمسة أقسام؛ على الحاسوب (1024px فأكثر) يصبح شريطًا جانبيًا على اليمين بعرض 92px.

- **ما يقدّمه المستخدِم:** خمسة أقسام بأيقونة واسم: الملازم، المختبر، الاختبارات، البطاقات، تواصل؛ والقسم الحالي.
- الخلفية `tabs-bg` مع ضبابية خلفها وخط علوي `border`؛ كل زر ارتفاعه `tab-height` وخطه نمط `tab`.
- القسم الحالي: نص `brand-strong`، أيقونة `brand` ترتفع 2px، وشريط علوي 3px، و`aria-current="page"` حتى لا يُعرف باللون وحده.
- يختفي الشريط داخل الاختبار والبطاقات حتى لا يقطع التركيز.''')
w('components/Sheet/preview.html', prev('Overlays', 350, f'''<div class="ds-scrim"><div class="ds-sheet" role="dialog" aria-modal="true" aria-labelledby="sh-t"><div class="hd"><h4 id="sh-t">فهرس الفصل</h4><button class="x" aria-label="إغلاق الفهرس">{X}</button></div><ol>
<li><button><span>١</span>مقدمة وتاريخ علم الخلية</button></li><li><button class="cur"><span>٢</span>المجهر الضوئي المركّب</button></li>
<li><button><span>٣</span>نظرية الخلية</button></li><li><button><span>٤</span>أسئلة الفصل وأجوبتها</button></li></ol></div></div>'''))
w('components/Sheet/README.md', '''# Sheet
لوح يصعد من أسفل الشاشة فوق ستار معتم، لقائمة يختار منها الطالب ثم يعود (فهرس الفصل).

- **ما يقدّمه المستخدِم:** عنوان قصير، وقائمة مرقّمة، والبند الحالي.
- حواف علوية `radius-sheet`، مقبض 44×5px، خلفية `surface`، ظل `shadow-3`، والستار `scrim`.
- كل بند ارتفاعه `tap-target` وحوافه `radius-control`؛ الرقم في مربّع `brand-soft` بأرقام عربية (١، ٢، ٣).
- `role="dialog"` مع `aria-modal="true"` واسم من عنوانه؛ التركيز ينتقل إلى أول بند ويبقى داخل اللوح حتى يُغلق ثم يعود إلى الزر الذي فتحه.
- يُغلق بزر «إغلاق» ظاهر (`tap-target`) أو بلمس الستار أو بزر الرجوع أو بمفتاح Esc؛ على الشاشات من 760px يصبح لوحًا عائمًا بعرض 560px.''')
w('components/Toast/preview.html', prev('Feedback', 200, f'''<div class="ds-col"><span class="ds-toast">{CHECK}سُجّل الفصل كمكتمل</span><span class="ds-toast">{CHECK}تم النسخ إلى الحافظة</span><span class="ds-toast bad">{X}تعذّر النسخ، اضغط مطوّلًا على النص لنسخه</span></div>'''))
w('components/Toast/README.md', '''# Toast
رسالة قصيرة تؤكّد ما حدث بعد فعل، وتختفي وحدها بعد ثانيتين ونصف.

- **ما يقدّمه المستخدِم:** جملة بصيغة الماضي تقول ما حدث («سُجّل الفصل كمكتمل»، «تم النسخ إلى الحافظة»)، ونوعها: نجاح أو فشل.
- كبسولة `radius-pill` بخلفية `toast-bg` (أو `toast-bad-bg` للفشل) ونص `toast-fg`، ظل `shadow-3`، فوق شريط التنقّل.
- رسالة الفشل تقول ما الذي يفعله الطالب الآن.
- لا تستعمله لمعلومة يحتاج الطالب أن يرجع إليها؛ ضعها في الصفحة.''')
w('components/States/preview.html', prev('Feedback', 300, f'''<div class="ds">
 <div class="ds-empty">{INBOX}<b>لا توجد بطاقات بهذه المرشّحات</b>غيّر السنة أو نوع السؤال ثم حاول مرة أخرى.</div>
 <div class="ds-empty err">{X}<b>تعذّر فتح الملزمة</b>أعد المحاولة، وإن تكرّر ذلك فأغلق التطبيق وافتحه من جديد.<button class="ds-btn">{REFRESH}إعادة المحاولة</button></div>
 <div class="ds-skel" role="status" aria-label="جارٍ التحميل"><i></i><i></i></div><span class="ds-spin" role="status" aria-label="جارٍ التحميل"></span></div>''', 'empty · error · loading'))
w('components/States/README.md', '''# States
ما تعرضه الشاشة حين لا يوجد محتوى بعد: فارغة، أو خطأ، أو قيد التحميل.

- **ما يقدّمه المستخدِم:** عنوان يقول الحالة، وسطر يقول ما يحدث الآن أو ما يفعله الطالب، وزر واحد يحلّها إن وُجد حل.
- **فارغة** (`ds-empty`): إطار متقطّع `border` وحواف `radius-lg`، أيقونة في مربّع `brand-soft`.
- **خطأ** (`ds-empty err`): نفس الإطار، أيقونة في مربّع `error-bg` بلون `error`، وزر «إعادة المحاولة». التطبيق يعمل دون إنترنت، فلا تطلب من الطالب «تحقّق من الاتصال»: قل له ما يجرّبه فعلًا.
- **تحميل:** هيكل بلونَي `skel-base` و`skel-shine` بأشكال المحتوى القادم، أو دائرة دوّارة للأفعال القصيرة؛ يتوقّفان مع `prefers-reduced-motion`.''')
# ---------------- asset group READMEs
w('assets/Logos/README.md', '''# Logos
أيقونة التطبيق: مجهر ذهبي فوق خلية شفّافة على مربّع زمردي. هي العلامة الوحيدة؛ لا يوجد شعار نصّي منفصل، فاسم «ملازم الأحياء التفاعلية» يُكتب بخط Cairo 800.

- `app-icon.svg`: الأيقونة الكاملة بحواف مستديرة (المصدر لكل المقاسات). لا تغيّر ألوانها ولا تضع عليها ظلًا إضافيًا.
- `app-icon-play-512.png`: أيقونة Google Play، مربّع كامل بلا حواف مستديرة ولا إطار؛ المتجر يقصّ الزوايا بنصف قطر 30% من المقاس، وأي إطار داخلي يصطدم بهذا القص.
- `app-icon-monochrome.svg`: المجهر وحده بلون واحد `#053b2f` (زمرد 900) للأيقونات الملوّنة بثيم Android 13؛ في التطبيق نفسه الطبقة بيضاء ويلوّنها النظام.
- أقل مقاس مقروء: 24px. حول الأيقونة فراغ لا يقل عن ربع عرضها.''')
w('assets/Store/README.md', '''# Store
صور صفحة التطبيق على Google Play (الإصدار 3.4.1).

- `feature-graphic-1024x500.png`: صورة العرض؛ PNG بلا شفافية. النص كله على اليمين والأيقونة على اليسار. لا نص أصغر من 20px: المتجر يعرضها بعرض 360px تقريبًا، فيصير ما دون ذلك غير مقروء.
- `screen-01-home.png` … `screen-08-ministerial.png`: لقطات الهاتف 1080×1920 من التطبيق الحقيقي، بلا إطار ولا نصوص مضافة، بتقدّم طالب حقيقي (فصول منجزة، درجة، بطاقة مقلوبة) لا بعدّادات صفرية.
- لا تضع على هذه الصور شارات أسعار أو تصنيفات أو عبارات مثل «الأفضل» — سياسة المتجر تمنعها.''')
