import type { Metadata } from "next";
import BottleRig from "../components/BottleRig";
import Contact from "../components/Contact";
import Experience from "../components/Experience";
import Gallery from "../components/Gallery";
import Hero from "../components/Hero";
import Provenance from "../components/Provenance";
import Purity from "../components/Purity";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import Source from "../components/Source";
import Story from "../components/Story";
import Sustainability from "../components/Sustainability";
import { LEGACY_SECTION_LINKS } from "../lib/content";

/* The previous homepage, moved here when the deck took over `/`.

   Kept rather than deleted, and kept as a route rather than as commented-out
   markup, because it is the only thing that renders nine components — Hero,
   Provenance, Story, Source, Purity, Experience, Sustainability, Gallery and
   BottleRig — along with the Shivalik plate pass and the travelling bottle rig
   they were built around. Deleting the page would not delete any of that; it
   would just make all of it unreachable, which is the state code rots in.

   As a live route it stays honest: it type-checks with the rest of the app, it
   breaks loudly if a shared component changes under it, and going back to it is
   a matter of moving one file rather than reconstructing a page from git.

   It gets the legacy anchor set explicitly. The nav and footer both default to
   the homepage's sections now, and none of those ids exist here. */

export const metadata: Metadata = {
  title: "Himspring · previous homepage",
  alternates: { canonical: "/v1" },
  /* an archive, and not a second copy of the homepage for a crawler to weigh
     against the real one */
  robots: { index: false, follow: false },
};

export default function LegacyHomePage() {
  return (
    <>
      <a className="hs-skip" href="#main">
        Skip to content
      </a>

      <BottleRig />
      <SiteNav links={LEGACY_SECTION_LINKS} />

      <main id="main">
        <Hero />
        <Provenance />
        <Story />
        <Source />
        <Purity />
        <Experience />
        <Sustainability />
        <Gallery />
        <Contact />
      </main>

      <SiteFooter links={LEGACY_SECTION_LINKS} />
    </>
  );
}
