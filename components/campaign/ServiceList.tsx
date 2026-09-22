'use client';
import Link from '@/components/eon/PageLink';
import {Fragment,useState} from 'react';
import type {CSSProperties} from 'react';
import {services} from '@/lib/eon/services';
const categories=[
 {id:'air',title:'AC care',image:'unique-care/index-air.webp',alt:'Ceiling AC grille in a bright interior',items:[0]},
 {id:'fabric',title:'Fabrics & furniture',image:'unique-care/index-fabric.webp',alt:'Upholstered armchair with textured fabric',items:[4,2,5]},
 {id:'surface',title:'Surfaces & coatings',image:'unique-care/index-marble.webp',alt:'Natural marble countertop and basin',items:[3,1,6]}
];
export default function ServiceList(){
 const [selected,setSelected]=useState('air');
 return <div className="care-category-browser" id="care-categories">{categories.map((category,index)=>{const active=selected===category.id;return <Fragment key={category.id}>
 <button type="button" id={`category-${category.id}`} className="care-category-choice" style={{'--category-order':index*2} as CSSProperties} aria-expanded={active} aria-controls={`category-services-${category.id}`} onClick={()=>setSelected(active?'':category.id)}>
  <img src={`/images/${category.image}`} alt={category.alt} width="1100" height="800"/>
  <span className="care-category-label"><strong>{category.title}</strong><span aria-hidden="true">{active?'−':'+'}</span></span>
 </button>
 <div hidden={!active} className="care-category-detail" id={`category-services-${category.id}`} role="region" aria-labelledby={`category-${category.id}`} style={{'--category-order':index*2+1} as CSSProperties}>
  <div className="care-category-service-list">{category.items.map(i=>{const s=services[i];return <Link href={`/services/${s.slug}/`} key={s.slug} className="care-category-service"><div><h2>{s.title}</h2><p>{s.short}</p></div><span className="care-category-action">View service <span aria-hidden="true">›</span></span></Link>})}{category.id==='air'&&<Link href="/services/office-ac-duct-care/" className="care-category-service"><div><h2>Office AC Care</h2><p>Duct cleaning and optional treatment planned around office access, occupied areas and building management.</p></div><span className="care-category-action">View service ›</span></Link>}</div>
 </div>
 </Fragment>})}</div>
}
