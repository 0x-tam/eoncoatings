# Migration restoration — 17 September 2026

This implementation follows the nine-item migration audit in `audit/migration-2026-09-17/REPORT.md`. The new design and pre-existing edits were retained.

1. Replaced the unrelated favicon with the original EON Coatings mark and added the original 300px mark as the touch icon.
2. Restored the exact mission and vision, who-we-are scope, and company trust themes in redesigned About sections.
3. Added appropriate technology, certification, touchpoint and marble-protection information. Every service links to HGPP. Old generic touchpoint lists are scoped to antimicrobial surfaces, not incorrectly copied into mattress or duct cleaning.
4. Replaced the reconstructed certificate display with the authentic dated original. Restored the badge, Institute certificate and protection plaque, additional certificate link, programme benefits, validity explanation and four coating FAQs.
5. Restored the industry directory and wrote distinct benefits for all four sectors. Added source-qualified performance figures and the source furniture comparison. Legacy `/hospitality/` now redirects to the complete current hospitality page.
6. Preserved all 20 existing article bodies byte-for-byte. Appended the missing live-template sections to the five truncated posts, including all seven source illustrations. Their original template text remains unchanged, even where it refers to offices under a different article title. Added related articles, calculated reading times and nine-item archive pagination to restore the old third author page.
7. Added Journal and Industries to main/mobile navigation, global search, free-consultation wording, a click-to-load map and area directions. Removed the potentially self-referential old contact-form link. Email enquiries remain functional. Direct form delivery still needs the four documented owner backend/gateway settings; no live submission has been made. WhatsApp awaits confirmation of the number because the source link is malformed.
8. Restored original missing informational artwork. Replaced old decorative icons with the existing Lucide family. The repeated client testimonial is presented once, with an initials avatar instead of an unverified portrait. Existing redesigned article covers and service photographs are retained.
9. Expanded the privacy page to describe the actual frontend, storage, enquiry methods, map consent, external services and information requests. Added a separate Terms & Conditions page and footer link; it describes website and enquiry behaviour without inventing contractual prices, cancellation charges or warranty terms. EON’s operational retention/provider details remain owner-managed and can be requested via the listed contact address.

## Validation

- TypeScript check passes.
- Production build passes with Node 24.
- Ten existing contact-adapter fixtures pass; no real messages are sent by these fixtures.
- 86 old and current routes return successful responses, including the old author page 3; all rendered image references checked resolve to local files.
- Article preservation check: all 20 original bodies remain unchanged; all missing section headings and bullet items from the five source templates are present.
- Evidence: `audit/migration-2026-09-17/restoration-verification.json` and `verify-restoration.py`.
- No interactive browser/visual regression testing was performed in this implementation turn.

## Owner dependencies

- Confirm the WhatsApp-enabled number; source link uses `971025639468`, while the displayed telephone number normalises to `+97125639468`.
- Configure enquiry delivery as documented in `docs/FORM_INTEGRATION.md`.
- Current hosted Sites audience is public. Publishing this prepared revision requires the public-publishing approval specified by the Sites hosting skill.
