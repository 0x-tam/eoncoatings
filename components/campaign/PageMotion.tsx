'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
export default function PageMotion(){
 const pathname=usePathname();
 useEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const main=document.querySelector('main');
  const animation=main?.animate([{opacity:.65,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,easing:'cubic-bezier(.22,1,.36,1)'});
  return()=>animation?.cancel();
 },[pathname]);
 return null;
}
