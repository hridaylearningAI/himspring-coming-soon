"use client";

import { useRef, useState, type CSSProperties } from "react";
import { FAMILIES, PANEL_GROUNDS, groundScaleFor } from "../lib/family";
import { FORMATS, type FormatId } from "../lib/formats";
import { segment, useScrub } from "../lib/useScrub";

/* [04] family — one panel that subdivides into three, 750 then 500 then 330.

   The section opens full-bleed on the largest. The frame splits in half and the
   middle size occupies the new right side; it splits again into thirds and the
   smallest takes the last one. The three-up state then holds before the pin
   releases, because that is the frame the whole section is built to arrive at.

   This replaces a wipe, and the reason is arithmetic. A wipe *replaces*: you
   never see two sizes at once, so every comparison is made from memory across a
   scroll. That was survivable when the sizes were 250/500/1000 and the height
   ladder was 1:1.55. At 750/500/330 the ladder is 1 : 0.87 : 0.76 — a 13% step
   and then a 24% step. Nobody detects 13% from memory. Side by side, everybody
   does. Subdividing is what makes these particular volumes legible at all.

   Geometry is carried as left/right clip insets in percent of the viewport, and
   the panels stay full-bleed underneath — nothing resizes, so nothing reflows.
   What that costs is that clipping does not move content: narrow a panel to a
   third and its copy would sit where it always was and simply get cut off. So
   each panel's content rides a --cx translate that keeps it centred in whatever
   slice is currently visible. Transform is cheap; width would not be.

   The format switch sits on top of all of it. Glass is the opening state and PET
   is not rendered until it is asked for — the second vessel is a detail, and a
   detail that interrupts the size argument to state itself is not a detail any
   more. Switching swaps the three panels in place and does not touch the scroll
   position, so it can be used at any point in the pin and the section carries on
   from exactly where it was. */

/* The two splits, with holds either side. Each state has to stand still long
   enough to be read before the next edge moves, or the section is one
   continuous transition with no subject. */
const SPLIT1_START = 0.2;
const SPLIT1_END = 0.42;
const SPLIT2_START = 0.58;
const SPLIT2_END = 0.8;

/* the first field fills while the largest holds the whole frame, and is done
   before the first edge moves — two things arriving at once makes neither
   legible */
const FIELD1_END = 0.16;

const THIRD = 100 / 3;

