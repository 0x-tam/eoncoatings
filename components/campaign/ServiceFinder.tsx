'use client';
export default function ServiceFinder(){return <button className="finder-inline-launch" onClick={()=>window.dispatchEvent(new Event('eon:finder'))}><span>Not sure which service fits?</span><strong>Find my service</strong></button>}
