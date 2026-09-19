'use client';
import Link from '@/components/eon/PageLink';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { chapters, clamp, storyState } from '@/lib/eon/story-state';

export default function DuctStory(){
 const lastChapter=useRef(-1);
 const section=useRef<HTMLElement>(null),host=useRef<HTMLDivElement>(null),controller=useRef<{update:(p:number,active?:boolean)=>void;dispose:()=>void;loseContext?:()=>void}|null>(null);
 const [chapter,setChapter]=useState(0),[progress,setProgress]=useState(0),[light,setLight]=useState(false);
 const nativeLight=useSyncExternalStore((notify)=>{const m=matchMedia('(prefers-reduced-motion: reduce)');m.addEventListener('change',notify);return()=>m.removeEventListener('change',notify);},()=>matchMedia('(prefers-reduced-motion: reduce)').matches||Boolean((navigator as Navigator & {connection?:{saveData?:boolean}}).connection?.saveData),()=>false);
 const lighter=light||nativeLight;
 useEffect(()=>{
  if(lighter)return;
  let cancelled=false,raf=0,top=0,travel=1;
  const measure=()=>{if(!section.current)return;top=section.current.getBoundingClientRect().top+window.scrollY;travel=section.current.offsetHeight-window.innerHeight;update();};
  const update=()=>{raf=0;const p=clamp((window.scrollY-top)/Math.max(travel,1));controller.current?.update(p,window.scrollY<top+travel+window.innerHeight&&window.scrollY+window.innerHeight>top);setProgress(Math.round(p*100));const next=storyState(p).chapter;if(next!==lastChapter.current){lastChapter.current=next;setChapter(next);}};
  const scroll=()=>{if(!raf)raf=requestAnimationFrame(update);};
  import('@/lib/eon/duct-renderer').then(({mountDuct})=>{if(cancelled||!host.current)return;try{controller.current=mountDuct(host.current,()=>setLight(true));measure();}catch{setLight(true);}}).catch(()=>setLight(true));
  window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',measure);window.addEventListener('pageshow',measure);document.fonts.ready.then(measure);measure();
  return()=>{cancelled=true;cancelAnimationFrame(raf);controller.current?.dispose();controller.current=null;window.removeEventListener('scroll',scroll);window.removeEventListener('resize',measure);window.removeEventListener('pageshow',measure);};
 },[lighter]);
 function jump(i:number){if(!section.current)return;const top=section.current.getBoundingClientRect().top+window.scrollY;history.replaceState(null,'',`#${chapters[i].id}`);window.scrollTo({top:top+chapters[i].p*(section.current.offsetHeight-window.innerHeight),behavior:'instant'});}
 useEffect(()=>{const hash=location.hash.slice(1);const i=chapters.findIndex(c=>c.id===hash);if(i>0&&!light)requestAnimationFrame(()=>jump(i));},[lighter]);
 return <section ref={section} className={`duct-story ${lighter?'light-story':''}`} aria-label="Inside the air">
  <div className="story-stage" data-chapter={chapter}>
   <div className="story-copy"><Link prefetch={false} className="study-back" href="/service/">← All services</Link><p className="eyebrow">Eon Coatings / An interactive material study</p><h1 className={chapter===0?'':'sr-only'}>Inside<br/> <em>the air.</em></h1>{chapter!==0&&<h2>{chapters[chapter].title}</h2>}<p className="story-description">{chapters[chapter].copy}</p><Link prefetch={false} className="text-link" href="/contact-us/">Book a free consultation <span aria-hidden="true">›</span></Link></div>
   <div className="model-region"><picture><source media="(max-width:650px)" srcSet={`/model/${chapter===0||chapter===4?'assembled':chapter===1?'dirty':chapter===2?'cleaning':'clean'}-mobile.webp`}/><img className="model-poster" src={`/model/${chapter===0||chapter===4?'assembled':chapter===1?'dirty':chapter===2?'cleaning':'clean'}.webp`} alt="Illustrative rectangular sheet-metal AC duct" width="950" height="675"/></picture><div className="duct-canvas" ref={host}/></div><p className="active-chapter-mobile">0{chapter+1} / {chapters[chapter].label}</p><p className="model-caption">Illustrative duct cutaway <span>Not a recorded service result</span></p>
   <div className="study-slider"><label htmlFor="duct-progress">Explore the cutaway <span>{progress}%</span></label><input id="duct-progress" type="range" min="0" max="100" value={progress} onChange={e=>{if(section.current){const top=section.current.getBoundingClientRect().top+window.scrollY;window.scrollTo({top:top+Number(e.target.value)/100*(section.current.offsetHeight-window.innerHeight),behavior:'instant'});}}}/></div><div className="story-bottom"><div className="story-cue">Scroll to look inside <span aria-hidden="true">↓</span></div><nav className="chapter-nav" aria-label="Duct story chapters">{chapters.map((c,i)=><button key={c.id} onClick={()=>jump(i)} aria-label={`Chapter ${i+1}: ${c.label}`} aria-current={chapter===i?'step':undefined}><span>0{i+1}</span><span className="chapter-label">{c.label}</span></button>)}</nav><Link prefetch={false} href="#spaces" className="skip-story">Skip the 3D story</Link></div>
   <button className="light-toggle" disabled={nativeLight} onClick={()=>{const y=(section.current?.getBoundingClientRect().top||0)+window.scrollY;setLight(!light);setChapter(0);requestAnimationFrame(()=>window.scrollTo({top:y}));}}>{lighter?'Enable 3D story':'Use lighter view'}</button>
  </div>
  <noscript><style>{`.air-study .duct-story{height:auto}.air-study .story-stage{position:relative;top:0}.air-study .study-slider{display:none}.static-sequence{display:block}.chapter-nav,.story-cue,.light-toggle{display:none}`}</style></noscript><div className="static-sequence">{chapters.slice(1).map((c,i)=><section key={c.id}><img src={`/model/${i===0?'dirty':i===1?'cleaning':i===2?'clean':'reassembled'}.webp`} alt="Illustrative cutaway of the same duct" width="1200" height="1000"/><div><p className="eyebrow">0{i+2} / {c.label}</p><h2>{c.title}</h2><p>{c.copy}</p></div></section>)}</div>
 </section>;
}
