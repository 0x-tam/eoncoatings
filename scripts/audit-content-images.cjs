const fs=require('fs'),path=require('path'),sharp=require(process.cwd()+'/node_modules/sharp');
const routes=['/','/service/','/about-us/','/industry/','/hgpp-certification/','/contact-us/',...['offices','healthcare','education','hospitality'].map(s=>`/industries/${s}/`),...Array.from(fs.readFileSync('lib/eon/services.ts','utf8').matchAll(/slug:'([^']+)'/g),m=>`/services/${m[1]}/`)];
(async()=>{
 const uses=[];for(const route of routes){const html=await(await fetch('http://127.0.0.1:5176'+route)).text();for(const match of html.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/g)){const src=match[1];if(src.startsWith('/images/')&&!/eon-logo|certificate/.test(src))uses.push({route,src});}}
 const camera=fs.readFileSync('components/campaign/PhotographicCamera.tsx','utf8');for(const m of camera.matchAll(/\['([^']+)', '(\/images\/[^']+)'/g)){if(!uses.some(u=>u.route==='/'&&u.src===m[2]))uses.push({route:'hero-camera:'+m[1],src:m[2]})};
 const f=fs.readFileSync('components/campaign/finderPhotos.ts','utf8');for(const m of f.matchAll(/'([^']+)':'([^']+\.webp)'/g))uses.push({route:'finder:'+m[1],src:'/images/'+m[2]});
 const by={};for(const u of uses)(by[u.src]??=[]).push(u.route);
 const duplicates=Object.entries(by).filter(([,r])=>r.length>1).map(([src,routes])=>({src,routes}));
 const hashes=[],missing=[];for(const src of Object.keys(by)){try{const raw=await sharp(path.join('public',src)).resize(9,8,{fit:'fill'}).greyscale().raw().toBuffer();let bits='';for(let y=0;y<8;y++)for(let x=0;x<8;x++)bits+=raw[y*9+x]>raw[y*9+x+1]?'1':'0';hashes.push({src,bits});}catch{missing.push(src)}}
 const similar=[];for(let i=0;i<hashes.length;i++)for(let j=i+1;j<hashes.length;j++){const a=hashes[i],b=hashes[j];let d=0;for(let k=0;k<64;k++)d+=a.bits[k]!==b.bits[k];if(d<=5)similar.push({a:a.src,b:b.src,distance:d});}
 const result={routes:routes.length,placements:uses.length,uniquePhotographs:Object.keys(by).length,duplicates,similar,missing,uses,scope:'Redesigned public pages and every finder answer. Identity logo and HGPP document excluded. Existing journal archive is inventoried separately and its redesign remains deferred.'};
 fs.writeFileSync(process.argv[2]||'docs/image-audit.json',JSON.stringify(result,null,2));console.log(JSON.stringify({routes:result.routes,placements:result.placements,unique:result.uniquePhotographs,duplicates,similar,missing},null,2));
})();
