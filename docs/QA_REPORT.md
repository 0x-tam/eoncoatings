# Verification report

## Revision 2, current design

The first visual design was rejected by the user. Revision 2 replaces the opening, navigation, service catalogue, all service detail presentations and sector introductions. Seven new original scenario images complement the existing collection. The homepage has no WebGL canvas. The revised interactive duct study is at /inside-the-air/.

Current evidence is in evidence/v2. The homepage passed overflow and hero-content-fit checks at eight viewport sizes, from 360x800 to 1920x1080, including short landscape. All seven service pages were checked at 360x800: no horizontal overflow, clipped hero content or broken images. Service filters, direct cleaning navigation, hospitality selection, its mattress-service link, mobile menu Escape/focus return and keyboard range scrubbing were verified. New service images have responsive derivatives.

The route audit now covers 48 routes and 46 directly referenced assets, with no failures and a real 404. TypeScript, production build and six fixture/timeline tests pass. Lint has zero errors and 21 intentional static-image optimization advisories. Image derivatives and lazy loading are explicit. Independent visual review found no P1/P2 issues in the new opening, catalogue and hospitality captures.

The lighter-view check uncovered an empty canvas container obscuring the poster. Disposal now clears its ready flag, and the repaired view was visually verified with zero canvases and four static panels. Model-only export mode hides interface overlays; fresh stills were inspected and do not include captions. Use /inside-the-air/?capture=model when regenerating the model frames.

Current unthrottled local production homepage observations at 390x844: initial LCP 148 ms, CLS 0.00163 and 671,166 bytes transferred in the sampled initial window. Five warm reloads recorded LCP 84, 64, 68, 80 and 60 ms, median 68 ms, with zero sampled CLS and long tasks. These are local lab observations, not mobile-network or field benchmarks. Raw records: evidence/v2/production-lab.json.

External validation and form integration limitations below still apply. Older screenshots and metrics below describe revision 1 and must not be used as evidence of the current visual design.

## Revision 1, historical checks

Verified 11 September 2026 in the Codex in-app Chromium browser on the local Mac. This is a private review build. It is not a claim of live EON enquiry delivery or universal device certification.

## Automated checks

Production build and TypeScript pass. Three deterministic timeline tests cover clamps, transitions, clean hold and reverse/interrupted progress. Three backend-adapter fixture tests verify failure handling without sending live requests. The route audit covers 47 source and new routes, including five category redirects and the obsolete contact alias. All expected destinations respond successfully with one h1, 39 referenced local assets resolve, and the unknown route returns a real 404. Authored content passes the zero em dash check. Immutable research snapshots retain source punctuation.

## Interaction and visual evidence

The browser checks cover chapter jumps, reverse progress, desktop/mobile resizing, static lighter mode, actual WebGL context loss, offscreen rendering pause, navigation focus trapping, Escape and focus return, archive search, category state, load more, article navigation and back navigation. Contact checks cover required fields, conditional company field, phone validation and correctly encoded email draft. No live enquiry was sent.

Eight captured viewport sizes: 1440x900, 1920x1080, 1280x800, 1024x768, 768x1024, 390x844, 360x800 and 844x390. No horizontal overflow was found. Short landscape uses an unpinned layout. The five final model states are recaptured at desktop and mobile sizes in evidence/desktop-*.png and evidence/mobile-*.png. These exact renders generate the fallback WebP images, not AI illustrations of an unrelated object.

Independent content review findings were repaired: category redirects, contact alias, qualified industry claims and restored HGPP informational imagery. Visual review prompted a larger duct, quieter zinc texture, opaque header and descriptive active chapter labels on mobile. The duct remains an illustrative procedural model, not recorded service evidence.

## Local performance observations

Five warm-cache production reloads at 390x844: LCP 84, 72, 88, 76 and 72 ms, median 76 ms. CLS was 0 in all five runs and no long tasks were observed in the sampled post-load window. One earlier initial load recorded LCP 156 ms, CLS 0.0013 and about 502 KB transferred. The scene reports 11,230 triangles and 82 draw calls. A chapter click reached the next frame in 3.6 ms. Rendering stayed unchanged while the story was offscreen.

These are unthrottled local lab observations, not field INP, representative mobile-network LCP or sustained 60 fps proof. Raw measurements are in evidence/production-lab-runs.json. Local instrumentation transmits nothing.

## Remaining external validation and launch dependencies

Real iOS Safari, Android devices, Firefox, screen reader testing, OS reduced-motion and Save-Data emulation, browser 200 percent zoom, sustained frame-rate profiling and throttled network benchmarks were unavailable or not completed. Reduced-motion, Save-Data and no-JavaScript fallbacks are implemented, with explicit lighter-mode and context-loss fallback checked in the browser.

Direct enquiry delivery requires owner-provided backend configuration, the protected CAPTCHA integration and a safe staging recipient. The review form explicitly prepares an email draft and links the existing protected EON form. The source privacy policy contains WordPress suggested language and needs owner review. WhatsApp account validity needs owner confirmation. Private preview remains noindex. EON production and DNS were not changed.
