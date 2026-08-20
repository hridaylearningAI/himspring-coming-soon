import type { Family } from "./family";

/* Still or sparkling — a third product axis, orthogonal to vessel and size.

   FormatId is glass | pet: the vessel. Family is 750 | 500 | 330: the amount.
   Kind is the water. Putting sparkling on FormatId would make the family switch
   lie — that control is the bottle, and sparkling has no PET. Nesting a sparkling
   family under FAMILIES would invent a PET line the mockups do not have.

   So the still families stay in family.ts, keyed by format, and this module
   holds the kind identifier plus the one sparkling family that exists: glass,
   three sizes, the same millilitre ladder. scaleFor() still comes from there,
   because a 750 of sparkling is the same shape as a 750 of still. */

export type KindId = "still" | "sparkling";

/* Display order if a switch is ever drawn. Still first: it is the site's opening
   claim, and a control whose first option is not the one already showing reads
   as broken. Sparkling is named from the bottle, not "carbonated". */
export const KINDS: readonly { readonly id: KindId; readonly label: string }[] = [
  { id: "still", label: "Still" },
  { id: "sparkling", label: "Sparkling" },
];

/* Occasion under each size on /sparkling, keyed by ml so a renamed panel cannot
   silently keep the wrong use-line. Same three stations as the still glass
   notes — shared table, carried, place setting — because the vessels are the
   same volumes. */
export const SPARKLING_OCCASION: Readonly<Record<750 | 500 | 330, string>> = {
  750: "The shared bottle",
  500: "The one you carry",
  330: "The place setting",
};

/* Glass only. A PET sparkling line would be a second family here, not a second
   format on FAMILIES — same reason this file exists. */
export const SPARKLING_FAMILY: Family = [
  {
    id: "sparkling-750",
    label: "Size 01",
    name: "750 ml",
    ml: 750,
    note: "The shared bottle. Set down in the middle of the table and poured from all evening.",
  },
  {
    id: "sparkling-500",
    label: "Size 02",
    name: "500 ml",
    ml: 500,
    note: "The one you carry. Enough for a morning, small enough to hold in one hand.",
  },
  {
    id: "sparkling-330",
    label: "Size 03",
    name: "330 ml",
    ml: 330,
    note: "The place setting. One glass, poured and finished, with nothing left standing.",
  },
];
