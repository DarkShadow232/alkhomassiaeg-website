# Concept B Test Summary

Date: 2026-08-09

## Media validation

- Inspected all four supplied MP4s at start, midpoint and final frame.
- Clips 1–3 are 1280×720; clip 4 is 1108×828. All are 24 fps, 193 frames and approximately 8.04 seconds.
- The route is visually continuous: exterior approach → factory entrance → dyeing hall → finishing/rolling line.
- Boundary mean absolute pixel differences: 1→2 `8.678`, 2→3 `2.942`, 3→4 `6.141`; all passed the matched-boundary threshold.
- Extracted 189 desktop frames at 1280×720 and 93 mobile frames at 720×1280.
- Dropped the duplicated first sampled frame from clips 2–4.
- Visually inspected desktop and mobile contact sheets. Subjects remain legible, mobile crops preserve the factory entrance, dyeing machinery and finishing line, and no frame is stretched.

## Automated validation

| Check | Result | Coverage |
|---|---|---|
| Production build | Pass | Vinext client, server, RSC and SSR environments |
| ESLint | Pass | React hooks, TypeScript, accessibility lint configuration |
| Rendered HTML tests | Pass | Arabic/RTL shell, verified facts, contact flow, prohibited-data scan, no video scrub |
| Sequence tests | Pass | Exactly 189 desktop and 93 mobile frames |
| Canvas implementation | Pass | GSAP ScrollTrigger, DPR cap, object-cover drawing, current-frame cache, resize redraw |
| Loading/failure contract | Pass | 60% threshold, all-settled accounting, 9-second safety timeout, static fallbacks |
| Reduced-motion contract | Pass | Static chapter layout and animation suppression |

## Responsive and accessibility implementation

- Desktop uses the full 189-frame 16:9 sequence and four-column capabilities layout.
- Mobile uses the lighter dedicated 93-frame 9:16 sequence, shorter pinned journey, safe caption area and touch-sized controls.
- The mobile menu traps focus, closes on Escape and restores focus.
- The language control updates `lang` and `dir`; Arabic remains the default.
- The quotation form uses labels, required states, consent and an honest email fallback.
- Canvas is decorative to assistive technology; reduced-motion users receive readable static chapters.

## Browser limitation

The in-app automation browser could not claim the localhost preview (`net::ERR_BLOCKED_BY_CLIENT`), and the private deployment exposed its sign-in gate to automation. Build, source, sequence and rendered-output validation therefore carry the automated QA. The private deployment remains open for owner review.

