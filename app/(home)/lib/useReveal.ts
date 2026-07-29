"use client";

import { useEffect, useRef, useState } from "react";

/* One IntersectionObserver for every .reveal on the page, rather than one each.
   The static file used a single observer and there are ~30 revealed elements;
   spinning up 30 observers to reproduce it would be a regression dressed as a
   port. Elements unobserve themselves as they fire, so nothing accumulates. */

const REVEAL_OPTIONS: IntersectionObserverInit = {
  threshold: 0.15,
  rootMargin: "0px 0px -8% 0px",
};

let shared: IntersectionObserver | null = null;
const onVisible = new WeakMap<Element, () => void>();

function sharedObserver(): IntersectionObserver {
  if (shared) return shared;
  shared = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      onVisible.get(entry.target)?.();
      onVisible.delete(entry.target);
      observer.unobserve(entry.target);
    }
  }, REVEAL_OPTIONS);
  return shared;
}

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No observer (or the element is already past the fold on a restored
    // scroll position): show it rather than leaving it invisible forever.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = sharedObserver();
    onVisible.set(el, () => setVisible(true));
    observer.observe(el);

    return () => {
      onVisible.delete(el);
      observer.unobserve(el);
    };
  }, []);

  return { ref, visible };
}
