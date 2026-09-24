import type {Metadata} from 'next';
import {canonicalPath} from './urls';
import {cleanText} from './public-format';

export const siteUrl = 'https://eoncoatings.com';
export const isPreview = process.env.SITE_INDEXABLE !== 'true' || process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development';
export const defaultTitle = 'AC Cleaning & Surface Protection in Abu Dhabi';
export const defaultDescription = 'AC duct cleaning, furniture cleaning and protective coatings in Abu Dhabi and across the UAE. Find the right service for your home or workplace.';
export const shareImage = {url:'/images/og/eon-coatings.jpg',width:1200,height:630,alt:'Eon Coatings — AC cleaning, fabric care and surface protection'};

export function metadataText(value:string, limit=160) {
 const text=cleanText(value).replace(/\s+/g,' ').trim();
 if(text.length<=limit)return text;
 return text.slice(0,limit-1).replace(/\s+\S*$/,'').replace(/[ ,;:–-]+$/,'')+'…';
}
export function pageMetadata({title,description,path='/',article,noindex=false}:{title:string;description:string;path?:string;article?:{publishedTime:string;modifiedTime:string};noindex?:boolean}):Metadata {
 path=canonicalPath(path);
 const cleanTitle=cleanText(title).replace(/\s*[-|–—]\s*Eon Coatings\s*$/i,'').trim();
 const summary=metadataText(description)||defaultDescription;
 const fullTitle=/\bEon Coatings\b/i.test(cleanTitle)?cleanTitle:`${cleanTitle} | Eon Coatings`;
 return {
  title:{absolute:fullTitle},description:summary,alternates:{canonical:`${siteUrl}${path}`},
  robots:{index:!isPreview&&!noindex,follow:true},
  openGraph:{type:article?'article':'website',locale:'en_AE',siteName:'Eon Coatings',url:`${siteUrl}${path}`,title:fullTitle,description:summary,images:[shareImage],...article},
  twitter:{card:'summary_large_image',title:fullTitle,description:summary,images:[shareImage]},
 };
}
export const pageCopy:Record<string,[string,string]>={
 'about-us':['About Eon Coatings','Meet Eon Coatings in Abu Dhabi. Explore our AC cleaning, fabric care and surface protection services for homes and commercial properties.'],
 service:['Cleaning & Protective Coating Services','Explore AC duct cleaning, furniture and mattress cleaning, marble protection and specialist coatings for homes and businesses in Abu Dhabi and the UAE.'],
 media:['Media & Company Updates','Read Eon Coatings news and practical guidance on AC cleaning, fabric care, protective coatings and property maintenance in the UAE.'],
 'contact-us':['Contact Eon Coatings in Abu Dhabi','Contact Eon Coatings for a free consultation on AC cleaning, furniture care and protective coatings. Visit us in Mussafah, Abu Dhabi, or send an enquiry.'],
 'hgpp-certification':['HGPP Certification & HealthGuard Program','Explore the HealthGuard Protection Program: treatment scope, conformity certificates and display materials for qualifying premises with Eon Coatings.'],
 industry:['Cleaning & Protection by Industry','Explore cleaning and protective coating services for offices, healthcare facilities, schools and hotels in Abu Dhabi and across the UAE.'],
 'success-stories-client-results':['Client Stories & Results','Explore Eon Coatings client stories covering AC care, fabric cleaning and surface protection for homes and commercial premises.'],
 'privacy-policy':['Privacy Policy','Read how Eon Coatings handles personal information, website enquiries and your privacy rights.'],
 'terms-and-conditions':['Terms & Conditions','Read the terms for using the Eon Coatings website and enquiring about cleaning and protective coating services.'],
};
