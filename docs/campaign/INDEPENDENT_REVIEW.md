# Independent campaign review

Reviewer did not author the site. Read the full reset brief. Actual CUA browser review on localhost:5175, own browser session/tab, 11 September 2026. No Site edits, no live enquiry sent.

## Observed defects for owner

1. Material hotspot registration, P2. At 1280x720 and 1440x900 Stone sits over smoked glass and Fabric over wooden chair arm. At 390x844 Fabric sits over glass/table rather than upholstery. Tie annotations to source coordinates and selected portrait source, or adjust safe source points with responsive crop math. Evidence: desktop-overview.png and mobile-overview.png.
2. Selected state focus and scroll, P2. At desktop, clicking Stone leaves focus on bottom Stone button. Tab then reaches Fabric and Air, bypassing newly inserted service links earlier in DOM. At mobile, scroll to visible material bar then select Fabric: heading and Back control remain above viewport. Move focus to selected panel or Back button and reveal panel on commit; restore initiating material trigger on return. Evidence: mobile-fabric-after-activation.png.
3. Stone final crop, P2 creative quality. At 1440x900 settled Stone crop assigns upper half of photo to fabric/wood and lower region to large glass/cup, diluting actual stone attention. Tune focal point/translation or show matched stone detail through a deliberate cut. Evidence: desktop-stone.png.

## Actual observed passes

- Strong ownable material photography and readable editorial typography, useful service identity and enquiry route before interaction.
- Desktop1440 overview, Stone click, Fabric keyboard Return, Air click, Back action, and mobile390 Fabric selection inspected live. Stone and Fabric visibly scale photograph, more than background fading. Air changes scene. No normal-scroll trapping observed.
- Portrait asset actually loads on 390. DOM innerWidth and document scrollWidth both 390. Selected mobile Fabric panel has readable text and no collision when scrolled into view.
- Back restores selected material trigger focus.
- Mobile modal Menu renders readable links. Tab wraps Close to Services and Shift-Tab wraps to Close. Escape closes, focus restores Menu.
- Services anchor reaches complete numbered list; descriptions visible without hover. Fabric service link reaches real service page at top after navigation settles. Service title/intro readable, enquiry route works.
- Contact local fixture: invalid phone produces error, keeps fields. Corrected phone produces mailto draft with supplied fixture values and explicit nothing-sent message. Email application was not opened and no data sent. This verifies draft preparation, not live delivery.

## Scope and limits

This bounded review directly tested 1280x720, 1440x900, and 390x844. Does not claim direct 1024/768/360, reduced-motion emulation, optional image failure, resize mid-transition, production build, route coverage, automated accessibility, or measured performance. Owner is responsible for final full matrix and retesting addressed defects. Browser sequence is equivalent live interaction evidence, not a video recording.

Old inherited docs were flagged to owner as stale; owner is replacing them. Live backend/CAPTCHA and staging recipient remain an explicit configuration dependency. Draft preparation is a useful functional fallback, not verified customer delivery.

## Fix retest attempt

Owner reported fixes ready. Read updated MaterialExplorer implementation: source-specific landscape/portrait coordinates and shared cover scale now place annotations, selected translation is bounded, full raster dimensions remain available during zoom, and commit focuses Back while return restores the material trigger. These are implementation observations, not visual pass results.

Direct retest attempted through CUA. Inventory returned no browsers and creating an in-app browser returned “Browser is not available: iab”. Therefore this reviewer cannot yet independently close the three findings using new live output. Requested owner screenshots and interaction evidence for an explicitly secondary review. Original live observations and evidence above remain accurate for the pre-fix version.

## Final evidence review after fixes

Final verification method: independently inspected owner-created actual browser captures, because this reviewer’s CUA browser remained unavailable. This is visual review of fresh browser evidence, not a second live interaction run by this reviewer.

Inspected files in life-well-kept/evidence/campaign: desktop-overview.png, desktop-stone.png, mobile-overview.png, mobile-fabric.png, mobile-stone.png, mobile-air.png, overview-1024.png, overview-360.png, resize-fabric-768.png, services-desktop.png, and air-feature-desktop.png.

Finding 1: material registration is substantially resolved. Both mobile points now sit on their correct surfaces at 390 and 360; desktop and 1024 points also target real stone/fabric. Minor residual in desktop-overview.png: Stone circle reaches below the photo boundary and is partly clipped by the material bar. Keep its center at least one radius from the image boundary or move the landscape point slightly upward. Matching text control remains available, so this is a minor visual issue rather than blocked navigation.

Finding 2: selected focus/scroll fix accepted on supplied evidence. Mobile selected captures now show Back, heading, service links and enquiry clearly. Updated code focuses Back on commit. Owner-provided rapid-selection.json independently read here reports final fabric state, Back focus, one image and zero horizontal overflow. Owner additionally reports heading top at 73px, return focus on Fabric, and seven rapid changes settling correctly. Those interaction measurements were performed by the owner, not rerun by this reviewer.

Finding 3: resolved visually. desktop-stone.png now fills the image region with actual pale stone texture and edge, without competing chair or drink imagery. Mobile Stone also emphasizes the intended surface. Fabric at 768 preserves visible material texture while keeping its full service panel legible.

The new portrait gives typography and business descriptor quiet negative space; 390 and 360 captures are substantially cleaner than the original portrait. Desktop service index maintains useful numbered typography and a generous shared image. The large air feature has credible architectural subject matter, clear cleaning/sanitisation/coating distinctions, and a visible enquiry path. No new major visual defects found in these reviewed captures.

Owner-reported additional checks: optional air failure retains service link; reduced-motion override produces zero-second transition; production route audit covers 82 routes and 61 assets; zero automated accessibility violations on home/contact/marble/media/HGPP. Reviewed accessibility-routes.json directly confirms zero reported violations for marble, media and HGPP. These are secondary test results and do not imply this reviewer independently executed the suite. Captures are development evidence, including a test overlay visible in the desktop overview, not production marketing screenshots.

Final review status: original substantial findings addressed through implementation changes and fresh browser evidence. One minor desktop hotspot edge clipping noted for owner. Live delivery remains an explicit external configuration limitation; this review does not claim customer messages were sent or received.

## Final desktop residual closed

Independently inspected the replacement production desktop-overview.png supplied by the owner. Stone hotspot is now fully inside the photograph, visibly on stone, with clear space above the material bar. Fabric hotspot also remains on upholstery. The prior development audit overlay is absent from this replacement capture. Minor clipping finding is closed. No outstanding defects from this bounded independent review.

Method distinction remains: first-pass interactions were performed directly by this reviewer in CUA; final fixes were verified from owner-created browser captures and explicitly attributed owner interaction evidence because the reviewer browser became unavailable.
