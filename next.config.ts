import type {NextConfig} from 'next';
import {urlAliases} from './lib/eon/urls';
const noindex=process.env.SITE_INDEXABLE!=='true'||process.env.VERCEL_ENV==='preview';
const nextConfig:NextConfig={
 trailingSlash:true,outputFileTracingRoot:process.cwd(),poweredByHeader:false,
 async redirects(){return [
  {source:'/:path*',has:[{type:'host',value:'www.eoncoatings.com'}],destination:'https://eoncoatings.com/:path*',permanent:true},
  {source:'/:path*',has:[{type:'host',value:'eoncoatings.com'},{type:'header',key:'x-forwarded-proto',value:'http'}],destination:'https://eoncoatings.com/:path*',permanent:true},
  ...Object.entries(urlAliases).map(([source,destination])=>({source:source.replace(/\/$/,''),destination,permanent:true})),
 ]},
 async headers(){return [
  {source:'/:path*',headers:[{key:'X-Content-Type-Options',value:'nosniff'},...(noindex?[{key:'X-Robots-Tag',value:'noindex, follow'}]:[])]},
  {source:'/:path*',has:[{type:'host',value:'eoncoatings.com'}],headers:[{key:'Strict-Transport-Security',value:'max-age=31536000'}]},
  ...['finder','qa','enquiry','q','category'].map(key=>({source:'/:path*',has:[{type:'query' as const,key}],headers:[{key:'X-Robots-Tag',value:'noindex, follow'}]})),
  {source:'/api/:path*',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'}]},
  {source:'/fonts/:path*',headers:[{key:'Cache-Control',value:'public, max-age=31536000, immutable'}]},
 ]},
};
export default nextConfig;
