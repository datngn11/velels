import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Bodoni_Moda, Inter, Cormorant_Garamond } from "next/font/google";
import { SmoothScrollHandler } from "@/components/ui/SmoothScrollHandler";
import { shouldAllowIndexing } from "@/lib/seo/indexing";
import "./globals.css";

// Declared at the root so every route inherits it — including `/`, which is a
// client-side redirect to `/uk` outside the `[locale]` tree, and the 404.
export const metadata: Metadata = {
  robots: shouldAllowIndexing()
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

const bodoniModa = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bodoni-moda",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={`${bodoniModa.variable} ${inter.variable} ${cormorant.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <SmoothScrollHandler />
        <div className="scroll-progress-bar" />
        {children}
      </body>
    </html>
  );
}
