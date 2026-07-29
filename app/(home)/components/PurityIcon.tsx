import type { PurityPillar } from "../lib/content";

/* Line icons for the purity pillars.

   Stroke colour and sizing come from the call site — `.hs-pur__badge svg` draws
   them gold inside the flanking medallions — so these carry geometry only.

   Drawn on a 64x64 grid with everything inside a 6px margin, because the badge
   centres them in a circle and an off-square icon reads as mis-hung. */

const PATHS: Record<PurityPillar["icon"], readonly string[]> = {
  /* range + snow notch + ground line: the notch is what separates it from a
     generic triangle at 26px */
  altitude: ["M7 45 25 17l9 14 5-7 13 21z", "M19.5 28 25 23.5 30 30", "M9 45h46"],
  pure: ["M32 9c8.5 12.5 13 19 13 25.5a13 13 0 0 1-26 0C19 28 23.5 21.5 32 9z", "M25.5 36.5a7 7 0 0 0 6 6.6"],
  /* a cluster, not one crystal — and tapered rather than straight-sided. Parallel
     sides under a symmetric point read as a pencil at 34px however tall they get;
     the shoulder being the widest part is what makes it a shard. */
  minerals: [
    "M32 6 41 21l-3 27H26L23 21z",
    "M23 21h18",
    "M14 17 21 28l-2 20h-8L9 28z",
    "M50 17 55 28l-2 20h-8l-2-20z",
  ],
  /* the shield carries the range too: "protected" here means the terrain does
     the protecting, so the mountains belong inside it */
  protected: ["M32 7 50 13.5v16C50 42 41.5 49.5 32 53.5 22.5 49.5 14 42 14 29.5v-16z", "M22 34l7-9.5 4.5 6 3.5-4.5 5 8z"],
};

export default function PurityIcon({ name }: { name: PurityPillar["icon"] }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      {PATHS[name].map((d) => (
        <path d={d} key={d} />
      ))}
    </svg>
  );
}
