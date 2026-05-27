"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: "reveal-fade-up" | "reveal-fade-in";
  delay?: "delay-100" | "delay-200" | "delay-300" | "delay-400" | "delay-500" | "";
  className?: string;
}

export function ScrollReveal({
  children,
  animation = "reveal-fade-up",
  delay = "",
  className = "",
}: ScrollRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-base ${animation} ${delay} ${
        isRevealed ? "is-revealed" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
