import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "../components/Reveal";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { AWAY_SECTION_LINKS } from "../lib/content";
import "../internal.css";

export const metadata: Metadata = {
  title: "Our Story · Born Above 6,000 Ft | Himspring",
  description:
    "Discover the origin of Himspring — natural Himalayan spring water formed through patience, pressure, and purity above 6,000 feet.",
  alternates: { canonical: "/our-story" },
};

export default function OurStoryPage() {
  return (
    <div className="hsi">
      <a className="hs-skip" href="#main">
        Skip to content
      </a>

      <SiteNav links={AWAY_SECTION_LINKS} origin="/" />

      <main id="main">
        <section className="hsi-hero">
          <div className="hsi-hero__scene">
            <Image
              src="/assets/our-story-gen.jpg"
              alt="Himalayan mountain range above clouds at sunrise"
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="hsi-hero__veil" aria-hidden="true" />
          <div className="hsi-hero__inner">
            <Reveal as="p" className="hs-eyebrow">
              Elevation as narrative
            </Reveal>
            <Reveal as="h1" className="hsi-hero__title" delay={80}>
              Every drop has a beginning
            </Reveal>
            <Reveal as="p" className="hsi-hero__lede" delay={160}>
              Himalayan spring water forms through patience, pressure, and purity. Born high above
              the clouds at extreme altitude, Himspring represents an unyielding standard for the
              world&rsquo;s most discerning spaces.
            </Reveal>
          </div>
        </section>

        {/* CHAPTER I — GLACIAL ORIGIN */}
        <section className="hs-band hsi-band hsi-band--snow" aria-labelledby="story-origin">
          <div className="hs-shell">
            <div className="hsi-duo">
              <div>
                <Reveal as="p" className="hs-eyebrow">
                  Chapter I — Our Beginning
                </Reveal>
                <Reveal as="h2" className="hs-h2" id="story-origin" delay={60}>
                  In the heart of the Himalayas, purity lives
                </Reveal>
                {/* .hs-body--lead carries the drop cap; the sibling rule
                    .hs-body + .hs-body owns the gap to the paragraph after it,
                    so neither needs a margin of its own. */}
                <Reveal as="p" className="hs-body hs-body--lead" delay={120}>
                  Where the air is crisp and the earth remains untouched lies the wellhead of
                  Himspring. Protected by geological terrain and untouched time, our water begins its
                  journey thousands of feet above sea level.
                </Reveal>
                <Reveal as="p" className="hs-body" delay={160}>
                  Slow percolation across ancient subterranean sandstone strata naturally clarifies
                  every drop while instilling a balanced mineral signature that cannot be replicated
                  artificially.
                </Reveal>
              </div>

              <Reveal className="hsi-frame" delay={200}>
                <Image
                  src="/assets/story-spring.jpg"
                  alt="Himalayan mountain spring water basin"
                  width={640}
                  height={480}
                />
                <p className="hsi-frame__cap">
                  Subterranean spring recharge in the Shivalik range
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* CHAPTER II — THE PHILOSOPHY OF ELEVATION */}
        <section className="hs-band hsi-band hsi-band--navy" aria-labelledby="story-club">
          <div className="hs-shell">
            <div className="hsi-head">
              <Reveal as="p" className="hs-eyebrow">
                Chapter II — Quiet Privilege
              </Reveal>
              <Reveal as="h2" className="hs-h2" id="story-club" delay={60}>
                The 1% Club philosophy
              </Reveal>
              <Reveal as="p" className="hs-body" delay={120}>
                Rooted in the commitment to rise one percent each day, Himspring belongs naturally in
                fine dining, private aviation, luxury hospitality, and private residence spaces.
              </Reveal>
            </div>

            <div className="hsi-trio">
              <Reveal className="hsi-card">
                <p className="hsi-card__num">01</p>
                <h3 className="hsi-card__title">Sacred altitude</h3>
                <p className="hsi-card__body">
                  Sourced far above urban congestion and human runoff, snowmelt gathers in natural
                  mountain catchment basins protected by law and terrain.
                </p>
              </Reveal>

              <Reveal className="hsi-card" delay={80}>
                <p className="hsi-card__num">02</p>
                <h3 className="hsi-card__title">Intentional living</h3>
                <p className="hsi-card__body">
                  Created for individuals who read brands through subtle signals of taste, authentic
                  origin, and quiet restraint rather than loud status.
                </p>
              </Reveal>

              <Reveal className="hsi-card" delay={160}>
                <p className="hsi-card__num">03</p>
                <h3 className="hsi-card__title">Uncompromising quality</h3>
                <p className="hsi-card__body">
                  Bottled directly at the subterranean spring into architectural glass vessels that
                  preserve the natural ionic structure intact.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* MANIFESTO */}
        <section className="hs-band hsi-band hsi-band--plain">
          <div className="hs-shell">
            <Reveal as="figure" className="hsi-quote">
              <blockquote className="hsi-quote__q">
                &ldquo;Purity is not a claim made on a label — it is the quiet equilibrium between
                ancient geological time and untouchable altitude.&rdquo;
              </blockquote>
              <figcaption className="hsi-quote__cite">Himspring Brand Manifesto</figcaption>
            </Reveal>
          </div>
        </section>

        {/* CHAPTER III — CORE VALUES */}
        <section className="hs-band hsi-band hsi-band--mist" aria-labelledby="story-values">
          <div className="hs-shell">
            <div className="hsi-head">
              <Reveal as="p" className="hs-eyebrow">
                Chapter III — Foundation
              </Reveal>
              <Reveal as="h2" className="hs-h2" id="story-values" delay={60}>
                The values that define us
              </Reveal>
            </div>

            <div className="hsi-duo">
              <Reveal className="hsi-card">
                <p className="hsi-card__num hsi-card__num--word">Authenticity</p>
                <h3 className="hsi-card__title">True to Himalayan origin</h3>
                <p className="hsi-card__body">
                  Zero synthetic mineral dosing, zero chemical additives, zero industrial RO
                  manipulation. Pure Himalayan spring water in its natural state.
                </p>
              </Reveal>

              <Reveal className="hsi-card" delay={80}>
                <p className="hsi-card__num hsi-card__num--word">Responsibility</p>
                <h3 className="hsi-card__title">Accountable to nature</h3>
                <p className="hsi-card__body">
                  Securing watershed recharge zones, eliminating single-use plastics, and supporting
                  local Himalayan mountain heritage communities.
                </p>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
