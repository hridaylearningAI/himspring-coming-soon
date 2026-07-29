import { CONTACT_EMAIL, FOOTER_ABOUT_LINKS, SECTION_LINKS, type NavLink } from "../lib/content";
import { Logo } from "./Logo";

/* [10] footer — four ruled columns over a baseline strip.

   Explore takes the same prop the nav does, and for the same reason: these are
   in-page anchors, so they belong to the page, not to the furniture. */

export default function SiteFooter({
  links = SECTION_LINKS,
}: {
  readonly links?: readonly NavLink[];
}) {
  return (
    <footer className="hs-foot" aria-labelledby="foot-t">
      <h2 id="foot-t" className="hs-vh">
        Site footer
      </h2>
      <div className="hs-shell">
        <div className="hs-foot__grid">
          <div className="hs-foot__col">
            {/* The full lockup, and no descriptor beside it. This used to pass
                sub="Natural Himalayan Spring Water" under the monogram, which
                the real artwork makes redundant and then contradicts — the
                lockup carries "Natural Himalayan Water" and its Arabic setting
                drawn into it, and two one-line descriptors stacked on top of
                each other is one too many. */}
            <Logo lockup />
          </div>

          <div className="hs-foot__col">
            <h3>Explore</h3>
            <ul>
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="hs-foot__col">
            <h3>About</h3>
            <ul>
              {FOOTER_ABOUT_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="hs-foot__col">
            <h3>Contact</h3>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <a className="hs-foot__ig" href="#" aria-label="Himspring on Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>

        <div className="hs-foot__base">
          <span>&copy; 2026 Himspring. All rights reserved.</span>
          <span>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
