import {EonThemeProvider} from '@/components/eon/ThemeControls';
import type {Metadata} from 'next';
import {siteUrl, pageMetadata, defaultTitle, defaultDescription} from '@/lib/eon/metadata';
import './globals.css';
import './layout-repair.css';
import PageMotion from '@/components/campaign/PageMotion';
import FinderModal from '@/components/campaign/FinderModal';
import QualityCheck from '@/components/campaign/QualityCheck';
import StructuredData from '@/components/eon/StructuredData';
import PerformanceProbe from '@/components/eon/PerformanceProbe';
import { Header, Footer } from '@/components/eon/SiteShell';
import './dark-mode.css';
import './responsive.css';
export const metadata:Metadata={
 ...pageMetadata({title:defaultTitle,description:defaultDescription}),
 verification:{google:process.env.GOOGLE_SITE_VERIFICATION||undefined},
 metadataBase:new URL(siteUrl),applicationName:'Eon Coatings',
 icons:{icon:[{url:'/favicon.svg',type:'image/svg+xml'},{url:'/favicon.png',type:'image/png'}],apple:'/apple-touch-icon.png'},
 formatDetection:{telephone:false},
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head><link rel="preload" href="/fonts/manrope.ttf" as="font" type="font/ttf" crossOrigin="anonymous"/></head><body><StructuredData data={{'@context':'https://schema.org','@type':'LocalBusiness','@id':siteUrl+'/#business',logo:siteUrl+'/favicon.png',image:siteUrl+'/images/og/eon-coatings.jpg',sameAs:['https://www.linkedin.com/company/eon-coatings/','https://www.instagram.com/eoncoatings/'],openingHoursSpecification:[{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],opens:'09:00',closes:'17:00'}],name:'Eon Coatings',url:'https://eoncoatings.com/',telephone:'+97125639468',email:'info@eoncoatings.com',address:{'@type':'PostalAddress',streetAddress:'M17, Mussafah',addressLocality:'Abu Dhabi',addressCountry:'AE'}}}/>{process.env.NODE_ENV==='development'&&<><PerformanceProbe/><QualityCheck/></>}<PageMotion/><EonThemeProvider><Header/>{children}<Footer/><FinderModal/></EonThemeProvider></body></html>;}
