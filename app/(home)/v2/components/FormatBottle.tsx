import type { CSSProperties } from "react";
import type { FormatId } from "../lib/formats";

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
const SRC: Readonly<Record<FormatId, string>> = {
  glass: "/assets/bottle-glass-clear.webp",
  pet: "/assets/bottle-pet-clear.webp",
};

export default function FormatBottle({
  variant,
  className,
  style,
}: {
  readonly variant: FormatId;
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
      src={SRC[variant]}
      alt=""
      decoding="async"
      loading="lazy"
    />
  );
}
