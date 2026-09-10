exec(open('/private/tmp/eon-research/normalize.py').read())
for typ in ['services','industries']:
 for x in d[typ]:
  f=raw/(({'services':'service','industries':'industry'}[typ])+'--'+x['slug']+'.html');s=f.read_text();body=s.split('</header>',1)[-1].split('<footer',1)[0];body=norm(body);ins=Inspect();ins.feed(body)
  x.update(contentHtml=body,contentText=plain(body),headings=ins.headings,links=list(dict.fromkeys(ins.links)),images=ins.images)
(R/'content.json').write_text(json.dumps(d,ensure_ascii=False,indent=2))
with (R/'CONTENT_INVENTORY.md').open('a') as f:
 f.write('\n\n## Sitemap-discovered detail routes\nSeven service and four industry detail pages are public. Their complete body HTML has been captured and normalized in services and industries arrays. The service index card href values were placeholder # links, so detail routes were found independently in wp-sitemap.xml.\n')
 for x in d['services']+d['industries']:f.write(f"- [{x['title']}]({x['url']})\n")
 f.write('\nSource privacy policy is unedited WordPress Suggested text boilerplate; the owner should supply an applicable policy. /sitemap_index.xml returns 404; /wp-sitemap.xml returns 200. Posts page=2 returns HTTP 400 invalid page, confirming all 20 published articles were retrieved.\n')
with (R/'SOURCE_LEDGER.md').open('a') as f:
 f.write('\nAdditional public requests: fetch-extra-log.json and fetch-custom-log.json. Authentic assets: asset-log.json plus header-logo.png and footer-logo.png from original EON uploads.\n')
 for p in sorted((R/'assets').glob('*')):f.write(f'\n- assets/{p.name}: SHA-256 {hashlib.sha256(p.read_bytes()).hexdigest()}')
print('Augmented services and industries:',[(x['slug'],len(x['contentText'].split())) for x in d['services']+d['industries']])
