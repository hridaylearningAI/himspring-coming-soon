import type { ReactNode } from "react";
import {
  COMPANY,
  CONTACT_EMAIL,
  LEGAL_LINKS,
  SECTION_LINKS,
  SOCIAL_LINKS,
  type NavLink,
  type SocialLink,
} from "../lib/content";
import { Logo } from "./Logo";

/* [10] footer — three ruled columns over a baseline strip.

   Explore takes the same prop the nav does, and for the same reason: these are
   in-page anchors, so they belong to the page, not to the furniture.

   What makes this the production footer rather than the layout one it replaced:
   every href resolves, and resolves to something built in this design. Six did
   not — three in About, the Instagram button, Privacy and Terms — and a footer
   is where people look for exactly those, so a dead one here is worse than a
   dead one anywhere else.

   Four columns became three when About was dropped; see the note in lib/content
   for what it held and why it is not simply pointed at the pages that exist. */

/* Drawn on the same 24-unit grid and stroked, not filled, so both sit at the
   same optical weight as each other and as the hairline rules around them. */
const ICON: Record<SocialLink["icon"], ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  linkedin: (
    <>
      <line x1="7" y1="10.5" x2="7" y2="17" />
      <circle cx="7" cy="6.4" r="0.9" fill="currentColor" stroke="none" />
      <path d="M11 17v-4.1a2.3 2.3 0 0 1 4.6 0V17" />
      <line x1="11" y1="10.5" x2="11" y2="17" />
    </>
  ),
};

export default function SiteFooter({
  links = SECTION_LINKS,
}: {
  readonly links?: readonly NavLink[];
}) {
  /* The year was hardcoded to 2026, which is right until it silently is not —
     a stale copyright line being the classic tell of an unmaintained site.

     Worth being precise about what this fixes, though: every page carrying this
     footer prerenders as static, so the value is baked at build time and not per
     request. It updates on the next deploy after New Year, not at midnight. That
     is strictly better than a literal — a site that ships anything at all in a
     year gets a correct footer for free — but it is not self-maintaining, and a
     site left untouched for two years will say so. */
  const year = new Date().getFullYear();

  /* An account with no URL yet is declared in content.ts and skipped here. The
     alternative is href="#", which is the defect this footer exists to fix. */
  const socials = SOCIAL_LINKS.filter((social) => social.href);

  return (
    <footer className="hs-foot" aria-labelledby="foot-t">
      <h2 id="foot-t" className="hs-vh">
        Site footer
      </h2>
      <div className="hs-shell">
        <div className="hs-foot__grid">
          <div className="hs-foot__col hs-foot__col--brand">
            {/* The full lockup, and no descriptor beside it. This used to pass
                sub="Natural Himalayan Spring Water" under the monogram, which
                the real artwork makes redundant and then contradicts — the
                lockup carries "Natural Himalayan Water" and its Arabic setting
                drawn into it, and two one-line descriptors stacked on top of
                each other is one too many. */}
            <Logo lockup />
          </div>

          <nav className="hs-foot__col" aria-label="Explore">
            <h3>Explore</h3>
            <ul>
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hs-foot__col hs-foot__col--contact">
            <h3>Contact</h3>
            <ul>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
            </ul>

            {/* A <ul> because the button used to be a bare inline-flex anchor in
                a column that is not a flex container, so its margin-top did
                nothing and it sat on top of the email address. The list gives it
                a block context and the gap that was intended all along. */}
            {socials.length > 0 ? (
              <ul className="hs-foot__social">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      className="hs-foot__social-btn"
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Himspring on ${social.label}`}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        {ICON[social.icon]}
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="hs-foot__base">
          {/* No period after the entity name: it already ends in one — "Pvt.
              Ltd." — and adding the sentence's own produced "Ltd.. All rights". */}
          <span>
            &copy; {year} {COMPANY.legalName} All rights reserved.
          </span>
          <nav aria-label="Legal">
            {LEGAL_LINKS.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
