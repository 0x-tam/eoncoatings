import pathlib,json,hashlib,urllib.parse,re
R=pathlib.Path('/private/tmp/eon-life-well-kept/content');d=json.loads((R/'content.json').read_text());inv=json.loads((R/'route-inventory.json').read_text());by={x['url']:x for x in inv};out=[]
for k in ['posts','pages','services','industries','categories','tags','authors']:
 for x in d[k]:
  u=x['link'] if k in ['categories','tags','authors'] else x['url'];rec=by[u];out.append({'path':urllib.parse.urlparse(u).path,'kind':k,'sourceUrl':u,'status':rec['status'],'canonical':rec['canonical'],'title':rec['title'],'count':x.get('count'),'recommendation':'preserve','rawFile':rec['file']})
for u,r in by.items():
 if '/page/' in u:out.append({'path':urllib.parse.urlparse(u).path,'kind':'archivePagination','sourceUrl':u,'status':r['status'],'canonical':r['canonical'],'recommendation':'preserve pagination or permanent redirect to matching filtered archive with equivalent article access','rawFile':r['file']})
 if '/elementor-hf/' in u:out.append({'path':urllib.parse.urlparse(u).path,'kind':'sourceTemplateArtifact','sourceUrl':u,'status':r['status'],'canonical':r['canonical'],'recommendation':'exclude from new sitemap; permanent redirect to homepage if retaining legacy URL compatibility, not a customer page','rawFile':r['file']})
(R/'required-routes.json').write_text(json.dumps(out,indent=2))
counts={k:sum(x['kind']==k for x in out) for k in dict.fromkeys(x['kind'] for x in out)}
lines=['# Exact route decisions','',f'82 unique HTTP 200 HTML URLs verified: {counts}. The earlier 80 count preceded the final two empty tag archives. This is 41 primary content routes, 37 first-page taxonomy/author archives, 2 archive pagination URLs and 2 template artifacts. There are 80 customer-content/archive URLs when excluding the 2 Elementor template artifacts. There is no evidence for a 48-page count.','','Only discovered live archive pagination: /author/eon-coating/page/2/ and /category/blog-articles/page/2/. Full link inventories allow verification. Preserve these URLs, or redirect deliberately to equivalent author/category filtering. Do not redirect every archive to an unfiltered homepage.','','All 31 API tag records were checked: 29 populated tags plus 2 empty tags. Five categories include empty Uncategorized. Empty archives are source routes; keep an honest empty state or explicit relevant archive redirect.','','The two Elementor header/footer routes are implementation artifacts. They do not need replicated customer pages. Recommended compatibility handling is a permanent homepage redirect and exclusion from the new sitemap. That is an editorial migration decision, not a claim they currently redirect.','','| Path | Kind | Status |','|---|---|---|']
for x in out:lines.append(f"| {x['path']} | {x['kind']} | {x['status']} |")
(R/'ROUTE_DECISIONS.md').write_text('\n'.join(lines))
ledger=['# Source ledger','','Fresh public read-only requests on 11 September 2026. Request URLs, statuses and response hashes are in initial-fetch.json, follow-fetch.json, extra-fetch.json and final-fetch.json. Headers are retained beside responses. No enquiry submitted.','','| File | SHA-256 |','|---|---|']
for p in sorted((R/'raw').iterdir()):ledger.append(f'| raw/{p.name} | {hashlib.sha256(p.read_bytes()).hexdigest()} |')
for p in sorted((R/'assets').iterdir()):ledger.append(f'| assets/{p.name} | {hashlib.sha256(p.read_bytes()).hexdigest()} |')
(R/'SOURCE_LEDGER.md').write_text('\n'.join(ledger))
print(counts)
