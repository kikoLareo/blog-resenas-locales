"use client";

import { useState } from 'react';
import { Clock, Users, ChefHat, Star, ChevronRight, Printer, Share2, Bookmark, Play } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { OptimizedImage } from './OptimizedImage';
import VenueCard from './VenueCard';

interface Ingredient {
  amount: string;
  unit?: string;
  ingredient: string;
  preparation?: string;
  optional: boolean;
}

interface Instruction {
  step: number;
  instruction: string;
  image?: {
    asset: { url: string };
    alt?: string;
  };
  tip?: string;
}

interface Variation {
  name: string;
  description: string;
  changes: string[];
}

interface Substitution {
  original: string;
  substitute: string;
  ratio?: string;
  notes?: string;
}

interface NutritionalInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sodium?: number;
}

interface RecipeDetailProps {
  recipe: {
    _id: string;
    title: string;
    slug: { current: string };
    description: string;
    recipeType: string;
    difficulty: 'facil' | 'intermedio' | 'avanzado';
    prepTime: number;
    cookTime: number;
    totalTime: number;
    servings: number;
    heroImage: {
      asset: { url: string };
      alt: string;
    };
    ingredients: Ingredient[];
    instructions: Instruction[];
    tips: string[];
    variations: Variation[];
    substitutions: Substitution[];
    nutritionalInfo?: NutritionalInfo;
    dietaryInfo: string[];
    relatedVenues?: Array<{
      _id: string;
      title: string;
      slug: { current: string };
      address: string;
      priceRange: string;
      images: Array<{
        asset: { url: string };
        alt: string;
      }>;
      categories: Array<{
        title: string;
        slug: { current: string };
      }>;
      city: {
        slug: { current: string };
      };
    }>;
    publishedAt: string;
  };
  className?: string;
}

