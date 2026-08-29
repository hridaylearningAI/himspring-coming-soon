import type { CSSProperties } from "react";
import type { FormatId } from "../lib/formats";
import type { PanelGroundId } from "../lib/family";

/* The rendered product shots, replacing the drawn BottleSVG everywhere a format
   bottle is the subject rather than a texture.

   Both were shot in one sitting on the same camera: straight-on at eye level,
   no downward tilt, each filling 94% of its frame. That shared setup is what
   lets a wipe between them work at all — a comparison collapses the moment the
   two subjects are photographed differently. Whatever replaces these has to
   keep that pairing, which is why they are named and typed together here rather
   than being two loose string literals.

   Family.tsx now renders the glass shot in all three of its panels, since the
   per-size shots do not exist yet; when they do they must come from this same
   setup, or the size ladder stops being a ladder and becomes three unrelated
   photographs. See lib/family.ts.

   Only the field bottles stay on BottleSVG. Those are tinted silhouettes at ten
   to fourteen per cent alpha that have to invert from navy-on-mist to
   white-on-navy across the wipe, and a raster cutout cannot recolour.

   Alpha is baked in, and the water column is lit from behind so it carries its
   own light rather than depending on what is behind it. That used to be
   described as what kept the navy wordmark off the navy PET panel; there is no
   navy panel any more — the family ladder is three light photographic plates —
   but the property still matters, because those plates are warm and busy and a
   bottle that took its interior value from its ground would change character
   across the three. */

/* The graded cuts, not the studio renders.

   The originals — bottle-glass-format.webp and bottle-pet-format.webp — are
   still in public/assets and are still the source of truth. They are rendered
   against a grey studio backdrop, and that grey is what you see through the
   glass: the bottle reads as full of backdrop rather than full of water, and at
   the sizes this page uses it, as a solid grey object rather than something you
   can see through. On the family plates it also arrives cool (B about 22 above
   R through the body) onto grounds that run warm.

   These two are the same pixels relit. Nothing is repainted and no geometry
   moves: the grade opens the midtones of the glass, pulls most of the steel out
   of the cast, and leaves a trace of warmth. The mask is saturation, which is
   what keeps all of it off the parts that were already right — glass and water
   sit at s 0.06-0.15, the navy wordmark at 0.71 and the gold cap at 0.58, so
   the label, the birds, the Arabic line and the cap come through untouched.

   One grade, not one per section, and that is the part worth knowing. The first
   attempt assumed the fix was matching each ground's hue and produced two
   variants — a warm one for the family plates and a cool one for the intro
   rise, which stands on a blue mountain at dusk. Wrong diagnosis: warming the
   glass to the cream made it look like tea and the PET like rosé. The fault was
   never the cast, it was the mud. Once the interior reads as clear, it reads as
   clear on both grounds, so there is one asset per format and no environment
   prop to get wrong.

   Regenerate the script from the session scratchpad if these need redoing; the
   parameters are warm 0.12, neutral 0.6, lift 0.68. */
/* Six shots, not two: each vessel is photographed against each of the three
   grounds it can stand on.

   The pair this replaces — bottle-glass-clear and bottle-pet-clear — were one
   studio shot per vessel, reused on every panel. Two things were wrong with
   that. The label's snow was not reliably opaque, so the gold showed through
   where it should have been covered. And a bottle lit for a grey studio has
   grey in its glass wherever the ground it is standing on is cream or sand,
   which is exactly where these stand: a reflection is a picture of the room,
   and theirs was the wrong room.

   So the environment is in the render. Each one was shot against its own plate,
   and the glass carries that plate's warmth down its flanks. Nothing here
   grades or tints at runtime; the light is baked.

   Ground keys the file, not size. The panels happen to be named for volumes,
   but what changes between them is the plate underneath — see PANEL_GROUNDS in
   lib/family. A fourth panel on an existing plate would reuse an existing file.

   "rise" is not a panel. It is the intro's ladder, which climbs into the film's
   final landscape — blue ridges under a pale dawn — and that is the one place a
   warm cream bottle was plainly wrong: it was standing on a cold blue mountain
   carrying the reflections of a cream stone table. Its render is the only one
   of the set shot outdoors.

   All six are cropped to the bottle and normalised to one height, so the
   1 : 0.874 : 0.761 ladder still holds: within a vessel they differ only in
   light, and CSS drives the size. */
/* Every ground a bottle can stand on: the three panel plates, plus the intro's
   landscape. Wider than PanelGroundId, which stays what it says it is. */
export type BottleGroundId = PanelGroundId | "rise";

const SRC: Readonly<Record<FormatId, Readonly<Partial<Record<BottleGroundId, string>>>>> = {
  glass: {
    "750": "/assets/bottle-glass-750.webp",
    "500": "/assets/bottle-glass-500.webp",
    "330": "/assets/bottle-glass-330.webp",
    /* Back to the studio cut this section used before the six-ground set.
       bottle-glass-rise.webp — the outdoor render described above — is still in
       public/assets; this line is the only thing that chose it. */
    rise: "/assets/bottle-glass-clear.webp",
  },
  pet: {
    "750": "/assets/bottle-pet-750.webp",
    "500": "/assets/bottle-pet-500.webp",
    /* Deliberately the 500's render, not a third one.

       PET on the sand plate came back with the label's snow tinted rather than
       opaque — the render let the warm ground through the white, which is the
       exact defect these six were made to fix. Rather than roll it again, the
       500 stands in: its plate is #ecdecb against the 330's #e6cfaf, the
       closest of the three, so its reflections are nearly right and its label
       is certainly right.

       Pointed here rather than copied to a bottle-pet-330.webp, because two
       identical files are two things to keep in step and one of them would
       eventually not be. If the sand render is ever redone, this line is the
       only edit. */
    "330": "/assets/bottle-pet-500.webp",
  },
  /* No cut-outs for sparkling, deliberately. The family section stopped using
     these when the bottle moved into the plate, and sparkling arrived after
     that — so it has plates and no renders. The two places that still mount a
     cut-out (the intro's rise and /purity) both name "glass" literally, so an
     empty map here is not a hole waiting to be hit: it is the accurate statement
     that this format was never shot as a cut-out. Fill it if one is ever
     wanted. */
  sparkling: {},
};

export default function FormatBottle({
  variant,
  ground = "750",
  className,
  style,
}: {
  readonly variant: FormatId;
  /* Which ground this bottle is standing on. Defaults to the palest plate,
     which is the right neutral for /purity's cool mist shelf. The intro's rise
     passes "rise" and gets the outdoor render instead. */
  readonly ground?: BottleGroundId;
  readonly className?: string;
  /* the family section passes --hsv-scale through here: the ladder is a number
     per bottle now, not three CSS rules keyed to three size ids */
  readonly style?: CSSProperties;
}) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element -- height-driven off
       the viewport in vh, with width following the shot's own ratio; next/image
       wants intrinsic dimensions it would then have to fight */
    <img
      className={className}
      style={style}
      /* PET is never on the rise — the ladder there is glass by instruction —
         so its map has no "rise" key and this falls back to the palest plate
         rather than rendering nothing if one is ever added. */
      src={SRC[variant][ground] ?? SRC[variant]["750"]!}
      alt=""
      decoding="async"
      loading="lazy"
    />
  );
}
