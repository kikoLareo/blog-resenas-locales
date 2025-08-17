import { Search, Menu, MapPin, Star, Coffee } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-accent" />
            <span className="text-xl font-semibold">SaborLocal</span>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Buscar restaurantes, comida, ubicación..."
                className="pl-10 pr-4 w-full"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-foreground hover:text-accent transition-colors">
              Categorías
            </a>
            <a href="#" className="text-foreground hover:text-accent transition-colors flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>Ciudades</span>
            </a>
            <a href="#" className="text-foreground hover:text-accent transition-colors flex items-center space-x-1">
              <Star className="h-4 w-4" />
              <span>Top Reseñas</span>
            </a>
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-6 mt-6">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="search"
                      placeholder="Buscar restaurantes..."
                      className="pl-10 pr-4"
                    />
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-4">
                    <a href="#" className="text-foreground hover:text-accent transition-colors">
                      Categorías
                    </a>
                    <a href="#" className="text-foreground hover:text-accent transition-colors flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>Ciudades</span>
                    </a>
                    <a href="#" className="text-foreground hover:text-accent transition-colors flex items-center space-x-1">
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