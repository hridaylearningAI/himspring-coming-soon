import NotifyForm from "./NotifyForm";

const EXPLORE = [
  { href: "/our-story", label: "Our Story" },
  { href: "/the-source", label: "The Source" },
  { href: "/#journey", label: "Journey" },
  { href: "/purity", label: "Purity" },
  { href: "/sustainability", label: "Sustainability" },
];

const ABOUT = [
  { href: "/contact", label: "Contact" },
  { href: "mailto:hello@himspring.com", label: "hello@himspring.com" },
];

/* Site footer. `notify` adds the "Be Among the First" email column — used on
   pages that don't already carry the notify CTA band. */
export default function Footer({ notify = false }) {
  return (
    <footer className={`footer${notify ? " footer--notify" : ""}`} id="contact">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <span className="footer__mark" aria-hidden="true">
            hs
          </span>
          <span className="footer__name">Himspring</span>
          <span className="footer__tag">Himalayan Spring Water</span>
          <div className="footer__social">
            <a
              href="https://www.instagram.com/himspring?igsh=MWloMmd4ZmR3ejVsYg=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Himspring on Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
          </div>
        </div>

        <nav className="footer__col" aria-label="Explore">
          <h3>Explore</h3>
          {EXPLORE.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <nav className="footer__col" aria-label="About">
          <h3>About</h3>
          {ABOUT.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        {notify && (
          <div className="footer__col footer__signup">
            <h3>Be Among the First</h3>
            <p>Join our journey and be the first to know when we launch.</p>
            <NotifyForm />
          </div>
        )}
      </div>

      <div className="wrap footer__legal">
        <span>
          © {new Date().getFullYear()} Himspring. All rights reserved.
        </span>
        <span>
          <a href="#">Privacy Policy</a> · <a href="#">Terms of Use</a>
        </span>
      </div>
    </footer>
  );
}
