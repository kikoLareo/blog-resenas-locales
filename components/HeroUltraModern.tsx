'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, MapPin, TrendingUp, Users, Star, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';

interface HeroUltraModernProps {
  featuredItems?: any[];
  className?: string;
}

// Datos para animaciones (podrían venir de props en producción)
const STATS_DATA = {
  restaurants: 1247,
  reviews: 15420,
  cities: 89,
  users: 8500,
};

const TRENDING_SEARCHES = [
  "Mejor paella Valencia",
  "Sushi fresco Madrid", 
  "Tapas auténticas Sevilla",
  "Cocina mediterránea Barcelona",
  "Mariscos frescos Galicia"
];

const FOOD_CATEGORIES = [
  { name: "Mediterránea", emoji: "🫒", count: 234 },
  { name: "Asiática", emoji: "🍜", count: 189 },
  { name: "Italiana", emoji: "🍝", count: 156 },
  { name: "Tapas", emoji: "🍤", count: 298 },
  { name: "Mariscos", emoji: "🦐", count: 134 },
  { name: "Vegana", emoji: "🥗", count: 87 }
];

export const HeroUltraModern: React.FC<HeroUltraModernProps> = ({
  featuredItems = [],
  className,
}) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({ restaurants: 0, reviews: 0, cities: 0, users: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Intersection Observer para animaciones al entrar en vista
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animación de contadores
  useEffect(() => {
    if (!isVisible) return;

    const animateStats = () => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setAnimatedStats({
          restaurants: Math.floor(STATS_DATA.restaurants * easeOut),
          reviews: Math.floor(STATS_DATA.reviews * easeOut),
          cities: Math.floor(STATS_DATA.cities * easeOut),
          users: Math.floor(STATS_DATA.users * easeOut),
        });

        currentStep++;
        if (currentStep > steps) {
          clearInterval(timer);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    };

    const cleanup = animateStats();
    return cleanup;
  }, [isVisible]);

  // Rotación de búsquedas trending
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrendingIndex((prev) => (prev + 1) % TRENDING_SEARCHES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSearchFocus = () => {
    setSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setSearchFocused(false);
  };

  const handleCategoryClick = (category: string) => {
    if (searchInputRef.current) {
      searchInputRef.current.value = category;
      searchInputRef.current.focus();
    }
  };

  return (
    <section 
      ref={heroRef}
      className={cn("relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50", className)}
      itemScope 
      itemType="https://schema.org/WebSite"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(249,115,22,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(239,68,68,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(245,158,11,0.1),transparent_50%)]" />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-2 h-2 bg-orange-200 rounded-full opacity-20 animate-pulse",
              "animation-delay-" + (i * 200)
            )}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Content Column */}
          <div className={cn(
            "space-y-8 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            
            {/* Badge with trending icon */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 px-4 py-2 text-sm font-medium border border-orange-200">
                <TrendingUp className="h-4 w-4 mr-2" />
                #1 Blog Gastronómico España
              </Badge>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                ))}
                <span className="text-sm text-gray-600 ml-1">4.9/5</span>
              </div>
            </div>

            {/* Main heading with SEO optimization */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Descubre los
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"> mejores sabores</span>
                <br />
                cerca de ti
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl" itemProp="description">
                Reseñas auténticas de <strong>{animatedStats.restaurants.toLocaleString()}+ restaurantes</strong> escritas por foodies reales. 
                Encuentra tu próxima experiencia gastronómica perfecta.
              </p>
            </div>

            {/* Interactive search section */}
            <div className="space-y-4">
              <div className={cn(
                "relative transition-all duration-300 transform",
                searchFocused ? "scale-105" : "scale-100"
              )}>
                <div className={cn(
                  "relative bg-white rounded-2xl shadow-lg border transition-all duration-300",
                  searchFocused ? "border-orange-500 shadow-xl shadow-orange-500/20" : "border-gray-200"
                )}>
                  <div className="flex items-center p-4">
                    <Search className={cn(
                      "h-6 w-6 transition-colors duration-300",
                      searchFocused ? "text-orange-500" : "text-gray-400"
                    )} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="¿Qué quieres comer hoy?"
                      className="flex-1 ml-4 text-lg placeholder-gray-500 border-0 focus:outline-none bg-transparent"
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                    />
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 rounded-xl"
                    >
                      Buscar
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Trending searches */}
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    Trending:
                  </span>
                  <div className="overflow-hidden">
                    <div 
                      className="transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateY(-${currentTrendingIndex * 20}px)` }}
                    >
                      {TRENDING_SEARCHES.map((search, index) => (
                        <button
                          key={index}
                          className="block text-orange-600 hover:text-orange-700 font-medium h-5"
                          onClick={() => handleCategoryClick(search)}
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick category filters */}
              <div className="flex flex-wrap gap-2">
                {FOOD_CATEGORIES.slice(0, 6).map((category, index) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200",
                      "hover:border-orange-300 hover:bg-orange-50 transition-all duration-200",
                      "hover:scale-105 hover:shadow-md",
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                    style={{
                      transitionDelay: `${index * 100}ms`
                    }}
                  >
                    <span className="text-lg">{category.emoji}</span>
                    <span className="font-medium text-gray-700">{category.name}</span>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Social proof stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Restaurantes", value: animatedStats.restaurants, icon: MapPin },
                { label: "Reseñas", value: animatedStats.reviews, icon: Star },
                { label: "Ciudades", value: animatedStats.cities, icon: TrendingUp },
                { label: "Usuarios", value: animatedStats.users, icon: Users },
              ].map((stat, index) => (
                <div 
                  key={stat.label}
                  className={cn(
                    "text-center transition-all duration-1000",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
                    <stat.icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value.toLocaleString()}+
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                asChild
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/reviews">
                  <Zap className="mr-2 h-5 w-5" />
                  Explorar Reseñas
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                asChild
                className="border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 px-8 py-4 text-lg rounded-xl transition-all duration-300"
              >
                <Link href="/venues">
                  Buscar por Ubicación
                  <MapPin className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Visual Column */}
          <div className={cn(
            "relative transition-all duration-1000 delay-300",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          )}>
            
            {/* Main visual container */}
            <div className="relative">
              {/* Floating cards with real data */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    title: "Paella Valenciana",
                    rating: 4.8,
                    location: "Valencia",
                    image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400&h=300&fit=crop&q=80",
                    badge: "Trending"
                  },
                  {
                    title: "Sushi Nikkei",
                    rating: 4.9,
                    location: "Madrid", 
                    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&q=80",
                    badge: "Top Rated"
                  },
                  {
                    title: "Tapas Gourmet",
                    rating: 4.7,
                    location: "Sevilla",
                    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop&q=80",
                    badge: "Popular"
                  },
                  {
                    title: "Cocina Mediterránea",
                    rating: 4.6,
                    location: "Barcelona",
                    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&q=80",
                    badge: "Nuevo"
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden",
                      "hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer",
                      "animate-float"
                    )}
                    style={{
                      animationDelay: `${index * 0.5}s`,
                      animationDuration: `${3 + index * 0.5}s`
                    }}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={cn(
                          "text-xs font-medium",
                          item.badge === "Trending" && "bg-orange-500 text-white",
                          item.badge === "Top Rated" && "bg-green-500 text-white", 
                          item.badge === "Popular" && "bg-blue-500 text-white",
                          item.badge === "Nuevo" && "bg-purple-500 text-white"
                        )}>
                          {item.badge}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-700">{item.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schema.org markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Blog de Reseñas Gastronómicas",
            "url": "https://example.com",
            "description": "Reseñas auténticas de restaurantes escritas por foodies reales",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://example.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroUltraModern;
