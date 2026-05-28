import type { ReactNode } from "react";
import { Bodoni_Moda, Inter } from "next/font/google";
import { SmoothScrollHandler } from "@/components/ui/SmoothScrollHandler";
import "./globals.css";

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={`${bodoniModa.variable} ${inter.variable}`}
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
