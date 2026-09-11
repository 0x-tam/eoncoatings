# Current EON source inventory

Fresh public GET crawl on 11 September 2026. No Site files were edited and no form was submitted.

content.json contains 20 complete published article bodies, 10 pages, 7 service records with full rendered bodies, 4 industry records with full rendered bodies, 5 categories, 31 tags, 1 public author and 229 returned media records. Article dates, modified dates, category assignments, slugs, author identity, featured images and markup are preserved. renderedMainHtml retains full rendered page evidence where API bodies omit template content.

The media API reports 265 total across 3 pages but exposes 229 records. This discrepancy is recorded, not filled with invented records. Posts, pages, services and industries return the expected invalid-page response after their last page. Categories, tags and users return empty arrays beyond their final page. All three media pages and the rejected fourth page are saved.

The seven real service URLs are under /services/: antimicrobial-surface-coating, ac-duct-mold-resistant-coating, stain-resistant-furniture-coating, marble-protective-coatings, deep-cleaning-of-carpets-furniture, specialty-coatings, mattress-cleaning-and-sanitization. The source service listing has placeholder card links despite these valid detail routes. Preserve and repair their destinations.

Four sector routes are under /industries/: hospitality, education, healthcare and offices. Preserve the separate legacy /hospitality/, /industry/ and /success-stories-client-results/ page paths as deliberate pages or redirects. Do not silently drop them. /media/ is the article index. The sitemap also exposes two Elementor header/footer template routes; these are source template artifacts rather than customer pages.

All 20 posts retain their existing slugs, dates, body content, category assignments and featured media compared with the previous raw crawl. The pages, services, industries and categories have no added or removed records. The only API content difference is the contact page's randomized CAPTCHA markup; after removing that widget its content is identical. deltas.json preserves the mechanical comparison.

The full HGPP body is preserved at https://eoncoatings.com/hgpp-certification/ . Authentic certificate, badge and logo files are in assets/. The page's certification, non-toxic, timing, lifespan and safety language is publisher copy, not independently verified regulatory evidence. Keep attribution and avoid turning those statements into new unqualified guarantees. Source sector copy includes reused claims and needs editorial judgment.

The published privacy policy contains WordPress suggested boilerplate. The footer Terms label uses the privacy destination. Preserve existing legal access while the owner supplies approved distinct terms if needed; do not invent them.

Source contact: info@eoncoatings.com, +971 (02) 563 9468, M17 Mussafah, Abu Dhabi, UAE. Telephone normalization is +97125639468. Source WhatsApp formatting and account activation require owner review. See FORM_ADAPTER_REQUIREMENTS.md for exact live schema and server constraints.

Raw evidence is immutable. Normalized content replaces em dash characters/entities with comma punctuation. Full HTML is archival content and must be sanitized with a maintained allowlist before frontend rendering; renderedMainHtml intentionally includes source widgets and must not be injected blindly.
