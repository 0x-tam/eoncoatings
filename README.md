Latest revision: bright photographic room hero, AC duct cleaning first, matching fabric/stone/duct inspection images. See docs/ROOM_REVISION.md and assets/room/PROMPTS.md. Local production preview: http://127.0.0.1:5176/. Public publication remains unchanged.

# EON Coatings: Life, well kept.

Complete campaign website with original photography, a material explorer, seven service pages and the source article/archive library. Current campaign source is this life-well-kept worktree. Older concepts in the parent folder were left intact.

## Run

Use Node 22.13 or later, preferably Node 24. Install the locked dependencies with npm ci. Run npm run dev for the development preview or npm run build for the Worker production output. This checkout currently uses a local node_modules symlink to the parent installation; a fresh checkout should run npm ci normally.

The current development preview runs at http://localhost:5175/. The default package script otherwise selects port 5173; pass --port 5175 when needed. Build output is Cloudflare-compatible Worker ESM in dist/server with client assets in dist/client. The local production command is npm run start with an explicit free port. Keep production and development previews separate.

## Design and content

- docs/DESIGN.md: campaign selection, typography, compositions and interaction storyboard.
- assets/campaign: generated masters, prompts, rejected studies, exact detail crops, compressed variants and manifest.
- assets/source-2026-09-11: fresh EON source archive, verified routes and contact schema.
- docs/CONTENT_INVENTORY.md: complete content and migration decisions.
- docs/QA_REPORT.md and evidence/campaign: actual checks, screenshots and limits.

All generated campaign imagery is illustrative. EON's genuine logo and published HGPP materials remain separate. The available image generator returned native 1536x1024 landscape images despite a higher-resolution request. That limitation is recorded in the manifest.

## Contact configuration

With no environment values, the contact form prepares an email draft and never claims to send it. Telephone and email links work independently. Direct online delivery requires EON's stable WordPress backend plus a genuine one-use verification/rate-limit gateway. The server endpoint and field adapter are implemented, but those owner services and secrets are not configured. See docs/FORM_INTEGRATION.md and .env.example for the exact contract. Never test by sending an unapproved live enquiry.

## Validation

- node --test tests/campaign-contact.test.mjs
- node scripts/audit-campaign.mjs http://localhost:5175
- node scripts/check-content.mjs
- node node_modules/typescript/bin/tsc --noEmit

A preview-only quality panel is available with ?qa=1. It runs local axe-core checks, and its reduced-motion button tests the motion-free CSS presentation without changing system preferences. ?qa=1&failAir=1 exercises the optional air-image failure path. These controls are absent on ordinary URLs.

## Hosting

Reuse the project_id in .openai/hosting.json. Validate, commit and push this exact worktree, then package production output with the current Sites helper. Do not publish the unrelated parent checkout. The existing hosted Site currently has public access, so replacing that public version requires the final audience-specific approval. No DNS change is part of this delivery. Canonicals target eoncoatings.com; preview robots remain noindex/nofollow.

Do not enable production indexing until the owner approves the final domain, policy text, contact backend and publication. The existing privacy policy contains source WordPress suggested text and remains marked for owner review.
