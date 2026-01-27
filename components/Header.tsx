"use client";

import { Search, Menu, MapPin, Star, Coffee, Mail } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { DarkModeToggle } from "./DarkModeToggle";
import { NotificationCenter } from "./NotificationCenter";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

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
  }, [scrolled, lastScrollY, visible]);

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border/50" 
        : "bg-transparent backdrop-blur-sm"
    } ${
      visible 
        ? "translate-y-0" 
        : "-translate-y-full"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover-lift">
            <Coffee className="h-8 w-8 text-primary" />
            <span className="text-xl font-serif font-bold text-primary">SaborLocal</span>
          </Link>
          
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
              <Input 
                type="search" 
                placeholder="Buscar restaurantes, comida, ubicación..." 
                className="pl-10 pr-4 w-full bg-background/70 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/categorias" className="nav-link">
              Categorías
            </Link>
            <Link href="/ciudades" className="nav-link group">
              <MapPin className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Ciudades</span>
            </Link>
            <Link href="/top-resenas" className="nav-link group">
              <Star className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Top Reseñas</span>
            </Link>
            <Link href="/contacto" className="nav-link group">
              <Mail className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Contacto</span>
            </Link>
            
            {/* Notification Center */}
            <div className="ml-2">
              <NotificationCenter />
            </div>

            {/* Dark Mode Toggle */}
            <DarkModeToggle className="ml-2" />
          </nav>
          
          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <NotificationCenter />
            <DarkModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-background/95 backdrop-blur-md border-l border-border">
                <div className="flex flex-col space-y-6 mt-6">
                  {/* Mobile Logo */}
                  <div className="flex items-center space-x-2 mb-4">
                    <Coffee className="h-8 w-8 text-primary" />
                    <span className="text-xl font-serif font-bold text-primary">SaborLocal</span>
                  </div>
                  
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
                    <Input 
                      type="search" 
                      placeholder="Buscar restaurantes..." 
                      className="pl-10 pr-4 bg-muted border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </form>
                  
                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-2">
                    <Link href="/categorias" className="mobile-nav-link">
                      Categorías
                    </Link>
                    <Link href="/ciudades" className="mobile-nav-link">
                      <MapPin className="h-4 w-4" />
                      <span>Ciudades</span>
                    </Link>
                    <Link href="/top-resenas" className="mobile-nav-link">
                      <Star className="h-4 w-4" />
                      <span>Top Reseñas</span>
                    </Link>
                    <Link href="/contacto" className="mobile-nav-link">
                      <Mail className="h-4 w-4" />
                      <span>Contacto</span>
                    </Link>
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


