import Header from "./Header";
import Footer from "./Footer";
import NotifyForm from "./NotifyForm";
import RevealFX from "./RevealFX";
import { Icon } from "./icons";

/* Image slot — renders the artwork when it exists, a placeholder otherwise. */
function Placeholder({ label, ratio, src, children }) {
  return (
    <div className={`ph${ratio ? ` ph--${ratio}` : ""}`} {...(src ? {} : { role: "img", "aria-label": `${label} (image coming soon)` })}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src && <img className="ph__img" src={src} alt={label} />}
      {children || (!src && <span className="ph__glyph">{Icon.image}</span>)}
    </div>
  );
}

/* ---------- content ---------- */

const CREDS = [
  { icon: Icon.mountain, title: "High Altitude Source", copy: "Sourced from springs above 6000 ft." },
  { icon: Icon.drop, title: "Naturally Pure", copy: "Naturally filtered through layers of rock." },
  { icon: Icon.minerals, title: "Rich in Minerals", copy: "Naturally contains essential minerals your body loves." },
  { icon: Icon.shield, title: "Protected & Pristine", copy: "Preserved at the source for complete purity." },
];

const JOURNEY = [
  { title: "The Himalayas", copy: "Untouched and pure.", img: "/himspring-skeleton-assets/himalayas.png" },
  { title: "Glacial Origins", copy: "Born from ancient ice.", img: "/himspring-skeleton-assets/glacial origins.png" },
  {
    title: "Natural Filtration",
    copy: "Filtered through layers of rock and minerals.",
    img: "/himspring-skeleton-assets/natural filtration.png",
  },
  { title: "Crystal Purity", copy: "Naturally pure and mineral rich.", img: "/himspring-skeleton-assets/crystal purity.png" },
  // the final step re-crops the hero artwork onto the brand seal — the journey ends at Himspring itself
  { title: "Himspring", copy: "Pure. Pristine. Perfected by nature.", img: "/himspring-skeleton-assets/hero-himspring.png" },
];

const PURITY = [
  { title: "100% Natural", copy: "Nothing added. Nothing taken away." },
  { title: "Essential Minerals", copy: "Naturally rich in minerals that support well-being." },
  { title: "Balanced pH", copy: "Perfectly balanced for everyday hydration." },
  { title: "Sustainably Sourced", copy: "Protected at the source for future generations." },
];

const EXPERIENCE = [
  { icon: Icon.sparkle, title: "Crystal Clear", copy: "Exceptionally clear, as nature intended." },
  { icon: Icon.wave, title: "Refreshingly Smooth", copy: "Smooth on the palate with a clean, crisp taste." },
  { icon: Icon.glass, title: "Elevated Hydration", copy: "Naturally refreshing. Perfectly balanced." },
];

const SUSTAINABILITY = [
  { icon: Icon.spring, title: "Protecting Springs", copy: "We protect our natural springs and the surrounding ecosystem." },
  { icon: Icon.bottle, title: "Responsible Bottling", copy: "Our bottling practices minimise waste and environmental impact." },
  { icon: Icon.recycle, title: "Recyclable Packaging", copy: "Our bottles are 100% recyclable and BPA free." },
  { icon: Icon.sprout, title: "For the Future", copy: "We are committed to preserving nature for generations to come." },
];

