"use client";

import { createClient, type Session } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { formatDate } from "../lib/posts";
import RichText from "./RichText";

/* The journal editor: sign in, write, publish. It runs entirely in the browser
   against Supabase — no API routes, because there is nothing for one to do that
   row-level security is not already doing. The publishable key below is the same
   one the public site reads with; what separates a visitor from an editor is the
   session, and the policies in supabase/schema.sql are what enforce it.

   Editors are created by hand in Dashboard → Authentication → Users. There is
   deliberately no signup form: this is a two-person surface, and an open one
   would be a way in. */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "",
);

type Draft = {
  id: string | null;
  slug: string;
  title: string;
  excerpt: string;
  cover_url: string;
  cover_alt: string;
  body: string;
  published_at: string | null;
};

/* What comes back from the table: the same shape with a real id, and nulls
   where the editor left a field empty. */
type Row = Omit<Draft, "id" | "excerpt" | "cover_url" | "cover_alt"> & {
  id: string;
  excerpt: string | null;
  cover_url: string | null;
  cover_alt: string | null;
};

const BLANK: Draft = {
  id: null,
  slug: "",
  title: "",
  excerpt: "",
  cover_url: "",
  cover_alt: "",
  body: "",
  published_at: null,
};

/* Postgres stores an empty excerpt as null; a form field cannot be null without
   React calling it uncontrolled. This is the one seam between the two. */
const toDraft = (row: Row): Draft => ({
  ...row,
  excerpt: row.excerpt ?? "",
  cover_url: row.cover_url ?? "",
  cover_alt: row.cover_alt ?? "",
  body: row.body ?? "",
});

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

