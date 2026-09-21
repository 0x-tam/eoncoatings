# Service overview QA

Source: /Users/Tamam/.codex/generated_images/01a0afc7-2499-7af0-bd37-2c7318446ea7/exec-61c93565-8c42-4218-b836-ca4367d9ccdb.png
Implementation: evidence/service-overview/desktop.png
Combined comparison: evidence/service-overview/comparison.jpg
State: homepage overview, light theme. Desktop viewport 1536 × 1024; source 1536 × 1024; browser capture 1521 × 974 (browser capture excludes scrollbar/viewport edges), normalized to source dimensions for comparison. Mobile checked at 390 × 844; document width 375 with no page overflow; horizontal scrolling confined to service navigation.

## Findings and iteration
Initial desktop comparison: P2 hero too tall, pushing service labels below visible capture. Reduced desktop overview hero maximum from 640px to 540px. Recaptured and compared side by side: all seven images and labels visible; no remaining P0/P1/P2 issues.

## Required surfaces
- Typography: retained website font and weights rather than imitating raster mock typography; readable labels and heading. Intentional existing-brand variation.
- Spacing: seven evenly spaced tiles with dividers, compact hero and floating material navigation. Matches intended hierarchy. Mobile becomes a swipeable strip.
- Colors: existing cream, teal and purple tokens retained, including dark theme token support.
- Images: seven optimized photographic WebP assets, all confirmed loaded. AC shows separately installed residential and commercial systems. New individual crops follow approved direction; modest differences from the concept accepted.
- Copy: all seven approved labels present and linked to corresponding existing service slugs. Existing hero copy preserved.

Full-view comparison makes the service labels, image crops and navigation readable; no additional focused comparison required.

## Interaction checks
Keyboard Tab focuses the next service with a solid visible outline. CSS implements hover lift, image zoom, underline and arrow reveal on fine pointers only. Reduced-motion media query removes transitions and transforms. Direct pointer hover simulation unavailable in browser API; CSS reviewed. All seven hrefs inspected. Console error check returned none. Next production build and TypeScript passed before final CSS-only height adjustment.

## Checklist
- [x] Approved service strip implemented
- [x] Desktop and phone layouts inspected
- [x] Image loading and link mapping checked
- [x] Focus and reduced-motion behavior provided
- [x] Production build passed

final result: passed
