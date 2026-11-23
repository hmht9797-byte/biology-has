// ---------- الأسئلة الوزارية – الصف الثالث المتوسط والسادس العلمي ----------
(function(){

const WK='bioWiz';
const hash=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))|0;return 'w'+(h>>>0).toString(36)};
// per-grade wording. Grade 6 keeps its original texts; grade 3 says plainly what its cards are (selected questions, answers revised by the teacher).
const CFG={
 6:{title:'الأسئلة الوزارية: السادس العلمي',back:'العودة إلى الصف السادس',banner:()=>`الأسئلة الوزارية ${AR(2013)}–${AR(2026)}`,bannerSub:'بطاقات حفظ مبوّبة حسب الفصول، مع سنة ودور ظهور كل سؤال وجوابه',
    lead:n=>`${nAR(n,'card')} من أوراق ${AR(2013)}–${AR(2026)} (جميع الأدوار) موزّعة على فصول الملزمة. الأسئلة الأكثر تكرارًا تظهر أولًا.`,note:'',freq:'الأكثر تكرارًا أولًا',
    block:n=>`${nAR(n,'q')} من أوراق ${AR(2013)}–${AR(2026)}. هذه أكثرها تكرارًا — اضغط السؤال لتظهر الإجابة وسنوات ظهوره.`,top:8},
 3:{title:'الأسئلة الوزارية: الثالث المتوسط',back:'العودة إلى الصف الثالث المتوسط',banner:()=>`الأسئلة الوزارية ${AR(2014)}–${AR(2026)}`,bannerSub:'أسئلة مختارة من الأوراق الوزارية، مبوّبة حسب الفصول، مع سنة ودور كل سؤال وجوابه',
    lead:n=>`${nAR(n,'card')} من الأسئلة الوزارية ${AR(2014)}–${AR(2026)} موزّعة على فصول الملزمة: أسئلة ${AR(2014)} بأقسامها، وأبرز أسئلة السنوات التالية.`,
    note:'الأجوبة منقّحة من ملف المعلم. بطاقات «متكرر ٢٠٢٠–٢٠٢٦» أسئلة تكررت في تلك السنوات دون تحديد سنة بعينها، فلا تظهر عند اختيار سنة.',freq:'حسب ترتيب الفصول والسنوات',
    block:n=>`أسئلة وزارية على هذا الفصل (${nAR(n,'q')})، مع السنة والدور الذي وردت فيه. اضغط السؤال لتظهر الإجابة.`,top:99}
};
const WIZG=[3,6];
const gOf=g=>BOOK.grades.find(x=>x.id==g);
window.wizHas=function(g){return !!(g&&CFG[g.id]&&g.chapters.some(c=>c.wz&&c.wz.length))};
const chTag=(k,g)=>k.ch.lab==='المراجعة الشاملة'?k.ch.t:`الفصل ${AR(k.ch.n)}: ${k.ch.t}`;
function wzData(g){const out=[];gOf(g).chapters.forEach(c=>(c.wz||[]).forEach(k=>out.push({...k,ch:c,id:hash((g==6?'':g+':')+c.n+k.q)})));return out}
const wzYears=d=>[...new Set(d.flatMap(k=>k.y.map(s=>s.split(' ')[0])).filter(y=>/^\d{4}$/.test(y)))].sort();
let WF={g:0,ch:0,year:'',type:'',mode:'freq'};
const wfFor=g=>{if(WF.g!==g)WF={g,ch:0,year:'',type:'',mode:'freq'}};
function wzFilter(d){return d.filter(k=>(!WF.ch||k.ch.n==WF.ch)&&(!WF.year||k.y.some(s=>s.startsWith(WF.year)))&&(!WF.type||k.t==WF.type))}
const yc=k=>k.y.map(s=>`<span class="wzy">${AR(s)}</span>`).join('');
window.wizBanner=function(g){const n=wzData(g.id).length,C=CFG[g.id];return `<button class="wzban" id="wzGo"><span class="wi">${ico('landmark',30)}</span><span><b>${C.banner()}</b><small>${C.bannerSub}</small></span><span class="wc">${AR(n)}<small>${nAR(n,'card').replace(/^\S+\s/,'')}</small></span></button>`};
window.wizBannerWire=function(g){const b=$('#wzGo');if(b)b.onclick=()=>go('wiz-g'+g.id)};
window.wizHome=function(g){
  g=g||WF.g||6;wfFor(g);const C=CFG[g];
  hideTabs();const d=wzData(g),K=store.get(WK,{}),yrs=wzYears(d),types=[...new Set(d.map(k=>k.t))];
  const G6=gOf(g);
  const f=wzFilter(d),known=f.filter(k=>K[k.id]).length;
  shell(C.title,`<div class="wrap xpage">
  <div class="wzhead"><span class="xbadge">${ico('landmark',26)}</span><div><h2>الأسئلة الوزارية</h2><p>${C.lead(d.length)}</p></div></div>${C.note?`<p class="mnote">${C.note}</p>`:''}
  <div class="wzlab">السنة</div><div class="wzchips" id="wzY"><button data-v="" class="${WF.year?'':'on'}">كل السنوات</button>${yrs.map(y=>`<button data-v="${y}" class="${WF.year==y?'on':''}">${AR(y)}</button>`).join('')}</div>
  <div class="wzlab">نوع السؤال</div><div class="wzchips" id="wzT"><button data-v="" class="${WF.type?'':'on'}">الكل</button>${types.map(t=>`<button data-v="${t}" class="${WF.type==t?'on':''}">${t}</button>`).join('')}</div>
  <div class="wzlab">الترتيب</div><div class="wzchips" id="wzM"><button data-v="freq" class="${WF.mode=='freq'?'on':''}">${C.freq}</button><button data-v="rand" class="${WF.mode=='rand'?'on':''}">عشوائي</button></div>
  <div class="wzlab">اختر الفصل (${nAR(f.length,'card')} بالمرشّحات الحالية، أتقنت ${AR(known)})</div>
  <div class="wzgrid">${G6.chapters.filter(c=>c.wz&&c.wz.length).map(c=>{const ff=f.filter(k=>k.ch.n==c.n),kn=ff.filter(k=>K[k.id]).length;return `<button class="wzt" style="--cc:${c.c}" data-c="${c.n}"><span class="n">${c.lab==='المراجعة الشاملة'?ico('star',20):AR(c.n)}</span><span style="flex:1"><b>${c.t}</b><small>${nAR(ff.length,'card')}، أتقنت ${AR(kn)}</small><i><u style="width:${ff.length?kn/ff.length*100:0}%"></u></i></span></button>`}).join('')}
   <button class="wzt" style="--cc:#065f46" data-c="0"><span class="n">${ico('layers',20)}</span><span style="flex:1"><b>كل الفصول معًا</b><small>${nAR(f.length,'card')}</small></span></button></div>
  ${backLink('wzBack',C.back)}</div>`);
  const chips=(id,key)=>document.querySelectorAll(id+' button').forEach(b=>b.onclick=()=>{WF[key]=b.dataset.v;wizHome(g)});
  chips('#wzY','year');chips('#wzT','type');chips('#wzM','mode');
  document.querySelectorAll('.wzt').forEach(b=>b.onclick=()=>{WF.ch=+b.dataset.c;go('wizrun-g'+g)});
  $('#wzBack').onclick=()=>go('g'+g);
};
let WR=null;
window.wizRun=function(g,ch){
  g=g||WF.g||6;wfFor(g);
  hideTabs();if(ch!==undefined&&ch!==null&&ch!=='')WF.ch=+ch;
  const K=store.get(WK,{});let list=wzFilter(wzData(g));
  list=WF.mode=='rand'?list.sort(()=>Math.random()-.5):list.sort((a,b)=>b.n-a.n||a.ch.n-b.ch.n);
  WR={list:list.filter(k=>!K[k.id]).concat(list.filter(k=>K[k.id])),i:0,ok:0,tot:list.length};
  if(!list.length){shell('الأسئلة الوزارية','<div class="wrap xpage">'+emptyState('inbox','لا توجد بطاقات بهذه المرشّحات','غيّر السنة أو نوع السؤال ثم حاول مرة أخرى.')+backLink('b','العودة إلى المرشّحات')+'</div>');$('#b').onclick=()=>go('wiz-g'+g);return}
  shell('بطاقات وزارية'+(WF.ch?': '+gOf(g).chapters.find(c=>c.n==WF.ch).t:''),'<div class="wrap quiz" id="wr"></div>');wzShow();
};
function wzShow(){
  const R=WR,box=$('#wr');
  if(R.i>=R.list.length){box.innerHTML=`<div class="qcard score"><div>انتهت الجلسة</div><b>${AR(R.ok)} / ${AR(R.list.length)}</b><p>عرفتها من أول مرة. البطاقات التي لم تعرفها أُعيدت إلى نهاية الجلسة.</p><button class="qnext" id="again">${ico('reset',18)}جلسة جديدة</button><button class="qnext alt" id="back">${ico('list',18)}قائمة الأسئلة الوزارية</button></div>`;$('#again').onclick=()=>wizRun(WF.g);$('#back').onclick=()=>go('wiz-g'+WF.g);$('#prog').style.width='100%';return}
  const k=R.list[R.i];$('#prog').style.width=(R.i/R.list.length*100)+'%';
  box.innerHTML=`<div class="wzcard" id="fc" tabindex="0" role="button" aria-label="اقلب البطاقة"><div class="f"><span class="qtag" style="--cc:${k.ch.c}">${WF.g==6?`الفصل ${AR(k.ch.n)}: ${k.ch.t}`:chTag(k)}</span><div class="meta"><span class="wzty">${k.t}</span>${k.n>1?`<span class="wzrep">${ico('repeat',13)}تكرر ${nAR(k.n,'time')}</span>`:''}</div><div class="wq">${k.q}</div><small class="hint">${ico('flip',16)}اضغط لقلب البطاقة</small></div>
   <div class="b"><div class="wa">${k.a}</div><div class="meta">${yc(k)}</div></div></div>
   <div class="fbtns" id="fbt" hidden><button class="no" id="fNo">${ico('reset',18)}لم أعرفها</button><button class="yes" id="fYes">${ico('check',18)}عرفتها</button></div>
   <p class="mnote">بطاقة ${AR(R.i+1)} من ${AR(R.list.length)}</p>`;
  const flip=()=>{$('#fc').classList.add('flip');$('#fbt').hidden=false};
  $('#fc').onclick=flip;$('#fc').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flip()}};
  $('#fYes').onclick=()=>{const K=store.get(WK,{});K[k.id]=1;store.set(WK,K);R.ok++;R.i++;wzShow()};
  $('#fNo').onclick=()=>{const K=store.get(WK,{});delete K[k.id];store.set(WK,K);R.list.push(k);R.i++;wzShow()};
}
window.wizChapterMount=function(c,g){
  if(!c.wz||!c.wz.length)return;
  const C=CFG[g.id],top=c.wz.slice(0,C.top);
  const h=document.createElement('section');h.className='wzblk';
  h.innerHTML=`<h3>${ico('landmark',22)} أسئلة وزارية على هذا الفصل</h3><p>${C.block(c.wz.length)}</p>
  ${top.map(k=>`<details><summary><span class="wzty">${k.t}</span> ${k.q}${k.n>1?` <small class="wzrep">${ico('repeat',12)}${nAR(k.n,'time')}</small>`:''}</summary><div class="ans">${k.a}</div><div class="ys">${k.y.map(s=>`<span class="wzy">${AR(s)}</span>`).join('')}</div></details>`).join('')}
  <button class="go" id="wzCh">${ico('play',18)}ابدأ بطاقات هذا الفصل (${nAR(c.wz.length,'card')})</button>`;
  $('#view .reader').appendChild(h);$('#wzCh').onclick=()=>{WF={g:g.id,ch:c.n,year:'',type:'',mode:'freq'};go('wizrun-g'+g.id)};
};
})();
