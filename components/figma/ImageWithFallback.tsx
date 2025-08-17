"use client";

import React, { useEffect, useRef, useState } from 'react';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { src, alt, style, className, ...rest } = props;
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const [isHydrated, setIsHydrated] = useState(false);
  const pendingErrorRef = useRef(false);

  const handleError = () => {
    // Si ocurre antes de que la app esté hidratada, difiere el cambio de src
    if (!isHydrated) {
      pendingErrorRef.current = true;
      return;
    }
    setCurrentSrc(ERROR_IMG_SRC);
  };

  useEffect(() => {
    setIsHydrated(true);
    if (pendingErrorRef.current) {
      setCurrentSrc(ERROR_IMG_SRC);
      pendingErrorRef.current = false;
    }
  }, []);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      data-original-url={src}
      {...rest}
    />
  );
}


