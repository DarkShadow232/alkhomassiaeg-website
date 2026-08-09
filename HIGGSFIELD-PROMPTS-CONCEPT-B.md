# Higgsfield Prompts — Concept B

Status: retained as the future ten-scene expansion manifest. Claude/Higgsfield access is restored and the K04/K05 Scene 05 keyframe test was completed. The production site now uses the four client-supplied continuous MP4 masters, so no additional paid scene generation was submitted.

## Locked global specification

**Factory anchor:** The same modern Egyptian textile dyeing and finishing factory, identical architecture and machine layout across every shot, warm neutral industrial daylight, brushed stainless-steel jet dyeing machines, organised fabric carts, realistic pipes and ceiling trusses, clean grey floor with safety markings, natural colour science, premium industrial commercial cinematography, rectilinear 24 mm full-frame-equivalent lens, camera 1.8 metres high, slow stabilised low-altitude forward FPV glide, physically plausible fabric flow, consistent screen direction, same day and lighting.

**People constraint:** Workers wear suitable PPE and conservative professional clothing. Any woman is shown in a fully covering tasteful hijab and conservative long sleeves; no exposed skin beyond face and hands. No worker enters a hazardous machine zone.

**Global negative prompt:** no visible drone, propellers, drone shadow, camera rig or operator; no fisheye, barrel distortion, roll, dive, shake, speed ramp or sudden motion; no cuts, flicker, warping, ghosting, double exposure or impossible wall penetration; no altered emblem, generated logo, invented signage, readable screen text, watermark or subtitles; no malformed machinery, unsafe access, impossible fabric paths, face distortion or inconsistent architecture.

All stills: 16:9, 2K, reference-driven `nano_banana_2` when brand/factory identity is present. `gpt_image_2` is permitted only for identity-free environment extensions. All clips: `seedance_2_0`, `--aspect_ratio 16:9 --resolution 1080p --bitrate_mode high --generate_audio false`, shared start/end keyframes, no duplicated first boundary frame during extraction.

## Shared boundary keyframes

### K00 — Opening identity / exterior start
- Purpose: Scene 01 start.
- Reference inputs: exact `logo.png` for separate HTML composition only; real exterior photograph for environment.
- Full prompt: Use the locked factory anchor. Wide composed exterior of the same Al Khomassia factory in soft morning industrial daylight, camera at 2.2 metres, rectilinear 24 mm lens, approach lane leading naturally toward the entrance, clean credible Egyptian industrial setting, no generated text or logo inside the image, all frame edges natural and suitable for a forward push.
- Negative constraints: global negative prompt; especially no invented signage or altered emblem.
- Output: `public/assets/keyframes/concept-b/K00-exterior-start.png`
- Status / generation ID: not generated / none.

### K01 — Entrance threshold
- Purpose: Scene 01 end and Scene 02 start; canopy/door frame fills the upper and side edges.
- Full prompt: Use the locked factory anchor. The same exterior and architecture, camera now directly below the entrance canopy at 1.9 metres, door frame as a strong physical occluder, interior hall visible ahead with natural exposure transition, forward direction unchanged.
- Negative constraints: global negative prompt; no discontinuous building geometry.
- Output: `public/assets/keyframes/concept-b/K01-threshold.png`
- Status / generation ID: not generated / none.

### K02 — Raw white fabric occlusion
- Purpose: Scene 02 end and Scene 03 start.
- Full prompt: Use the locked factory anchor and people constraint. Inside the same wide production hall, camera glides beside a clean white raw-fabric roll or hanging sheet that fills most of the lens, same ceiling trusses, columns, floor and light direction, carts and safety lanes readable behind it.
- Negative constraints: global negative prompt; no unsafe workers, no invented labels.
- Output: `public/assets/keyframes/concept-b/K02-white-fabric.png`
- Status / generation ID: not generated / none.

