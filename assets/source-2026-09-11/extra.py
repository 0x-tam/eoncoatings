exec(open('/private/tmp/eon-life-well-kept/content/crawl.py').read().split('items=')[0])
import html
logs=json.loads((R/'initial-fetch.json').read_text())+json.loads((R/'follow-fetch.json').read_text());known={x['url'] for x in logs};urls=set()
for p in (R/'raw').glob('wp-sitemap-*.xml'):urls.update(re.findall('<loc>(.*?)</loc>',p.read_text()))
for p in (R/'raw').glob('*.html'):
 urls.update(html.unescape(x) for x in re.findall(r'href=[\"\x27]([^\"\x27]+)',p.read_text()) if '/page/' in x and x.startswith('https://eoncoatings.com/'))
items=[('extra--'+u.replace('https://eoncoatings.com/','').strip('/').replace('/','--')+'.html',u) for u in sorted(urls-known)]
items+=[('tags.json','https://eoncoatings.com/wp-json/wp/v2/tags?per_page=100'),('tags-page-2.json','https://eoncoatings.com/wp-json/wp/v2/tags?per_page=100&page=2')]
media=[]
for p in (R/'raw').glob('media*.json'):
 a=json.loads(p.read_text());media+=a if isinstance(a,list) else []
(R/'assets').mkdir(exist_ok=True)
selected=[x for x in media if re.search(r'(eon_logo_original|footer_logo|health-certificate|^hgpp|^certification$)',x['slug'],re.I)]
items +=[('../assets/'+str(x['id'])+'-'+x['source_url'].split('/')[-1],x['source_url']) for x in selected]
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:out=list(ex.map(get,items))
(R/'extra-fetch.json').write_text(json.dumps(out,indent=2));print('extra',len(out),'errors',[x for x in out if x['status']!=200])
