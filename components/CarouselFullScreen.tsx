"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type ImageItem = { src: string; alt?: string };

interface Props {
  images: ImageItem[];
  autoPlay?: boolean;
  intervalMs?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function CarouselFullScreen({
  images,
  autoPlay = true,
  intervalMs = 6000,
  showArrows = true,
  showDots = true,
  className,
  children,
}: Props) {
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    if (hover) return;
    timeoutRef.current = window.setTimeout(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [index, autoPlay, intervalMs, images.length, hover]);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div
      className={`relative w-full h-screen overflow-hidden ${className ?? ''}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-linear ${
            i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Image src={img.src} alt={img.alt ?? `slide-${i}`} fill className="object-cover" sizes="100vw" />
        </div>
      ))}

      {/* subtle gradient to improve legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

      {/* overlay content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="w-full max-w-4xl text-center text-white">{children}</div>
        </div>
      )}

      {/* arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button
            aria-label="Anterior"
            onClick={prev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-3"
          >
            ‹
          </button>
          <button
            aria-label="Siguiente"
            onClick={next}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-3"
          >
            ›
          </button>
        </>
      )}

      {/* dots */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-white/40'}`}
              aria-label={`Ir a slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
