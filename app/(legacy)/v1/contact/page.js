import Header from "../../Header";
import Footer from "../../Footer";
import NotifyForm from "../../NotifyForm";
import RevealFX from "../../RevealFX";
import ContactForm from "../../ContactForm";
import { Icon } from "../../icons";

export const metadata = {
  title: "Contact | Himspring",
  description:
    "Get in touch with Himspring. We'd love to hear from you — whether you're a customer, partner, or simply curious about our water.",
};

const REACH = [
  {
    icon: Icon.pin,
    title: "Head Office",
    content: (
      <>
        Himspring Beverages Pvt. Ltd.
        <br />
        407, Skyline Icon, 4th Floor,
        <br />
        Nana Mava Main Road,
        <br />
        Rajkot, Gujarat, India — 360005
      </>
    ),
  },
  {
    icon: Icon.phone,
    title: "Phone",
    content: (
      <>
        <a href="tel:+918156043000">+91 81560 43000</a>
        <br />
        Monday – Saturday&nbsp;|&nbsp;9:00 AM – 6:00 PM IST
      </>
    ),
  },
  {
    icon: Icon.mail,
    title: "Email",
    content: <a href="mailto:hello@himspring.com">hello@himspring.com</a>,
  },
  {
    icon: Icon.globe,
    title: "Website",
    content: (
      <a
        href="https://www.himspring.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        www.himspring.com
      </a>
    ),
  },
  {
    icon: Icon.people,
    title: "Follow Us",
    social: true,
  },
];

const PARTNER_FEATURES = [
  { icon: Icon.recycle, label: "Sustainable\nCollaboration" },
  { icon: Icon.sparkle, label: "Premium\nQuality" },
  { icon: Icon.balance, label: "Long-term\nPartnerships" },
];

