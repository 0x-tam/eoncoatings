exec(open('/private/tmp/eon-life-well-kept/content/crawl.py').read().split('items=')[0])
items=[]
for kind in ['posts','pages','service','industry','categories','users','media']:
 h=(R/('raw/'+kind+'.json.headers')).read_text();n=int(re.search(r'x-wp-totalpages: (\d+)',h).group(1));
 for page in range(2,n+2):items.append((kind+'-page-'+str(page)+'.json','https://eoncoatings.com/wp-json/wp/v2/'+kind+'?per_page=100&page='+str(page)))
 if kind!='media':
  for rec in json.loads((R/('raw/'+kind+'.json')).read_text()):items.append((kind+'--'+rec['slug']+'.html',rec['link']))
items += [(url.rsplit('/',1)[1],url) for url in re.findall('<loc>(.*?)</loc>',(R/'raw/wp-sitemap.xml').read_text())]
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:logs=list(ex.map(get,items))
(R/'follow-fetch.json').write_text(json.dumps(logs,indent=2));print('fetched',len(logs))
