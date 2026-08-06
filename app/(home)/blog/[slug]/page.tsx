import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "../../components/Reveal";
import SiteFooter from "../../components/SiteFooter";
import SiteNav from "../../components/SiteNav";
import { AWAY_SECTION_LINKS } from "../../lib/content";
import { formatDate, getPost } from "../../lib/posts";
import "../../internal.css";
import "../blog.css";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return { title: "Not found | Himspring" };

  return {
    title: `${post.title} · Journal | Himspring`,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      url: `/blog/${post.slug}`,
      publishedTime: post.published_at,
      images: post.cover_url ? [post.cover_url] : undefined,
    },
  };
}

/* An unknown slug and a draft are the same answer here: the row-level security
   policy hands this key nothing but published posts, so a draft simply does not
   exist as far as the site is concerned. */
export default async function PostPage({ params }: Params) {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  return (
    <div className="hsi">
      <a className="hs-skip" href="#main">
        Skip to content
      </a>

      <SiteNav links={AWAY_SECTION_LINKS} origin="/" />

      <main id="main">
        <section className="hsi-hero hsi-hero--short">
          {post.cover_url ? (
            <div className="hsi-hero__scene">
              <Image
                src={post.cover_url}
                alt={post.cover_alt ?? ""}
                fill
                priority
                sizes="100vw"
              />
            </div>
          ) : null}
          <div className="hsi-hero__veil" aria-hidden="true" />
          <div className="hsi-hero__inner">
            <Reveal as="p" className="hs-eyebrow">
              <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            </Reveal>
            <Reveal as="h1" className="hsi-hero__title" delay={80}>
              {post.title}
            </Reveal>
            {post.excerpt ? (
              <Reveal as="p" className="hsi-hero__lede" delay={160}>
                {post.excerpt}
              </Reveal>
            ) : null}
          </div>
        </section>

        <section className="hs-band hsi-band hsi-band--snow">
          <div className="hs-shell">
            {/* The column already holds HTML: /admin writes it with TipTap, which
                parses everything typed or pasted into its own schema, and only a
                named editor can write the column at all. See RichText.tsx. */}
            <article className="hsb-article" dangerouslySetInnerHTML={{ __html: post.body }} />
            <p className="hsb-back">
              <Link href="/blog">← All journal entries</Link>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
