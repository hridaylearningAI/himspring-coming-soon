import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
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
      <body className={`${montserrat.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}
