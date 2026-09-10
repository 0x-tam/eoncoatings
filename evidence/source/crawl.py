import json, pathlib, subprocess, concurrent.futures, re, html, urllib.parse, datetime
ROOT=pathlib.Path('/private/tmp/eon-research'); (ROOT/'raw').mkdir(exist_ok=True)
def get(item):
 name,url=item; p=ROOT/'raw'/name
 r=subprocess.run(['curl','-4','--connect-timeout','15','--max-time','70','-L','-sS','-D',str(p)+'.headers',url,'-o',str(p)],capture_output=True,text=True)
 return {'file':str(p),'url':url,'exit':r.returncode,'error':r.stderr}
items=[(x+'.json','https://eoncoatings.com/wp-json/wp/v2/'+x+'?per_page=100&_embed=1') for x in ['pages','posts','categories','media','users']]+[('home.html','https://eoncoatings.com/'),('contact.html','https://eoncoatings.com/contact-us/'),('sitemap.xml','https://eoncoatings.com/sitemap_index.xml'),('robots.txt','https://eoncoatings.com/robots.txt')]
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex: results=list(ex.map(get,items))
(ROOT/'fetch-log.json').write_text(json.dumps(results,indent=2)); print(json.dumps(results,indent=2))
