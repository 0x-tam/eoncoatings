exec(open('/private/tmp/eon-research/crawl.py').read().split('items=')[0])
items=[]
for typ in ['service','industry']:
 for x in json.loads((ROOT/('raw/'+typ+'.json')).read_text()):items.append((typ+'--'+x['slug']+'.html',x['link']))
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:results=list(ex.map(get,items))
(ROOT/'fetch-custom-log.json').write_text(json.dumps(results,indent=2));print('Fetched',len(results))
