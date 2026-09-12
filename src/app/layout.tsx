import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Bodoni_Moda, Inter, Cormorant_Garamond } from "next/font/google";
import { SmoothScrollHandler } from "@/components/ui/SmoothScrollHandler";
import { shouldAllowIndexing } from "@/lib/seo/indexing";
import { routing } from "@/i18n/routing";
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

// Declared here rather than in `[locale]/layout.tsx` so that `/` and the 404 page
// are counted too. Absent id (local, previews) renders nothing.
//
// A plain tag, not `next/script`: its default `afterInteractive` injects the element
// client-side after hydration, so a visitor who leaves before hydration is uncounted.
// `async`, not `defer` — React only supports moving scripts that are async, and
// `defer` is documented as incompatible with streaming SSR.
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

// Corrects `lang` for the English tree. The attribute has to be static because this
// layout sits above `[locale]` and never learns which locale it is rendering; the
// script runs while the body is still parsing, so assistive technology reads the
// right value. Crawlers see the default, which is what `hreflang` is for.
const SET_LANG = `if(location.pathname.split("/")[1]==="en")document.documentElement.lang="en"`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={routing.defaultLocale}
      className={`${bodoniModa.variable} ${inter.variable} ${cormorant.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: SET_LANG }} />
        {umamiWebsiteId && (
          <script
            async
            src="https://cloud.umami.is/script.js"
            data-website-id={umamiWebsiteId}
            data-performance="true"
          />
        )}
        <SmoothScrollHandler />
        <div className="scroll-progress-bar" />
        {children}
      </body>
    </html>
  );
}
