import { PROVENANCE } from "../lib/content";
import Reveal from "./Reveal";

/* [03] provenance bar — four measured facts, ruled like a spec sheet. */

export default function Provenance() {
  return (
    <section className="hs-prov" aria-label="Source characteristics">
      <div className="hs-shell">
        <div className="hs-prov__grid">
          {PROVENANCE.map((stat, i) => (
            <Reveal className="hs-prov__cell" key={stat.key} delay={i * 90}>
              <p className={`hs-prov__val${stat.wide ? " hs-prov__val--word" : ""}`}>
                {stat.value}
                {stat.unit ? <sup>{stat.unit}</sup> : null}
              </p>
              <p className="hs-prov__key">{stat.key}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
