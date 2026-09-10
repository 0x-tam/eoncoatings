'use client';
import {useEffect} from 'react';
// Local, inspectable lab measurements. No analytics collection or network transmission.
export default function PerformanceProbe(){useEffect(()=>{
 const metrics={lcp:0,cls:0,longTasks:0,maxLongTask:0,transfer:0,fcp:0,clickFrame:0};
 const publish=()=>{metrics.transfer=performance.getEntriesByType('resource').reduce((sum,e)=>sum+(e as PerformanceResourceTiming).transferSize,0);metrics.fcp=performance.getEntriesByName('first-contentful-paint')[0]?.startTime||0;document.documentElement.dataset.labMetrics=JSON.stringify(metrics);};
 const observers:PerformanceObserver[]=[];
 for(const type of ['largest-contentful-paint','layout-shift','longtask']){try{const o=new PerformanceObserver(list=>{for(const entry of list.getEntries()){if(type==='largest-contentful-paint')metrics.lcp=entry.startTime;if(type==='layout-shift'&&!(entry as PerformanceEntry & {hadRecentInput:boolean}).hadRecentInput)metrics.cls+=(entry as PerformanceEntry & {value:number}).value;if(type==='longtask'){metrics.longTasks++;metrics.maxLongTask=Math.max(metrics.maxLongTask,entry.duration);}}publish();});o.observe({type,buffered:true});observers.push(o);}catch{}}
 const click=()=>{const start=performance.now();requestAnimationFrame(()=>{metrics.clickFrame=performance.now()-start;publish();});};document.addEventListener('click',click);const timeout=setTimeout(publish,3000);publish();return()=>{observers.forEach(o=>o.disconnect());clearTimeout(timeout);document.removeEventListener('click',click);};
 },[]);return null;}
