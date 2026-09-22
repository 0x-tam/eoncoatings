import type {MetadataRoute} from 'next';
import {posts,services,industries,recordPath} from '@/lib/eon/content';
import {siteUrl,pageCopy} from '@/lib/eon/metadata';
export default function sitemap():MetadataRoute.Sitemap {
 const paths=['/','/services/office-ac-duct-care/',...Object.keys(pageCopy).map(path=>`/${path}/`),...services.map(s=>`/services/${s.slug}/`),...industries.map(recordPath),...posts.map(recordPath)];
 return [...new Set(paths)].map(path=>({url:`${siteUrl}${path}`}));
}
