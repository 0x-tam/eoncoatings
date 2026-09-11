import json,re,html,pathlib,hashlib,datetime
from html.parser import HTMLParser
R=pathlib.Path('/private/tmp/eon-life-well-kept/content');raw=R/'raw'
def norm(s):return re.sub(r'\u2014|&mdash;|&#8212;|&#x2014;',', ',s,flags=re.I)
def plain(s):return norm(re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',s))).strip())
class Inspect(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.images=[];self.meta={};self.canonical=None;self.headings=[];self.active=None
 def handle_starttag(self,t,a):
  a=dict(a)
  if t=='a' and a.get('href'):self.links.append(a['href'])
  if t=='img':self.images.append({k:a[k] for k in ['src','data-src','alt','width','height'] if k in a})
  if t=='meta' and a.get('content'):self.meta[a.get('name',a.get('property','unknown'))]=a['content']
  if t=='link' and a.get('rel')=='canonical':self.canonical=a.get('href')
  if re.fullmatch('h[1-6]',t):self.active={'level':int(t[1]),'text':''}
 def handle_data(self,d):
  if self.active:self.active['text']+=d
 def handle_endtag(self,t):
  if self.active and t=='h'+str(self.active['level']):self.active['text']=plain(self.active['text']);self.headings.append(self.active);self.active=None
def read(k):return json.loads((raw/(k+'.json')).read_text())
media=[]
for p in raw.glob('media*.json'):
 a=json.loads(p.read_text());media+=a if isinstance(a,list) else []
mi={x['id']:x for x in media};us={x['id']:x for x in read('users')};ca={x['id']:x for x in read('categories')}
def record(x,kind):
 body=x.get('content',{}).get('rendered','');rendered=(raw/(kind+'--'+x['slug']+'.html')).read_text();full=re.split(r'</header\s*>',rendered,flags=re.I)[-1];full=re.split(r'<footer\b',full,flags=re.I)[0]
 if kind in ['service','industry']:body=full
 body=norm(body);ins=Inspect();ins.feed(body);feat=mi.get(x.get('featured_media'))
 return {'id':x['id'],'kind':x['type'],'slug':x['slug'],'url':x['link'],'title':plain(x['title']['rendered']),'date':x['date'],'dateGmt':x.get('date_gmt'),'modified':x['modified'],'author':{'id':x['author'],'name':us[x['author']]['name'],'url':us[x['author']]['link']} if x.get('author') in us else None,'categories':[{'id':i,'slug':ca[i]['slug'],'name':ca[i]['name']} for i in x.get('categories',[])],'tags':x.get('tags',[]),'excerptHtml':norm(x.get('excerpt',{}).get('rendered','')),'contentHtml':body,'contentText':plain(body),'renderedMainHtml':norm(full),'featuredMedia':{'id':feat['id'],'url':feat['source_url'],'alt':feat['alt_text']} if feat else None,'headings':ins.headings,'links':list(dict.fromkeys(ins.links)),'images':ins.images,'rawApi':'raw/'+kind+'.json','rawHtml':'raw/'+kind+'--'+x['slug']+'.html'}
logs=sum([json.loads(p.read_text()) for p in R.glob('*-fetch.json')],[]);byfile={x['file']:x for x in logs};inventory=[]
for p in sorted(raw.glob('*.html')):
 s=p.read_text();i=Inspect();i.feed(s);log=byfile.get('raw/'+p.name,{})
 inventory.append({'url':log.get('url'),'file':'raw/'+p.name,'status':log.get('status'),'canonical':i.canonical,'title':plain((re.findall(r'<title>(.*?)</title>',s,re.S) or [''])[0]),'meta':i.meta,'headings':i.headings,'links':list(dict.fromkeys(i.links)),'images':i.images})
d={'schemaVersion':2,'source':'https://eoncoatings.com/','retrievedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'posts':[record(x,'posts') for x in read('posts')],'pages':[record(x,'pages') for x in read('pages')],'services':[record(x,'service') for x in read('service')],'industries':[record(x,'industry') for x in read('industry')],'categories':read('categories'),'tags':read('tags') if (raw/'tags.json').exists() else [],'authors':read('users'),'media':[{'id':x['id'],'slug':x['slug'],'url':x['source_url'],'alt':x['alt_text'],'mimeType':x['mime_type'],'width':x.get('media_details',{}).get('width'),'height':x.get('media_details',{}).get('height')} for x in media]}
delta={}
for kind in ['posts','pages','service','industry','categories']:
 old={x['id']:x for x in json.loads((pathlib.Path('/private/tmp/eon-research/raw')/(kind+'.json')).read_text())};new={x['id']:x for x in read(kind)}
 delta[kind]={'count':len(new),'added':sorted(new.keys()-old.keys()),'removed':sorted(old.keys()-new.keys()),'changedFields':[{ 'id':i,'fields':[k for k in ['slug','title','date','modified','content','categories','featured_media','name','count'] if new[i].get(k)!=old[i].get(k)]} for i in new.keys()&old.keys() if any(new[i].get(k)!=old[i].get(k) for k in ['slug','title','date','modified','content','categories','featured_media','name','count'])]}
for name,value in [('content.json',d),('route-inventory.json',inventory),('deltas.json',delta)]: (R/name).write_text(norm(json.dumps(value,ensure_ascii=False,indent=2)))
(R/'content-types.ts').write_text('export interface ContentRecord { id:number; kind:string; slug:string; url:string; title:string; date:string; dateGmt:string|null; modified:string; author:{id:number;name:string;url:string}|null; categories:{id:number;slug:string;name:string}[]; tags:number[]; excerptHtml:string; contentHtml:string; contentText:string; renderedMainHtml:string; featuredMedia:{id:number;url:string;alt:string}|null; headings:{level:number;text:string}[]; links:string[]; images:Record<string,string>[]; rawApi:string; rawHtml:string }\n')
print(json.dumps({'counts':{k:len(d[k]) for k in ['posts','pages','services','industries','categories','tags','authors','media']},'uniqueHtmlUrls':len({x['url'] for x in inventory}),'deltas':delta},indent=2))
