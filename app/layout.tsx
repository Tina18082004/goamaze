import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GoAmaze — Thoughtfully Curated Essentials",
  description:
    "Discover beautifully curated product collections for modern living. Handpicked essentials for your home, lifestyle, kitchen and beyond.",
  keywords: "curated products, home decor, lifestyle, affiliate, amazon picks",
  openGraph: {
    title: "GoAmaze — Thoughtfully Curated Essentials",
    description:
      "Discover beautifully curated product collections for modern living.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${poppins.variable} h-full`}
    >
      <body
        className="antialiased"
        style={{
          fontFamily: "var(--font-poppins, 'Poppins', sans-serif)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
