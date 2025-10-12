import { adminSanityClient } from "@/lib/admin-sanity";
import { HomeSaborLocal } from "./HomeSaborLocal";

// Función para obtener reseñas destacadas desde Sanity
async function getFeaturedReviews() {
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

// Función para obtener contenido SEO destacado
async function getFeaturedSEOContent() {
  try {
    const content = await adminSanityClient.fetch(`
      {
        "guides": *[_type == "guide" && published == true && featured == true] | order(publishedAt desc)[0...3] {
          _id,
          title,
          slug,
          excerpt,
          type,
          city->{
            title,
            slug
          },
          neighborhood,
          theme,
          publishedAt,
          stats
        },
        "lists": *[_type == "list" && published == true && featured == true] | order(publishedAt desc)[0...3] {
          _id,
          title,
          slug,
          excerpt,
          listType,
          dish,
          city->{
            title,
            slug
          },
          publishedAt,
          stats
        },
        "recipes": *[_type == "recipe" && published == true && featured == true] | order(publishedAt desc)[0...3] {
          _id,
          title,
          slug,
          description,
          recipeType,
          difficulty,
          prepTime,
          cookTime,
          servings,
          publishedAt,
          stats
        }
      }
    `);
    
    return content;
  } catch (error) {
    console.error('Error fetching featured SEO content:', error);
    return { guides: [], lists: [], recipes: [] };
  }
}

interface HomeSaborLocalServerProps {
  className?: string;
}

export default async function HomeSaborLocalServer({ className }: HomeSaborLocalServerProps) {
  const [featuredReviews, seoContent] = await Promise.all([
    getFeaturedReviews(),
    getFeaturedSEOContent()
  ]);

  return (
    <HomeSaborLocal 
      className={className}
      featuredItems={featuredReviews}
      trendingReviews={featuredReviews}
    />
  );
}
