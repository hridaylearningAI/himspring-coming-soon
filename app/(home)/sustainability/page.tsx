import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "../components/Reveal";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { AWAY_SECTION_LINKS, SUSTAINABILITY } from "../lib/content";
import "../internal.css";

export const metadata: Metadata = {
  title: "Sustainability & Heritage Preservation | Himspring",
  description:
    "Discover Himspring's environmental commitments: watershed preservation, 100% recyclable glass packaging, and local Himalayan heritage support.",
  alternates: { canonical: "/sustainability" },
};

export default function SustainabilityPage() {
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
              src="/assets/sustainability-gen.jpg"
              alt="Untouched Himalayan mountain valley with pine forest mist"
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="hsi-hero__veil" aria-hidden="true" />
          <div className="hsi-hero__inner">
            <Reveal as="p" className="hs-eyebrow">
              Preserving the roof of the world
            </Reveal>
            <Reveal as="h1" className="hsi-hero__title" delay={80}>
              Stewardship and conscious luxury
            </Reveal>
            <Reveal as="p" className="hsi-hero__lede" delay={160}>
              Purity cannot exist without protection. True luxury requires an uncompromising
              commitment to preserving the Himalayan ecosystem, safeguarding recharge zones, and
              eliminating plastic waste through glass packaging.
            </Reveal>
          </div>
        </section>

        {/* CHAPTER I — THE COMMITMENTS */}
        <section className="hs-band hsi-band hsi-band--snow" aria-labelledby="sus-commitments">
          <div className="hs-shell">
            <div className="hsi-head">
              <Reveal as="p" className="hs-eyebrow">
                Chapter I — Our commitments
              </Reveal>
              <Reveal as="h2" className="hs-h2" id="sus-commitments" delay={60}>
                Responsibility built into every detail
              </Reveal>
            </div>

            <div className="hsi-trio">
              {SUSTAINABILITY.map((item, i) => (
                <Reveal className="hsi-card" key={item.title} delay={i * 80}>
                  <p className="hsi-card__num">0{i + 1}</p>
                  <h3 className="hsi-card__title">{item.title}</h3>
                  <p className="hsi-card__body">{item.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CHAPTER II — ZERO-PLASTIC ARCHITECTURE */}
        <section className="hs-band hsi-band hsi-band--navy" aria-labelledby="sus-glass">
          <div className="hs-shell">
            <div className="hsi-duo">
              <div>
                <Reveal as="p" className="hs-eyebrow">
                  Chapter II — Zero-plastic architecture
                </Reveal>
                <Reveal as="h2" className="hs-h2" id="sus-glass" delay={60}>
                  100% recyclable heavy flint glass
                </Reveal>
                <Reveal as="p" className="hs-body hs-body--lead" delay={120}>
                  Plastic bottles release microplastics and degrade slowly in landfill. Himspring is
                  packaged in premium, heavy-weight flint glass that is infinitely recyclable.
                </Reveal>
                <Reveal as="p" className="hs-body" delay={160}>
                  Our bottling facility uses low-carbon production protocols, locally sourced
                  materials, and optimized freight logistics to minimize our environmental footprint.
                </Reveal>
              </div>

              <Reveal className="hsi-frame" delay={200}>
                <Image
                  src="/assets/family-ground-750.webp"
                  alt="Himspring glass bottle on natural stone"
                  width={640}
                  height={480}
                />
                <p className="hsi-frame__cap">
                  Heavy architectural glass designed for circular sustainability
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* THE CHARTER */}
        <section className="hs-band hsi-band hsi-band--plain">
          <div className="hs-shell">
            <Reveal as="figure" className="hsi-quote">
              <blockquote className="hsi-quote__q">
                &ldquo;We do not inherit the earth from our ancestors; we borrow it from our
                children. Our spring is protected for generations to come.&rdquo;
              </blockquote>
              <figcaption className="hsi-quote__cite">Himspring Sustainability Charter</figcaption>
            </Reveal>
          </div>
        </section>

        {/* CHAPTER III — COMMUNITY HERITAGE */}
        <section className="hs-band hsi-band hsi-band--mist" aria-labelledby="sus-heritage">
          <div className="hs-shell">
            <div className="hsi-head">
              <Reveal as="p" className="hs-eyebrow">
                Chapter III — Beyond the bottle
              </Reveal>
              <Reveal as="h2" className="hs-h2" id="sus-heritage" delay={60}>
                What the spring pays for
              </Reveal>
            </div>

            <div className="hsi-duo">
              <Reveal className="hsi-card">
                <p className="hsi-card__num">01</p>
                <h3 className="hsi-card__title">Himalayan heritage preservation</h3>
                <p className="hsi-card__body">
                  A portion of sales proceeds funds local mountain community education, watershed
                  ecology preservation, and indigenous heritage programmes.
                </p>
              </Reveal>

              <Reveal className="hsi-card" delay={80}>
                <p className="hsi-card__num">02</p>
                <h3 className="hsi-card__title">Low-carbon logistics</h3>
                <p className="hsi-card__body">
                  Consolidated freight networks and regional distribution hubs eliminate redundant
                  transportation miles across global supply chains.
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