### K03 — Laboratory circular transition
- Purpose: Scene 03 end and Scene 04 start.
- Full prompt: Use the locked factory anchor and people constraint. Organised raw-fabric preparation zone resolving alongside a credible colour laboratory, controlled-neutral lighting and orderly swatches, a dark circular sample port centred as the next transition object, no readable generated UI.
- Negative constraints: global negative prompt; no fake certificates or screen text.
- Output: `public/assets/keyframes/concept-b/K03-lab-port.png`
- Status / generation ID: not generated / none.

### K04 — Jet machine hatch
- Purpose: Scene 04 end and Scene 05 start.
- Full prompt: Use the locked factory anchor. Circular laboratory sample/measurement form matched exactly to the axis and scale of a stainless-steel jet dyeing machine hatch beyond it; camera moves forward into the dyeing hall, pipe layout and floor safety boundaries physically credible.
- Negative constraints: global negative prompt; no camera entering machine internals.
- Output: `public/assets/keyframes/concept-b/K04-jet-hatch.png`
- Status / generation ID: not generated / none.

### K05 — Controlled steam / fabric plane
- Purpose: Scene 05 end and Scene 06 start.
- Full prompt: Use the locked factory anchor. Same jet dyeing hall, camera passes a stainless housing as controlled thin steam and a wide dyed-fabric plane fill the frame, consistent batch colour and forward motion, safe industrial operation.
- Negative constraints: global negative prompt; no dense fantasy fog, spills or unsafe workers.
- Output: `public/assets/keyframes/concept-b/K05-steam-fabric.png`
- Status / generation ID: not generated / none.

### K06 — Fabric fills frame at stenter
- Purpose: Scene 06 end and Scene 07 start.
- Full prompt: Use the locked factory anchor. Wide dyed fabric moves correctly through rollers toward the stenter/ram line; camera tracks parallel then beneath the fabric until its texture fills the frame, fabric width, colour, tension and travel direction consistent.
- Negative constraints: global negative prompt; no torn fabric, impossible roller path or changing colour.
- Output: `public/assets/keyframes/concept-b/K06-stenter-fabric.png`
- Status / generation ID: not generated / none.

### K07 — Roller-to-roll match
- Purpose: Scene 07 end and Scene 08 start.
- Full prompt: Use the locked factory anchor. Close industrial macro of a finishing/calender roller matched in axis, scale and rotation direction to a completed fabric roll, physically correct fabric tension and surface texture, restrained depth of field.
- Negative constraints: global negative prompt; no melting or morph artifacts.
- Output: `public/assets/keyframes/concept-b/K07-roller-match.png`
- Status / generation ID: not generated / none.

### K08 — Finished-roll wipe
- Purpose: Scene 08 end and Scene 09 start.
- Full prompt: Use the locked factory anchor and people constraint. Quality inspection area with a finished roll passing close to camera until it cleanly fills the lens, illuminated inspection surface visible beforehand, no forms, certificates or generated text.
- Negative constraints: global negative prompt; no fake documents or unsafe handling.
- Output: `public/assets/keyframes/concept-b/K08-roll-wipe.png`
- Status / generation ID: not generated / none.

### K09 — Bright dispatch doorway
- Purpose: Scene 09 end and Scene 10 start.
- Full prompt: Use the locked factory anchor. Organised finished-goods warehouse, safe stacking and clean aisles, camera follows the same finished roll toward a bright dispatch doorway that fills the forward view, same light direction and architecture.
- Negative constraints: global negative prompt; no labels, invented brands, forklifts near people or unsafe stacks.
- Output: `public/assets/keyframes/concept-b/K09-dispatch-door.png`
- Status / generation ID: not generated / none.

### K10 — Final clean exterior surface
- Purpose: Scene 10 end; HTML logo/CTA resolves above it.
- Full prompt: Use the locked factory anchor. Camera emerges to a composed final exterior/dispatch view and slows; a warm off-white architectural surface fills the frame naturally as the transition bed for the exact emblem and live wordmark added later in HTML.
- Negative constraints: global negative prompt; absolutely no generated logo or text.
- Output: `public/assets/keyframes/concept-b/K10-final-surface.png`
- Status / generation ID: not generated / none.

