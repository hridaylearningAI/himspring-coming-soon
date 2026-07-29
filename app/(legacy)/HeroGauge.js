"use client";

import { useEffect, useRef } from "react";

/* The descent instrument: glacier at the top, the source at the bottom.
   The water's story falls from the glacial zone to the spring at 6,240 ft —
   the readout follows the film's scroll progress through the hero hold.
   Reduced motion: rests at the source, no listeners. */
const GLACIER_FT = 19000;
const SOURCE_FT = 6240;

export default function HeroGauge() {
  const rootRef = useRef(null);
  const progressRef = useRef(null);
  const valueRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const hold = root?.closest("[data-film-hold]");
    if (!root || !hold) return;

    const rest = () => {
      if (valueRef.current) valueRef.current.textContent = `${SOURCE_FT.toLocaleString()} FT`;
      if (progressRef.current) progressRef.current.style.height = "100%";
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      rest();
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const range = hold.offsetHeight - window.innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -hold.getBoundingClientRect().top / range)) : 0;
      const ft = Math.round(GLACIER_FT - p * (GLACIER_FT - SOURCE_FT));
      if (valueRef.current) valueRef.current.textContent = `${ft.toLocaleString()} FT`;
      if (progressRef.current) progressRef.current.style.height = `${(p * 100).toFixed(2)}%`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={rootRef} className="altitude-gauge" aria-hidden="true">
      <div className="altitude-gauge__header">
        <span className="altitude-gauge__label">Altitude</span>
        <span ref={valueRef} className="altitude-gauge__value">
          {GLACIER_FT.toLocaleString()} FT
        </span>
      </div>
      <div className="altitude-gauge__track">
        <div ref={progressRef} className="altitude-gauge__progress" />
        <span className="altitude-gauge__tick altitude-gauge__tick--top">The Glacier</span>
        <span className="altitude-gauge__tick altitude-gauge__tick--bottom">
          The Source · 6,240 FT
        </span>
      </div>
    </div>
  );
}
