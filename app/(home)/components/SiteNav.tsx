"use client";

import { useEffect, useState } from "react";
import { CONTACT_LINK, SECTION_LINKS, type NavLink } from "../lib/content";
import { Logo } from "./Logo";

/* Fixed header plus the mobile drawer. Two pieces of state:
     stuck — past 40px, the bar takes its background and hairline
     open  — the drawer, which also locks body scroll behind it

   The section links are a prop because every href in them is an in-page anchor,
   which makes them a property of the page the nav is rendered over rather than
   of the nav. Two pages render it — the homepage and the archived /v1 — and
   they have no sections in common, so a single hardcoded list would be four
   dead links on one of them. Default is the homepage's set. */

export default function SiteNav({
  links = SECTION_LINKS,
}: {
  readonly links?: readonly NavLink[];
}) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  /* Derived, not passed: the drawer is always the section list plus Contact,
     and taking it as a second prop would let the two get out of step. */
  const drawerLinks: readonly NavLink[] = [...links, CONTACT_LINK];

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setStuck(window.pageYOffset > 40);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll lock lives with the drawer, and is released on unmount so a route
  // change while the drawer is open can't leave the page frozen.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header className={`hs-nav${stuck ? " is-stuck" : ""}${open ? " is-open" : ""}`} id="nav">
        <div className="hs-nav__inner">
          <nav className="hs-nav__set hs-nav__set--start" aria-label="Sections">
            {links.map((link) => (
              <a className="hs-navlink" href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <Logo href="#top" lockup eager />

          <div className="hs-nav__set hs-nav__set--end">
            <a className="hs-navlink" href="#contact">
              Contact
            </a>
            <a className="hs-btn" href="#contact">
              Enquire
            </a>
            <button
              className="hs-burger"
              id="burger"
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="drawer"
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* stays mounted so the close transition can play; `hidden` is driven off
          the same state rather than a timer, which the static file needed only
          because it was toggling classes by hand */}
      <div
        className={`hs-drawer${open ? " is-open" : ""}`}
        id="drawer"
        inert={!open}
        onClick={(e) => {
          if ((e.target as HTMLElement).tagName === "A") setOpen(false);
        }}
      >
        {drawerLinks.map((link, i) => (
          <a
            href={link.href}
            key={link.href}
            style={{ "--delay": `${60 + i * 80}ms` } as React.CSSProperties}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
