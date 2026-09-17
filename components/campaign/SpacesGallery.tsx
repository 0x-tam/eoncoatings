'use client';
import {useState,useEffect,useRef} from 'react';
import Link from '@/components/eon/PageLink';
import {spaces} from '@/lib/eon/spaces';
const gallery=[
 {id:'homes',label:'Homes',image:'unique-care/home-spaces.webp',alt:'A warm living room opening onto a home workspace',href:'/service/',action:'Explore care for homes'},
 ...spaces.map(s=>({id:s.slug,label:s.slug==='healthcare'?'Healthcare':s.slug==='education'?'Schools':s.slug==='hospitality'?'Hotels':s.title,image:s.image,alt:`${s.title} interior`,href:`/industries/${s.slug}/`,action:`Explore care for ${s.slug==='healthcare'?'healthcare spaces':s.slug==='education'?'schools':s.slug==='hospitality'?'hotels':'offices'}`}))
];
export default function SpacesGallery(){
 const [selected,setSelected]=useState(0),[paused,setPaused]=useState(false),[inView,setInView]=useState(false);
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)setPaused(true);const el=root.current;if(!el)return;const observer=new IntersectionObserver(([entry])=>setInView(entry.isIntersecting),{threshold:.25});observer.observe(el);return()=>observer.disconnect()},[]);
 useEffect(()=>{if(paused||!inView)return;const timer=setInterval(()=>{if(!document.hidden)setSelected(i=>(i+1)%gallery.length)},10000);return()=>clearInterval(timer)},[paused,inView,selected]);
 const current=gallery[selected];
 return <div className="spaces-photo-gallery" ref={root}>
  <div className="spaces-photo-stage" id="spaces-photo-stage">
   {gallery.map((item,i)=><img key={item.id} src={`/images/${item.image}`} alt={i===selected?item.alt:''} aria-hidden={i!==selected} className={i===selected?'is-selected':''} width="1536" height="1024" loading="lazy"/>)}
   <div className="spaces-photo-caption"><h3>{current.label}</h3><Link href={current.href} className="spaces-photo-link">{current.action}<span aria-hidden="true">›</span></Link></div>
  </div>
  <div className="spaces-photo-controls" role="group" aria-label="Browse spaces">{gallery.map((item,i)=><button type="button" key={item.id} aria-pressed={selected===i} aria-controls="spaces-photo-stage" onClick={()=>{setSelected(i);setPaused(true)}}>{item.label}</button>)}</div>
  <button type="button" className="spaces-rotation-toggle" aria-pressed={paused} onClick={()=>setPaused(v=>!v)}>{paused?'Play gallery':'Pause gallery'}</button>
 </div>
}
