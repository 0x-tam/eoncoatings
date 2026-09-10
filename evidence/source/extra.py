exec(open('/private/tmp/eon-research/crawl.py').read().split('items=')[0])
s=(ROOT/'raw/wp-sitemap.xml').read_text()
urls=re.findall(r'<loc>(.*?)</loc>',s)
items=[(u.rsplit('/',1)[1],u) for u in urls]+[(x+'.json','https://eoncoatings.com/wp-json/wp/v2/'+x+'?per_page=100') for x in ['types','service','industry']]+[('../assets/header-logo.png','https://eoncoatings.com/wp-content/uploads/2025/08/eon_logo_original1-01-scaled.png'),('../assets/footer-logo.png','https://eoncoatings.com/wp-content/uploads/2025/08/footer_logo.png')]
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex: results=list(ex.map(get,items))
(ROOT/'fetch-extra-log.json').write_text(json.dumps(results,indent=2)); print('Fetched',len(results))
