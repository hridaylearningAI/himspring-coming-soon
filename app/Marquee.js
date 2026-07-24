const WORDS = ["Nature's Finest", "Himspring", "Natural Himalayan Water", "Every Sip Elevates"];

/* A single looping strip, doubled so the CSS translateX(-50%) loop has no
   seam. Pure CSS animation — no JS, no layout cost. */
export default function Marquee() {
  const items = (key) => (
    <div className="marquee__set" aria-hidden={key === "b" ? true : undefined}>
      {WORDS.map((w, i) => (
        <span className="marquee__item" key={`${key}-${w}`}>
          {w}
          <span className="marquee__dot">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee">
      <div className="marquee__track">
        {items("a")}
        {items("b")}
      </div>
    </div>
  );
}
