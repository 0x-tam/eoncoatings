// Public URLs are independent of the historical content identifiers.
export const urlAliases:Record<string,string>={
 '/service/':'/services/',
 '/industry/':'/industries/',
 '/services/ac-duct-mold-resistant-coating/':'/services/home-villa-ac-duct-cleaning/',
 '/contact-us-1/':'/contact-us/',
 '/hospitality/':'/industries/hospitality/',
 '/inside-the-air/':'/services/home-villa-ac-duct-cleaning/',
};
export function canonicalPath(value:string){
 if(!value.startsWith('/')||value.startsWith('//'))return value;
 const cut=value.search(/[?#]/);
 const path=cut<0?value:value.slice(0,cut),suffix=cut<0?'':value.slice(cut);
 const normalized=path==='/'?'/':path.endsWith('/')||/\.[a-z0-9]+$/i.test(path)?path:path+'/';
 return (urlAliases[normalized]||normalized)+suffix;
}
export function contentPath(path:string){
 const publicPath='/'+path.replace(/^\/+|\/+$/g,'')+'/';
 const legacy=Object.entries(urlAliases).find(([from,to])=>to===publicPath&&!['/contact-us-1/','/hospitality/','/inside-the-air/'].includes(from));
 return (legacy?.[0]||publicPath).replace(/^\/+|\/+$/g,'');
}
