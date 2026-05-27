"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function SmoothScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Intercept all same-page anchor link clicks
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Check if it's an anchor link (contains '#')
      const hashIndex = href.indexOf("#");
      if (hashIndex !== -1) {
        const hash = href.substring(hashIndex);
        const targetId = hash.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();

          // Smooth scroll to the target element
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          // Update URL hash without causing a page jump
          window.history.pushState(null, "", hash);
        }
      }
    };

    // 2. Handle smooth scrolling on page load/navigation if a hash is present in URL
    const handleInitialHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const targetId = hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          // A tiny timeout ensures next.js rendering/hydration is complete
          setTimeout(() => {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 150);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    
    // Check initial hash on load
    if (document.readyState === "complete") {
      handleInitialHash();
    } else {
      window.addEventListener("load", handleInitialHash);
    }

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("load", handleInitialHash);
    };
  }, [pathname]);

  return null;
}
