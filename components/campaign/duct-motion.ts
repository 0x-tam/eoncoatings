// Isolated photographic duct effects retained from the discarded hero trial.
export function createDuctMotion(ctx:CanvasRenderingContext2D){
 const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
 const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const fxImages:Record<string,HTMLImageElement>={};
const fxReady=Promise.all(['mold','lint'].map(async key=>{const image=new Image();image.src=`/images/duct-motion/${key}.png`;await image.decode();fxImages[key]=image;}));
const fract=(n:number)=>n-Math.floor(n);
const rand=(n:number)=>fract(Math.sin(n*127.1+311.7)*43758.5453);
const smooth=(v:number)=>{const u=clamp(v,0,1);return u*u*(3-2*u)};
const fxSurface=document.createElement('canvas');fxSurface.width=640;fxSurface.height=480;
const fxCtx=fxSurface.getContext('2d')!;
const fxMask=document.createElement('canvas');fxMask.width=160;fxMask.height=120;
const maskCtx=fxMask.getContext('2d')!;
const maskData=maskCtx.createImageData(160,120);
const field=new Float32Array(160*120);
for(let py=0;py<120;py++)for(let px=0;px<160;px++){
 const a=Math.hypot((px-75)/85,(py-60)/60),b=Math.hypot((px-107)/75,(py-43)/60),c=Math.hypot((px-43)/75,(py-78)/60);
 field[py*160+px]=Math.min(a,b+.2,c+.15)+.075*Math.sin(px*.23)*Math.sin(py*.19)+rand(px+py*160)*.07;
}
function growingTexture(image:HTMLImageElement,age:number){
 fxCtx.clearRect(0,0,640,480);fxCtx.globalCompositeOperation='source-over';fxCtx.globalAlpha=1;fxCtx.drawImage(image,0,0,640,480);
 const threshold=mix(-.06,1.25,smooth(age/5.5));
 for(let i=0;i<field.length;i++){const k=i*4;maskData.data[k]=maskData.data[k+1]=maskData.data[k+2]=255;maskData.data[k+3]=Math.round(255*smooth((threshold-field[i])/.09));}
 maskCtx.putImageData(maskData,0,0);fxCtx.globalCompositeOperation='destination-in';fxCtx.drawImage(fxMask,0,0,640,480);fxCtx.globalCompositeOperation='source-over';return fxSurface;
}
function motes(time:number,count:number,spanX:number,spanY:number){
 for(let i=0;i<count;i++){
  const depth=rand(i+30),speed=mix(.11,.3,depth),phase=fract(rand(i+1)+time*speed);
  const px=spanX*(.51+(rand(i+400)-.5)*mix(.1,1.7,phase));
  const py=spanY*(.4+(rand(i+700)-.38)*mix(.1,1.7,phase));
  const radius=mix(.5,5,phase*depth);
  ctx.save();ctx.globalAlpha=Math.sin(phase*Math.PI)*mix(.28,.78,depth);ctx.fillStyle='#d8cfb9';
  if(i%13===0&&fxImages.lint){ctx.translate(px,py);ctx.rotate(time*.2*(rand(i+11)-.5)+i);const size=radius*8;ctx.drawImage(fxImages.lint,-size/2,-size/2,size,size*.8);}else{
   ctx.beginPath();ctx.ellipse(px,py,radius,radius*.56,time*.2+i,0,Math.PI*2);ctx.fill();
  }ctx.restore();
 }
}
function moisture(time:number,buildAge:number){
 // Condensation stays registered to the solid near wall, with slow gravity-driven drips.
 ctx.save();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(455,0);ctx.lineTo(455,705);ctx.lineTo(0,1024);ctx.closePath();ctx.clip();
 const reveal=smooth(buildAge/3.5);
 for(let i=0;i<38;i++){
  const baseX=42+rand(i+1300)*370,baseY=80+rand(i+1400)*630;
  const drift=Math.max(0,time-2.5),period=16+rand(i+1500)*18,phase=fract(drift/period+rand(i+1600));
  const moving=i%4===0,fall=moving?phase*115:Math.sin(time*.13+i)*1.4;
  const xx=baseX+fall*.055,yy=baseY+fall,r=3+rand(i+1700)*5;
  const opacity=reveal*(moving?Math.sin(phase*Math.PI):.8);
  ctx.save();ctx.globalAlpha=opacity*.64;
  if(moving){ctx.strokeStyle='#b6ccd14a';ctx.lineWidth=r*.34;ctx.beginPath();ctx.moveTo(xx-fall*.045,yy-Math.min(fall,48));ctx.lineTo(xx,yy);ctx.stroke();}
  const shine=ctx.createRadialGradient(xx-r*.35,yy-r*.5,.3,xx,yy,r*1.35);
  shine.addColorStop(0,'#f6faf5bb');shine.addColorStop(.26,'#c0d2d14d');shine.addColorStop(.7,'#23322e50');shine.addColorStop(1,'#10251c00');
  ctx.fillStyle=shine;ctx.beginPath();ctx.ellipse(xx,yy,r*.72,r*1.3,-.08,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#eef6ee7a';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(xx-r*.12,yy-r*.18,r*.5,r*.88,-.08,Math.PI*1.02,Math.PI*1.6);ctx.stroke();ctx.restore();
 }
 ctx.restore();
}
function animateDuct(time:number,left:number,top:number,w:number,h:number,buildAge:number){
 if(!fxImages.mold)return;
 ctx.save();ctx.translate(left,top);ctx.scale(w/1536,h/1024);
 moisture(time,buildAge);
 const growth=growingTexture(fxImages.mold,Math.min(buildAge,6));
 // Clip all growth to identified solid metal planes, excluding the open right branch.
 ctx.save();ctx.beginPath();
 const planes=[[[0,0],[455,0],[455,705],[0,1024]],[[455,670],[1460,665],[1536,1024],[0,1024]],[[520,215],[850,215],[850,480],[520,480]],[[900,210],[1010,265],[1010,555],[900,605]]];
 for(const plane of planes){plane.forEach(([px,py],i)=>i?ctx.lineTo(px,py):ctx.moveTo(px,py));ctx.closePath();}ctx.clip();
 // Fixed photographic registration on the near duct wall. Reveal grows across metal.
 ctx.save();ctx.transform(.38,-.12,.035,.79,85,290);ctx.globalAlpha=.82;ctx.drawImage(growth,0,0,640,480);ctx.restore();
 ctx.save();ctx.transform(.28,.035,-.07,.18,490,658);ctx.globalAlpha=.72;ctx.drawImage(growth,0,0,640,480);ctx.restore();
 ctx.save();ctx.transform(.27,.04,-.01,.27,635,275);ctx.globalAlpha=.62;ctx.drawImage(growth,0,0,640,480);ctx.restore();
 ctx.save();ctx.transform(.12,.04,.01,.45,913,267);ctx.globalAlpha=.48;ctx.drawImage(growth,0,0,640,480);ctx.restore();
 ctx.restore();motes(time<=6?time:6+(time-6)*.38,175,1536,1024);ctx.restore();
}
return {ready:fxReady,draw:animateDuct,dispose(){fxSurface.width=fxMask.width=0;for(const image of Object.values(fxImages))image.src=''}};
}
