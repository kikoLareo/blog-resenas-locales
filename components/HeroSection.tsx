"use client";

import { ChevronLeft, ChevronRight, Star, MapPin, Clock, MoveHorizontal } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";    
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";

// Definiciones CSS para animaciones personalizadas
import './hero-swipe-animations.css';
const heroReviews = [
  {
    id: "1",
    title: "Alta cocina moderna en Centro, Madrid",
    subtitle: "Diseño vanguardista y platos que sorprenden en cada bocado, ideal para ocasiones especiales.",
    image: "https://images.unsplash.com/photo-1669131196140-49591336b13e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBtb2Rlcm58ZW58MXx8fHwxNzU1MzU1MDcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.8,
    location: "Centro, Madrid",
    readTime: "5 min",
    tags: ["Moderno", "Fine Dining", "Ambiente"],
    description: "Un lugar que redefine la experiencia gastronómica con su diseño vanguardista y platos innovadores que sorprenden en cada bocado.",
    ctaText: "Descubre la experiencia completa",
    seoKeywords: "mejor restaurante moderno Madrid, fine dining Centro Madrid, restaurante innovador Madrid",
    content: {
      summary: "Después de múltiples visitas, puedo confirmar que este restaurante representa lo mejor de la gastronomía moderna en Madrid.",
      highlights: [
        "Diseño interior impresionante con elementos arquitectónicos únicos",
        "Carta de temporada que cambia cada tres meses",
        "Servicio excepcional con personal altamente capacitado",
        "Experiencia gastronómica que justifica cada euro invertido"
      ],
      atmosphere: "El ambiente es sofisticado sin ser pretencioso. La iluminación tenue, combinada con la música jazz de fondo, crea la atmósfera perfecta para una cena memorable.",
      recommendation: "Ideal para ocasiones especiales, cenas de negocios o cuando quieres impresionar. Reserva con al menos una semana de antelación."
    }
  },
  {
    id: "2",
    title: "Pizza napolitana auténtica en Malasaña",
    subtitle: "Masa fermentada 48 horas e ingredientes italianos DOP en el rincón más auténtico de Madrid.",
    image: "https://images.unsplash.com/photo-1563245738-9169ff58eccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU1MjgwNjI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.9,
    location: "Malasaña, Madrid",
    readTime: "4 min",
    tags: ["Pizza", "Artesanal", "Italiano"],
    description: "Masa fermentada 48 horas, ingredientes importados directamente de Italia y un horno de leña que hace magia.",
    ctaText: "Ver menú y reseña completa",
    seoKeywords: "mejor pizza napolitana Madrid, pizzería italiana Malasaña, pizza artesanal auténtica Madrid",
    content: {
      summary: "Un rincón de Italia auténtica en el corazón de Malasaña que ha conquistado a todos los amantes de la pizza de verdad.",
      highlights: [
        "Masa fermentada durante 48 horas para máxima digestibilidad",
        "Ingredientes DOP importados directamente de Italia",
        "Horno de leña napolitano que alcanza 450°C",
        "Pizzaiolos formados en Nápoles"
      ],
      atmosphere: "Local pequeño y acogedor con decoración italiana tradicional. Las mesas se llenan rápido, especialmente los fines de semana.",
      recommendation: "La Margherita es perfecta para probar la calidad de la masa. Para algo más especial, la Quattro Formaggi es espectacular. ¡No te vayas sin probar el tiramisú!"
    }
  },
  {
    id: "3",
    title: "Café con encanto en La Latina, Madrid",
    subtitle: "Descubre un rincón ideal para brunch y café de especialidad en el corazón del barrio.",
    image: "https://images.unsplash.com/photo-1709380146579-e46f2736650a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwZXh0ZXJpb3IlMjBzdHJlZXR8ZW58MXx8fHwxNzU1MzU1MDcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.6,
    location: "La Latina, Madrid",
    readTime: "3 min",
    tags: ["Café", "Brunch", "Terraza"],
    description: "El lugar perfecto para disfrutar de un café de especialidad mientras observas la vida del barrio pasar.",
    ctaText: "Dónde probarlo",
    seoKeywords: "mejor café La Latina Madrid, brunch recomendado Madrid, cafetería especialidad La Latina",
    content: {
      summary: "Un oasis urbano donde el tiempo parece detenerse. Perfecto para trabajar, leer o simplemente desconectar.",
      highlights: [
        "Café de especialidad tostado localmente",
        "Terraza perfecta para cualquier época del año",
        "Wifi gratuito y ambiente ideal para trabajar",
        "Brunch de fin de semana con opciones veganas"
      ],
      atmosphere: "Decoración bohemia con plantas por doquier. El sonido de la máquina de café y las conversaciones crean una banda sonora urbana perfecta.",
      recommendation: "Ideal para una pausa matutina o una tarde de trabajo. Los domingos el brunch está espectacular, especialmente las tostadas de aguacate."
    }
  },
  {
    id: "4",
    title: "Tapas gourmet en Chamberí",
    subtitle: "Reinterpretación moderna de tapas tradicionales en un ambiente acogedor.",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXBhcyUyMHNwYW5pc2h8ZW58MHx8fHwxNzE0NzA4MjgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    location: "Chamberí, Madrid",
    readTime: "4 min",
    tags: ["Tapas", "Gourmet", "Vino"],
    description: "Tapas clásicas reinventadas con toques modernos y una extensa carta de vinos españoles en el elegante barrio de Chamberí.",
    ctaText: "Ver carta completa",
    seoKeywords: "tapas gourmet Madrid, mejor bar tapas Chamberí, vinos españoles Madrid",
    content: {
      summary: "Un local que ha conseguido elevar las tapas tradicionales a la categoría de alta cocina sin perder la esencia del tapeo español.",
      highlights: [
        "Tapas tradicionales con presentaciones innovadoras",
        "Más de 50 referencias de vinos españoles",
        "Ingredientes de proximidad y temporada",
        "Barra donde ver la preparación de platos"
      ],
      atmosphere: "Elegante pero informal, con una decoración que combina elementos tradicionales y modernos. La barra es el centro neurálgico donde se aprecia la maestría de los cocineros.",
      recommendation: "No te pierdas su versión de la tortilla española y las croquetas de jamón ibérico. Ideal para compartir múltiples platos."
    }
  },
  {
    id: "5",
    title: "Cocina asiática fusión en Chueca",
    subtitle: "Un viaje culinario por Asia con influencias mediterráneas en pleno centro de Madrid.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxhc2lhbiUyMGZ1c2lvbiUyMHJlc3RhdXJhbnR8ZW58MHx8fHwxNzE0NzA4NTU0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.5,
    location: "Chueca, Madrid",
    readTime: "5 min",
    tags: ["Asiático", "Fusión", "Cocktails"],
    description: "Sabores de Japón, Tailandia y China fusionados con técnicas mediterráneas en un espacio moderno y vibrante.",
    ctaText: "Explorar el menú",
    seoKeywords: "restaurante asiático fusión Madrid, cocina japonesa Chueca, mejor restaurante asiático Madrid",
    content: {
      summary: "Un espacio gastronómico que rompe las fronteras entre la cocina asiática tradicional y los sabores mediterráneos.",
      highlights: [
        "Sushi con toques mediterráneos único en Madrid",
        "Dim sum artesanal de autor",
        "Cocktails inspirados en la ruta de la seda",
        "Menú degustación con maridaje incluido"
      ],
      atmosphere: "Decoración minimalista con influencias japonesas y toques de color. La música electrónica suave y la iluminación indirecta crean un ambiente contemporáneo y dinámico.",
      recommendation: "Imprescindible probar su gyoza de gambas al ajillo y el tartar de atún con aguacate y mango. La experiencia del menú degustación completo vale cada céntimo."
    }
  },
  {
    id: "6",
    title: "Mercado gastronómico en Lavapiés",
    subtitle: "Un espacio multicultural con puestos de comida internacional en el barrio más diverso de Madrid.",
    image: "https://images.unsplash.com/photo-1568031813264-d394c5d474b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXQlMjBmb29kJTIwaGFsbHxlbnwwfHx8fDE3MTQ3MDkxNjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.4,
    location: "Lavapiés, Madrid",
    readTime: "6 min",
    tags: ["Mercado", "Internacional", "Street Food"],
    description: "Un viaje gastronómico alrededor del mundo sin salir de Madrid, con más de 20 puestos de comida de diferentes culturas.",
    ctaText: "Descubrir puestos y horarios",
    seoKeywords: "mercado gastronómico Lavapiés, food market Madrid, comida internacional Madrid",
    content: {
      summary: "La diversidad cultural de Lavapiés concentrada en un espacio donde disfrutar de la mejor comida callejera internacional.",
      highlights: [
        "Más de 20 puestos gastronómicos de 5 continentes",
        "Eventos musicales y culturales semanales",
        "Talleres de cocina internacional",
        "Zona común con capacidad para 200 personas"
      ],
      atmosphere: "Bullicioso y cosmopolita, con una energía vibrante típica de los mercados internacionales. Mesas compartidas que fomentan la socialización entre desconocidos.",
      recommendation: "Ideal para grupos con diferentes gustos culinarios. No te pierdas los puestos de comida venezolana, coreana y etíope que son difíciles de encontrar en otros lugares de Madrid."
    }
  }
];

