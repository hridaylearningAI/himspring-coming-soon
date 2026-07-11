"use client";

import { useEffect } from "react";

// Adds `is-in` to [data-reveal] elements as they enter the viewport.
// The hiding styles are scoped to html.has-reveal so content stays visible
// without JavaScript and for users who prefer reduced motion.
export default function RevealFX() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    document.documentElement.classList.add("has-reveal");
    const els = document.querySelectorAll("[data-reveal]");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      document.documentElement.classList.remove("has-reveal");
    };
  }, []);

  return null;
}
