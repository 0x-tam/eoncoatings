export const chapters = [
  { id: 'outside', p: 0, label: 'The outside', title: 'A closer look at your air.', copy: 'AC duct cleaning and sanitisation in Abu Dhabi and across the UAE.' },
  { id: 'inside', p: .35, label: 'Look inside', title: 'Beyond the grille.', copy: 'Dust can settle on internal surfaces. The visible vent is only one part of the system.' },
  { id: 'cleaning', p: .55, label: 'The cleaning', title: 'Removing settled dust.', copy: 'This cutaway illustrates the removal of settled dust from the inside of a duct.' },
  { id: 'clean', p: .73, label: 'The difference', title: 'The same metal. A clearer view.', copy: 'Cleaning removes deposits. Sanitisation and optional mold-resistant coating are separate considerations.' },
  { id: 'complete', p: 1, label: 'Your space', title: 'Back to the spaces that matter.', copy: 'Talk to us about the right service for your home or facility.' },
] as const;
export const clamp = (x:number) => Math.max(0, Math.min(1,x));
const smooth = (x:number) => { const t=clamp(x); return t*t*(3-2*t); };
export function storyState(progress:number) {
 const p=clamp(progress);
 const open=smooth((p-.14)/.16)*(1-smooth((p-.79)/.13));
 const hatch=smooth((p-.12)/.12)*(1-smooth((p-.84)/.08));
 return { p, open, hatch, cleaning: smooth((p-.44)/.22), chapter: p<.19?0:p<.44?1:p<.66?2:p<.86?3:4, orbit: Math.sin(p*Math.PI)*.12 };
}
