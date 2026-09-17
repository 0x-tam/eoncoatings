# Below-hero design direction

Inspo MCP 0.1.16 installed on 2026-09-15. Hosted archive queried directly using generic public design terms. No client brief was transmitted. Existing hero preserved. The homepage now implements this direction in components/campaign/HomeCare.tsx.

## References inspected

- Branch Furniture: https://branchfurniture.ca/ . Inspo capture from 2026-05-27. Useful progression from category discovery to context photography and a guided quiz. Borrow deliberate changes of section scale, not promotional sale typography or the long retail page.
- Artek: https://www.artek.fi/en/company/about . Inspo capture from 2026-05-12. Useful restrained editorial composition, prominent photography, concise introduction and grouped expandable detail. Apply to About and HGPP. Retain EON’s larger body text.
- Kononenko Architectural Bureau: https://kononenkogroup.com . Inspo capture from 2026-09-10. Useful project imagery and variation in image scale. Avoid its excessive whitespace and portfolio-style navigation for a service business.

## Recommended homepage sequence

1. Preserve the interactive room hero.
2. Add a brief service-discovery introduction, without a second competing oversized CTA panel.
3. Give AC cleaning and mold-resistant coating a dedicated photographic feature, with a short explanation distinguishing cleaning, sanitisation and coating. Keep Find my service the primary action.
4. Present the complete care range as one image-led service selector. Use accessible buttons and show one relevant photo and concise description at a time; all seven service links remain available. Desktop list beside photo, mobile stacked. No hover-only interaction, autoplay or scroll hijacking.
5. Give HGPP a distinct teal section with a legible certificate, short explanation of the programme and a clear certification link. Retain the certificate-example disclosure; do not imply independent results that have not been supplied.
6. Add a home/workplace photographic pair to explain spaces served, leading into the existing industry content.
7. Combine the current repeated next-step sections into one short three-step process and a clear finder CTA. Keep FAQs compact. Journal overhaul remains deferred.

## Implementation constraints

Preserve hero, photographic direction, logo palette, blue rounded CTAs, large readable supporting text and all service routes. Limit liquid glass to controls sitting over photography. Prefer open layouts and dividers over repeated bordered cards. Use real supplied evidence for proof. No invented reviews, statistics, promises, emojis, em dashes or 3D.

Build and inspect a below-hero preview before replacing the existing page. Validate keyboard use, mobile reading order, text overflow, finder modal, service routes and image loading.

## Implemented preview

Added AC feature, seven-service image selector, teal HGPP certificate section, home/workplace photographic section, and consolidated next-step section with finder launch and FAQs. The hero component was not edited. Existing service detail pages and the journal remain unchanged.

Verified production build and TypeScript; desktop service switching; mobile selected service, image loading and no horizontal overflow; HGPP presentation; finder modal opens from the new CTA. Inspo recommend was used through the installed connector with a generic public design brief, reusing the reference study above.
