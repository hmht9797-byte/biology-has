const {chromium}=require('playwright');const fs=require('fs');
const SP=process.env.SP, OUT=SP+'/reel/s', U='http://localhost:8765/index.html#';
const META={};
const NOANIM='*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}';
const HIDE='.bar{visibility:hidden!important}.tabs,.nav,.totop,#toast{display:none!important}.rtools{visibility:hidden!important}';
(async()=>{
const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3});
const p=await ctx.newPage();
await p.route(/cdnjs.*three/,r=>r.fulfill({contentType:'application/javascript',body:fs.readFileSync('/home/user/malzama3/app/three.min.js')}));
const errs=[];p.on('pageerror',e=>errs.push(e.message));
async function go(route,ls){await p.setViewportSize({width:390,height:844});await p.goto(U+'');await p.evaluate(ls=>{localStorage.clear();for(const k in ls)localStorage.setItem(k,JSON.stringify(ls[k]))},ls||{});
  await p.goto(U+route);await p.reload();await p.waitForTimeout(700);await p.addStyleTag({content:NOANIM});await p.waitForTimeout(500);await p.evaluate(()=>scrollTo(0,0));}
const rect=(sel,base=0)=>p.evaluate(([s,base])=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top+scrollY-base),Math.round(r.width),Math.round(r.height)]},[sel,base]);
async function chrome(name){ // header + footer images from the normal viewport
  const h=await p.evaluate(()=>Math.round(document.querySelector('.bar').getBoundingClientRect().bottom));
  await p.screenshot({path:`${OUT}/hdr_${name}.jpg`,type:'jpeg',quality:90,clip:{x:0,y:0,width:390,height:h}});
  const f=await p.evaluate(()=>{const e=[...document.querySelectorAll('#tabs,#nav')].find(x=>!x.hidden);if(!e)return null;const r=e.getBoundingClientRect();return [Math.round(r.top),Math.round(r.height)]});
  if(f)await p.screenshot({path:`${OUT}/ftr_${name}.jpg`,type:'jpeg',quality:90,clip:{x:0,y:f[0],width:390,height:f[1]}});
  return {hdr:`hdr_${name}.jpg`,hdrH:h,ftr:f?`ftr_${name}.jpg`:null,ftrH:f?f[1]:0};
}
async function region(file,y0,y1,q=84){ // content only, chrome hidden
  const st=await p.addStyleTag({content:HIDE});const H=y1-y0;
  await p.setViewportSize({width:390,height:H});await p.evaluate(y=>scrollTo(0,y),y0);await p.waitForTimeout(250);
  const sy=await p.evaluate(()=>scrollY);
  await p.screenshot({path:`${OUT}/${file}`,type:'jpeg',quality:q,clip:{x:0,y:0,width:390,height:H}});
  await st.evaluate(e=>e.remove());await p.setViewportSize({width:390,height:844});await p.evaluate(()=>scrollTo(0,0));
  if(sy!==y0) console.log('WARN scroll',file,y0,sy); return {img:file,w:390,h:H};
}
async function full(file,q=86){await p.screenshot({path:`${OUT}/${file}`,type:'jpeg',quality:q});return {img:file,w:390,h:844}}

// 1 landing (scroll shot)
await go('',{bioFigs:{}});
let ch=await chrome('land');
const landEnd=await p.evaluate(()=>{const t=document.querySelector('.tools').getBoundingClientRect();return Math.round(t.bottom+scrollY+24)});
META.land={...await region('land.jpg',0,landEnd),...ch,rects:{teacher:await rect('.hero .tchr'),g6:await rect('.grade[data-g="6"]'),g1:await rect('.grade[data-g="1"]'),grades:await rect('.grades'),tools:await rect('.tools')}};

// 2 lab home g1
await go('lab-g1');ch=await chrome('lab');
const labEnd=await p.evaluate(()=>Math.round(document.querySelector('.labgrid').getBoundingClientRect().bottom+scrollY+24));
META.labhome={...await region('labhome.jpg',0,Math.max(844,labEnd)),...ch,rects:{mic:await rect('.labcard[data-id="microscope"]'),seg:await rect('.lseg')}};

// 3 lab view (microscope) full screen + rotation frames of the 3D stage
await go('lab-microscope');await p.waitForTimeout(2500);
META.labview={...await full('labview.jpg'),rects:{stage:await rect('#stage'),vbar:await rect('.vbar')}};
const st=await rect('#stage');const cx=st[0]+st[2]/2, cy=st[1]+st[3]*.62;
META.labview.frames=[];
const NF=36;
for(let i=0;i<NF;i++){
  await p.mouse.move(cx,cy);await p.mouse.down();await p.mouse.move(cx-6,cy,{steps:2});await p.mouse.up();await p.waitForTimeout(90);
  const f=`lab_${String(i).padStart(2,'0')}.jpg`;await p.screenshot({path:`${OUT}/${f}`,type:'jpeg',quality:80,clip:{x:st[0],y:st[1],width:st[2],height:st[3]},scale:'css'});META.labview.frames.push(f);
}

// 4 required figures g1
await go('figs-g1',{bioFigs:{1:1}});ch=await chrome('figs');
const figEnd=await p.evaluate(()=>Math.round([...document.querySelectorAll('.figgrid')][1].getBoundingClientRect().bottom+scrollY+24));
META.figs={...await region('figs.jpg',0,Math.max(844,figEnd)),...ch,rects:{fig0:await rect('.figcard[data-i="0"]'),note:await rect('.fnote')}};

