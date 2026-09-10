exec(open('/private/tmp/eon-research/crawl.py').read().split('items=')[0])
(ROOT/'assets').mkdir(exist_ok=True)
media=[]
for p in (ROOT/'raw').glob('media*.json'):media+=json.loads(p.read_text())
chosen=[x for x in media if re.search(r'logo|^certification$|^hgpp(-2)?$|^health-certificate',x['slug'])]
items=[('../assets/'+str(x['id'])+'-'+pathlib.Path(urllib.parse.urlparse(x['source_url']).path).name,x['source_url']) for x in chosen]
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex: results=list(ex.map(get,items))
(ROOT/'asset-log.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
