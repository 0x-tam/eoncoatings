import {canonicalPath} from './urls';
import type {ContentRecord} from './content-types';
export function cleanText(s:string){return s.replace(/\u2014|&mdash;|&#8212;|&#x2014;/gi,',').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&#8217;/g,'’').replace(/&#8211;/g,'–').replace(/&nbsp;/g,' ').trim();}
export function recordPath(record:Pick<ContentRecord,'url'>){return canonicalPath(new URL(record.url).pathname);}
export function dateLabel(date:string){return new Date(date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Dubai'});}
