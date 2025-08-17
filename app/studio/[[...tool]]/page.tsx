"use client";

/**
 * Sanity Studio embebido.
 * Para evitar errores de compilación con dependencias cliente (p.ej. framer-motion en Next 15),
 * evitamos imports estáticos en producción y cargamos dinámicamente sólo en desarrollo.
 */

import dynamic from 'next/dynamic';

export const dynamic = 'force-static';

export default function StudioPage() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const Studio = dynamic(async () => {
    const { NextStudio } = await import('next-sanity/studio');
    const config = (await import('../../../sanity.config')).default;
    return function StudioWrapper() {
      return <NextStudio config={config} />;
    };
  }, { ssr: false });

  return <Studio />;
}
