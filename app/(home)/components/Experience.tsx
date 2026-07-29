import Reveal from "./Reveal";
import Scene from "./Scene";
import ExperienceScenery from "./scenery/ExperienceScenery";

/* [07] experience — the one dark band, navy behind a dusk lake plate.

   The plate renders at full opacity: it is generated at its final darkness, and
   halving it over navy would also halve the bottle composited into it, which
   needs to read as the brightest thing in the frame. */

export default function Experience() {
  return (
    <section className="hs-exp hs-stage hs-stage--right" aria-labelledby="exp-t">
      <Scene
        className="hs-exp__bg"
        src="/assets/experience-lake.jpg"
        alt="Still lake below the source at dusk"
      >
        <ExperienceScenery />
      </Scene>

      <div className="hs-stage__grid">
        <div className="hs-stage__copy">
          <Reveal className="hs-exp__rule" />
          <Reveal as="h2" className="hs-h2" id="exp-t" delay={80}>
            The experience
            <br />
            of true purity.
          </Reveal>
          <Reveal as="p" delay={180}>
            For fine dining, luxury hospitality, and those who seek the exceptional.
          </Reveal>
        </div>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element -- stacked below the
          copy under 900px, sized in vh; see `.hs-exp > .hs-bottle-static` */}
      <img
        className="hs-bottle-static"
        src="/actual-bottle-glass.webp"
        alt=""
        aria-hidden="true"
        decoding="async"
        loading="lazy"
      />
    </section>
  );
}
