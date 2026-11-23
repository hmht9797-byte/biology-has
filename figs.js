const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({deviceScaleFactor:1.5});
await p.goto('file://'+__dirname+'/malzama.html');await p.evaluate(()=>document.fonts.ready);
const figs=await p.$$('.fig');for(let i=0;i<figs.length;i++){await figs[i].screenshot({path:__dirname+'/chk/fig'+i+'.png'});}
console.log(figs.length);await b.close();})();
