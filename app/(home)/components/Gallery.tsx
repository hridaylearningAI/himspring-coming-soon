import { GALLERY_COLUMNS, type GalleryColumn } from "../lib/content";
import Reveal from "./Reveal";

/* [09] gallery — columns of images drifting past a fading window.

   Each column travels exactly -50%, so its contents have to appear twice for the
   seam to land on an identical copy. The static file cloned the nodes in JS on
   load; here the second set is rendered on the server, so the rail is complete
   in the first paint instead of reflowing once hydration lands.

   The duplicates carry data-clone, which is how reduced motion drops them: with
   the loop stopped they would just be every picture printed twice. */

function Column({ column }: { column: GalleryColumn }) {
  const classes = [
    "hs-gal__col",
    column.direction === "down" ? "hs-gal__col--down" : null,
    column.dropAt === "md" ? "hs-gal__col--md" : null,
    column.dropAt === "lg" ? "hs-gal__col--lg" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} style={{ "--dur": column.duration } as React.CSSProperties}>
      {[false, true].map((isClone) =>
        column.images.map((image) => (
          <figure
            className="hs-gal__frame"
            key={`${image.src}${isClone ? "-clone" : ""}`}
            {...(isClone ? { "data-clone": "", "aria-hidden": true } : {})}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- fixed 3:2
                frames that the picture drifts inside; the columns overflow by
                design and that overflow is what scrolls */}
            <img
              src={image.src}
              alt={isClone ? "" : image.alt}
              loading="lazy"
              decoding="async"
            />
          </figure>
        ))
      )}
    </div>
  );
}

export default function Gallery() {
  return (
    <section className="hs-gal hs-band" id="gallery" aria-labelledby="gal-t">
      <div className="hs-shell">
        <div className="hs-gal__head">
          <Reveal as="p" className="hs-eyebrow">
            In place
          </Reveal>
          <Reveal as="h2" className="hs-h2" id="gal-t" delay={80}>
            Where it belongs.
          </Reveal>
          <Reveal as="p" className="hs-body" delay={160}>
            From a hidden spring in the Shivalik foothills to the tables, decks and lounges
            that ask for the exceptional.
          </Reveal>
        </div>

        <div className="hs-gal__rail" id="galrail" aria-label="Himspring in place">
          {GALLERY_COLUMNS.map((column) => (
            <Column column={column} key={column.duration} />
          ))}
        </div>
      </div>
    </section>
  );
}
