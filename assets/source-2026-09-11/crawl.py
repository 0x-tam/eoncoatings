import concurrent.futures,subprocess,json,pathlib,re,datetime,urllib.parse,hashlib
R=pathlib.Path('/private/tmp/eon-life-well-kept/content');(R/'raw').mkdir(exist_ok=True)
def get(item):
 name,url=item;p=R/'raw'/name;r=subprocess.run(['curl','-4','--connect-timeout','15','--max-time','65','-L','-sS','-D',str(p)+'.headers',url,'-o',str(p)],capture_output=True,text=True)
 headers=pathlib.Path(str(p)+'.headers').read_text() if pathlib.Path(str(p)+'.headers').exists() else '';status=re.findall(r'HTTP/\S+ (\d+)',headers)
 return {'file':'raw/'+name,'url':url,'curlExit':r.returncode,'status':int(status[-1]) if status else None,'error':r.stderr,'sha256':hashlib.sha256(p.read_bytes()).hexdigest() if p.exists() else None}
items=[(k+'.json','https://eoncoatings.com/wp-json/wp/v2/'+k+'?per_page=100&_embed=1') for k in ['posts','pages','service','industry','categories','users','media']]+[(k+'.html','https://eoncoatings.com/'+('' if k=='home' else k+'/')) for k in ['home','contact-us','hgpp-certification']]+[('wp-sitemap.xml','https://eoncoatings.com/wp-sitemap.xml'),('robots.txt','https://eoncoatings.com/robots.txt'),('cf7-routes.json','https://eoncoatings.com/wp-json/contact-form-7/v1/'),('cf7-schema.json','https://eoncoatings.com/wp-json/contact-form-7/v1/contact-forms/6101/feedback/schema')]
with concurrent.futures.ThreadPoolExecutor(max_workers=7) as ex:logs=list(ex.map(get,items))
(R/'initial-fetch.json').write_text(json.dumps(logs,indent=2));print(json.dumps(logs,indent=2))
