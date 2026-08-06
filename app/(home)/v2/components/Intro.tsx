"use client";

import { useRef } from "react";
import { FILM_H, FILM_W, useFilm } from "../lib/useFilm";
import { FAMILIES } from "../lib/family";
import { segment, useScrub } from "../lib/useScrub";
import FormatBottle from "./FormatBottle";
import WhyHimspring from "./WhyHimspring";

/* [02] intro — one pinned sequence, two movements, no section breaks in it.

   FILM   a rendered 7s shot, cut into 150 stills and scrubbed by the scroll:
          the bottle turns on its axis, the camera travels into the water it
          holds, and the landscape inside opens out until it is simply the
          frame. See lib/useFilm.
   RISE   the two formats climb into the landscape the film just arrived at.

   This used to be four movements — ARC, PUSH, HAND — and a great deal of
   machinery: a drawn bottle rotated and scaled by custom properties, the
   landscape clipped to its water shape, a counter-transform inside that clip
   holding the view steady while the clip grew, and a second full-bleed copy of
   the same drawing fading up underneath so coverage never depended on the water
   shape reaching the corners. All of it existed to approximate, with a clip
   path, a camera move through glass. The film is that camera move, so all of it
   is gone.

   BottleSVG keeps its `portal` prop and MountainScene keeps `MountainPaths` —
   nothing here uses them now, but they are what this section reverts to if the
   film ever has to come out.

   The rise used to live in a separate section below this one, which meant it
   happened after the pin released — a scroll boundary sitting exactly where the
   sequence should have been continuous. Folded in here it is one gesture. */

/* The magazine spread is held before anything moves.

   The section opens as a still page — the heading top left, the body bottom
   right, and the film's own first frame between them, not advancing.

   A matted cut-out of that frame briefly lived here so the heading could run
   behind the bottle, which a canvas cannot allow. It is gone: with the title
   set on two lines it ends around x 586 on a 1440 frame and the bottle starts
   at 618, so there is nothing to pass behind and the transparency bought
   nothing but an asset and a crossfade.

   HOLD_END is a fraction of a section that grew from 420vh to 520vh to pay for
   it, which keeps the film's own pace: it ran 0 to 0.66 of 420vh, about 277vh,
   and now runs 0.18 to 0.72 of 520vh, about 281vh. The hold is the remaining
   0.18, roughly one viewport — long enough to read the spread as a page rather
   than as a slow start.

   Every other beat is remapped by the same proportion rather than re-timed by
   eye. The veil used to come up between 51% and 82% of the way through the
   film; it still does, which in the new numbers is 0.46 to 0.62. */
const HOLD_END = 0.18;
/* where the film finishes and the frame is simply the landscape */
const FILM_END = 0.72;
const RISE_START = 0.78;
const RISE_END = 0.97;

/* The narrow timeline, written alongside the wide one every frame.

   On a phone the story cannot share the frame with the film. It is a heading, a
   lede and two paragraphs, which needs an opaque panel to stay legible over a
   photograph, and that panel measured 63% of the visible page on a real handset
   once Safari's own chrome had taken its share — the film was a strip of bottle
   neck. Shrinking the type does not fix a block whose height is set by the words
   in it.

   So the beats stop overlapping and take turns instead: the film owns the frame,
   then the story, then the rise. Which is why these run late — the story fades in
   only once the film has arrived at the landscape.

   No width check in here on purpose. Both sets are three subtractions and a
   clamp, so writing both every frame is cheaper than a matchMedia read plus the
   resize listener and hydration ordering it would need, and CSS picks between
   them at the breakpoint. See --lede-eff / --rise-eff in deck.css. */
const N_LEDE_IN: readonly [number, number] = [0.72, 0.79];
const N_LEDE_OUT: readonly [number, number] = [0.88, 0.92];
const N_RISE: readonly [number, number] = [0.9, 1];

