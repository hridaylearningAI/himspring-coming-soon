import type { FormatId } from "./formats";

/* The family — the same water in three sizes, in each of the two vessels.

   Where the old Glass/PET pair argued "same water, different vessel", this
   argues "same vessel, different amount". That is a harder thing to show,
   because the difference is pure scale: three photographs of the same bottle
   are only distinguishable if they are drawn at proportional heights against a
   shared baseline. So the panels are deliberately anchored to the same bottom
   edge — the bottle grows upward across each split rather than being re-staged.

   Two families now, keyed by format, because the section grew a switch. They are
   never on screen together: the switch replaces one with the other in place.

   `ml` is the only number the ladder is derived from — see scaleFor below. It is
   not decoration and it is not the same thing as `name`: `name` is what the
   panel says, `ml` is what the composition is built out of. Changing one without
   the other is the one edit here that produces something that looks considered
   and is wrong.

   A fixed 3-tuple per format rather than a plain array: Family.tsx destructures
   all three, and under noUncheckedIndexedAccess a plain array would hand it
   three possibly-undefined panels. A fourth size means widening this type and
   giving that panel its own slice of the scrub — both deliberate edits rather
   than something that silently half-works. */

export type FamilyMember = {
  readonly id: string;
  readonly label: string;
  readonly name: string;
  /* millilitres */
  readonly ml: number;
};

export type Family = readonly [FamilyMember, FamilyMember, FamilyMember];

/* The photographic ground behind each panel, replacing the drawn contour field.

   Positional, not per-member — indexed by which of the three panels it is, and
   deliberately not looked up off a family member. The supplied files are named
   for the volumes they were shot for, and today those volumes are the same in
   both formats, so keying on `ml` would appear to work and would be the wrong
   relationship: these plates are a tonal ladder for the section's three
   *stations*, not a property of a bottle. The day PET gets its real volumes, the
   grounds should not move.

   The ladder is the plates' own: near-white, cream, then sand, deepening across
   the section in the same direction the old flat grounds did and for the same
   reason — a section that lightened as it went would open dark directly below
   the rail's white, and adjacent panels sharing a tone would make the splits
   invisible in the three-up state.

   Each plate is paired with a flat tone sampled from its own average. That tone
   is the panel's background, and it matters in two places: it is what shows
   before the plate has decoded, and it is what shows underneath while the plate
   fades up on --in. A grey there would make every panel flash cool before
   settling warm. */
export type PanelGround = {
  readonly src: string;
  /* the plate's mean colour, as the flat ground beneath it */
  readonly tone: string;
  /* object-position. Framing, chosen against the third this plate ends up in —
     see the note below. */
  readonly focus: string;
};

/* Framing note. The plates are 4:3 and 3:2 against a panel that is close to 2:1,
   so `cover` scales each to the viewport's width and there is only vertical
   slack to spend — object-position's X does nothing here.

   Framed for the three-up state rather than for the whole traverse, because
   that is the frame the section is built to arrive at and hold. Centred works
   for the outer two: their linework and torn strata fall in their own thirds
   anyway. The 500 does not — its middle third is the flat centre of the plate,
   which next to two busy neighbours reads as a gap rather than as quiet. Framed
   from the bottom it brings its gold contours and dotted line up into the third
   and the set holds together. */
export const PANEL_GROUNDS: readonly [PanelGround, PanelGround, PanelGround] = [
  { src: "/assets/family-ground-750.webp", tone: "#eae5df", focus: "50% 50%" },
  { src: "/assets/family-ground-500.webp", tone: "#ecdecb", focus: "50% 100%" },
  { src: "/assets/family-ground-330.webp", tone: "#e6cfaf", focus: "50% 50%" },
];

/* The ladder is anchored here rather than per family, so the two formats share
   one scale and the switch is honest: if a PET size is bigger than any glass
   size, it stands taller on screen. Anchoring each family at its own largest
   would make both look identical and quietly throw that away.

   750ml at 64vh is the composition that was signed off, and everything else is
   derived from it — a shape scaled in all three dimensions grows in height by
   the cube root of its volume, so 500 is (500/750)^(1/3) = .874 and 330 is .761.
   Against the 64vh base that is 56vh and 48.7vh, which is what the three
   hard-coded CSS rules this replaces used to say.

   The ceiling worth knowing: the panel copy ends around 37vh and a bottle's top
   edge sits at 106vh minus its height, so anything past roughly 69vh collides
   with the copy. At this anchor that is about 950ml. A litre would need the base
   dropped to ~59vh, which is a single number here and no other edit — but it is
   a decision about the whole section, not a data entry, so it is not made in
   advance. */
export const LADDER_BASE_ML = 750;

export const scaleFor = (ml: number) => Math.cbrt(ml / LADDER_BASE_ML);

/* Ordered largest first. The section opens on the largest — the one the brand
   leads with — and works down, which is also the order the panels subdivide in.

   Each member carried a `note` — a sentence on what that size is for, set under
   the volume. The three glass ones were named for removal and PET's three went
   with them, because there is one <p> rendering the field for both formats:
   taking it out for glass alone would have left a caption that appears only
   when the switch is thrown, which reads as a defect rather than as a choice.
   The field is gone from FamilyMember rather than left unread, so nothing here
   claims to carry copy the page does not show. The strings are in git if they
   are wanted back.

   PET's three volumes are the glass ones, as a stand-in. The real PET line has
   not been supplied yet, and this is the same kind of placeholder the section
   already carries for the product shots: visible rather than implied, and one
   number away from correct. Because the heights come out of `ml` rather than out
   of CSS, putting the real volumes in fixes the composition automatically —
   there is no second place that has to be kept in step. */
export const FAMILIES: Readonly<Record<FormatId, Family>> = {
  glass: [
    {
      id: "glass-750",
      label: "Size 01",
      name: "750 ml",
      ml: 750,
    },
    {
      id: "glass-500",
      label: "Size 02",
      name: "500 ml",
      ml: 500,
    },
    {
      id: "glass-330",
      label: "Size 03",
      name: "330 ml",
      ml: 330,
    },
  ],
  pet: [
    {
      id: "pet-750",
      label: "Size 01",
      name: "750 ml",
      ml: 750,
    },
    {
      id: "pet-500",
      label: "Size 02",
      name: "500 ml",
      ml: 500,
    },
    {
      id: "pet-330",
      label: "Size 03",
      name: "330 ml",
      ml: 330,
    },
  ],
};
