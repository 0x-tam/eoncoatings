import type {MetadataRoute} from 'next';
import {isPreview,siteUrl} from '@/lib/eon/metadata';
export default function robots():MetadataRoute.Robots {
 return isPreview?{rules:{userAgent:'*',disallow:'/'}}:{rules:{userAgent:'*',allow:'/',disallow:'/api/'},sitemap:`${siteUrl}/sitemap.xml`};
}
