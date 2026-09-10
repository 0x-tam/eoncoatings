import json,re,html
from html.parser import HTMLParser
from pathlib import Path
class Cleaner(HTMLParser):
 def __init__(self,article=False):super().__init__(convert_charrefs=True);self.result=[];self.skip=0;self.article=article;self.stack=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag in ['script','style','form','svg','button','iframe']:self.skip+=1;return
  if self.skip:return
  if tag in ['p','h1','h2','h3','h4','h5','h6','ul','ol','li','strong','em','b','i','blockquote','br','table','thead','tbody','tr','th','td']:
   self.result.append('<'+('h2' if tag=='h1' else tag)+'>')
  elif tag=='a':
   u=a.get('href','').strip()
   if u=='/contact-us-1/' or u=='https://eoncoatings.com/contact-us-1/':u='/contact-us/'
   if not re.match(r'^(https?://|mailto:|tel:|/|#)',u,re.I):u='' 
   if u.startswith('https://eoncoatings.com/'):u=u.replace('https://eoncoatings.com','')
   if u and u!='#' and not u.startswith('javascript:'):self.result.append('<a href="'+html.escape(u,quote=True)+'">')
   else:self.result.append('<span>')
   self.stack.append(bool(u and u!='#' and not u.startswith('javascript:')))
  elif tag=='img' and self.article and a.get('src'):
   self.result.append('<img loading="lazy" src="'+html.escape(a['src'],quote=True)+'" alt="'+html.escape(a.get('alt',''),quote=True)+'"/>')
 def handle_endtag(self,tag):
  if tag in ['script','style','form','svg','button','iframe']:
   self.skip=max(0,self.skip-1);return
  if self.skip:return
  if tag in ['p','h1','h2','h3','h4','h5','h6','ul','ol','li','strong','em','b','i','blockquote','table','thead','tbody','tr','th','td']:self.result.append('</'+('h2' if tag=='h1' else tag)+'>')
  elif tag=='a' and self.stack:self.result.append('</a>' if self.stack.pop() else '</span>')
 def handle_data(self,s):
  if not self.skip:self.result.append(html.escape(s))
def normalize(s):return re.sub(r'\u2014|&mdash;|&#8212;|&#x2014;',',',s,flags=re.I)
x=json.load(open('evidence/source/content.json'))
out={}
for kind in ['posts','pages','services','industries']:
 out[kind]=[]
 for r in x[kind]:
  c=Cleaner(kind=='posts' or r['slug']=='hgpp-certification');c.feed(r['contentHtml']);r['contentHtml']=normalize(''.join(c.result));r['contentText']=normalize(r['contentText']);r['title']=normalize(r['title']);r['excerptHtml']=normalize(r['excerptHtml']);out[kind].append(r)
out['categories']=x['categories']
Path('lib/eon/source-content.json').write_text(normalize(json.dumps(out,ensure_ascii=False)))
