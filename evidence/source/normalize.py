import json,re,html,pathlib,hashlib
from html.parser import HTMLParser
R=pathlib.Path('/private/tmp/eon-research'); raw=R/'raw'
def norm(s): return s.replace('—',', ').replace('&#8212;',', ').replace('&mdash;',', ')
def plain(s): return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',s))).strip()
class Inspect(HTMLParser):
 def __init__(self): super().__init__();self.links=[];self.images=[];self.meta={};self.canonical=None;self.headings=[];self.active=None
 def handle_starttag(self,t,a):
  a=dict(a)
  if t=='a' and a.get('href'):self.links.append(a['href'])
  if t=='img':self.images.append({k:a[k] for k in ['src','data-src','alt','width','height'] if k in a})
  if t=='meta' and a.get('content'):self.meta[a.get('name',a.get('property','unknown'))]=a['content']
  if t=='link' and a.get('rel')=='canonical':self.canonical=a.get('href')
  if re.match('h[1-6]$',t):self.active={'level':int(t[1]),'text':''}
 def handle_data(self,d):
  if self.active:self.active['text']+=d
 def handle_endtag(self,t):
  if self.active and t=='h'+str(self.active['level']):self.active['text']=plain(self.active['text']);self.headings.append(self.active);self.active=None
cats=json.loads((raw/'categories.json').read_text()); users=json.loads((raw/'users.json').read_text()); media=[]
for p in raw.glob('media*.json'):media+=json.loads(p.read_text())
mi={x['id']:x for x in media};us={x['id']:x for x in users}; ca={x['id']:x for x in cats}
def record(x):
 body=norm(x.get('content',{}).get('rendered','')); ins=Inspect();ins.feed(body); feat=mi.get(x.get('featured_media'))
 return {'id':x['id'],'kind':x['type'],'slug':x['slug'],'url':x['link'],'title':plain(norm(x['title']['rendered'])),'date':x['date'],'modified':x['modified'],'author':{'id':x['author'],'name':us[x['author']]['name'],'url':us[x['author']]['link']} if x.get('author') in us else None,'categories':[{'id':i,'slug':ca[i]['slug'],'name':ca[i]['name']} for i in x.get('categories',[])],'excerptHtml':norm(x.get('excerpt',{}).get('rendered','')),'contentHtml':body,'contentText':plain(body),'featuredMedia':{'id':feat['id'],'url':feat['source_url'],'alt':feat['alt_text']} if feat else None,'headings':ins.headings,'links':list(dict.fromkeys(ins.links)),'images':ins.images}
pages=[record(x) for x in json.loads((raw/'pages.json').read_text())];posts=[record(x) for x in json.loads((raw/'posts.json').read_text())]
inventory=[]
for p in raw.glob('*.html'):
 s=p.read_text();ins=Inspect();ins.feed(s);status=re.findall(r'HTTP/\S+ (\d+)',pathlib.Path(str(p)+'.headers').read_text())
 inventory.append({'file':p.name,'status':int(status[-1]) if status else None,'canonical':ins.canonical,'title':plain((re.findall(r'<title>(.*?)</title>',s,re.S) or [''])[0]),'meta':ins.meta,'headings':ins.headings,'links':list(dict.fromkeys(ins.links)),'images':ins.images})
