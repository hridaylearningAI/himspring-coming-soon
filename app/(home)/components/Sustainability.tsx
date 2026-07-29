import { SUSTAINABILITY } from "../lib/content";
import Reveal from "./Reveal";
import Scene from "./Scene";

/* [08] sustainability — a numbered list over a protected valley plate. */

export default function Sustainability() {
  return (
    <section className="hs-sus hs-stage" id="sustainability" aria-labelledby="sus-t">
      <Scene className="hs-photo hs-sus__scene" src="/assets/sustain-valley.jpg" alt="">
        {null}
      </Scene>
      <div className="hs-sus__veil" aria-hidden="true" />

      {/* eslint-disable-next-line @next/next/no-img-element -- height-driven off
          the band; see `.hs-sus__bottle` in home.css */}
      <img
        className="hs-sus__bottle hs-bottle-static"
        src="/actual-bottle-glass.webp"
        alt=""
        aria-hidden="true"
        decoding="async"
        loading="lazy"
      />

      <div className="hs-stage__grid">
        <div className="hs-stage__copy">
          <Reveal as="p" className="hs-eyebrow">
            Sustainability
          </Reveal>
          <h2 className="hs-vh" id="sus-t">
            Sustainability
          </h2>

          <div className="hs-sus__list">
            {SUSTAINABILITY.map((item, i) => (
              <Reveal className="hs-sus__item" key={item.title} delay={i * 110}>
                <span className="hs-sus__num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
