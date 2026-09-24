'use client';

import {useEffect, useRef, useState} from 'react';
import Link from '@/components/eon/PageLink';
import PhotographicCamera from './PhotographicCamera';
import {materialTraces} from './materialTraces';
import './material-explorer.css';

type Material = 'air' | 'fabric' | 'stone';
const order: Material[] = ['air','stone','fabric'];
const scenes = {
 air:{label:'AC care',title:'AC duct cleaning and treatment.',copy:'Cleaning, sanitisation and mold-resistant protection for suitable ductwork.',image:'/images/continuous-zoom/duct-internal-v2.webp',alt:'Interior of an air conditioning duct',origin:'70% 12%',points:[[23,30],[39,66],[73,36],[79,70]]},
 fabric:{label:'Fabrics',title:'Care for furniture and fabrics.',copy:'Deep cleaning and stain protection for furniture, carpets and mattresses.',image:'/images/continuous-zoom/fabric-green.webp',alt:'Close view of teal-green upholstery fabric',origin:'88% 76%',points:[[25,38],[64,28],[73,69]]},
 stone:{label:'Surfaces',title:'Marble and surface protection.',copy:'Protective treatments selected for your stone, finish and everyday use.',image:'/images/zoom-v4/stone-traces.webp',alt:'Close view of a natural stone surface',origin:'52% 79%',points:[[24,30],[38,70],[72,28],[78,66]]},
} as const;
const roomPoints={air:[69,12],fabric:[88,76],stone:[52,79]} as const;

