// Integration seam for an owner-configured, independently hosted WordPress backend.
// Not connected to the preview's email-draft flow. CAPTCHA must come from its live supported challenge.
export type Enquiry={name:string;type:'Residential'|'Business';company?:string;phone:string;email:string;message:string};
export type DeliveryResult={kind:'sent'|'invalid'|'spam'|'failed'|'timeout';message:string;fields?:string[]};
export function parseCF7(body:unknown):DeliveryResult{
 const r=body as {status?:string;message?:string;invalid_fields?:{field:string}[]};
 if(r?.status==='mail_sent')return {kind:'sent',message:r.message||'Message sent.'};
 if(r?.status==='validation_failed')return {kind:'invalid',message:r.message||'Please check the fields.',fields:r.invalid_fields?.map(f=>f.field)};
 if(r?.status==='spam')return {kind:'spam',message:'The enquiry could not be verified. Please use the original form or contact us directly.'};
 return {kind:'failed',message:'The enquiry was not confirmed. Your details have been preserved.'};
}
export async function submitCF7(enquiry:Enquiry,config:{backendOrigin:string;frontendOrigin:string;verifiedChallenge:Record<string,string>;fetcher?:typeof fetch;timeoutMs?:number}):Promise<DeliveryResult>{
 const backend=new URL(config.backendOrigin);if(backend.origin===new URL(config.frontendOrigin).origin||backend.protocol!=='https:')return {kind:'failed',message:'A separate HTTPS form backend must be configured.'};
 if(!Object.keys(config.verifiedChallenge).length)return {kind:'invalid',message:'Complete the live human-verification challenge.'};
 const data=new FormData();Object.entries({'text-239':enquiry.name,'radio-86':enquiry.type,'text-216':enquiry.company||'','tel-22':enquiry.phone,'email-929':enquiry.email,'textarea-756':enquiry.message,...config.verifiedChallenge}).forEach(([k,v])=>data.set(k,v));
 const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),config.timeoutMs||12000);
 try{const res=await (config.fetcher||fetch)(new URL('/wp-json/contact-form-7/v1/contact-forms/6101/feedback',backend),{method:'POST',body:data,signal:abort.signal});if(!res.ok)return {kind:'failed',message:'The enquiry was not confirmed. Please try the original form.'};return parseCF7(await res.json());}catch{return {kind:abort.signal.aborted?'timeout':'failed',message:'Delivery was not confirmed. Your details have been preserved.'};}finally{clearTimeout(timer);}
}
