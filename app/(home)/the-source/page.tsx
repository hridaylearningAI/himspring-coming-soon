import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "../components/Reveal";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { AWAY_SECTION_LINKS, PROVENANCE, SOURCE_FACTS } from "../lib/content";
import "../internal.css";

export const metadata: Metadata = {
  title: "The Source · Himalayan Aquifer & Provenance | Himspring",
  description:
    "Explore the geological origin of Himspring water: drawn from a confined aquifer 180–220 meters beneath the Shivalik Himalayan range.",
  alternates: { canonical: "/the-source" },
};

/* The three provenance parameters, read from SOURCE_FACTS plus the one this
   page states that the homepage does not. Declared here rather than added to
   content.ts because the homepage's .hs-card reads SOURCE_FACTS as a pair and a
   third entry would appear there too. */
const FACTS = [...SOURCE_FACTS, { term: "Pressure system", detail: "Sub-artesian self-rising flow" }];

export default function TheSourcePage() {
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
              src="/assets/the-source-gen.jpg"
              alt="Subterranean spring water flowing over sandstone rocks"
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="hsi-hero__veil" aria-hidden="true" />
          <div className="hsi-hero__inner">
            <Reveal as="p" className="hs-eyebrow">
              Born above, pure by nature
            </Reveal>
            <Reveal as="h1" className="hsi-hero__title" delay={80}>
              The Shivalik subterranean aquifer
            </Reveal>
            <Reveal as="p" className="hsi-hero__lede" delay={160}>
              Deep beneath the outer Himalayan foothills, rain and alpine snowmelt percolate across
              centuries of ancient sandstone. Naturally pressurized and pristine, Himspring rises
              without surface contamination.
            </Reveal>
          </div>
        </section>

        {/* THE MEASURED FACTS — the homepage's own provenance bar, set as a
            section rather than as a strip under a hero. Same source data. */}
        <section className="hs-band hsi-band hsi-band--snow" aria-label="Source characteristics">
          <div className="hs-shell">
            <div className="hsi-facts">
              {PROVENANCE.map((stat, i) => (
                <Reveal className="hsi-facts__cell" key={stat.key} delay={i * 90}>
                  <p className={`hsi-facts__val${stat.wide ? " hsi-facts__val--word" : ""}`}>
                    {stat.value}
                    {stat.unit ? <sup>{stat.unit}</sup> : null}
                  </p>
                  <p className="hsi-facts__key">{stat.key}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CHAPTER I — NATURAL FILTRATION */}
        <section className="hs-band hsi-band hsi-band--plain" aria-labelledby="src-filtration">
          <div className="hs-shell">
            <div className="hsi-duo">
              <div>
                <Reveal as="p" className="hs-eyebrow">
                  Chapter I — Geological filtration
                </Reveal>
                <Reveal as="h2" className="hs-h2" id="src-filtration" delay={60}>
                  Centuries of subterranean refinement
                </Reveal>
                <Reveal as="p" className="hs-body hs-body--lead" delay={120}>
                  Sub-surface rainwater travels through dense sandstone, quartz, and alluvial gravel
                  layers in the Shivalik basin. This natural micro-filtration strips away all
                  impurities while dissolving optimal trace minerals.
                </Reveal>
                <Reveal as="p" className="hs-body" delay={160}>
                  The result is a low-TDS profile of 64 mg/L with an exceptionally smooth, soft
                  palate mouthfeel and a naturally alkaline pH of 7.6.
                </Reveal>
              </div>

              <Reveal className="hsi-frame" delay={200}>
                <Image
                  src="/assets/sandstone-filtration-gen.jpg"
                  alt="Subterranean sandstone filtration layers"
                  width={640}
                  height={480}
                />
                <p className="hsi-frame__cap">
                  Subterranean sandstone percolation in the Shivalik foothills
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* CHAPTER II — CONFINED AQUIFER */}
        <section className="hs-band hsi-band hsi-band--navy" aria-labelledby="src-sealed">
          <div className="hs-shell">
            <div className="hsi-duo">
              {/* the picture leads on this one and follows on the last, which is
                  what keeps two consecutive split bands from reading as a
                  template. Below 900 both stack copy-first — see .hsi-duo. */}
              <Reveal className="hsi-frame">
                <Image
                  src="/assets/intro-shivalik.webp"
                  alt="Shivalik mountain range relief map"
                  width={640}
                  height={480}
                />
                <p className="hsi-frame__cap">Confined aquifer geology at 180m to 220m depth</p>
              </Reveal>

              <div>
                <Reveal as="p" className="hs-eyebrow" delay={60}>
                  Chapter II — Hydrogeological security
                </Reveal>
                <Reveal as="h2" className="hs-h2" id="src-sealed" delay={120}>
                  Sealed beneath 200 metres of impermeable rock
                </Reveal>
                <Reveal as="p" className="hs-body hs-body--lead" delay={180}>
                  Unlike shallow surface springs exposed to rain variations and agricultural runoff,
                  Himspring is drawn from a confined hydrogeological pocket sealed by thick clay
                  capstones.
                </Reveal>
                <Reveal as="p" className="hs-body" delay={220}>
                  Natural sub-artesian pressure lifts the water gently to the surface wellhead where
                  it is captured directly into bottles without chemical treatment or storage tanks.
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER III — PROVENANCE PARAMETERS */}
        <section className="hs-band hsi-band hsi-band--mist" aria-labelledby="src-params">
          <div className="hs-shell">
            <div className="hsi-head">
              <Reveal as="p" className="hs-eyebrow">
                Chapter III — Provenance parameters
              </Reveal>
              <Reveal as="h2" className="hs-h2" id="src-params" delay={60}>
                Uncompromising water standards
              </Reveal>
            </div>

            <div className="hsi-trio">
              {FACTS.map((fact, i) => (
                <Reveal className="hsi-card" key={fact.term} delay={i * 80}>
                  <p className="hsi-card__num hsi-card__num--word">{fact.term}</p>
                  {/* a detail, not a heading: these three are the values of the
                      labels above them, so they take the card's title face
                      without taking a heading level */}
                  <p className="hsi-card__title">{fact.detail}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
