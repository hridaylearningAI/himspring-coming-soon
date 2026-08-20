import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import Reveal from "../components/Reveal";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { AWAY_SECTION_LINKS } from "../lib/content";
import { scaleFor } from "../v2/lib/family";
import { SPARKLING_FAMILY, SPARKLING_OCCASION } from "../v2/lib/kind";
import "../internal.css";

export const metadata: Metadata = {
  title: "Sparkling · Carbonated Natural Himalayan Water | Himspring",
  description:
    "Himspring Sparkling — carbonated natural Himalayan water from the same Shivalik spring, in three sizes of flint glass.",
  alternates: { canonical: "/sparkling" },
};

const SIZES = SPARKLING_FAMILY.map((size) => ({
  name: size.name,
  ml: size.ml,
  scale: scaleFor(size.ml),
  use: SPARKLING_OCCASION[size.ml as keyof typeof SPARKLING_OCCASION],
}));

export default function SparklingPage() {
  return (
    <div className="hsi">
      <a className="hs-skip" href="#main">
        Skip to content
      </a>

      <SiteNav links={AWAY_SECTION_LINKS} origin="/" />

      <main id="main">
        <section className="hsi-hero hsi-hero--snow">
          <div className="hsi-hero__inner hsi-hero__inner--split">
            <div>
              <Reveal as="p" className="hs-eyebrow">
                Sparkling
              </Reveal>
              <Reveal as="h1" className="hsi-hero__title" delay={80}>
                Carbonated Natural Himalayan Water
              </Reveal>
              <Reveal as="p" className="hsi-hero__lede" delay={160}>
                The same Shivalik spring, in flint glass, with a lift. Himspring Sparkling is the
                still water&rsquo;s sister line — carbonated, not a second brand.
              </Reveal>
            </div>
            <Reveal className="hsi-hero__bottle" delay={120}>
              <Image
                src="/assets/sparkling-hero.webp"
                alt="Himspring Sparkling glass bottle, navy cap, gold mountain wrap"
                width={682}
                height={1024}
                priority
              />
            </Reveal>
          </div>
        </section>

        <section className="hs-band hsi-band hsi-band--mist" aria-labelledby="spark-range">
          <div className="hs-shell">
            <div className="hsi-head">
              <Reveal as="p" className="hs-eyebrow">
                Chapter I — The family
              </Reveal>
              <Reveal as="h2" className="hs-h2" id="spark-range" delay={60}>
                Three sizes, one glass
              </Reveal>
              <Reveal as="p" className="hs-body" delay={120}>
                750, 500 and 330 millilitres. The same ladder as the still line, in the vessel the
                table asks for.
              </Reveal>
            </div>

            <Reveal className="hsi-family" delay={80}>
              <Image
                src="/assets/sparkling-family.webp"
                alt="Himspring Sparkling in 750, 500 and 330 millilitre glass bottles"
                width={682}
                height={1024}
              />
            </Reveal>

            <div className="hsi-formats">
              {SIZES.map((size, i) => (
                <Reveal className="hsi-format" key={size.ml} delay={i * 80}>
                  <div
                    className="hsi-format__shelf"
                    style={{ "--h": `${size.scale * 100}%` } as CSSProperties}
                  >
                    <Image
                      src="/assets/sparkling-hero.webp"
                      alt={`Himspring Sparkling ${size.name} glass bottle`}
                      width={682}
                      height={1024}
                    />
                  </div>
                  <p className="hsi-format__size">{size.name}</p>
                  <p className="hsi-format__use">{size.use}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="hs-band hsi-band hsi-band--navy" aria-labelledby="spark-source">
          <div className="hs-shell">
            <div className="hsi-head">
              <Reveal as="p" className="hs-eyebrow">
                Chapter II — The same spring
              </Reveal>
              <Reveal as="h2" className="hs-h2" id="spark-source" delay={60}>
                Still, then sparkling
              </Reveal>
              <Reveal as="p" className="hs-body" delay={120}>
                Drawn from the confined aquifer beneath the Shivalik foothills. Naturally filtered
                through sandstone. The source does not change; the finish does.
              </Reveal>
            </div>

            <div className="hsi-duo">
              <Reveal className="hsi-card">
                <p className="hsi-card__num hsi-card__num--word">Still</p>
                <h3 className="hsi-card__title">Natural mineral water</h3>
                <p className="hsi-card__body">
                  The opening line of the house: untouched, bottled at source, in glass and PET.
                </p>
              </Reveal>
              <Reveal className="hsi-card" delay={80}>
                <p className="hsi-card__num hsi-card__num--word">Sparkling</p>
                <h3 className="hsi-card__title">Carbonated natural Himalayan water</h3>
                <p className="hsi-card__body">
                  The same water, carbonated, in flint glass only — 750, 500 and 330 millilitres.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="hs-band hsi-band hsi-band--snow" aria-labelledby="spark-close">
          <div className="hs-shell">
            <div className="hsi-head">
              <Reveal as="p" className="hs-eyebrow">
                Enquiries
              </Reveal>
              <Reveal as="h2" className="hs-h2" id="spark-close" delay={60}>
                Ask about the sparkling line
              </Reveal>
              <Reveal as="p" className="hs-body" delay={120}>
                Trade, hospitality and press — the same desk as the still water.
              </Reveal>
            </div>
            <Reveal delay={160}>
              <a className="hs-btn" href="/contact">
                Contact us
              </a>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
