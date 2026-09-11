const fs = require('fs');
const path = require('path');
const sharp = require('/Users/Tamam/Documents/ChatGPT/Eon Coatings Website/node_modules/sharp');
const root = '/private/tmp/eon-life-well-kept/media';
const inputs = [
['hero-landscape-master.png','hero-landscape',[768,1280,1536]],
['hero-portrait-master.png','hero-portrait',[480,768,1024]],
['stone-detail-exact.png','stone-detail',[640,1100]],
['fabric-detail-exact.png','fabric-detail',[480,765]],
['air-architectural-master.png','air-architectural',[768,1280,1536]],
['surface-touch-master.png','surface-touch',[768,1280,1536]],
['mattress-master.png','mattress',[768,1280,1536]],
['carpet-upholstery-master.png','carpet-upholstery',[768,1280,1536]],
['exterior-materials-master.png','exterior-materials',[768,1280,1536]],
['marble-counter-master.png','marble-counter',[768,1280,1536]]
];
(async () => {
 const records = [];
 for (const [file, slug, widths] of inputs) {
  const original = await sharp(path.join(root,file)).metadata();
  for (const width of widths) {
   for (const format of ['webp','avif','jpg']) {
    const name = slug+'-'+width+'.'+format;
    let pipeline = sharp(path.join(root,file)).resize({width,withoutEnlargement:true});
    if(format==='webp') pipeline=pipeline.webp({quality:84,effort:5});
    if(format==='avif') pipeline=pipeline.avif({quality:58,effort:5});
    if(format==='jpg') pipeline=pipeline.jpeg({quality:86,mozjpeg:true});
    const info=await pipeline.toFile(path.join(root,name));
    records.push({file:name,source:file,width:info.width,height:info.height,bytes:info.size,format});
   }
  }
 }
 fs.writeFileSync(path.join(root,'responsive-derivatives.json'),JSON.stringify(records,null,2)+'\n');
 console.log(JSON.stringify({count:records.length,totalBytes:records.reduce((a,b)=>a+b.bytes,0),hero:records.filter(r=>r.file.startsWith('hero-landscape'))},null,2));
})().catch(e=>{console.error(e);process.exit(1);});

