"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

/* The intro's frame sequence, scrubbed.

   The whole ARC/PUSH movement — the bottle leaning over, the camera travelling
   into the water, the landscape opening out — is a rendered 7s clip cut into 150
   stills rather than a transform on a drawn bottle. These are the render's own
   frames, not resampled ones: the take is 169 frames at 24fps and the first 19
   are dropped, which lands on 150 exactly.

   The head is trimmed because the lean barely starts there — under a degree by
   source frame 30 — and a scrub whose first fifth shows nothing reads as broken
   rather than slow.

   The bottle leans, at last. Seedance 2.0 with the approved product shot pinned
   as both start_image and image_references, landing on the landscape plate as
   end_image. Measured 0 to ~16 degrees, monotonic, no wobble.

   What finally made the label survive was removing the axial rotation from the
   prompt and keeping only the lean. A bottle turning on its axis forces the model
   to invent the wordmark foreshortened around a cylinder — there is no ground
   truth for it to copy, which is why every earlier take garbled the two small
   lines. A lean rotates the label in-plane and preserves the letterforms. If this
   shot is ever re-rolled, do not put the rotation back.

   The old version faked refraction with a clip path and a counter-transform
   because SVG had no other option; this is the shot itself.

   Drawn to a canvas rather than swapped through an image element's src.
   Swapping src flashes: the browser drops the current bitmap before the next
   decode lands, so a fast scrub strobes. A canvas lets a frame that is not ready
   yet simply not be drawn, holding the previous one instead — a scrub that
   hesitates reads as heavy, a scrub that flashes reads as broken.

   No rAF of its own. Intro's useScrub already runs one, and the draw call is
   cheap, so this exposes a plain function for that loop to call. Two damped
   loops fighting over the same gesture is exactly how scrubs get their wobble. */

export const FILM_COUNT = 150;

/* The frames' own pixel size, and the canvas backing store. Fixed rather than
   matched to the viewport: `object-fit: cover` in CSS does the fitting, so the
   canvas never needs resizing and nothing has to be redrawn on resize. */
export const FILM_W = 1920;
/* 1072, not 1080. The source artwork is 5504x3072 — 43:24 — which is what 1072
   preserves; Seedance returns 1920x1080 regardless of aspect_ratio:auto, so the
   extraction crops 4px off the top and bottom rather than letting the canvas
   rescale. Declaring 1080 here made drawImage stretch every frame vertically by
   0.75% to fill a backing store 8px taller than the bitmap. Invisible, but it
   meant the canvas was resampling on every draw for no reason. Re-measure this
   if the film is ever re-rendered. */
export const FILM_H = 1072;

const src = (i: number) => `/assets/intro-film/f${String(i + 1).padStart(3, "0")}.webp`;

export function useFilm(canvas: RefObject<HTMLCanvasElement | null>) {
  const frames = useRef<HTMLImageElement[]>([]);
  /* which frame is currently on the canvas, so a scrub that has not crossed a
     frame boundary costs a comparison rather than a drawImage */
  const shown = useRef(-1);

  const draw = useCallback(
    (p: number) => {
      const el = canvas.current;
      if (!el) return;
      const i = Math.round((p < 0 ? 0 : p > 1 ? 1 : p) * (FILM_COUNT - 1));
      if (i === shown.current) return;
      const img = frames.current[i];
      /* Not decoded yet — hold the last good frame rather than clearing to
         blank. During the first pass this makes the film briefly lag the
         scroll; every pass after is served from cache. */
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const ctx = el.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, FILM_W, FILM_H);
      shown.current = i;
    },
    [canvas],
  );

  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < FILM_COUNT; i += 1) {
      const img = new Image();
      img.decoding = "async";
      img.src = src(i);
      imgs[i] = img;
    }
    frames.current = imgs;

    /* The resting frame, for everyone who will never drive the scrub: reduced
       motion (where useScrub bails outright) and the narrow layout (where the
       pin is unpinned and there is no gesture to scrub). Both want the end of
       the move, not the start — the formats rise into the landscape directly
       below, and arriving at that over a studio backdrop makes no sense.

       Everyone else gets frame 0, which is where their scrub begins. */
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rest = reduced ? 1 : 0;

    let cancelled = false;
    const first = imgs[reduced ? FILM_COUNT - 1 : 0];
    first
      ?.decode?.()
      .then(() => {
        if (!cancelled) draw(rest);
      })
      .catch(() => {
        /* decode() rejects on some browsers for images already in cache; the
           load event still gives us a usable bitmap */
        if (!cancelled) draw(rest);
      });

    return () => {
      cancelled = true;
    };
  }, [draw]);

  return draw;
}
