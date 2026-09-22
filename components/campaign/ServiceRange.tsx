'use client';
import {useState,useEffect,useRef} from 'react';
import Link from '@/components/eon/PageLink';
import {services} from '@/lib/eon/services';
import {collectionPhotos} from '@/lib/eon/photo-placements';
const options=[
 {...services[0],photo:services[0].image},
 {slug:'office-ac-duct-care',title:'Office AC Care',short:'Duct cleaning and optional treatment planned around office access, occupied areas and building management.',label:'Office & commercial AC care',photo:'unique-care/office-air.webp'},
 ...services.slice(1).map((service,i)=>({...service,photo:collectionPhotos[i+1]}))
];
export default function ServiceRange(){
 const [selected,setSelected]=useState(0),[remaining,setRemaining]=useState(10),[paused,setPaused]=useState(false),[inView,setInView]=useState(false);
 const selectorRef=useRef<HTMLElement>(null);
 useEffect(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)setPaused(true)},[]);
 useEffect(()=>{const el=selectorRef.current;if(!el)return;const observer=new IntersectionObserver(([entry])=>setInView(entry.isIntersecting&&entry.intersectionRatio>=.15),{threshold:.15});observer.observe(el);return()=>observer.disconnect()},[]);
 useEffect(()=>{if(paused||!inView)return;const timer=setInterval(()=>{if(!document.hidden)setRemaining(v=>Math.max(0,v-.25))},250);return()=>clearInterval(timer)},[paused,inView]);
 useEffect(()=>{if(remaining<=0){setSelected(i=>(i+1)%options.length);setRemaining(10)}},[remaining]);
 const chooseService=(i:number)=>{setSelected(i);setRemaining(10);setPaused(true)};
 const service=options[selected];
 return <div className="care-editorial">
  <section ref={selectorRef} className="care-section care-range" aria-labelledby="care-range-title"><div className="care-range-heading"><div><p className="eyebrow">Our services</p><h2 id="care-range-title">Services for your<br/>property.</h2></div><p>Explore cleaning and coating services for your systems, furniture and surfaces.</p></div>
   <div className="care-selector"><div className="care-service-options" role="group" aria-label="Choose a service">{options.map((s,i)=><button key={s.slug} aria-pressed={selected===i} aria-controls="care-selected-service" onClick={()=>chooseService(i)}><span className="care-option-number">0{i+1}</span><span>{s.title}</span><span className="care-countdown" aria-hidden="true"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15"/><circle className="care-countdown-progress" cx="18" cy="18" r="15" pathLength="100" style={{strokeDashoffset:selected===i?100-(remaining/10*100):100}}/></svg></span></button>)}</div>
    <div id="care-selected-service" className="care-selected-service" aria-live="polite"><div className="care-service-photo">{options.map((s,i)=><img key={s.slug} src={`/images/${s.photo}`} alt={i===selected?s.title:''} aria-hidden={i!==selected} className={i===selected?'is-current':''} width="1100" height="800" loading="lazy"/>)}</div><div className="care-service-description" key={service.slug}><span className="eyebrow">{service.label}</span><h3>{service.title}</h3><p>{service.short}</p><Link className="care-link" href={`/services/${service.slug}/`}>View service <span aria-hidden="true">›</span></Link></div></div>
   </div>
   <button className="care-rotation-toggle" aria-pressed={paused} onClick={()=>setPaused(v=>!v)}>{paused?'Play automatic rotation':'Pause automatic rotation'}</button>
  </section>
 </div>;
}
