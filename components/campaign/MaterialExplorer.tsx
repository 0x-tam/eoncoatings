'use client';
import {useRef,useState,useEffect} from 'react';
import Link from 'next/link';
type Material='air'|'fabric'|'stone';
const order:Material[]=['air','fabric','stone'];
const details={
 air:{title:'Start with the air.',label:'AC duct cleaning',copy:'A clean-looking room can hide dust inside its ductwork. Explore EON’s AC duct cleaning, sanitisation and specialist coating services.',image:'duct',caption:'Illustrative duct inspection. Conditions vary by system.',links:[['AC duct cleaning & sanitisation','ac-duct-mold-resistant-coating']]},
 fabric:{title:'Get closer to comfort.',label:'Sofas & soft furnishings',copy:'A closer look at the fabric you live with. Discover deep cleaning, sanitisation and stain-resistant protection for your furnishings.',image:'fabric',caption:'Magnification is illustrative, not a sample from this room.',links:[['Carpet & furniture deep cleaning','deep-cleaning-of-carpets-furniture'],['Stain-resistant furniture coating','stain-resistant-furniture-coating'],['Mattress cleaning & sanitisation','mattress-cleaning-and-sanitization']]},
 stone:{title:'Care for every surface.',label:'Stone & shared surfaces',copy:'Everyday contact leaves its mark. Find the right care for natural stone and the surfaces your household touches.',image:'stone',caption:'Illustrative surface detail. Treatment depends on the material.',links:[['Marble protective coatings','marble-protective-coatings'],['Anti-microbial surface coating','antimicrobial-surface-coating']]}
};
const points:Record<Material,[number,number]>={air:[.674,.095],fabric:[.88,.76],stone:[.515,.79]};
export default function MaterialExplorer(){
 const [active,setActive]=useState<Material|null>(null),[ready,setReady]=useState(false),[failed,setFailed]=useState(false),[micro,setMicro]=useState(false);
 const field=useRef<HTMLDivElement>(null),backButton=useRef<HTMLButtonElement>(null),lastTrigger=useRef<string>('nav-air'),triggers=useRef<Record<string,HTMLButtonElement|null>>({});
 const [box,setBox]=useState({w:1440,h:810});
 useEffect(()=>{const el=field.current;if(!el)return;const update=()=>setBox({w:el.clientWidth,h:el.clientHeight});const observer=new ResizeObserver(update);observer.observe(el);update();return()=>observer.disconnect()},[]);
 useEffect(()=>{let cancelled=false;Promise.all(['room','air-tile','fabric-tile','stone-tile'].map(name=>{const image=new Image();image.src=`/images/continuous-zoom/${name}.webp`;return image.decode()})).then(()=>{if(!cancelled)setReady(true)}).catch(()=>{if(!cancelled){setFailed(true);setReady(true)}});return()=>{cancelled=true}},[]);
 useEffect(()=>setMicro(false),[active]);
 const scale=Math.max(box.w/1672,box.h/941),imageW=1672*scale,imageH=941*scale,left=(box.w-imageW)/2;
 const sourcePoint=(m:Material)=>({x:left+points[m][0]*imageW,y:points[m][1]*imageH});
 const position=(m:Material)=>{const p=sourcePoint(m);return{x:Math.max(30,Math.min(box.w-30,p.x)),y:Math.max(30,Math.min(box.h-30,p.y))}};
 const focus=active?sourcePoint(active):null,z=active==='air'?12:active==='stone'?4.4:3.8;
 const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
 const targetX=box.w*(box.w<=600?.5:.70);
 const dx=focus?clamp(targetX-focus.x*z,box.w-(left+imageW)*z,-left*z):0;
 const dy=focus?clamp(box.h*.5-focus.y*z,box.h-imageH*z,0):0;
 function select(m:Material,trigger:HTMLButtonElement){lastTrigger.current=trigger.dataset.roomTrigger||`nav-${m}`;setActive(m);requestAnimationFrame(()=>backButton.current?.focus({preventScroll:true}));}
 function back(){setActive(null);requestAnimationFrame(()=>triggers.current[lastTrigger.current]?.focus({preventScroll:true}));}
 const d=active?details[active]:null;
 return <section className="room-hero" data-material={active||'overview'} aria-label="Explore EON care in a real room">
  <div className="room-image-field" ref={field}>
   <div className="room-master continuous-camera" style={{transform:focus?`translate(${dx}px,${dy}px) scale(${z})`:'translate(0px,0px) scale(1)',transformOrigin:'0 0'}}>
    <div className="room-raster">
     <img className="room-base" src="/images/continuous-zoom/room.webp" width="1672" height="941" fetchPriority="high" alt="Sunlit room with an open AC inspection section, cobalt L-shaped sofa and stone table"/>
     <img onError={e=>{e.currentTarget.style.visibility='hidden';setFailed(true)}} className="registered-tile tile-air" src="/images/continuous-zoom/air-tile.webp" style={{left:`${976/1672*100}%`,top:`${44/941*100}%`,width:`${303/1672*100}%`,height:`${103/941*100}%`}} alt="" aria-hidden="true"/>
     <img onError={e=>{e.currentTarget.style.visibility='hidden';setFailed(true)}} className="registered-tile tile-fabric" src="/images/continuous-zoom/fabric-tile.webp" style={{left:`${1160/1672*100}%`,top:`${580/941*100}%`,width:`${512/1672*100}%`,height:`${325/941*100}%`}} alt="" aria-hidden="true"/>
     <img onError={e=>{e.currentTarget.style.visibility='hidden';setFailed(true)}} className="registered-tile tile-stone" src="/images/continuous-zoom/stone-tile.webp" style={{left:`${610/1672*100}%`,top:`${635/941*100}%`,width:`${490/1672*100}%`,height:`${200/941*100}%`}} alt="" aria-hidden="true"/>
    </div>
   </div>
   {active&&<div className="room-overlays">
    {active==='fabric'&&ready&&<button className={`micro-study ${micro?'is-expanded':''}`} onClick={()=>setMicro(!micro)} aria-expanded={micro} aria-label={micro?'Return to fabric detail':'Enlarge illustrative microscopic view'}><img src="/images/room/microbes.webp" width="1024" height="1024" alt="Illustrative magnification of microorganisms among blue textile fibers, not a diagnostic sample"/><span>Illustrative magnification <b>{micro?'−':'+'}</b></span></button>}
    <p className="inspection-caption">{d!.caption}</p>
   </div>}
   {failed&&<p className="room-image-error">Some fine detail could not load. The room and service information remain available.</p>}
   {!active&&<div className="room-points">{order.map(m=><button key={m} disabled={!ready} data-room-trigger={`point-${m}`} ref={el=>{triggers.current[`point-${m}`]=el}} style={{left:position(m).x,top:position(m).y}} className={`room-point room-point-${m}`} onClick={e=>select(m,e.currentTarget)} aria-label={`Explore ${m==='air'?'AC duct cleaning':m==='fabric'?'sofa fabric':'stone surfaces'}`}><span>+</span><small>{m==='air'?'Inside your AC':m==='fabric'?'Your sofa':'Your surfaces'}</small></button>)}</div>}
  </div>
  <div className="room-copy">{!active?<><p className="eyebrow">EON Coatings / Abu Dhabi, UAE</p><h1>Life,<br/><em>well kept.</em></h1><p className="room-description">It starts with cleaner AC ducts.<br/>And care for the whole room.</p><Link href="/contact-us/?service=ac-duct-cleaning" className="room-cta">Book AC duct cleaning <span>↗</span></Link><p className="room-instruction">Choose a detail. See what’s beneath.</p></>:<div className="room-detail"><h1 className="sr-only">Life, well kept.</h1><button ref={backButton} className="back-overview" onClick={back}>← Back to the room</button><p className="eyebrow">{d!.label}</p><h2>{d!.title}</h2><p>{d!.copy}</p><nav aria-label={`${active} services`}>{d!.links.map(([label,slug])=><Link key={slug} href={`/services/${slug}/`}>{label}<span>↗</span></Link>)}</nav><Link className="room-cta" href={`/contact-us/${active==='air'?'?service=ac-duct-cleaning':''}`}>{active==='air'?'Book AC duct cleaning':'Discuss your space'} <span>↗</span></Link></div>}</div>
  <div className="room-bar"><nav aria-label="Explore by material">{order.map((m,i)=><button key={m} disabled={!ready} data-room-trigger={`nav-${m}`} ref={el=>{triggers.current[`nav-${m}`]=el}} aria-pressed={active===m} onClick={e=>select(m,e.currentTarget)}><small>0{i+1}</small>{m==='air'?'AC care':m==='fabric'?'Fabric':'Surfaces'}<span>↗</span></button>)}</nav><a href="#services">Scroll to discover EON Coatings <span>↓</span></a></div>
  <span className="sr-only" role="status">{active?`${d!.label} selected. Service information is available.`:'Room overview'}</span>
 </section>
}
