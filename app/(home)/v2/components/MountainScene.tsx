/* The Shivalik ridgeline — the place the intro sequence puts you inside.

   This was four hand-drawn SVG paths until the plate existed; it is now the
   photograph, and the drawn version is gone rather than kept as a fallback,
   because two ridgelines that have to stay identical are one more thing to keep
   in sync and the whole point of this file is that they never diverge.

   Authored once, used in two coordinate systems:

     - `MountainPaths` is the bare <image>, dropped into the bottle's own SVG
       behind the water clip, where a counter-transform holds it screen-fixed.
     - `MountainScene` wraps the same element in a standalone SVG that slices to
       fill the section.

   Both must draw the identical picture at the identical size, or the moment the
   push hands off from the portal to the full-bleed copy the landscape jumps.
   That is why the full-bleed case stays an SVG image element rather than
   becoming a plain HTML one with object-fit: the portal has no choice but to be
   SVG, and matching it exactly is worth more than the simpler element.

   The box stays 2400x1206 while the plate is 16:9, so `slice` trims a little
   off the top and bottom of the photograph. That is deliberate — both call
   sites slice the same box the same way, so they stay in lockstep, and the
   alternative (widening SCENE_H to the photo's ratio) would move the scene
   centre and put BottleSVG's PORTAL_CY out of tune for no visible gain. */

export const SCENE_W = 2400;
export const SCENE_H = 1206;

const PLATE = "/assets/intro-shivalik.webp";

export function MountainPaths() {
  return (
    <image
      href={PLATE}
      x="0"
      y="0"
      width={SCENE_W}
      height={SCENE_H}
      /* slice, not meet: this fills its box and is allowed to lose edges */
      preserveAspectRatio="xMidYMid slice"
    />
  );
}

export default function MountainScene({ className }: { readonly className?: string }) {
  return (
    <svg
      className={["hsv-mtn", className].filter(Boolean).join(" ")}
      viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <MountainPaths />
    </svg>
  );
}
