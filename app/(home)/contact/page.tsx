import type { Metadata } from "next";
import Image from "next/image";
import Contact from "../components/Contact";
import Reveal from "../components/Reveal";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { AWAY_SECTION_LINKS, COMPANY, CONTACT_EMAIL } from "../lib/content";
import "../internal.css";

export const metadata: Metadata = {
  title: "Contact Us & Enquiries Hub | Himspring",
  description:
    "Get in touch with Himspring for sales, trade distribution partnerships, media press enquiries, career opportunities, or customer support.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="hsi">
      <a className="hs-skip" href="#main">
        Skip to content
      </a>

      <SiteNav links={AWAY_SECTION_LINKS} origin="/" />

      <main id="main">
        {/* Short, because the form is the page. The opener's job here is to say
            where you are and get out of the way. */}
        <section className="hsi-hero hsi-hero--short">
          <div className="hsi-hero__scene">
            <Image
              src="/assets/hero-valley.jpg"
              alt="Himalayan mountain peak background"
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="hsi-hero__veil" aria-hidden="true" />
          <div className="hsi-hero__inner">
            <Reveal as="p" className="hs-eyebrow">
              Direct enquiries & partnerships
            </Reveal>
            <Reveal as="h1" className="hsi-hero__title" delay={80}>
              Connect with Himspring
            </Reveal>
            <Reveal as="p" className="hsi-hero__lede" delay={160}>
              Whether you represent a luxury hotel, a fine dining establishment or a press outlet,
              choose a topic below to reach our team directly.
            </Reveal>
          </div>
        </section>

        {/* The homepage's own form, imported rather than restaged. It brings its
            own .hs-band and its own cream ground — the wrapper that used to be
            here painted Snow behind a section that paints cream over it. */}
        <Contact />

        <section className="hs-band hsi-band hsi-band--mist" aria-labelledby="contact-corp">
          <div className="hs-shell">
            <h2 className="hs-vh" id="contact-corp">
              Company details
            </h2>
            <div className="hsi-duo">
              <Reveal className="hsi-card hsi-detail">
                <p className="hsi-detail__label">Registered office</p>
                <h3 className="hsi-card__title">{COMPANY.legalName}</h3>
                <address>{COMPANY.address.join("\n")}</address>
              </Reveal>

              <Reveal className="hsi-card hsi-detail" delay={80}>
                <p className="hsi-detail__label">Email</p>
                <h3 className="hsi-card__title">General & press desk</h3>
                <p className="hsi-card__body">
                  For direct correspondence, write to us at:
                </p>
                {/* .hs-link is the site's inline call to action — micro-caps
                    over a gold rule that retracts on hover. */}
                <a className="hs-link hsi-detail__mail" href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                  <span className="hs-arw" aria-hidden="true">
                    &rarr;
                  </span>
                </a>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
