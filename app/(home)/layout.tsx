import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./home.css";

/* Gotham, self-hosted from the supplied files and subset to Latin plus
   typographic punctuation: 32KB for all three faces against ~300KB of source
   OTF. Brand book p.19 calls for Book and Bold Italic; Medium is included to
   carry the letterspaced labels.

   Declared here rather than in CSS so Next fingerprints and preloads the files,
   and so the family name can never drift out of sync with the @font-face rules. */
const gotham = localFont({
  src: [
    { path: "./fonts/gotham-book.woff2", weight: "400", style: "normal" },
    { path: "./fonts/gotham-medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/gotham-bolditalic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-gotham",
  display: "swap",
});

/* Devasia, the display face — headings only.

   Two of the five supplied weights. Light and Regular are what a display face
   set at 92px actually needs; Bold, Thin and Round stay in public/devasia/
   unloaded rather than costing every visitor a download for a weight nothing
   sets. Adding one is a line here plus a rule that uses it.

   Thin and Bold were briefly loaded here to give the hero's pressure effect a
   weight ramp to step through, since Devasia has no variable axis. They are
   gone again: four discrete cuts snap between faces as the pointer moves, and
   no transition smooths that because there is nothing in between to render.
   PressureText gets its weight from a continuously interpolated stroke instead,
   which needs no extra file.

   Served as OTF rather than subset WOFF2 like Gotham, because these files are
   already 21KB each and there is no woff2 toolchain on this machine. Worth
   revisiting at build time — WOFF2 would take them to roughly 12KB — but not
   worth blocking the typography on. */
const devasia = localFont({
  src: [
    { path: "./fonts/Devasia-Light.otf", weight: "300", style: "normal" },
    { path: "./fonts/Devasia-Regular.otf", weight: "400", style: "normal" },
  ],
  variable: "--font-devasia",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Himspring — Natural Himalayan Spring Water",
  description:
    "Himspring rises from an ancient spring in the Shivalik foothills of the Himalaya, bottled at source in its purest form.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Himspring — Natural Himalayan Spring Water",
    description: "Untouched. Untamed. Bottled at the source.",
    url: "/",
    siteName: "Himspring",
    images: ["/assets/og-himspring.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Himspring — Natural Himalayan Spring Water",
    description: "Untouched. Untamed. Bottled at the source.",
  },
};

export default function HomeLayout({ children }: { children: ReactNode }) {
  return <div className={`hs-root ${gotham.variable} ${devasia.variable}`}>{children}</div>;
}
