# Concept B Asset Manifest

Last reviewed: 2026-08-23

## Brand and source references

| Asset | Role | Status |
|---|---|---|
| `public/assets/brand/logo.png` | Authoritative standalone Arabic emblem | Approved supplied asset; never AI-generated or altered |
| `public/assets/references/wpp.png` | Marketing facts and Egypt contact source | Reference only |
| `public/assets/references/visual-identity.png` | Palette, typography and motif reference | Reference only; sample contact details rejected |
| `public/assets/references/factory/factory-photo-*.jpeg` | Ten selected raw factory references for machinery, scale, architecture and fabric paths | Approved as physical-truth references; not final marketing photography |

## Current cinematic media

The production canvas sequence is extracted from the client-supplied continuous master at `C:\Users\Omar Mohamed Paşa\Desktop\website\1.mp4`. It is 45.033 seconds at 30 fps and 1920×1080. Its hash, dimensions, counts and output verification are recorded in `public/assets/generation-records/supplied-master-sequence.json`.

- Desktop: `public/assets/sequence-desktop/f000.jpg`–`f224.jpg` (225 frames, 1280×720).
- Mobile: `public/assets/sequence-mobile/f000.jpg`–`f112.jpg` (113 purposeful 9:16 crops, 720×1280).
- Both sequences include the source opening and ending frames, preserving the intentional exterior loop.
- All 338 generated frames exist and decode successfully.

## Reduced-motion fallbacks

The ten files under `public/assets/fallbacks/` remain as the static chapter experience for `prefers-reduced-motion` and as safe poster imagery if cinematic frames cannot load.

| Chapter | Fallback | Final replacement |
|---|---|---|
| 01 Exterior | `01-exterior.jpg` | `sequence-desktop` / `sequence-mobile` frames for V01 |
| 02 Entry | `02-entry.jpg` | frames for V02 |
| 03 Receiving | `03-receiving.jpg` | frames for V03 |
| 04 Laboratory | `04-lab.jpg` | frames for V04 |
| 05 Dyeing | `05-dyeing.jpg` | representative approval scene, then frames for V05 |
| 06 Stenter | `06-stenter.jpg` | frames for V06 |
| 07 Finishing | `07-finishing.jpg` | frames for V07 |
| 08 Quality | `08-quality.jpg` | frames for V08 |
| 09 Warehouse | `09-warehouse.jpg` | frames for V09 |
| 10 Dispatch | `10-exit.jpg` | frames for V10 |

## Generation pipeline directories

| Directory | Intended contents | Current state |
|---|---|---|
| `public/assets/references/` | Source identity/factory references and reusable upload mapping | Partial |
| `public/assets/keyframes/concept-b/` | Optional future K00–K10 generated boundaries | Not used by current supplied-clip sequence |
| `public/assets/generated-clips/concept-b/` | Optional generated source clips | Client masters remain at the supplied workspace paths to avoid shipping duplicate MP4s |
| `public/assets/optimized-clips/concept-b/` | Optional optimized masters | Not required for canvas delivery |
| `public/assets/sequence-desktop/` | Optimized numbered desktop frames | Complete: 225 frames |
| `public/assets/sequence-mobile/` | Purposeful mobile crops/keyframes | Complete: 113 frames |
| `public/assets/posters/` | Approved static posters | Current photos can serve temporarily |
| `public/assets/generation-records/` | Source records, parameters, checks and rejected notes | Production master record complete |

## Replacement contract

The canvas loader reads the desktop or mobile sequence according to the initial viewport. The renderer uses object-cover math, DPR capped at 2, current-progress restoration, a 60% readiness threshold, all-settled handling and a safety timeout. Static fallbacks remain available for reduced motion.
