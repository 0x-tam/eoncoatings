# EON Coatings: Surface Protection That Performs

A responsive, image-led EON website covering specialist surface coatings, interior cleaning and AC care. Includes 18 generated illustrative assets, detailed service scenarios, a separate original Three.js study, complete source content and an honest email-draft enquiry flow.

## Run locally

Use Node.js 22.13 or newer. The retained lockfile uses npm.

```sh
npm ci
npm run dev
```

The development URL is http://localhost:5173/. On this workspace, a compatible bundled Node is available at `/Users/Tamam/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`.

```sh
npm run build
npm start
```

`npm start` serves the built Cloudflare Worker locally through Wrangler. The private Sites project is retained in `.openai/hosting.json`; no DNS or live EON production configuration was changed.

## Validation

```sh
npx tsc --noEmit
npx eslint app components/eon lib/eon --ignore-pattern '*.json'
node --test tests/*.test.mjs
node scripts/check-content.mjs
node scripts/audit-routes.mjs http://localhost:5173
```

Use a running production preview origin for the route audit when checking a release. The audit records all 48 routes and redirects, local assets, title/H1 presence, forbidden punctuation and the 404 response. Tests cover deterministic timeline reconstruction and CF7 response semantics using local fixtures only.

## Editing

- `lib/eon/service-stories.ts`: service-specific use cases, materials and applications.
- `components/eon/SurfaceExplorer.tsx`: visual catalogue, filters and setting selector.
- `app/inside-the-air/page.tsx`: optional interactive duct study.
- `lib/eon/content.ts`: seven-service editorial descriptions and coating FAQs.
- `lib/eon/source-content.json`: sanitized public archive and retained company content.
- `app/[...slug]/page.tsx`: detail, company, legal, article and category routes.
- `components/eon/`: shell, contact, media and reusable editorial components.
- `app/globals.css`: design tokens and responsive layouts.
- `lib/eon/duct-assembly.ts`: reproducible model geometry, materials and seeded dirt.
- `lib/eon/story-state.ts`: deterministic normalized timeline.
- `lib/eon/duct-renderer.ts`: lighting, camera fit, rendering and disposal.
- `assets/`: generated masters, visual targets and exact provenance.
- `public/model/`: runtime-matching WebP stills.
- `evidence/`: raw public evidence, route audit, screenshots and lab measurements.

The source crawl is immutable under `evidence/source`. `scripts/prepare-content.py` sanitizes its HTML and normalizes punctuation. `scripts/cache-source-media.py` downloads referenced public archive images and rewrites their local paths. Run these in that order when deliberately refreshing the saved snapshot. They do not crawl a new article archive themselves.

To update model stills, open `/inside-the-air/?capture=model` to hide interface overlays, then capture the actual canvas at each chapter with the in-app browser, save full viewport PNGs and canvas rectangle records in `evidence`, then run `scripts/export-posters.py` with Python and Pillow. Do not replace the posters with a different generated duct. Geometry source is the model deliverable; no external mesh download is required.

## Enquiry integration and launch dependencies

See `docs/FORM_INTEGRATION.md`. The preview prepares an email for visitor review and links to EON's current protected form. It does not submit an enquiry from this frontend or claim delivery. `lib/eon/cf7-adapter.ts` is an unconnected typed integration seam tested with fixtures.

A direct form launch requires a stable separate WordPress backend, its live anti-bot flow, owner-configured recipient/SMTP and an authorised staging delivery test. Reserved configuration names are `EON_FORM_BACKEND_ORIGIN` and `EON_FRONTEND_ORIGIN`; they are not active preview secrets. No CAPTCHA solution is hardcoded. Do not point a future proxy back to the new frontend itself.

The source privacy policy includes WordPress Suggested text. EON should supply its completed policy before a public launch. The original WhatsApp destination has a numbering defect and remains unverified; phone and email work as native links.

## Deployment and search

The current build is a private design preview and is noindex. Canonicals preserve EON's original public URLs. Before an authorised live-domain release, update robots metadata and robots.ts, confirm legal copy and form delivery, and review source claims with the owner. Private publishing does not change eoncoatings.com.

Build output is packaged with the installed Sites `package-site.sh` helper and saved against the exact pushed source commit. Model, source, prompts and original imagery remain maintainable in this project.

## Evidence and limits

`docs/QA_REPORT.md` distinguishes implemented, verified and unverified work. Browser evidence is desktop emulation using the Codex in-app browser, not physical phone or human screen-reader certification. Performance figures are local lab observations, not field Core Web Vitals.
