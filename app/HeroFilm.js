"use client";

import { useEffect, useRef, useState } from "react";

const MOBILE_MQ = "(max-width: 880px)";

/* The hero holds for two viewports: the section is 200svh tall and the frame
   inside is position:sticky, so the film stays put while scroll drives its
   playhead. Progress through the section maps to video.currentTime through a
   lerped rAF loop (the scrub encodes are all-intra, so seeking is cheap).
   Sticky replaces the previous ScrollTrigger pin — no spacer math, nothing to
   mismeasure. Reduced motion: the video never mounts; the poster carries the
   frame and the section collapses to one viewport (see CSS). */
export default function HeroFilm({ desktop, mobile, poster, posterMobile, children }) {
  const [src, setSrc] = useState(null);
  const [ready, setReady] = useState(false);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mq = window.matchMedia(MOBILE_MQ);
    const pick = () => {
      setReady(false);
      setSrc(mq.matches ? mobile : desktop);
    };
    pick();
    mq.addEventListener("change", pick);
    return () => mq.removeEventListener("change", pick);
  }, [desktop, mobile]);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!src || !video || !section) return;

    const onLoaded = () => setReady(true);
    video.addEventListener("loadeddata", onLoaded);
    if (video.readyState >= 2) setReady(true);

    let raf = 0;
    let current = 0;
    const loop = () => {
      const range = section.offsetHeight - window.innerHeight;
      const target =
        range > 0 ? Math.min(1, Math.max(0, -section.getBoundingClientRect().top / range)) : 0;
      current += (target - current) * 0.14;
      if (Math.abs(target - current) < 0.001) current = target;
      if (video.duration) {
        const t = current * Math.max(0, video.duration - 0.05);
        if (Math.abs(video.currentTime - t) > 0.005) video.currentTime = t;
      }
      // the gauge and any other hero instruments read progress from here
      section.style.setProperty("--film-progress", current.toFixed(4));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("loadeddata", onLoaded);
    };
  }, [src]);

  return (
    <div ref={sectionRef} className="fhero-hold" data-film-hold data-header-dark>
      <div className="fhero-frame">
        <div className="fhero-video-container">
          <picture>
            <source media={MOBILE_MQ} srcSet={posterMobile} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="fhero-video__poster" src={poster} alt="" fetchPriority="high" />
          </picture>
          {src && (
            <video
              ref={videoRef}
              className={`fhero-video__layer${ready ? " is-ready" : ""}`}
              src={src}
              muted
              playsInline
              preload="auto"
            />
          )}
          <div className="fhero-video__scrim"></div>
        </div>
        <div className="fhero-content-overlay">{children}</div>
      </div>
    </div>
  );
}