// Interfaz para los datos de las reseñas del carrusel
interface HeroReview {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  rating: number;
  location: string;
  readTime: string;
  tags: string[];
  description: string;
  ctaText?: string;
  seoKeywords?: string;
  content: {
    summary: string;
    highlights: string[];
    atmosphere: string;
    recommendation: string;
  }
}

interface HeroSectionProps {
  onReviewClick?: (reviewId: string) => void;
  reviews?: HeroReview[]; // Para datos reales en lugar de los ejemplos
}

export function HeroSection({ onReviewClick, reviews }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedTextIndex, setDisplayedTextIndex] = useState(0); // Índice separado para el texto
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailsContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailsRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  
  // Usar reviews proporcionadas o datos de ejemplo como fallback
  const displayReviews = reviews || heroReviews;

  const changeSlide = useCallback((newIndex: number) => {
    if (isTransitioning || newIndex === currentIndex) return;
    
    setIsTransitioning(true);
    
    // Primero hacemos una transición a opacidad 0 del texto actual
    setTimeout(() => {
      // Una vez que el texto está invisible, actualizamos la imagen y el índice
      setCurrentIndex(newIndex);
      setDisplayedTextIndex(newIndex);
      
      // Esperamos un poco para que el DOM se actualice
      setTimeout(() => {
        // Finalmente terminamos la transición
        setIsTransitioning(false);
      }, 150);
    }, 300);
    
    // Centra automáticamente la miniatura seleccionada
    if (thumbnailsContainerRef.current && thumbnailsRefs.current[newIndex]) {
      const container = thumbnailsContainerRef.current;
      const thumbnail = thumbnailsRefs.current[newIndex];
      const containerWidth = container.offsetWidth;
      const thumbnailLeft = thumbnail.offsetLeft;
      const thumbnailWidth = thumbnail.offsetWidth;
      
      // Calcula la posición para centrar la miniatura
      const scrollLeft = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, isTransitioning]);

  const nextSlide = useCallback(() => {
    const newIndex = (currentIndex + 1) % displayReviews.length;
    changeSlide(newIndex);
  }, [currentIndex, displayReviews.length, changeSlide]);

  const prevSlide = useCallback(() => {
    const newIndex = (currentIndex - 1 + displayReviews.length) % displayReviews.length;
    changeSlide(newIndex);
  }, [currentIndex, displayReviews.length, changeSlide]);

  const goToSlide = useCallback((index: number) => {
    changeSlide(index);
  }, [changeSlide]);
  
  // Manejadores de eventos táctiles para swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    setTouchStartX(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX || isTransitioning) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;
    
    // Definir umbral para cambio de slide (20% del ancho de la pantalla o 80px mínimo)
    const threshold = Math.max(80, window.innerWidth * 0.2);
    
    if (diffX > threshold) {
      // Swipe derecha -> slide anterior
      prevSlide();
    } else if (diffX < -threshold) {
      // Swipe izquierda -> slide siguiente
      nextSlide();
    }
    
    setTouchStartX(null);
  };
  
  // Efecto para manejar eventos de teclado (accesibilidad)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      else if (e.key === 'ArrowRight') nextSlide();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextSlide, prevSlide]);

  // Efecto para sincronizar el índice de texto cuando el componente se monta inicialmente
  useEffect(() => {
    setDisplayedTextIndex(currentIndex);
  }, [currentIndex]);

  // Auto-advance slides every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        const newIndex = (currentIndex + 1) % displayReviews.length;
        changeSlide(newIndex);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [currentIndex, isTransitioning, changeSlide, displayReviews.length]);

  return (
    <section className="relative" itemScope itemType="https://schema.org/ItemList">
      <meta itemProp="itemListOrder" content="https://schema.org/ItemListOrderDescending" />
      <meta itemProp="numberOfItems" content={`${displayReviews.length}`} />
      
      {/* Enhanced SEO: Open Graph datos para redes sociales */}
      <meta property="og:title" content={`${displayReviews[displayedTextIndex].title} - Blog Reseñas Locales`} />
      <meta property="og:description" content={displayReviews[displayedTextIndex].subtitle || displayReviews[displayedTextIndex].description} />
      <meta property="og:image" content={displayReviews[currentIndex].image} />
      <meta property="og:type" content="article" />
      <meta property="og:locale" content="es_ES" />
      <meta name="twitter:card" content="summary_large_image" />
      
      {/* Anuncio para lectores de pantalla cuando cambia el slide */}
      <div className="sr-only" aria-live="polite">
        {`Mostrando reseña ${currentIndex + 1} de ${displayReviews.length}: ${displayReviews[displayedTextIndex].title}`}
      </div>
      
      {/* Full Width Hero Banner */}
      <div className="relative h-screen w-full overflow-hidden" role="banner">
        {/* Background Images with smooth transitions */}
        <div className="absolute inset-0">
          {displayReviews.map((review, index) => (
            <div
              key={review.id}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <ImageWithFallback
                src={review.image}
                alt={review.title}
                className="w-full h-full object-cover transition-transform duration-1500 scale-110"
                fill
                priority={index === 0}
                sizes="100vw"
                quality={90}
              />
            </div>
          ))}
          {/* Enhanced gradient overlay for better text contrast on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 transition-opacity duration-500" />
        </div>

        {/* Content Overlay with simplified design similar to reference */}
        <div className="relative h-full flex flex-col justify-end">
          <div className="container mx-auto px-6 mb-28 md:mb-36">
            {/* Simplified content similar to reference image */}
            <div className={`max-w-xl text-white transition-all duration-300 ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}>
              <div itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <meta itemProp="position" content={`${currentIndex + 1}`} />
                <div itemProp="item" itemScope itemType="https://schema.org/Review">
                  <div itemScope itemType="https://schema.org/LocalBusiness" itemProp="itemReviewed">
                    {/* Title - larger and more prominent */}
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight" itemProp="name">
                      {displayReviews[displayedTextIndex].title}
                    </h2>
                    <meta itemProp="image" content={displayReviews[currentIndex].image} />
                    
                    {/* Star rating inline with title */}
                    <div className="flex items-center mb-3">
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-6 w-6 ${i < Math.floor(displayReviews[displayedTextIndex].rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-base text-white/80">{displayReviews[displayedTextIndex].rating}</span>
                    </div>
                    
                    {/* Description - simpler and cleaner */}
                    <p className="text-lg text-white/90 mb-8 line-clamp-3" itemProp="description">
                      {displayReviews[displayedTextIndex].description}
                    </p>
                    
                    {/* Hidden SEO keywords for search engines */}
                    {displayReviews[displayedTextIndex].seoKeywords && (
                      <span className="hidden" aria-hidden="true">
                        {displayReviews[displayedTextIndex].seoKeywords}
                      </span>
                    )}
                    
                    <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                      <meta itemProp="ratingValue" content={`${displayReviews[displayedTextIndex].rating}`} />
                      <meta itemProp="reviewCount" content="1" />
                      <meta itemProp="bestRating" content="5" />
                      <meta itemProp="worstRating" content="1" />
                    </div>
                    
                    <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                      <meta itemProp="addressLocality" content={displayReviews[displayedTextIndex].location} />
                      <meta itemProp="addressRegion" content={displayReviews[displayedTextIndex].location.split(',')[1]?.trim() || "Madrid"} />
                      <meta itemProp="addressCountry" content="ES" />
                    </div>
                    
                    {/* Add schema.org type based on review tags */}
                    {displayReviews[displayedTextIndex].tags.includes("Café") && (
                      <meta itemProp="@type" content="CafeOrCoffeeShop" />
                    )}
                    {displayReviews[displayedTextIndex].tags.includes("Pizza") && (
                      <meta itemProp="@type" content="FastFoodRestaurant" />
                    )}
                    {displayReviews[displayedTextIndex].tags.includes("Fine Dining") && (
                      <meta itemProp="@type" content="Restaurant" />
                    )}
                    
                    {/* Add meta for opening hours if available */}
                    <meta itemProp="openingHours" content="Mo-Su 09:00-23:00" />
                    <meta itemProp="priceRange" content="€€" />
                  </div>
                  
                  <meta itemProp="author" content="Blog Reseñas Locales" />
                  <meta itemProp="datePublished" content={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              
              {/* Mobile-optimized badges - max 2 lines */}
              <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2 text-base transition-all duration-300 hover:bg-white/30">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{displayReviews[displayedTextIndex].rating}</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2 text-base transition-all duration-300 hover:bg-white/30">
                  <MapPin className="h-5 w-5" />
                  <span>{displayReviews[displayedTextIndex].location}</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2 text-base transition-all duration-300 hover:bg-white/30">
                  <Clock className="h-5 w-5" />
                  <span>{displayReviews[displayedTextIndex].readTime}</span>
                </div>
              </div>
              
              {/* Simplified CTA Button */}
              <Button 
                size="lg" 
                className="bg-orange-500 text-white hover:bg-orange-600 font-medium px-8 py-4 text-lg transition-all duration-300 hover:scale-105 transform rounded-lg shadow-lg"
                onClick={() => onReviewClick?.(displayReviews[displayedTextIndex].id)}
                aria-label={`Ver reseña de ${displayReviews[displayedTextIndex].title}`}
              >
                {displayReviews[displayedTextIndex].ctaText || "Ver reseña completa"}
              </Button>
            </div>
          </div>
        </div>

        {/* Thumbnail container with scroll - showing only 3 visible items */}
        <div className="absolute bottom-24 sm:bottom-16 md:bottom-20 right-1/2 transform translate-x-1/2 md:right-8 md:translate-x-0 z-20">
          <div className="relative">
            {/* Container for thumbnails with dynamic width based on number of items (max 3) */}
            <div 
                className={`relative overflow-hidden bg-black/20 backdrop-blur-sm rounded-lg p-1 ${
                  displayReviews.length > 3 ? 'w-72 md:w-80' : ''
                }`}
                style={{ 
                  maxWidth: 'calc(100vw - 30px)',
                  // Si hay 3 o menos elementos, ajustar el ancho exacto para esos elementos
                  width: displayReviews.length <= 3 
                    ? `calc(${displayReviews.length} * (var(--thumbnail-width) + 12px) + 32px)` // thumbnail + espacio + padding
                    : undefined,
                  // Variables CSS para responsive
                  '--thumbnail-width': 'clamp(80px, 5vw, 88px)'
                } as React.CSSProperties}>
              {/* Scrollable container */}
              <div 
                ref={thumbnailsContainerRef}
                className="flex space-x-3 px-4 py-2 hide-scrollbar"
                style={{
                  scrollBehavior: 'smooth',
                  paddingBottom: '12px', // Space for progress bar
                  // Deshabilitar scroll si hay 3 o menos elementos
                  overflowX: displayReviews.length <= 3 ? 'hidden' : 'auto'
                }}
              >
                {displayReviews.map((review, index) => (
                  <button 
                    key={index}
                    ref={el => {
                      thumbnailsRefs.current[index] = el;
                    }}
                    onClick={() => goToSlide(index)}
                    className={`rounded-md overflow-hidden transition-all duration-300 flex-shrink-0 ${
                      currentIndex === index ? 'ring-2 ring-white scale-105' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      width: 'var(--thumbnail-width)',
                      height: 'calc(var(--thumbnail-width) * 0.7)' // Proporción de aspecto
                    }}
                    aria-label={`Ver reseña de ${review.title}`}
                  >
                    <div className="w-full h-full relative">
                      <ImageWithFallback 
                        src={review.image} 
                        alt={review.title}
                        fill
                        sizes="(max-width: 768px) 80px, 96px"
                        className="object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Progress indicator bar below thumbnails - más fina */}
              <div className="absolute bottom-1 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentIndex + 1) / displayReviews.length) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Navigation indicators for thumbnails - only if more than 3 items */}
            {displayReviews.length > 3 && (
              <>
                <button 
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transform -translate-x-1/2 backdrop-blur-sm border border-white/10"
                  aria-label="Ver miniaturas anteriores"
                  onClick={() => {
                    // Ir a la miniatura anterior
                    if (currentIndex > 0) {
                      setCurrentIndex(currentIndex - 1);
                    } else {
                      // Si estamos en la primera, ir a la última
                      setCurrentIndex(displayReviews.length - 1);
                    }
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <button 
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transform translate-x-1/2 backdrop-blur-sm border border-white/10"
                  aria-label="Ver miniaturas siguientes"
                  onClick={() => {
                    // Ir a la miniatura siguiente
                    if (currentIndex < displayReviews.length - 1) {
                      setCurrentIndex(currentIndex + 1);
                    } else {
                      // Si estamos en la última, ir a la primera
                      setCurrentIndex(0);
                    }
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Large, touch-friendly navigation buttons (only on tablet/desktop) */}
        <div className="hidden md:block">
          <button 
            className="nav-button prev-button"
            onClick={prevSlide} 
            aria-label="Reseña anterior"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button 
            className="nav-button next-button"
            onClick={nextSlide}
            aria-label="Reseña siguiente"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      </div>

      {/* Review Content Section */}
      <div className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <meta itemProp="position" content={`${displayedTextIndex + 1}`} />
            <div itemProp="item" itemScope itemType="https://schema.org/Review">
              <div itemScope itemType="https://schema.org/Restaurant" itemProp="itemReviewed">
                <meta itemProp="name" content={displayReviews[displayedTextIndex].title} />
              </div>
              
              {/* Review Header */}
              <div className={`text-center mb-8 sm:mb-12 transition-all duration-500 ${
                isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1 bg-amber-100 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className="font-semibold text-amber-700">{displayReviews[displayedTextIndex].rating}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{displayReviews[displayedTextIndex].location}</span>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 text-gray-900 letter-tight">
                  {displayReviews[displayedTextIndex].title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed" itemProp="reviewBody">
                  {displayReviews[displayedTextIndex].content.summary}
                </p>
                <meta itemProp="author" content="Blog Reseñas Locales" />
                <meta itemProp="datePublished" content={new Date().toISOString().split('T')[0]} />
              </div>

              {/* Review Content Grid */}
            <div className={`grid md:grid-cols-2 gap-8 sm:gap-12 transition-all duration-500 ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}>
              {/* Left Column - Highlights */}
              <div>
                <h3 className="text-xl font-semibold mb-6 text-gray-900">Lo que más nos gustó</h3>
                <div className="space-y-4">
                  {displayReviews[displayedTextIndex].content.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Details */}
              <div>
                <h3 className="text-xl font-semibold mb-6 text-gray-900">Ambiente y experiencia</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {displayReviews[displayedTextIndex].content.atmosphere}
                </p>
                
                <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Nuestra recomendación</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {displayReviews[displayedTextIndex].content.recommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div className={`mt-8 sm:mt-12 pt-8 border-t border-gray-200 transition-all duration-500 delay-100 ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}>
              <div className="flex flex-wrap gap-2 justify-center">
                {displayReviews[displayedTextIndex].tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className={`text-center mt-8 sm:mt-12 transition-all duration-500 delay-200 ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
                <Button 
                  size="lg" 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl min-h-[44px] w-full sm:w-auto min-w-[200px]"
                  onClick={() => onReviewClick?.(displayReviews[displayedTextIndex].id)}
                >
                  {displayReviews[displayedTextIndex].ctaText || "Descubre la reseña completa"}
                </Button>
                <Button 
                  variant="outline"
                  size="lg" 
                  className="text-orange-600 border-orange-300 hover:bg-orange-50 px-6 sm:px-8 py-3 rounded-full font-medium transition-all duration-300 min-h-[44px] w-full sm:w-auto min-w-[200px]"
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(displayReviews[displayedTextIndex].location)}`, '_blank')}
                >
                  Ver cómo llegar
                </Button>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 sm:mb-6 text-gray-900 letter-tight">
            Descubre los mejores sabores de tu ciudad
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Reseñas auténticas de restaurantes, cafeterías y locales únicos escritas por amantes de la buena comida
          </p>
        </div>
      </div>
    </section>
  );
}


