import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "../components/Reveal";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { AWAY_SECTION_LINKS } from "../lib/content";
import { listPosts } from "../lib/posts";
import PostCard from "./PostCard";
import "../internal.css";
import "./blog.css";

/* The index is read fresh after an editor publishes a post. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal · Notes from the Source | Himspring",
  description:
    "Writing from Himspring on water, altitude, provenance, and the craft of bottling at the source.",
  alternates: { canonical: "/blog" },
};

/* The posts come from Supabase without a list cache, so a post published in the
   editor is visible straight away without a deploy. */
export default async function BlogIndexPage() {
  const posts = await listPosts();

  return (
    <div className="hsi">
      <a className="hs-skip" href="#main">
        Skip to content
      </a>

      <SiteNav links={AWAY_SECTION_LINKS} origin="/" />

      <main id="main">
        <section className="hsi-hero hsi-hero--short">
          <div className="hsi-hero__scene">
            <Image
              src="/assets/experience-lake.jpg"
              alt="Still glacial lake beneath Himalayan peaks"
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="hsi-hero__veil" aria-hidden="true" />
          <div className="hsi-hero__inner">
            <Reveal as="p" className="hs-eyebrow">
              The Journal
            </Reveal>
            <Reveal as="h1" className="hsi-hero__title" delay={80}>
              Notes from the source
            </Reveal>
            <Reveal as="p" className="hsi-hero__lede" delay={160}>
              Writing on water and altitude — what the mountain does to a drop before we ever
              reach it, and what it takes to bring it down unchanged.
            </Reveal>
          </div>
        </section>

        <section className="hs-band hsi-band hsi-band--snow" aria-labelledby="journal-index">
          <div className="hs-shell">
            <h2 id="journal-index" className="hs-vh">
              All posts
            </h2>

            {posts.length === 0 ? (
              <p className="hs-body hsb-empty">
                The first entry is being written. Come back shortly.
              </p>
            ) : (
              <ul className="hsb-list">
                {posts.map((post, index) => (
                  <PostCard key={post.slug} post={post} delay={index * 60} />
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