export default function Home() {
  return (
    <div className="site" id="top">
      <RevealFX />
      <Header />

      <main>
        {/* ---------- HERO ---------- */}
        <section className="hero">
          {/* full-bleed artwork — the empty left field of the illustration is the headline's canvas */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero__art"
            src="/himspring-skeleton-assets/hero-himspring.png"
            alt="The Himspring seal above a spring-fed rock in a still Himalayan lake"
          />
          <div className="wrap hero__inner">
            <div className="hero__copy">
              <p className="kicker" data-reveal>
                Born above. Pure by nature.
              </p>
              <h1 data-reveal style={{ "--rd": "80ms" }}>
                The Purest Expression
                <br />
                of Himalayan Water.
              </h1>
              <p className="hero__lede" data-reveal style={{ "--rd": "160ms" }}>
                From untouched springs high in the Himalayas, Himspring brings you nature in its purest form.
              </p>
              <a className="btn btn--ink hero__cta" href="#story" data-reveal style={{ "--rd": "240ms" }}>
                Discover Our Story
              </a>
            </div>
          </div>

        </section>

        {/* credibility strip */}
        <section className="creds-band">
          <div className="wrap">
            <ul className="creds" data-reveal>
              {CREDS.map((c) => (
                <li key={c.title}>
                  <span className="creds__icon">{c.icon}</span>
                  <h3>{c.title}</h3>
                  <p>{c.copy}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- OUR STORY ---------- */}
        <section className="section story" id="story">
          <div className="wrap story__grid">
            <div className="story__copy">
              <p className="kicker" data-reveal>
                Our Story
              </p>
              <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                Not every drop has&nbsp;a&nbsp;story.
              </h2>
              <p className="story__sub" data-reveal style={{ "--rd": "140ms" }}>
                Our springs rise thousands of feet above sea level.
              </p>
              <p className="body" data-reveal style={{ "--rd": "200ms" }}>
                In the heart of the Himalayas, where the air is pure and the earth is untouched, lies the source of
                Himspring. Protected by nature and time, our water is a gift from the mountains.
              </p>
              <a className="textlink" href="/our-story" data-reveal style={{ "--rd": "260ms" }}>
                Learn More <span className="textlink__arrow">{Icon.arrow}</span>
              </a>
            </div>
            <div data-reveal="img" style={{ "--rd": "160ms" }}>
              <Placeholder
                label="A spring-fed waterfall at the source of Himspring"
                ratio="video"
                src="/himspring-skeleton-assets/natural filtration.png"
              />
            </div>
          </div>
        </section>

        {/* ---------- THE SOURCE + JOURNEY ---------- */}
        <section className="section source" id="source">
          <div className="wrap">
            <div className="source__head">
              <p className="kicker" data-reveal>
                The Source
              </p>
              <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                Born where nature remains&nbsp;untouched.
              </h2>
              <p className="body" data-reveal style={{ "--rd": "160ms" }}>
                At over 6000 feet above sea level, our springs are shielded by ancient rock formations and pristine
                glaciers, far from any pollution or human impact.
              </p>
            </div>

            <ol className="journey" id="journey">
              {JOURNEY.map((step, i) => (
                <li className="journey__card" key={step.title} data-reveal style={{ "--rd": `${i * 70}ms` }}>
                  <Placeholder label={step.title} src={step.img} />
                  <span className="journey__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- PURITY ---------- */}
        {/* emblem ring: the four claims sit at the corners of a central seal */}
        <section className="section purity" id="purity">
          <div className="wrap">
            <div className="purity__head">
              <p className="kicker" data-reveal>
                Purity in Every Drop
              </p>
              <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                Pure by nature. Perfect&nbsp;for&nbsp;you.
              </h2>
            </div>
            <div className="purity__ring">
              <div className="purity__emblem" aria-hidden="true" data-reveal>
                {Icon.drop}
              </div>
              <ul className="purity__list">
                {PURITY.map((p, i) => (
                  <li key={p.title} data-reveal style={{ "--rd": `${120 + i * 70}ms` }}>
                    <h3>{p.title}</h3>
                    <p>{p.copy}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- THE EXPERIENCE ---------- */}
        <section className="section exp">
          {/* full-banner artwork — the bottle shows through the open middle column */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="exp__bg"
            src="/himspring-skeleton-assets/more than water banner.png"
            alt="A Himspring bottle rising from the source, ringed by mineral bubbles"
          />
          <div className="wrap exp__grid">
            <div className="exp__copy">
              <p className="kicker" data-reveal>
                The Experience
              </p>
              <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                More than water. It&rsquo;s&nbsp;an&nbsp;experience.
              </h2>
              <p className="body" data-reveal style={{ "--rd": "160ms" }}>
                Every detail, from the source to the seal, is crafted to deliver purity you can see, taste and feel.
              </p>
            </div>
            <ul className="exp__list" data-reveal style={{ "--rd": "200ms" }}>
              {EXPERIENCE.map((x) => (
                <li key={x.title}>
                  <span className="exp__icon">{x.icon}</span>
                  <div>
                    <h3>{x.title}</h3>
                    <p>{x.copy}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- SUSTAINABILITY ---------- */}
        <section className="section sust" id="sustainability">
          <div className="wrap sust__grid">
            <div>
              <p className="kicker" data-reveal>
                Sustainability
              </p>
              <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                Protecting the source. For&nbsp;generations.
              </h2>
            </div>
            <ul className="sust__list" data-reveal style={{ "--rd": "160ms" }}>
              {SUSTAINABILITY.map((s) => (
                <li key={s.title}>
                  <span className="creds__icon">{s.icon}</span>
                  <h3>{s.title}</h3>
                  <p>{s.copy}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- NOTIFY ---------- */}
        <section className="cta" id="notify">
          <svg className="cta__peaks" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 220 220 90l180 96 240-140 260 150 210-110 330 154v-20 0Z" fill="var(--glacier-1)" opacity="0.55" />
            <path d="M0 220 160 140l200 60 260-96 300 110 240-70 280 76H0Z" fill="var(--glacier-2)" opacity="0.5" />
          </svg>
          <div className="wrap cta__grid">
            <div>
              <p className="kicker" data-reveal>
                Be among the first. Join the journey of purity.
              </p>
              <h2 className="cta__title" data-reveal style={{ "--rd": "80ms" }}>
                Welcome to
                <br />
                the 1% Club.
              </h2>
            </div>
            <div data-reveal style={{ "--rd": "120ms" }}>
              <NotifyForm />
            </div>
          </div>
        </section>
      </main>

      {/* ---------- FOOTER ---------- */}
      <Footer />
    </div>
  );
}
