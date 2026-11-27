import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Bodoni_Moda, Inter } from "next/font/google";
import { shouldAllowIndexing } from "@/lib/seo/indexing";
import { routing } from "@/i18n/routing";
import "./globals.css";

// Declared at the root so every route inherits it — including `/`, which is a
// client-side redirect to `/uk` outside the `[locale]` tree, and the 404.
export const metadata: Metadata = {
  robots: shouldAllowIndexing()
    ? {
        index: true,
        follow: true,
        // Allows a large image preview in web search, Images and Discover.
        // Discover's large card also needs a share image at least 1200px wide
        // and prefers landscape. Product covers are all portrait, and most are
        // narrower, until the landscape cards land (post-launch G4).
        "max-image-preview": "large",
      }
    : { index: false, follow: false },
};

// `subsets` picks only the files to preload. Every subset stays declared and
// loads when a page uses it, so dropping latin-ext here loses no character.
const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni-moda",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
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
      className={`${bodoniModa.variable} ${inter.variable}`}
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
        <div className="scroll-progress-bar" />
        {children}
      </body>
    </html>
  );
}
