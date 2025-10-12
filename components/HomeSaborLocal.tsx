"use client";

import { HeroSaborLocal } from "./HeroSaborLocal";
import { ReviewCardSaborLocal } from "./ReviewCardSaborLocal";
import { ThemeToggle } from "./ThemeToggle";
import { TrendingUp, Heart, Award, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

// Tipos para los datos
interface ReviewData {
  id: string;
  title: string;
  image: string;
  rating: number;
  location: string;
  readTime: string;
  tags: string[];
  description: string;
  href: string;
  isNew?: boolean;
  isPopular?: boolean;
  isTrending?: boolean;
  isFavorite?: boolean;
  author?: string;
  publishedDate?: string;
  viewCount?: number;
  shareCount?: number;
  commentCount?: number;
  cuisine?: string;
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  neighborhood?: string;
  openNow?: boolean;
  deliveryAvailable?: boolean;
  reservationRequired?: boolean;
}

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  count: number;
  image: string;
  description: string;
  color: string;
  emoji: string;
}

interface HomeSaborLocalProps {
  featuredItems?: any[];
  trendingReviews?: ReviewData[];
  topRatedReviews?: ReviewData[];
  categories?: CategoryData[];
  venues?: any[];
  className?: string;
}

// Función para obtener reseñas destacadas desde Sanity
async function getFeaturedReviews(): Promise<ReviewData[]> {
  try {
    const reviews = await adminSanityClient.fetch(`
      *[_type == "review" && published == true] | order(publishedAt desc)[0...3] {
        _id,
        title,
        slug,
        venue->{
          title,
          slug,
          city->{
            title,
            slug
          }
        },
        ratings,
        publishedAt,
        summary,
        tags
      }
    `);
    
    return reviews.map((review: any) => ({
      id: review._id,
      title: review.title,
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=85", // Imagen por defecto
      rating: review.ratings?.overall || 4.5,
      location: `${review.venue?.city?.title || 'Madrid'}`,
      readTime: "5 min lectura",
      tags: review.tags || ["Gastronomía"],
      description: review.summary || "Reseña gastronómica detallada",
      href: `/${review.venue?.city?.slug?.current || 'madrid'}/${review.venue?.slug?.current || 'local'}/review/${review.slug?.current || 'review'}`,
      isNew: true,
      isTrending: true,
      isPopular: true,
      author: "Equipo SaborLocal",
      publishedDate: new Date(review.publishedAt).toISOString().split('T')[0],
      viewCount: Math.floor(Math.random() * 2000) + 500,
      shareCount: Math.floor(Math.random() * 100) + 20,
      commentCount: Math.floor(Math.random() * 30) + 5,
      cuisine: "Gastronomía",
      priceRange: "$$",
      neighborhood: review.venue?.city?.title || "Madrid",
      openNow: true,
      deliveryAvailable: false,
      reservationRequired: false,
    }));
  } catch (error) {
    console.error('Error fetching featured reviews:', error);
    return [];
  }
}

