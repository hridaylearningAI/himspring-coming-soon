import Reveal from "./Reveal";
import Scene from "./Scene";
import HeroScenery from "./scenery/HeroScenery";

/* [02] hero — full-bleed plate, copy split above and below the bottle.

   The foreground snow bank that used to sit here is gone, not commented out: it
   existed to fake occlusion for a cut-out bottle, and the bottle is composited
   into the plate with real contact now. The .hs-hero__fg rule is still in the
   stylesheet if that treatment ever comes back. */

export default function Hero() {
  return (
    <section className="hs-hero" id="top" aria-labelledby="hero-t">
      <Scene
        className="hs-hero__scene"
        src="/assets/hero-valley.jpg"
        alt=""
        priority
      >
        <HeroScenery />
      </Scene>

      <div className="hs-hero__veil" aria-hidden="true" />

      <div className="hs-hero__stage" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- height-driven
            against the stage box; see .hs-hero__bottle in home.css */}
        <img
          className="hs-hero__bottle hs-bottle-static"
          src="/actual-bottle-glass.webp"
          alt=""
          decoding="async"
        />
      </div>

      <div className="hs-hero__inner">
        <div className="hs-hero__copy">
          <Reveal as="p" className="hs-eyebrow">
            Bottled at the source
          </Reveal>
          <Reveal as="h1" className="hs-hero__title" id="hero-t" delay={100}>
            Purity for the World&rsquo;s Elite
          </Reveal>
        </div>

        <div className="hs-hero__foot">
          <Reveal as="p" delay={200}>
            Nature&rsquo;s Finest, Reserved for the Few
          </Reveal>
          <Reveal as="a" className="hs-link" href="#source" delay={300}>
            Discover the source<span className="hs-arw">&#8594;</span>
          </Reveal>
        </div>
      </div>

      <div className="hs-scrollcue" aria-hidden="true" />
    </section>
  );
}
