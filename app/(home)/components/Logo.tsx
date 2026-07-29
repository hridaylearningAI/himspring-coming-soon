import type { CSSProperties } from "react";

/* The real wordmark, in the two cuts the site uses.

   This replaces the drawn monogram — an `hs` set in Times italic over a
   letterspaced "Himspring" — which was a stand-in built to hold the position
   until the artwork arrived. Nothing about it survives, and the layout it sat
   in had to change with it.

   Both files are cut from public/label.png by a script kept in the scratchpad,
   not at build time. label.png is the bottle label: the tall condensed
   HIMSPRING with the three birds over the G, then "NATURAL HIMALAYAN WATER"
   with its Arabic setting beneath, then the gold mountain. The first two blocks
   are the logo; the mountain is the label's illustration and is left behind,
   because it is 747 of the artwork's 1713 rows and a bar deep enough to show it
   would be a bar deep enough to be a section.

   The script also re-sets the space between the two blocks. The label leaves
   ~235px of air there, which is right on a tall bottle panel and reads as two
   unrelated pieces of type anywhere else; the lockup here sets it at 16% of the
   wordmark's height so the two read as one mark. Nothing else is altered — the
   file already carries a real alpha channel, so there is no white to key out.

   WORDMARK is the top block alone, 3.06:1. LOCKUP is both, 2.12:1. Both the nav
   and the footer use the lockup.

   Two assets rather than one scaled, because the descriptor has a floor. It is
   two lines inside 54 of the lockup's 274 rows, so it scales at a fifth of the
   whole: at a 64px lockup the Latin line is about 5px tall, which a wide-tracked
   all-caps setting still carries, and below roughly 46px it stops resolving.
   Anywhere the mark has to sit shorter than that, the answer is the wordmark
   cut rather than a smaller lockup — that is what `lockup={false}` is for.
   Nothing calls it today; the asset is kept so the alternative exists the day
   something needs it. */

const WORDMARK = { src: "/assets/logo-wordmark.webp", width: 581, height: 190 };
const LOCKUP = { src: "/assets/logo-lockup.webp", width: 581, height: 274 };

export function Logo({
  href,
  lockup = false,
  light = false,
  eager = false,
  className,
  style,
}: {
  /* renders as a link when set, a plain span when not — the nav wants the
     first, the footer the second */
  readonly href?: string;
  /* include the descriptor. Needs ~46px of overall height to stay legible. */
  readonly lockup?: boolean;
  /* reversed to white, for navy grounds */
  readonly light?: boolean;
  /* the nav's copy is the page's LCP candidate and must not be lazy */
  readonly eager?: boolean;
  readonly className?: string;
  readonly style?: CSSProperties;
}) {
  const art = lockup ? LOCKUP : WORDMARK;
  const cls = [
    "hs-logo",
    lockup ? "hs-logo--lockup" : "hs-logo--wordmark",
    light ? "hs-logo--light" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const img = (
    /* eslint-disable-next-line @next/next/no-img-element -- sized by height off
       a clamp with width following the artwork's own ratio, so there is no
       authored px width for next/image to build a srcset against; both files
       are flat two-colour lossless WebP under 50KB and there is nothing for a
       resize pipeline to save */
    <img
      src={art.src}
      width={art.width}
      height={art.height}
      /* The mark is the accessible name of the link it sits in, so it carries
         the alt rather than being decorative with an aria-label on the anchor —
         one name, from the element that actually shows it. The descriptor is
         not read out: it is set into the artwork, and a screen reader
         announcing "Natural Himalayan Water" every time it lands on the logo is
         noise, not information. */
      alt="Himspring"
      decoding="async"
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
    />
  );

  if (href) {
    return (
      <a className={cls} href={href} style={style}>
        {img}
      </a>
    );
  }
  return (
    <span className={cls} style={style}>
      {img}
    </span>
  );
}
