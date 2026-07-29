"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { SOURCE_FACTS, SOURCE_PLACE } from "../lib/content";
import Reveal from "./Reveal";

/* [05] the source — a scroll-driven push-in over the relief map, with the film
   layered on top once it can play cleanly.

   The still carries the motion on its own from the first frame, so the section
   is never waiting on the video. Once the film has buffered enough to seek
   without stuttering it crossfades in and takes over the timeline.

   Depth of the parallax shift on the media block. Oversized in CSS (108% tall,
   top -4%) so the shift never exposes an edge. */
const PARALLAX_DEPTH = 0.18;
/* gentle — the film's overlays stay anchored */
const ZOOM_RANGE = 0.06;

export default function Source() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const stillRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [filmReady, setFilmReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const still = stillRef.current;
    const media = mediaRef.current;
    if (!section || !still || !media) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const video = videoRef.current;
    let progress = 0;
    let raf = 0;
    let onScreen = false;
    let videoReady = false;

    const targetProgress = () => {
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = r.height + vh;
      const p = span > 0 ? (vh - r.top) / span : 0;
      return p < 0 ? 0 : p > 1 ? 1 : p;
    };

    const tick = () => {
      const target = targetProgress();
      // damped follow, so the motion glides instead of stepping with each
      // discrete scroll event
      progress += (target - progress) * 0.12;
      if (Math.abs(target - progress) < 0.0005) progress = target;

      still.style.setProperty("--zoom", (1 + ZOOM_RANGE * progress).toFixed(4));

      if (videoReady && video) {
        const d = video.duration;
        if (d) {
          const t = progress * (d - 0.001);
          if (Math.abs(video.currentTime - t) > 0.008) video.currentTime = t;
        }
      }

      // parallax on the media block, tracking the section's offset from centre
      if (window.innerWidth > 768) {
        const r = media.getBoundingClientRect();
        if (r.bottom > -240 && r.top < window.innerHeight + 240) {
          const mid = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
          media.style.setProperty("--par", `${(mid * PARALLAX_DEPTH * -130).toFixed(1)}px`);
        }
      }

      raf = onScreen ? requestAnimationFrame(tick) : 0;
    };

    const visibility = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? false;
        if (onScreen && !raf) raf = requestAnimationFrame(tick);
      },
      { rootMargin: "25% 0px" }
    );
    visibility.observe(section);

    /* the film is a few megabytes — widescreen, motion-friendly viewers only */
    let filmLoader: IntersectionObserver | null = null;
    const onCanPlayThrough = () => {
      if (videoReady || !video) return;
      videoReady = true;
      // Safari refuses to paint a video that has never played, even when it is
      // only ever seeked — so nudge it once and stop it again
      const kick = video.play();
      if (kick && typeof kick.then === "function") {
        kick.then(() => video.pause(), () => {});
      } else {
        video.pause();
      }
      setFilmReady(true);
    };

    if (video && window.innerWidth > 900) {
      filmLoader = new IntersectionObserver(
        (entries, obs) => {
          if (!entries[0]?.isIntersecting) return;
          obs.disconnect();
          // canplaythrough, not loadeddata: seeking a partly-buffered file is
          // exactly what makes a scrub stutter
          video.addEventListener("canplaythrough", onCanPlayThrough);
          video.src = "/source-film.mp4";
          video.load();
        },
        { rootMargin: "200% 0px" }
      );
      filmLoader.observe(section);
    }

    return () => {
      visibility.disconnect();
      filmLoader?.disconnect();
      video?.removeEventListener("canplaythrough", onCanPlayThrough);
      if (raf) cancelAnimationFrame(raf);
      onScreen = false;
    };
  }, []);

  return (
    <section className="hs-src" id="source" aria-labelledby="source-t" ref={sectionRef}>
      <div className="hs-src__media" ref={mediaRef}>
        {/* eslint-disable-next-line @next/next/no-img-element -- object-position
            and the transform-origin of the push-in are calibrated against this
            exact framing */}
        <img
          className="hs-src__bg"
          src="/source-relief.webp"
          alt=""
          decoding="async"
          loading="lazy"
          ref={stillRef}
        />
        <video
          className={`hs-src__vid${filmReady ? " is-ready" : ""}`}
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          ref={videoRef}
        />
      </div>
      <div className="hs-src__veil" aria-hidden="true" />

      <div className="hs-src__inner">
        <div className="hs-src__copy">
          <Reveal as="p" className="hs-eyebrow">
            The source
          </Reveal>
          <Reveal as="h2" className="hs-h2" id="source-t" delay={80}>
            An ancient spring.
            <br />
            A sacred origin.
          </Reveal>
        </div>

        <dl className="hs-card">
          <dt className="hs-vh">Origin</dt>
          <dd className="hs-card__coord">
            {SOURCE_PLACE.line1}
            <br />
            {SOURCE_PLACE.line2}
          </dd>
          {/* Fragment, not a wrapper element: `.hs-card dd + dt` draws the rule
              between rows, and any real node between them breaks the adjacency */}
          {SOURCE_FACTS.map((fact) => (
            <Fragment key={fact.term}>
              <dt>{fact.term}</dt>
              <dd>{fact.detail}</dd>
            </Fragment>
          ))}
        </dl>

        <Reveal as="a" className="hs-src__cta hs-link" href="#purity" delay={200}>
          Explore the journey<span className="hs-arw">&#8594;</span>
        </Reveal>

        {/* the same facts, stacked — the floating card is hidden below 768px */}
        <dl className="hs-src__facts">
          <div>
            <dt>Origin</dt>
            <dd>
              {SOURCE_PLACE.line1}, {SOURCE_PLACE.line2}
            </dd>
          </div>
          {SOURCE_FACTS.map((fact) => (
            <div key={fact.term}>
              <dt>{fact.term}</dt>
              <dd>{fact.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
