import Contact from "./components/Contact";
import SiteFooter from "./components/SiteFooter";
import SiteNav from "./components/SiteNav";
import Detail from "./v2/components/Detail";
import Family from "./v2/components/Family";
import Founders from "./v2/components/Founders";
import HeroV2 from "./v2/components/HeroV2";
import InAction from "./v2/components/InAction";
import Intro from "./v2/components/Intro";
import Journal from "./v2/components/Journal";
import Outro from "./v2/components/Outro";
import { listPosts, type PostSummary } from "./lib/posts";
import "./v2/deck.css";
/* The journal band renders /blog's cards, so it needs /blog's card rules.
   Imported after deck.css, and everything in it is prefixed hsb- — the only
   names it could collide with are its own. */
import "./blog/blog.css";

/* The journal list is read fresh after an editor publishes a post. */
export const dynamic = "force-dynamic";

/* The homepage.

   This is the Gluglu-structured page that was built and reviewed at /v2. It
   stood parallel to the old homepage while it was a layout study with a drawn
   placeholder where the product renders go; the renders landed, the structure
   was approved, and it is the site now. The previous homepage is at /v1 — see
   the note there for why it was archived rather than deleted.

   The components still live under ./v2/ and are imported from there. That name
   has stopped describing anything true, but renaming the directory means
   touching every import in twenty files and every path in a 1400-line
   stylesheet for no behavioural gain, so it is left as a rename to do
   deliberately rather than as a side effect of shipping. /v2 itself now
   redirects here, so there is one URL for this page and not two.

   Metadata is inherited from app/(home)/layout.tsx rather than declared again.
   The study overrode it with a "layout study" title and robots: noindex, both
   of which had to come off — this is the page that should be found. */

/* Hidden for now, not removed.

   Both components are untouched and still imported, so bringing either back is
   flipping its flag here — no markup to restore and no CSS to un-comment. Not
   `display: none` either: these are gated before render, so their plates and
   product shots are never requested at all.

   One consequence worth knowing. Detail owns id="source". That anchor used to
   be in the nav's section list and pointed at nothing while this was false;
   SECTION_LINKS now names the four sections this page actually renders, so
   turning Detail back on means adding "The Source" back to that list. */
const SHOW_ANALYSIS = false;

/* The journal band's posts. Caught rather than thrown: lib/posts raises on a
   non-200, and the homepage is the last page on the site that should go down
   because the blog database is having a moment. No posts is a state this page
   already handles — it renders no journal band — so an outage degrades to the
   page as it was before the band existed. */
async function latestPosts(): Promise<PostSummary[]> {
  try {
    return await listPosts();
  } catch (error) {
    console.error("homepage journal:", error);
    return [];
  }
}

export default async function HomePage() {
  const posts = await latestPosts();

  return (
    <>
      <a className="hs-skip" href="#main">
        Skip to content
      </a>

      <SiteNav />

      <main id="main" className="hsv">
        <HeroV2 />
        {/* Intro now carries the formats beat too: the two bottles rise into the
            frame the landscape takes over, which only reads as one gesture if
            no section boundary falls between them. */}
        <Intro />
        {/* Himspring in Action, rebuilt from the live-site branch's journey
            rail. Placed between the formats beat that closes Intro and the
            sizes that open Family: both of those are pinned, full-bleed and
            scrub-driven, and this one drifts on its own clock. Between them it
            gives the eye somewhere to rest that is not another takeover. */}
        <InAction />
        <Family />
        {/* After the sizes and before the hillside. The product argument is
            finished by the time this lands, and the page has spent five sections
            on water, glass and landscape without a person in it — this is where
            somebody can be introduced without interrupting anything. It is also
            the second unpinned section on the page, sitting between two that are
            pinned, for the same reason InAction does. */}
        <Founders />
        {SHOW_ANALYSIS ? <Detail /> : null}
        <Outro />
        <Journal posts={posts} />
        <Contact />
      </main>

      <SiteFooter />
    </>
  );
}
