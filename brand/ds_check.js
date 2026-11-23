// Local stand-in for the design-system page: compile tokens.json -> tokens.css, render each preview in light + dark.
const {chromium}=require('playwright');const fs=require('fs');const P=process.argv[2],OUT=process.argv[3];fs.mkdirSync(OUT,{recursive:true});
const t=JSON.parse(fs.readFileSync(P+'/tokens.json','utf8'));const th=t.color.themes.map(x=>x.id);
const v=(tok,id)=>typeof tok.value==='string'?tok.value:(tok.value[id]??tok.value[th[0]]);
let css='';for(const f of t.type.fonts)css+=`@font-face{font-family:'${f.family}';font-weight:${f.weight};src:url('file://${P}/${f.file}')}\n`;
for(const id of th){css+=(id===th[0]?`:root,[data-theme="${id}"]`:`[data-theme="${id}"]`)+'{';for(const k of t.color.tokens)css+=`--${k.name}:${v(k,id)};`;for(const k of t.shadow.tokens)css+=`--${k.name}:${v(k,id)};`;css+='}\n'}
css+=':root{';for(const fam of ['spacing','radius','size'])for(const k of t[fam].tokens)css+=`--${k.name}:${k.value};`;for(const [k,s] of Object.entries(t.type.families))css+=`--font-${k}:${s};`;css+='}\n';
const bundle=fs.readFileSync(P+'/components/bundle.css','utf8');
const comps=fs.readdirSync(P+'/components').filter(d=>fs.existsSync(`${P}/components/${d}/preview.html`));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:960,height:400}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 for(const c of comps)for(const id of th){
   let html=fs.readFileSync(`${P}/components/${c}/preview.html`,'utf8');const h=+(/height=(\d+)/.exec(html)||[0,200])[1];
   html=html.replace('<head>',`<head><style>${css}</style><style>${bundle}</style>`).replace('<html ',`<html data-theme="${id}" `);
   await p.setViewportSize({width:960,height:h});await p.setContent(html,{waitUntil:'load'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);
   const info=await p.evaluate(()=>{const o=[];const de=document.documentElement;if(de.scrollWidth>de.clientWidth+1)o.push('hscroll '+de.scrollWidth);if(de.scrollHeight>innerHeight+1)o.push('taller than card: '+de.scrollHeight);
     const h1=document.querySelector('.tx h1');if(h1){const r=h1.getBoundingClientRect();o.push('name w='+Math.round(r.width)+' h='+Math.round(r.height)+' left='+Math.round(r.left))}
     const fams=[...new Set([...document.querySelectorAll('body *')].map(e=>getComputedStyle(e).fontFamily.split(',')[0]))].slice(0,3);o.push('fonts '+fams.join('|'));return o.join('; ')});
   await p.screenshot({path:`${OUT}/${c}-${id}.png`});console.log(c.padEnd(16),id.padEnd(5),info);
 }
 console.log('errors',JSON.stringify(errs));await b.close()})();
