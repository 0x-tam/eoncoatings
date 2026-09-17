export type Trace = {title:string; point:[number,number]; copy:string; service:string; slug:string};
export const materialTraces:Record<'stone'|'fabric'|'air',Trace[]> = {
 stone:[
  {title:'Beyond visible dirt',point:[855,674],copy:'Germs can remain on clean-looking surfaces. Protective coating adds care alongside regular cleaning.',service:'Explore surface protection',slug:'antimicrobial-surface-coating'},
  {title:'Within the pores',point:[945,725],copy:'Tiny openings in stone can hold dirt and spills. EON helps you choose protection suited to the finish.',service:'Explore stone protection',slug:'marble-protective-coatings'},
  {title:'Spills & fingerprints',point:[965,668],copy:'Drinks and oily fingerprints leave marks. Marble coating helps protect against future stains.',service:'Explore marble protection',slug:'marble-protective-coatings'},
  {title:'Frequently touched spots',point:[1005,695],copy:'Table edges and counters get touched throughout the day. Ask about germ-resistant protection for these spots.',service:'Explore surface protection',slug:'antimicrobial-surface-coating'}
 ],
 fabric:[
  {title:'Dust in the weave',point:[1395,715],copy:'Dust settles between threads and along seams. Deep cleaning lifts the dirt from everyday use.',service:'Explore deep cleaning',slug:'deep-cleaning-of-carpets-furniture'},
  {title:'Beyond visible dirt',point:[1460,700],copy:'Fabrics can hold allergens and germs you cannot see. Ask EON about deep cleaning and sanitisation.',service:'Explore upholstery care',slug:'deep-cleaning-of-carpets-furniture'},
  {title:'Spills & stains',point:[1478,760],copy:'Clean existing marks, then help protect the fabric against future spills with stain-resistant coating.',service:'Explore stain protection',slug:'stain-resistant-furniture-coating'}
 ],
 air:[
  {title:'Moisture & mold',point:[.16,.27],copy:'Damp ducts can encourage mold and bacteria. EON checks the condition before recommending treatment.',service:'Explore AC sanitisation',slug:'ac-duct-mold-resistant-coating'},
  {title:'Dust & debris',point:[.33,.64],copy:'Dust builds up deep inside the ducts. Professional cleaning reaches beyond the grille.',service:'AC duct cleaning & care',slug:'ac-duct-mold-resistant-coating'},
  {title:'Fine dust & allergens',point:[.72,.32],copy:'Fine dust can carry allergens through the system. Duct cleaning removes accumulated dirt at its source.',service:'Explore AC care',slug:'ac-duct-mold-resistant-coating'},
  {title:'Mold-resistant coating',point:[.77,.64],copy:'After cleaning, suitable ducts can receive a coating that helps resist mold growth.',service:'Mold-resistant duct coating',slug:'ac-duct-mold-resistant-coating'}
 ]
};
