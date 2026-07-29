import Header from "../Header";
import Footer from "../Footer";
import NotifyForm from "../NotifyForm";
import RevealFX from "../RevealFX";
import { Icon } from "../icons";

export const metadata = {
  title: "Sustainability | Himspring",
  description:
    "Himspring is committed to protecting the Himalayan ecosystem for generations to come. Pure today. Responsible always. For tomorrow.",
};

const APPROACH = [
  {
    icon: Icon.mountain,
    title: "Protect the Source",
    copy: "We guard our springs with restricted access and deep environmental stewardship.",
    img: "/himspring-skeleton-assets/himalayas.png",
    alt: "Layered Himalayan peaks at the source",
  },
  {
    icon: Icon.leaf,
    title: "Responsible Bottling",
    copy: "Bottled at the source with minimal energy use and zero harmful waste.",
    img: "/himspring-skeleton-assets/glacial origins.png",
    alt: "Glacial water running through pristine Himalayan terrain",
  },
  {
    icon: Icon.sprout,
    title: "Minimize Impact",
    copy: "Every decision is weighed against its effect on the natural world around us.",
    img: "/himspring-skeleton-assets/natural filtration.png",
    alt: "A natural waterfall filtering into a Himalayan mountain pool",
  },
  {
    icon: Icon.people,
    title: "Give Back",
    copy: "A share of every bottle funds clean water access for underserved communities.",
    img: "/himspring-skeleton-assets/more than water banner.png",
    alt: "Communities benefiting from clean water access",
  },
];

const CLOSE_STATS = [
  { icon: Icon.rain, value: "100%", label: "Natural Recharge" },
  { icon: Icon.leaf, value: "Zero", label: "Source Depletion" },
  { icon: Icon.shield, value: "Protected", label: "Himalayan Ecosystem" },
];

const INITIATIVES = [
  {
    icon: Icon.bottle,
    title: "Lighter Footprint",
    copy: "Lightweight packaging that uses less material and generates less waste.",
  },
  {
    icon: Icon.recycle,
    title: "Recyclable by Design",
    copy: "All bottles are 100% recyclable with minimal virgin plastic used.",
  },
  {
    icon: Icon.wind,
    title: "Clean Energy",
    copy: "Our operations run on renewable and solar energy sources.",
  },
  {
    icon: Icon.drop,
    title: "Water Positive",
    copy: "We replenish more water than we extract from the Himalayan spring.",
  },
  {
    icon: Icon.people,
    title: "Community First",
    copy: "Supporting the local communities who share and protect our watershed.",
  },
];

const PROMISES = [
  {
    icon: Icon.mountain,
    title: "For Nature",
    copy: "We commit to leaving every landscape we touch better than we found it — investing in preservation and active restoration.",
  },
  {
    icon: Icon.people,
    title: "For Future Generations",
    copy: "Our sourcing limits are set generations ahead, so the water our children drink is as pure as ours today.",
  },
];

