import type { Metadata } from "next";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { AWAY_SECTION_LINKS } from "../lib/content";
import BottleStage from "./BottleStage";
import "../internal.css";

export const metadata: Metadata = {
  title: "Sparkling Bottle · 3D Study | Himspring",
  description: "Procedural Three.js study of the Himspring Sparkling glass bottle and navy cap.",
  alternates: { canonical: "/bottle" },
  robots: { index: false, follow: false },
};

export default function BottlePage() {
  return (
    <div className="hsi hsi--bottle">
      <a className="hs-skip" href="#main">
        Skip to content
      </a>

      <SiteNav links={AWAY_SECTION_LINKS} origin="/" />

      <main id="main" className="hsv-bottle-page">
        <header className="hsv-bottle-page__head">
          <p className="hs-eyebrow">Sparkling · 3D study</p>
          <h1 className="hsv-bottle-page__title">The bottle</h1>
          <p className="hsv-bottle-page__lede">
            Drag to turn. Cap and silhouette only — label comes later.
          </p>
        </header>
        <BottleStage />
      </main>

      <SiteFooter />
    </div>
  );
}
