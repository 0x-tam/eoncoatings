# Room hero independent review

Read-only review of the new room revision. CUA inventory returned no browser, so visual observations below are from actual owner browser captures, not independently repeated clicks. No checkout edits.

## Actionable defect

P2, hotspot return focus. In components/campaign/MaterialExplorer.tsx, select stores the clicked hotspot DOM element in lastTrigger. All hotspot buttons unmount when active becomes non-null. Back then calls focus on that disconnected element, so activation from a room hotspot cannot restore focus correctly. Store the material/trigger kind and focus a fresh hotspot ref after overview mounts, with the corresponding persistent material-bar button as fallback. Verify by keyboard activating each room hotspot, using Back, and checking document.activeElement. Bottom-bar button restoration is unaffected by this specific defect. This finding comes from code inspection, not a live browser reproduction.

## Actually observed passes

- overview-mobile.png: readable company location, headline and service descriptor on a quiet pale field. AC is explicitly first through “It starts with cleaner AC ducts”, prominent “Book AC duct cleaning”, and first AC care tab.
- Mobile room image visibly includes an architectural AC outlet, blue L-shaped sectional, and stone table together. All three hotspots sit on their intended subjects. No clipped navigation labels in the supplied 390-wide capture.
- ac-desktop.png: dirty galvanized duct imagery reads as real-looking duct construction and settled dust. Clear service heading, related service link, high-contrast booking action, and visible illustrative-inspection caption.
- fabric-desktop.png: blue woven detail coheres with the room sofa palette and manufactured upholstery construction. Full service choices remain legible beside the image. Magnification affordance is visibly labeled and distinct.
- magnification-desktop.png: expanded fiber/microorganism study is visible while service content and material navigation remain accessible in the capture. “Illustrative magnification” label and “not a sample from this room” caption clearly prevent a diagnostic/documentary interpretation.
- stone-desktop.png: stone texture and table edge dominate the selected image; headline and two real service choices are readable. Illustrative-surface caption remains visible.
- The reviewed imagery and UI do not depict a 3D animation, exploded duct or synthetic protective barrier. This is an observation of supplied stills; animation timing and rapid-input behavior were not visually verified in this revision.

Evidence folder: /Users/Tamam/Documents/ChatGPT/Eon Coatings Website/life-well-kept/evidence/room.

## Focus correction checked

Re-read updated implementation after owner fix. It now stores stable `point-*` / `nav-*` keys and maps them to newly mounted button refs. Back resolves the fresh ref rather than retaining a detached DOM element. The code defect is addressed. Owner is testing actual focus return separately; this reviewer does not claim to have rerun it live.

Owner live verification after the review: Back restores Explore sofa fabric, overview state and zero overflow. Evidence: return-focus.json. This result was performed by the owner, not the independent reviewer.
