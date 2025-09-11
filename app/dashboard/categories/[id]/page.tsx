import { adminSanityClient } from "@/lib/admin-sanity";
import { categoryByIdQuery } from "@/lib/admin-queries";
import { notFound } from "next/navigation";
import CategoryDetailClient from "./CategoryDetailClient";

interface CategoryDetailPageProps {
  params: Promise<{ id: string }>;
}

interface CategoryWithDetails {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  icon?: string;
  color?: string;
  featured?: boolean;
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
    city: {
      title: string;
      slug: { current: string };
    };
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

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const resolvedParams = await params;
  const category = await adminSanityClient.fetch<CategoryWithDetails>(categoryByIdQuery, { id: resolvedParams.id });
  
  if (!category) {
    notFound();
  }

  return <CategoryDetailClient category={category} />;
}