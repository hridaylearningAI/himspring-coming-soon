"use client";

import { useEffect, useState } from "react";

// Phones get the 9:16 portrait assets; larger screens get the landscape ones.
// Matches the site's existing 880px breakpoint.
const MOBILE_MQ = "(max-width: 880px)";

// The poster image is shown on its own while the intro plays and the page
// slides up — a <video> doesn't repaint reliably while an ancestor is being
// transformed, which leaves the hero blank. Once the slide is finished we
// silently mount the video on top of the (identical) poster, so the swap is
// seamless.
export default function HeroBackground() {
  const [showVideo, setShowVideo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    setIsMobile(mq.matches);
    const onViewportChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onViewportChange);

    const reveal = () => setShowVideo(true);

    // Intro is skipped for reduced-motion users — show the video immediately.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
    } else {
      window.addEventListener("himspring:intro-done", reveal);
    }
    // Safety net in case the intro event never fires.
    const fallback = setTimeout(reveal, 5200);

    return () => {
      mq.removeEventListener("change", onViewportChange);
      window.removeEventListener("himspring:intro-done", reveal);
      clearTimeout(fallback);
    };
  }, []);

  const videoSrc = isMobile ? "/hero-bg-mobile.mp4" : "/hero-bg.mp4";
  const poster = isMobile ? "/hero-poster-mobile.png" : "/hero-poster.png";

  return (
    <>
      <div className="bg-still" aria-hidden="true" />
      {showVideo && (
        <video
          // remount when the asset set changes so the new source actually loads
          key={videoSrc}
          className="bg-video"
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          aria-hidden="true"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </>
  );
}
