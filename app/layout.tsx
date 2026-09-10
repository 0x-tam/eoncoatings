import type {Metadata} from 'next';
import './globals.css';
import StructuredData from '@/components/eon/StructuredData';
import PerformanceProbe from '@/components/eon/PerformanceProbe';
import { Header, Footer } from '@/components/eon/SiteShell';
export const metadata:Metadata={title:{default:'EON Coatings | Surface Protection That Performs',template:'%s | EON Coatings'},description:'Specialist surface coatings, interior cleaning and AC care in Abu Dhabi and the UAE. Explore EON Coatings services and book a free consultation.',alternates:{canonical:"https://eoncoatings.com/"},icons:{icon:"/favicon.png"},robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><StructuredData data={{'@context':'https://schema.org','@type':'Organization',name:'EON Coatings',url:'https://eoncoatings.com/',telephone:'+97125639468',email:'info@eoncoatings.com',address:{'@type':'PostalAddress',streetAddress:'M17, Mussafah',addressLocality:'Abu Dhabi',addressCountry:'AE'}}}/><PerformanceProbe/><Header/>{children}<Footer/></body></html>;}
