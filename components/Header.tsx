"use client";

  import { Search, Menu, MapPin, Star, Coffee } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState, useEffect } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // Inicializar el estado basado en la posición inicial de scroll
    const initialScrollY = window.scrollY;
    setScrolled(initialScrollY > 20);
    setVisible(initialScrollY <= 100);
    setLastScrollY(initialScrollY);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determinar si estamos haciendo scroll hacia abajo o hacia arriba
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & not at the top
        setVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 20) {
        // Scrolling up or at the top
        setVisible(true);
      }
      
      // Cambiar el estilo cuando no estamos en la parte superior
      const isScrolled = currentScrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Añadir la detección de hover cerca de la parte superior
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 20 && !visible) {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [scrolled, lastScrollY]);

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm" 
        : "bg-transparent backdrop-blur-sm bg-white/30 dark:bg-black/20"
    } ${
      visible 
        ? "translate-y-0" 
        : "-translate-y-full"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-accent text-orange-500" />
            <span className="text-xl font-semibold text-orange-500">SaborLocal</span>
          </div>
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input 
                type="search" 
                placeholder="Buscar restaurantes, comida, ubicación..." 
                className="pl-10 pr-4 w-full bg-white/70 dark:bg-black/30 border-0 focus:ring-2 focus:ring-orange-500/50" 
              />
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-800 dark:text-white hover:text-orange-500 transition-colors font-medium">Categorías</a>
            <a href="#" className="text-gray-800 dark:text-white hover:text-orange-500 transition-colors flex items-center space-x-1 font-medium">
              <MapPin className="h-4 w-4" />
              <span>Ciudades</span>
            </a>
            <a href="#" className="text-gray-800 dark:text-white hover:text-orange-500 transition-colors flex items-center space-x-1 font-medium">
              <Star className="h-4 w-4" />
              <span>Top Reseñas</span>
            </a>
          </nav>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-800 dark:text-white hover:bg-white/20">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-white/90 backdrop-blur-md dark:bg-black/90">
                <div className="flex flex-col space-y-6 mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Coffee className="h-8 w-8 text-orange-500" />
                    <span className="text-xl font-semibold text-orange-500">SaborLocal</span>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input 
                      type="search" 
                      placeholder="Buscar restaurantes..." 
                      className="pl-10 pr-4 bg-white/70 dark:bg-black/30 border-0 focus:ring-2 focus:ring-orange-500/50" 
                    />
                  </div>
                  <nav className="flex flex-col space-y-4">
                    <a href="#" className="text-gray-800 dark:text-white hover:text-orange-500 transition-colors font-medium py-2">Categorías</a>
                    <a href="#" className="text-gray-800 dark:text-white hover:text-orange-500 transition-colors flex items-center space-x-1 font-medium py-2">
                      <MapPin className="h-4 w-4" />
                      <span>Ciudades</span>
                    </a>
                    <a href="#" className="text-gray-800 dark:text-white hover:text-orange-500 transition-colors flex items-center space-x-1 font-medium py-2">
                      <Star className="h-4 w-4" />
                      <span>Top Reseñas</span>
                    </a>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}


