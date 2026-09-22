import ClientStories from '@/components/eon/ClientStories';
import {IndustryDirectory,RelatedArticles} from '@/components/eon/RestoredSections';
import LocationMap from '@/components/eon/LocationMap';
import TermsPage from '@/components/eon/TermsPage';
import PrivacyPage from '@/components/eon/PrivacyPage';
import {AboutPage,HGPPPage} from '@/components/eon/CompanyPages';
import Link from '@/components/eon/PageLink';
import type {Metadata} from 'next';
import {pageMetadata,pageCopy,defaultDescription} from '@/lib/eon/metadata';
import {notFound,redirect} from 'next/navigation';
import {posts,pages,services,sourceServices,industries,categories,cleanText,dateLabel,recordPath} from '@/lib/eon/content';
import {PageHeading,Consultation,Faqs} from '@/components/eon/Editorial';
import MediaIndex from '@/components/eon/MediaIndex';
import StructuredData from '@/components/eon/StructuredData';
import ContactForm from '@/components/eon/ContactForm';
import ServiceDetail from '@/components/eon/ServiceDetail';
import SectorPage from '@/components/eon/SectorPage';
import ServiceList from '@/components/campaign/ServiceList';
import ArchivePage from '@/components/campaign/ArchivePage';
import archiveData from '@/lib/eon/archive-data.json';
const titleMap:Record<string,string>={'about-us':'About Eon Coatings','service':'AC Cleaning, Furniture & Surface Protection','media':'Media & Company Updates','contact-us':'Contact us','hgpp-certification':'HealthGuard Protection Program','industry':'Industries','privacy-policy':'Privacy Policy','terms-and-conditions':'Terms & Conditions'};
function lookup(path:string){return [...posts,...pages,...sourceServices,...industries].find(r=>recordPath(r).replace(/^\/+|\/+$/g,'')===path);}
export async function generateMetadata({params}:{params:Promise<{slug:string[]}>}):Promise<Metadata>{
 const {slug}=await params;
 const path=slug.join('/'),record=lookup(path);
 const [kind,archiveSlug,,pageNumber]=slug;
 const archiveName=kind==='tag'?archiveData.tags.find(t=>t.slug===archiveSlug)?.name:kind==='category'?categories.find(c=>c.slug===archiveSlug)?.name:kind==='author'?archiveData.authors.find(a=>a.slug===archiveSlug)?.name:undefined;
 const service=services.find(s=>path===`services/${s.slug}`);
 const article=posts.find(p=>recordPath(p).replace(/^\/+|\/+$/g,'')===path);
 const sector=path.startsWith('industries/')?industries.find(i=>i.slug===slug[1]):undefined;
 const sectorName=sector?slug[1][0].toUpperCase()+slug[1].slice(1):'';
 const copy=pageCopy[path];
 const title=copy?.[0]||service?.title||(sector?`${sectorName} Cleaning & Surface Protection`:undefined)||(archiveName?`${cleanText(archiveName)} Articles${pageNumber?` — Page ${pageNumber}`:''}`:undefined)||cleanText(record?.title||'Page Not Found');
 const description=copy?.[1]||service?.short||(sector?`AC cleaning, fabric care and protective coatings for ${sectorName.toLowerCase()} facilities in Abu Dhabi and the UAE. Discuss access, materials and service planning.`:undefined)||(archiveName?`Browse Eon Coatings articles about ${cleanText(archiveName)}${pageNumber?`, page ${pageNumber}`:''}. Practical guidance on cleaning and protective coatings.`:undefined)||(record?cleanText(record.excerptHtml||record.contentText):defaultDescription);
 return pageMetadata({title,description,path:`/${path}/`,article:article?{publishedTime:article.date,modifiedTime:article.modified}:undefined,noindex:(!copy&&!service&&!record&&!archiveName)||kind==='tag'||kind==='author'});
}
export default async function ContentPage({params,searchParams}:{params:Promise<{slug:string[]}>;searchParams:Promise<{q?:string;category?:string;limit?:string;space?:string}>}){
 const {slug}=await params;const search=await searchParams;const path=slug.join('/');
 if(path==='contact-us-1')redirect('/contact-us/');
 if(path.startsWith('elementor-hf/'))redirect('/');
 if(/^(category|tag|author)\//.test(path))return <ArchivePage path={path}/>;
const r=lookup(path);const service=services.find(s=>path===`services/${s.slug}`);
 if(path==='media')return <main id="main"><PageHeading label="Eon Coatings media" title="News and practical guidance." description="Company updates, practical guidance and our complete article archive."/><MediaIndex articles={posts} initialQuery={search.q} initialCategory={search.category} initialLimit={Math.max(9,Number(search.limit)||9)}/><Consultation/></main>;
 if(path==='contact-us')return <main id="main"><PageHeading label="Contact us" title="Contact Eon Coatings." description="Request a free consultation. Tell us what needs cleaning or protection and where you’re based."/><section className="section contact-layout"><aside><figure className="contact-services-image"><img src="/images/contact/private-corporate-v2.webp" alt="Diagonal split between a warm private living room and a cool corporate office with workstations, ergonomic chairs and commercial air vents" width="1536" height="1024"/><figcaption><span>Homes &amp; private spaces</span><span>Offices &amp; commercial spaces</span></figcaption></figure><h2>Find us in<br/>Abu Dhabi.</h2><dl><dt>Phone</dt><dd><Link prefetch={false} href="tel:+97125639468">+971 (02) 563 9468</Link></dd><dt>Email</dt><dd><Link prefetch={false} href="mailto:info@eoncoatings.com">info@eoncoatings.com</Link></dd><dt>Office</dt><dd>M17, Mussafah<br/>Abu Dhabi, UAE</dd><dt>Working hours</dt><dd>Monday to Saturday<br/>9:00 AM to 5:00 PM<br/>Sunday closed</dd></dl><LocationMap/></aside><ContactForm/></section></main>;
 if(path==='service')return <main id="main"><PageHeading label="Eon Coatings / Services" title="Cleaning and coating services." description="For homes, offices, clinics, schools and hotels."/><section className="section simple-service-gallery" id="protection"><ServiceList/></section><section className="section service-faq"><div><p className="eyebrow">Surface protection</p><h2>Common service questions.</h2><p>Explore specialist cleaning, material care and protective coatings for your space.</p></div><Faqs/></section><section className="section service-choice-help"><p>Not sure which service you need?</p><Link href="/service-finder/" className="button">Find my service <span aria-hidden="true">›</span></Link></section></main>;
 if(path==='success-stories-client-results')return <ClientStories/>;
 if(path==='privacy-policy')return <PrivacyPage/>;
 if(path==='about-us')return <AboutPage/>;
 if(path==='industry')return <IndustryDirectory/>;
 if(path==='hospitality')redirect('/industries/hospitality/');
 if(path==='terms-and-conditions')return <TermsPage/>;
 if(path==='hgpp-certification')return <HGPPPage source={r?.contentHtml||''}/>;
 if(service)return <ServiceDetail slug={service.slug} sourceHtml={r?.contentHtml||''}/>;
 if(!r)notFound();
 if(path.startsWith('industries/')&&industries.some(i=>i.slug===slug[1]))return <SectorPage slug={slug[1]} source={r.contentHtml}/>;
 const article=posts.some(p=>p.id===r.id&&p.slug===r.slug),hgpp=path==='hgpp-certification',legal=path==='privacy-policy';
 return <main id="main">{article&&<StructuredData data={{'@context':'https://schema.org','@type':'Article',headline:cleanText(r.title),datePublished:r.date,dateModified:r.modified,author:{'@type':'Organization',name:r.author?.name||'Eon Coatings'},publisher:{'@type':'Organization',name:'Eon Coatings'},mainEntityOfPage:r.url}}/>}<PageHeading label={article?`${dateLabel(r.date)} / ${r.categories.map(c=>c.name).join(', ')}`:hgpp?'Our coating information':legal?'Privacy':'Our company information'} title={titleMap[path]||cleanText(r.title)} description={hgpp?'Our account of our HealthGuard Protection Program, coating scope and supporting materials.':undefined}/>{article&&<div className="article-byline">By {r.author?.name||'Eon Coatings'} · {Math.max(1,Math.ceil(r.contentText.split(/\s+/).length/200))} min read <Link prefetch={false} href="/media/">Back to media</Link></div>}{article&&r.featuredMedia&&<figure className="article-cover"><img src={r.featuredMedia.url} alt={r.featuredMedia.alt||cleanText(r.title)} width="1400" height="780"/></figure>}<section className="section reading-layout"><aside><p className="eyebrow">{article?'In this article':hgpp?'About this information':'On this page'}</p>{r.headings.filter(h=>h.level===2).slice(0,8).map((h,i)=><p key={i}><a href={`#article-section-${i}`}>{cleanText(h.text)}</a></p>)}<Link prefetch={false} className="text-link" href="/contact-us/">Ask us <span>›</span></Link></aside><article>{hgpp&&<p className="source-note">This page preserves our own published account. The claims relate to coatings and the stated program. They do not establish a duct-cleaning result or an independent government or medical endorsement.</p>}{legal&&<p className="source-note">This is our existing privacy policy. It includes WordPress “Suggested text” and requires owner review.</p>}{(path.startsWith('industries/')||path==='industry'||path==='hospitality')&&<p className="source-note">The following is our published industry information. Numerical performance claims are company statements, not independently verified project measurements. Ask for the relevant product evidence and conditions.</p>}{path.startsWith('industries/')&&path!=='industries/hospitality'&&<p className="source-note">The existing page uses hospitality wording. Its original information is retained below; sector-specific details should be confirmed with us.</p>}{path==='success-stories-client-results'&&<p className="source-note">This is our existing published account. It has not been independently verified as a recorded project result.</p>}<div className="prose" dangerouslySetInnerHTML={{__html:(()=>{let headingIndex=0;return r.contentHtml.replace(/<h2\b[^>]*>/gi,()=>`<h2 id="article-section-${headingIndex++}">`)})()}}/>{hgpp&&<div className="certificates"><h2>Published supporting materials</h2><Link prefetch={false} href="/images/authentic/5846-health-certificate.jpg"><img src="/images/authentic/5846-health-certificate.jpg" alt="HealthGuard certificate published by us" width="800" height="1100" loading="lazy"/>View original certificate</Link><Link prefetch={false} href="/images/authentic/6067-health-certificate.png">View additional certificate we published</Link></div>}{path==='industry'&&<nav className="industry-links">{industries.map(i=><Link prefetch={false} key={i.slug} href={recordPath(i)}>{i.slug[0].toUpperCase()+i.slug.slice(1)} <span>›</span></Link>)}</nav>}{article&&<p className="archive-note">We originally published this article on {dateLabel(r.date)}. </p>}</article></section>{article&&<RelatedArticles slug={r.slug}/>}<Consultation/></main>;
}
