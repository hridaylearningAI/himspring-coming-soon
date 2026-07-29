import { PURITY_PILLARS, type PurityPillar } from "../lib/content";
import PurityIcon from "./PurityIcon";
import Reveal from "./Reveal";

/* [06] purity — four pillars flanking the bottle.

   The centre lane was the travelling bottle's flight path. With the rig parked
   it holds the bottle directly, standing on a masked disc of the source valley.

   The pillars split two to a side, and the sides are mirrored: the left column
   is right-aligned, the right column left-aligned, both reading inward. Each one
   carries a hairline from its rule across the gutter to a dot at the disc's
   edge, so the four claims read as spokes off the bottle rather than as four
   captions that happen to share a row. */

const [leftPillars, rightPillars] = [PURITY_PILLARS.slice(0, 2), PURITY_PILLARS.slice(2)];

function Pillar({ pillar, delay }: { pillar: PurityPillar; delay: number }) {
  return (
    <Reveal className="hs-pur__col" delay={delay}>
      <span className="hs-pur__badge">
        <PurityIcon name={pillar.icon} />
      </span>
      <h3>
        {pillar.title[0]}
        <br />
        {pillar.title[1]}
      </h3>
      {/* the rule is also the anchor for the connector: ::after draws the
          hairline and ::before the dot, both hung off this element so they land
          on its baseline without anyone having to predict the heading's height */}
      <span className="hs-pur__rule" aria-hidden="true" />
      <p>{pillar.body}</p>
    </Reveal>
  );
}

export default function Purity() {
  return (
    <section className="hs-band hs-stage hs-pur" id="purity" aria-labelledby="purity-t">
      <div className="hs-shell hs-pur__shell">
        <Reveal as="p" className="hs-eyebrow hs-pur__eyebrow">
          Purity in every drop
        </Reveal>
        <h2 className="hs-vh" id="purity-t">
          Purity in every drop
        </h2>

        <div className="hs-pur__grid">
          <div className="hs-pur__side">
            {leftPillars.map((pillar, i) => (
              <Pillar pillar={pillar} delay={i * 110} key={pillar.icon} />
            ))}
          </div>

          <div className="hs-pur__lane" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative
                backdrop, sized by its circular container rather than by width */}
            <img className="hs-pur__halo" src="/assets/purity-halo.webp" alt="" decoding="async" loading="lazy" />
            <span className="hs-pur__pool" />
            {/* eslint-disable-next-line @next/next/no-img-element -- height-driven;
                this artwork is 342x1440 and a width-driven rule would blow its
                height far past the lane */}
            <img
              className="hs-pur__bottle"
              src="/actual-bottle-glass.webp"
              alt=""
              decoding="async"
              loading="lazy"
            />
          </div>

          <div className="hs-pur__side">
            {rightPillars.map((pillar, i) => (
              <Pillar pillar={pillar} delay={(2 + i) * 110} key={pillar.icon} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
