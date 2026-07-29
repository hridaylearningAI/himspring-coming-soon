"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* A photographic plate over its own SVG placeholder.

   The static file probed each image with `new Image()` and only injected the
   <img> once it resolved, because the generated plates might not exist yet.
   They exist now and Next serves them from public/, so the <img> is rendered
   straight away and the fade is driven by its own load event.

   `img.complete` is checked on mount as well: a cached plate can finish loading
   before hydration attaches the handler, and without this the picture would sit
   at opacity 0 forever. */

export default function Scene({
  className,
  src,
  alt,
  children,
  priority = false,
}: {
  className: string;
  src: string;
  /* empty string marks the plate as decorative; the section's own copy names it */
  alt: string;
  /* the SVG placeholder beneath */
  children: ReactNode;
  /* the hero plate is the LCP element and must not wait its turn */
  priority?: boolean;
}) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <div
      className={`${className}${loaded ? " has-photo" : ""}`}
      {...(alt === "" ? { "aria-hidden": true } : {})}
    >
      {children}
      {/* eslint-disable-next-line @next/next/no-img-element -- these plates are
          absolutely positioned and object-fit cover a section-sized box; the
          veils above them are calibrated against the exact framing, so
          next/image's own sizing behaviour is not worth the risk here */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
