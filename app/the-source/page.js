import Header from "../Header";
import Footer from "../Footer";
import NotifyForm from "../NotifyForm";
import RevealFX from "../RevealFX";
import { Icon } from "../icons";

export const metadata = {
  title: "The Source | Himspring",
  description:
    "Where purity begins: a protected Himalayan valley more than 6000 feet above sea level, where snowmelt filters through ancient rock into a pristine spring.",
};

const FACTS = [
  { icon: Icon.mountain, title: "6000+ ft", copy: "Above sea level" },
  { icon: Icon.shield, title: "Protected", copy: "Naturally protected valley" },
  { icon: Icon.drop, title: "Ancient Origin", copy: "Glacial fed springs" },
  { icon: Icon.leaf, title: "Untouched", copy: "Free from pollution" },
];

const PROCESS = [
  {
    title: "Snowfall",
    copy: "Pure snow falls on untouched Himalayan peaks.",
    img: "/himspring-skeleton-assets/himalayas.png",
    alt: "Snow-covered Himalayan peaks",
  },
  {
    title: "Glacial Melt",
    copy: "Snow melts slowly, forming pristine glacial streams.",
    img: "/himspring-skeleton-assets/glacial origins.png",
    alt: "A glacial stream winding between mountains",
  },
  {
    title: "Natural Filtration",
    copy: "Water filters through ancient rock layers, naturally purified.",
    img: "/himspring-skeleton-assets/natural filtration.png",
    alt: "A waterfall filtering into a mountain pool",
  },
  {
    title: "Mineral Enrichment",
    copy: "Enriched with essential minerals as it flows deep within the earth.",
    img: "/himspring-skeleton-assets/more than water banner.png",
    alt: "Mineral bubbles rising over river stones",
  },
  {
    title: "Pure Spring",
    copy: "Emerges at the source, crystal clear and exceptionally pure.",
    img: "/himspring-skeleton-assets/crystal purity.png",
    alt: "A single pure drop landing in still water",
  },
];

const SCIENCE_STATS = [
  { num: "7.8", label: "pH Balance", sub: "Naturally balanced" },
  { num: "23+", label: "Essential Minerals", sub: "Naturally present" },
  { num: "TDS 45", label: "Total Dissolved Solids", sub: "Exceptionally low" },
];

const SCIENCE_CHIPS = [
  { icon: Icon.balance, label: "Naturally Alkaline" },
  { icon: Icon.drop, label: "Low Sodium" },
  { icon: Icon.minerals, label: "Rich in Minerals" },
  { icon: Icon.sparkle, label: "Crystal Clear" },
];

const PROTECTED = [
  { icon: Icon.mountain, title: "Protected Location", copy: "Shielded by mountains and remote terrain." },
  { icon: Icon.lock, title: "Limited Access", copy: "Restricted access to preserve the source." },
  { icon: Icon.bottle, title: "Responsible Bottling", copy: "We bottle with care and minimal impact." },
  { icon: Icon.sprout, title: "Future Focused", copy: "Sustainability for future generations." },
];

