import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { BreadcrumbItem } from '@/lib/types';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  separator?: 'chevron' | 'slash' | 'arrow';
}

export default function Breadcrumbs({
  items,
  className = '',
  showHome = true,
  separator = 'chevron',
}: BreadcrumbsProps) {
  // Generate JSON-LD schema for breadcrumbs
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      ...(showHome
        ? [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Inicio',
              item: '/',
            },
          ]
        : []),
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: (showHome ? 2 : 1) + index,
        name: item.name,
        item: item.url,
      })),
    ],
  };

  const getSeparatorIcon = () => {
    switch (separator) {
      case 'chevron':
        return <ChevronRightIcon className="w-4 h-4 text-gray-400" aria-hidden="true" />;
      case 'slash':
        return <span className="text-gray-400" aria-hidden="true">/</span>;
      case 'arrow':
        return <span className="text-gray-400" aria-hidden="true">→</span>;
      default:
        return <ChevronRightIcon className="w-4 h-4 text-gray-400" aria-hidden="true" />;
    }
  };

  // Don't render if no items
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav
      className={`breadcrumbs ${className}`}
      aria-label="Navegación de migas de pan"
      role="navigation"
    >
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ol className="flex items-center space-x-2 text-sm">
        {/* Home Link */}
        {showHome && (
          <li>
            <Link
              href="/"
              className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
              aria-label="Ir al inicio"
            >
              <HomeIcon className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">Inicio</span>
            </Link>
          </li>
        )}

        {/* Breadcrumb Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {/* Separator */}
              {(showHome || index > 0) && (
                <span className="mx-2 flex items-center">
                  {getSeparatorIcon()}
                </span>
              )}

              {/* Breadcrumb Link or Text */}
              {isLast ? (
                <span
                  className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs md:max-w-md"
                  aria-current="page"
                  title={item.name}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 truncate max-w-[120px] md:max-w-xs"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Compact breadcrumbs variant for mobile or smaller spaces
export function CompactBreadcrumbs({
  items,
  className = '',
  maxItems = 2,
}: {
  items: BreadcrumbItem[];
  className?: string;
  maxItems?: number;
}) {
  if (!items || items.length === 0) {
    return null;
  }

  // Show only first item and last items if there are too many
  const shouldCollapse = items.length > maxItems;
  let displayItems = items;

  if (shouldCollapse) {
    displayItems = [
      items[0], // First item
      ...items.slice(-maxItems + 1), // Last items
    ];
  }

  return (
    <nav className={`compact-breadcrumbs ${className}`} aria-label="Navegación">
      <div className="flex items-center space-x-2 text-sm">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isFirst = index === 0;

          return (
            <div key={index} className="flex items-center">
              {/* Show ellipsis if collapsed */}
              {shouldCollapse && index === 1 && items.length > maxItems && (
                <>
                  <span className="mx-2 text-gray-400">...</span>
                  <ChevronRightIcon className="w-3 h-3 text-gray-400 mx-2" />
                </>
              )}

              {/* Separator for non-first items */}
              {!isFirst && !(shouldCollapse && index === 1) && (
                <ChevronRightIcon className="w-3 h-3 text-gray-400 mx-2" />
              )}

              {/* Breadcrumb item */}
              {isLast ? (
                <span className="font-medium text-gray-900 text-xs truncate max-w-24">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="text-gray-500 hover:text-gray-700 text-xs truncate max-w-24"
                >
                  {item.name}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

// Breadcrumbs for specific content types
export function VenueBreadcrumbs({
  city,
  venue,
  className = '',
}: {
  city: string;
  venue?: string;
  className?: string;
}) {
  const items: BreadcrumbItem[] = [
    { name: 'Ciudades', url: '/ciudades' },
    { name: city, url: `/ciudades/${city.toLowerCase()}` },
  ];

  if (venue) {
    items.push({ name: venue, url: `/ciudades/${city.toLowerCase()}/${venue.toLowerCase()}` });
  }

  return <Breadcrumbs items={items} className={className} />;
}

export function CategoryBreadcrumbs({
  category,
  subcategory,
  className = '',
}: {
  category: string;
  subcategory?: string;
  className?: string;
}) {
  const items: BreadcrumbItem[] = [
    { name: 'Categorías', url: '/categorias' },
    { name: category, url: `/categorias/${category.toLowerCase()}` },
  ];

  if (subcategory) {
    items.push({
      name: subcategory,
      url: `/categorias/${category.toLowerCase()}/${subcategory.toLowerCase()}`,
    });
  }

  return <Breadcrumbs items={items} className={className} />;
}

export function BlogBreadcrumbs({
  postTitle,
  category,
  className = '',
}: {
  postTitle?: string;
  category?: string;
  className?: string;
}) {
  const items: BreadcrumbItem[] = [{ name: 'Blog', url: '/blog' }];

  if (category) {
    items.push({ name: category, url: `/blog/categoria/${category.toLowerCase()}` });
  }

  if (postTitle) {
    items.push({ name: postTitle, url: '#' }); // Current page, no URL needed
  }

  return <Breadcrumbs items={items} className={className} />;
}

// Breadcrumbs with rich snippets for reviews
export function ReviewBreadcrumbs({
  city,
  venue,
  reviewTitle,
  className = '',
}: {
  city: string;
  venue: string;
  reviewTitle: string;
  className?: string;
}) {
  const items: BreadcrumbItem[] = [
    { name: 'Reseñas', url: '/resenas' },
    { name: city, url: `/ciudades/${city.toLowerCase()}` },
    { name: venue, url: `/ciudades/${city.toLowerCase()}/${venue.toLowerCase()}` },
    { name: reviewTitle, url: '#' },
  ];

  return <Breadcrumbs items={items} className={className} />;
}