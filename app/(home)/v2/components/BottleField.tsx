import type { CSSProperties } from "react";
import { FIELD, MAX_DELAY } from "../lib/field";
import BottleSVG from "./BottleSVG";

/* The scattered bottles behind a format panel.

   Every item's placement, angle and stagger goes out as a custom property and
   the animation itself is stated once in CSS, rather than twelve inline
   transforms — so the whole field can be retimed or restyled in one rule.

   Nothing here runs per frame. The panel writes a single --in and each item
   derives its own progress from that and its own --d, which keeps the cost of a
   twelve-bottle field at one style write per panel per frame. */

export default function BottleField({
  variant,
  /* Mirrors the stagger for a panel that is uncovered right-to-left.

     The wipe reveals the incoming panel from its right edge inward, so with the
     authored left-to-right order its rightmost bottles would sit uncovered but
     still invisible, waiting on a delay — the field visibly lagging the very
     transition that exposed it. Reversing puts the first bottles where the
     reveal starts. */
  reverse = false,
}: {
  /* BottleSVG's own pair, not FormatId. These are drawn silhouettes and only
     two were ever drawn; a third format has plates, not a path. */
  readonly variant: "glass" | "pet";
  readonly reverse?: boolean;
}) {
  return (
    <div className="hsv-field" aria-hidden="true">
      {FIELD.map((b, i) => (
        <span
          className="hsv-field__item"
          key={i}
          style={
            {
              "--fx": `${b.x}%`,
              "--fy": `${b.y}%`,
              "--fs": `${b.s}vh`,
              "--fr": `${b.r}deg`,
              "--d": reverse ? MAX_DELAY - b.d : b.d,
            } as CSSProperties
          }
        >
          <BottleSVG variant={variant} flat />
        </span>
      ))}
    </div>
  );
}
