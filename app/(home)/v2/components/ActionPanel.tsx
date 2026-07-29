"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* The In Action copy plate, which introduces itself and then gets out of the way.

   The section is a gallery. The panel states what the gallery is, and once that
   has been read it is the only thing standing between the viewer and the
   pictures — so it holds long enough to be read and then clears, leaving the
   rail unobstructed.

   Not driven by useReveal, which unobserves each element the first time it
   fires: that is right for an entrance that happens once, and wrong here,
   because scrolling back to a section whose only copy has permanently vanished
   reads as a bug rather than as a choice. This keeps observing, so leaving the
   section arms the panel again.

   Opacity only, never visibility or display. The <h2> inside is what
   aria-labelledby on the section points at, so removing it from the
   accessibility tree would leave the section unnamed the moment it faded. */

/* Time at full opacity, after the fade-in has finished.

   Tuned down hard and then back up: 3200 -> 1600 -> 800 -> 300 -> 100 -> 500 ->
   1500. The long original settings read as the plate waiting for the viewer;
   100 overshot the other way, never still long enough to register as having been
   shown at all. 1500 is a deliberate full beat — long enough to read the heading
   and the lede under it, which is roughly what the copy actually needs.

   The fades in deck.css are 200ms in and 300ms out, so the whole gesture is 2s
   and three quarters of it is stillness. This constant is much the largest term,
   so it is the knob to reach for; the fades only shape the edges. */
const HOLD_MS = 1500;
/* Must match the .hsv-jr__panel transition duration in deck.css — the hold is
   measured from the moment the panel is actually readable, not from arrival.
   These two are a pair: if this says 200 and the stylesheet still says 620, the
   timer fires before the fade has finished and the plate starts leaving on its
   way in. */
const FADE_IN_MS = 200;

export default function ActionPanel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  /* idle = not yet arrived (or armed again), in = holding, out = faded away */
  const [phase, setPhase] = useState<"idle" | "in" | "out">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Reduced motion keeps the panel up permanently. Copy that removes itself on
       a timer is exactly what someone who has asked for less motion — and who may
       simply need longer with it — should not be given. The rail behind is
       already stopped for them by deck.css, so there is nothing for the panel to
       be in the way of. */
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || typeof IntersectionObserver === "undefined") {
      setPhase("in");
      return;
    }

    let timer: number | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          window.clearTimeout(timer);
          setPhase("in");
          timer = window.setTimeout(() => setPhase("out"), FADE_IN_MS + HOLD_MS);
        } else {
          /* Armed rather than merely paused: the next arrival should play the
             whole beat again, not resume a half-spent timer. */
          window.clearTimeout(timer);
          setPhase("idle");
        }
      },
      /* Half the plate showing means the section has genuinely been reached, not
         merely clipped into view by a fast scroll past it. */
      { threshold: 0.5 },
    );

    observer.observe(el);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={`hsv-jr__panel is-${phase}`}>
      {children}
    </div>
  );
}
