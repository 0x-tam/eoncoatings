# Camera through the grille slot

The room now uses a viewport-sized Canvas2D renderer. Every animation frame draws the native photographic assets at their current size; no CSS transform scales a previously rasterized room layer. The backing store follows device pixel ratio up to 2. It never creates a room-sized canvas at the extreme camera zoom. This is 2D photographic compositing, not 3D geometry.

The closed grille is a 2139x735 native detail tile. Its placement and slight shear were calibrated against black-slot pixel intervals in the original room. A clipped interior photograph sits behind one photographed slot. The camera approaches that slot and passes through it, with no whole-view crossfade or image source swap. The same path reverses. Foreground slats enlarge rapidly as the camera passes between them; the rear inspection image is drawn at viewport size instead of being enlarged with the grille.

Entry durations: 1100ms for the two-stage AC path, 650ms for fabric/stone. Return durations: 750ms for AC, 450ms for fabric/stone. Changing targets reverses the current material path before entering the new one. Reduced motion resolves immediately. Service copy stays in place during return until the room has settled.

Fabric uses a registered 1402x1122 native macro inside the prior fabric tile. Stone uses the prior natural detail tile because the enhanced v2 introduced a visible boundary. Fabric/stone camera magnification was reduced to 3.2x/3.6x. Generated images have finite native resolution; this revision does not claim 4K assets or lossless unlimited magnification. The interior remains illustrative and cannot diagnose the room pictured.

## Visual checks

Actual desktop browser captures in evidence/zoom-v3 show the approach, passage between slats and reverse path. Independent review identified grille registration, stone blending and an exposed interior-image edge on return. After correction, the reviewer reinspected six samples and reported those findings no longer apparent. This is sampled verification, not proof of every frame on every device.

At 390x844 the AC reaches its endpoint, the image area stays at y76 and no horizontal overflow was observed. Desktop photo position stays at y96 after the scroll-anchor correction.

Production validation: 82 routes and 62 referenced assets passed the route audit; native camera asset loading also completed without an error notice. Homepage axe run reported 0 violations and 26 passing checks for its configured WCAG tags. Reduced-motion QA override resolved AC progress immediately to 1. TypeScript and the production build passed. No public deployment was performed.

The animated WebP at evidence/zoom-v3/camera-paths.webp contains 72 sampled screenshots from the production browser, timed from capture timestamps. It shows AC, fabric and stone entry and return. It is a captured sequence, not a frame-rate benchmark. An interrupted AC entry also returned successfully to overview progress 0.
