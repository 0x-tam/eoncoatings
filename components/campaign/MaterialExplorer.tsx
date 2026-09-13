'use client';
import {useRef,useState,useEffect} from 'react';
import Link from 'next/link';
import PhotographicCamera from './PhotographicCamera';
type Material='air'|'fabric'|'stone';
const order:Material[]=['air','fabric','stone'];
const details={
 air:{title:'Start with the air.',label:'AC duct cleaning',copy:'Dust, debris and allergens can collect deep in ductwork. Moisture can support mold, fungi and bacteria. EON provides specialist cleaning, sanitisation and separate mold-resistant coating, tailored to your system.',image:'duct',caption:'Illustrative dust, moisture and mold-like growth. Actual conditions require inspection.',links:[['AC duct cleaning & sanitisation','ac-duct-mold-resistant-coating']]},
 fabric:{title:'Get closer to comfort.',label:'Sofas & soft furnishings',copy:'A closer look at the fabric you live with. Discover deep cleaning, sanitisation and stain-resistant protection for your furnishings.',image:'fabric',caption:'Magnification is illustrative, not a sample from this room.',links:[['Carpet & furniture deep cleaning','deep-cleaning-of-carpets-furniture'],['Stain-resistant furniture coating','stain-resistant-furniture-coating'],['Mattress cleaning & sanitisation','mattress-cleaning-and-sanitization']]},
 stone:{title:'Care for every surface.',label:'Stone & shared surfaces',copy:'Everyday contact leaves its mark. Find the right care for natural stone and the surfaces your household touches.',image:'stone',caption:'Illustrative surface detail. Treatment depends on the material.',links:[['Marble protective coatings','marble-protective-coatings'],['Anti-microbial surface coating','antimicrobial-surface-coating']]}
};
const points:Record<Material,[number,number]>={air:[.674,.095],fabric:[.88,.76],stone:[.515,.79]};
export default function MaterialExplorer(){
 const [target,setTarget]=useState<Material|null>(null),[active,setActive]=useState<Material|null>(null),[ready,setReady]=useState(false),[failed,setFailed]=useState(false),[micro,setMicro]=useState(false),[settled,setSettled]=useState(false);
 const field=useRef<HTMLDivElement>(null),backButton=useRef<HTMLButtonElement>(null),lastTrigger=useRef<string>('nav-air'),triggers=useRef<Record<string,HTMLButtonElement|null>>({});
 const restoreFocus=useRef(false);
 const [box,setBox]=useState({w:1440,h:810});
 useEffect(()=>{const el=field.current;if(!el)return;const update=()=>setBox({w:el.clientWidth,h:el.clientHeight});const observer=new ResizeObserver(update);observer.observe(el);update();return()=>observer.disconnect()},[]);
 useEffect(()=>setMicro(false),[active]);
 const scale=Math.max(box.w/1672,box.h/941),imageW=1672*scale,imageH=941*scale,left=(box.w-imageW)/2;
 const sourcePoint=(m:Material)=>({x:left+points[m][0]*imageW,y:points[m][1]*imageH});
 const position=(m:Material)=>{const p=sourcePoint(m);return{x:Math.max(30,Math.min(box.w-30,p.x)),y:Math.max(30,Math.min(box.h-30,p.y))}};
 function select(m:Material,trigger:HTMLButtonElement){if(target===m)return;restoreFocus.current=false;setSettled(false);lastTrigger.current=trigger.dataset.roomTrigger||`nav-${m}`;setActive(m);setTarget(m);requestAnimationFrame(()=>backButton.current?.focus({preventScroll:true}));}
 function back(){restoreFocus.current=true;setSettled(false);setTarget(null);}
 const d=active?details[active]:null;
 return <section className="room-hero" data-material={active||'overview'} data-settled={settled} aria-label="Explore EON care in a real room">
  <div className="room-image-field" ref={field}>
   <img className="camera-fallback" src="/images/room/room.webp" width="1672" height="941" fetchPriority="high" alt="" aria-hidden="true"/>
   <PhotographicCamera active={target} onReady={()=>{setReady(true);if(!active)setSettled(true)}} onSettled={()=>{setSettled(true);if(!target)setActive(null);if(!target&&restoreFocus.current){restoreFocus.current=false;requestAnimationFrame(()=>triggers.current[lastTrigger.current]?.focus({preventScroll:true}))}}} onError={()=>{setFailed(true);setReady(true)}}/>
   {active&&<div className="room-overlays">
    {settled&&<div className="material-observation">{active==='air'?'DUST / MOISTURE / MICROBIAL GROWTH':active==='fabric'?'FIBER DETAIL / Woven texture & embedded particles':'SURFACE DETAIL / Natural pores & fine grain'}</div>}
    {active==='fabric'&&ready&&settled&&<button className={`micro-study ${micro?'is-expanded':''}`} onClick={()=>setMicro(!micro)} aria-expanded={micro} aria-label={micro?'Return to fabric detail':'Enlarge illustrative microscopic view'}><img src="/images/room/microbes.webp" width="1024" height="1024" alt="Illustrative magnification of microorganisms among blue textile fibers, not a diagnostic sample"/><span>Illustrative magnification <b>{micro?'−':'+'}</b></span></button>}
    <p className="inspection-caption">{d!.caption}</p>
   </div>}
   {failed&&<p className="room-image-error">Some fine detail could not load. The room and service information remain available.</p>}
   {!active&&<div className="room-points" style={{visibility:settled?'visible':'hidden'}}>{order.map(m=><button key={m} disabled={!ready} data-room-trigger={`point-${m}`} ref={el=>{triggers.current[`point-${m}`]=el}} style={{left:position(m).x,top:position(m).y}} className={`room-point room-point-${m}`} onClick={e=>select(m,e.currentTarget)} aria-label={`Explore ${m==='air'?'AC duct cleaning':m==='fabric'?'sofa fabric':'stone surfaces'}`}><span>+</span><small>{m==='air'?'Inside your AC':m==='fabric'?'Your sofa':'Your surfaces'}</small></button>)}</div>}
  </div>
  <div className="room-copy">{!active?<><p className="eyebrow">EON Coatings / Abu Dhabi, UAE</p><h1>Life,<br/><em>well kept.</em></h1><p className="room-description">It starts with cleaner AC ducts.<br/>And care for the whole room.</p><Link href="/contact-us/?service=ac-duct-cleaning" className="room-cta">Book AC duct cleaning <span>↗</span></Link><p className="room-instruction">Choose a detail. See what’s beneath.</p></>:<div className="room-detail"><h1 className="sr-only">Life, well kept.</h1><button ref={backButton} className="back-overview" onClick={back}>← Back to the room</button><p className="eyebrow">{d!.label}</p><h2>{d!.title}</h2><p>{d!.copy}</p><nav aria-label={`${active} services`}>{d!.links.map(([label,slug])=><Link key={slug} href={`/services/${slug}/`}>{label}<span>↗</span></Link>)}</nav><Link className="room-cta" href={`/contact-us/${active==='air'?'?service=ac-duct-cleaning':''}`}>{active==='air'?'Book AC duct cleaning':'Discuss your space'} <span>↗</span></Link></div>}</div>
  <div className="room-bar"><nav aria-label="Explore by material">{order.map((m,i)=><button key={m} disabled={!ready} data-room-trigger={`nav-${m}`} ref={el=>{triggers.current[`nav-${m}`]=el}} aria-pressed={active===m} onClick={e=>select(m,e.currentTarget)}><small>0{i+1}</small>{m==='air'?'AC care':m==='fabric'?'Fabric':'Surfaces'}<span>↗</span></button>)}</nav><a href="#services">Scroll to discover EON Coatings <span>↓</span></a></div>
  <span className="sr-only" role="status">{active?`${d!.label} selected. Service information is available.`:'Room overview'}</span>
 </section>
}
