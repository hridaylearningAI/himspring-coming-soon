import type { Metadata } from "next";
import Editor from "./Editor";
/* The editor lives inside the (home) route group for one reason: the preview
   pane. That layout is what loads Gotham and Devasia and wraps the page in
   .hs-root, so the preview can render the article in the site's own type rather
   than an approximation of it. The two sheets below are the same ones /blog
   renders with — same rules, same result — and admin.css loads last so the
   tool's own chrome wins where the names would otherwise meet. */
import "../internal.css";
import "../blog/blog.css";
import "./admin.css";

/* The editor is a client component — it holds a session and talks to Supabase
   from the browser — so this server page exists for one reason: a client
   component cannot export metadata, and this route must tell crawlers to stay
   out. Nothing here is secret (the publishable key is public by design and RLS
   is what actually guards the table), but an admin screen in a search index is
   noise for everyone. */
export const metadata: Metadata = {
  title: "Journal editor · Himspring",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <Editor />;
}
