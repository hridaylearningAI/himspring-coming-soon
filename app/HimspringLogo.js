"use client";

/**
 * HimspringLogo — animated "hs" monogram for the Himspring site.
 *
 * The Lottie owns the motion (fade + scale-overshoot reveal, or gentle
 * breathing). The gold "sheen" sweep is a CSS layer masked to the letterforms —
 * animated gradients inside Lottie don't render consistently across players,
 * whereas a masked CSS gradient is rock-solid everywhere.
 *
 * Assets live under /public/animations/ (reveal + loop JSON, mask PNG).
 */

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useRef, useState } from "react";

const BASE = "/animations";

export default function HimspringLogo({
  variant = "reveal", // "reveal" plays once on mount; "loop" breathes forever
  size = 220, // px number or any CSS length string (square)
  sheen = true, // gold sheen sweep across the letters
  interactiveOnHover = true, // re-trigger the reveal + a sheen pass on hover
  startDelay = 0, // ms to hold the reveal before it plays (e.g. until clouds part)
  className,
}) {
  const dotlottieRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  const src =
    variant === "loop"
      ? `${BASE}/himspring-logo-loop.json`
      : `${BASE}/himspring-logo-reveal.json`;

  // Hold the reveal until startDelay elapses, then play from the first frame.
  useEffect(() => {
    if (!startDelay) return;
    const timer = setTimeout(() => {
      const dl = dotlottieRef.current;
      if (dl) {
        dl.setFrame(0);
        dl.play();
      }
    }, startDelay);
    return () => clearTimeout(timer);
  }, [startDelay]);

  const handleEnter = () => {
    if (!interactiveOnHover) return;
    setHovering(true);
    const dl = dotlottieRef.current;
    if (dl && variant === "reveal") {
      dl.setFrame(0);
      dl.play();
    }
  };

  return (
    <div
      className={className}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setHovering(false)}
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-block",
      }}
    >
      <DotLottieReact
        src={src}
        autoplay={startDelay ? false : true}
        loop={variant === "loop"}
        dotLottieRefCallback={(dl) => (dotlottieRef.current = dl)}
        style={{ width: "100%", height: "100%" }}
      />

      {sheen && (
        <span
          aria-hidden
          data-hover={hovering ? "1" : "0"}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            // clip the sweep to the monogram silhouette
            WebkitMaskImage: `url(${BASE}/himspring-logo-mask.png)`,
            maskImage: `url(${BASE}/himspring-logo-mask.png)`,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            mixBlendMode: "screen",
          }}
          className="hs-sheen"
        />
      )}

      <style jsx>{`
        .hs-sheen {
          background: linear-gradient(
            115deg,
            transparent 38%,
            rgba(255, 249, 235, 0.15) 47%,
            rgba(255, 252, 244, 0.9) 50%,
            rgba(255, 249, 235, 0.15) 53%,
            transparent 62%
          );
          background-size: 280% 100%;
          background-position: 140% 0;
          animation: hs-sweep 6s ease-in-out 1.1s infinite;
        }
        /* a quicker glint when the user hovers */
        .hs-sheen[data-hover="1"] {
          animation: hs-sweep 1.1s ease-in-out 0s 1;
        }
        @keyframes hs-sweep {
          0% {
            background-position: 140% 0;
          }
          /* the bright band travels across, then rests off-screen for the cycle */
          22%,
          100% {
            background-position: -60% 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hs-sheen {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
