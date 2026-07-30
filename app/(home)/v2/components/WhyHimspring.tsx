import { PURITY_PILLARS } from "../../lib/content";
import PurityIcon from "../../components/PurityIcon";
import Reveal from "../../components/Reveal";

/* Why Himspring — inside [03], under the drifting rail.

   A block rather than a section, and not its own section anywhere: [02] holds Our
   Story and [03] holds this, which is the structure asked for. It briefly had a
   section of its own between the two, and briefly sat inside [02]'s rise beat as a
   four-across bar; neither is where it belongs.

   It cannot go in [03]'s own copy plate, which is the obvious first thought. That
   plate clears itself 1500ms after arrival — right for a caption introducing a
   gallery, fatal for four claims someone is meant to read. So the rail keeps its
   frame and this sits below it, in the flow, on white, permanent.

   Nothing here is new copy. PURITY_PILLARS and PurityIcon already
   existed for the previous design's purity section, still live at /v1: four
   written claims and four line icons on a 64x64 grid. Writing a fresh set would
   have meant inventing brand claims nobody approved, and the approved ones were
   sitting in lib/content.ts unused by this page. The heading is the section's own
   name for the same reason — an earlier pass had a display line here that I had
   written, and a section headline is still brand voice.

   What is deliberately NOT reused is components/Purity.tsx, which renders this
   same data as spokes around a bottle on a masked disc with a halo plate. That
   belongs to the navy palette and centred-rig composition of the page it was
   built for; dropping it in would import a different design generation, the same
   mismatch that took the About column out of the footer. */

export default function WhyHimspring() {
  return (
    <div className="hsv-why" id="purity">
      {/* The story's paragraphs were briefly here, when Our Story was split
          across two sections. They are back in [02] where the whole story now
          lives, so this block is the four claims and nothing else. */}
      <Reveal as="h2" className="hsv-why__h">
        Why Himspring
      </Reveal>

      <ol className="hsv-why__grid">
        {PURITY_PILLARS.map((pillar, i) => (
          /* The index is the numeral, and it is content rather than decoration —
             an ordered list is what four numbered claims are, so the number comes
             off the list and is not typed into each cell. Drawn by ::before on the
             <li> so the digits cannot be selected as part of the title. */
          <Reveal as="li" className="hsv-why__cell" key={pillar.icon} delay={120 + i * 80}>
            <span className="hsv-why__icon" aria-hidden="true">
              <PurityIcon name={pillar.icon} />
            </span>
            <h3 className="hsv-why__t">
              {/* The title arrives split across two lines, because the break is
                  content in lib/content.ts rather than a <br> in a component.
                  Joined with a space: a quarter of a wide screen and the whole
                  width of a phone are both wider than the authored break, which
                  would be fighting the measure rather than setting it. */}
              {pillar.title.join(" ")}
            </h3>
            <p className="hsv-why__b">{pillar.body}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
