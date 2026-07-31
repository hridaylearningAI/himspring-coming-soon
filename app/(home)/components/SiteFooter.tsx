import type { ReactNode } from "react";
import {
  COMPANY,
  CONTACT_EMAIL,
  FOOTER_LINKS,
  LEGAL_LINKS,
  SOCIAL_LINKS,
  type NavLink,
  type SocialLink,
} from "../lib/content";
import { Logo } from "./Logo";

/* [10] footer — three ruled columns over a baseline strip.

   One navigation column, not two. It briefly had both an About column of the
   five internal pages and an Explore column of the homepage's anchors, which
   named three of the same topics twice over; see FOOTER_LINKS in lib/content
   for what was duplicated and the rule that settles which link wins.

   The list is the same on every page, which is the other half of the fix. It
   used to take the nav's per-page prop, on the reasoning that in-page anchors
   belong to the page rather than to the furniture — true of the bar, where the
   links scroll the document you are reading, and false of the footer, where
   they are a map of the site. The prop survives with a default rather than
   being removed outright: /v1 is the archived homepage and its sections are its
   own, so it is the one page that still overrides.

   What makes this the production footer: every href resolves, and resolves to
   something built in this design. */
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
  links = FOOTER_LINKS,
}: {
  readonly links?: readonly NavLink[];
}) {
  const year = new Date().getFullYear();
  const socials = SOCIAL_LINKS.filter((social) => social.href);

  return (
    <footer className="hs-foot" aria-labelledby="foot-t">
      <h2 id="foot-t" className="hs-vh">
        Site footer
      </h2>
      <div className="hs-shell">
        <div className="hs-foot__grid">
          <div className="hs-foot__col hs-foot__col--brand">
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