## Boundary-matched motion clips

Each prompt includes the locked factory anchor, people constraint when workers appear, and global negative prompt.

### V01 — Identity and exterior approach
- Start/end: K00 → K01.
- Motion: slow straight approach with gentle stabilised inertia; entrance canopy becomes the complete physical boundary.
- Output: `public/assets/generated-clips/concept-b/V01-exterior.mp4`.
- Status / generation ID: not generated / none.

### V02 — Crossing the threshold
- Start/end: K01 → K02.
- Motion: camera crosses into the same hall; exposure adapts naturally; gentle lateral arc toward white fabric occluder.
- Output: `public/assets/generated-clips/concept-b/V02-entry.mp4`.
- Status / generation ID: not generated / none.

### V03 — Receiving and preparation
- Start/end: K02 → K03.
- Motion: reveal untreated rolls and follow one unlabelled batch cart, ending on the matched circular laboratory transition.
- Output: `public/assets/generated-clips/concept-b/V03-receiving.mp4`.
- Status / generation ID: not generated / none.

### V04 — Laboratory colour matching
- Start/end: K03 → K04.
- Motion: slow readable laboratory glide past samples and measurement equipment; circular form grows into matched jet-machine hatch.
- Output: `public/assets/generated-clips/concept-b/V04-laboratory.mp4`.
- Status / generation ID: not generated / none.

### V05 — Representative approval scene: jet dyeing
- Start/end: K04 → K05.
- Motion: enter the main stainless-steel jet dyeing hall, hold geometry legibly, continue forward with a subtle lateral arc, end behind stainless housing and controlled steam/fabric occlusion.
- Accuracy checks before any remaining spend: machinery matches supplied factory references; same architecture/light/camera direction; no unsafe worker zones; no text/logo artifacts; K04/K05 both offer clean physical transition boundaries.
- Output: `public/assets/generated-clips/concept-b/V05-dyeing-test.mp4`.
- Status / generation ID: **first paid test, blocked before submission** / none.

### V06 — Extraction, drying and stenter
- Start/end: K05 → K06.
- Motion: track parallel to consistent dyed fabric through rollers toward the stenter, ending with fabric covering the lens.
- Output: `public/assets/generated-clips/concept-b/V06-stenter.mp4`.
- Status / generation ID: not generated / none.

### V07 — Finishing and calendaring
- Start/end: K06 → K07.
- Motion: reveal finishing rollers and readable macro texture; match the rotating roller axis into finished roll.
- Output: `public/assets/generated-clips/concept-b/V07-finishing.mp4`.
- Status / generation ID: not generated / none.

### V08 — Rolling and quality control
- Start/end: K07 → K08.
- Motion: gentle orbit around finished roll, glide past illuminated inspection, finish as roll wipes the frame.
- Output: `public/assets/generated-clips/concept-b/V08-quality.mp4`.
- Status / generation ID: not generated / none.

### V09 — Finished-goods warehouse
- Start/end: K08 → K09.
- Motion: reveal clean organised warehouse aisles and follow the final roll toward dispatch doorway.
- Output: `public/assets/generated-clips/concept-b/V09-warehouse.mp4`.
- Status / generation ID: not generated / none.

### V10 — Exit and identity resolve
- Start/end: K09 → K10.
- Motion: move through bright dispatch threshold, slow to a composed exterior surface; no logo is generated—the exact supplied emblem and corrected live English wordmark are HTML overlays.
- Output: `public/assets/generated-clips/concept-b/V10-exit.mp4`.
- Status / generation ID: not generated / none.

## Mobile variants

After desktop keyframe approval, create purposeful 9:16 K00m–K10m boundaries rather than blind centre crops, preserving the featured machine/fabric and caption safe zones. Generate V01m–V10m with the same boundary and motion rules. Status: not generated.

## Approval record

K04 and K05 were generated as a representative test and preserved outside production delivery. V05 and the remaining generated scenes were not submitted because the client supplied a complete four-clip cinematic route that is now used by the website.
