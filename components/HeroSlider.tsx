"use client";

import { ChevronLeft, ChevronRight, Star, MapPin, Clock } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { slugify } from "@/lib/slug";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type HeroItem = {
  id: string;
  title: string;
  image: string;
  rating: number;
  location: string;
  readTime: string;
  tags: string[];
  description: string;
  href?: string;
};

type HeroSliderProps = {
  reviews: HeroItem[];
};

export function HeroSlider({ reviews }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const changeSlide = useCallback((newIndex: number) => {
    if (isTransitioning || newIndex === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setTimeout(() => setIsTransitioning(false), 200);
    }, 200);
  }, [currentIndex, isTransitioning]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        const newIndex = (currentIndex + 1) % reviews.length;
        changeSlide(newIndex);
      }
    }, 7000);
    return () => clearInterval(interval);
  }, [currentIndex, isTransitioning, reviews.length, changeSlide]);

  const nextSlide = useCallback(() => changeSlide((currentIndex + 1) % reviews.length), [changeSlide, currentIndex, reviews.length]);
  const prevSlide = useCallback(() => changeSlide((currentIndex - 1 + reviews.length) % reviews.length), [changeSlide, currentIndex, reviews.length]);
  const goToSlide = useCallback((index: number) => changeSlide(index), [changeSlide]);

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <div className="absolute inset-0">
        {reviews.map((review, index) => (
          <div key={review.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
            <ImageWithFallback 
              src={review.image} 
              alt={review.title} 
              fill
              priority={index === 0} // Solo la primera imagen es prioritaria
              sizes="100vw"
              quality={85}
              className="object-cover transition-transform duration-1000 scale-105" 
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/40 transition-opacity duration-500" />
      </div>
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className={`max-w-4xl text-white transition-all duration-600 ease-out transform ${isTransitioning ? 'opacity-0 translate-y-6 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-4 font-medium transition-all duration-300">Destacado</div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">{reviews[currentIndex].title}</h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/90 max-w-2xl">{reviews[currentIndex].description}</p>
            <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-2 text-sm transition-all duration-300 hover:bg-white/30">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{reviews[currentIndex].rating}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-2 text-sm transition-all duration-300 hover:bg-white/30">
                <MapPin className="h-4 w-4" />
                <span>{reviews[currentIndex].location}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-2 text-sm transition-all duration-300 hover:bg-white/30">
                <Clock className="h-4 w-4" />
                <span>{reviews[currentIndex].readTime}</span>
              </div>
            </div>
            <Link
              href={reviews[currentIndex].href || `/madrid/restaurant-x/review/${slugify(reviews[currentIndex].title)}`}
              className="inline-flex items-center justify-center bg-white text-black hover:bg-white/90 font-medium px-6 py-3 sm:px-8 sm:py-3 text-sm sm:text-base transition-all duration-300 hover:scale-105 transform rounded-md"
            >
              Leer reseña completa
            </Link>
          </div>
        </div>
      </div>
      <Button variant="outline" size="icon" className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100" onClick={prevSlide} disabled={isTransitioning}>
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button variant="outline" size="icon" className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100" onClick={nextSlide} disabled={isTransitioning}>
        <ChevronRight className="h-6 w-6" />
      </Button>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-3">
          {reviews.map((_, index) => (
            <button key={index} className={`w-3 h-3 rounded-full transition-all duration-400 hover:scale-110 ${index === currentIndex ? 'bg-white scale-125 shadow-lg' : 'bg-white/50 hover:bg-white/70'} disabled:cursor-not-allowed disabled:hover:scale-100`} onClick={() => goToSlide(index)} disabled={isTransitioning} />
          ))}
        </div>
      </div>
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white transition-all duration-1000 ease-linear" style={{ width: `${((currentIndex + 1) / reviews.length) * 100}%`, transition: isTransitioning ? 'none' : 'width 7s linear' }} />
      </div>
    </div>
  );
}
