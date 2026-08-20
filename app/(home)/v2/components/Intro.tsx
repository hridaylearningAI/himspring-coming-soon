"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { segment, useScrub } from "../lib/useScrub";
import WhyHimspring from "./WhyHimspring";

/* [02] intro — pinned sequence.

   BOTTLE  one 3D bottle Y-spins and climbs into frame, then clones and fans
           into the 750 / 500 / 330 ladder (all inside IntroBottle).
   RISE    Why Himspring copy fades in beside that ladder. */

const IntroBottle = dynamic(() => import("./IntroBottle"), { ssr: false });

const HOLD_END = 0.18;
const FILM_END = 0.72;
const RISE_START = 0.78;
const RISE_END = 0.97;

const N_LEDE_IN: readonly [number, number] = [0.72, 0.79];
const N_LEDE_OUT: readonly [number, number] = [0.88, 0.92];
const N_RISE: readonly [number, number] = [0.9, 1];

export default function Intro() {
  const section = useRef<HTMLElement | null>(null);
  const pin = useRef<HTMLDivElement | null>(null);

  useScrub(section, (p) => {
    const el = pin.current;
    if (!el) return;

    const rise = segment(p, RISE_START, RISE_END);
    const riseN = segment(p, N_RISE[0], N_RISE[1]);

    el.style.setProperty("--spin", segment(p, HOLD_END, FILM_END).toFixed(4));
    el.style.setProperty("--veil", segment(p, 0.46, 0.62).toFixed(3));
    el.style.setProperty("--lede", (1 - segment(p, FILM_END, RISE_START + 0.06)).toFixed(3));
    el.style.setProperty("--rise", rise.toFixed(3));

    const ledeIn = segment(p, N_LEDE_IN[0], N_LEDE_IN[1]);
    const ledeOut = 1 - segment(p, N_LEDE_OUT[0], N_LEDE_OUT[1]);
    el.style.setProperty("--lede-n", Math.min(ledeIn, ledeOut).toFixed(3));
    el.style.setProperty("--rise-n", riseN.toFixed(3));

    /* Absolute values for the Canvas — mirrors --rise-eff without relying on
       getComputedStyle resolving var(). Breakpoint matches deck.css @900px. */
    const narrow = window.matchMedia("(max-width: 900px)").matches;
    el.style.setProperty("--fan", (narrow ? riseN : rise).toFixed(4));
  });

  return (
    <section className="hsv-intro" id="formats" ref={section} aria-labelledby="hsv-intro-t">
      <div className="hsv-intro__pin" ref={pin}>
        <IntroBottle />

        <div className="hsv-intro__veil" aria-hidden="true" />

        <div className="hsv-intro__copy">
          <div className="hsv-intro__head">
            <p className="hsv-label">Our Story</p>
            <h2 className="hsv-intro__h" id="hsv-intro-t">
              Born above the ordinary
            </h2>
          </div>

          <div className="hsv-intro__body">
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

        <div className="hsv-rise">
          <div className="hsv-rise__copy">
            <WhyHimspring />
          </div>
        </div>
      </div>

      <span className="hsv-intro__mark" id="purity" aria-hidden="true" />
    </section>
  );
}
