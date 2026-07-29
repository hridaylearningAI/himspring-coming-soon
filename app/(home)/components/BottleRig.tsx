"use client";

import { useEffect, useRef } from "react";
import { POSE_KEYS, RIG_ENABLED, STATIONS, type Station } from "../lib/stations";

/* One bottle, repositioned per section on scroll.

   Currently parked (RIG_ENABLED === false in lib/stations.ts): the bottle is
   composited into the section plates themselves, so running this too would put
   two bottles on screen. The component returns null in that state — no markup,
   no listener, no image request — and everything below stays ready for the flag
   to go back on. */

type Anchor = { at: number; pose: Station };

export default function BottleRig() {
  const rigRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const rig = rigRef.current;
    if (!rig) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || window.innerWidth <= 900) return;

    let anchors: Anchor[] = [];

    const measure = () => {
      anchors = [];
      for (const station of STATIONS) {
        const el = document.querySelector(station.sel);
        if (!(el instanceof HTMLElement)) continue;
        // offsetTop is relative to the offsetParent, so walk the chain to get
        // a document-absolute position.
        let top = 0;
        let node: HTMLElement | null = el;
        while (node) {
          top += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        anchors.push({
          at: Math.max(0, top + el.offsetHeight * station.k - window.innerHeight / 2),
          pose: station,
        });
      }
      anchors.sort((a, b) => a.at - b.at);
    };

    const carry = (y: number) => {
      if (anchors.length < 2) return;
      let i = 0;
      while (i < anchors.length - 2 && y >= anchors[i + 1]!.at) i++;

      const a = anchors[i]!;
      const b = anchors[i + 1]!;
      const span = Math.max(1, b.at - a.at);
      let t = (y - a.at) / span;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      t = t * t * (3 - 2 * t); // smoothstep

      const mix = (k: (typeof POSE_KEYS)[number]) => a.pose[k] + (b.pose[k] - a.pose[k]) * t;

      rig.style.setProperty("--bx", `${mix("x").toFixed(2)}vw`);
      rig.style.setProperty("--by", `${mix("y").toFixed(2)}vh`);
      rig.style.setProperty("--bs", mix("s").toFixed(3));
      rig.style.setProperty("--br", `${mix("r").toFixed(2)}deg`);
      rig.style.setProperty("--bo", mix("o").toFixed(3));
      rig.style.setProperty("--bg", mix("g").toFixed(3));
    };

    let ticking = false;
    const frame = () => {
      carry(window.pageYOffset);
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(frame);
    };
    const onResize = () => {
      measure();
      frame();
    };

    measure();
    frame();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    // stations are measured off laid-out sections, so re-measure once the
    // plates have actually loaded and settled their heights
    window.addEventListener("load", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
    };
  }, []);

  if (!RIG_ENABLED) return null;

  return (
    <div className="hs-rig" id="rig" aria-hidden="true" ref={rigRef}>
      <div className="hs-rig__glow" />
      {/* eslint-disable-next-line @next/next/no-img-element -- the rig sizes in vh
          against a hand-measured centring margin; next/image's own layout styles
          would fight it */}
      <img
        className="hs-rig__bottle"
        src="/actual-bottle-glass.webp"
        alt=""
        decoding="async"
        fetchPriority="high"
      />
    </div>
  );
}
