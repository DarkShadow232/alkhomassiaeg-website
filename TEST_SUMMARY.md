# Concept B Test Summary

Date: 2026-08-23

## Media validation

- Inspected the complete supplied master with 20 evenly spaced checkpoints.
- The source is 1920×1080, 30 fps, 1,351 frames and 45.033 seconds.
- The route is visually continuous: exterior → receiving → laboratory → dyeing → finishing → inspection → warehouse → exterior.
- Extracted 225 desktop frames at 1280×720 and 113 mobile frames at 720×1280.
- Included the matching first and last exterior views for an intentional closed-loop journey.
- Reopened and decoded all 338 extracted JPEGs; no missing or corrupt outputs.
- Visually inspected desktop and mobile contact sheets. Machinery and aisle direction remain legible, with no stretched frames.

## Automated validation

| Check | Result | Coverage |
|---|---|---|
| Production build | Pass | Vinext client, server, RSC and SSR environments |
| ESLint | Pass | React hooks, TypeScript, accessibility lint configuration |
| Rendered HTML tests | Pass | Arabic/RTL shell, verified facts, contact flow, prohibited-data scan, no video scrub |
| Sequence tests | Pass | Exactly 225 desktop and 113 mobile frames |
| Canvas implementation | Pass | GSAP ScrollTrigger, DPR cap, object-cover drawing, current-frame cache, resize redraw |
| Loading/failure contract | Pass | 60% threshold, all-settled accounting, 9-second safety timeout, static fallbacks |
| Reduced-motion contract | Pass | Static chapter layout and animation suppression |

## Responsive and accessibility implementation

- Desktop uses the full 225-frame 16:9 sequence and four-column capabilities layout.
- Mobile uses the lighter dedicated 113-frame 9:16 sequence, shorter pinned journey, safe caption area and touch-sized controls.
- The mobile menu traps focus, closes on Escape and restores focus.
- The language control updates `lang` and `dir`; Arabic remains the default.
- The quotation form uses labels, required states, consent and an honest email fallback.
- Canvas is decorative to assistive technology; reduced-motion users receive readable static chapters.

## Rendered browser validation

- Rendered `http://localhost:3000/` in Microsoft Edge 151 at 1440×1000 and 390×844.
- Verified the Arabic-first page identity, meaningful content, no framework overlay, completed film loading, full-size canvas, desktop/mobile factory crops and a mid-journey machinery frame.
- Verified scroll progression visually from the exterior to the finishing line and verified the language control changes `dir` from `rtl` to `ltr`, `lang` from `ar` to `en`, and its label from `EN` to `ع`.
- No page runtime exceptions or relevant browser log warnings were recorded.
- The in-app Browser runtime could not initialize (`failed to write kernel assets: The system cannot find the path specified`), so the pass used the installed Edge DevTools protocol without adding project dependencies.
