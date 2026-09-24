import StructuredData from './StructuredData';
import {siteUrl} from '@/lib/eon/metadata';
import {canonicalPath} from '@/lib/eon/urls';
export default function ServiceSeo({slug,title,description,image}:{slug:string;title:string;description:string;image:string}){
 const url=siteUrl+canonicalPath(`/services/${slug}/`);
 return <StructuredData data={{'@context':'https://schema.org','@graph':[
  {'@type':'Service','@id':url+'#service',name:title,description,url,image:new URL('/images/'+image,siteUrl).href,provider:{'@id':siteUrl+'/#business'},areaServed:[{'@type':'City',name:'Abu Dhabi'},{'@type':'Country',name:'United Arab Emirates'}]},
  {'@type':'BreadcrumbList',itemListElement:[{name:'Home',item:siteUrl+'/'},{name:'Services',item:siteUrl+'/services/'},{name:title,item:url}].map((item,i)=>({'@type':'ListItem',position:i+1,...item}))}
 ]}}/>;
}
