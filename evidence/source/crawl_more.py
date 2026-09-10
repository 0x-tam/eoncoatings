exec(open('/private/tmp/eon-research/crawl.py').read().split('items=')[0])
pages=json.loads((ROOT/'raw/pages.json').read_text());posts=json.loads((ROOT/'raw/posts.json').read_text()); cats=json.loads((ROOT/'raw/categories.json').read_text())
items=[('media-page-'+str(i)+'.json','https://eoncoatings.com/wp-json/wp/v2/media?per_page=100&page='+str(i)) for i in [2,3]]+[(x['slug']+'.html',x['link']) for x in pages+posts+cats if x['slug']!='home']+[('posts-page2.json','https://eoncoatings.com/wp-json/wp/v2/posts?per_page=100&page=2'),('wp-sitemap.xml','https://eoncoatings.com/wp-sitemap.xml')]
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex: results=list(ex.map(get,items))
(ROOT/'fetch-more-log.json').write_text(json.dumps(results,indent=2)); print('Fetched',len(results))
