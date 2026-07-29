import Reveal from "../../components/Reveal";
import Scene from "../../components/Scene";
import PressureText from "./PressureText";

/* [01] hero — the reference's opening frame, over the Shivalik plate.

   Gluglu opens on a void: title top-centre, product entering from the bottom
   edge and cut off by it. The crop is the idea. A whole small bottle sitting in
   the middle of the frame is a catalogue photograph; a bottle running off the
   bottom edge is an object too big for the page, and it costs nothing.

   The plate stays rather than going white, and carries a heavy veil so it reads
   as a pale ground rather than a photograph — near-white enough for the product
   sequence that follows to feel like the same page, without throwing away the
   thing that actually distinguishes this brand from a steel water bottle. */

export default function HeroV2() {
  return (
    <section className="hsv-hero" id="top" aria-labelledby="hsv-hero-t">
      {/* Not hero-valley.jpg, which is the live homepage's plate: that one has a
          bottle composited into it, and this structure puts a second bottle on
          its own layer in front. Two bottles in one frame, one of them baked
          into the sky, is exactly the cut-out problem the composite was meant to
          solve. Whatever plate this direction ships needs to be clean. */}
      <Scene className="hsv-hero__scene hsv-plate" src="/assets/experience-lake.jpg" alt="" priority>
        {null}
      </Scene>
      <div className="hsv-hero__veil" aria-hidden="true" />

      <div className="hsv-hero__inner">
        <Reveal as="p" className="hs-eyebrow">
          Bottled at the source
        </Reveal>
        <Reveal as="h1" className="hsv-hero__title" id="hsv-hero-t" delay={100}>
          <PressureText text="Natural Spring Water" />
        </Reveal>
      </div>

      {/* Cropped by the section's bottom edge — see .hsv-hero__stage.

          The first real asset on this page, replacing the drawn placeholder:
          the glass bottle rendered from the supplied shape and label artwork,
          cut out to alpha. Its trimmed top edge is the top of the cap, which is
          what lets the stage position it against the measured 47.4% directly
          rather than through an offset. */}
      <div className="hsv-hero__stage" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- height-driven
            off the viewport against a measured crop; see .hsv-hero__stage */}
        <img
          src="/assets/bottle-glass-hero.webp"
          alt=""
          decoding="async"
          fetchPriority="high"
        />
      </div>

      <div className="hsv-hero__foot">
        <Reveal as="p" delay={220}>
          Shivalik Range, Outer Himalaya
        </Reveal>
        <Reveal as="a" className="hs-link" href="#formats" delay={300}>
          Two formats<span className="hs-arw">&#8594;</span>
        </Reveal>
      </div>
    </section>
  );
}
