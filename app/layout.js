import { Tinos } from "next/font/google";
import localFont from "next/font/local";
import Intro from "./Intro";
import "./globals.css";

// Headings — Tinos is metrically identical to Times New Roman and renders the
// same on every device (incl. Linux/Android, which don't ship Times New Roman).
const times = Tinos({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-times",
  display: "swap",
});

// Body — real Gotham, loaded from the local .otf files in public/fonts/Gotham.
const gotham = localFont({
  src: [
    { path: "../public/fonts/Gotham/Gotham Light/Gotham Light.otf", weight: "300", style: "normal" },
    { path: "../public/fonts/Gotham/Gotham Book/Gotham Book.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/Gotham/Gotham Italic/Gotham Italic.otf", weight: "400", style: "italic" },
    { path: "../public/fonts/Gotham/Gotham Medium/Gotham Medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/Gotham/Gotham Bold/Gotham Bold.otf", weight: "600", style: "normal" },
  ],
  variable: "--font-gotham",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://himspring.com"
  ),
  title: "Himspring — Something Pure Is Coming Soon",
  description:
    "Himspring is born from the untouched purity of the Himalayas — crafted to bring balance, clarity, and life to every drop.",
  openGraph: {
    title: "Himspring — Something Pure Is Coming Soon",
    description: "Pure by nature. Perfected by Himspring.",
    images: ["/hero-poster.png"],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${gotham.variable} ${times.variable}`}>
        <Intro />
        {children}
      </body>
    </html>
  );
}
