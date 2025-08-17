"use client";

import { Star, MapPin, Clock, Calendar, Share2, Bookmark, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ReviewBreadcrumbs } from "./ReviewBreadcrumbs";

const reviewData = {
  "experiencia-unica-en-el-restaurante-mas-moderno-de-la-ciudad": {
    id: "1",
    title: "Experiencia única en el restaurante más moderno de la ciudad",
    subtitle: "Una joya gastronómica en el corazón de Madrid",
    category: "Restaurantes",
    city: "Madrid",
    location: "Centro, Madrid",
    address: "Calle de la Gastronomía, 45, 28001 Madrid",
    rating: 4.8,
    readTime: "5 min",
    publishDate: "16 Agosto 2025",
    author: "María González",
    authorImage: "https://images.unsplash.com/photo-1494790108775-e6ec15a3ba47?w=100&h=100&fit=crop&crop=face",
    heroImage:
      "https://images.unsplash.com/photo-1669131196140-49591336b13e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBtb2Rlcm58ZW58MXx8fHwxNzU1MzU1MDcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    images: [
      "https://images.unsplash.com/photo-1750943082020-4969b2a63084?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGxhdGluZyUyMGdvdXJtZXR8ZW58MXx8fHwxNzU1MzU1MDcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1563245738-9169ff58eccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU1MjgwNjI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    tags: ["Moderno", "Fine Dining", "Ambiente", "Innovación", "Madrid"],
    content: `
      <p class="lead">Desde el momento en que crucé la puerta de este extraordinario restaurante, supe que me esperaba una experiencia gastronómica única. El diseño interior es una obra de arte en sí mismo, combinando elementos modernos con toques industriales que crean una atmósfera sofisticada pero acogedora.</p>
      <h2>Un ambiente que cautiva</h2>
      <p>El restaurante logra algo muy difícil: crear un espacio que impresiona sin intimidar. Las líneas limpias del diseño, la iluminación cuidadosamente estudiada y la disposición inteligente de las mesas generan una sensación de intimidad incluso en las horas de mayor afluencia.</p>
      <p>Los detalles importan aquí: desde la vajilla de diseño exclusivo hasta las servilletas de lino, todo ha sido pensado para crear una experiencia sensorial completa.</p>
      <h2>Gastronomía de vanguardia</h2>
      <p>La carta es un viaje culinario que desafía las expectativas. Cada plato es una composición artística que equilibra sabores, texturas y presentación de manera magistral.</p>
      <blockquote>"Cada bocado es una revelación, una explosión de sabores que cuenta una historia diferente."</blockquote>
      <p>Destaco especialmente el menú degustación, que permite experimentar la visión completa del chef. Los maridajes de vinos complementan perfectamente cada plato.</p>
      <h2>Servicio impecable</h2>
      <p>El equipo de sala demuestra un conocimiento excepcional tanto de los platos como de los vinos. Su atención es discreta pero atenta.</p>
    `,
    verdict: { food: 5, service: 5, atmosphere: 5, value: 4, overall: 4.8 },
    pros: [
      "Diseño interior excepcional",
      "Gastronomía innovadora y ejecutada a la perfección",
      "Servicio profesional y conocedor",
      "Experiencia gastronómica integral",
    ],
    cons: ["Precios elevados", "Necesaria reserva con mucha antelación"],
  },
};

type ReviewDetailProps = {
  slug?: string;
  onBack?: () => void;
  // Datos reales desde Sanity (parcialmente tipados para flexibilidad)
  review?: {
    title: string;
    tldr?: string;
    publishedAt?: string;
    ratings?: { food: number; service: number; ambience: number; value: number };
    pros?: string[];
    cons?: string[];
    faq?: { question: string; answer: string }[];
    gallery?: Array<{ asset?: { url?: string } }>;
    author?: string;
    authorAvatar?: { asset?: { url?: string } };
    venue?: {
      title: string;
      address?: string;
      city?: { title: string };
      categories?: Array<{ title: string }>; 
    };
  } | null;
};

