/* Which product shot to render: the glass bottle or the PET one.

   This used to carry a FORMATS pair as well — Glass and PET with a label, a
   name and a note each — and it drove two sections: the full-bleed panels, and
   the rise at the end of the intro pin. Both of those are the family now, the
   same water in three sizes, so nothing reads that data any more and it is gone
   rather than left sitting here looking current.

   What survives is the identifier, because format and size are orthogonal axes
   and the shots are still per-format: two vessels, three volumes. lib/family.ts
   carries a `bottle: FormatId` on every size for exactly that reason. Keeping
   them in separate modules is what stops a later "add a 1 litre" from quietly
   meaning "add a third format".

   PET now appears in the family section, behind a switch. Glass is what the
   section opens on and PET is not rendered at all until the switch is used —
   which is the point of a switch rather than six panels in sequence: the second
   format costs the reader nothing until they ask for it. */

export type FormatId = "glass" | "pet";

/* Display order, and the order the switch lays its options out in. Glass first
   because it is the default and the section's opening state; a control whose
   first option is not the one already showing reads as broken. */
export const FORMATS: readonly { readonly id: FormatId; readonly label: string }[] = [
  { id: "glass", label: "Glass" },
  { id: "pet", label: "PET" },
];
