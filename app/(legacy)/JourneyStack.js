"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { 
    num: "01", 
    title: "The Shivalik Himalayas", 
    copy: "Where purity begins. Sourced from high-altitude ranges protected by nature.", 
    img: "/himspring-skeleton-assets/himalayas.png" 
  },
  { 
    num: "02", 
    title: "Protected Mountain Aquifers", 
    copy: "Hidden deep beneath untouched mountains, sheltered from all external influences.", 
    img: "/himspring-skeleton-assets/glacial origins.png" 
  },
  { 
    num: "03", 
    title: "Nature's Filtration", 
    copy: "Patiently refined through mineral-rich rock and ancient sand layers over centuries.", 
    img: "/himspring-skeleton-assets/natural filtration.png" 
  },
  { 
    num: "04", 
    title: "Naturally Balanced", 
    copy: "Emerges pure, balanced, and remarkably smooth with naturally occurring electrolytes.", 
    img: "/himspring-skeleton-assets/crystal purity.png" 
  },
  { 
    num: "05", 
    title: "Himspring", 
    copy: "Preserved exactly as nature intended, bottled at the source above 6,000 feet.", 
    img: "/himspring-skeleton-assets/hero-himspring.png" 
  },
];

export default function JourneyStack() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useGSAP(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (cards.length === 0) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      cards.forEach((card, idx) => {
        if (idx === cards.length - 1) return;
        gsap.to(card, {
          scale: 0.96,
          ease: "none",
          scrollTrigger: {
            trigger: cards[idx + 1],
            start: "top 85%",
            end: "top 15%",
            scrub: true,
          },
        });
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="journey-stack-wrapper">
      <div className="journey-stack-head">
        <p className="eyebrow" data-reveal>THE SOURCE</p>
        <h2 className="h2" data-reveal style={{ "--rd": "60ms" }}>
          Where Nature Preserves <br /><em>Its Finest Creation.</em>
        </h2>
        <p className="journey-stack-head__desc" data-reveal style={{ "--rd": "120ms" }}>
          High in the pristine Shivalik ranges of the Himalayas, over 6,000 feet above sea level, HIMSPRING begins its journey in one of nature's most protected environments. Untouched by human intervention and shaped over centuries, every drop carries the purity, balance and character that only time can create.
        </p>
      </div>

      <div className="journey-stack-container">
        {STEPS.map((step, idx) => (
          <div
            key={idx}
            ref={el => cardsRef.current[idx] = el}
            className="journey-stack-card"
          >
            <div className="journey-stack-card__inner">
              <div className="journey-stack-card__left">
                <span className="journey-stack-card__num">{step.num}</span>
                <h3 className="journey-stack-card__title">{step.title}</h3>
                <p className="journey-stack-card__copy">{step.copy}</p>
              </div>
              <div className="journey-stack-card__right">
                <div className="journey-stack-card__img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="journey-stack-card__img" src={step.img} alt={step.title} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
