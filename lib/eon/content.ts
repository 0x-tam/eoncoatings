import data from './source-content.json';
import type {ContentRecord} from './content-types';
export const posts=data.posts as ContentRecord[];
export const pages=data.pages as ContentRecord[];
export const sourceServices=data.services as ContentRecord[];
export const industries=data.industries as ContentRecord[];
export const categories=data.categories;
export {services} from './services';
export {cleanText,recordPath,dateLabel} from './public-format';
export const coatingFaqs=[
 {q:'How long does a coating last?',a:'EON states that its coatings typically last between 6 and 12 months, depending on usage and surface type. High-traffic areas may need inspections and touch-ups. This is coating guidance, not a promise about how long a cleaned duct stays clean.'},
 {q:'When can a treated space be used again?',a:'EON’s coating guidance gives a typical interval of 2 to 4 hours after application. Ask the team for the drying or curing requirements of the specific product and surface.'},
 {q:'Is maintenance support available?',a:'EON offers maintenance packages and post-service guidance to help prolong coating performance and surface hygiene.'},
 {q:'What should I ask about product safety?',a:'EON describes its coating products as eco-friendly and non-toxic in its existing FAQ. Request the applicable product information and use instructions for your space. Product suitability and treatment conditions should be confirmed before application.'},
];
