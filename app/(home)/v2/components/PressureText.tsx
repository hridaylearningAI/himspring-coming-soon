"use client";

import { useEffect, useRef } from "react";

/* The hero headline, responding to the pointer.

   Adapted from React Bits' TextPressure, which drives a variable font's wght,
   wdth and ital axes from cursor distance. Devasia has no axes — all five
   supplied files are static OTFs with no fvar table — so font-variation-settings
   does precisely nothing here, and the component as published would have shipped
   the character splitting, the listeners and the frame loop with no visible
   effect whatsoever.

   The first rebuild stepped through four real cuts, Thin to Bold, to fake a
   weight axis. It was visibly jittery and it could not have been otherwise:
   four discrete faces snap as the pointer crosses each threshold, and a CSS
   transition cannot interpolate between two font files because there is nothing
   in between to draw.

   So weight comes from stroke instead. -webkit-text-stroke-width takes a
   fractional pixel value, thickens the glyph outline continuously, and is
   paint-only — it never reflows, so no character can shove its neighbours as it
   thickens. Width is scaleX, also continuous, also paint-only. The whole effect
   is now two interpolated numbers per character and no layout at all.

   Italic is not offered. Devasia ships no italic and a synthetic oblique on a
   condensed display serif looks like a mistake rather than a choice.

   Two further departures from the original:

   1. It does not size the text. The original computes font-size from container
      width over character count, which would throw away the measured clamp on
      .hsv-hero__title. Sizing stays in CSS with the rest of the type ramp.

   2. It measures character centres once, into page coordinates, rather than
      calling getBoundingClientRect per character per frame. Twenty characters
      at sixty frames is twelve hundred forced layouts a second, forever, for a
      decorative effect. It also stops: it bails under reduced motion, runs only
      while the hero is on screen, and parks once the pointer settles. */

/* How heavy a character gets directly under the pointer, in px of outline at
   the hero's own size. Past about 5 the counters in the condensed caps start
   closing up and it reads as a blur rather than as weight. */
const STROKE_MAX = 3.6;

/* the horizontal squeeze, well short of the original's 5..200 width axis: that
   range is built for a grotesque that has a real width axis, and applied as a
   raw transform to a condensed serif it stops looking like a wider cut and
   starts looking like a stretched image */
const SCALE_MIN = 0.94;
const SCALE_MAX = 1.1;

/* pointer easing, and the distance below which we call it settled and stop */
const EASE = 8;
const SETTLED = 0.4;

type Cell = { readonly el: HTMLSpanElement; readonly cx: number; readonly cy: number };

export default function PressureText({
  text,
  alpha = false,
}: {
  readonly text: string;
  /* fades characters out with distance. Off by default — over the hero plate
     the headline is already the only dark thing in the frame, and thinning it
     further costs contrast the type needs. */
  readonly alpha?: boolean;
}) {
  const row = useRef<HTMLSpanElement | null>(null);
  const cells = useRef<Cell[]>([]);
  const maxDist = useRef(1);

  /* page coordinates, not client: centres cached against the document survive a
     scroll, so the cache only has to be rebuilt on resize or a font swap */
  const target = useRef({ x: 0, y: 0 });
  const eased = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    /* This is a desktop-only detail. On the narrow hero the headline is a
       fixed, stacked text column, so binding pointer listeners there causes
       layout churn without a useful interaction. */
    if (window.matchMedia("(max-width: 900px), (prefers-reduced-motion: reduce)").matches) return;

    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-pressure-char]"));
    if (spans.length === 0) return;

    const measure = () => {
      /* Cleared before reading, because getBoundingClientRect reports the
         *transformed* box: measuring a character that already carries a scaleX
         folds that scale into the next measurement. Nothing here pins a width —
         neither stroke nor transform affects layout — so this only has to be
         right about where each character sits. */
      for (const span of spans) span.style.transform = "none";
      cells.current = spans.map((span) => {
        const r = span.getBoundingClientRect();
        return {
          el: span,
          cx: r.left + r.width / 2 + window.scrollX,
          cy: r.top + r.height / 2 + window.scrollY,
        };
      });
      /* Half the span of the letters themselves, not of the row box. The row is
         a block-level flex container and so fills the measure — using its width
         stretched the falloff well past the text, and the outer characters
         never reached the light end of the range. */
      const first = cells.current[0];
      const last = cells.current[cells.current.length - 1];
      maxDist.current = first && last ? Math.max(1, (last.cx - first.cx) / 2) : 1;
      /* rest the pointer at the centre of the line, so the first paint is a
         composed state rather than everything slammed to one end */
      const rowRect = el.getBoundingClientRect();
      const c = {
        x: rowRect.left + rowRect.width / 2 + window.scrollX,
        y: rowRect.top + rowRect.height / 2 + window.scrollY,
      };
      target.current = { ...c };
      eased.current = { ...c };
    };

    measure();
    /* the geometry above is wrong until Devasia has actually loaded */
    void document.fonts?.ready.then(measure).catch(() => {});

    let raf = 0;
    let running = false;
    let visible = false;

    const apply = () => {
      const md = maxDist.current;
      const { x, y } = eased.current;
      for (const cell of cells.current) {
        const dx = cell.cx - x;
        const dy = cell.cy - y;
        const d = Math.sqrt(dx * dx + dy * dy);
        /* 1 under the pointer, 0 at the far end of the line, eased so the
           falloff is gentle near the pointer and quick at the edges */
        const lin = 1 - Math.min(1, d / md);
        const t = lin * lin;

        cell.el.style.transform = `scaleX(${(SCALE_MIN + t * (SCALE_MAX - SCALE_MIN)).toFixed(4)})`;
        cell.el.style.webkitTextStrokeWidth = `${(t * STROKE_MAX).toFixed(2)}px`;
        if (alpha) cell.el.style.opacity = (0.5 + t * 0.5).toFixed(3);
      }
    };

    const tick = () => {
      const dx = target.current.x - eased.current.x;
      const dy = target.current.y - eased.current.y;
      eased.current.x += dx / EASE;
      eased.current.y += dy / EASE;
      apply();
      /* park once the pointer has caught up; the next move restarts us */
      if (Math.abs(dx) < SETTLED && Math.abs(dy) < SETTLED) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || !visible) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX + window.scrollX;
      target.current.y = e.clientY + window.scrollY;
      start();
    };

    /* Only while the hero is on screen. A headline three sections up has no
       business holding a frame loop open. */
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
        if (visible) start();
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(el);

    let resizeId = 0;
    const onResize = () => {
      window.clearTimeout(resizeId);
      resizeId = window.setTimeout(() => {
        measure();
        apply();
      }, 120);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    apply();

    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeId);
      cancelAnimationFrame(raf);
    };
  }, [text, alpha]);

  return (
    <>
      {/* The accessible name, kept as one uninterrupted string. The row below is
          a flex container, which makes assistive technology treat each character
          as its own item and read the headline out letter by letter — the same
          reasoning that put text-transform in CSS rather than literal caps in
          the markup. */}
      <span className="hs-vh">{text}</span>
      <span className="hsv-pressure" aria-hidden="true" ref={row}>
        {Array.from(text).map((ch, i) =>
          ch === " " ? (
            <span className="hsv-pressure__gap" key={i} />
          ) : (
            <span className="hsv-pressure__ch" data-pressure-char key={i}>
              {ch}
            </span>
          ),
        )}
      </span>
    </>
  );
}
