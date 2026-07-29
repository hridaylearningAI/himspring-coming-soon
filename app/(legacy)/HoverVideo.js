"use client";

import { useEffect, useRef, useState } from "react";

/* A studio object at rest is its poster still; on a real hover the film fades
   in over it and plays, then fades back and rewinds on leave. The crossfade
   masks the film's off-centre opening frame and its loop seam. Touch and
   reduced-motion visitors keep the still — the video never mounts for them. */
export default function HoverVideo({ src, poster, alt, position }) {
  const videoRef = useRef(null);
  const [canHover, setCanHover] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    setCanHover(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  const enter = () => {
    setActive(true);
    videoRef.current?.play().catch(() => {});
  };
  const leave = () => {
    const video = videoRef.current;
    setActive(false);
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  const fit = position ? { objectPosition: position } : undefined;

  return (
    <div
      className="hovervid"
      onMouseEnter={canHover ? enter : undefined}
      onMouseLeave={canHover ? leave : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hovervid__poster" src={poster} alt={alt} loading="lazy" style={fit} />
      {canHover && (
        <video
          ref={videoRef}
          className={`hovervid__film${active ? " is-on" : ""}`}
          src={src}
          muted
          playsInline
          loop
          preload="metadata"
          style={fit}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
