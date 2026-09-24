import type {MetadataRoute} from 'next';
import {siteUrl} from '@/lib/eon/metadata';
export default function robots():MetadataRoute.Robots {
 // Crawlers must be allowed to fetch pages to see their noindex directive.
 return {rules:{userAgent:'*',allow:'/',disallow:'/api/'},sitemap:`${siteUrl}/sitemap.xml`};
}