export default function MaterialExplorer(){
 const [active,setActive]=useState<Material|null>(null);
 const [trace,setTrace]=useState(0);
 const [settled,setSettled]=useState(false);
 const [ready,setReady]=useState(false);
 const triggers=useRef<Partial<Record<Material,HTMLButtonElement|null>>>({});
 const backRef=useRef<HTMLButtonElement>(null);
 const visualRef=useRef<HTMLDivElement>(null);
 const [size,setSize]=useState({w:900,h:490});
 const noteRef=useRef<HTMLDivElement>(null);
 const [noteHeight,setNoteHeight]=useState(200);
 useEffect(()=>{const el=noteRef.current;if(!el)return;const observer=new ResizeObserver(()=>{if(el.offsetHeight)setNoteHeight(el.offsetHeight)});observer.observe(el);return()=>observer.disconnect()},[active]);
 useEffect(()=>{const el=visualRef.current;if(!el)return;const observer=new ResizeObserver(()=>setSize({w:el.clientWidth,h:el.clientHeight}));observer.observe(el);return()=>observer.disconnect()},[]);
 function point(m:Material){const scale=Math.max(size.w/1672,size.h/941);return {left:Math.max(24,Math.min(size.w-24,size.w-1672*scale+roomPoints[m][0]/100*1672*scale)),top:Math.max(24,Math.min(size.h-24,roomPoints[m][1]/100*941*scale))};}
 const last=useRef<Material>('air');
 const scene=active?scenes[active]:null;
 const items=active?materialTraces[active]:[];
 const note=items[trace]||items[0];
 // Keep annotations on the scene; place the card in the nearest clear space.
 const anchors=scene?scene.points.map(([x,y])=>({x:size.w*x/100,y:size.h*y/100})):[];
 const target=anchors[trace]||{x:0,y:0};
 const cardWidth=Math.min(280,size.w*.48);
 const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
 let card={x:12,y:12,score:Infinity};
 if(scene){
  const maxX=Math.max(12,size.w-cardWidth-12),maxY=Math.max(12,size.h-noteHeight-12);
  for(let col=0;col<=12;col++)for(let row=0;row<=8;row++){
   const x=12+(maxX-12)*col/12,y=12+(maxY-12)*row/8;
   const overlaps=anchors.filter(a=>a.x>x-34&&a.x<x+cardWidth+34&&a.y>y-34&&a.y<y+noteHeight+34).length;
   const distance=Math.hypot(target.x-clamp(target.x,x,x+cardWidth),target.y-clamp(target.y,y,y+noteHeight));
   const score=overlaps*100000+distance;
   if(score<card.score)card={x,y,score};
  }
 }
 const endpoint={x:clamp(target.x,card.x,card.x+cardWidth),y:clamp(target.y,card.y+10,card.y+noteHeight-10)};
 const lineLength=Math.hypot(endpoint.x-target.x,endpoint.y-target.y)||1;
 const lineStart={x:target.x+(endpoint.x-target.x)*22/lineLength,y:target.y+(endpoint.y-target.y)*22/lineLength};

 function select(material:Material){
  if(active===material)return;
  last.current=material;setSettled(false);setTrace(0);setActive(material);
  requestAnimationFrame(()=>backRef.current?.focus({preventScroll:true}));
 }
 function back(){setSettled(false);setActive(null);setTrace(0);requestAnimationFrame(()=>triggers.current[last.current]?.focus({preventScroll:true}));}
 return <section className="eon-explorer" data-scene={active||'overview'} aria-label="Explore our care in a real room">
  <div className="eon-explorer-main">
   <div className="eon-explorer-copy">
    <div className="eon-explorer-intro" hidden={!!active}>
     <p className="eon-explorer-eyebrow">Eon Coatings / Abu Dhabi, UAE</p>
     <h1>Cleaner air.<br/>Fresher fabrics.<br/>Protected surfaces.</h1>
     <p className="eon-explorer-description">AC cleaning, fabric care and protective coatings for villas, homes and workplaces.</p>
     <Link className="eon-explorer-cta" href="/service-finder/">Find my service <span aria-hidden="true">›</span></Link>
    </div>
    {scene&&note&&<div className="eon-explorer-detail">
     <button className="eon-explorer-back" ref={backRef} onClick={back}>← Back to the room</button>
     <p className="eon-explorer-eyebrow">{scene.label}</p>
     <h2>{scene.title}</h2>
     <p className="eon-explorer-description">{scene.copy}</p>
     <Link className="eon-explorer-cta" href="/service-finder/">Find my service <span aria-hidden="true">›</span></Link>
    </div>}
   </div>
   <div className="eon-explorer-visual">
    <div className="eon-explorer-stage" ref={visualRef}>
    <div className="eon-explorer-images">
     <img className="eon-explorer-room" src="/images/room/room-green.webp" alt="Sunlit villa living room with a ceiling AC grille, green sofa and stone table" width={1672} height={941} fetchPriority="high"/>
     <PhotographicCamera active={active} onReady={()=>setReady(true)} onSettled={()=>setSettled(true)} onError={()=>{setReady(true);setSettled(true)}}/>
    </div>
    {!active?<div className="eon-explorer-hotspots" style={{visibility:ready&&settled?'visible':'hidden'}}>{order.map(m=><button key={m} data-material={m} ref={el=>{triggers.current[m]=el}} style={point(m)} onClick={()=>select(m)} aria-label={`Explore ${scenes[m].label}`}><span aria-hidden="true">+</span></button>)}</div>:
     <div className="eon-explorer-markers" style={{visibility:settled?'visible':'hidden'}} key={active} aria-label={`${scene!.label} details`}>{items.map((item,i)=><button key={item.title} style={{left:anchors[i].x,top:anchors[i].y}} aria-controls="eon-active-note" aria-label={`Show ${item.title}`} aria-pressed={trace===i} onClick={()=>setTrace(i)}>{String(i+1).padStart(2,'0')}</button>)}</div>}
    {active&&settled&&<svg className="eon-explorer-connector" width={size.w} height={size.h} aria-hidden="true"><line x1={lineStart.x} y1={lineStart.y} x2={endpoint.x} y2={endpoint.y}/><circle cx={endpoint.x} cy={endpoint.y} r="3"/></svg>}
    </div>
    {active&&note&&<div id="eon-active-note" ref={noteRef} className="eon-explorer-note eon-explorer-floating-note" data-visible={settled} style={{left:card.x,top:card.y,width:cardWidth}} aria-live="polite" aria-atomic="true">
     <div className="eon-explorer-note-text" key={`${active}-${trace}`}>
      <span className="eon-explorer-counter">{String(trace+1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</span>
      <h3>{note.title}</h3><p>{note.copy}</p>
      <Link href={`/services/${note.slug}/`}>{note.service} <span aria-hidden="true">↗</span></Link>
     </div>
    </div>}
   </div>
  </div>
  <div className="eon-explorer-controls"><nav aria-label="Explore by material">{order.map((m,i)=><button key={m} onClick={()=>select(m)} aria-pressed={active===m}><span>0{i+1}</span>{scenes[m].label}<span aria-hidden="true">›</span></button>)}</nav></div>
 </section>;
}
