# SEO launch settings

The redesign is not yet live on the final domain. It deliberately defaults to `noindex, follow` in HTML and the X-Robots-Tag response header, including production builds on the staging deployment. The crawler is allowed to read these directives. robots.txt is not an indexing-removal mechanism. [Google: noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

## At the final-domain launch

1. Connect eoncoatings.com to the intended deployment and confirm its TLS certificate. Vercel supplies HTTPS at the edge; application redirects also normalize HTTP and www requests to https://eoncoatings.com. These redirects were tested locally with forwarded headers; live DNS/TLS enforcement still requires a deployment check.
2. Set `SITE_INDEXABLE=true` in the production environment only and rebuild/redeploy. Leave this unset on staging; VERCEL_ENV=preview always stays noindex. Do not use the same indexable production build for an independently public staging domain without host-level noindex/protection.
3. Check the final homepage, services and an article: one canonical under https://eoncoatings.com, index/follow robots and no X-Robots-Tag noindex. Confirm `/sitemap.xml` and `/robots.txt` return 200. Unknown URLs must return 404.
4. Verify Google Search Console. Preferred: add a Domain property for eoncoatings.com and publish Google's exact TXT record in DNS. This can also be completed before the redesign launch if DNS access is available. Alternative: create a URL-prefix property for https://eoncoatings.com/, set `GOOGLE_SITE_VERIFICATION` to the exact token Google supplies, rebuild/deploy, then click Verify. No token is currently supplied, and verification has not been completed. [Google verification instructions](https://support.google.com/webmasters/answer/9008080?hl=en).
5. Submit https://eoncoatings.com/sitemap.xml to Search Console. Inspect the homepage and priority villa, office, cleaning and protection pages. Keep tag/author/category archives and filtered/enquiry variants noindex; canonical main pages remain discoverable.
6. Confirm permanent redirects from `/service/` to `/services/`, `/industry/` to `/industries/`, and the old AC coating URL to `/services/home-villa-ac-duct-cleaning/`. Existing article URLs stay intact. Ask the advertising team to update any affected landing-page destinations.
7. Run PageSpeed Insights on the live homepage, service page and article for mobile and desktop. Local build tests and smaller assets do not prove real-user Core Web Vitals. Monitor Search Console after sufficient live traffic: target LCP <=2.5s, INP <=200ms and CLS <=0.1 at the 75th percentile. [Web Vitals](https://web.dev/articles/vitals).

## What is prepared

Unique service titles/descriptions, shorter article titles, canonical normalization, 1200×630 OG/Twitter image, sitemap, crawlable robots.txt, noindex launch guard, LocalBusiness/Service/BreadcrumbList/Article JSON-LD, contextual article-to-service links, article heading normalization and responsive content rules. Genuine decorative images may keep empty alt text; informative images have alt descriptions. No ratings or performance claims were invented for schema.

Google may rewrite title/description snippets, select a different canonical, or decline a rich result. Schema and sitemap availability do not guarantee indexing or rankings.
