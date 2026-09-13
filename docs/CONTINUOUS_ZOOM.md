# Continuous photographic zoom

The room, AC, fabric and stone are a permanent composite. Selection moves a single photographic camera element using translation and scale. No destination photograph is swapped or faded in. A 1.9 second eased transition reverses on Back. Phone layouts keep the image above the copy at a fixed height. Reduced motion disables animation. Markers reappear after the return movement.

## Assets

Native generated masters are preserved in `assets/continuous-zoom/`; WebP delivery assets are in `public/images/continuous-zoom/`. No files were upscaled.

| Asset | Native pixels | Registered rectangle in 1672 x 941 room |
| --- | --- | --- |
| Room | 1672 x 941 | Entire room |
| AC | 2140 x 735 | x976 y44 w303 h103 |
| Fabric | 1573 x 1000 | x1160 y580 w512 h325 |
| Stone | 1962 x 801 | x610 y635 w490 h200 |

The room edit opens the middle AC grille while retaining the architecture, couch and table. The AC detail was generated from that room and registered to the visible aperture. Fabric and stone were generated from exact source crops, with their instructions and correspondence findings preserved alongside the assets. Fixed feather masks blend the outer 8 percent of each tile. Fine textures are generated reconstructions, not exact recovered measurements. The AC shows an open inspection section with dust along the lower edge, not a camera travelling around a bend into an unseen duct. Microorganisms remain explicitly illustrative.

## Verification

- TypeScript passed. Production build passed.
- Production route audit: 82 routes and 65 assets, no failures.
- Desktop browser inspection of overview, AC, fabric, stone, forward and reverse camera movement. Image URLs remain unchanged and photographic opacity remains 1.
- At 390 x 844, the photograph remains at y76 with height340 before and after selection. Fabric and stone were visually inspected; all four image layers loaded and no horizontal overflow was observed. Focus returns to the invoking control without scrolling the image away.
- Homepage automated accessibility check: zero violations, 25 checks passed for the configured WCAG tags. This is not a complete accessibility certification.
- Reduced motion QA override: computed camera transition is 0 seconds.
- Independent reviewer inspected endpoints and nine intermediate browser screenshots. No obvious rectangular seams or doubled geometry were found in those samples. The reviewer identified overview text interference and prematurely returning markers; both were corrected. The reviewer then reinspected three corrected reverse samples and confirmed misplaced markers were absent.

`evidence/continuous-zoom/camera-paths.webp` is an animated sequence of actual production browser screenshots with measured capture intervals. It samples the three forward/reverse interactions after click dispatch. It is not a frame-perfect screen video or a frame-rate benchmark. Native screenshots and audit results are alongside it.

The local production preview is http://127.0.0.1:5176/. No public deployment was performed for this revision.
