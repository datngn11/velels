"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect, useState, useRef } from "react";
import { siteConfig } from "@/lib/config";
import * as Dialog from "@radix-ui/react-dialog";
import { LocaleSwitcher } from "./LocaleSwitcher";
import Image from "next/image";
import { getAssetPath } from "@/lib/utils/assetPath";

export function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalogueOpen, setCatalogueOpen] = useState(true);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDesktopDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDesktopDropdownOpen(false);
    }, 150);
  };

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
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 md:py-2 w-full max-w-[1440px] mx-auto">
          {/* Left: Nav links (desktop only) */}
          <div className="hidden md:flex items-center gap-8 flex-1">
            {/* Catalogue Dropdown Trigger & Panel */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/catalog"
                className="text-nav-link text-primary transition-colors duration-300 hover-underline-anim py-4"
              >
                {t("catalogue")}
              </Link>

              {/* Desktop Flyout Dropdown */}
              <div
                className={`absolute top-full left-0 w-64 bg-surface-container-lowest/95 backdrop-blur-xl border border-outline-variant/30 shadow-xl p-6 flex flex-col gap-4 transition-all duration-300 origin-top-left ${
                  desktopDropdownOpen
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <Link
                  href="/catalog?category=one-piece"
                  onClick={() => setDesktopDropdownOpen(false)}
                  className="text-label-sm text-secondary hover:text-primary transition-colors duration-300 hover-underline-anim w-fit capitalize"
                >
                  {t("onePiece")}
                </Link>
                <Link
                  href="/catalog?category=two-piece"
                  onClick={() => setDesktopDropdownOpen(false)}
                  className="text-label-sm text-secondary hover:text-primary transition-colors duration-300 hover-underline-anim w-fit capitalize"
                >
                  {t("twoPiece")}
                </Link>
                <Link
                  href="/catalog?category=dresses"
                  onClick={() => setDesktopDropdownOpen(false)}
                  className="text-label-sm text-secondary hover:text-primary transition-colors duration-300 hover-underline-anim w-fit capitalize"
                >
                  {t("dresses")}
                </Link>
              </div>
            </div>
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

          {/* Center: Logo */}
          <Link
            href="/"
            className="z-50 hover:opacity-80 transition-opacity flex items-center justify-center"
          >
            <Image
              src={getAssetPath("/logo_black.png")}
              alt="VELÉLS"
              width={256}
              height={64}
              className="h-16 w-auto object-contain"
              priority
            />
          </Link>

          {/* Right: Instagram */}
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
        <Dialog.Content className="fixed top-0 left-0 bottom-0 w-[80%] max-w-[360px] bg-surface-container-lowest z-55 shadow-2xl p-8 flex flex-col justify-between animate-drawer-show md:hidden overflow-y-auto">
          <Dialog.Title className="sr-only">Menu</Dialog.Title>
          <Dialog.Description className="sr-only">
            Mobile navigation links
          </Dialog.Description>
          <div>
            {/* Drawer Header */}
            <div className="flex justify-between items-center mb-12">
              <span className="text-heading-md text-primary">VELÉLS</span>
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
            <div className="flex flex-col gap-6">
              {/* Catalogue Accordion */}
              <div className="flex flex-col">
                <button
                  onClick={() => setCatalogueOpen(!catalogueOpen)}
                  className="flex items-center justify-between w-full text-nav-link-lg text-primary font-semibold py-2 hover:opacity-75 transition-opacity text-left cursor-pointer"
                >
                  <span>{t("catalogue")}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className={`transition-transform duration-300 ${
                      catalogueOpen ? "rotate-180" : ""
                    }`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {/* Subcategories Accordion Content */}
                <div
                  className={`flex flex-col gap-4 pl-4 overflow-hidden transition-all duration-300 ${
                    catalogueOpen
                      ? "max-h-48 pt-3 pb-2 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <Link
                    href="/catalog?category=one-piece"
                    onClick={() => setMenuOpen(false)}
                    className="text-body-md text-secondary hover:text-primary transition-colors capitalize"
                  >
                    {t("onePiece")}
                  </Link>
                  <Link
                    href="/catalog?category=two-piece"
                    onClick={() => setMenuOpen(false)}
                    className="text-body-md text-secondary hover:text-primary transition-colors capitalize"
                  >
                    {t("twoPiece")}
                  </Link>
                  <Link
                    href="/catalog?category=dresses"
                    onClick={() => setMenuOpen(false)}
                    className="text-body-md text-secondary hover:text-primary transition-colors capitalize"
                  >
                    {t("dresses")}
                  </Link>
                </div>
              </div>

              {/* About Us Link */}
              <Link
                href="/info/about"
                onClick={() => setMenuOpen(false)}
                className="text-nav-link-lg text-primary font-semibold hover:opacity-75 transition-opacity"
              >
                {t("about")}
              </Link>
            </div>
          </div>

          {/* Drawer Footer: Language Selector */}
          <div className="border-t border-outline-variant/30 pt-6">
            <LocaleSwitcher />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
