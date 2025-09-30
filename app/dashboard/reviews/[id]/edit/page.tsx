import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReviewEditForm } from '@/components/dashboard/ReviewEditForm';
import { adminSanityClient } from '@/lib/admin-sanity';

interface ReviewEditPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ReviewEditPageProps): Promise<Metadata> {
  const review = await getReview(params.id);
  
  if (!review) {
    return {
      title: 'Reseña no encontrada',
    };
  }

  return {
    title: `Editar: ${review.title}`,
    description: `Editar la reseña: ${review.title}`,
  };
}

async function getReview(id: string) {
  try {
    const query = `
      *[_type == "review" && _id == $id][0] {
        _id,
        _createdAt,
        _updatedAt,
        title,
        slug,
        content,
        excerpt,
        published,
        publishedAt,
        "venue": venue->{
          _id,
          title,
          slug,
          "city": city->{title, slug}
        },
        ratings {
          overall,
          food,
          service,
          atmosphere,
          value
        },
        images[] {
          asset->{
            _id,
            url,
            metadata {
              dimensions {
                width,
                height
              }
            }
          },
          alt,
          caption
        },
        tags,
        seoTitle,
        metaDescription,
        author->{
          _id,
          name,
          email
        }
      }
    `;
    
    const review = await adminSanityClient.fetch(query, { id });
    return review;
  } catch (error) {
    // Error fetching review
    return null;
  }
}

async function getVenues() {
  try {
    const query = `
      *[_type == "venue"] | order(title asc) {
        _id,
        title,
        slug,
        "city": city->{title, slug}
      }
    `;
    
    return await adminSanityClient.fetch(query);
  } catch (error) {
    // Error fetching venues
    return [];
  }
}

export default async function ReviewEditPage({ params }: ReviewEditPageProps) {
  const [review, venues] = await Promise.all([
    getReview(params.id),
    getVenues()
  ]);

  if (!review) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Editar Reseña
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Modifica los detalles de la reseña
        </p>
      </div>

      <ReviewEditForm review={review} venues={venues} />
    </div>
  );
}