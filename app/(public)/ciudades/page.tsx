import { Metadata } from 'next';
import Link from 'next/link';
import { sanityClient } from '@/sanity/lib/client';
import { MapPin, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ciudades - Guía Gastronómica | Sabor Local',
  description: 'Descubre las mejores ciudades gastronómicas de España: Barcelona, Madrid, Valencia, Sevilla y Bilbao. Guías completas con reseñas de restaurantes.',
  openGraph: {
    title: 'Ciudades - Guía Gastronómica | Sabor Local',
    description: 'Descubre las mejores ciudades gastronómicas de España con nuestras guías completas.',
  },
};

interface City {
  _id: string;
  slug: {
    current: string;
  };
  description: string;
  reviewCount: number;
  venueCount: number;
  categoryCount: number;
}

async function getCities(): Promise<City[]> {
  const cities = await sanityClient.fetch<City[]>(
    `*[_type == "city"] | order(slug.current asc) {
      _id,
      slug,
      description,
      "reviewCount": count(*[_type == "review" && references(^._id) && published == true]),
      "venueCount": count(*[_type == "venue" && references(^._id)]),
      "categoryCount": count(array::unique(*[_type == "venue" && references(^._id)].category[]->slug.current))
    }`,
    {},
    { next: { revalidate: 3600 } } // Revalidate every hour
  );

  return cities;
}

function getCityDisplayName(slug: string): string {
  const names: Record<string, string> = {
    'barcelona': 'Barcelona',
    'madrid': 'Madrid',
    'valencia': 'Valencia',
    'sevilla': 'Sevilla',
    'bilbao': 'Bilbao',
  };
  return names[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
}

function getCityIcon(slug: string): string {
  const icons: Record<string, string> = {
    'barcelona': '🏖️',
    'madrid': '🏛️',
    'valencia': '🥘',
    'sevilla': '💃',
    'bilbao': '🎨',
  };
  return icons[slug] || '🏙️';
}

export default async function CiudadesPage() {
  const cities = await getCities();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Ciudades Gastronómicas
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Explora las mejores experiencias culinarias en las ciudades más destacadas de España.
              De la costa mediterránea al corazón de Castilla, cada ciudad tiene su propia historia gastronómica.
            </p>
          </div>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cities.map((city) => {
              const cityName = getCityDisplayName(city.slug.current);
              const cityIcon = getCityIcon(city.slug.current);

              return (
                <Link
                  key={city._id}
                  href={`/${city.slug.current}`}
                  className="group relative bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-border/50 hover:border-accent/50"
                >
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative p-8">
                    {/* City Icon & Name */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-5xl">{cityIcon}</div>
                      <div>
                        <h2 className="text-2xl font-bold group-hover:text-accent transition-colors">
                          {cityName}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>España</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground mb-6 line-clamp-3">
                      {city.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex gap-4">
                        <div>
                          <span className="font-semibold text-accent">{city.reviewCount}</span>
                          <span className="text-muted-foreground ml-1">reseñas</span>
                        </div>
                        <div>
                          <span className="font-semibold text-accent">{city.venueCount}</span>
                          <span className="text-muted-foreground ml-1">locales</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-accent font-semibold group-hover:gap-4 transition-all">
                      <span>Explorar {cityName}</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-300" />
                </Link>
              );
            })}
          </div>

          {/* Empty State */}
          {cities.length === 0 && (
            <div className="text-center py-16">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">No hay ciudades disponibles</h3>
              <p className="text-muted-foreground">
                Estamos trabajando en añadir más ciudades a nuestra guía gastronómica.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              ¿No encuentras tu ciudad?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Estamos expandiendo nuestra cobertura constantemente. Suscríbete para ser el primero en descubrir
              nuevas ciudades y experiencias gastronómicas.
            </p>
            <Link
              href="/#newsletter"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-full hover:bg-accent/90 transition-colors shadow-lg hover:shadow-xl"
            >
              <span>Suscríbete al Newsletter</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
