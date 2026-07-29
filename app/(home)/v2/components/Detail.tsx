import { PROVENANCE, SOURCE_PLACE } from "../../lib/content";
import Reveal from "../../components/Reveal";
import BottleSVG from "./BottleSVG";

/* [06] detail — the exploded cap, lifted off the neck.

   The reference uses this beat to slow the page down after the panels: one
   close, quiet, technical frame before the call to action. It floats the cap
   above the open neck and sets the naming rationale in a narrow column hard
   left, and the separation is the entire image — an assembled bottle here would
   say nothing that the panels have not already said.

   Himspring has no naming story worth a column, so the slot takes the analysis
   figures instead. They were previously a four-cell strip that scrolled past in
   a second; given a whole frame they read as specification rather than
   decoration, which is what they are. */

export default function Detail() {
  return (
    <section className="hsv-detail" id="source" aria-labelledby="hsv-detail-t">
      <div className="hsv-detail__stage" aria-hidden="true">
        <BottleSVG variant="glass" className="hsv-detail__bottle" />
      </div>

      <div className="hsv-detail__copy">
        <Reveal as="p" className="hsv-label">
          The analysis
        </Reveal>
        <h2 className="hs-vh" id="hsv-detail-t">
          The analysis
        </h2>
        <Reveal as="p" className="hsv-prose hsv-blur" delay={90}>
          Drawn from a confined aquifer beneath the {SOURCE_PLACE.line1}, filtered through
          sandstone long before anyone thought to look for it, and sealed without treatment
          at the wellhead.
        </Reveal>

        <Reveal as="dl" className="hsv-spec" delay={160}>
          {PROVENANCE.map((stat) => (
            <div key={stat.key}>
              <dt>{stat.key}</dt>
              <dd>
                {stat.value}
                {stat.unit ? <sup>{stat.unit}</sup> : null}
              </dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
