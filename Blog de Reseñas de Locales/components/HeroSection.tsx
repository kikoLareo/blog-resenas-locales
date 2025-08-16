import { ChevronLeft, ChevronRight, Star, MapPin, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const heroReviews = [
  {
    id: "1",
    title: "Experiencia única en el restaurante más moderno de la ciudad",
    image: "https://images.unsplash.com/photo-1669131196140-49591336b13e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBtb2Rlcm58ZW58MXx8fHwxNzU1MzU1MDcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.8,
    location: "Centro, Madrid",
    readTime: "5 min",
    tags: ["Moderno", "Fine Dining", "Ambiente"],
    description: "Un lugar que redefine la experiencia gastronómica con su diseño vanguardista y platos innovadores que sorprenden en cada bocado."
  },
  {
    id: "2",
    title: "La mejor pizza artesanal que he probado en años",
    image: "https://images.unsplash.com/photo-1563245738-9169ff58eccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU1MjgwNjI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.9,
    location: "Malasaña, Madrid",
    readTime: "4 min",
    tags: ["Pizza", "Artesanal", "Italiano"],
    description: "Masa fermentada 48 horas, ingredientes importados directamente de Italia y un horno de leña que hace magia."
  },
  {
    id: "3",
    title: "Café con encanto en el corazón del barrio",
    image: "https://images.unsplash.com/photo-1709380146579-e46f2736650a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwZXh0ZXJpb3IlMjBzdHJlZXR8ZW58MXx8fHwxNzU1MzU1MDcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.6,
    location: "La Latina, Madrid",
    readTime: "3 min",
    tags: ["Café", "Brunch", "Terraza"],
    description: "El lugar perfecto para disfrutar de un café de especialidad mientras observas la vida del barrio pasar."
  }
];

interface HeroSectionProps {
  onReviewClick?: (reviewId: string) => void;
}

export function HeroSection({ onReviewClick }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-advance slides every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        const newIndex = (currentIndex + 1) % heroReviews.length;
        changeSlide(newIndex);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [currentIndex, isTransitioning]);

  const changeSlide = (newIndex: number) => {
    if (isTransitioning || newIndex === currentIndex) return;
    
    setIsTransitioning(true);
    
    // Breve delay para la animación de salida, luego cambiar contenido
    setTimeout(() => {
      setCurrentIndex(newIndex);
      // Tiempo para que la animación de entrada se complete
      setTimeout(() => {
        setIsTransitioning(false);
      }, 200);
    }, 200);
  };

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % heroReviews.length;
    changeSlide(newIndex);
  };

  const prevSlide = () => {
    const newIndex = (currentIndex - 1 + heroReviews.length) % heroReviews.length;
    changeSlide(newIndex);
  };

  const goToSlide = (index: number) => {
    changeSlide(index);
  };

  return (
    <section className="relative">
      {/* Full Width Hero Banner */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Images with smooth transitions */}
        <div className="absolute inset-0">
          {heroReviews.map((review, index) => (
            <div
              key={review.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <ImageWithFallback
                src={review.image}
                alt={review.title}
                className="w-full h-full object-cover transition-transform duration-1000 scale-105"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/40 transition-opacity duration-500" />
        </div>

        {/* Content Overlay with smooth transitions */}
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className={`max-w-4xl text-white transition-all duration-600 ease-out transform ${
              isTransitioning ? 'opacity-0 translate-y-6 scale-95' : 'opacity-100 translate-y-0 scale-100'
            }`}>
              <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-4 font-medium transition-all duration-300">
                Destacado
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                {heroReviews[currentIndex].title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/90 max-w-2xl">
                {heroReviews[currentIndex].description}
              </p>
              <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-2 text-sm transition-all duration-300 hover:bg-white/30">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{heroReviews[currentIndex].rating}</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-2 text-sm transition-all duration-300 hover:bg-white/30">
                  <MapPin className="h-4 w-4" />
                  <span>{heroReviews[currentIndex].location}</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-2 text-sm transition-all duration-300 hover:bg-white/30">
                  <Clock className="h-4 w-4" />
                  <span>{heroReviews[currentIndex].readTime}</span>
                </div>
              </div>
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-white/90 font-medium px-6 py-3 sm:px-8 sm:py-3 text-sm sm:text-base transition-all duration-300 hover:scale-105 transform"
                onClick={() => onReviewClick?.(heroReviews[currentIndex].id)}
              >
                Leer reseña completa
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
          onClick={prevSlide}
          disabled={isTransitioning}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
          onClick={nextSlide}
          disabled={isTransitioning}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-3">
            {heroReviews.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-400 hover:scale-110 ${
                  index === currentIndex ? 'bg-white scale-125 shadow-lg' : 'bg-white/50 hover:bg-white/70'
                } disabled:cursor-not-allowed disabled:hover:scale-100`}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
              />
            ))}
          </div>
        </div>

        {/* Progress bar for current slide */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-1000 ease-linear"
            style={{ 
              width: `${((currentIndex + 1) / heroReviews.length) * 100}%`,
              transition: isTransitioning ? 'none' : 'width 7s linear'
            }}
          />
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