export default function TheSource() {
  return (
    <div className="site" id="top">
      <RevealFX />
      <Header />

      <main>
        {/* ---------- SOURCE HERO ---------- */}
        <section className="shero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="shero__art"
            src="/himspring-skeleton-assets/hero-himspring.png"
            alt="The Himspring seal above a spring-fed rock in a still mountain lake"
            style={{ objectPosition: "72% center" }}
          />
          <div className="wrap shero__inner">
            <div className="shero__copy">
              <p className="kicker" data-reveal>
                The Source
              </p>
              <h1 data-reveal style={{ "--rd": "80ms" }}>
                Where purity
                <br />
                begins.
              </h1>
              <p className="body" data-reveal style={{ "--rd": "160ms" }}>
                Above six thousand feet, sealed beneath ancient rock, a spring has been filtering snowmelt since long
                before anyone thought to bottle it.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- A HIDDEN SANCTUARY ---------- */}
        <section className="section sanctuary" id="sanctuary">
          <div className="wrap sanctuary__grid">
            <div>
              <p className="kicker" data-reveal>
                A Hidden Sanctuary
              </p>
              <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                Deep in the Himalayas. Far from everything, close&nbsp;to&nbsp;perfection.
              </h2>
              <p className="body" data-reveal style={{ "--rd": "160ms" }}>
                Our source lies in a protected Himalayan valley, reached by a single mountain road and guarded by the
                terrain itself. No industry, no agriculture, no crowds. Only stone, snow and time.
              </p>
            </div>
            {/* stylised locator — decorative, not an interactive map */}
            <div className="map" data-reveal="img" style={{ "--rd": "160ms" }} role="img" aria-label="Stylised map locating the Himspring source in a protected Himalayan valley, 6000 feet above sea level">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="map__bg" src="/himspring-skeleton-assets/himalayas.png" alt="" />
              <div className="map__card" aria-hidden="true">
                <span className="map__cardTitle">Himspring Source</span>
                <span className="map__cardMeta">Himalayas</span>
                <span className="map__cardMeta">6000+ ft above sea level</span>
              </div>
              <div className="map__marker" aria-hidden="true">
                <span className="map__pin">{Icon.pin}</span>
                <span className="map__caption">
                  Protected
                  <br />
                  Himalayan Valley
                </span>
              </div>
              <span className="map__compass" aria-hidden="true">
                N
              </span>
            </div>
          </div>
        </section>

        {/* ---------- SOURCE FACTS ---------- */}
        <section className="facts-band">
          <div className="wrap">
            <ul className="facts" data-reveal>
              {FACTS.map((f) => (
                <li key={f.title}>
                  <span className="facts__icon">{f.icon}</span>
                  <h3>{f.title}</h3>
                  <p>{f.copy}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- THE JOURNEY OF OUR SOURCE ---------- */}
        <section className="section sjourney" id="process">
          <div className="wrap">
            <div className="sjourney__head">
              <div>
                <p className="kicker" data-reveal>
                  The Journey of Our Source
                </p>
                <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                  A natural process. Perfectly&nbsp;preserved.
                </h2>
              </div>
              <p className="body sjourney__intro" data-reveal style={{ "--rd": "160ms" }}>
                From snow to spring, our water travels through layers of rock and time. Every step is guided by
                nature, never rushed.
              </p>
            </div>
            <ol className="sjourney__row">
              {PROCESS.map((step, i) => (
                <li className="sjourney__card" key={step.title} data-reveal style={{ "--rd": `${i * 70}ms` }}>
                  <div className="sjourney__img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={step.img} alt={step.alt} />
                  </div>
                  <div className="sjourney__body">
                    <span className="journey__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                  {i < PROCESS.length - 1 && (
                    <span className="sjourney__arrow" aria-hidden="true">
                      {Icon.arrow}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- NATURE'S SCIENCE ---------- */}
        <section className="section science" id="science">
          <div className="wrap science__grid">
            <div>
              <p className="kicker" data-reveal>
                Nature&rsquo;s Science
              </p>
              <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                Purity you can feel. Quality you can&nbsp;trust.
              </h2>
              <p className="body" data-reveal style={{ "--rd": "160ms" }}>
                Our water is naturally rich in essential minerals and balanced in pH, delivering purity that supports
                well-being in every drop.
              </p>
              <dl className="science__stats" data-reveal style={{ "--rd": "220ms" }}>
                {SCIENCE_STATS.map((s) => (
                  <div className="science__stat" key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>
                      <span className="science__num">{s.num}</span>
                      <span className="science__sub">{s.sub}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="science__media" data-reveal="img" style={{ "--rd": "160ms" }}>
              <div className="ph science__img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="ph__img"
                  src="/himspring-skeleton-assets/glacial origins.png"
                  alt="A glacial river descending through a Himalayan valley"
                />
              </div>
              <ul className="science__chips">
                {SCIENCE_CHIPS.map((c) => (
                  <li key={c.label}>
                    <span className="science__chipIcon">{c.icon}</span>
                    {c.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- PROTECTED BY NATURE ---------- */}
        <section className="section protect" id="protected">
          <div className="wrap protect__grid">
            <div>
              <p className="kicker" data-reveal>
                Protected by Nature
              </p>
              <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                Protected today. Pure&nbsp;for&nbsp;tomorrow.
              </h2>
              <p className="body" data-reveal style={{ "--rd": "160ms" }}>
                The best way to keep water pure is to leave its home untouched. Access to our valley is limited, and
                every decision favours the source over convenience.
              </p>
            </div>
            <ul className="protect__list" data-reveal style={{ "--rd": "200ms" }}>
              {PROTECTED.map((p) => (
                <li key={p.title}>
                  <span className="facts__icon">{p.icon}</span>
                  <h3>{p.title}</h3>
                  <p>{p.copy}</p>
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
