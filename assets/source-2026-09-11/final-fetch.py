exec(open('/private/tmp/eon-life-well-kept/content/crawl.py').read().split('items=')[0])
items=[('extra--tag--'+x['slug']+'.html',x['link']) for x in json.loads((R/'raw/tags.json').read_text()) if x['count']==0]
s=(R/'raw/home.html').read_text();urls=set(re.findall(r'https://eoncoatings.com/[^\"\s<>]+(?:eon_logo_original1-01-scaled.png|footer_logo.png)',s))
urls.update(['https://eoncoatings.com/wp-content/uploads/2025/08/eon_logo_original1-01-scaled.png'])
items +=[('../assets/'+u.split('/')[-1],u) for u in urls]
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as ex:out=list(ex.map(get,items))
(R/'final-fetch.json').write_text(json.dumps(out,indent=2));print(out)
