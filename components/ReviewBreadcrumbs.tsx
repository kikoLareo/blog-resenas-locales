"use client";

import Link from "next/link";

export function ReviewBreadcrumbs({
  category,
  city,
  reviewTitle,
}: {
  category: string;
  city: string;
  reviewTitle: string;
}) {
  return (
    <nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        <li>
          <Link href="/" className="hover:text-accent">
            Inicio
          </Link>
        </li>
        <li>/</li>
        <li>
          <Link href="/categorias" className="hover:text-accent">
            {category}
          </Link>
        </li>
        <li>/</li>
        <li>
          <Link href={`/ciudades/${city.toLowerCase()}`} className="hover:text-accent">
            {city}
          </Link>
        </li>
        <li>/</li>
        <li className="text-gray-900 font-medium line-clamp-1">{reviewTitle}</li>
      </ol>
    </nav>
  );
}


