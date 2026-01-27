import { adminSanityClient } from "@/lib/admin-sanity";
import { HomepageSection } from "@/types/homepage";
import HomepageSectionRenderer from "./sections/HomepageSectionRenderer";
import { getReviewUrl } from "@/lib/utils";

// Función para obtener reseñas destacadas desde Sanity
async function getFeaturedReviews() {
  try {
    const reviews = await adminSanityClient.fetch(`
      *[_type == "review" && published == true] | order(publishedAt desc)[0...6] {
        _id,
        title,
        "slug": slug.current,
        venue->{
          title,
          "slug": slug.current,
          city->{
            title,
            "slug": slug.current
          }
        },
        ratings,
        publishedAt,
        summary,
        tags,
        "image": gallery[0].asset->url
      }
    `);
    
    return reviews.map((review: any) => ({
      id: review._id,
      title: review.title,
      image: review.image || "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=85",
      rating: review.ratings?.overall || 4.5,
      location: `${review.venue?.city?.title || 'Madrid'}`,
      readTime: "5 min lectura",
      tags: review.tags || ["Gastronomía"],
      description: review.summary || "Reseña gastronómica detallada",
      href: getReviewUrl(
        review.venue?.city?.slug,
        review.venue?.slug,
        review.slug
      ),
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

// Función para obtener categorías reales
async function getCategories() {
  try {
    const categories = await adminSanityClient.fetch(`
      *[_type == "category" && published == true] | order(title asc) {
        _id,
        title,
        slug,
        description,
        color,
        emoji,
        "count": count(*[_type == "venue" && references(^._id)])
      }
    `);
    
    return categories.map((cat: any) => ({
      id: cat._id,
      name: cat.title,
      slug: cat.slug?.current || cat.slug,
      count: cat.count || 0,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&q=85", // Imagen por defecto
      description: cat.description || "Descubre los mejores locales de esta categoría",
      color: cat.color || "#f59e0b",
      emoji: cat.emoji || "🍽️"
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Función para obtener secciones de homepage desde Sanity
async function getHomepageSections(): Promise<HomepageSection[]> {
  try {
    const sections = await adminSanityClient.fetch(`
      *[_type == "homepageSection" && enabled == true] | order(order asc) {
        _id,
        _type,
        title,
        sectionType,
        enabled,
        order,
        config,
        _createdAt,
        _updatedAt
      }
    `);
    
    console.log('Fetched homepage sections:', sections.length);
    return sections || [];
  } catch (error) {
    console.error('Error fetching homepage sections:', error);
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
  // Obtener secciones de homepage desde Sanity
  const homepageSections = await getHomepageSections();

  return (
    <div className={className}>
      {/* Render dynamic homepage sections from Sanity */}
      {homepageSections.length > 0 ? (
        homepageSections.map((section) => (
          <HomepageSectionRenderer key={section._id} section={section} />
        ))
      ) : (
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            No hay secciones configuradas
          </h2>
          <p className="text-gray-500">
            Configura las secciones de la página principal desde el dashboard.
          </p>
        </div>
      )}
    </div>
  );
}
