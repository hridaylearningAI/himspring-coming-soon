"use client";

import { useEffect, useRef, useState } from "react";

// The homepage's backdrop: a fixed, viewport-filling film whose playhead is
// driven by scroll progress through the whole document — scrolling toward the
// footer plays the film forward, scrolling back up rewinds it. The scrub
// encodes are all-intra (every frame a keyframe), which is what makes seeking
// this fast; don't point this at a normally-encoded file. currentTime chases
// the scroll position through a small lerp each frame so motion stays fluid
// between scroll events. The poster sits beneath the video, covering load and
// prefers-reduced-motion (where the film never mounts and the page rests on
// the static poster).
const MOBILE_MQ = "(max-width: 880px)"; // the site's stacking breakpoint

export default function PageFilm({ desktop, mobile, poster, posterMobile }) {
  const [src, setSrc] = useState(null); // chosen on mount; SSR renders poster only
  const [ready, setReady] = useState(false);
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
    if (!src) return;
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => setReady(true);
    video.addEventListener("loadeddata", onLoaded);
    if (video.readyState >= 2) setReady(true);

    let rafId = 0;
    let current = 0;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      // scrollHeight is re-read every frame: images loading in change it
      const runway = document.documentElement.scrollHeight - window.innerHeight;
      const p = runway > 0 ? Math.min(1, Math.max(0, window.scrollY / runway)) : 0;
      if (!video.duration) return;
      const target = p * Math.max(0, video.duration - 0.05);
      current += (target - current) * 0.18;
      if (Math.abs(target - current) < 0.003) current = target;
      if (!video.seeking && Math.abs(video.currentTime - current) > 1 / 48) {
        video.currentTime = current;
      }
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("loadeddata", onLoaded);
    };
  }, [src]);

  return (
    <div className="pagefilm" aria-hidden="true">
      <picture>
        <source media={MOBILE_MQ} srcSet={posterMobile} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pagefilm__poster" src={poster} alt="" fetchPriority="high" />
      </picture>
      {src && (
        <video
          ref={videoRef}
          className={`pagefilm__layer${ready ? " is-ready" : ""}`}
          src={src}
          muted
          playsInline
          preload="auto"
        />
      )}
    </div>
  );
}
