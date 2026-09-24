import json,urllib.request,urllib.parse,concurrent.futures,re,sys
from pathlib import Path
rows=json.load(open('docs/seo/final-crawl.json'));assets=set();links=set();fragments=[]
for r in rows:
 for i in r.get('images',[]):
  if i.get('src','').startswith('/'):assets.add(i['src'])
 for link in r.get('links',[]):
  u=urllib.parse.urlparse(urllib.parse.urljoin('https://eoncoatings.com'+r['path'],link))
  if u.scheme in ('http','https'):
   if u.netloc in ('eoncoatings.com','www.eoncoatings.com'):
    if re.search(r'\.[a-z0-9]{2,5}$',u.path):assets.add(u.path)
    if u.fragment:fragments.append((r['path'],u.path,u.fragment))
   else:links.add(link)
by={r['path']:r for r in rows};badfragments=[v for v in fragments if v[1] in by and v[2] not in by[v[1]]['ids']]
def check(p):
 try:
  q=urllib.request.Request('http://127.0.0.1:5177'+p,method='HEAD');r=urllib.request.urlopen(q,timeout=10);return {'path':p,'status':r.status}
 except Exception as e:return {'path':p,'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:results=list(ex.map(check,assets))
report={'assetsChecked':len(results),'failures':[x for x in results if x.get('status')!=200],'brokenFragments':badfragments,'externalLinks':sorted(links)}
Path('docs/seo/link-audit.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))

if report["failures"] or report["brokenFragments"]:sys.exit(1)
