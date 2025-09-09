import { sanityFetch } from './sanity.client';
import { 
  getAllPosts, 
  getAllCategories, 
  getRecentReviews,
  getStats 
} from './groq';
import { Review, Post, Category } from './types';

// Función para obtener reseñas recientes para la homepage
export async function getHomepageReviews(limit: number = 4): Promise<Review[]> {
  try {
    return await sanityFetch<Review[]>({
      query: getRecentReviews,
      params: { limit },
      tags: ['reviews'],
      revalidate: 3600, // 1 hora
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    return [];
  }
}

// Función para obtener posts destacados para la homepage
export async function getHomepagePosts(limit: number = 3): Promise<Post[]> {
  try {
    const posts = await sanityFetch<Post[]>({
      query: getAllPosts,
      tags: ['posts'],
      revalidate: 3600, // 1 hora
    });
    return posts.slice(0, limit);
  } catch (error) {
    // eslint-disable-next-line no-console
    return [];
  }
}

// Función para obtener categorías destacadas
export async function getFeaturedCategories(): Promise<Category[]> {
  try {
    return await sanityFetch<Category[]>({
      query: getAllCategories,
      tags: ['categories'],
      revalidate: 7200, // 2 horas
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    return [];
  }
}

// Función para obtener estadísticas del sitio
export async function getSiteStats() {
  try {
    return await sanityFetch({
      query: getStats,
      tags: ['stats'],
      revalidate: 3600, // 1 hora
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    return {
      totalVenues: 0,
      totalReviews: 0,
      totalPosts: 0,
      totalCategories: 0,
      totalCities: 0,
    };
  }
}

// Función para obtener datos de una categoría específica
export async function getCategoryData(slug: string) {
  try {
    return await sanityFetch({
      query: `*[_type == "category" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        description,
        "reviews": *[_type == "review" && venue->categories[]->slug.current match $slug] | order(publishedAt desc) [0...12] {
          _id,
          title,
          "slug": slug.current,
          author,
          publishedAt,
          ratings,
          tldr,
          gallery[0]{
            asset->{url},
            alt
          },
          venue->{
            _id,
            title,
            "slug": slug.current,
            city->{
              title,
              "slug": slug.current
            }
          }
        }
      }`,
      params: { slug },
      tags: ['categories', 'reviews'],
      revalidate: 3600,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    return null;
  }
}

// Función para obtener datos de un post específico
export async function getPostData(slug: string) {
  try {
    return await sanityFetch({
      query: `*[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        excerpt,
        cover{
          asset->{url},
          alt
        },
        faq,
        body,
        tags,
        author,
        publishedAt
      }`,
      params: { slug },
      tags: ['posts'],
      revalidate: 3600,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    return null;
  }
}