import { MountainPaths, SCENE_H, SCENE_W } from "./MountainScene";

/* Placeholder bottle, drawn rather than rendered.

   Here to settle framing, crop and timing before any credits go into a real
   render: it answers "how much of the frame does the bottle eat at each step,
   and where does the copy sit against it" without answering "what does the
   bottle look like", which is the question the render exists for.

   The two variants are not decoration. Glass and PET are the two panels of the
   product sequence, and the panels only work if the eye can tell them apart at
   a glance — so glass is translucent with a visible fill line and PET is opaque
   with ribbing. That difference is what the panel comparison is testing.

   What it deliberately cannot do: rotate in three dimensions. The reference's
   whole product sequence is one continuous camera arc, and an SVG can only fake
   that with a 2D turn. Enough to judge composition, not enough to ship — the
   frame sequence drops into the same slot later. See useScrub.

   Gradient ids are static per variant rather than useId()-derived, which keeps
   this a server component. Two instances of the same variant collide on the id,
   but they collide on identical definitions, so the first simply wins. */

type Props = {
  readonly variant: "glass" | "pet";
  readonly className?: string;
  /* Silhouette only, painted in currentColor, no gradients or clip paths.

     For the scattered background fields, where a dozen instances per panel sit
     at 8–16vh: at that size every gradient stop, highlight and label band is
     sub-pixel and invisible, so the full drawing would cost twenty-odd nodes
     and a duplicate <defs> block each to render something the eye reads as a
     flat shape anyway. Colour comes from the panel through inheritance, which
     is also what lets one field serve a light panel and a dark one. */
  readonly flat?: boolean;
  /* Replaces the water with a window onto the landscape — the intro scrub's
     portal. See `.hsv-bottle__portal` in deck.css for the counter-transform
     that keeps the view through it steady while the bottle turns. */
  readonly portal?: boolean;
};

/* How far above the cap's top plane the viewer sits, as the minor/major ratio
   of the ellipse that plane projects to — which is sin of the angle.

   Was 0.37, measured off the Gluglu recording. Now 0.45, measured off the
   rendered hero bottle in public/assets/bottle-glass-hero.webp, because that
   render is the real asset and this drawing is the stand-in for the sections
   that have not been rendered yet. When the two disagree the render wins, or
   the placeholder is teaching the wrong thing about the product.

   Every horizontal on a cylinder is that same ellipse at a different radius, so
   each one drops by TILT of its own half-width at the front. `arc` below is the
   one place that gets applied. Drawn flat, the bottle reads as an orthographic
   elevation with no viewpoint at all — which is how it looked before this
   constant existed. */
const TILT = 0.45;

/* A horizontal across the body as the viewer actually sees it: a quadratic
   whose apex sits TILT × half-width below the ends. The control point goes to
   twice that, since a quadratic reaches only half way towards its control.

   Split into segment and whole so a closed shape — the label band, which needs
   a curved top *and* a curved bottom traversed right to left — can be composed
   without reversing a finished path string. */
const arcSeg = (x1: number, x2: number, y: number) => {
  const drop = (Math.abs(x2 - x1) / 2) * TILT;
  return `Q${(x1 + x2) / 2} ${y + drop * 2} ${x2} ${y}`;
};
const arc = (x1: number, x2: number, y: number) => `M${x1} ${y} ${arcSeg(x1, x2, y)}`;

/* one silhouette for both, so a format change never reads as a shape change:
   cap, neck ring, flared shoulder, straight body, soft-cornered base. The base
   carries a shallower bulge than a full ellipse would give it — the corner
   radii already eat most of the front edge. */
const BODY =
  "M82 80 L138 80 C138 122 186 142 186 212 L186 645 Q186 680 152 680 Q110 700 68 680 Q34 680 34 645 L34 212 C34 142 82 122 82 80 Z";

/* The filled part of the bottle: everything below the water line, following the
   body's own sides and base. Serves as both the water shape and — in the intro
   scrub — the clip the landscape is seen through, which is exactly why the
   mountains sit where the water would be rather than anywhere else. */
const WATER = `${arc(34, 186, 235)} L186 645 Q186 680 152 680 Q110 700 68 680 Q34 680 34 645 Z`;

/* Where the landscape's centre sits, in the bottle's own units.

   Not 644 — the point the scrub rotates about — even though that is the point
   the counter-transform holds still. The origin is 92% down the bottle, which
   lands well below the middle of the screen, so a scene centred there puts its
   sky across the whole water shape and its ridgeline off the bottom. Centred
   here instead, the horizon falls inside the window, which is the only reason
   any of this is worth doing.

   350 is that offset expressed once: the origin, less the distance from screen
   centre to the origin (about 24vh, ~294 units at this bottle's scale). */
const PORTAL_CY = 350;

