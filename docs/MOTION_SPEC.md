# Duct motion and construction

Model source: lib/eon/duct-assembly.ts. Renderer: lib/eon/duct-renderer.ts. Timeline: lib/eon/story-state.ts. HTML owner: components/eon/DuctStory.tsx.

Procedural dimensions are illustrative metres: 1.6 long, .72 wide, .56 high, with a .25 continuation. Thin folded plates, end flanges, longitudinal seams, captive hexagonal fasteners, four roof panels surrounding a real hatch aperture, hatch handle, gasket, fixed lower channel and internal dust are separate named parts. Repeated fasteners merge by parent. Deposits use seeded instancing.

A single p in [0,1] controls every transform. 0 to .12 assembled; .12 to .30 hatch and virtual shells separate; .30 to .44 dirty hold; .44 to .66 cleaning front moves along local x; .66 to .79 clean hold; .79 to .92 close; .92 to 1 assembled. The dust shader is surface-bound and leaves the underlying metal unchanged. It is not a measured EON result. Coating is not added to this sequence.

Native scroll uses 480svh desktop and 310svh mobile. No wheel interception, orbit controls or smooth-scroll library. Chapter buttons move directly to normalized states; the skip link moves to normal service content. Motion is reversible and independent of callback order. Camera framing projects cached construction bounds into camera space to fit both assembled and exploded states. Mobile reduces separation distance.

One renderer, deferred import, no idle loop. Scroll state owns visibility from cached section bounds; resize refreshes dimensions. Frames run only after an input or size change and stop when hidden or offscreen. All resources and listeners are disposed on unmount. WebGL context loss restores the lighter presentation.

Reduced motion, save-data and user-selected lighter view use the model's own static sequence. Scripts disabled also exposes static content through noscript CSS. Poster states are exported from the same model and camera calculations. Desktop and mobile stills use their own compositions.

Actual scene budget in the first browser review: 11,230 visible triangles and 82 calls. This is below both stated triangle caps and below the mobile 100-call cap. Performance and final measurements belong in QA_REPORT.md.
