import { adminSanityClient } from "@/lib/admin-sanity";
import { reviewByIdQuery } from "@/lib/admin-queries";
import type { Review } from "@/types/sanity";
import { notFound } from "next/navigation";
import ReviewDetailClient from "./ReviewDetailClient";

interface ReviewDetailPageProps {
  params: Promise<{ id: string }>;
}

interface ReviewWithDetails extends Omit<Review, 'venue'> {
  venue: {
    _id: string;
    title: string;
    slug: { current: string };
    city: {
      title: string;
      slug: { current: string };
    };
  };
  content?: string;
}

export default async function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  const { id } = await params;
  const review = await adminSanityClient.fetch<ReviewWithDetails>(reviewByIdQuery, { id });
  
  if (!review) {
    notFound();
  }

  return <ReviewDetailClient review={review} />;
}
