'use client';
export default function FinderButton(){return <button className="button" data-finder-trigger onClick={()=>window.dispatchEvent(new Event('eon:finder'))}>Find my service <span aria-hidden="true">›</span></button>}
