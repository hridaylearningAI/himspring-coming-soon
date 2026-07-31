import Header from "../../Header";
import Footer from "../../Footer";
import NotifyForm from "../../NotifyForm";
import RevealFX from "../../RevealFX";
import { Icon } from "../../icons";

export const metadata = {
  title: "Purity | Himspring",
  description:
    "From source to seal, Himspring water is untouched, unaltered, and naturally balanced. Discover the science behind every drop.",
};

const STANDARDS = [
  {
    icon: Icon.drop,
    title: "100% Natural",
    copy: "Nothing added, nothing removed. Exactly as nature intended.",
  },
  {
    icon: Icon.leaf,
    title: "No Additives",
    copy: "Free from artificial flavors, chemicals, and preservatives.",
  },
  {
    icon: Icon.shield,
    title: "Protected at Source",
    copy: "Sealed at the spring to lock in every mineral and quality.",
  },
  {
    icon: Icon.flask,
    title: "Lab Tested",
    copy: "Independently tested and certified with every single batch.",
  },
];

const MINERALS = [
  { symbol: "Ca", name: "Calcium", pct: 72 },
  { symbol: "Mg", name: "Magnesium", pct: 52 },
  { symbol: "K", name: "Potassium", pct: 34 },
  { symbol: "Na", name: "Sodium", pct: 18 },
];

const STATS = [
  { num: "7.8", label: "pH Balance", icon: Icon.drop },
  { num: "23+", label: "Essential Minerals", icon: Icon.minerals },
  { num: "TDS 45", label: "Total Dissolved Solids", icon: Icon.shield },
  { num: "100+", label: "Quality Tests", icon: Icon.clipboard },
  { num: "0%", label: "Compromise", icon: Icon.check },
];

export default function Purity() {
  return (
    <div className="site" id="top">
      <RevealFX />
      <Header />

      <main>
        {/* ---------- PURITY HERO ---------- */}
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
                Our Purity Promise
              </p>
              <h1 data-reveal style={{ "--rd": "80ms" }}>
                Purity you can feel.
                <br />
                Quality you can trust.
              </h1>
              <p className="body" data-reveal style={{ "--rd": "160ms" }}>
                From source to seal, Himspring water is untouched, unaltered,
                and naturally balanced — the way water was always meant to be.
              </p>
              <a
                className="btn btn--ghost shero__cta"
                href="#standards"
                data-reveal
                style={{ "--rd": "240ms" }}
              >
                Our Purity Promise{" "}
                <span className="btn__arrow">{Icon.arrow}</span>
              </a>
            </div>
          </div>
        </section>

        {/* ---------- THE HIGHEST STANDARD ---------- */}
        <section className="section standards" id="standards">
          <div className="wrap standards__grid">
            <div>
              <p className="kicker" data-reveal>
                The Highest Standard
              </p>
              <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                Naturally pure.
                <br />
                Nothing added.
                <br />
                Nothing taken away.
              </h2>
              <p className="body" data-reveal style={{ "--rd": "160ms" }}>
                We believe purity should be absolute. That means protecting
                every drop from its first moment in the spring to its last
                moment in the bottle.
              </p>
              <a
                className="textlink"
                href="#minerals"
                data-reveal
                style={{ "--rd": "240ms" }}
              >
                Our Purity Promise
                <span className="textlink__arrow">{Icon.arrow}</span>
              </a>
            </div>
            <ul
              className="standards__cards"
              data-reveal
              style={{ "--rd": "120ms" }}
            >
              {STANDARDS.map((s) => (
                <li className="std-card" key={s.title}>
                  <span className="std-card__icon">{s.icon}</span>
                  <h3>{s.title}</h3>
                  <p>{s.copy}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- BALANCED BY NATURE ---------- */}
        <section className="section minerals" id="minerals">
          <div className="wrap minerals__grid">
            <div
              className="minerals__imgwrap"
              data-reveal="img"
              style={{ "--rd": "80ms" }}
            >
              <div className="ph minerals__ph">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="ph__img"
                  src="/himspring-skeleton-assets/crystal purity.png"
                  alt="A single drop landing in crystal clear Himalayan water"
                />
              </div>
            </div>
            <div>
              <p className="kicker" data-reveal>
                Balanced by Nature
              </p>
              <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                Naturally rich in essential minerals.
              </h2>
              <p className="body" data-reveal style={{ "--rd": "160ms" }}>
                As water moves through layers of ancient Himalayan rock, it
                absorbs a natural balance of minerals that nourish the body
                in every sip.
              </p>
              <dl
                className="mineral-bars"
                data-reveal
                style={{ "--rd": "220ms" }}
              >
                {MINERALS.map((m) => (
                  <div className="mineral-bar" key={m.symbol}>
                    <dt className="mineral-bar__symbol">{m.symbol}</dt>
                    <dd className="mineral-bar__track">
                      <span
                        className="mineral-bar__fill"
                        style={{ "--pct": `${m.pct}%` }}
                      />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ---------- PURITY IN NUMBERS ---------- */}
        <section className="section purity-numbers" id="numbers">
          <div className="wrap purity-numbers__grid">
            <div>
              <p className="kicker" data-reveal>
                Our Purity in Numbers
              </p>
              <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                Tested.
                <br />
                Trusted.
                <br />
                Proven pure.
              </h2>
            </div>
            <ul className="pstats" data-reveal style={{ "--rd": "120ms" }}>
              {STATS.map((s) => (
                <li className="pstat" key={s.label}>
                  <span className="pstat__icon">{s.icon}</span>
                  <span className="pstat__num">{s.num}</span>
                  <span className="pstat__label">{s.label}</span>
                </li>
              ))}
            </ul>
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
