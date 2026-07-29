"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/our-story", label: "Our Story" },
  { href: "/the-source", label: "The Source" },
  { href: "/#journey", label: "Journey" },
  { href: "/purity", label: "Purity" },
  { href: "/sustainability", label: "Sustainability" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // the frosted-white state waits until the page's dark ground has fully
  // passed: over the hero film ([data-header-dark]) the header must stay
  // transparent on dark. Pages without a film fall back to a top sentinel.
  useEffect(() => {
    const film = document.querySelector("[data-header-dark]");
    let sentinel;
    let target = film;
    if (!film) {
      sentinel = document.createElement("div");
      sentinel.style.cssText =
        "position:absolute;top:0;left:0;width:1px;height:9px;pointer-events:none;visibility:hidden;";
      document.body.prepend(sentinel);
      target = sentinel;
    }
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      // shrink the top edge so the flip happens as the film slides under the header
      film ? { rootMargin: "-72px 0px 0px 0px" } : undefined,
    );
    io.observe(target);
    return () => {
      io.disconnect();
      sentinel?.remove();
    };
  }, []);

  return (
    <header className={`header${scrolled ? " is-scrolled" : ""}`}>
      <div className="header__inner">
        <a className="header__logo" href="/" aria-label="Himspring home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/himspring logo full no bg.png"
            alt="Himspring. Purity for the world's elite."
          />
        </a>

        <nav className="header__nav" aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={pathname === l.href ? "is-active" : undefined}
              aria-current={pathname === l.href ? "page" : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <a className="btn btn--ghost header__cta" href="#notify">
            Notify Me
          </a>
        </div>
      </div>
    </header>
  );
}
