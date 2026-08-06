/* Reading posts. Plain fetch against PostgREST rather than @supabase/supabase-js,
   because on the server the only thing the client library would add here is a
   wrapper around the same request. The journal list deliberately bypasses the
   cache: publishing is an explicit admin action, so the public index and
   homepage should reflect it straight away rather than showing a stale list.

   No published filter in the query: the row-level security policy in
   supabase/schema.sql already returns nothing but live posts to this key, so a
   filter here would be a second copy of the rule that could drift from the one
   that actually enforces it.

   Nothing in this file may become server-only: /admin's preview imports
   formatDate, so a secret or a `server-only` marker added here would break that
   build rather than this one. Reads on the server, dates on both. */

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  cover_alt: string | null;
  body: string;
  published_at: string;
};

/* What a card needs and nothing else. Named because two places render one now —
   /blog and the homepage's journal band — and both take it through PostCard. */
export type PostSummary = Omit<Post, "id" | "body">;

const LIST_FIELDS = "slug,title,excerpt,cover_url,cover_alt,published_at";

async function query<T>(params: string, fresh = false): Promise<T[]> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/posts?${params}`;
  const res = await fetch(url, {
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "" },
    ...(fresh ? { cache: "no-store" } : { next: { revalidate: 60 } }),
  });
  if (!res.ok) throw new Error(`posts query failed (${res.status}): ${await res.text()}`);
  return res.json();
}

export const listPosts = () =>
  query<PostSummary>(`select=${LIST_FIELDS}&order=published_at.desc`, true);

export async function getPost(slug: string): Promise<Post | null> {
  const rows = await query<Post>(`select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return rows[0] ?? null;
}

/* Dates read as "12 March 2026" — the site writes no numerals-only dates
   anywhere else either. */
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
