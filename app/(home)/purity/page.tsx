import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import Reveal from "../components/Reveal";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { AWAY_SECTION_LINKS, PURITY_PILLARS } from "../lib/content";
import { FAMILIES, scaleFor } from "../v2/lib/family";
import "../internal.css";

export const metadata: Metadata = {
  title: "Why Himspring · Purity & Quality Benchmark | Himspring",
  description:
    "Learn why Himspring is the benchmark of purity: naturally filtered through sandstone, rich in essential minerals with an optimal 7.6 pH balance.",
  alternates: { canonical: "/purity" },
};

/* The three glass sizes, read from the homepage's own family data and drawn
   with the homepage's own artwork and ladder.

   This block used to name himspring-bottle-family-750ml.png and its two
   siblings, which are not bottles: they are 1535x1024 landscape plates, the
   grounds the deck's family panels sit on. Rendered as product shots they came
   out as three flat cream rectangles.

   The real cut-out is bottle-glass-clear.webp, 459x1800, and there is only one
   of it — the deck draws all three sizes from that single artwork and gets the
   difference from scaleFor(), which is the cube root of the volume ratio,
   because a shape scaled in three dimensions grows in height by the cube root
   of its volume. Reusing that function rather than authoring three heights is
   what keeps this row and the homepage's family section telling the same story
   about how much bigger a 750 is than a 330. */
const USE: Record<number, string> = {
  750: "Fine dining & shared tables",
  500: "Executive lounge & hospitality",
  330: "Personal & private aviation",
};
const FORMATS = FAMILIES.glass.map((size) => ({
  name: size.name,
  ml: size.ml,
  scale: scaleFor(size.ml),
  use: USE[size.ml],
}));

export default function PurityPage() {
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
              src="/assets/purity-gen.jpg"
              alt="Mirror-like Himalayan glacial mountain lake at dawn"
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="hsi-hero__veil" aria-hidden="true" />
          <div className="hsi-hero__inner">
            <Reveal as="p" className="hs-eyebrow">
              The benchmark of altitude purity
            </Reveal>
            <Reveal as="h1" className="hsi-hero__title" delay={80}>
              Pure by nature, untouched by processing
            </Reveal>
            <Reveal as="p" className="hsi-hero__lede" delay={160}>
              Unlike mass-market commodity waters that rely on heavy industrial reverse osmosis and
              artificial chemical remineralization, Himspring emerges naturally pristine from
              subterranean stone strata.
            </Reveal>
          </div>
        </section>

        {/* CHAPTER I — THE FOUR PILLARS */}
        <section className="hs-band hsi-band hsi-band--snow" aria-labelledby="pur-pillars">
          <div className="hs-shell">
            <div className="hsi-head">
              <Reveal as="p" className="hs-eyebrow">
                Chapter I — Quality architecture
              </Reveal>
              <Reveal as="h2" className="hs-h2" id="pur-pillars" delay={60}>
                The four pillars of purity
              </Reveal>
              <Reveal as="p" className="hs-body" delay={120}>
                Every bottle of Himspring is defined by four natural attributes that guarantee
                exceptional clarity, ionic equilibrium, and a crisp palate.
              </Reveal>
            </div>

            <div className="hsi-duo">
              {PURITY_PILLARS.map((pillar, i) => (
                <Reveal className="hsi-card" key={pillar.title.join(" ")} delay={i * 80}>
                  <p className="hsi-card__num">0{i + 1}</p>
                  <h3 className="hsi-card__title">{pillar.title.join(" ")}</h3>
                  <p className="hsi-card__body">{pillar.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CHAPTER II — NATURAL VS PROCESSED */}
        <section className="hs-band hsi-band hsi-band--navy" aria-labelledby="pur-distinction">
          <div className="hs-shell">
            <div className="hsi-head">
              <Reveal as="p" className="hs-eyebrow">
                Chapter II — The distinction
              </Reveal>
              <Reveal as="h2" className="hs-h2" id="pur-distinction" delay={60}>
                Himalayan spring against processed water
              </Reveal>
            </div>

            <div className="hsi-duo">
              <Reveal className="hsi-card">
                <p className="hsi-card__num hsi-card__num--word">Natural benchmark</p>
                <h3 className="hsi-card__title">Himspring Himalayan spring</h3>
                <p className="hsi-card__body">
                  Sourced from a 200m deep confined aquifer. Naturally filtered through rock strata
                  across decades. Zero chemical processing, a natural pH 7.6 balance, and a light
                  mineral mouthfeel.
                </p>
              </Reveal>

              {/* the aside, not a peer: .hsi-card--muted holds it back so the
                  pair reads as a claim and its foil rather than as a choice */}
              <Reveal className="hsi-card hsi-card--muted" delay={80}>
                <p className="hsi-card__num hsi-card__num--word">Industrial standard</p>
                <h3 className="hsi-card__title">Mass-market commodities</h3>
                <p className="hsi-card__body">
                  Derived from municipal tap sources or shallow surface waters. Heavily processed
                  using RO, demineralization, and artificial additive blending to meet minimum
                  standards.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* CHAPTER III — THE FORMATS */}
        <section className="hs-band hsi-band hsi-band--mist" aria-labelledby="pur-vessels">
          <div className="hs-shell">
            <div className="hsi-head">
              <Reveal as="p" className="hs-eyebrow">
                Chapter III — Architectural vessels
              </Reveal>
              <Reveal as="h2" className="hs-h2" id="pur-vessels" delay={60}>
                Crafted in heavy flint glass
              </Reveal>
              <Reveal as="p" className="hs-body" delay={120}>
                Designed for fine dining tables, boutique hospitality, executive boardrooms, and
                personal elevation.
              </Reveal>
            </div>

            <div className="hsi-formats">
              {FORMATS.map((format, i) => (
                <Reveal className="hsi-format" key={format.ml} delay={i * 80}>
                  {/* The three stand on one line, so the shelf is a fixed box
                      and the bottle takes its share of it — --h is the cube-root
                      scale, read by .hsi-format__shelf img in internal.css. */}
                  <div
                    className="hsi-format__shelf"
                    style={{ "--h": `${format.scale * 100}%` } as CSSProperties}
                  >
                    <Image
                      src="/assets/bottle-glass-clear.webp"
                      alt={`Himspring ${format.name} glass bottle`}
                      width={459}
                      height={1800}
                    />
                  </div>
                  <p className="hsi-format__size">{format.name}</p>
                  <p className="hsi-format__use">{format.use}</p>
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