export default function Editor() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [posts, setPosts] = useState<Row[]>([]);
  /* The whole of the screen's mode. null is the grid of posts; a draft is the
     form. There is no second `view` flag to keep in step with it, because the
     thing being edited and the fact that something is being edited are the same
     fact. */
  const [draft, setDraft] = useState<Draft | null>(null);
  const [status, setStatus] = useState("");
  /* An upload is in flight. Shared by the cover and the body's image button,
     because both go through upload() and both are lost the same way. */
  const [busy, setBusy] = useState(false);
  /* The chosen file, shown from local memory while it travels. Held apart from
     draft.cover_url so a blob: URL — meaningless to every other browser — can
     never be what gets saved. */
  const [pendingCover, setPendingCover] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  /* Signed in, this select returns drafts too — same query, different policy
     branch. That is the whole difference between this screen and /blog. */
  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setStatus(error.message);
    else setPosts((data ?? []) as Row[]);
  }, []);

  useEffect(() => {
    if (session) void load();
  }, [session, load]);

  if (checking) return <main className="ad" />;
  if (!session) return <SignIn />;

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => (current ? { ...current, [key]: value } : current));

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    setStatus("Saving…");

    const slug = draft.slug.trim() || slugify(draft.title);
    const record = {
      ...draft,
      slug,
      excerpt: draft.excerpt.trim() || null,
      cover_url: draft.cover_url.trim() || null,
      cover_alt: draft.cover_alt.trim() || null,
      updated_at: new Date().toISOString(),
    };
    /* A new post has no id yet, and sending id: null would ask Postgres to
       write a null primary key rather than take its default. */
    if (!record.id) delete (record as { id?: string | null }).id;

    const { error } = await supabase.from("posts").upsert(record).select();
    if (error) return setStatus(error.message);

    /* Back to the grid on success, so the saved post is visible in the state it
       was saved in rather than the form claiming it and nothing confirming it. */
    setStatus("Saved. The site picks it up within a minute.");
    setDraft(null);
    await load();
  };

  /* One uploader for both the cover and anything dropped into the body, because
     they are the same operation — put a file in the bucket, get a URL back. The
     caller decides what to do with the URL.

     `busy` is not decoration. A megabyte of photograph takes seconds, and every
     way out of this form — Save, Cancel, ← All posts — sets draft to null, at
     which point the URL this returns has nowhere to land and is dropped without
     a word. Locking those three for the duration is what makes that
     unreachable; the object URL below is what makes the wait legible. */
  const upload = async (file: File): Promise<string | null> => {
    setBusy(true);
    setStatus("Uploading…");
    try {
      /* Timestamped name: uploading a second image should not silently replace
         an earlier one while a cached page still points at it. */
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]+/g, "-")}`;
      const { error } = await supabase.storage.from("blog").upload(path, file);
      if (error) {
        setStatus(error.message);
        return null;
      }

      const { data } = supabase.storage.from("blog").getPublicUrl(path);
      setStatus("Image uploaded.");
      return data.publicUrl;
    } finally {
      setBusy(false);
    }
  };

  const remove = async (post: Row) => {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    setStatus(error ? error.message : "Deleted.");
    if (draft?.id === post.id) setDraft(null);
    await load();
  };

  const togglePublished = async (post: Row) => {
    const published_at = post.published_at ? null : new Date().toISOString();
    const { error } = await supabase.from("posts").update({ published_at }).eq("id", post.id);
    setStatus(error ? error.message : published_at ? "Published." : "Moved to draft.");
    await load();
  };

  return (
    <main className="ad">
      <header className="ad__bar">
        {draft ? (
          <button
            type="button"
            className="ad__back"
            disabled={busy}
            onClick={() => setDraft(null)}
          >
            ← All posts
          </button>
        ) : null}
        <h1>{draft ? (draft.id ? "Edit post" : "New post") : "Journal"}</h1>
        <span className="ad__who">{session.user.email}</span>
        <button type="button" onClick={() => supabase.auth.signOut()}>
          Sign out
        </button>
      </header>

      {!draft ? (
        <section className="ad__index">
          <div className="ad__indexhead">
            <h2>
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </h2>
            <button type="button" className="ad__new" onClick={() => setDraft(BLANK)}>
              New post
            </button>
          </div>

          {posts.length === 0 ? (
            <p className="ad__none">Nothing written yet. Start with New post.</p>
          ) : (
            <ul className="ad__cards">
              {posts.map((post) => (
                <li className="ad__card" key={post.id}>
                  {/* The card is the button. Delete sits outside it rather than
                      inside — nesting one button in another is invalid HTML and
                      the browser resolves it by dropping the inner one. */}
                  <button
                    type="button"
                    className="ad__cardface"
                    onClick={() => setDraft(toDraft(post))}
                  >
                    <span className="ad__thumb">
                      {post.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element -- an
                        // uploaded URL in an admin screen; next/image would add an
                        // optimisation round trip for nothing.
                        <img src={post.cover_url} alt="" />
                      ) : (
                        <span className="ad__thumb--empty">No cover</span>
                      )}
                    </span>
                    <span className={`ad__pill${post.published_at ? " is-live" : ""}`}>
                      {post.published_at ? "Published" : "Draft"}
                    </span>
                    <span className="ad__cardtitle">{post.title || "Untitled"}</span>
                    {post.excerpt ? <span className="ad__cardbody">{post.excerpt}</span> : null}
                  </button>
                  <div className="ad__cardactions">
                    <button
                      type="button"
                      className={`ad__publish${post.published_at ? " is-live" : ""}`}
                      onClick={() => void togglePublished(post)}
                    >
                      {post.published_at ? "Unpublish" : "Publish"}
                    </button>
                    <button type="button" className="ad__del" onClick={() => void remove(post)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {status ? <p className="ad__status">{status}</p> : null}
        </section>
      ) : (
        <div className="ad__split">
        {/* Keyed, so opening a different post remounts the form. TipTap takes
            its content once, on mount; without this, switching posts would leave
            the previous body in the editor. */}
        <form className="ad__form" onSubmit={save} key={draft.id ?? "new"}>
          <label>
            Title
            <input
              value={draft.title}
              required
              onChange={(event) => set("title", event.target.value)}
              onBlur={() => {
                if (!draft.slug) set("slug", slugify(draft.title));
              }}
            />
          </label>

          <label>
            Slug <small>/blog/{draft.slug || slugify(draft.title) || "…"}</small>
            <input value={draft.slug} onChange={(event) => set("slug", event.target.value)} />
          </label>

          <label className="ad__check">
            <input
              type="checkbox"
              checked={Boolean(draft.published_at)}
              onChange={(event) =>
                set("published_at", event.target.checked ? new Date().toISOString() : null)
              }
            />
            Published <small>show this post on the journal and homepage</small>
          </label>

          <label>
            Excerpt <small>one or two lines, shown on the index and in link previews</small>
            <textarea
              rows={2}
              value={draft.excerpt}
              onChange={(event) => set("excerpt", event.target.value)}
            />
          </label>

          <label>
            Cover image
            <input
              type="file"
              accept="image/*"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                /* Straight from disk, so the photograph is on screen before the
                   first byte leaves. */
                const local = URL.createObjectURL(file);
                setPendingCover(local);
                const url = await upload(file);
                setPendingCover(null);
                URL.revokeObjectURL(local);
                if (url) set("cover_url", url);
              }}
            />
          </label>
          {(pendingCover ?? draft.cover_url) ? (
            // eslint-disable-next-line @next/next/no-img-element -- a preview of an
            // arbitrary uploaded URL, not a served asset; next/image would only add
            // an optimisation round trip inside an admin screen.
            <img
              className={`ad__cover${pendingCover ? " is-uploading" : ""}`}
              src={pendingCover ?? draft.cover_url}
              alt=""
            />
          ) : null}

          <label>
            Cover description <small>for screen readers — describe the photograph</small>
            <input
              value={draft.cover_alt}
              onChange={(event) => set("cover_alt", event.target.value)}
            />
          </label>

          {/* Not wrapped in a <label>: the editable surface is a div, so there
              is nothing for a label to point at, and clicking the word would put
              the caret nowhere. */}
          <p className="ad__legend">Body</p>
          <RichText
            value={draft.body}
            onChange={(html) => set("body", html)}
            onUploadImage={upload}
          />

          <div className="ad__actions">
            <button type="submit" disabled={busy}>
              {busy ? "Uploading…" : draft.id ? "Update post" : "Create post"}
            </button>
            <button
              type="button"
              className="ad__ghost"
              disabled={busy}
              onClick={() => setDraft(null)}
            >
              Cancel
            </button>
            {draft.published_at && draft.id ? (
              <a href={`/blog/${draft.slug}`} target="_blank" rel="noreferrer">
                View
              </a>
            ) : null}
          </div>

          {status ? <p className="ad__status">{status}</p> : null}
        </form>

        <Preview draft={draft} />
        </div>
      )}
    </main>
  );
}

/* The preview is the page, not a picture of it: the body is the same HTML the
   post will render, inside the same .hsi-hero / .hsb-article rules blog.css and
   internal.css hand the real post, in the same two typefaces. What differs is
   scale — the hero is 56svh of screen on the site and a header on a panel here —
   and admin.css holds those handful of overrides in one block.

   With the body now edited in place, what this pane is for has narrowed to what
   the field beside it cannot show: the cover, the title over it, and how the
   excerpt reads as a standfirst. */
function Preview({ draft }: { draft: Draft }) {
  const date = draft.published_at ?? new Date().toISOString();

  return (
    <aside className="ad__preview">
      <p className="ad__previewhead">
        Preview
        <span>{draft.published_at ? "as published" : "as it would publish today"}</span>
      </p>

      <div className="ad__sheet hsi">
        <section className="hsi-hero hsi-hero--short">
          {draft.cover_url ? (
            <div className="hsi-hero__scene">
              {/* eslint-disable-next-line @next/next/no-img-element -- see the card grid */}
              <img src={draft.cover_url} alt="" />
            </div>
          ) : null}
          <div className="hsi-hero__veil" aria-hidden="true" />
          <div className="hsi-hero__inner">
            <p className="hs-eyebrow">{formatDate(date)}</p>
            <h1 className="hsi-hero__title">{draft.title || "Untitled"}</h1>
            {draft.excerpt ? <p className="hsi-hero__lede">{draft.excerpt}</p> : null}
          </div>
        </section>

        <section className="hs-band hsi-band hsi-band--snow">
          <div className="hs-shell">
            <article className="hsb-article" dangerouslySetInnerHTML={{ __html: draft.body }} />
          </div>
        </section>
      </div>
    </aside>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    const { error: failure } = await supabase.auth.signInWithPassword({ email, password });
    if (failure) setError(failure.message);
  };

  return (
    <main className="ad ad--gate">
      <form className="ad__gate" onSubmit={submit}>
        <h1>Journal</h1>
        <label>
          Email
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button type="submit">Sign in</button>
        {error ? <p className="ad__status">{error}</p> : null}
      </form>
    </main>
  );
}
