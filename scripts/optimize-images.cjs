const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process'),sharp=require('sharp');
(async()=>{
 const report=fs.existsSync('docs/seo/image-optimization.json')?JSON.parse(fs.readFileSync('docs/seo/image-optimization.json','utf8')):[];
 const files=execFileSync('git',['ls-files','public/images'],{encoding:'utf8'}).trim().split('\n').filter(p=>/\.(webp|png|jpe?g)$/i.test(p));
 for(const file of files){
  const input=fs.readFileSync(file);
  const prior=report.find(r=>r.file===file);
  if(prior&&((!prior.converted&&input.length===prior.after)||(prior.converted&&input.length===prior.before&&fs.existsSync(prior.dest)&&fs.statSync(prior.dest).size===prior.after)))continue;
  const meta=await sharp(input).metadata();
  const document=/certificate|authentic\//i.test(file);
  let pipeline=sharp(input);
  // Preserve the dimensions of registered zoom tiles and source documents.
  if(!document&&!/zoom|room\//.test(file))pipeline=pipeline.resize({width:1920,height:1920,fit:'inside',withoutEnlargement:true});
  let output;
  if(meta.format==='png')output=await pipeline.png({compressionLevel:9,effort:10}).toBuffer();
  else if(meta.format==='webp')output=await pipeline.webp({quality:84,effort:5}).toBuffer();
  else output=await pipeline.jpeg({quality:document?95:84,mozjpeg:true}).toBuffer();
  if(!document&&meta.format==='png'&&input.length>100000){
   const webp=await pipeline.webp({quality:86,effort:5}).toBuffer();
   if(webp.length<input.length*.8){const dest=file.replace(/\.png$/i,'.webp');if(!fs.existsSync(dest)){fs.writeFileSync(dest,webp);report.push({file,dest,before:input.length,after:webp.length,converted:true});continue;}}
  }
  if(output.length<input.length*.9){fs.writeFileSync(file,output);report.push({file,before:input.length,after:output.length});}
 }
 fs.mkdirSync('docs/seo',{recursive:true});fs.writeFileSync('docs/seo/image-optimization.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify({optimized:report.length,before:report.reduce((s,r)=>s+r.before,0),after:report.reduce((s,r)=>s+r.after,0)}));
})();
