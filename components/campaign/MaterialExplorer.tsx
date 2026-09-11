'use client';
import {useRef,useState,useEffect} from 'react';
import Link from 'next/link';
type Material='air'|'fabric'|'stone';
const order:Material[]=['air','fabric','stone'];
const details={
 air:{title:'Start with the air.',label:'AC duct cleaning',copy:'A clean-looking room can hide dust inside its ductwork. Explore EON’s AC duct cleaning, sanitisation and specialist coating services.',image:'duct',caption:'Illustrative duct inspection. Conditions vary by system.',links:[['AC duct cleaning & sanitisation','ac-duct-mold-resistant-coating']]},
 fabric:{title:'Get closer to comfort.',label:'Sofas & soft furnishings',copy:'A closer look at the fabric you live with. Discover deep cleaning, sanitisation and stain-resistant protection for your furnishings.',image:'fabric',caption:'Matching upholstery detail. Magnification is illustrative, not a sample from this room.',links:[['Carpet & furniture deep cleaning','deep-cleaning-of-carpets-furniture'],['Stain-resistant furniture coating','stain-resistant-furniture-coating'],['Mattress cleaning & sanitisation','mattress-cleaning-and-sanitization']]},
 stone:{title:'Care for every surface.',label:'Stone & shared surfaces',copy:'Everyday contact leaves its mark. Find the right care for natural stone and the surfaces your household touches.',image:'stone',caption:'Illustrative surface detail. Treatment depends on the material.',links:[['Marble protective coatings','marble-protective-coatings'],['Anti-microbial surface coating','antimicrobial-surface-coating']]}
};
const points:Record<Material,[number,number]>={air:[.70,.09],fabric:[.85,.78],stone:[.52,.76]};
export default function MaterialExplorer(){
 const [active,setActive]=useState<Material|null>(null),[ready,setReady]=useState(false),[failed,setFailed]=useState(false),[micro,setMicro]=useState(false);
 const field=useRef<HTMLDivElement>(null),backButton=useRef<HTMLButtonElement>(null),lastTrigger=useRef<string>('nav-air'),triggers=useRef<Record<string,HTMLButtonElement|null>>({});
 const [box,setBox]=useState({w:1440,h:810});
 useEffect(()=>{const el=field.current;if(!el)return;const update=()=>setBox({w:el.clientWidth,h:el.clientHeight});const observer=new ResizeObserver(update);observer.observe(el);update();return()=>observer.disconnect()},[]);
 useEffect(()=>{setReady(false);setFailed(false);setMicro(false);if(!active)return;let stopped=false;let timer:ReturnType<typeof setTimeout>;const start=performance.now();const im=new Image();const qa=new URLSearchParams(location.search);im.src=qa.get('qa')==='1'&&qa.get('failAir')==='1'&&active==='air'?'/qa/unavailable-air.webp':`/images/room/${details[active].image}.webp`;im.decode().then(()=>{if(!stopped)timer=setTimeout(()=>setReady(true),Math.max(0,650-(performance.now()-start)))}).catch(()=>{if(!stopped)setFailed(true)});return()=>{stopped=true;clearTimeout(timer)}},[active]);
 const scale=Math.max(box.w/1672,box.h/941),imageW=1672*scale,imageH=941*scale,left=(box.w-imageW)/2;
 const position=(m:Material)=>({x:Math.max(30,Math.min(box.w-30,left+points[m][0]*imageW)),y:Math.max(30,Math.min(box.h-30,points[m][1]*imageH))});
 const focus=active?position(active):null,z=active==='air'?2.7:2.15;
 const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
 const dx=focus?clamp(box.w*.70-focus.x,box.w-focus.x-(left+imageW-focus.x)*z,(focus.x-left)*z-focus.x):0;
 const dy=focus?clamp(box.h*.5-focus.y,box.h-focus.y-(imageH-focus.y)*z,focus.y*(z-1)):0;
 function select(m:Material,trigger:HTMLButtonElement){lastTrigger.current=trigger.dataset.roomTrigger||`nav-${m}`;setActive(m);requestAnimationFrame(()=>backButton.current?.focus());}
 function back(){setActive(null);requestAnimationFrame(()=>triggers.current[lastTrigger.current]?.focus());}
 const d=active?details[active]:null;
 return <section className="room-hero" data-material={active||'overview'} aria-label="Explore EON care in a real room">
  <div className="room-image-field" ref={field}>
   <div className="room-master" style={{transform:focus?`translate(${dx}px,${dy}px) scale(${z})`:'translate(0px,0px) scale(1)',transformOrigin:focus?`${focus.x}px ${focus.y}px`:undefined}}>
    <picture><source type="image/avif" srcSet="/images/room/room.avif"/><img src="/images/room/room.webp" width="1672" height="941" fetchPriority="high" alt="Sunlit living room with a visible ducted AC outlet, cobalt blue L-shaped sofa and pale stone coffee table"/></picture>
   </div>
   {active&&<div className={`room-inspection ${ready?'is-ready':''}`} aria-hidden={!ready}>
    <img src={`/images/room/${d!.image}.webp`} width="1672" height="941" alt={active==='air'?'Dust and lint settled inside a galvanized residential air-conditioning duct':active==='fabric'?'Detailed blue upholstery weave matching the room’s sectional sofa':'Close detail of the room’s pale travertine surface with everyday residue'}/>
    {active==='fabric'&&ready&&<button className={`micro-study ${micro?'is-expanded':''}`} onClick={()=>setMicro(!micro)} aria-expanded={micro} aria-label={micro?'Return to fabric detail':'Enlarge illustrative microscopic view'}><img src="/images/room/microbes.webp" width="1024" height="1024" alt="Illustrative magnification of microorganisms among blue textile fibers, not a diagnostic sample"/><span>Illustrative magnification <b>{micro?'−':'+'}</b></span></button>}
    <p className="inspection-caption">{d!.caption}</p>
   </div>}
   {failed&&<p className="room-image-error">The inspection photograph is unavailable. Explore the service below.</p>}
   {!active&&<div className="room-points">{order.map(m=><button key={m} data-room-trigger={`point-${m}`} ref={el=>{triggers.current[`point-${m}`]=el}} style={{left:position(m).x,top:position(m).y}} className={`room-point room-point-${m}`} onClick={e=>select(m,e.currentTarget)} aria-label={`Explore ${m==='air'?'AC duct cleaning':m==='fabric'?'sofa fabric':'stone surfaces'}`}><span>+</span><small>{m==='air'?'Inside your AC':m==='fabric'?'Your sofa':'Your surfaces'}</small></button>)}</div>}
  </div>
  <div className="room-copy">{!active?<><p className="eyebrow">EON Coatings / Abu Dhabi, UAE</p><h1>Life,<br/><em>well kept.</em></h1><p className="room-description">It starts with cleaner AC ducts.<br/>And care for the whole room.</p><Link href="/contact-us/?service=ac-duct-cleaning" className="room-cta">Book AC duct cleaning <span>↗</span></Link><p className="room-instruction">Choose a detail. See what’s beneath.</p></>:<div className="room-detail"><h1 className="sr-only">Life, well kept.</h1><button ref={backButton} className="back-overview" onClick={back}>← Back to the room</button><p className="eyebrow">{d!.label}</p><h2>{d!.title}</h2><p>{d!.copy}</p><nav aria-label={`${active} services`}>{d!.links.map(([label,slug])=><Link key={slug} href={`/services/${slug}/`}>{label}<span>↗</span></Link>)}</nav><Link className="room-cta" href={`/contact-us/${active==='air'?'?service=ac-duct-cleaning':''}`}>{active==='air'?'Book AC duct cleaning':'Discuss your space'} <span>↗</span></Link></div>}</div>
  <div className="room-bar"><nav aria-label="Explore by material">{order.map((m,i)=><button key={m} data-room-trigger={`nav-${m}`} ref={el=>{triggers.current[`nav-${m}`]=el}} aria-pressed={active===m} onClick={e=>select(m,e.currentTarget)}><small>0{i+1}</small>{m==='air'?'AC care':m==='fabric'?'Fabric':'Surfaces'}<span>↗</span></button>)}</nav><a href="#services">Scroll to discover EON Coatings <span>↓</span></a></div>
  <span className="sr-only" role="status">{active?`${d!.label} selected. Service information is available.`:'Room overview'}</span>
 </section>
}
