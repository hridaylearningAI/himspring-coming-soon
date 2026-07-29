/* The scattered background bottles behind each format panel.

   Hand-placed, not randomised. A random scatter is a different composition on
   every load, which cannot be judged, tuned or signed off — and these positions
   are doing real work: they stay clear of the copy block on the left (roughly
   6–34% across, 35–65% down) so nothing lands behind a line of text.

   One field serves both panels rather than two. Because the positions are
   identical, the wipe reads as the same arrangement changing material — glass
   becoming PET in place — instead of one field being swapped for an unrelated
   one. That is a second job for a transition that was already earning its keep,
   and it says the thing the section is there to say: same water, same spread,
   different vessel. */

export type FieldBottle = {
  /* per cent across and down the panel; the item is centred on the point */
  readonly x: number;
  readonly y: number;
  /* height in vh */
  readonly s: number;
  /* degrees — none of them upright, for the reason the drift section's two are
     not: a grid of vertical bottles is a catalogue page */
  readonly r: number;
  /* stagger, 0..MAX_DELAY, in the same units as the panel's own reveal progress */
  readonly d: number;
};

/* The largest `d` below. Kept in sync by hand and used to mirror the stagger for
   the panel that reveals right-to-left — see BottleField's `reverse`. */
export const MAX_DELAY = 0.42;

/* Sizes run 5vh to 26vh — a spread of about five to one.

   The first pass ran 8 to 16 and read as a regular field of same-ish bottles,
   because two-to-one is not enough variation to look unplanned; the eye needs
   items that are obviously near and obviously far in the same glance before a
   scatter stops looking like a grid. The big ones are kept away from the copy
   block on the left and the foreground bottle on the right, where the small
   ones do the filling instead. */
export const FIELD: readonly FieldBottle[] = [
  { x: 8, y: 14, s: 18, r: -14, d: 0.0 },
  { x: 34, y: 6, s: 7, r: -17, d: 0.14 },
  { x: 10, y: 88, s: 11, r: 6, d: 0.08 },
  { x: 22, y: 84, s: 24, r: 9, d: 0.1 },
  { x: 38, y: 20, s: 9, r: -6, d: 0.05 },
  { x: 46, y: 64, s: 26, r: 15, d: 0.18 },
  { x: 56, y: 12, s: 6, r: -20, d: 0.12 },
  { x: 62, y: 88, s: 15, r: 5, d: 0.26 },
  { x: 71, y: 42, s: 21, r: -11, d: 0.22 },
  { x: 83, y: 10, s: 8, r: 17, d: 0.3 },
  { x: 90, y: 72, s: 12, r: -8, d: 0.36 },
  { x: 97, y: 36, s: 19, r: 12, d: 0.42 },
  { x: 28, y: 30, s: 5, r: 22, d: 0.2 },
  { x: 52, y: 46, s: 7, r: -25, d: 0.32 },
  { x: 78, y: 64, s: 6, r: 13, d: 0.16 },
  { x: 66, y: 26, s: 13, r: -19, d: 0.38 },
];
