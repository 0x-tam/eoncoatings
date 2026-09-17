# EON image ownership and review

Updated 15 September 2026.

## Delivered

- Added four concise “Why choose EON?” points immediately before HGPP.
- Generated and visually inspected 43 distinct photographs using the built-in image generation tool.
- Saved the final 1536-pixel-wide WebP assets in `public/images/unique-care/`.
- Assigned separate photographs to the homepage, service directory, service scenarios, company pages, industry directory and each industry service card.
- Replaced generic industry descriptions with setting-specific descriptions.
- Preserved the hero camera imagery and existing questionnaire photographs.

## Verification

The rendered-page audit covers 17 main routes, the hero camera assets and all 58 illustrated questionnaire answers. It found 119 image placements with 119 unique photographs after the changes, no missing local files and no near-duplicate pairs at a 64-bit difference-hash distance of five or less. This is a similarity screening threshold, not proof that every conceivable visual similarity is absent. All 43 generated images were also visually reviewed in contact sheets.

The brand logo, repeated display of the HGPP document and the room image's fallback/canvas rendering are identity or single-experience uses, excluded from photograph duplication counts.

Build and TypeScript checks passed. Browser checks covered the homepage trust section and office service cards at desktop and mobile widths, image loading, horizontal overflow and navigation from an office service card.

## Remaining scope

The existing journal redesign remains deferred. Its separate scan found 20 articles using 17 featured images: one source photograph appears on four different articles. Article previews also repeat their article artwork in journal and category/tag/author listings. These are recorded in `journal-image-audit.json`; this delivery does not claim the legacy journal is free of repetition. Legacy concept routes are not part of the main-page audit.

## Sources and repeatable check

- Exact generation prompts and original image paths: `care-image-generation.json` and `sector-image-generation.json`.
- Asset dimensions and sizes: `generated-image-sizes.json`.
- Before and after route-level results: `image-audit-before.json` and `image-audit-after.json`.
- Run `node scripts/audit-content-images.cjs docs/image-audit-after.json` with the preview running on port 5176.
- Keep new photographs assigned to one content placement. Do not use service hero images as fallback imagery for industry cards. Industry mappings live in `lib/eon/photo-placements.ts`.

## People and uniform direction, 15 September 2026

- Do not show faces in website imagery, including questionnaire answers and journal artwork. Use naturally framed hands/torso views or unoccupied spaces. Do not blur or mask faces as a design treatment.
- Where a service technician's chest is visible, use white workwear and the teal EON Coatings logo on the wearer's anatomical upper-left chest pocket, matching the supplied uniform photograph.
- Keep logos out of unrelated surfaces and do not put the chest logo on the sleeve or right chest.
- This pass generated nine distinct replacements using the built-in image generator. Prompts, source paths, before-images and visual review sheets are in `audit/people-review/`.
