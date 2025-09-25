import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/lib/sanity.client';
import { RecipeDetail } from '@/components';
import { generateRecipeSchema } from '@/lib/seo-schemas';
import { SITE_CONFIG } from '@/lib/constants';

// GROQ query for recipe data
const recipeQuery = `
  *[_type == "recipe" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    recipeType,
    difficulty,
    prepTime,
    cookTime,
    totalTime,
    servings,
    heroImage{
      asset->{url},
      alt
    },
    ingredients,
    instructions,
    tips,
    variations,
    substitutions,
    nutritionalInfo,
    dietaryInfo,
    relatedVenues[]->{
      _id,
      title,
      slug,
      address,
      priceRange,
      images[]{
        asset->{url},
        alt
      },
      categories[]->{
        title,
        slug
      },
      city->{
        slug
      }
    },
    publishedAt,
    published
  }
`;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const recipe = await sanityFetch<any>({
    query: recipeQuery,
    params: { slug },
    revalidate: 3600,
    tags: ['recipe'],
  }).catch(() => null);

  if (!recipe || !recipe.published) {
    return {
      title: 'Receta no encontrada',
      description: 'La receta que buscas no existe o no está disponible.',
    };
  }

  const difficultyLabels: Record<string, string> = {
    facil: 'Fácil',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado'
  };

  const difficultyLabel = difficultyLabels[recipe.difficulty] || 'Intermedio';
  const seoTitle = recipe.seoTitle || `${recipe.title} - Receta ${difficultyLabel} | ${SITE_CONFIG.name}`;
  const seoDescription = recipe.seoDescription || 
    `${recipe.description} Receta ${difficultyLabel} con ${recipe.ingredients?.length || 0} ingredientes. ⏱️ ${recipe.totalTime} min total.`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      recipe.title.split(' '),
      recipe.recipeType,
      recipe.difficulty,
      'receta',
      'cocina',
      'ingredientes',
      ...(recipe.dietaryInfo || []),
      ...(recipe.keywords || [])
    ].flat().filter(Boolean),
    alternates: {
      canonical: `${SITE_CONFIG.url}/recetas/${slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'article',
      url: `${SITE_CONFIG.url}/recetas/${slug}`,
      images: [
        {
          url: recipe.heroImage.asset.url,
          width: 1200,
          height: 630,
          alt: recipe.heroImage.alt,
        },
      ],
      publishedTime: recipe.publishedAt,
      authors: [SITE_CONFIG.name],
      section: 'Recetas',
      tags: [recipe.recipeType, recipe.difficulty, ...(recipe.dietaryInfo || [])],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [recipe.heroImage.asset.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;

  const recipe = await sanityFetch<any>({
    query: recipeQuery,
    params: { slug },
    revalidate: 3600,
    tags: ['recipe'],
  }).catch(() => null);

  if (!recipe || !recipe.published) {
    notFound();
  }

  // Generate JSON-LD schemas
  const schemas = generateRecipeSchema({
    title: recipe.title,
    description: recipe.description,
    url: `${SITE_CONFIG.url}/recetas/${slug}`,
    image: recipe.heroImage.asset.url,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    totalTime: recipe.totalTime,
    servings: recipe.servings,
    ingredients: recipe.ingredients || [],
    instructions: recipe.instructions || [],
    nutritionalInfo: recipe.nutritionalInfo,
    publishedAt: recipe.publishedAt,
  });

  return (
    <>
      {/* Inject JSON-LD schemas */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
        />
      ))}
      
      <RecipeDetail recipe={recipe} />
    </>
  );
}

// Generate static params for build time
export async function generateStaticParams() {
  // In a real implementation, you would fetch all published recipes
  return [];
}
