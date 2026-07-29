/* Travelling bottle: one element, a pose per section.

   The rig is parked — the bottle is composited into the section plates
   themselves now. Everything here still works: flip RIG_ENABLED to true to bring
   it back, and hide .hs-bottle-static / the in-plate bottles.

   Keeping the stations rather than deleting them is deliberate. They are the
   record of where the bottle sits in each section, tuned by eye, and they are
   what the in-plate compositing was matched against. */

export type Station = {
  /* section to anchor to */
  readonly sel: string;
  /* fraction of the section's height the pose is centred on */
  readonly k: number;
  /* translate, in vw / vh */
  readonly x: number;
  readonly y: number;
  /* scale, rotation in degrees, opacity, glow opacity */
  readonly s: number;
  readonly r: number;
  readonly o: number;
  readonly g: number;
};

export const RIG_ENABLED = false;

export const STATIONS = [
  /* large, centred, upright: the headline crosses the clear shoulder, the
     closing line the clear midriff, and the label falls in the gap between */
  { sel: "#top", k: 0.5, x: 0, y: 3.5, s: 1.02, r: 0, o: 1, g: 0 },
  { sel: ".hs-story", k: 0.5, x: -22, y: 0, s: 0.8, r: -6, o: 1, g: 0 },
  { sel: ".hs-src", k: 0.5, x: -14, y: -78, s: 0.58, r: 0, o: 0, g: 0 },
  { sel: "#purity", k: 0.5, x: 0, y: 0, s: 0.74, r: 0, o: 1, g: 0.16 },
  { sel: ".hs-exp", k: 0.5, x: -21, y: 0, s: 1.02, r: -12, o: 1, g: 1 },
  { sel: "#sustainability", k: 0.5, x: 23, y: 0, s: 0.66, r: 7, o: 1, g: 0 },
  { sel: "#contact", k: 0.5, x: 0, y: -88, s: 0.46, r: 0, o: 0, g: 0 },
] as const satisfies readonly Station[];

/* the numeric pose channels, i.e. everything on a Station that gets interpolated */
export type PoseKey = "x" | "y" | "s" | "r" | "o" | "g";
export const POSE_KEYS = ["x", "y", "s", "r", "o", "g"] as const;
