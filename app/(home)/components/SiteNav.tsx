"use client";

import { useEffect, useState } from "react";
import { CONTACT_LINK, SECTION_LINKS, type NavLink } from "../lib/content";
import { Logo } from "./Logo";

/* Fixed header plus the mobile drawer. Two pieces of state:
     stuck — past 40px, the bar takes its background and hairline
     open  — the drawer, which also locks body scroll behind it

   The section links are a prop because every href in them is an in-page anchor,
   which makes them a property of the page the nav is rendered over rather than
   of the nav. Four pages render it — the homepage, the archived /v1 and the two
   legal pages — and they have no sections in common, so a single hardcoded list
   would be four dead links on three of them. Default is the homepage's set.

   `origin` is the same problem for the three anchors the nav owns rather than
   receives: the wordmark's #top, and Contact and Enquire on #contact. Those are
   correct on a page that has those ids and dead on one that does not, so a page
   without them passes origin="/" and gets links to the homepage's instead. */

export default function SiteNav({
  links = SECTION_LINKS,
  origin = "",
}: {
  readonly links?: readonly NavLink[];
  readonly origin?: string;
}) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  /* Derived, not passed: the drawer is always the section list plus Contact,
     and taking it as a second prop would let the two get out of step. */
  const drawerLinks: readonly NavLink[] = [
    ...links,
    { ...CONTACT_LINK, href: `${origin}${CONTACT_LINK.href}` },
  ];

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

          {/* origin="/" makes this a link home; empty, it is a jump to the top
              of the page you are already on. */}
          <Logo href={origin || "#top"} lockup eager />

          <div className="hs-nav__set hs-nav__set--end">
            {/* Enquire is gone by instruction. It was a second control pointing
                at the same #contact this link does, so nothing is now
                unreachable — the bar just says it once.

                CONTACT_LINK.label rather than a literal, so the bar and the
                drawer cannot disagree about what it is called. */}
            <a className="hs-navlink" href={`${origin}#contact`}>
              {CONTACT_LINK.label}
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
