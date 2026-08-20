import Image from "next/image";
import Reveal from "../../components/Reveal";

/* Invitation onto the sparkling vertical, between the still sizes and the
   founders.

   Family is pinned and full-bleed; Founders is an unpinned chessboard on snow.
   This sits between them as a rest: one line, one photograph, a door to
   /sparkling. It is not a second family pin — those plates are still water
   photographed into contour grounds, and the sparkling mockups are white-studio
   shots that would carry the wrong room in the glass.

   Placed after the sizes rather than in the nav: the still argument has to
   finish before a sister line is offered, and the bar has no sixth slot. */

export default function SparklingInvite() {
  return (
    <section className="hsv-spark" aria-labelledby="hsv-spark-t">
      <div className="hs-shell hsv-spark__grid">
        <div className="hsv-spark__copy">
          <Reveal as="p" className="hs-eyebrow">
            Sparkling
          </Reveal>
          <Reveal as="h2" className="hsv-spark__h hsv-blur" id="hsv-spark-t" delay={90}>
            The other finish
          </Reveal>
          <Reveal as="p" className="hsv-prose" delay={140}>
            Carbonated natural Himalayan water, in the same three sizes of flint glass.
          </Reveal>
          <Reveal delay={200}>
            <a className="hs-btn" href="/sparkling">
              The sparkling line
            </a>
          </Reveal>
        </div>

        <Reveal className="hsv-spark__plate" delay={80}>
          <Image
            src="/assets/sparkling-family.webp"
            alt="Himspring Sparkling in 750, 500 and 330 millilitre glass bottles"
            width={682}
            height={1024}
          />
        </Reveal>
      </div>
    </section>
  );
}