/* Margin. The scene's box is 2400x1206 — an aspect of 1.99, which is very close
   to the viewport it was drawn for, so at 1.0 it renders almost exactly
   viewport-sized with no room to spare and shows its own edge at the corners.
   1.2 gives it a fifth of itself in hand.

   `.hsv-intro__scene` in deck.css — the full-bleed copy that fades up beneath
   the portal once it has filled the frame — carries the same figure, so the
   ridgeline is the same size in both and the handover is invisible. */
export const PORTAL_K = 1.2;

/* cap: x 78–142, so half-width 32 and a top face 32 × 11.8 */
const CAP_RX = 32;
const CAP_RY = CAP_RX * TILT;
/* collar: x 82–138 */
const COLLAR_RX = 28;
const COLLAR_RY = COLLAR_RX * TILT;

export default function BottleSVG({ variant, className, flat = false, portal = false }: Props) {
  const glass = variant === "glass";
  const id = `hsv-${variant}`;

  const classes = ["hsv-bottle", `hsv-bottle--${variant}`, flat ? "hsv-bottle--flat" : null, className]
    .filter(Boolean)
    .join(" ");

  if (flat) {
    return (
      <svg className={classes} viewBox="0 0 220 700" fill="none" aria-hidden="true" focusable="false">
        <path d={BODY} fill="currentColor" />
        {/* same tilted cap as the full drawing — at field sizes the ellipse is
            the only perspective cue that survives, so it is the one to keep */}
        <path
          d={`M78 ${8 + CAP_RY} L78 50 A${CAP_RX} ${CAP_RY} 0 0 0 142 50 L142 ${8 + CAP_RY} Z`}
          fill="currentColor"
        />
        <ellipse cx="110" cy={8 + CAP_RY} rx={CAP_RX} ry={CAP_RY} fill="currentColor" />
        <path
          d={`M82 62 L82 72 A${COLLAR_RX} ${COLLAR_RY} 0 0 0 138 72 L138 62 Z`}
          fill="currentColor"
        />
        {/* kept even at this size: the larger field items are 26vh, where the
            ribbing is still just legible and still the only thing separating
            the two formats once the drawing is a silhouette.

            Stroked in the panel's own ground colour, not currentColor: the body
            is already currentColor, so same-colour ribs would be invisible.
            Carving them out in the background colour is what makes them read. */}
        {!glass ? (
          <g stroke="var(--hsv-field-rib)" strokeOpacity=".55" strokeWidth="10" fill="none">
            {[280, 340, 400, 560, 620].map((y) => (
              <path d={arc(34, 186, y)} key={y} />
            ))}
          </g>
        ) : null}
      </svg>
    );
  }

  return (
    <svg
      className={classes}
      viewBox="0 0 220 700"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="34" y1="0" x2="186" y2="0" gradientUnits="userSpaceOnUse">
          {/* Glass is mostly not there: low alpha throughout, so the panel
              behind it comes through the body. PET is opaque and distinctly
              grey. Side by side that difference is legible in the half second
              the wipe takes, which is the only thing these two panels are
              testing — an earlier pass had both reading as the same pale
              silhouette and the comparison said nothing. */}
          {glass ? (
            <>
              <stop offset="0" stopColor="#cfe0ea" stopOpacity=".5" />
              <stop offset=".28" stopColor="#f4f9fb" stopOpacity=".18" />
              <stop offset=".62" stopColor="#dce9f1" stopOpacity=".24" />
              <stop offset="1" stopColor="#a9c2d2" stopOpacity=".45" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#8fa3b2" />
              <stop offset=".3" stopColor="#cbd6de" />
              <stop offset=".68" stopColor="#a8bac6" />
              <stop offset="1" stopColor="#7e93a3" />
            </>
          )}
        </linearGradient>

        {/* the water column — glass only, and the reason the two panels read
            differently at a distance */}
        <linearGradient id={`${id}-fill`} x1="34" y1="0" x2="186" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8fb6cd" stopOpacity=".55" />
          <stop offset=".4" stopColor="#c8dfec" stopOpacity=".4" />
          <stop offset="1" stopColor="#7fa5bd" stopOpacity=".6" />
        </linearGradient>

        <linearGradient id={`${id}-cap`} x1="78" y1="0" x2="142" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--hs-gold-deep)" />
          <stop offset=".35" stopColor="var(--hs-gold)" />
          <stop offset="1" stopColor="var(--hs-gold-deep)" />
        </linearGradient>

        <clipPath id={`${id}-clip`}>
          <path d={BODY} />
        </clipPath>
        <clipPath id={`${id}-water`}>
          <path d={WATER} />
        </clipPath>
      </defs>

      <g className="hsv-bottle__body">
        <path d={BODY} fill={`url(#${id}-body)`} />

        {/* The window onto the landscape.

            Two nested groups, and the nesting is the whole trick. The outer one
            carries the counter-transform in CSS — the inverse of whatever
            rotate/scale the scrub is applying to the bottle — so the view
            through the glass stays level and steady while the bottle itself
            turns and grows. The inner one is a fixed translate that centres the
            scene's 2400x1206 box on the same origin the scrub rotates about, so
            the two cancel exactly rather than approximately.

            Without the counter-transform the landscape would be magnified with
            the bottle, and by the end of the arc you would be looking at four
            enormous blurred wedges instead of a range of hills. */}
        {portal ? (
          <g clipPath={`url(#${id}-water)`} className="hsv-bottle__portal-holder">
            <g className="hsv-bottle__portal">
              <g
                transform={`translate(110 ${PORTAL_CY}) scale(${PORTAL_K}) translate(${-SCENE_W / 2} ${-SCENE_H / 2})`}
              >
                <MountainPaths />
              </g>
            </g>
          </g>
        ) : null}

        <g clipPath={`url(#${id}-clip)`}>
          {glass ? (
            <>
              {/* Fill sits below the shoulder, where a filled bottle's does, and
                  its top edge is the ellipse rather than a straight cut — a
                  water line is the one horizontal a viewer reads as a surface,
                  so a flat one contradicts the tilt more loudly than any other. */}
              {/* skipped under portal: the landscape is occupying this shape,
                  and a wash of blue over it would only mute the view */}
              {portal ? null : <path d={WATER} fill={`url(#${id}-fill)`} />}
              {/* the meniscus. A water line with a visible edge is what makes a
                  transparent shape read as full rather than as empty outline. */}
              <path d={arc(34, 186, 235)} stroke="#6f97b0" strokeOpacity=".7" strokeWidth="4" fill="none" />
            </>
          ) : (
            /* ribbing: the cheapest honest signal for "this one is plastic",
               and pushed harder than the first pass — six faint lines vanished
               the moment the bottle was scaled down into a panel */
            <g stroke="#6d8494" strokeOpacity=".5" strokeWidth="4" fill="none">
              {[250, 285, 320, 355, 390, 545, 580, 615].map((y) => (
                <path d={arc(34, 186, y)} key={y} />
              ))}
            </g>
          )}

          {/* Specular stripe — the single strongest cue that this is a cylinder
              and not a rounded rectangle. Pulled right back under portal: these
              are opaque white over the exact region the landscape occupies, and
              at full strength they read as fog on the glass. */}
          <rect
            x="58"
            y="120"
            width="18"
            height="540"
            rx="9"
            fill="#ffffff"
            opacity={portal ? ".22" : glass ? ".6" : ".42"}
          />
          <rect
            x="150"
            y="150"
            width="8"
            height="480"
            rx="4"
            fill="#ffffff"
            opacity={portal ? ".12" : glass ? ".32" : ".2"}
          />
        </g>

        <path d={BODY} fill="none" stroke="#7d94a3" strokeOpacity={glass ? ".5" : ".38"} strokeWidth="2" />

        {/* Label band, kept blank: a stand-in wordmark here would get read as a
            design decision about label artwork, which this is not. Both edges
            follow the ellipse — a band wrapped round a cylinder cannot have a
            straight top and bottom from this angle. */}
        {/* Dropped entirely under portal rather than dimmed. At 72% white it
            covers a fifth of the window's height, straight across the middle —
            it was the single thing hiding the landscape, and a label is the one
            piece of this drawing the transition has no use for. */}
        {portal ? null : (
          <path
            d={`${arc(34, 186, 392)} L186 510 ${arcSeg(186, 34, 510)} Z`}
            fill="#ffffff"
            opacity={glass ? ".72" : ".8"}
            clipPath={`url(#${id}-clip)`}
          />
        )}
      </g>

      {/* Its own group so the exploded-cap section can lift it off the neck.

          Built as a cylinder seen from above rather than a rounded rectangle:
          an elliptical top face, straight sides, and a front edge that bulges
          down by the same ellipse. This is the single strongest perspective cue
          on the whole drawing — it is what the eye reads first. */}
      <g className="hsv-bottle__cap">
        <path
          d={`M78 ${8 + CAP_RY} L78 50 A${CAP_RX} ${CAP_RY} 0 0 0 142 50 L142 ${8 + CAP_RY} Z`}
          fill={`url(#${id}-cap)`}
        />
        {/* the top face catches the light, so it sits a shade off the side wall */}
        <ellipse cx="110" cy={8 + CAP_RY} rx={CAP_RX} ry={CAP_RY} fill="var(--hs-gold)" />
        <ellipse
          cx="110"
          cy={8 + CAP_RY}
          rx={CAP_RX}
          ry={CAP_RY}
          fill="none"
          stroke="var(--hs-gold-deep)"
          strokeOpacity=".55"
          strokeWidth="2"
        />
        <path
          d={`M82 62 L82 72 A${COLLAR_RX} ${COLLAR_RY} 0 0 0 138 72 L138 62 Z`}
          fill="#c3d2dc"
          stroke="#7d94a3"
          strokeOpacity=".45"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
