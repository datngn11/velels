"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/config";

export function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
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
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[13px] leading-[16px] tracking-[0.2em] uppercase text-secondary hover:text-primary transition-colors duration-300 hover-underline-anim"
            >
              {t("ig")}
            </a>
          </div>

          {/* Mobile: Hamburger Button */}
          <div className="md:hidden flex items-center flex-1 justify-start">
            <button
              onClick={() => setMenuOpen(true)}
              className="text-primary hover:opacity-70 transition-opacity"
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
            <div className="hidden md:block">
              <LocaleSwitcher />
            </div>
            <button
              className="text-primary hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Shopping bag"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black/45 z-50 transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Drawer Panel */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[80%] max-w-[360px] bg-surface-container-lowest z-55 shadow-2xl p-8 flex flex-col justify-between transition-transform duration-300 ease-out md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Drawer Header */}
          <div className="flex justify-between items-center mb-12">
            <span className="font-serif text-[24px] tracking-[0.2em] uppercase text-primary">
              VELÉLS
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-primary hover:opacity-70 transition-opacity"
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
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="font-sans text-[16px] leading-[24px] tracking-[0.2em] uppercase text-secondary hover:text-primary transition-colors"
            >
              {t("ig")}
            </a>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-outline-variant/30 pt-6">
          <LocaleSwitcher />
        </div>
      </div>
    </>
  );
}
