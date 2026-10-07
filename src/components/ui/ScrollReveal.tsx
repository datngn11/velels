"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: "reveal-fade-up" | "reveal-fade-in";
  delay?: "delay-100" | "delay-200" | "delay-300" | "";
  className?: string;
}

/**
 * Visible in the static HTML, so nothing waits on hydration. Only a section
 * that starts below the screen is hidden, out of sight, then revealed on
 * arrival; one already on screen stays as rendered.
 */
export function ScrollReveal({
  children,
  animation = "reveal-fade-up",
  delay = "",
  className = "",
}: ScrollRevealProps) {
  const [isPending, setIsPending] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.getBoundingClientRect().top < window.innerHeight) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsPending(false);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );
    setIsPending(true);
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-base ${animation} ${delay} ${
        isPending ? "is-pending" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
