import Header from "../../Header";
import Footer from "../../Footer";
import RevealFX from "../../RevealFX";
import { Icon } from "../../icons";

export const metadata = {
  title: "Our Story | Himspring",
  description:
    "Every drop has a beginning. The story of Himspring: born in the heart of the Himalayas, protected by nature and time.",
};

const MISSION = [
  { icon: Icon.shield, title: "Protect", copy: "We safeguard our springs and the ecosystem that surrounds them." },
  { icon: Icon.bottle, title: "Preserve", copy: "We bottle at the source, so nothing of the mountain is lost." },
  { icon: Icon.leaf, title: "Inspire", copy: "We hold everyday hydration to a higher standard." },
];

const VALUES = [
  {
    icon: Icon.mountain,
    title: "Authenticity",
    copy: "True to our Himalayan origin in every drop.",
    img: "/himspring-skeleton-assets/himalayas.png",
    alt: "Layered Himalayan peaks",
  },
  {
    icon: Icon.drop,
    title: "Integrity",
    copy: "Transparent from source to seal.",
    img: "/himspring-skeleton-assets/glacial origins.png",
    alt: "A glacial river winding through a mountain valley",
  },
  {
    icon: Icon.sparkle,
    title: "Excellence",
    copy: "A higher standard, pursued daily.",
    img: "/himspring-skeleton-assets/natural filtration.png",
    alt: "A spring-fed waterfall pooling between mountains",
  },
  {
    icon: Icon.leaf,
    title: "Responsibility",
    copy: "Accountable to nature and the generations ahead.",
    img: "/himspring-skeleton-assets/crystal purity.png",
    alt: "A single drop landing in still water",
  },
];

export default function OurStory() {
  return (
    <div className="site" id="top">
      <RevealFX />
      <Header />

      <main>
        {/* ---------- STORY HERO ---------- */}
        <section className="shero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="shero__art"
            src="/himspring-skeleton-assets/glacial origins.png"
            alt="A glacial river beginning its journey between Himalayan peaks"
          />
          <div className="wrap shero__inner">
            <div className="shero__copy">
              <p className="kicker" data-reveal>
                Our Story
              </p>
              <h1 data-reveal style={{ "--rd": "80ms" }}>
                Every drop
                <br />
                has a beginning.
              </h1>
              <p className="body" data-reveal style={{ "--rd": "160ms" }}>
                Himalayan spring water forms through patience, pressure and purity. This is the journey from first
                snowfall to first sip.
              </p>
              <a className="btn btn--ink shero__cta" href="#beginning" data-reveal style={{ "--rd": "240ms" }}>
                Discover Our Story
              </a>
            </div>
          </div>
        </section>

        {/* ---------- OUR BEGINNING ---------- */}
        <section className="section beginning" id="beginning">
          <div className="wrap beginning__grid">
            <div>
              <p className="kicker" data-reveal>
                Our Beginning
              </p>
              <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                In the heart of the Himalayas, purity&nbsp;lives.
              </h2>
              <p className="body" data-reveal style={{ "--rd": "160ms" }}>
                Where the air is pure and the earth is untouched lies the source of Himspring. Protected by nature and
                time, our water begins its journey thousands of feet above sea level, and every bottle carries that
                beginning with it.
              </p>
              <a className="btn btn--ghost beginning__cta" href="#mission" data-reveal style={{ "--rd": "240ms" }}>
                Our Commitment <span className="btn__arrow">{Icon.arrow}</span>
              </a>
            </div>
            <div data-reveal="img" style={{ "--rd": "160ms" }}>
              <div className="ph ph--video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="ph__img"
                  src="/himspring-skeleton-assets/natural filtration.png"
                  alt="A spring-fed waterfall in an untouched Himalayan valley"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- OUR MISSION ---------- */}
        <section className="section mission" id="mission">
          {/* the seal artwork anchors the section's right edge */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="mission__art"
            src="/himspring-skeleton-assets/hero-himspring.png"
            alt=""
            aria-hidden="true"
          />
          <div className="wrap">
            <div className="mission__inner">
              <p className="kicker" data-reveal>
                Our Mission
              </p>
              <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                To protect nature&rsquo;s purity. For&nbsp;generations.
              </h2>
              <ul className="mission__list">
                {MISSION.map((m, i) => (
                  <li key={m.title} data-reveal style={{ "--rd": `${140 + i * 70}ms` }}>
                    <span className="mission__badge" aria-hidden="true">
                      {m.icon}
                    </span>
                    <h3>{m.title}</h3>
                    <p>{m.copy}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- OUR VALUES ---------- */}
        <section className="section values" id="values">
          <div className="wrap">
            <div className="values__head">
              <p className="kicker" data-reveal>
                Our Values
              </p>
              <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                The values that define&nbsp;us.
              </h2>
            </div>
            <ul className="values__grid">
              {VALUES.map((v, i) => (
                <li className="values__card" key={v.title} data-reveal style={{ "--rd": `${i * 70}ms` }}>
                  <div className="values__img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.img} alt={v.alt} />
                  </div>
                  <span className="values__badge" aria-hidden="true">
                    {v.icon}
                  </span>
                  <h3>{v.title}</h3>
                  <p>{v.copy}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- QUOTE ---------- */}
        <section className="quote">
          <svg className="quote__peaks" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 220 220 90l180 96 240-140 260 150 210-110 330 154v-20 0Z" fill="var(--glacier-1)" opacity="0.55" />
            <path d="M0 220 160 140l200 60 260-96 300 110 240-70 280 76H0Z" fill="var(--glacier-2)" opacity="0.5" />
          </svg>
          <div className="wrap">
            <p className="quote__text" data-reveal>
              Purity is not just what we deliver.
              <br />
              It&rsquo;s what we stand for.
            </p>
          </div>
        </section>
      </main>

      <Footer notify />
    </div>
  );
}
