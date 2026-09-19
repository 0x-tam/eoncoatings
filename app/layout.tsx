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
 metadataBase:new URL(siteUrl),applicationName:'Eon Coatings',
 icons:{icon:[{url:'/favicon.svg',type:'image/svg+xml'},{url:'/favicon.png',type:'image/png'}],apple:'/apple-touch-icon.png'},
 formatDetection:{telephone:false},
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head><link rel="preload" href="/fonts/fraunces.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body><StructuredData data={{'@context':'https://schema.org','@type':'Organization',name:'Eon Coatings',url:'https://eoncoatings.com/',telephone:'+97125639468',email:'info@eoncoatings.com',address:{'@type':'PostalAddress',streetAddress:'M17, Mussafah',addressLocality:'Abu Dhabi',addressCountry:'AE'}}}/><PerformanceProbe/><PageMotion/><QualityCheck/><EonThemeProvider><Header/>{children}<Footer/><FinderModal/></EonThemeProvider></body></html>;}
