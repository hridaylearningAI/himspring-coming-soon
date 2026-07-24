import NotifyForm from "./NotifyForm";

const EXPLORE = [
  { href: "/our-story", label: "Our Story" },
  { href: "/the-source", label: "The Source" },
  { href: "/#journey", label: "Journey" },
];

const MORE = [
  { href: "/purity", label: "Purity" },
  { href: "/sustainability", label: "Sustainability" },
  { href: "/contact", label: "Contact" },
];

/* Site footer. `notify` adds the "Be Among the First" email column — used on
   pages that don't already carry the notify CTA band. */
export default function Footer({ notify = false }) {
  return (
    <footer className={`footer${notify ? " footer--notify" : ""}`} id="contact">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="footer__logo"
            src="/himspring logo full no bg.png"
            alt="Himspring. Purity for the world's elite."
          />
          <span className="footer__tag">Born above, pure by nature.</span>
        </div>

        <nav className="footer__col" aria-label="Explore">
          <h3>Explore</h3>
          {EXPLORE.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <nav className="footer__col" aria-label="More">
          <h3>Discover</h3>
          {MORE.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="footer__col footer__follow">
          <h3>Follow Us</h3>
          <div className="footer__social">
            <a
              href="https://www.instagram.com/himspring?igsh=MWloMmd4ZmR3ejVsYg=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Himspring on Instagram"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="mailto:hello@himspring.com" aria-label="Email Himspring">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="5.5" width="18" height="13" rx="2" />
                <path d="m3 8 9 6 9-6" />
              </svg>
            </a>
          </div>
        </div>

        {notify && (
          <div className="footer__col footer__signup">
            <h3>Be Among the First</h3>
            <p>Join our journey and be the first to know when we launch.</p>
            <NotifyForm variant="compact" />
          </div>
        )}
      </div>

      <div className="wrap footer__legal">
        <span>© {new Date().getFullYear()} Himspring. All rights reserved.</span>
        <span>
          <a href="#">Privacy Policy</a> · <a href="#">Terms of Use</a>
        </span>
      </div>
    </footer>
  );
}