export function RecipeDetail({ recipe, className = "" }: RecipeDetailProps) {
  const [servings, setServings] = useState(recipe.servings);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [showNutrition, setShowNutrition] = useState(false);

  const difficultyLabels = {
    facil: { label: 'Fácil', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', emoji: '🟢' },
    intermedio: { label: 'Intermedio', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', emoji: '🟡' },
    avanzado: { label: 'Avanzado', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', emoji: '🔴' }
  };

  const servingMultiplier = servings / recipe.servings;

  const adjustAmount = (amount: string) => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return amount;
    return (numericAmount * servingMultiplier).toString();
  };

  return (
    <article className={`max-w-4xl mx-auto ${className}`}>
      {/* Breadcrumbs */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-foreground">Inicio</Link></li>
          <ChevronRight className="h-4 w-4" />
          <li><Link href="/recetas" className="hover:text-foreground">Recetas</Link></li>
          <ChevronRight className="h-4 w-4" />
          <li className="text-foreground font-medium">{recipe.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${difficultyLabels[recipe.difficulty].color}`}>
            {difficultyLabels[recipe.difficulty].emoji} {difficultyLabels[recipe.difficulty].label}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {recipe.recipeType}
          </span>
          {recipe.dietaryInfo.map((diet) => (
            <span 
              key={diet}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            >
              {diet}
            </span>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
          {recipe.title}
        </h1>

        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          {recipe.description}
        </p>

        {/* Recipe Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-card border rounded-xl">
            <Clock className="h-6 w-6 mx-auto mb-2 text-saffron-500" />
            <div className="text-sm text-muted-foreground">Preparación</div>
            <div className="font-semibold">{recipe.prepTime} min</div>
          </div>
          <div className="text-center p-4 bg-card border rounded-xl">
            <ChefHat className="h-6 w-6 mx-auto mb-2 text-saffron-500" />
            <div className="text-sm text-muted-foreground">Cocción</div>
            <div className="font-semibold">{recipe.cookTime} min</div>
          </div>
          <div className="text-center p-4 bg-card border rounded-xl">
            <Users className="h-6 w-6 mx-auto mb-2 text-saffron-500" />
            <div className="text-sm text-muted-foreground">Porciones</div>
            <div className="font-semibold">{recipe.servings}</div>
          </div>
          <div className="text-center p-4 bg-card border rounded-xl">
            <Star className="h-6 w-6 mx-auto mb-2 text-saffron-500" />
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="font-semibold">{recipe.totalTime} min</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-8">
          <Button size="sm" variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button size="sm" variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
          <Button size="sm" variant="outline">
            <Bookmark className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8">
          <OptimizedImage
            src={recipe.heroImage.asset.url}
            alt={recipe.heroImage.alt}
            fill
            className="object-cover"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ingredients Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Servings Adjuster */}
            <div className="bg-card border rounded-2xl p-6">
              <h3 className="font-serif font-bold mb-4">Ajustar porciones</h3>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  disabled={servings <= 1}
                >
                  -
                </Button>
                <span className="text-lg font-semibold w-12 text-center">{servings}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setServings(servings + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-card border rounded-2xl p-6">
              <h3 className="font-serif font-bold mb-4">Ingredientes</h3>
              <div className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      className="mt-1 rounded border-gray-300" 
                    />
                    <div className="flex-1">
                      <span className={`${ingredient.optional ? 'text-muted-foreground' : ''}`}>
                        <span className="font-medium">
                          {adjustAmount(ingredient.amount)} {ingredient.unit}
                        </span>{' '}
                        {ingredient.ingredient}
                        {ingredient.preparation && (
                          <span className="text-muted-foreground text-sm">
                            , {ingredient.preparation}
                          </span>
                        )}
                        {ingredient.optional && (
                          <span className="text-xs text-muted-foreground ml-2">(opcional)</span>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition Info */}
            {recipe.nutritionalInfo && (
              <div className="bg-card border rounded-2xl p-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowNutrition(!showNutrition)}
                  className="w-full justify-between p-0 h-auto"
                >
                  <h3 className="font-serif font-bold">Información Nutricional</h3>
                  <ChevronRight className={`h-4 w-4 transition-transform ${showNutrition ? 'rotate-90' : ''}`} />
                </Button>
                
                {showNutrition && (
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="text-xs text-muted-foreground mb-2">Por porción:</div>
                    {recipe.nutritionalInfo.calories && (
                      <div className="flex justify-between">
                        <span>Calorías</span>
                        <span className="font-medium">{Math.round(recipe.nutritionalInfo.calories * servingMultiplier)}</span>
                      </div>
                    )}
                    {recipe.nutritionalInfo.protein && (
                      <div className="flex justify-between">
                        <span>Proteínas</span>
                        <span className="font-medium">{Math.round(recipe.nutritionalInfo.protein * servingMultiplier)}g</span>
                      </div>
                    )}
                    {recipe.nutritionalInfo.carbs && (
                      <div className="flex justify-between">
                        <span>Carbohidratos</span>
                        <span className="font-medium">{Math.round(recipe.nutritionalInfo.carbs * servingMultiplier)}g</span>
                      </div>
                    )}
                    {recipe.nutritionalInfo.fat && (
                      <div className="flex justify-between">
                        <span>Grasas</span>
                        <span className="font-medium">{Math.round(recipe.nutritionalInfo.fat * servingMultiplier)}g</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Instructions */}
          <section>
            <h2 className="text-2xl font-serif font-bold mb-6">Preparación</h2>
            <div className="space-y-6">
              {recipe.instructions.map((instruction, index) => (
                <div 
                  key={instruction.step}
                  className={`border rounded-2xl p-6 transition-all ${
                    activeStep === instruction.step 
                      ? 'border-saffron-500 bg-saffron-50 dark:bg-saffron-950' 
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      activeStep === instruction.step 
                        ? 'bg-saffron-500' 
                        : 'bg-muted-foreground'
                    }`}>
                      {instruction.step}
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <p className="text-foreground leading-relaxed">
                        {instruction.instruction}
                      </p>
                      
                      {instruction.tip && (
                        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            💡 <strong>Consejo:</strong> {instruction.tip}
                          </p>
                        </div>
                      )}
                      
                      {instruction.image && (
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                          <OptimizedImage
                            src={instruction.image.asset.url}
                            alt={instruction.image.alt || `Paso ${instruction.step}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      <Button
                        size="sm"
                        variant={activeStep === instruction.step ? "default" : "outline"}
                        onClick={() => setActiveStep(activeStep === instruction.step ? null : instruction.step)}
                      >
                        {activeStep === instruction.step ? 'Completado' : 'Marcar como hecho'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tips */}
          {recipe.tips && recipe.tips.length > 0 && (
            <section>
              <h2 className="text-2xl font-serif font-bold mb-6">Consejos y Trucos</h2>
              <div className="bg-card border rounded-2xl p-6">
                <div className="space-y-3">
                  {recipe.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-saffron-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Variations */}
          {recipe.variations && recipe.variations.length > 0 && (
            <section>
              <h2 className="text-2xl font-serif font-bold mb-6">Variaciones</h2>
              <div className="space-y-4">
                {recipe.variations.map((variation, index) => (
                  <div key={index} className="bg-card border rounded-2xl p-6">
                    <h3 className="font-semibold mb-2">{variation.name}</h3>
                    <p className="text-muted-foreground mb-3">{variation.description}</p>
                    {variation.changes && variation.changes.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Cambios necesarios:</div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {variation.changes.map((change, changeIndex) => (
                            <li key={changeIndex} className="flex items-start gap-2">
                              <span>•</span>
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Substitutions */}
          {recipe.substitutions && recipe.substitutions.length > 0 && (
            <section>
              <h2 className="text-2xl font-serif font-bold mb-6">Sustituciones</h2>
              <div className="bg-card border rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-semibold">Ingrediente Original</th>
                      <th className="text-left p-4 font-semibold">Sustituto</th>
                      <th className="text-left p-4 font-semibold">Proporción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipe.substitutions.map((sub, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-4 font-medium">{sub.original}</td>
                        <td className="p-4">{sub.substitute}</td>
                        <td className="p-4">{sub.ratio || '1:1'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Where to try it */}
      {recipe.relatedVenues && recipe.relatedVenues.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-serif font-bold mb-6">Dónde probarlo</h2>
          <p className="text-muted-foreground mb-6">
            Si prefieres probarlo antes de hacerlo en casa, estos locales lo preparan de forma excepcional:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipe.relatedVenues.map((venue) => (
              <VenueCard
                key={venue._id}
                venue={{
                  ...venue,
                  city: {
                    ...venue.city,
                    _id: venue.city.slug.current,
                    title: venue.city.slug.current
                  },
                  priceRange: venue.priceRange as '€' | '€€' | '€€€' | '€€€€',
                  images: venue.images.map(img => ({
                    ...img,
                    _type: 'image' as const,
                    asset: {
                      _id: img.asset?.url || '',
                      url: img.asset?.url || '',
                      metadata: {
                        dimensions: {
                          width: 800,
                          height: 600,
                          aspectRatio: 800/600
                        }
                      }
                    }
                  })),
                  categories: venue.categories.map(cat => ({
                    ...cat,
                    _id: cat.slug.current
                  })),
                  schemaType: 'Restaurant' as const
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-12 border-t pt-6 text-sm text-muted-foreground">
        <p>
          Receta publicada: {new Date(recipe.publishedAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </footer>
    </article>
  );
}