// 5 figure view + self-test
await go('fig-0');
META.fig0a={...await full('fig0a.jpg'),rects:{quiz:await rect('#fQuiz'),fig:await rect('#gfig')}};
await p.click('#fQuiz');await p.waitForTimeout(400);
const covs=await p.evaluate(()=>[...document.querySelectorAll('.fcov')].map(e=>{const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top+scrollY),Math.round(r.width),Math.round(r.height)]}));
META.fig0b={...await full('fig0b.jpg'),rects:{cov0:covs[2],cov1:covs[5],all:await rect('#fAll')}};
await p.evaluate(()=>{const c=[...document.querySelectorAll('.fcov')];c[2].dispatchEvent(new MouseEvent('click'));c[5]&&c[5].dispatchEvent(new MouseEvent('click'))});await p.waitForTimeout(300);
META.fig0c={...await full('fig0c.jpg'),rects:{score:await rect('#fscore')}};

// 6 mind map (grade 6, chapter 1)
await go('g6-ch-1');ch=await chrome('g6c1');
const mm=await p.evaluate(()=>{const h=[...document.querySelectorAll('.reader h3')].find(e=>e.textContent.includes('الخريطة الذهنية للفصل'));const k=h.closest('.keep');let n=k.nextElementSibling;const y0=k.getBoundingClientRect().top+scrollY;const y1=n.getBoundingClientRect().bottom+scrollY;return {y0:Math.round(y0-14),y1:Math.round(y1+18),cls:n.className}});
META.mind={...await region('mind.jpg',mm.y0,mm.y1),...ch,cls:mm.cls};
// 7 book solutions (exam), before + after revealing the first answer
const ex=await p.evaluate(()=>{const e=document.querySelector('.reader .exam');const r=e.getBoundingClientRect();return Math.round(r.top+scrollY-14)});
const exRv=await p.evaluate(base=>{const b=document.querySelector('.reader .exam .rv');const r=b.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top+scrollY-base),Math.round(r.width),Math.round(r.height)]},ex);
META.examA={...await region('examA.jpg',ex,ex+844),...ch,rects:{rv:exRv}};
await p.evaluate(()=>document.querySelector('.reader .exam .rv').click());await p.waitForTimeout(200);
const exAns=await p.evaluate(base=>{const a=document.querySelector('.reader .exam .ans:not(.hid),.reader .exam .a:not(.hid)');if(!a)return null;const r=a.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top+scrollY-base),Math.round(r.width),Math.round(r.height)]},ex);
META.examB={...await region('examB.jpg',ex,ex+844),...ch,rects:{ans:exAns}};

// 8 flashcards home g1 with a sample progress state
const cardIds=await (async()=>{await go('cards-g1');return p.evaluate(()=>cardsOf(1).map(k=>k.id))})();
const demo={};cardIds.forEach((id,i)=>{if(i<14)demo[id]=3;else if(i<34)demo[id]=2;else if(i<66)demo[id]=1});
await go('cards-g1',{bioLeitner:demo});ch=await chrome('cards');
const cEnd=await p.evaluate(()=>Math.round(document.querySelector('.cta').getBoundingClientRect().bottom+scrollY+24));
META.cards={...await region('cards.jpg',0,Math.max(844,cEnd)),...ch,rects:{leit:await rect('.leit'),start:await rect('#cStart')}};
// 9 flashcard run: the «الماسح والنافذ» card first
const only={};cardIds.forEach(id=>{if(id!=='1-1-29')only[id]=1});
await go('cardrun-g1',{bioLeitner:only});
META.cardA={...await full('cardA.jpg'),rects:{card:await rect('#fc')},q:await p.evaluate(()=>document.querySelector('.fq').textContent)};
await p.click('#fc');await p.waitForTimeout(300);
META.cardB={...await full('cardB.jpg'),rects:{card:await rect('#fc'),yes:await rect('#fYes'),no:await rect('#fNo')}};

// 10 instant correction: the hook question inside the real quiz screen
await go('test-g1-quick');
await p.evaluate(()=>{const c=CH.find(x=>x.n==2);const q=c.mcq.find(m=>m.q.includes('الهورمونات والإنزيمات'));TQ.qs[0]={...q,c};TQ.i=0;TQ.score=0;tShow()});await p.waitForTimeout(250);
META.quizA={...await full('quizA.jpg'),rects:{wrong:await rect('.qo button:nth-child(2)'),right:await rect('.qo button:nth-child(1)'),q:await rect('.qq')}};
await p.click('.qo button:nth-child(2)');await p.waitForTimeout(250);
META.quizB={...await full('quizB.jpg'),rects:{wrong:await rect('.qo button:nth-child(2)'),right:await rect('.qo button:nth-child(1)')}};

// 11 ministerial questions (grade 6)
await go('wiz-g6');ch=await chrome('wiz');
const wEnd=await p.evaluate(()=>Math.round(document.querySelector('.wzgrid').getBoundingClientRect().top+scrollY+330));
META.wiz={...await region('wiz.jpg',0,wEnd),...ch,rects:{head:await rect('.wzhead'),grid:await rect('.wzgrid')}};
await go('wizrun-g6-3');
META.wizcard={...await full('wizcard.jpg'),rects:{card:await rect('#fc'),rep:await rect('.wzrep')}};

// 12 test centre (grade 6)
await go('tests-g6');ch=await chrome('tests');
const tEnd=await p.evaluate(()=>Math.round(document.querySelector('.tmodes').getBoundingClientRect().bottom+scrollY+24));
META.tests={...await region('tests.jpg',0,Math.max(844,tEnd)),...ch,rects:{modes:await rect('.tmodes'),m1:await rect('.tmode:nth-child(1)'),m2:await rect('.tmode:nth-child(2)'),m3:await rect('.tmode:nth-child(3)'),m4:await rect('.tmode:nth-child(4)')}};

fs.writeFileSync(SP+'/reel/meta.json',JSON.stringify(META,null,1));
console.log('errors',JSON.stringify(errs));await b.close()})();
