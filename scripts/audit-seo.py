import urllib.request, urllib.parse, concurrent.futures, json, re, sys, os
from html.parser import HTMLParser
from pathlib import Path
BASE=(sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:5177').rstrip('/')
class Page(HTMLParser):
 def __init__(self):
  super().__init__();self.images=[];self.links=[];self.headings=[];self.meta={};self.canonical=[];self.ids=set();self.title='';self.intitle=False;self.scripts=[]
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if t=='title': self.intitle=True
  if re.fullmatch('h[1-6]',t): self.headings.append(int(t[1]))
  if t=='img':self.images.append(a)
  if t=='a' and a.get('href'):self.links.append(a['href'])
  if a.get('id'):self.ids.add(a['id'])
  if t=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content','')
  if t=='link' and a.get('rel')=='canonical':self.canonical.append(a.get('href'))
 def handle_endtag(self,t):
  if t=='title':self.intitle=False
 def handle_data(self,d):
  if self.intitle:self.title+=d

def get(path):
 try:
  r=urllib.request.urlopen(BASE+path,timeout=40);h=r.read().decode();p=Page();p.feed(h)
  return dict(path=path,status=r.status,url=r.url,title=p.title,description=p.meta.get('description'),robots=p.meta.get('robots'),canonical=p.canonical,og=p.meta.get('og:image'),headings=p.headings,images=p.images,links=p.links,ids=list(p.ids),schema=[json.loads(x) for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>',h)])
 except Exception as e:return dict(path=path,error=str(e))
sitemap=urllib.request.urlopen(BASE+'/sitemap.xml').read().decode();paths=[urllib.parse.urlparse(x).path for x in re.findall(r'<loc>(.*?)</loc>',sitemap)]
results=[];seen=set()
while paths:
 batch=sorted(set(paths)-seen);paths=[];seen.update(batch)
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
  for r in ex.map(get,batch):
   results.append(r)
   for link in r.get('links',[]):
    u=urllib.parse.urlparse(urllib.parse.urljoin('https://eoncoatings.com'+r['path'],link))
    if u.netloc in ('eoncoatings.com','www.eoncoatings.com') and not re.search(r'\.[a-z0-9]{2,5}$',u.path) and u.path not in seen:paths.append(u.path or '/')
Path('docs/seo/final-crawl.json').write_text(json.dumps(results,indent=2))
issues=[]
for r in results:
 if 'error' in r:issues.append(r);continue
 bad=[]
 if r['headings'].count(1)!=1:bad.append('h1 count '+str(r['headings'].count(1)))
 if not r['description']:bad.append('no description')
 if not r['canonical']:bad.append('no canonical')
 if not r['og']:bad.append('no og')
 if not r['schema']:bad.append('no schema')
 missing=[i.get('src') for i in r['images'] if 'alt' not in i]
 if missing:bad.append({'missingAlt':missing})
 jumps=[(a,b) for a,b in zip(r['headings'],r['headings'][1:]) if b>a+1]
 if jumps:bad.append({'headingJumps':jumps})
 if bad:issues.append({'path':r['path'],'issues':bad})
print(json.dumps({'pages':len(results),'issues':issues},indent=2))

if issues:sys.exit(1)
