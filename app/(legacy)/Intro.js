"use client";

import { useEffect, useState } from "react";
import HimspringLogo from "./HimspringLogo";

// Single shared clock for the whole intro. The clouds part over the first
// stretch; then we flip on `intro-sliding`, which transitions BOTH the overlay
// and the main page upward together (see globals.css). The overlay unmounts
// once that slide finishes.
const SLIDE_AT = 3800; // clouds have parted + held — start the slide
const SLIDE_MS = 1200; // must match the transition duration in globals.css
const TOTAL = SLIDE_AT + SLIDE_MS + 200; // + small buffer before unmount

const INTRO_CLASSES = ["intro-lock", "intro-active", "intro-sliding"];

export default function Intro() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      setDone(true);
      return;
    }

    // page is held below the fold + scroll locked while the intro plays
    document.body.classList.add("intro-lock", "intro-active");

    // trigger the synchronized slide-up of the overlay and the page
    const slideTimer = setTimeout(() => {
      document.body.classList.add("intro-sliding");
    }, SLIDE_AT);

    const doneTimer = setTimeout(() => {
      setDone(true);
      document.body.classList.remove(...INTRO_CLASSES);
      // tell the hero to swap the poster for the live video now the slide is over
      window.dispatchEvent(new Event("himspring:intro-done"));
    }, TOTAL);

    return () => {
      clearTimeout(slideTimer);
      clearTimeout(doneTimer);
      document.body.classList.remove(...INTRO_CLASSES);
    };
  }, []);

  if (done) return null;

  return (
    <div className="intro" aria-hidden="true">
      <div className="intro__sky" />
      <div className="intro__clouds">
        <span className="cloud cloud--1" />
        <span className="cloud cloud--2" />
        <span className="cloud cloud--3" />
        <span className="cloud cloud--4" />
        <span className="cloud cloud--5" />
        <span className="cloud cloud--6" />
      </div>
      <div className="intro__logo">
        <HimspringLogo
          variant="reveal"
          size="clamp(160px, 40vw, 300px)"
          startDelay={900}
          interactiveOnHover={false}
        />
      </div>
    </div>
  );
}
