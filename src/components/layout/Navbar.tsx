"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/config";
import * as Dialog from "@radix-ui/react-dialog";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { LocaleSwitcher } from "./LocaleSwitcher";
import Image from "next/image";

// The NavigationMenu item value, shared by the Item and the focus handler.
const CATALOGUE_MENU = "catalogue";

export function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [navMenuValue, setNavMenuValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalogueOpen, setCatalogueOpen] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
      <nav
        className={`fixed top-0 w-full z-50 h-16 md:h-14 border-b border-outline-variant/30 transition-all duration-300 ${
          scrolled
            ? "bg-surface-container-lowest/90 backdrop-blur-xl shadow-sm"
            : "bg-surface-container-lowest"
        }`}
        id="top-nav"
      >
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-full w-full max-w-container mx-auto">
          {/* Left: Nav links (desktop only) */}
          <div className="hidden md:flex items-center gap-8 flex-1">
            {/*
              Keep this a Radix primitive: it handles hover, Escape and
              click-outside, and unmounts the closed panel. A hover panel hidden
              with opacity leaves its links in the tab order, so keyboard users
              land on invisible content.

              `asChild` keeps the trigger an anchor, so clicking "Каталог" still
              navigates to /catalog. Radix opens the panel on hover and on click,
              but a click on an anchor navigates instead — so the menu is opened
              from `onFocus` as well, which is what AGENTS.md requires of anything
              that opens on hover.
            */}
            <NavigationMenu.Root
              value={navMenuValue}
              onValueChange={setNavMenuValue}
              delayDuration={0}
              className="relative"
            >
              <NavigationMenu.List className="flex items-center gap-8 list-none m-0 p-0">
                <NavigationMenu.Item value={CATALOGUE_MENU}>
                  <NavigationMenu.Trigger asChild>
                    <Link
                      href="/catalog"
                      onFocus={() => setNavMenuValue(CATALOGUE_MENU)}
                      className="text-nav-link text-primary transition-colors duration-300 hover-underline-anim py-2"
                    >
                      {t("catalogue")}
                    </Link>
                  </NavigationMenu.Trigger>

                  <NavigationMenu.Content className="absolute top-full left-0 w-64 bg-surface-container-lowest/95 backdrop-blur-xl border border-outline-variant/30 shadow-xl p-6 flex flex-col gap-4">
                    {[
                      {
                        href: "/catalog?category=one-piece",
                        label: t("onePiece"),
                      },
                      {
                        href: "/catalog?category=two-piece",
                        label: t("twoPiece"),
                      },
                      {
                        href: "/catalog?category=dresses",
                        label: t("dresses"),
                      },
                    ].map((item) => (
                      <NavigationMenu.Link key={item.href} asChild>
                        <Link
                          href={item.href}
                          className="text-label-sm text-secondary hover:text-primary transition-colors duration-300 hover-underline-anim w-fit capitalize"
                        >
                          {item.label}
                        </Link>
                      </NavigationMenu.Link>
                    ))}
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu.Root>
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
              src={"/logo_black.png"}
              alt="VELÉLS"
              width={128}
              height={48}
              className="h-12 w-auto object-contain"
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
