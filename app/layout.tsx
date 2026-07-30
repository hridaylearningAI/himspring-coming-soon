import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import type { ReactNode } from "react";

/* Root layout is deliberately bare. Two designs live in this app and they share
   nothing but the document itself:

     app/(home)   — the current site. Times New Roman + subsetted Gotham, its own
                    stylesheet, no intro overlay.
     app/(legacy) — the pre-redesign site. Tinos + the full Gotham OTF family,
                    globals.css, and the cloud intro overlay.

   Each route group brings its own fonts and CSS, so neither pays for the other's
   payload. Anything global belongs here and nowhere else. */

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://himspring.com"),
  title: "Himspring · Natural Himalayan Spring Water",
  description:
    "Himspring rises from an ancient spring at 3,200 metres in the Himalaya, bottled at source in its purest form.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
