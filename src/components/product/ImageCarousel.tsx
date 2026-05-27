"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/data/products";

interface ImageCarouselProps {
  images: ProductImage[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = useCallback(
    (index: number) => {
      if (sliderRef.current) {
        const width = sliderRef.current.offsetWidth;
        sliderRef.current.scrollTo({ left: width * index, behavior: "smooth" });
        setActiveIndex(index);
      }
    },
    []
  );

  const handleScroll = useCallback(() => {
    if (sliderRef.current) {
      const index = Math.round(
        sliderRef.current.scrollLeft / sliderRef.current.offsetWidth
      );
      setActiveIndex(index);
    }
  }, []);

  return (
    <div className="w-full md:w-2/3 flex flex-col gap-6">
      {/* Main slider */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="w-full overflow-x-auto flex snap-x snap-mandatory no-scrollbar scroll-smooth"
      >
        {images.map((image, i) => (
          <div
            key={i}
            className="min-w-full snap-center aspect-4-5 bg-surface-container relative"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 66vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Thumbnail navigation */}
      <div className="flex justify-center gap-3">
        {images.map((image, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            className={`w-16 h-20 border-b-2 transition-all duration-300 overflow-hidden ${
              i === activeIndex
                ? "opacity-100 grayscale-0 border-primary"
                : "opacity-50 grayscale border-transparent"
            }`}
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={image.src}
              alt={`Thumbnail ${i + 1}`}
              width={64}
              height={80}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
