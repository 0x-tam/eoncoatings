# Steady photographic camera and surface traces

Corrected camera translation to interpolate the subject position in screen space before subtracting optical scale. The old blend let the subject drift during the approach. Logarithmic zoom now advances continuously instead of accelerating late with a power curve. Durations: AC 1550 ms in / 1250 ms out; fabric and stone 1050 ms in / 900 ms out.

All decoded photographic sources, including feathered tiles, are converted once to immutable ImageBitmap objects when supported. Native resolution and DPR are retained. A decoded-image fallback remains available. Immutable sources are closed on cleanup. Source cropping still bounds draw regions.

The stone photograph was edited with built-in imagegen, preserving composition and adding subtle everyday traces. Native output is 1964 x 801. The tabletop now has camera priority and three selectable explanations: spill residue, touch residue, and pores/particles. Images and copy are illustrative, not a diagnosis. Mobile markers were separated after browser inspection.

Production AC measurement without recording: 187 rAF intervals, median 8.3 ms, p95 10.3 ms, zero intervals above 34 ms. The preceding version's production AC sample had p95 26.8 ms. These are single browser samples, not guarantees on every device. Actual screenshot captures show the forward/reverse path; capture overhead means the animated WebP is not a frame-rate benchmark.

TypeScript and production build passed. Desktop and mobile surface controls were inspected; touch and pore selections were exercised. No public deployment was performed.

Generated asset: assets/zoom-v4/stone-traces.png. Prompt and tool provenance: assets/zoom-v4/PROMPT.md. Capture: evidence/zoom-v4/duct-motion.webp.
