'use client';
import SpacesGallery from './SpacesGallery';
import {collectionPhotos} from '@/lib/eon/photo-placements';
import {useState,useEffect,useRef} from 'react';
import Link from '@/components/eon/PageLink';
import {services} from '@/lib/eon/services';
import {HGPPCertificate} from '@/components/eon/CompanyPages';
export default function HomeCare(){
 const [selected,setSelected]=useState(0),[remaining,setRemaining]=useState(10),[paused,setPaused]=useState(false),[inView,setInView]=useState(false);
 const selectorRef=useRef<HTMLElement>(null);
 useEffect(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)setPaused(true)},[]);
 useEffect(()=>{const el=selectorRef.current;if(!el)return;const observer=new IntersectionObserver(([entry])=>setInView(entry.isIntersecting&&entry.intersectionRatio>=.15),{threshold:.15});observer.observe(el);return()=>observer.disconnect()},[]);
 useEffect(()=>{if(paused||!inView)return;const timer=setInterval(()=>{if(!document.hidden)setRemaining(v=>Math.max(0,v-.25))},250);return()=>clearInterval(timer)},[paused,inView]);
 useEffect(()=>{if(remaining<=0){setSelected(i=>(i+1)%services.length);setRemaining(10)}},[remaining]);
 const chooseService=(i:number)=>{setSelected(i);setRemaining(10);setPaused(true)};
 const service=services[selected];
 return <div className="care-editorial">
  <section id="services" className="care-section care-air">
   <div className="care-section-intro"><p className="eyebrow">Cleaning &amp; protective coatings</p><h2>AC cleaning and<br/>surface protection.</h2></div>
   <div className="care-air-layout"><figure><img src="/images/unique-care/home-air.webp" alt="A fitted air-conditioning grille in a bright interior" width="1100" height="800" loading="lazy"/><figcaption>AC care for homes and workplaces</figcaption></figure><div className="care-air-copy"><p className="eyebrow">01 / AC care</p><h3>AC duct cleaning<br/>and treatment.</h3><p>Dust and debris can build up out of sight. We clean AC ducts and help you choose suitable sanitisation and mold-resistant protection.</p><div className="care-air-steps"><span><b>01</b> Clean away buildup</span><span><b>02</b> Discuss sanitisation</span><span><b>03</b> Protect suitable ductwork</span></div><Link href="/services/ac-duct-mold-resistant-coating/" className="care-link">Explore AC care <span aria-hidden="true">›</span></Link></div></div>
  </section>
  <section ref={selectorRef} className="care-section care-range" aria-labelledby="care-range-title"><div className="care-range-heading"><div><p className="eyebrow">Our services</p><h2 id="care-range-title">Services for your<br/>property.</h2></div><p>Explore cleaning and coating services for your systems, furniture and surfaces.</p></div>
   <div className="care-selector"><div className="care-service-options" role="group" aria-label="Choose a service">{services.map((s,i)=><button key={s.slug} aria-pressed={selected===i} aria-controls="care-selected-service" onClick={()=>chooseService(i)}><span className="care-option-number">0{i+1}</span><span>{s.title}</span><span className="care-countdown" aria-hidden="true"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15"/><circle className="care-countdown-progress" cx="18" cy="18" r="15" pathLength="100" style={{strokeDashoffset:selected===i?100-(remaining/10*100):100}}/></svg></span></button>)}</div>
    <div id="care-selected-service" className="care-selected-service" aria-live="polite"><div className="care-service-photo">{services.map((s,i)=><img key={s.slug} src={`/images/${collectionPhotos[i]}`} alt={i===selected?s.title:''} aria-hidden={i!==selected} className={i===selected?'is-current':''} width="1100" height="800" loading="lazy"/>)}</div><div className="care-service-description" key={service.slug}><span className="eyebrow">{service.label}</span><h3>{service.title}</h3><p>{service.short}</p><Link className="care-link" href={`/services/${service.slug}/`}>View service <span aria-hidden="true">›</span></Link></div></div>
   </div>
   <button className="care-rotation-toggle" aria-pressed={paused} onClick={()=>setPaused(v=>!v)}>{paused?'Play automatic rotation':'Pause automatic rotation'}</button>
  </section>
  <section id="why-eon" className="care-section care-reasons" aria-labelledby="care-reasons-title"><div className="care-range-heading"><div><p className="eyebrow">What sets us apart</p><h2 id="care-reasons-title">Why choose us?</h2></div><p>Professional care, from choosing the treatment to looking after your space afterwards.</p></div><div className="care-reasons-grid">{[
   ['Certified and tested coatings','Coatings selected for the surface and the job, with product testing and certification explained before treatment.'],
   ['Professional service teams','Specialist teams for AC care, deep cleaning and protective coating application.'],
   ['Care for people and pets','Confirm product suitability, preparation and when children and pets can return to the treated space.'],
   ['After-sales support','Practical guidance on caring for treated surfaces, with support after the work is complete.']
  ].map(([title,copy],i)=><article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
  <section className="care-proof"><div className="care-proof-inner"><div className="care-proof-copy"><p className="eyebrow">Our difference</p><span className="care-hgpp-word">HGPP</span><h2>Certification for<br/>treated premises.</h2><p>The HealthGuard Protection Program gives qualifying treated premises a conformity certificate to display.</p><p>Certification records the qualifying treatment and premises. We explain the coverage, validity and maintenance requirements.</p><Link href="/hgpp-certification/" className="button">Explore HGPP certification <span aria-hidden="true">›</span></Link></div><HGPPCertificate/></div></section>
  <section className="care-section care-spaces" id="spaces-we-care-for" aria-labelledby="home-spaces-title"><div className="care-range-heading"><div><p className="eyebrow">Homes &amp; commercial properties</p><h2 id="home-spaces-title">Properties we service.</h2></div><p>Explore the spaces we care for.</p></div><SpacesGallery/></section>
  <section className="care-section care-next"><div><p className="eyebrow">Service enquiries</p><h2>Find the service<br/>you need.</h2><p>Start with a few simple questions about your space. We’ll help you find the relevant services.</p><button className="button" onClick={()=>window.dispatchEvent(new Event('eon:finder'))}>Find my service <span aria-hidden="true">›</span></button><Link href="/contact-us/" className="care-secondary">Already know what you need? Contact us</Link></div><div className="care-next-details"><ol><li><span>01</span><div><h3>Choose a service</h3><p>Tell us about the system, material or room.</p></div></li><li><span>02</span><div><h3>Talk through the details</h3><p>Share its condition, your location and what you want to address.</p></div></li><li><span>03</span><div><h3>Plan the work</h3><p>Confirm the service, timing and aftercare with us.</p></div></li></ol><details><summary>Cleaning or coating?</summary><p>Cleaning removes accumulated dirt. Sanitisation and protective coatings have different purposes. The right approach depends on the material and its condition.</p></details><details><summary>More than one service?</summary><p>Yes. Share everything that needs attention so we can discuss the requirements together.</p></details></div></section>
 </div>
}
