/* "Himspring in Action" — the drifting card rail, ported from the live-site
   branch's #journey section (app/homeMarkup.js there).

   Five columns of cards at deliberately unequal heights, alternating up and
   down, with a copy panel floating over the middle of them. The unequal heights
   are the point: a rail of identically-cropped frames reads as a contact sheet,
   and the whole effect here depends on the columns never lining up into rows.

   Two of the fifteen cards carry no image at all. They are solid panels with a
   line of italic serif, and they exist so the rail reads as a composition
   rather than a feed — the eye lands on a phrase, not on a sixteenth photograph.

   `h` is the card's height in px, authored rather than derived, and carried in
   the data because the drift speed is computed from the column's total height
   (see InAction.tsx). Changing a height changes that column's duration, which is
   why the two live together. */

export type ActionCard =
  | {
      readonly kind: "image";
      readonly src: string;
      readonly alt: string;
      readonly h: number;
    }
  | {
      readonly kind: "label";
      /* two lines, broken where the original broke them */
      readonly lines: readonly [string, string];
      readonly tone: "navy" | "gradient";
      readonly h: number;
    };

export type ActionColumn = {
  readonly direction: "up" | "down";
  /* which breakpoint drops this column, matching the live rail: it sheds from
     the right as the viewport narrows, five down to two */
  readonly dropAt?: "lg" | "md" | "sm";
  readonly cards: readonly ActionCard[];
};

const up = (slug: string, alt: string, h: number): ActionCard => ({
  kind: "image",
  src: `/home-ref/uploads/${slug}.jpg`,
  alt,
  h,
});
const shot = (slug: string, alt: string, h: number): ActionCard => ({
  kind: "image",
  src: `/home-ref/assets/${slug}.png`,
  alt,
  h,
});

export const ACTION_COLUMNS: readonly ActionColumn[] = [
  {
    direction: "up",
    cards: [
      up("prod-deck", "Himspring bottle and white towel on a teak yacht deck at golden hour", 300),
      shot("journey-club", "A Himspring bottle on a side table in a private members' club", 240),
      up("prod-dining", "Himspring bottle on a candlelit fine dining table", 300),
    ],
  },
  {
    direction: "down",
    cards: [
      shot("journey-bow", "The Himspring emblem on a burgee at the bow of a classic wooden boat at sea", 240),
      { kind: "label", lines: ["Stay above", "the ordinary"], tone: "navy", h: 200 },
      shot("journey-yacht", "A Himspring bottle on a silver tray on a mahogany boat deck at sea", 300),
    ],
  },
  {
    direction: "up",
    dropAt: "sm",
    cards: [
      up("prod-marble", "Himspring bottle beside rolled linen on a marble ledge", 280),
      shot("journey-boatman", "A Himspring bottle on a boat cushion, a swimmer at the gunwale beyond", 300),
      shot("journey-flag", "Flags carrying the Himspring emblem aboard a sailing yacht", 240),
    ],
  },
  {
    direction: "down",
    dropAt: "md",
    cards: [
      up("prod-chalet", "Himspring bottle on slate before a snowy mountain chalet window", 260),
      shot("journey-club", "A Himspring bottle on a side table in a private members' club", 300),
      { kind: "label", lines: ["The difference", "you can taste"], tone: "gradient", h: 210 },
    ],
  },
  {
    direction: "up",
    dropAt: "lg",
    cards: [
      shot("journey-yacht", "A Himspring bottle on a silver tray on a mahogany boat deck at sea", 280),
      up("prod-deck", "Himspring bottle and towel on a teak yacht deck", 240),
      shot("journey-bow", "The Himspring emblem on a burgee at the bow of a classic wooden boat at sea", 300),
    ],
  },
];
