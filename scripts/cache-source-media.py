import json,urllib.request,concurrent.futures,re,hashlib
from pathlib import Path
x=json.load(open('lib/eon/source-content.json'));urls=set()
for r in x['posts']:
 if r.get('featuredMedia'):urls.add(r['featuredMedia']['url'])
 for u in re.findall(r'<img[^>]+src="([^"]+)"',r['contentHtml']):urls.add(u)
for r in x['pages']:
 if r['slug']=='hgpp-certification':
  for u in re.findall(r'<img[^>]+src="([^"]+)"',r['contentHtml']):
   if not any(t in u for t in ['icon','phone_','laptop_','protect.png']):urls.add(u)
folder=Path('public/images/source');folder.mkdir(parents=True,exist_ok=True)
def fetch(u):
 ext=Path(u.split('?')[0]).suffix.lower() or '.jpg';name=hashlib.sha256(u.encode()).hexdigest()[:12]+ext;p=folder/name
 try:
  if not p.exists():p.write_bytes(urllib.request.urlopen(u,timeout=25).read())
  return u,'/images/source/'+name
 except Exception as e:return u,None
m=dict(concurrent.futures.ThreadPoolExecutor(max_workers=5).map(fetch,urls));Path('evidence/source-media-map.json').write_text(json.dumps(m,indent=2))
for kind in ['posts','pages','services','industries']:
 for r in x[kind]:
  if r.get('featuredMedia') and m.get(r['featuredMedia']['url']):r['featuredMedia']['url']=m[r['featuredMedia']['url']]
  for u,v in m.items():
   if v:r['contentHtml']=r['contentHtml'].replace(u,v)
Path('lib/eon/source-content.json').write_text(json.dumps(x,ensure_ascii=False))
print('Cached',sum(v is not None for v in m.values()),'of',len(m),'source images')
