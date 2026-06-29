import HeroBackground from "./HeroBackground";
import SignupForm from "./SignupForm";

export default function Home() {
  return (
    <main className="stage">
      <HeroBackground />
      <div className="overlay" aria-hidden="true"></div>

      <div className="frame">
        {/* TOP BAR */}
        <header className="topbar">
          <a className="logo" href="#" aria-label="Himspring home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/golden-logo.png" alt="Himspring" />
          </a>
          <div className="social">
            <span className="social__label">Follow our journey</span>
            <div className="social__icons">
              <a href="#" aria-label="Himspring on Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="#" aria-label="Himspring on LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.4 8.65 21 11 21 14.2V21h-4v-6c0-1.43-.03-3.27-2-3.27-2 0-2.3 1.56-2.3 3.17V21H9z" />
                </svg>
              </a>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="hero">
          <p className="eyebrow">Pure by nature. Perfected by Himspring.</p>
          <h1>
            <span className="line-1">Something Pure</span>
            <span className="line-2">Is Coming Soon.</span>
          </h1>
          <p className="lede">
            Much like a masterpiece, true luxury cannot be rushed. Sourced from
            remote peaks and naturally balanced over time, Himspring is not
            manufactured it is collected for the very few.
          </p>

          <SignupForm />
        </section>

        {/* FEATURES */}
        <section className="features" aria-label="Why Himspring">
          <div className="feat">
            <div className="feat__icon">
              <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                <path d="M27.6343,26,17.7888,5.1055a2,2,0,0,0-3.5879.021L4.3657,26H2v2H30V26ZM15.99,5.979,20.9473,16.5,19,17.7979l-3-2-3,2-1.9551-1.3033ZM10.1846,18.3247,13,20.2021l3-2,3,2,2.8091-1.873L25.4233,26H6.5752Z" />
              </svg>
            </div>
            <h3 className="feat__title">
              Sourced from<br />the Himalayas
            </h3>
            <p className="feat__copy">
              Naturally filtered through ancient minerals for unmatched purity.
            </p>
          </div>
          <div className="feat">
            <div className="feat__icon">
              <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                <path d="M12,30H9V28h3V15.5664L8.4854,13.4575l1.0292-1.7148,3.5147,2.1084A2.0115,2.0115,0,0,1,14,15.5664V28A2.0023,2.0023,0,0,1,12,30Z" />
                <path d="M22,30H19a2.0024,2.0024,0,0,1-2-2V17h6a4.0008,4.0008,0,0,0,3.981-4.396A4.1489,4.1489,0,0,0,22.7853,9H21.2016L21.025,8.221C20.452,5.6961,18.0308,4,15,4A6.02,6.02,0,0,0,9.5585,7.4859L9.25,8.1531l-.863-.1143A2.771,2.771,0,0,0,8,8a4,4,0,1,0,0,8v2A6,6,0,1,1,8,6c.0264,0,.0525,0,.0786.001A8.0271,8.0271,0,0,1,15,2c3.6788,0,6.6923,1.9776,7.7516,5h.0337a6.1641,6.1641,0,0,1,6.1872,5.4141A6.0011,6.0011,0,0,1,23,19l-4,0v9h3Z" />
              </svg>
            </div>
            <h3 className="feat__title">
              Sustainable<br />by Nature
            </h3>
            <p className="feat__copy">
              Eco-conscious production for a better tomorrow.
            </p>
          </div>
          <div className="feat">
            <div className="feat__icon">
              <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                <path d="M27.2314,23.6182,20,13.6748V4h2V2H10V4h2v9.6748L4.7686,23.6182A4.0183,4.0183,0,0,0,8.0186,30H23.9814a4.0183,4.0183,0,0,0,3.25-6.3818ZM14,14.3252V4h4V14.3252L20.6728,18H11.3272ZM23.9814,28H8.0186a2.0192,2.0192,0,0,1-1.6329-3.2061L9.8726,20H22.1274l3.4869,4.7939A2.0192,2.0192,0,0,1,23.9814,28Z" />
              </svg>
            </div>
            <h3 className="feat__title">
              Naturally Rich<br />in Minerals
            </h3>
            <p className="feat__copy">
              Essential electrolytes for daily energy and vitality.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer__brand">
            <div className="name"><span className="wm-italic">HIM</span>SPRING</div>
            <div className="tag">Purity for the world&apos;s elite.</div>
          </div>
          <div className="footer__copy">
            © 2026 Himspring. All rights reserved.
          </div>
          <div className="footer__legal">
            <a href="#">Privacy Policy</a>
            <span>|</span>
            <a href="#">Terms of Use</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