// Datos de fallback optimizados para SEO (solo si no hay datos reales)
const fallbackTrendingReviews: ReviewData[] = [
  {
    id: "trending-1",
    title: "El Nuevo Templo del Sushi en Madrid",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=85",
    rating: 4.8,
    location: "Malasaña, Madrid",
    readTime: "6 min lectura",
    tags: ["Sushi", "Japonés", "Moderno"],
    description: "Un viaje gastronómico a Japón sin salir de Madrid. Ingredientes premium y técnicas tradicionales se fusionan en este nuevo concepto.",
    href: "/madrid/sushi-temple/review/nuevo-templo-sushi-malasana",
    isNew: true,
    isTrending: true,
    isPopular: true,
    author: "Ana Martínez",
    publishedDate: "2024-01-22",
    viewCount: 2890,
    shareCount: 145,
    commentCount: 23,
    cuisine: "Japonesa",
    priceRange: "$$$",
    neighborhood: "Malasaña",
    openNow: true,
    deliveryAvailable: false,
    reservationRequired: true,
  },
  {
    id: "trending-2", 
    title: "Street Food Gourmet en Chueca",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&q=85",
    rating: 4.6,
    location: "Chueca, Madrid",
    readTime: "4 min lectura",
    tags: ["Street Food", "Fusión", "Casual"],
    description: "La revolución del street food llega a Chueca con sabores internacionales y precios accesibles para todos los bolsillos.",
    href: "/madrid/street-gourmet/review/street-food-gourmet-chueca",
    isNew: false,
    isTrending: true,
    isPopular: false,
    author: "Carlos Ruiz",
    publishedDate: "2024-01-20",
    viewCount: 1750,
    shareCount: 89,
    commentCount: 15,
    cuisine: "Fusión",
    priceRange: "$$",
    neighborhood: "Chueca",
    openNow: true,
    deliveryAvailable: true,
    reservationRequired: false,
  },
  {
    id: "trending-3",
    title: "Cocina de Autor en Salamanca",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&q=85",
    rating: 4.9,
    location: "Salamanca, Madrid",
    readTime: "8 min lectura",
    tags: ["Fine Dining", "Autor", "Michelin"],
    description: "Una experiencia culinaria única donde cada plato cuenta una historia. Ingredientes de temporada y técnicas innovadoras.",
    href: "/madrid/autor-salamanca/review/cocina-autor-salamanca-michelin",
    isNew: false,
    isTrending: false,
    isPopular: true,
    author: "María González",
    publishedDate: "2024-01-18",
    viewCount: 3420,
    shareCount: 234,
    commentCount: 45,
    cuisine: "Española",
    priceRange: "$$$$",
    neighborhood: "Salamanca",
    openNow: false,
    deliveryAvailable: false,
    reservationRequired: true,
  }
];

const fallbackTopRatedReviews: ReviewData[] = [
  {
    id: "top-1",
    title: "La Taberna Más Auténtica de Madrid",
    image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800&h=600&fit=crop&q=85",
    rating: 4.9,
    location: "La Latina, Madrid",
    readTime: "5 min lectura",
    tags: ["Tradicional", "Tapas", "Auténtico"],
    description: "Tres generaciones manteniendo viva la esencia de la cocina madrileña tradicional. Un tesoro escondido en La Latina.",
    href: "/madrid/taberna-autentica/review/taberna-mas-autentica-madrid",
    isNew: false,
    isTrending: false,
    isPopular: true,
    author: "José Luis Pérez",
    publishedDate: "2024-01-15",
    viewCount: 4200,
    shareCount: 178,
    commentCount: 67,
    cuisine: "Española",
    priceRange: "$$",
    neighborhood: "La Latina",
    openNow: true,
    deliveryAvailable: false,
    reservationRequired: false,
  },
  {
    id: "top-2",
    title: "Pizza Napoletana Perfecta",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop&q=85",
    rating: 4.8,
    location: "Conde Duque, Madrid",
    readTime: "4 min lectura",
    tags: ["Pizza", "Italiana", "Artesanal"],
    description: "Horno de leña, masa madre de 72 horas y ingredientes importados de Italia. La pizza napoletana como debe ser.",
    href: "/madrid/pizza-napoletana/review/pizza-napoletana-perfecta-conde-duque",
    isNew: false,
    isTrending: false,
    isPopular: true,
    author: "Marco Rossi",
    publishedDate: "2024-01-12",
    viewCount: 3100,
    shareCount: 156,
    commentCount: 34,
    cuisine: "Italiana",
    priceRange: "$$",
    neighborhood: "Conde Duque",
    openNow: true,
    deliveryAvailable: true,
    reservationRequired: false,
  }
];