export default function Family() {
  const section = useRef<HTMLElement | null>(null);
  const first = useRef<HTMLDivElement | null>(null);
  const second = useRef<HTMLDivElement | null>(null);
  const third = useRef<HTMLDivElement | null>(null);

  const [format, setFormat] = useState<FormatId>("glass");

  useScrub(section, (p) => {
    const s1 = segment(p, SPLIT1_START, SPLIT1_END);
    const s2 = segment(p, SPLIT2_START, SPLIT2_END);

    /* Insets in percent of the viewport. Read them as: where does this panel's
       left edge sit, and how far in from the right does it stop.
         p1   right 0    -> 50    -> 66.7
         p2   left  100  -> 50    -> 33.3,  right 0 -> 0 -> 33.3
         p3   left  100  -> 100   -> 66.7 */
    const r1 = s1 * 50 + s2 * (2 * THIRD - 50);
    const l2 = 100 - s1 * 50 - s2 * (50 - THIRD);
    const r2 = s2 * THIRD;
    const l3 = 100 - s2 * THIRD;

    const put = (
      el: HTMLDivElement | null,
      l: number,
      r: number,
      inValue: number,
    ) => {
      if (!el) return;
      el.style.setProperty("--l", `${l.toFixed(3)}%`);
      el.style.setProperty("--r", `${r.toFixed(3)}%`);
      /* centre of the visible slice, as an offset from the panel's own centre */
      el.style.setProperty("--cx", `${((l + 100 - r) / 2 - 50).toFixed(3)}vw`);
      el.style.setProperty("--in", inValue.toFixed(4));
    };

    put(first.current, 0, r1, segment(p, 0, FIELD1_END));
    put(second.current, l2, r2, s1);
    put(third.current, l3, 0, s2);
  });

  /* Built as a literal 3-tuple rather than indexed in the loop: under
     noUncheckedIndexedAccess a variable index into the family tuples returns
     `FamilyMember | undefined`, and three panels that might not exist is not a
     thing this section can render. Each row still carries both formats' entries
     even though only one is read: the pair is what the panel is, and dropping
     the unread one would mean re-deriving it the next time anything here needs
     to know what the other vessel says. */
  const rows = [
    { ref: first, ground: PANEL_GROUNDS[0], glass: FAMILIES.glass[0], pet: FAMILIES.pet[0] },
    { ref: second, ground: PANEL_GROUNDS[1], glass: FAMILIES.glass[1], pet: FAMILIES.pet[1] },
    { ref: third, ground: PANEL_GROUNDS[2], glass: FAMILIES.glass[2], pet: FAMILIES.pet[2] },
  ];
  const formatLabel = FORMATS.find((f) => f.id === format)?.label ?? "";

  return (
    <section className="hsv-family" id="family" ref={section} aria-labelledby="hsv-family-t">
      <h2 className="hs-vh" id="hsv-family-t">
        The family: three sizes
      </h2>

      <div className="hsv-family__pin">
        {/* First in the DOM so it is the first thing reached by keyboard in this
            section — a control that changes what three panels say should not sit
            behind the panels in tab order. It is painted last by z-index, not by
            document order. */}
        <div className="hsv-family__switch" role="group" aria-label="Bottle format">
          {FORMATS.map((f) => (
            <button
              type="button"
              key={f.id}
              className="hsv-family__opt"
              /* aria-pressed rather than a tablist. There are no tab panels here:
                 the three sections of content do not appear and disappear per
                 option, they are re-stated with different values, and announcing
                 them as tabpanels would promise a structure that is not there. */
              aria-pressed={f.id === format}
              onClick={() => setFormat(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {rows.map((row, i) => {
          const m = format === "glass" ? row.glass : row.pet;

          return (
            /* Keyed by position, not by the member id. The ids differ between
               formats, so keying on them would unmount and remount all three
               panels on every switch — and the scrub's --l/--r/--cx live as
               inline styles on these exact nodes, written outside React. New
               nodes come up on their CSS defaults, which is the three-up resting
               state, so a switch made mid-pin would flash the end of the section
               for a frame. Positional keys keep the nodes and only re-state
               their contents. */
            // eslint-disable-next-line react/no-array-index-key -- see above
            <div
              className={`hsv-panel hsv-panel--p${i + 1}`}
              ref={row.ref}
              key={i}
              style={
                {
                  "--hsv-tone": row.ground.tone,
                  "--hsv-ground-pos": row.ground.focus,
                  /* The ladder, on the panel rather than on either plate: both
                     formats' plates were shot to the same framing, so the scale
                     that makes 500 shorter than 750 is a property of the station
                     and not of the vessel standing in it. Derived from `ml` via
                     lib/family, so the volumes remain the only place a size is
                     written down. */
                  "--hsv-scale": groundScaleFor(m.ml, FAMILIES[format]).toFixed(4),
                } as CSSProperties
              }
            >
              {/* The ground. Outside the stack on purpose, and the reason is the
                  same one the drawn contour field had: it spans the full
                  viewport and is merely clipped, so each slice shows a different
                  part of one continuous plate. Translating it with the copy
                  would drag its edge into frame and leave a bare strip behind
                  it.

                  Eager, not lazy. Every one of these is inside the pin from the
                  moment the section mounts — a lazy plate would be requested at
                  the instant its panel is uncovered, which is the one moment it
                  must already be there. */}
              {/* The wrapper carries the arrival, the plates inside it carry the
                  format. Two signals that must not fight: --in is written every
                  frame by the scrub, while the switch is a one-off transition,
                  and a single element cannot both track a scroll position and
                  ease between two states on the same property. */}
              <div className="hsv-grounds" aria-hidden="true">
                {FORMATS.map((f) => (
                  /* eslint-disable-next-line @next/next/no-img-element -- a
                      full-bleed cover plate with no authored px size for
                      next/image to build a srcset against; the sources are
                      2200px and already WebP, so there is nothing a resize
                      pipeline would add */
                  <img
                    key={f.id}
                    className={`hsv-ground hsv-ground--${f.id}${f.id === format ? " is-on" : ""}`}
                    src={row.ground.src[f.id]}
                    alt=""
                    decoding="async"
                  />
                ))}
              </div>

              <div className="hsv-panel__stack">
                <div className="hsv-panel__inner">
                  <p className="hsv-label">
                    {formatLabel} &middot; {m.label}
                  </p>
                  <p className="hsv-panel__name">{m.name}</p>
                </div>

                {/* The bottle used to be mounted here, twice, scaled by
                    scaleFor(ml). It is in the photograph now — each plate was
                    shot with its own vessel standing on its own ground, so the
                    glass carries that ground's light and reflections rather than
                    being lit for one plate and reused on three.

                    The ladder came with it rather than being lost. All six
                    plates frame their bottle identically, so the step between
                    the three is put back by scaling the photograph — see
                    --hsv-scale on this panel, and .hsv-ground in deck.css for
                    why that is bounded rather than free. */}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
