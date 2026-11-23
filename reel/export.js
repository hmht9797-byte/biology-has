const {chromium}=require('playwright');const {spawn}=require('child_process');const SP=process.env.SP;
const FPS=30,T=60,OUT=SP+'/reel/reel_60s_1080x1920.mp4';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8770/test.html#still');await p.evaluate(()=>REEL.ready);await p.evaluate(()=>REEL.clean(true));await p.waitForTimeout(500);
const k=await p.evaluate(()=>document.getElementById('stage').style.transform);console.log('stage',k);
const ff=spawn('ffmpeg',['-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','slow','-crf','17','-pix_fmt','yuv420p','-profile:v','high','-movflags','+faststart','-r',String(FPS),OUT],{stdio:['pipe','ignore','pipe']});
let fferr='';ff.stderr.on('data',d=>fferr=(fferr+d).slice(-1500));
const N=FPS*T-1;const t0=Date.now();
for(let i=0;i<=N;i++){const t=Math.min(T,i/FPS);await p.evaluate(t=>REEL.seek(t),t);
  const buf=await p.screenshot({type:'jpeg',quality:93,clip:{x:0,y:0,width:1080,height:1920}});
  if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));
  if(i%150===0)console.log('frame',i,'/',N,Math.round((Date.now()-t0)/1000)+'s');}
ff.stdin.end();await new Promise(r=>ff.on('close',r));
console.log('done',OUT,'errors',JSON.stringify(errs));console.log(fferr.split('\n').slice(-4).join('\n'));await b.close()})();
