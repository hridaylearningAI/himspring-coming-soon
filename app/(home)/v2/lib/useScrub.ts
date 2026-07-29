"use client";

import { useEffect, useRef, type RefObject } from "react";

/* Maps a pinned section's scroll position to a damped 0..1 and hands it to a
   callback once per frame, for as long as the section is on screen.

   The callback writes CSS custom properties rather than React state. This runs
   at frame rate, and a setState per frame would re-render a whole section tree
   for a number whose only destination is the compositor.

   Deliberately agnostic about what it drives. Today the progress turns an SVG's
   rotate/scale and the clip inset on the wipe panels; when the rendered frame
   sequence arrives it selects an image index instead, and nothing in here has
   to change — which is the whole point of standing the placeholder up first.

   The geometry assumed: a tall section (height > 100vh) whose direct child is
   `position: sticky; top: 0; height: 100vh`. Progress is how far the section
   has travelled through the distance it has to give, so 0 is the moment the
   sticky child locks and 1 is the moment it releases. */

/* Follow factor per frame. Matches the scrub in Source.tsx so the two sections
   decelerate identically — a second easing feel on one page reads as a bug. */
const DAMPING = 0.12;
/* below this the damped value has visibly arrived; snapping avoids an
   asymptote that never terminates the loop */
const SETTLED = 0.0005;

export function useScrub(
  ref: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
) {
  /* held in a ref so an inline arrow at the call site does not retrap the
     effect — and thereby restart the rAF loop — on every render */
  const sink = useRef(onProgress);
  sink.current = onProgress;

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    if (typeof IntersectionObserver === "undefined") return;
    /* No damped follow for reduced motion. The stylesheet unpins these sections
       and states a fixed composition, so driving --p here would fight it. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let progress = 0;
    let raf = 0;
    let onScreen = false;

    const target = () => {
      const r = section.getBoundingClientRect();
      /* what the section has above and beyond the one viewport its sticky child
         occupies — the actual scrubbable distance */
      const span = r.height - window.innerHeight;
      if (span <= 0) return 0;
      const p = -r.top / span;
      return p < 0 ? 0 : p > 1 ? 1 : p;
    };

    const tick = () => {
      const t = target();
      progress += (t - progress) * DAMPING;
      if (Math.abs(t - progress) < SETTLED) progress = t;
      sink.current(progress);
      raf = onScreen ? requestAnimationFrame(tick) : 0;
    };

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? false;
        if (onScreen && !raf) raf = requestAnimationFrame(tick);
      },
      /* start the loop before the section is in view, so it is already settled
         at the right value when the sticky child locks */
      { rootMargin: "20% 0px" },
    );
    io.observe(section);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      onScreen = false;
    };
  }, [ref]);
}

/* Normalises a slice of an overall 0..1 into its own 0..1, clamped at both
   ends — how each wipe panel gets a full reveal out of its share of the scrub. */
export const segment = (p: number, start: number, end: number) => {
  const s = (p - start) / (end - start);
  return s < 0 ? 0 : s > 1 ? 1 : s;
};
