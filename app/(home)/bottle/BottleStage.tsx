"use client";

import dynamic from "next/dynamic";

/* Isolates `ssr: false` — App Router forbids that flag on next/dynamic inside
   a Server Component, and the page needs to stay a Server Component for
   metadata. This thin client shell is the workaround. */

const BottleViewer = dynamic(() => import("../v2/components/BottleViewer"), {
  ssr: false,
  loading: () => <div className="hsv-bottle-stage hsv-bottle-stage--loading" aria-hidden="true" />,
});

export default function BottleStage() {
  return <BottleViewer />;
}
