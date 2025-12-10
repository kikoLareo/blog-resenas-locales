import type { Metadata } from 'next';
import { sanityFetch } from '@/lib/sanity.client';
import { topReviewsQuery } from '@/sanity/lib/queries';
import { ReviewCard } from '@/components/ReviewCard';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Top Reseñas - Las mejores experiencias gastronómicas',
  description: 'Descubre los restaurantes y locales mejor valorados por nuestra comunidad de expertos.',
};

export const revalidate = 3600;

export default async function TopResenasPage() {
  const topReviews = await sanityFetch<any[]>({
    query: topReviewsQuery,
    tags: ['review', 'venue'],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-primary-600">Top Reseñas</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Los locales que han conquistado nuestro paladar. Una selección de las mejores experiencias gastronómicas puntuadas con excelencia.
          </p>
        </div>

        {topReviews && topReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topReviews.map((review) => (
              <ReviewCard
                key={review._id}
                id={review._id}
                title={review.title}
                image={review.gallery?.asset?.url || review.venue?.images?.[0]?.asset?.url || ''}
                rating={review.ratings?.food || review.ratings?.overall || 0}
                location={review.venue?.city || 'Ciudad'}
                readTime="5 min"
                tags={review.tags || []}
                description={review.tldr}
                href={`/${review.venue?.city?.slug?.current || review.venue?.citySlug || 'madrid'}/${review.venue?.slug?.current || 'local'}/review/${review.slug?.current || 'review'}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No hay reseñas destacadas en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
