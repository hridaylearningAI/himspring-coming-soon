import Reveal from "./Reveal";
import Scene from "./Scene";

/* [04] story — full-bleed spring basin, copy raked to the right behind a veil.

   As in the hero, the foreground ice bank is gone: it faked occlusion for a
   cut-out bottle and was cut from a plate that has since been replaced. */

export default function Story() {
  return (
    <section className="hs-story hs-stage hs-stage--right" aria-labelledby="story-t">
      <Scene className="hs-photo hs-story__scene" src="/assets/story-basin.jpg" alt="">
        {null}
      </Scene>
      <div className="hs-story__veil" aria-hidden="true" />

      <div className="hs-stage__grid">
        <div className="hs-stage__copy">
          <Reveal as="p" className="hs-eyebrow">
            Our story
          </Reveal>
          <Reveal as="h2" className="hs-h2" id="story-t" delay={80}>
            Born in silence.
            <br />
            Bottled with purpose.
          </Reveal>
          <Reveal
            as="p"
            className="hs-body hs-body--lead"
            delay={160}
            style={{ marginTop: "1.75rem" }}
          >
            Himspring begins in the Shivalik foothills, where ancient sandstone feeds a hidden
            spring untouched by time or civilisation.
          </Reveal>
          <Reveal as="p" className="hs-body" delay={220}>
            We bottle at the source to preserve what nature intended &mdash; crystal purity,
            natural minerals, and a story older than words.
          </Reveal>
          <Reveal className="hs-sign" delay={300}>
            <p className="hs-sign__name">Founder name</p>
            <p className="hs-sign__role">Founder</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