export default function Intro() {
  const section = useRef<HTMLElement | null>(null);
  /* the pin, not the stage: every layer below is the stage's sibling, and
     custom properties written on the stage would never reach them */
  const pin = useRef<HTMLDivElement | null>(null);
  const film = useRef<HTMLCanvasElement | null>(null);
  const drawFilm = useFilm(film);

  useScrub(section, (p) => {
    const el = pin.current;
    if (!el) return;

    /* The film is drawn imperatively rather than driven by a custom property,
       because it is the one thing here that is not a style: a canvas has to be
       told which bitmap to put up. Everything else on this pin still goes out
       as a property and is composited by CSS. */
    drawFilm(segment(p, HOLD_END, FILM_END));

    /* The copy starts this section on white and ends it on a ridgeline, so the
       scrim has to be fully up by the time the ridgeline is what is behind it.

       This used to run ARC_END..PUSH_END, which trailed the landscape: by the
       midpoint of the push the water shape already covers the frame and the
       dark near-ridge is sitting behind the text, but the scrim was still at
       about 40%. Fine against the drawn scene, which was near-white everywhere;
       not fine against a photograph. Starting before the arc ends costs
       nothing, because until then the scrim is white over white. */
    el.style.setProperty("--veil", segment(p, 0.46, 0.62).toFixed(3));
    /* and hands over to the formats copy rather than sharing the frame with it */
    el.style.setProperty("--lede", (1 - segment(p, FILM_END, RISE_START + 0.06)).toFixed(3));
    el.style.setProperty("--rise", segment(p, RISE_START, RISE_END).toFixed(3));

    /* The narrow pair. The lede fades in and back out rather than starting up
       and leaving, so it is the smaller of the two ramps — in after the film,
       out before the bottles climb into the same frame. */
    const ledeIn = segment(p, N_LEDE_IN[0], N_LEDE_IN[1]);
    const ledeOut = 1 - segment(p, N_LEDE_OUT[0], N_LEDE_OUT[1]);
    el.style.setProperty("--lede-n", Math.min(ledeIn, ledeOut).toFixed(3));
    el.style.setProperty("--rise-n", segment(p, N_RISE[0], N_RISE[1]).toFixed(3));
  });

  return (
    <section className="hsv-intro" id="formats" ref={section} aria-labelledby="hsv-intro-t">

      <div className="hsv-intro__pin" ref={pin}>
        {/* The film. Fixed backing store at the frames' own size — CSS
            object-fit does the fitting, so nothing here has to respond to a
            resize. aria-hidden because it carries no information the copy
            beside it does not already state. */}
        <canvas
          className="hsv-intro__film"
          ref={film}
          width={FILM_W}
          height={FILM_H}
          aria-hidden="true"
        />

        <div className="hsv-intro__veil" aria-hidden="true" />

        {/* The section's real heading now, where this used to be one label and
            one sentence with the h2 hidden above it in .hs-vh. The story copy
            arrived and it needs a title, and a visible title that is already the
            right level is better than a hidden one duplicating it — so
            hsv-intro-t moved onto the <h2> below and the hidden copy is gone.

            "HIMSPRING flows from" in the supplied copy is set as "Himspring"
            here. Same call as the founders' biographies, which arrived with the
            brand name bolded: shouting the brand inside its own paragraph is a
            press-release habit, and it would be the only all-caps word in any
            body text on the page, which reads as a defect rather than as stress.
            One word to change back if that is wanted. */}
        {/* One block became two, and the split is the layout.

            A magazine spread puts the title in one corner and the text in the
            opposite one, with the subject standing between them — so the head
            goes top left and the body bottom right, and the head sits at a lower
            z than the cut-out so the bottle crosses in front of it. Both still
            carry --lede-eff together, so they arrive and leave as one block and
            nothing here has to know about the other.

            The wrapper is display: contents on a wide screen, so the two blocks
            position themselves against the pin and the cut-out can sit in z
            between them. It becomes a real box again on a narrow one, where the
            beats take turns and the whole story is a single panel at the foot of
            the frame — that layout needs the two stacked in normal flow, which
            is exactly what a wrapper gives and two positioned siblings could
            not. */}
        <div className="hsv-intro__copy">
          <div className="hsv-intro__head">
            <p className="hsv-label">Our Story</p>
            <h2 className="hsv-intro__h" id="hsv-intro-t">
              Born above the ordinary
            </h2>
          </div>

          <div className="hsv-intro__body">
            {/* The hook, set larger than what follows — it is one line and it is
                the claim, so it carries the step down from the heading rather
                than the body having to start at full size. */}
            <p className="hsv-intro__lede">
              Deep within the Shivalik Himalayas lies a source untouched by time.
            </p>
            <p className="hsv-prose">
              Himspring flows from protected high-altitude aquifers, patiently acquiring
              its unique mineral balance as it trickles through ancient mountain strata
              over centuries.
            </p>
            <p className="hsv-prose">
              We do not alter what nature has perfected; we preserve it. Every bottle
              delivers the raw purity, balance, and timeless character of its Himalayan
              origin, elevating every sip into an extraordinary experience.
            </p>
          </div>
        </div>

        {/* The family, climbing into the landscape. Staggered so the three do
            not arrive as one block — see `.hsv-rise__item` for the timing.

            This was the two formats, glass and PET at opposing angles. It is
            the family now, which changes what the group has to do: two vessels
            at angles were a still life, three volumes standing in a row are a
            measurement. So they stand upright on one baseline, and their only
            difference is height. */}
        <div className="hsv-rise">
          <div className="hsv-rise__field" aria-hidden="true">
            {/* Glass explicitly, not "whatever the family section is showing".
                This runs before that section and has no switch of its own, and
                the two are not linked on purpose: this is the introduction of
                the family, and introducing it in a vessel the reader has not met
                yet would make the first thing they see a variant. The rise's own
                ladder is authored in CSS on .hsv-rise__item--N, off its own 52vh
                base — it does not read `ml`, so these three are a fixed group. */}
            {FAMILIES.glass.map((m, i) => (
              <span className={`hsv-rise__item hsv-rise__item--${i + 1}`} key={m.id}>
                {/* the outdoor render: this ladder climbs into the film's
                    landscape, not onto a plate — see BottleGroundId */}
                <FormatBottle variant="glass" ground="rise" />
              </span>
            ))}
          </div>

          {/* Why Himspring, in the slot "The Himspring family" held.

              This is the beat the four claims belong to. The three-sizes copy
              that was here is not information the page loses — [04] states every
              size in its own panel, with the volume, the name and a note, which
              is where a reader comparing 750 against 500 actually goes.

              The layout is the part that took work. A 34ch column bottom-right
              is what a two-line caption wants and not what four claims want: at
              that measure they collided with the tallest bottle, and four across
              at the frame's full width ran through the whole ladder. So the frame
              is split down the middle instead — see .hsv-rise__copy. */}
          <div className="hsv-rise__copy">
            <WhyHimspring />
          </div>
        </div>
      </div>

      {/* The nav's Purity target.

          It cannot go on .hsv-rise__copy: that lives inside a sticky pin, so its
          box is wherever the pin currently is, and an anchor jump to it lands
          somewhere that depends on where you already were. This is a zero-height
          marker on the section itself, at the scroll depth where the rise is
          actually on screen — RISE_START is 0.72 of the scrubbable span, so 78%
          puts the reader just inside the beat with the climb still to come. */}
      <span className="hsv-intro__mark" id="purity" aria-hidden="true" />
    </section>
  );
}
