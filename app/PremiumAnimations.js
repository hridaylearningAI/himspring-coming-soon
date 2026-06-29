"use client";

/**
 * Premium GSAP choreography for the landing page.
 *
 * The CSS intro (cloud reveal + slide-up) hands off via the `himspring:intro-done`
 * event. We hold the page content hidden underneath, then — once the scenic
 * background has risen into place — compose it in with a refined staggered
 * entrance. Plus a gentle continuous float on the feature icons, a subtle
 * hover lift on desktop, and scroll-reveals for the cards/footer on mobile.
 *
 * Built with @gsap/react's useGSAP() so every tween + ScrollTrigger is reverted
 * automatically on unmount, and prefers-reduced-motion is fully honored.
 */

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function PremiumAnimations() {
  useGSAP((context, contextSafe) => {
    // Reduced motion: leave everything in its natural, fully-visible state.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.matchMedia("(max-width: 880px)").matches;
    const heroEls = [".eyebrow", "h1 .line-1", "h1 .line-2", ".lede", ".signup"];

    // Hidden start states. useGSAP runs in a layout effect (before paint) and
    // the intro overlay covers the page until the slide finishes, so there's
    // no flash of content. (JS-off users keep everything visible — these only
    // run when GSAP does.)
    gsap.set(".topbar", { autoAlpha: 0, y: -14 });
    gsap.set(heroEls, { autoAlpha: 0, y: 34 });
    gsap.set([".feat", ".footer"], { autoAlpha: 0, y: 26 });

    // The entrance, played when the intro slide-up completes.
    const reveal = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
    reveal
      .to(".topbar", { autoAlpha: 1, y: 0, duration: 0.9 })
      .to(".eyebrow", { autoAlpha: 1, y: 0, duration: 0.9 }, "-=0.5")
      .to("h1 .line-1", { autoAlpha: 1, y: 0, duration: 1.1 }, "-=0.55")
      .to("h1 .line-2", { autoAlpha: 1, y: 0, duration: 1.1 }, "-=0.85")
      .to(".lede", { autoAlpha: 1, y: 0, duration: 1.0 }, "-=0.7")
      .to(".signup", { autoAlpha: 1, y: 0, duration: 1.0 }, "-=0.65");

    // On desktop the whole page is one screen, so reveal the cards + footer as
    // part of the entrance. On mobile they live below the fold — reveal them on
    // scroll instead (below).
    if (!isMobile) {
      reveal
        .to(".feat", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.14 }, "-=0.55")
        .to(".footer", { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.5");
    }

    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      reveal.play();
      // The intro kept the page scroll-locked while it ran, so any ScrollTriggers
      // were measured against a locked scroller. Now that the slide is done and
      // scrolling is unlocked, recalculate their positions.
      ScrollTrigger.refresh();
    };
    window.addEventListener("himspring:intro-done", play);
    const fallback = window.setTimeout(play, 5200); // safety net if the event is missed

    // Gentle, continuous float on the feature icons (animates the icon's own y,
    // independent of the card-level reveal, so they compose cleanly).
    gsap.to(".feat__icon", {
      y: -5,
      duration: 2.8,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.45, from: "start" },
    });

    // Mobile: cards + footer fade-rise as they scroll into view.
    if (isMobile) {
      ScrollTrigger.batch(".feat", {
        start: "top 88%",
        onEnter: (els) =>
          gsap.to(els, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
            overwrite: true,
          }),
      });
      ScrollTrigger.create({
        trigger: ".footer",
        start: "top 96%",
        onEnter: () =>
          gsap.to(".footer", { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", overwrite: true }),
      });
    }

    // Desktop: subtle hover lift on the feature card icons. contextSafe() keeps
    // these tweens inside the GSAP context so they're cleaned up on unmount.
    if (!isMobile) {
      const cards = gsap.utils.toArray(".feat");
      const handlers = cards.map((card) => {
        const icon = card.querySelector(".feat__icon");
        const enter = contextSafe(() =>
          gsap.to(icon, { scale: 1.1, duration: 0.45, ease: "power2.out" })
        );
        const leave = contextSafe(() =>
          gsap.to(icon, { scale: 1, duration: 0.45, ease: "power2.out" })
        );
        card.addEventListener("mouseenter", enter);
        card.addEventListener("mouseleave", leave);
        return { card, enter, leave };
      });

      return () => {
        window.removeEventListener("himspring:intro-done", play);
        window.clearTimeout(fallback);
        handlers.forEach(({ card, enter, leave }) => {
          card.removeEventListener("mouseenter", enter);
          card.removeEventListener("mouseleave", leave);
        });
      };
    }

    return () => {
      window.removeEventListener("himspring:intro-done", play);
      window.clearTimeout(fallback);
    };
  });

  return null;
}
