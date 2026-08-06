import Image from "next/image";
import Link from "next/link";
import Reveal from "../components/Reveal";
import { formatDate, type PostSummary } from "../lib/posts";

/* One post as a card in a .hsb-list.

   Lives here rather than beside its two callers because the homepage's journal
   band and /blog's index are the same card — a plate on a fixed 4:3 shelf, a
   gold date, the title, the excerpt — and the moment they were two copies of
   this markup one of them would start lagging the other. The list around it is
   what differs, and that stays with each page. */

export default function PostCard({
  post,
  delay = 0,
}: {
  post: PostSummary;
  /* stagger within its list, in ms */
  delay?: number;
}) {
  return (
    <Reveal as="li" className="hsb-card" delay={delay}>
      <Link href={`/blog/${post.slug}`} className="hsb-card__link">
        <span className="hsb-card__shelf">
          {post.cover_url ? (
            <Image
              src={post.cover_url}
              alt={post.cover_alt ?? ""}
              fill
              sizes="(max-width: 860px) 100vw, 33vw"
            />
          ) : null}
        </span>
        <time className="hsb-card__date" dateTime={post.published_at}>
          {formatDate(post.published_at)}
        </time>
        <span className="hsb-card__title">{post.title}</span>
        {post.excerpt ? <span className="hsb-card__body">{post.excerpt}</span> : null}
      </Link>
    </Reveal>
  );
}
