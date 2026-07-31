"use client";

import { useRef } from "react";
import Reveal from "../../components/Reveal";
import Scene from "../../components/Scene";
import { segment, useScrub } from "../lib/useScrub";
import BottleSVG from "./BottleSVG";

/* [07] outro — the landscape bookend, then the call to action.

   Two beats. The plate is the promised return to the source after a product
   sequence spent on a void, and it is full-bleed and quiet: one line, no
   furniture. Then the reference's pre-order frame — an enormous crop of the
   bottle with the copy set small beside it, which after five sections of the
   whole object reads as the closest the page ever gets to it.

   The line now rises out of the ridge rather than fading in on top of it. That
   needs a third layer: a second copy of the same plate, masked to the mountains
   and painted over the type, so the type is genuinely behind them. See
   .hsv-return__ridge — the mask is a 22KB greyscale file and the picture itself
   is the one already loaded, so the whole effect costs one small download.

   The black band the reference rises into at the end is the footer's own, so it
   is not built here. */

/* the line is clear of the ridge well before the pin releases, so it can be
   read standing still rather than only while it is moving */
const RISE_END = 0.72;

/* Enquiries, hidden for now and not removed. The flag lives here rather than in
   page.tsx because this file renders two sections and only the second one is
   being hidden — gating <Outro /> itself would take the hillside bookend with
   it. Flip to true to bring it back; the markup below is untouched. */
const SHOW_ENQUIRIES = false;

export default function Outro() {
  const returnSection = useRef<HTMLElement | null>(null);
  const pin = useRef<HTMLDivElement | null>(null);

  useScrub(returnSection, (p) => {
    pin.current?.style.setProperty("--climb", segment(p, 0, RISE_END).toFixed(4));
  });

  return (
    <>
      {/* id="commitment" is the nav's "Our Commitment" target. This section is
          the closest thing on the page to that: it runs on sustain-valley.jpg
          and its one line is the provenance claim the whole page has been
          building to. Landing here puts the reader at the top of the beat, with
          the line still behind the ridge and the rise ahead of them, which is
          the start of the gesture rather than the middle of it.

          If a real commitment section is ever written, this id moves to it and
          the nav needs no edit — that is the point of the anchor living on the
          section rather than in the link list. */}
      <section className="hsv-return" id="commitment" ref={returnSection} aria-labelledby="hsv-return-t">
        <div className="hsv-return__pin" ref={pin}>
          <Scene className="hsv-return__scene hsv-plate" src="/assets/natures-finest-expression.jpg" alt="Himalayan mountain peak and pristine turquoise water source">
            {null}
          </Scene>
          <div className="hsv-return__veil" aria-hidden="true" />

          <div className="hsv-return__inner">
            <h2 className="hs-vh" id="hsv-return-t">
              The source
            </h2>
            <p className="hsv-return__line">Nature&rsquo;s Finest Expression</p>
          </div>

          {/* The occluder. Same src as the plate above — the browser has it
              cached, so this is a second paint of one download — masked down to
              the mountains and stacked over the type. */}
          <div className="hsv-return__ridge" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element -- has to
                object-fit cover the identical box as the plate it doubles, or
                the ridge it masks stops registering with the one behind it */}
            <img src="/assets/natures-finest-expression.jpg" alt="" decoding="async" loading="lazy" />
          </div>
        </div>
      </section>

      {SHOW_ENQUIRIES ? (
      <section className="hsv-cta" aria-labelledby="hsv-cta-t">
        <div className="hsv-cta__stage" aria-hidden="true">
          <BottleSVG variant="pet" className="hsv-cta__bottle" />
        </div>

        <div className="hsv-cta__copy">
          <Reveal as="p" className="hsv-label">
            Enquiries
          </Reveal>
          <h2 className="hs-vh" id="hsv-cta-t">
            Enquiries
          </h2>
          <Reveal as="p" className="hsv-prose hsv-blur" delay={90}>
            Distribution, hospitality supply and trade orders are open now. Tell us where
            the water is going and we will come back to you.
          </Reveal>
          <Reveal delay={160}>
            <a className="hs-btn" href="#contact">
              Get in touch
            </a>
          </Reveal>
        </div>
      </section>
      ) : null}
    </>
  );
}
