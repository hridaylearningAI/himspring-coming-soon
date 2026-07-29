import type { CSSProperties } from "react";
import { CONTOUR_RINGS } from "../lib/contour";

/* The relief-map ground behind a family panel.

   This replaces a scatter of bottle silhouettes. The silhouettes had a problem
   that got worse the better the rest of the section got: the panel's subject is
   already a bottle, drawn large and centred, and putting sixteen more of it
   behind meant the background competed with the foreground using the identical
   shape. Contour lines say the same thing the section is about — Himalayan
   source, elevation, where the water comes from — without repeating the product.

   Spans the full viewport and is merely clipped, like the field it replaces, so
   each slice shows a different part of one continuous range rather than three
   copies of the same drawing. That is why it sits outside .hsv-panel__stack:
   translating it with the copy would drag its edge into frame.

   Regenerating: the paths in lib/contour.ts come from a marching-squares pass
   over a gaussian height field. The generator is in the session scratchpad, not
   the repo, because it is a one-shot — if the composition ever needs to change,
   it is easier to re-derive it than to maintain a build step for a 7KB constant
   that has no reason to change on its own. */

export default function ContourField({
  /* Mirrors the stagger for a panel uncovered right-to-left, for the same reason
     BottleField does: the split exposes the incoming panel from one edge, and
     lines nearest that edge should be the ones already drawing. */
  reverse = false,
}: {
  readonly reverse?: boolean;
}) {
  const last = CONTOUR_RINGS.length - 1;

  return (
    <div className="hsv-relief" aria-hidden="true">
      <svg
        className="hsv-relief__svg"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {CONTOUR_RINGS.map((subpaths, ring) => {
          /* 0..1 across the levels, which becomes both the draw order and the
             weight — outer lines are lightest, the summit ring is strongest, the
             way a printed relief map is read. */
          const t = last === 0 ? 0 : ring / last;
          const d = reverse ? 1 - t : t;

          return subpaths.map((path, i) => (
            <path
              key={`${ring}-${i}`}
              d={path}
              /* Normalises every contour to a length of 1 regardless of its real
                 geometry, so one dashoffset rule draws them all. Without it each
                 path would need its own measured length. */
              pathLength="1"
              className="hsv-relief__line"
              style={{ "--d": d.toFixed(3), "--w": (0.45 + t * 0.55).toFixed(3) } as CSSProperties}
            />
          ));
        })}
      </svg>
    </div>
  );
}
