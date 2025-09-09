import { adminSanityClient } from "@/lib/admin-sanity";
import { venueByIdQuery } from "@/lib/admin-queries";
import { notFound } from "next/navigation";
import VenueDetailClient from "./VenueDetailClient";

interface VenueDetailPageProps {
  params: Promise<{ id: string }>;
}

interface VenueWithDetails {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  address: string;
  phone?: string;
  website?: string;
  priceRange: string;
  schemaType?: string;
  _createdAt: string;
  _updatedAt: string;
  city: {
    _id: string;
    title: string;
    slug: { current: string };
  };
  categories: {
    _id: string;
    title: string;
  }[];
  reviews: {
    _id: string;
    title: string;
    slug: { current: string };
    ratings: {
      food: number;
      service: number;
      ambience: number;
      value: number;
    };
    _createdAt: string;
  }[];
}

export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
  const { id } = await params;
  const venue = await adminSanityClient.fetch<VenueWithDetails>(venueByIdQuery, { id });
  
  if (!venue) {
    notFound();
  }

  return <VenueDetailClient venue={venue} />;
}