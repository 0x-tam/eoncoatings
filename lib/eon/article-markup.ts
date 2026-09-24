import {canonicalPath} from './urls';
import {cleanText} from './public-format';
export function articleMarkup(source:string){
 let previous=1,index=0;
 const headings:{text:string}[]=[];
 const html=source.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi,(_,level,body)=>{
  const next=Math.min(Math.max(2,Number(level)),previous+1);previous=next;
  const id=next===2?` id="article-section-${index++}"`:'';
  if(next===2)headings.push({text:cleanText(body)});
  return `<h${next}${id}>${body}</h${next}>`;
 }).replace(/href="(?:https?:\/\/(?:www\.)?eoncoatings\.com)?(\/[^\"]*)"/gi,(_,href)=>`href="${canonicalPath(href)}"`)
 .replace(/<img\b([^>]*)>/gi,(_,attrs)=>`<img${attrs}${/\bloading=/.test(attrs)?'':' loading="lazy"'}${/\bdecoding=/.test(attrs)?'':' decoding="async"'}>`);
 return {html,headings};
}
