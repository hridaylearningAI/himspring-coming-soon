import Reveal from "../../components/Reveal";
import PostCard from "../../blog/PostCard";
import type { PostSummary } from "../../lib/posts";

/* [08] journal — the latest writing, under the hillside.

   Placed after the return to the source and before the contact band, which is
   where the page stops making its argument and starts offering ways in: read
   further, or get in touch. Ahead of the hillside it would interrupt a product
   sequence that has been building since the hero.

   The cards are /blog's cards, through the same component, so the two indexes
   cannot drift. What this section owns is the frame around them: the band, the
   heading, and the fact that it shows three.

   Renders nothing at all when there is nothing published. An empty state is
   right on /blog, where a reader has asked for the journal and deserves an
   answer; on the homepage it would be a section announcing its own absence. */

/* Three, because .hsb-list is a three-column grid — a fourth would start a
   second row holding one card. */
const SHOWN = 3;

export default function Journal({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="hsv-journal" id="journal" aria-labelledby="hsv-journal-t">
      <div className="hs-shell">
        <div className="hsv-journal__head">
          <Reveal as="p" className="hs-eyebrow">
            Journal
          </Reveal>
          <Reveal as="h2" className="hsv-journal__h hsv-blur" id="hsv-journal-t" delay={90}>
            From the journal
          </Reveal>
        </div>

        <ul className="hsb-list">
          {posts.slice(0, SHOWN).map((post, index) => (
            <PostCard key={post.slug} post={post} delay={index * 90} />
          ))}
        </ul>

        {/* Only worth a door to the index when there is more behind it than the
            row above already shows. */}
        {posts.length > SHOWN ? (
          <Reveal className="hsv-journal__more" delay={260}>
            <a className="hs-btn" href="/blog">
              Read the journal
            </a>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
