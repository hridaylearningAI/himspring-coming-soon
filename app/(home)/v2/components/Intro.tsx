"use client";

import { useRef } from "react";
import { FILM_H, FILM_W, useFilm } from "../lib/useFilm";
import { FAMILIES } from "../lib/family";
import { segment, useScrub } from "../lib/useScrub";
import FormatBottle from "./FormatBottle";

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

/* where the film finishes and the frame is simply the landscape */
const FILM_END = 0.66;
const RISE_START = 0.72;
const RISE_END = 0.95;

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
    drawFilm(segment(p, 0, FILM_END));

    /* The copy starts this section on white and ends it on a ridgeline, so the
       scrim has to be fully up by the time the ridgeline is what is behind it.

       This used to run ARC_END..PUSH_END, which trailed the landscape: by the
       midpoint of the push the water shape already covers the frame and the
       dark near-ridge is sitting behind the text, but the scrim was still at
       about 40%. Fine against the drawn scene, which was near-white everywhere;
       not fine against a photograph. Starting before the arc ends costs
       nothing, because until then the scrim is white over white. */
    el.style.setProperty("--veil", segment(p, 0.34, 0.54).toFixed(3));
    /* and hands over to the formats copy rather than sharing the frame with it */
    el.style.setProperty("--lede", (1 - segment(p, FILM_END, RISE_START + 0.06)).toFixed(3));
    el.style.setProperty("--rise", segment(p, RISE_START, RISE_END).toFixed(3));
  });

  return (
    <section className="hsv-intro" id="formats" ref={section} aria-labelledby="hsv-intro-t">
      <h2 className="hs-vh" id="hsv-intro-t">
        The water, and the two formats it comes in
      </h2>

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

        <div className="hsv-intro__copy">
          <p className="hsv-label">Himspring spring water</p>
          <p className="hsv-prose">
            Himspring is a natural spring water drawn from a confined aquifer beneath the
            Shivalik foothills, bottled at the source and untouched between the rock and
            the seal.
          </p>
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
                <FormatBottle variant="glass" />
              </span>
            ))}
          </div>

          <div className="hsv-rise__copy">
            <p className="hsv-label">The Himspring family</p>
            <p className="hsv-prose">
              One bottle in three sizes &mdash; 750, 500 and 330 millilitres &mdash; so the
              only decision is how much of it you want, never what is inside it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
