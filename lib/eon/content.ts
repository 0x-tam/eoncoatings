import data from './source-content.json';
import type {ContentRecord} from './content-types';
export const posts=data.posts as ContentRecord[];
export const pages=data.pages as ContentRecord[];
export const sourceServices=data.services as ContentRecord[];
export const industries=data.industries as ContentRecord[];
export const categories=data.categories;
export const services=[
 {slug:'ac-duct-mold-resistant-coating',title:'AC duct mold-resistant coating',short:'A separate protective treatment for internal duct surfaces. Ask about cleaning, sanitisation and coating as distinct services.',image:'A02-duct-interior.webp',label:'Air systems'},
 {slug:'antimicrobial-surface-coating',title:'Anti-microbial surface coating',short:'Surface protection for high-touch environments, from homes and offices to hospitality and healthcare.',image:'v2/V205-bronze-touchpoint.webp',label:'High-touch surfaces'},
 {slug:'stain-resistant-furniture-coating',title:'Stain-resistant furniture coating',short:'Protection against spills and stains for sofas, chairs and upholstery.',image:'v2/V204-coffee-spill.webp',label:'Fabric & upholstery'},
 {slug:'marble-protective-coatings',title:'Marble protective coatings',short:'Protective treatment with the natural character of your marble in mind.',image:'v2/V202-stone-water-detail.webp',label:'Stone surfaces'},
 {slug:'deep-cleaning-of-carpets-furniture',title:'Deep cleaning of carpets & furniture',short:'Cleaning care for carpets and upholstered furniture in the spaces you use every day.',image:'v2/V206-carpet-extraction.webp',label:'Carpets & furniture'},
 {slug:'mattress-cleaning-and-sanitization',title:'Mattress cleaning and sanitization',short:'Dedicated mattress cleaning and sanitisation for your bedroom.',image:'v2/V207-mattress-care.webp',label:'Mattresses'},
 {slug:'specialty-coatings',title:'Specialty coatings',short:'Exterior surface protection against weathering and deterioration.',image:'A11-stone-facade.webp',label:'Exterior materials'},
];
export function cleanText(s:string){return s.replace(/\u2014|&mdash;|&#8212;|&#x2014;/gi,',').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&#8217;/g,'’').replace(/&#8211;/g,'–').replace(/&nbsp;/g,' ').trim();}
export function recordPath(record:ContentRecord){return new URL(record.url).pathname;}
export function dateLabel(date:string){return new Date(date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Dubai'});}
export const coatingFaqs=[
 {q:'How long does a coating last?',a:'EON states that its coatings typically last between 6 and 12 months, depending on usage and surface type. High-traffic areas may need inspections and touch-ups. This is coating guidance, not a promise about how long a cleaned duct stays clean.'},
 {q:'When can a treated space be used again?',a:'EON’s coating guidance gives a typical interval of 2 to 4 hours after application. Ask the team for the drying or curing requirements of the specific product and surface.'},
 {q:'Is maintenance support available?',a:'EON offers maintenance packages and post-service guidance to help prolong coating performance and surface hygiene.'},
 {q:'What should I ask about product safety?',a:'EON describes its coating products as eco-friendly and non-toxic in its existing FAQ. Request the applicable product information and use instructions for your space. Product suitability and treatment conditions should be confirmed before application.'},
];