export function ReviewDetail({ slug, onBack, review: reviewFromSanity }: ReviewDetailProps) {
  // Adaptar datos si vienen de Sanity
  if (reviewFromSanity) {
    const avg10 = reviewFromSanity.ratings
      ? (reviewFromSanity.ratings.food + reviewFromSanity.ratings.service + reviewFromSanity.ratings.ambience + reviewFromSanity.ratings.value) / 4
      : 0;
    const rating5 = Math.round(((avg10 / 10) * 5) * 10) / 10;
    const heroImage = reviewFromSanity.gallery?.[0]?.asset?.url;

    const adapted = {
      id: 'sanity',
      title: reviewFromSanity.title,
      subtitle: reviewFromSanity.tldr || '',
      category: reviewFromSanity.venue?.categories?.[0]?.title || 'Reseñas',
      city: reviewFromSanity.venue?.city?.title || '',
      location: reviewFromSanity.venue?.city?.title || '',
      address: reviewFromSanity.venue?.address || '',
      rating: rating5 || 4.5,
      readTime: '5 min',
      publishDate: reviewFromSanity.publishedAt ? new Date(reviewFromSanity.publishedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '',
      author: reviewFromSanity.author || 'Equipo',
      authorImage: reviewFromSanity.authorAvatar?.asset?.url || '',
      heroImage: heroImage || '',
      images: (reviewFromSanity.gallery || []).map((g) => g.asset?.url).filter(Boolean) as string[],
      tags: reviewFromSanity.venue?.categories?.map((c) => c.title) || [],
      content: `<p class=\"lead\">${reviewFromSanity.tldr || ''}</p>`,
      verdict: {
        food: reviewFromSanity.ratings?.food || 0,
        service: reviewFromSanity.ratings?.service || 0,
        atmosphere: reviewFromSanity.ratings?.ambience || 0,
        value: reviewFromSanity.ratings?.value || 0,
        overall: rating5 || 4.5,
      },
      pros: reviewFromSanity.pros || [],
      cons: reviewFromSanity.cons || [],
    };

    return (
      <article className="min-h-screen bg-white">
        <ReviewBreadcrumbs category={adapted.category} city={adapted.city} reviewTitle={adapted.title} />
        <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
          {adapted.heroImage && (
            <ImageWithFallback src={adapted.heroImage} alt={adapted.title} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="relative -mt-32 z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-t-3xl p-8 md:p-12 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm mb-4 font-medium">{adapted.category}</div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-gray-900 letter-tight">{adapted.title}</h1>
                  {adapted.subtitle && <p className="text-xl text-gray-600 mb-6 font-normal">{adapted.subtitle}</p>}
                  <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><span className="font-semibold">{adapted.rating}</span></div>
                    {adapted.location && <div className="flex items-center space-x-1"><MapPin className="h-4 w-4" /><span>{adapted.location}</span></div>}
                    {adapted.readTime && <div className="flex items-center space-x-1"><Clock className="h-4 w-4" /><span>{adapted.readTime}</span></div>}
                    {adapted.publishDate && <div className="flex items-center space-x-1"><Calendar className="h-4 w-4" /><span>{adapted.publishDate}</span></div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white -mt-8 rounded-b-3xl p-8 md:p-12 shadow-2xl">
              <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-100">
                {adapted.authorImage && (
                  <ImageWithFallback src={adapted.authorImage} alt={adapted.author} className="w-12 h-12 rounded-full object-cover" />
                )}
                <div>
                  <p className="font-semibold text-gray-900">{adapted.author}</p>
                </div>
              </div>
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: adapted.content }} />
              {adapted.images?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                  {adapted.images.map((image: string, index: number) => (
                    <div key={index} className="rounded-xl overflow-hidden">
                      <ImageWithFallback src={image} alt={`${adapted.title} - Imagen ${index + 1}`} className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              )}
              <Separator className="my-12" />
              <div className="bg-gray-50 rounded-xl p-8">
                <h3 className="text-2xl font-semibold mb-6 text-center text-gray-900 letter-tight">Veredicto Final</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-6">
                  <div className="text-center"><div className="text-2xl font-bold text-accent">{adapted.verdict.food}</div><div className="text-sm text-gray-500">Comida</div></div>
                  <div className="text-center"><div className="text-2xl font-bold text-accent">{adapted.verdict.service}</div><div className="text-sm text-gray-500">Servicio</div></div>
                  <div className="text-center"><div className="text-2xl font-bold text-accent">{adapted.verdict.atmosphere}</div><div className="text-sm text-gray-500">Ambiente</div></div>
                  <div className="text-center"><div className="text-2xl font-bold text-accent">{adapted.verdict.value}</div><div className="text-sm text-gray-500">Relación C/P</div></div>
                  <div className="text-center md:col-span-1 col-span-2"><div className="text-3xl font-bold text-accent">{adapted.verdict.overall}</div><div className="text-sm text-gray-500">Puntuación Final</div></div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {adapted.pros?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">Lo mejor</h4>
                      <ul className="space-y-2">
                        {adapted.pros.map((pro: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2"><span className="text-green-600">✓</span><span className="text-sm text-gray-700">{pro}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {adapted.cons?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-orange-600">A mejorar</h4>
                      <ul className="space-y-2">
                        {adapted.cons.map((con: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2"><span className="text-orange-600">−</span><span className="text-sm text-gray-700">{con}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              {adapted.address && (
                <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold mb-2 text-gray-900">📍 Ubicación</h4>
                  <p className="text-gray-600">{adapted.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  const review = (reviewData as Record<string, any>)[slug as string];

  if (!review) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1>Reseña no encontrada</h1>
        {onBack && (
          <Button onClick={onBack} className="mt-4">
            Volver al inicio
          </Button>
        )}
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">
      <ReviewBreadcrumbs category={review.category} city={review.city} reviewTitle={review.title} />
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <ImageWithFallback src={review.heroImage} alt={review.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="relative -mt-32 z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-t-3xl p-8 md:p-12 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm mb-4 font-medium">{review.category}</div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-gray-900 letter-tight">{review.title}</h1>
                <p className="text-xl text-gray-600 mb-6 font-normal">{review.subtitle}</p>
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><span className="font-semibold">{review.rating}</span></div>
                  <div className="flex items-center space-x-1"><MapPin className="h-4 w-4" /><span>{review.location}</span></div>
                  <div className="flex items-center space-x-1"><Clock className="h-4 w-4" /><span>{review.readTime}</span></div>
                  <div className="flex items-center space-x-1"><Calendar className="h-4 w-4" /><span>{review.publishDate}</span></div>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {review.tags.map((tag: string, index: number) => (
                    <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex justify-center gap-4 mt-8">
                  <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 hover:bg-gray-50"><Share2 className="mr-2 h-4 w-4" />Compartir</Button>
                  <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 hover:bg-gray-50"><Bookmark className="mr-2 h-4 w-4" />Guardar</Button>
                  <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 hover:bg-gray-50"><Heart className="mr-2 h-4 w-4" />Me gusta</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white -mt-8 rounded-b-3xl p-8 md:p-12 shadow-2xl">
            <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-100">
              <ImageWithFallback src={review.authorImage} alt={review.author} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-gray-900">{review.author}</p>
                <p className="text-sm text-gray-500">Food Critic & Writer</p>
              </div>
            </div>
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: review.content }} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
              {review.images.map((image: string, index: number) => (
                <div key={index} className="rounded-xl overflow-hidden">
                  <ImageWithFallback src={image} alt={`${review.title} - Imagen ${index + 1}`} className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
            <Separator className="my-12" />
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-2xl font-semibold mb-6 text-center text-gray-900 letter-tight">Veredicto Final</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-6">
                <div className="text-center"><div className="text-2xl font-bold text-accent">{review.verdict.food}</div><div className="text-sm text-gray-500">Comida</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-accent">{review.verdict.service}</div><div className="text-sm text-gray-500">Servicio</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-accent">{review.verdict.atmosphere}</div><div className="text-sm text-gray-500">Ambiente</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-accent">{review.verdict.value}</div><div className="text-sm text-gray-500">Relación C/P</div></div>
                <div className="text-center md:col-span-1 col-span-2"><div className="text-3xl font-bold text-accent">{review.verdict.overall}</div><div className="text-sm text-gray-500">Puntuación Final</div></div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">Lo mejor</h4>
                  <ul className="space-y-2">
                    {review.pros.map((pro: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2"><span className="text-green-600">✓</span><span className="text-sm text-gray-700">{pro}</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-orange-600">A mejorar</h4>
                  <ul className="space-y-2">
                    {review.cons.map((con: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2"><span className="text-orange-600">−</span><span className="text-sm text-gray-700">{con}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-12 p-6 bg-gray-50 rounded-xl">
              <h4 className="font-semibold mb-2 text-gray-900">📍 Ubicación</h4>
              <p className="text-gray-600">{review.address}</p>
              <div className="mt-4 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Mapa interactivo (Google Maps)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}


