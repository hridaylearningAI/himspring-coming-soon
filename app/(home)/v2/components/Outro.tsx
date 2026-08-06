"use client";

import { useEffect, useRef } from "react";
import Reveal from "../../components/Reveal";
import Scene from "../../components/Scene";
import BottleSVG from "./BottleSVG";

/* [07] return banner + optional CTA.

   The source is a short, calm handoff from the product story to the journal.
   Its image drifts slightly as it passes rather than holding the reader in a
   pinned scene, so the writing begins immediately below it. */

/* Enquiries, hidden for now and not removed. The flag lives here rather than in
   page.tsx because this file renders two sections and only the second one is
   being hidden — gating <Outro /> itself would take the hillside bookend with
   it. Flip to true to bring it back; the markup below is untouched. */
const SHOW_ENQUIRIES = false;

export default function Outro() {
  const banner = useRef<HTMLDivElement | null>(null);
  const frame = useRef<HTMLDivElement | null>(null);

  /* The picture crosses its own frame while the banner enters and leaves the
     viewport. This keeps parallax visible on a short banner without pinning it. */
  useEffect(() => {
    const element = banner.current;
    const target = frame.current;
    if (!element || !target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let visible = false;
    let raf = 0;
    const tick = () => {
      const rect = element.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      target.style.setProperty("--return-progress", progress.toFixed(4));
      if (visible) raf = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    }, { rootMargin: "20% 0px" });

    observer.observe(element);
    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* id="commitment" remains the existing navigation target. */}
      <section className="hsv-return" id="commitment" aria-labelledby="hsv-return-t">
        <div className="hsv-return__frame" ref={frame}>
          <Scene className="hsv-return__scene hsv-plate" src="/assets/natures-finest-expression.jpg" alt="Himalayan mountain peak and pristine turquoise water source">
            {null}
          </Scene>
          <div className="hsv-return__veil" aria-hidden="true" />

          <div className="hsv-return__inner" ref={banner}>
            <Reveal as="h2" className="hsv-return__line hsv-blur" id="hsv-return-t">
              Nature&rsquo;s Finest Expression
            </Reveal>
          </div>
        </div>
      </section>

      {SHOW_ENQUIRIES ? (
      <section className="hsv-cta" aria-labelledby="hsv-cta-t">
        <div className="hsv-cta__stage" aria-hidden="true">
          <BottleSVG variant="pet" className="hsv-cta__bottle" />
        </div>

        <div className="hsv-cta__copy">
          <Reveal as="p" className="hsv-label">
            Enquiries
          </Reveal>
          <h2 className="hs-vh" id="hsv-cta-t">
            Enquiries
          </h2>
          <Reveal as="p" className="hsv-prose hsv-blur" delay={90}>
            Distribution, hospitality supply and trade orders are open now. Tell us where
            the water is going and we will come back to you.
          </Reveal>
          <Reveal delay={160}>
            <a className="hs-btn" href="#contact">
              Get in touch
            </a>
          </Reveal>
        </div>
      </section>
      ) : null}
    </>
  );
}
