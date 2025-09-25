import { adminSanityClient } from "@/lib/admin-sanity";
import { cityByIdQuery } from "@/lib/admin-queries";
import { notFound } from "next/navigation";
import CityDetailClient from "./CityDetailClient";

interface CityDetailPageProps {
  params: Promise<{ id: string }>;
}

interface CityWithDetails {
  _id: string;
  title: string;
  slug: { current: string };
  region?: string;
  description?: string;
  _createdAt: string;
  _updatedAt: string;
  venues: {
    _id: string;
    title: string;
    slug: { current: string };
    address: string;
    phone?: string;
    website?: string;
    priceRange?: string;
    reviewCount: number;
    _createdAt: string;
  }[];
  reviews: {
    _id: string;
    title: string;
    slug: { current: string };
    venue: {
      title: string;
      slug: { current: string };
    };
    ratings: {
      overall: number;
    };
    _createdAt: string;
  }[];
}

export default async function CityDetailPage({ params }: CityDetailPageProps) {
  const resolvedParams = await params;
  const city = await adminSanityClient.fetch<CityWithDetails>(cityByIdQuery, { id: resolvedParams.id });
  
  if (!city) {
    notFound();
  }

  return <CityDetailClient city={city} />;
}