export default function Contact() {
  return (
    <div className="site" id="top">
      <RevealFX />
      <Header />

      <main>
        {/* ---------- CONTACT HERO ---------- */}
        <section className="shero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="shero__art"
            src="/himspring-skeleton-assets/hero-himspring.png"
            alt="The Himspring spring flowing from mountain rock into still water"
            style={{ objectPosition: "72% center" }}
          />
          <div className="wrap shero__inner">
            <div className="shero__copy">
              <p className="kicker" data-reveal>
                Get in Touch
              </p>
              <h1 data-reveal style={{ "--rd": "80ms" }}>
                We&rsquo;d love to
                <br />
                hear from you.
              </h1>
              <p className="body" data-reveal style={{ "--rd": "160ms" }}>
                Whether you have a question about our water, a partnership
                enquiry, or simply want to say hello — our team is here and
                ready to listen.
              </p>
              <p
                className="contact-hero__note"
                data-reveal
                style={{ "--rd": "240ms" }}
              >
                <span aria-hidden="true">{Icon.check}</span>
                We typically respond within 24&nbsp;hours.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- SEND A MESSAGE + REACH US ---------- */}
        <section className="section contact-main" id="message">
          <div className="wrap contact-grid">
            {/* LEFT — form */}
            <div>
              <p className="kicker" data-reveal>
                Send Us a Message
              </p>
              <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                Let&rsquo;s connect.
                <br />
                We&rsquo;re here to help.
              </h2>
              <div data-reveal style={{ "--rd": "160ms" }}>
                <ContactForm />
              </div>
            </div>

            {/* RIGHT — reach us */}
            <div data-reveal style={{ "--rd": "100ms" }}>
              <p className="kicker">Reach Us</p>
              <ul className="reach">
                {REACH.map((item) => (
                  <li className="reach__item" key={item.title}>
                    <span className="reach__icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <div className="reach__content">
                      <span className="reach__title">{item.title}</span>
                      {item.social ? (
                        <div className="reach__social">
                          <a
                            href="https://www.instagram.com/himspring?igsh=MWloMmd4ZmR3ejVsYg=="
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Himspring on Instagram"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            >
                              <rect x="3" y="3" width="18" height="18" rx="5" />
                              <circle cx="12" cy="12" r="4" />
                              <circle
                                cx="17.5"
                                cy="6.5"
                                r="1"
                                fill="currentColor"
                                stroke="none"
                              />
                            </svg>
                          </a>
                          <a href="#" aria-label="Himspring on Facebook">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                          </a>
                          <a href="#" aria-label="Himspring on LinkedIn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.4 8.65 21 11 21 14.2V21h-4v-6c0-1.43-.03-3.27-2-3.27-2 0-2.3 1.56-2.3 3.17V21H9z" />
                            </svg>
                          </a>
                        </div>
                      ) : (
                        <p className="reach__text">{item.content}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- PARTNER + MAP ---------- */}
        <section className="contact-cards" id="partner">
          <div className="contact-cards__grid">
            {/* LEFT — partnerships */}
            <div className="partner-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="partner-card__art"
                src="/himspring-skeleton-assets/natural filtration.png"
                alt=""
                aria-hidden="true"
              />
              <div className="partner-card__inner">
                <p className="kicker" data-reveal>
                  Partnerships &amp; Wholesale
                </p>
                <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                  Partner with purity.
                </h2>
                <p className="body" data-reveal style={{ "--rd": "160ms" }}>
                  We work with hotels, restaurants, retailers, and distributors
                  who share our commitment to quality and sustainability.
                </p>
                <a
                  className="btn btn--ghost partner-card__cta"
                  href="mailto:partners@himspring.com"
                  data-reveal
                  style={{ "--rd": "220ms" }}
                >
                  Become a Partner{" "}
                  <span className="btn__arrow">{Icon.arrow}</span>
                </a>
                <ul
                  className="partner-features"
                  data-reveal
                  style={{ "--rd": "280ms" }}
                >
                  {PARTNER_FEATURES.map((f) => (
                    <li className="partner-feat" key={f.label}>
                      <span className="partner-feat__icon" aria-hidden="true">
                        {f.icon}
                      </span>
                      <span className="partner-feat__label">
                        {f.label.split("\n").map((line, i) => (
                          <span key={i}>
                            {line}
                            {i === 0 && <br />}
                          </span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* RIGHT — world map */}
            <div className="map-card">
              <div className="map-card__inner">
                <p className="kicker" data-reveal>
                  Who We Are
                </p>
                <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                  Rooted in the Himalayas.
                  <br />
                  Connecting with the world.
                </h2>
              </div>
              <div
                className="contact-map"
                data-reveal="img"
                style={{ "--rd": "140ms" }}
                role="img"
                aria-label="World map with a pin marking Himspring's location in Rajkot, Gujarat, India"
              >
                <svg
                  viewBox="0 0 800 400"
                  className="contact-map__svg"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern
                      id="mapdots"
                      width="22"
                      height="22"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="1" cy="1" r="0.9" fill="var(--glacier-3)" />
                    </pattern>
                  </defs>
                  <rect width="800" height="400" fill="url(#mapdots)" />
                  <g
                    fill="var(--glacier-1)"
                    stroke="var(--glacier-3)"
                    strokeWidth="0.8"
                  >
                    {/* North America */}
                    <path d="M48 44 C70 26 148 20 210 48 L250 80 258 132 228 182 196 214 162 232 120 218 80 188 55 152 42 106 42 70 48 44Z" />
                    {/* South America */}
                    <path d="M154 254 L224 242 260 272 266 348 240 400 195 400 154 390 136 322 140 272 154 254Z" />
                    {/* Europe */}
                    <path d="M342 36 L412 26 452 52 458 90 428 118 386 130 350 116 336 84 342 36Z" />
                    {/* Africa */}
                    <path d="M334 132 L424 122 474 150 484 238 460 318 408 362 356 334 326 260 330 190 334 132Z" />
                    {/* Asia */}
                    <path d="M450 24 C510 14 634 14 728 36 L800 68 800 225 762 252 690 276 596 286 492 262 446 208 434 154 444 88 450 24Z" />
                    {/* India peninsula */}
                    <path d="M530 168 L572 160 598 176 596 220 574 252 548 254 524 234 518 200 524 176 530 168Z" />
                    {/* Australia */}
                    <path d="M636 306 L730 292 776 314 774 368 728 392 668 390 634 360 632 328 636 306Z" />
                  </g>
                  {/* Gold pin — Rajkot, Gujarat */}
                  <g transform="translate(548, 178)">
                    <circle r="20" fill="var(--gold)" opacity="0.12" />
                    <circle r="10" fill="var(--gold)" opacity="0.22" />
                    <circle r="4.5" fill="var(--gold)" />
                    <circle r="2" fill="#fff" />
                  </g>
                </svg>
              </div>
              <a
                className="btn btn--ghost map-card__cta"
                href="https://maps.google.com/?q=407+Skyline+Icon+Rajkot+Gujarat+India"
                target="_blank"
                rel="noopener noreferrer"
                data-reveal
                style={{ "--rd": "200ms" }}
              >
                View on Map <span className="btn__arrow">{Icon.arrow}</span>
              </a>
            </div>
          </div>
        </section>

        {/* ---------- NOTIFY ---------- */}
        <section className="cta" id="notify">
          <svg
            className="cta__peaks"
            viewBox="0 0 1440 220"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 220 220 90l180 96 240-140 260 150 210-110 330 154v-20 0Z"
              fill="var(--glacier-1)"
              opacity="0.55"
            />
            <path
              d="M0 220 160 140l200 60 260-96 300 110 240-70 280 76H0Z"
              fill="var(--glacier-2)"
              opacity="0.5"
            />
          </svg>
          <div className="wrap cta__grid">
            <h2 className="cta__title" data-reveal>
              Be among the first
              <br />
              to experience purity.
            </h2>
            <div data-reveal style={{ "--rd": "120ms" }}>
              <NotifyForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