export default function Sustainability() {
  return (
    <div className="site" id="top">
      <RevealFX />
      <Header />

      <main>
        {/* ---------- SUSTAINABILITY HERO ---------- */}
        <section className="shero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="shero__art"
            src="/himspring-skeleton-assets/hero-himspring.png"
            alt="The Himspring seal above a spring-fed mountain lake surrounded by nature"
            style={{ objectPosition: "72% center" }}
          />
          <div className="wrap shero__inner">
            <div className="shero__copy">
              <p className="kicker" data-reveal>
                Our Commitment
              </p>
              <h1 data-reveal style={{ "--rd": "80ms" }}>
                Pure today.
                <br />
                Responsible always.
                <br />
                For tomorrow.
              </h1>
              <p className="body" data-reveal style={{ "--rd": "160ms" }}>
                Purity without responsibility is not purity at all. Every
                choice we make is guided by what we leave behind — for the
                mountain, the ecosystem, and the people who depend on both.
              </p>
              <a
                className="btn btn--ghost shero__cta"
                href="#approach"
                data-reveal
                style={{ "--rd": "240ms" }}
              >
                Our Commitment{" "}
                <span className="btn__arrow">{Icon.arrow}</span>
              </a>
            </div>
          </div>
        </section>

        {/* ---------- OUR APPROACH ---------- */}
        <section className="section approach" id="approach">
          <div className="wrap approach__grid">
            <div>
              <p className="kicker" data-reveal>
                Our Approach
              </p>
              <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                Sustainability
                <br />
                in every drop.
              </h2>
              <p className="body" data-reveal style={{ "--rd": "160ms" }}>
                From source protection to packaging, sustainability shapes
                every decision we make. It is not a policy — it is how we
                operate.
              </p>
            </div>
            <ul className="approach__cards">
              {APPROACH.map((a, i) => (
                <li
                  className="appr-card"
                  key={a.title}
                  data-reveal
                  style={{ "--rd": `${i * 60}ms` }}
                >
                  <div className="appr-card__img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.img} alt={a.alt} />
                  </div>
                  <div className="appr-card__body">
                    <span className="appr-card__badge" aria-hidden="true">
                      {a.icon}
                    </span>
                    <h3>{a.title}</h3>
                    <p>{a.copy}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- CLOSE TO NATURE ---------- */}
        <section className="section close-nature" id="close-nature">
          <div className="wrap close-nature__grid">
            <div
              className="close-nature__imgwrap"
              data-reveal="img"
              style={{ "--rd": "60ms" }}
            >
              <div className="ph close-nature__ph">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="ph__img"
                  src="/himspring-skeleton-assets/crystal purity.png"
                  alt="A single water drop landing in still Himalayan water"
                />
              </div>
            </div>
            <div>
              <p className="kicker" data-reveal>
                Close to Nature
              </p>
              <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                We take only what nature can renew.
              </h2>
              <p className="body" data-reveal style={{ "--rd": "160ms" }}>
                Our extraction rate is set well below the spring&rsquo;s
                natural recharge rate. The mountain gives — and we give it
                time to give again.
              </p>
            </div>
            <ul className="close-stats" data-reveal style={{ "--rd": "140ms" }}>
              {CLOSE_STATS.map((s) => (
                <li className="close-stat" key={s.label}>
                  <span className="close-stat__icon" aria-hidden="true">
                    {s.icon}
                  </span>
                  <div>
                    <span className="close-stat__value">{s.value}</span>
                    <span className="close-stat__label">{s.label}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- OUR INITIATIVES ---------- */}
        <section className="section initiatives" id="initiatives">
          <div className="wrap initiatives__grid">
            <div>
              <p className="kicker" data-reveal>
                Our Initiatives
              </p>
              <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                Small steps.
                <br />
                Lasting impact.
              </h2>
            </div>
            <ul className="initiatives__list">
              {INITIATIVES.map((item, i) => (
                <li
                  className="init-item"
                  key={item.title}
                  data-reveal
                  style={{ "--rd": `${i * 55}ms` }}
                >
                  <span className="init-item__icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- PROMISE FOR GENERATIONS ---------- */}
        <section className="section promise" id="promise">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="promise__art"
            src="/himspring-skeleton-assets/himalayas.png"
            alt=""
            aria-hidden="true"
          />
          <div className="wrap promise__grid">
            <div>
              <p className="kicker" data-reveal>
                A Promise for Generations
              </p>
              <h2 className="h2" data-reveal style={{ "--rd": "80ms" }}>
                Preserving purity.
                <br />
                Inspiring future.
              </h2>
              <p className="body" data-reveal style={{ "--rd": "160ms" }}>
                Sustainability is not a campaign. It is the foundation of
                everything Himspring stands for — today, and long after.
              </p>
            </div>
            <ul className="promise__cards">
              {PROMISES.map((p, i) => (
                <li
                  className="promise-card"
                  key={p.title}
                  data-reveal
                  style={{ "--rd": `${i * 80}ms` }}
                >
                  <span className="promise-card__icon" aria-hidden="true">
                    {p.icon}
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.copy}</p>
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
