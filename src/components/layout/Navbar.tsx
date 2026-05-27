"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/config";
import * as Dialog from "@radix-ui/react-dialog";

export function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
      <nav
        className={`fixed top-0 w-full z-50 border-b border-outline-variant/30 transition-all duration-300 ${
          scrolled
            ? "bg-surface-container-lowest/90 backdrop-blur-xl shadow-sm"
            : "bg-surface-container-lowest"
        }`}
        id="top-nav"
      >
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-6 w-full max-w-[1440px] mx-auto">
          {/* Left: Nav links (desktop only) */}
          <div className="hidden md:flex items-center gap-gutter flex-1">
            <Link
              href="/#collection"
              className="font-sans text-[13px] leading-[16px] tracking-[0.2em] uppercase text-primary transition-colors duration-300 hover-underline-anim"
            >
              {t("collection")}
            </Link>
            <span className="font-sans text-[13px] leading-[16px] tracking-[0.2em] uppercase text-secondary hover:text-primary transition-colors duration-300 cursor-pointer hover-underline-anim">
              {t("story")}
            </span>
          </div>

          {/* Mobile: Hamburger Button */}
          <div className="md:hidden flex items-center flex-1 justify-start">
            <Dialog.Trigger asChild>
              <button
                className="text-primary hover:opacity-70 transition-opacity cursor-pointer"
                aria-label="Open menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              </button>
            </Dialog.Trigger>
          </div>

          {/* Center: Logo (Responsive size & tracking) */}
          <Link
            href="/"
            className="font-serif text-[24px] md:text-[48px] leading-[32px] md:leading-[56px] tracking-[0.2em] md:tracking-[0.3em] uppercase text-primary shrink-0 hover:opacity-70 transition-opacity"
          >
            VELÉLS
          </Link>

          {/* Right: Locale switcher + bag */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Instagram"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Portal for mobile drawer overlays */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/45 z-50 animate-overlay-show md:hidden" />
        <Dialog.Content className="fixed top-0 left-0 bottom-0 w-[80%] max-w-[360px] bg-surface-container-lowest z-55 shadow-2xl p-8 flex flex-col justify-between animate-drawer-show md:hidden">
          <Dialog.Title className="sr-only">Menu</Dialog.Title>
          <Dialog.Description className="sr-only">Mobile navigation links</Dialog.Description>
          <div>
            {/* Drawer Header */}
            <div className="flex justify-between items-center mb-12">
              <span className="font-serif text-[24px] tracking-[0.2em] uppercase text-primary">
                VELÉLS
              </span>
              <Dialog.Close asChild>
                <button
                  className="text-primary hover:opacity-70 transition-opacity cursor-pointer"
                  aria-label="Close menu"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </Dialog.Close>
            </div>

            {/* Drawer Navigation Links */}
            <div className="flex flex-col gap-8">
              <Link
                href="/#collection"
                onClick={() => setMenuOpen(false)}
                className="font-sans text-[16px] leading-[24px] tracking-[0.2em] uppercase text-primary font-semibold hover:opacity-75 transition-opacity"
              >
                {t("collection")}
              </Link>
              <span
                onClick={() => {
                  setMenuOpen(false);
                  // Trigger smooth scroll to philosophy if needed
                  const el = document.getElementById("philosophy");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="font-sans text-[16px] leading-[24px] tracking-[0.2em] uppercase text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                {t("story")}
              </span>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="border-t border-outline-variant/30 pt-6">
            {/* LocaleSwitcher moved to global Footer */}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