form={'provider':'Contact Form 7','version':'6.1.7','formId':6101,'sourceUrl':'https://eoncoatings.com/contact-us/','sourceAction':'/contact-us/#wpcf7-f6101-p6096-o1','apiRoot':'https://eoncoatings.com/wp-json/','namespace':'contact-form-7/v1','inferredFeedbackEndpoint':'https://eoncoatings.com/wp-json/contact-form-7/v1/contact-forms/6101/feedback','fields':{'name':'text-239','type':'radio-86','company':'text-216','phone':'tel-22','email':'email-929','message':'textarea-756'},'antiBot':['Contact Form 7 Image CAPTCHA: dynamic human-selected icon challenge','kc_honeypot'],'companyCondition':'radio-86 equals Business','verifiedDelivery':False,'ownerConfigurationRequired':['Preserve a live WordPress Contact Form 7 backend, form 6101, its mail recipient/SMTP and anti-bot plugins, or configure a replacement verified server endpoint.','Cross-origin permissions and live delivery require owner validation. Do not copy the observed captcha answer or claim email sent without verified successful backend response.']}
d={'schemaVersion':1,'source':'https://eoncoatings.com/','retrievedAt':'2026-09-10T22:05:00Z','posts':posts,'pages':pages,'categories':cats,'media':[{'id':x['id'],'slug':x['slug'],'url':x['source_url'],'alt':x['alt_text'],'mimeType':x['mime_type'],'width':x.get('media_details',{}).get('width'),'height':x.get('media_details',{}).get('height')} for x in media],'services':[record(x) for x in json.loads((raw/'service.json').read_text())], 'industries':[record(x) for x in json.loads((raw/'industry.json').read_text())], 'urlInventory':inventory,'form':form}
(R/'content.json').write_text(json.dumps(d,ensure_ascii=False,indent=2));(R/'form-integration.json').write_text(json.dumps(form,indent=2))
(R/'content-types.ts').write_text('export interface Category { id:number; slug:string; name:string }\nexport interface ContentRecord { id:number; kind:string; slug:string; url:string; title:string; date:string; modified:string; author:{id:number;name:string;url:string}|null; categories:Category[]; excerptHtml:string; contentHtml:string; contentText:string; featuredMedia:{id:number;url:string;alt:string}|null; headings:{level:number;text:string}[]; links:string[]; images:Record<string,string>[] }\n')
lines=['# EON Coatings source inventory','',f'Captured 20 published articles, 10 pages, 5 categories and {len(media)} public media records. API X-WP-Total posts=20 and pages=10, one page each. Media API reports 265 total records across 3 pages but returns 229 visible records; no private data was accessed.','', '## Pages']
for x in pages:lines.append(f"- [{x['title']}]({x['url']}) ({len(x['contentText'].split())} words)")
lines+=['','## Articles']
for x in posts:lines.append(f"- {x['date'][:10]} [{x['title']}]({x['url']}) | {', '.join(c['name'] for c in x['categories'])} | {len(x['contentText'].split())} words | author {x['author']['name'] if x['author'] else 'unavailable'}")
lines+=['','## Form','Contact Form 7 6.1.7 form 6101 with conditional company field, dynamic icon CAPTCHA and honeypot. Full raw form saved. No submissions or delivery tests performed. Endpoint inference and required owner configuration in form-integration.json.','','## Legal and certification','Published privacy policy preserved in full. Certification copy and original certificate images are publisher claims, not independently verified regulatory credentials. Legacy industry, hospitality and success-story content is preserved as source evidence and requires editorial review before reuse.','','## Normalization','Raw evidence remains unchanged. Display-ready content replaces literal and entity em dashes with comma punctuation. Original full body markup, dates, categories and author evidence are retained.']
(R/'CONTENT_INVENTORY.md').write_text('\n'.join(lines))
ledger=['# Source ledger','','All downloads were read-only public GET requests. No form or message was submitted.','','| Evidence | SHA-256 |','|---|---|']
for p in sorted(raw.iterdir()):ledger.append(f'| raw/{p.name} | {hashlib.sha256(p.read_bytes()).hexdigest()} |')
ledger+=['','Request URLs and curl results: fetch-log.json and fetch-more-log.json. HTTP status and headers retained beside each raw response. Normalized URL metadata/headings/links are in content.json.']
(R/'SOURCE_LEDGER.md').write_text('\n'.join(ledger)); print('Saved content.json',len(posts),'posts',len(pages),'pages',len(inventory),'HTML records')
