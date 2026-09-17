'use client';
import {useEffect,useRef,useState,type ReactNode} from 'react';
/** Retain the outgoing panel while its replacement fades in. */
export default function ScenePanel({scene,children}:{scene:string;children:ReactNode}){
 const last=useRef({scene,node:children});
 const [outgoing,setOutgoing]=useState<ReactNode>(null);
 useEffect(()=>{
  if(last.current.scene!==scene){setOutgoing(last.current.node);last.current={scene,node:children};const timer=setTimeout(()=>setOutgoing(null),620);return()=>clearTimeout(timer)}
  last.current.node=children;
 // The outgoing snapshot belongs to the previous scene, not later camera ticks.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[scene]);
 return <div className="scene-panel-stack">{outgoing&&<div className="scene-panel-outgoing" aria-hidden="true" inert>{outgoing}</div>}<div key={scene} className="scene-panel-incoming">{children}</div></div>
}
