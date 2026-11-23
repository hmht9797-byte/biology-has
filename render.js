const {chromium}=require('playwright');const fs=require('fs');const D=__dirname;
(async()=>{const b=await chromium.launch();const pg=await b.newPage();
await pg.goto('file://'+D+'/'+(process.argv[2]||'malzama.html'),{waitUntil:'networkidle'});await pg.evaluate(()=>document.fonts.ready);
const foot=process.argv[4]==='nofoot';
await pg.pdf({path:D+'/'+(process.argv[3]||'body.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true,
displayHeaderFooter:!foot,headerTemplate:'<span></span>',footerTemplate:fs.readFileSync(D+'/foot.html','utf8')});await b.close();})();
