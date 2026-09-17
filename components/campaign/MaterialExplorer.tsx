'use client';
import {useRef,useState,useEffect,type CSSProperties} from 'react';
import Link from '@/components/eon/PageLink';
import ScenePanel from './ScenePanel';
import PhotographicCamera from './PhotographicCamera';
import {materialTraces} from './materialTraces';
type Material='air'|'fabric'|'stone';
const order:Material[]=['air','fabric','stone'];
const details={
 air:{title:'Clean deeper into your AC.',label:'AC duct cleaning',copy:'Remove built-up dust and dirt, with sanitisation and mold-resistant coating where needed.',image:'duct',caption:'Illustrative dust, moisture and mold-like growth. Actual conditions require inspection.',links:[['AC duct cleaning & sanitisation','ac-duct-mold-resistant-coating']]},
 fabric:{title:'Freshen the fabrics you live with.',label:'Furniture & fabrics',copy:'Deep cleaning for sofas, carpets and mattresses. Added protection against future spills.',image:'fabric',caption:'Magnification is illustrative, not a sample from this room.',links:[['Furniture & carpet cleaning','deep-cleaning-of-carpets-furniture'],['Fabric stain protection','stain-resistant-furniture-coating'],['Mattress cleaning','mattress-cleaning-and-sanitization']]},
 stone:{title:'Protect the surfaces you use.',label:'Surfaces & stone',copy:'Help protect marble from stains and shared surfaces from germs.',image:'stone',caption:'Illustrative surface detail. Treatment depends on the material.',links:[['Marble protection','marble-protective-coatings'],['Protection against germs','antimicrobial-surface-coating']]}
};
const points:Record<Material,[number,number]>={air:[.674,.095],fabric:[.88,.76],stone:[.515,.79]};
export default function MaterialExplorer(){
 const [target,setTarget]=useState<Material|null>(null),[active,setActive]=useState<Material|null>(null),[ready,setReady]=useState(false),[failed,setFailed]=useState(false),[micro,setMicro]=useState(false),[settled,setSettled]=useState(false);
 const field=useRef<HTMLDivElement>(null),backButton=useRef<HTMLButtonElement>(null),lastTrigger=useRef<string>('nav-air'),triggers=useRef<Record<string,HTMLButtonElement|null>>({});
 const restoreFocus=useRef(false);
 const [trace,setTrace]=useState(0);
 const traceCard=useRef<HTMLDivElement>(null);
 const [cardSize,setCardSize]=useState({w:350,h:255});
 useEffect(()=>{const el=traceCard.current;if(!el)return;const observer=new ResizeObserver(()=>setCardSize({w:el.offsetWidth,h:el.offsetHeight}));observer.observe(el);return()=>observer.disconnect()},[active,settled]);
 const [box,setBox]=useState({w:1440,h:810});
 useEffect(()=>{const el=field.current;if(!el)return;const update=()=>setBox({w:el.clientWidth,h:el.clientHeight});const observer=new ResizeObserver(update);observer.observe(el);update();return()=>observer.disconnect()},[]);
 useEffect(()=>{setMicro(false);setTrace(0)},[active]);
 const scale=Math.min(box.w/1672,box.h/941),imageW=1672*scale,imageH=941*scale,left=box.w-imageW,top=(box.h-imageH)/2;
 const sourcePoint=(m:Material)=>({x:left+points[m][0]*imageW,y:top+points[m][1]*imageH});
 const position=(m:Material)=>{const p=sourcePoint(m);return{x:Math.max(44,Math.min(box.w-56,p.x)),y:Math.max(44,Math.min(box.h-64,p.y))}};
 function select(m:Material,trigger:HTMLButtonElement){if(target===m)return;restoreFocus.current=false;setSettled(false);lastTrigger.current=trigger.dataset.roomTrigger||`nav-${m}`;setActive(m);setTarget(m);requestAnimationFrame(()=>backButton.current?.focus({preventScroll:true}));}
 function back(){restoreFocus.current=true;setSettled(false);setTarget(null);}
 const d=active?details[active]:null;
 const traceItems=active?materialTraces[active]:[];
 const currentTrace=traceItems[Math.min(trace,traceItems.length-1)];
 const tracePosition=(point:number[])=>{
  const overlayLeft=box.w<=600?0:box.w*(box.w<=1100?.42:.38);
  if(active==='stone'){
   const z=scale*(box.w<=600?6.5:4.7);
   const x=Math.max(box.w-1672*z,Math.min(0,box.w*(box.w>600?.7:.5)-930*z));
   const y=Math.max(box.h-941*z,Math.min(0,box.h*.5-710*z));
   const offset=box.w<=600?0:box.w*(box.w<=1100?.42:.38);
   return {left:x+point[0]*z-offset,top:y+point[1]*z};
  }
  if(active==='air')return {left:(box.w-overlayLeft)*point[0],top:Math.max(65,Math.min(box.h-180,box.h*point[1]))};
  const zoom=scale*(active==='fabric'?(box.w<=600?8:4.6):14);
  const fx=active==='fabric'?1438:945,fy=active==='fabric'?735:728;
  const x=Math.max(box.w-1672*zoom,Math.min(0,box.w*(box.w>600?.7:.5)-fx*zoom));
  const y=Math.max(box.h-941*zoom,Math.min(0,box.h*.5-fy*zoom));
  return {left:Math.max(28,Math.min(box.w-overlayLeft-55,x+point[0]*zoom-overlayLeft)),top:Math.max(65,Math.min(box.h-160,y+point[1]*zoom))};
 };
 const selectedPoint=currentTrace?tracePosition(currentTrace.point):{left:0,top:0};
 const overlayWidth=box.w*(box.w<=600?1:box.w<=1100?.58:.62);
 const clampCard=(x:number,y:number)=>({x:Math.max(12,Math.min(overlayWidth-cardSize.w-12,x)),y:Math.max(12,Math.min(box.h-cardSize.h-12,y))});
 const candidates=[
  clampCard(selectedPoint.left-cardSize.w/2,selectedPoint.top+46),
  clampCard(selectedPoint.left-cardSize.w/2,selectedPoint.top-cardSize.h-46),
  clampCard(selectedPoint.left+(box.w<=1100||box.h<=650?46:135),selectedPoint.top-cardSize.h/2),
  clampCard(selectedPoint.left-cardSize.w-(box.w<=1100||box.h<=650?46:135),selectedPoint.top-cardSize.h/2),
  clampCard(selectedPoint.left-cardSize.w/2,12),
  clampCard(selectedPoint.left-cardSize.w/2,box.h-cardSize.h-12),
  ...Array.from({length:25},(_,i)=>clampCard(12+(overlayWidth-cardSize.w-24)*(i%5)/4,12+(box.h-cardSize.h-24)*Math.floor(i/5)/4))
 ];
 const scoreCard=(c:{x:number;y:number})=>{
  const collisions=traceItems.reduce((n,item)=>{const p=tracePosition(item.point),half=box.w<=1100||box.h<=650?28:120;return n+(c.x<p.left+half&&c.x+cardSize.w>p.left-half&&c.y<p.top+28&&c.y+cardSize.h>p.top-28?1:0)},0);
  const distance=Math.hypot(Math.max(c.x-selectedPoint.left,0,selectedPoint.left-c.x-cardSize.w),Math.max(c.y-selectedPoint.top,0,selectedPoint.top-c.y-cardSize.h));
  return collisions*10000+distance;
 };
 const cardPosition=candidates.sort((a,b)=>scoreCard(a)-scoreCard(b))[0];
 return <section className="room-hero" data-material={active||'overview'} data-panel={target||'overview'} data-settled={settled} aria-label="Explore EON care in a real room">
  <div className="room-image-field" ref={field}>
   <img className="camera-fallback" src="/images/room/room.webp" width="1672" height="941" fetchPriority="high" alt="" aria-hidden="true"/>
   <PhotographicCamera active={target} onReady={()=>{setReady(true);if(!active)setSettled(true)}} onSettled={()=>{setSettled(true);if(!target)setActive(null);if(!target&&restoreFocus.current){restoreFocus.current=false;requestAnimationFrame(()=>triggers.current[lastTrigger.current]?.focus({preventScroll:true}))}}} onError={()=>{setFailed(true);setReady(true)}}/>
   {active&&<div className="room-overlays">
    {settled&&<div className="material-observation">{active==='air'?'INSIDE YOUR AC':active==='fabric'?'YOUR FABRIC, UP CLOSE':'YOUR TABLE, UP CLOSE'}</div>}
    {settled&&currentTrace&&<div className="surface-traces" aria-label={`Explore ${active==='air'?'duct':active==='fabric'?'fabric':'surface'} details`}>
     {traceItems.map((item,i)=><button key={item.title} className="trace-point" aria-label={`${String(i+1).padStart(2,'0')} ${item.title}`} style={active==='stone'?{'--stone-x':`${tracePosition(item.point).left}px`,'--stone-y':`${tracePosition(item.point).top}px`} as CSSProperties:{...tracePosition(item.point),'--trace-x':`${tracePosition(item.point).left}px`,'--trace-y':`${tracePosition(item.point).top}px`} as CSSProperties} aria-pressed={trace===i} onClick={()=>{setTrace(i);setMicro(false)}}><b>0{i+1}</b><span>{item.title}</span></button>)}
     {active==='fabric'&&micro&&<img className="trace-micro" src="/images/room/microbes.webp" alt="Illustrative microorganisms among textile fibers, not a sample from this sofa"/>}
     <div ref={traceCard} className="trace-card" style={{left:cardPosition.x,top:cardPosition.y}} aria-live="polite"><div className="trace-card-content" key={`${active}-${trace}`}><span className="trace-kicker">Detail {String(trace+1).padStart(2,'0')} / {String(traceItems.length).padStart(2,'0')}</span><strong>{currentTrace.title}</strong><p>{currentTrace.copy}</p>
      <Link className="trace-service" href={`/services/${currentTrace.slug}/`}>{currentTrace.service} <span>›</span></Link>
      {active==='fabric'&&currentTrace.title==='Beyond visible dirt'&&<button className="trace-micro-toggle" aria-expanded={micro} onClick={()=>setMicro(!micro)}>{micro?'Close magnified view':'See a magnified view'}</button>}
      <small>{active==='air'?'Illustration. Actual conditions need inspection.':'Illustration, not a test of this material.'}</small></div>
     </div>
    </div>}
    {!settled&&<p className="inspection-caption">{d!.caption}</p>}
   </div>}
   {failed&&<p className="room-image-error">Some fine detail could not load. The room and service information remain available.</p>}
   {!active&&<div className="room-points" style={{visibility:settled?'visible':'hidden'}}>{order.map(m=><button key={m} disabled={!ready} data-room-trigger={`point-${m}`} ref={el=>{triggers.current[`point-${m}`]=el}} style={{left:position(m).x,top:position(m).y}} className={`room-point room-point-${m}`} onClick={e=>select(m,e.currentTarget)} aria-label={`Explore ${m==='air'?'AC duct cleaning':m==='fabric'?'fabrics':'stone surfaces'}`}><span>+</span><small>{m==='air'?'Inside your AC':m==='fabric'?'Your fabrics':'Your surfaces'}</small></button>)}</div>}
  </div>
  <div className="room-copy"><ScenePanel scene={target||'overview'}>{!target?<><p className="eyebrow">EON Coatings / Abu Dhabi, UAE</p><h1>Cleaner air.<br/><em>Fresher fabrics.<br/>Protected surfaces.</em></h1><p className="room-description">AC cleaning, fabric care and protective coatings for homes and workplaces.</p><div className="hero-actions"><Link href="/service-finder/" className="room-cta">Find my service <span>›</span></Link></div></>:<div className="room-detail"><h1 className="sr-only">AC cleaning, fabric care and surface protection.</h1><button ref={backButton} className="back-overview" onClick={back}>← Back to the room</button><p className="eyebrow">{d!.label}</p><h2>{d!.title}</h2><p>{d!.copy}</p><nav aria-label={`${active} services`}>{d!.links.map(([label,slug])=><Link key={slug} href={`/services/${slug}/`}>{label}<span>›</span></Link>)}</nav><Link className="room-cta" href="/service-finder/">Find my service <span>›</span></Link></div>}</ScenePanel></div>
  <div className="room-bar"><nav aria-label="Explore by material">{order.map((m,i)=><button key={m} disabled={!ready} data-room-trigger={`nav-${m}`} ref={el=>{triggers.current[`nav-${m}`]=el}} aria-pressed={active===m} onClick={e=>select(m,e.currentTarget)}><small>0{i+1}</small>{m==='air'?'AC care':m==='fabric'?'Fabrics':'Surfaces'}<span>›</span></button>)}</nav><a href="#services">Scroll to discover EON Coatings <span>↓</span></a></div>
  <span className="sr-only" role="status">{active?`${d!.label} selected. Service information is available.`:'Room overview'}</span>
 </section>
}
