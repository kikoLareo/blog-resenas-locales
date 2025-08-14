import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { breadcrumbsJsonLd } from '@/lib/schema';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Siempre incluir Home como primer item
  const allItems = [
    { name: 'Inicio', url: '/' },
    ...items
  ];

  // Generar JSON-LD para breadcrumbs
  const jsonLd = breadcrumbsJsonLd(allItems);

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Breadcrumbs visibles */}
      <nav 
        aria-label="Breadcrumb" 
        className={`${className}`}
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
      >
        <ol className="flex items-center space-x-2 text-sm">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            const position = index + 1;

            return (
              <li 
                key={item.url}
                className="flex items-center"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {/* Separador (no para el primer item) */}
                {index > 0 && (
                  <ChevronRightIcon 
                    className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0" 
                    aria-hidden="true"
                  />
                )}

                {/* Item del breadcrumb */}
                {isLast ? (
                  // Último item (actual) - no es link
                  <span 
                    className="text-gray-900 font-medium"
                    itemProp="name"
                    aria-current="page"
                  >
                    {index === 0 ? (
                      <HomeIcon className="w-4 h-4" aria-label={item.name} />
                    ) : (
                      item.name
                    )}
                  </span>
                ) : (
                  // Items intermedios - son links
                  <Link
                    href={item.url}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center"
                    itemProp="item"
                  >
                    <span itemProp="name">
                      {index === 0 ? (
                        <HomeIcon className="w-4 h-4" aria-label={item.name} />
                      ) : (
                        item.name
                      )}
                    </span>
                  </Link>
                )}

                {/* Meta data para schema */}
                <meta itemProp="position" content={position.toString()} />
                {!isLast && <link itemProp="item" href={item.url} />}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

// Componente específico para páginas de venue
export function VenueBreadcrumbs({ 
  city, 
  venue, 
  className 
}: { 
  city: { name: string; slug: string }; 
  venue: { name: string; slug: string };
  className?: string;
}) {
  const items = [
    { name: city.name, url: `/${city.slug}` },
    { name: venue.name, url: `/${city.slug}/${venue.slug}` },
  ];

  return <Breadcrumbs items={items} className={className} />;
}

// Componente específico para páginas de review
export function ReviewBreadcrumbs({ 
  city, 
  venue, 
  reviewTitle,
  reviewDate,
  className 
}: { 
  city: { name: string; slug: string }; 
  venue: { name: string; slug: string };
  reviewTitle: string;
  reviewDate: string;
  className?: string;
}) {
  const items = [
    { name: city.name, url: `/${city.slug}` },
    { name: venue.name, url: `/${city.slug}/${venue.slug}` },
    { name: reviewTitle, url: `/${city.slug}/${venue.slug}/review-${reviewDate}` },
  ];

  return <Breadcrumbs items={items} className={className} />;
}