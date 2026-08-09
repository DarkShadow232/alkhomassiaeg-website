# Concept B Asset Manifest

Last reviewed: 2026-08-09

## Brand and source references

| Asset | Role | Status |
|---|---|---|
| `public/assets/brand/logo.png` | Authoritative standalone Arabic emblem | Approved supplied asset; never AI-generated or altered |
| `public/assets/references/wpp.png` | Marketing facts and Egypt contact source | Reference only |
| `public/assets/references/visual-identity.png` | Palette, typography and motif reference | Reference only; sample contact details rejected |
| `public/assets/references/factory/factory-photo-*.jpeg` | Ten selected raw factory references for machinery, scale, architecture and fabric paths | Approved as physical-truth references; not final marketing photography |

## Current website fallbacks

The ten files under `public/assets/fallbacks/` are existing factory photographs wired to the ten tour chapters. They are deliberately labelled as preview media in the interface. They are not claimed to be the final continuous Higgsfield film.

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
| `public/assets/keyframes/concept-b/` | K00–K10 approved shared-boundary keyframes | Missing: generation blocked |
| `public/assets/generated-clips/concept-b/` | Raw V01–V10 Seedance outputs | Missing: generation blocked |
| `public/assets/optimized-clips/concept-b/` | Validated, optimized master clips | Missing: generation blocked |
| `public/assets/sequence-desktop/` | Optimized numbered desktop frames | Missing: generation blocked |
| `public/assets/sequence-mobile/` | Purposeful mobile crops/keyframes | Missing: generation blocked |
| `public/assets/posters/` | Approved static posters | Current photos can serve temporarily |
| `public/assets/generation-records/` | Job JSON, IDs, parameters, checks and rejected notes | Blocker record only |

## Replacement contract

The canvas loader currently reads the ten fallback paths declared in `app/ConceptBClient.tsx`. Once final frames exist, replace that scene list with a generated frame manifest. The renderer already uses object-cover math, DPR capped at 2, current-progress restoration, readiness threshold, all-settled handling and a safety timeout.
