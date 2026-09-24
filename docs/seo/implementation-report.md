# SEO implementation, 24 September 2026

Changes are local and not pushed or deployed. Production build and TypeScript passed.

| Request | Result |
|---|---|
| Noindex | Default staging guard in both HTML robots metadata and HTTP headers. Launch requires SITE_INDEXABLE=true and a rebuild. Preview deployments remain noindex. |
| Meta titles/descriptions | Unique service copy, shorter article titles, existing page descriptions retained. No crawled titles over 70 characters. |
| Alt text | Informative images checked, hero alt added and service-image descriptions improved. Decorative images retain empty alt where appropriate. |
| Core Web Vitals | Compressed images, prioritized hero loading over zoom tiles, preloaded the font actually used, removed production diagnostic observers, reduced static homepage client JavaScript and media-page serialized data. Real-user CWV is not yet measured or claimed to pass. |
| Sitemap | `/sitemap.xml` returns 200 and lists canonical content URLs, excluding finder redirects and noindex archives. |
| OG image | Added a 1200×630 branded room image for Open Graph and Twitter cards, with dimensions and alt text. |
| Broken links | All crawled internal page links, 84 local image/document paths and article fragments pass. Replaced an accidental Google Docs draft link with the surface-coating service. LinkedIn confirmed; Instagram/Facebook could not be verified by the web fetcher and were preserved. |
| Heading hierarchy | Normalized imported article headings and matching table-of-contents anchors. No skipped heading levels in the final crawl. |
| Backlinks | Separate 90-day plan with specific relationship leads, useful content proposals and tracking fields. No outreach sent. |
| URL slugs | Plural `/services/` and `/industries/`, plus `/services/home-villa-ac-duct-cleaning/`. Historical URLs return permanent 308 redirects. Existing descriptive article URLs retained. |
| Internal links | Shared links use canonical URLs; added relevant article-to-service links and corrected navigation active states. |
| Canonicals | Absolute HTTPS canonicals, including normalized new paths and canonical main pages for filtered/enquiry URLs. |
| HTTPS | Configured HTTP-to-HTTPS and www-to-apex redirects with HSTS on the final domain. Local header-based tests passed. Live DNS, TLS and edge behavior require a launch check. |
| Image compression | Audited tracked raster assets; 231 smaller versions generated, 70,014,925 to 30,368,696 bytes for changed assets (56.6% less). Converted large suitable PNGs to WebP and updated references. Original PNG downloads retained; no claim that total disk usage fell by 39.6 MB. Source certificates use lossless PNG optimization rather than lossy document conversion. |
| Schema | LocalBusiness throughout; Service and BreadcrumbList on all eight service pages; Article data includes image and canonical page. No fabricated ratings. |
| Search Console | Verification token support prepared. Verification and sitemap submission pending the Google token/DNS record and domain access. |
| One H1 | All 43 crawled routes produce exactly one H1. The finder redirect resolves to the homepage, so it shares that page's title rather than being separate content. |
| robots.txt | Generated endpoint with API crawl exclusion and sitemap reference; pages remain crawlable so crawlers can read noindex. |
| Mobile responsiveness | Improved long-text wrapping, tables, search filters and breadcrumb wrapping. Checked homepage and representative templates at 320/390/768px; no page-level horizontal overflow. Desktop zoom and finder opening verified. |

## Evidence and limits

- `final-crawl.json`: 43 routes, metadata, headings, image/link inventory and parseable JSON-LD. Zero reported failures.
- `link-audit.json`: 84 local images/documents; zero missing assets or broken fragments.
- `redirect-audit.json`: permanent legacy-path and canonical-host/scheme redirects; unknown route returns 404.
- `responsive-checks.json`: representative phone/tablet template checks. This is not an exhaustive physical-device test.
- `home-js-before.json` and `home-js-after.json`: homepage script gzip-size estimate reduced from 276,308 to 230,685 bytes (16.5%) by moving static HomeCare to server rendering. These are locally gzipped payload estimates, not measured field transfer timings.
- `image-optimization.json`: per-file compression ledger.

No PageSpeed score, real-user LCP/INP/CLS pass, search ranking improvement or rich-result eligibility is asserted. Complete `launch-checklist.md` when publishing and use `backlink-plan.md` for off-site work.