const fallbackCategories: CategoryData[] = [
  {
    id: "cat-1",
    name: "Tapas Tradicionales",
    slug: "tapas-tradicionales",
    count: 89,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&q=85",
    description: "Descubre los mejores bares de tapas de Madrid",
    color: "#f59e0b",
    emoji: "🍤"
  },
  {
    id: "cat-2",
    name: "Cocina Internacional",
    slug: "cocina-internacional",
    count: 134,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&q=85",
    description: "Sabores del mundo en tu ciudad",
    color: "#ef4444",
    emoji: "🌍"
  },
  {
    id: "cat-3",
    name: "Fine Dining",
    slug: "fine-dining",
    count: 45,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&q=85",
    description: "Experiencias gastronómicas únicas",
    color: "#8b5cf6",
    emoji: "⭐"
  },
  {
    id: "cat-4",
    name: "Brunch & Café",
    slug: "brunch-cafe",
    count: 67,
    image: "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=400&h=300&fit=crop&q=85",
    description: "Los mejores sitios para desayunar",
    color: "#84cc16",
    emoji: "☕"
  }
];

export function HomeSaborLocal({
  featuredItems,
  trendingReviews = fallbackTrendingReviews,
  topRatedReviews = fallbackTopRatedReviews,
  categories = fallbackCategories,
  venues,
  className = ""
}: HomeSaborLocalProps) {

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Hero Section */}
      <HeroSaborLocal 
        featuredItems={featuredItems}
        className="relative"
      />

      {/* Theme Toggle Floating */}
      <ThemeToggle variant="floating" />


      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Trending Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                  Tendencias Gastronómicas
                </h2>
                <p className="text-muted-foreground">
                  Los locales que están dando que hablar
                </p>
              </div>
            </div>
            <Button variant="ghost" className="text-saffron-600 hover:text-saffron-700 dark:text-saffron-400 dark:hover:text-saffron-300">
              Ver todas
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingReviews.slice(0, 6).map((review) => (
              <ReviewCardSaborLocal
                key={review.id}
                {...review}
                onFavoriteToggle={(id, isFavorite) => {
                  console.log(`Toggle favorite for ${id}: ${isFavorite}`);
                }}
                onShare={(id) => {
                  console.log(`Share ${id}`);
                }}
                onBookmark={(id) => {
                  console.log(`Bookmark ${id}`);
                }}
              />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-saffron-500 to-orange-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                  Explora por Categorías
                </h2>
                <p className="text-muted-foreground">
                  Encuentra exactamente lo que buscas
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categorias/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:shadow-food-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-2xl mb-1">{category.emoji}</div>
                    <h3 className="font-serif font-semibold text-lg mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm opacity-90">{category.count} lugares</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Top Rated Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                  Mejor Valorados
                </h2>
                <p className="text-muted-foreground">
                  Los favoritos de nuestra comunidad
                </p>
              </div>
            </div>
            <Button variant="ghost" className="text-saffron-600 hover:text-saffron-700 dark:text-saffron-400 dark:hover:text-saffron-300">
              Ver todos
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topRatedReviews.slice(0, 4).map((review) => (
              <ReviewCardSaborLocal
                key={review.id}
                {...review}
                variant="featured"
                size="lg"
                onFavoriteToggle={(id, isFavorite) => {
                  console.log(`Toggle favorite for ${id}: ${isFavorite}`);
                }}
                onShare={(id) => {
                  console.log(`Share ${id}`);
                }}
                onBookmark={(id) => {
                  console.log(`Bookmark ${id}`);
                }}
              />
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="bg-gradient-to-r from-saffron-50 to-orange-50 dark:from-saffron-950 dark:to-orange-950 rounded-3xl p-8 md:p-12 text-center border border-saffron-200 dark:border-saffron-800">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-saffron-500 rounded-full mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
              No te pierdas las mejores reseñas
            </h2>
            <p className="text-lg text-muted-foreground">
              Suscríbete a nuestro newsletter y recibe cada semana las reseñas más destacadas y las últimas tendencias gastronómicas.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-6">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
              />
              <Button className="bg-saffron-500 hover:bg-saffron-600 text-white px-6 py-3">
                Suscribirse
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Sin spam. Cancela cuando quieras.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
