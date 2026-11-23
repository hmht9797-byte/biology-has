// Rasterise the icon family + feature graphic with Chromium (exact SVG gradients, real Arabic shaping)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const D=__dirname+'/out', R=D+'/png'; fs.mkdirSync(R,{recursive:true});
const DENS={mdpi:1,hdpi:1.5,xhdpi:2,xxhdpi:3,xxxhdpi:4};
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 async function svg(file,px,out){await p.setViewportSize({width:px,height:px});await p.goto('file://'+D+'/icon/'+file);
   await p.screenshot({path:R+'/'+out,omitBackground:true,clip:{x:0,y:0,width:px,height:px}});}
 for(const [d,k] of Object.entries(DENS)){
   await svg('launcher_legacy.svg',48*k,`ic_launcher-${d}.png`);
   for(const l of ['fg','bg','mono'])await svg(`adaptive_${l}.svg`,108*k,`ic_launcher_${l}-${d}.png`);
 }
 await svg('play_512.svg',512,'icon_512.png'); await svg('launcher_legacy.svg',512,'launcher_512.png');
 for(const px of [16,24,32,48,64,96])await svg('launcher_legacy.svg',px,`small_${px}.png`);
 await p.setViewportSize({width:1024,height:500});await p.goto('file://'+D+'/feature_graphic.html');
 await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
 const fonts=await p.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+f.weight));
 const over=await p.evaluate(()=>{const t=document.querySelector('.txt').getBoundingClientRect(),i=document.querySelector('.icon').getBoundingClientRect();return {txt:[t.left,t.top,t.right,t.bottom].map(Math.round),icon:[i.left,i.top,i.right,i.bottom].map(Math.round)}});
 await p.screenshot({path:R+'/feature_graphic_raw.png',clip:{x:0,y:0,width:1024,height:500}});
 console.log('fonts',fonts.join(','),'| boxes',JSON.stringify(over),'| errors',JSON.stringify(errs));await b.close();})();
