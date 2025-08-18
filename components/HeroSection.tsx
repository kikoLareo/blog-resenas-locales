import { ChevronLeft, ChevronRight, Star, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { slugify } from "@/lib/slug";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { HeroSlider } from "./HeroSlider";

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

const defaultHeroReviews: HeroItem[] = [
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

type HeroSectionProps = {
  reviews?: HeroItem[];
};

export function HeroSection({ reviews }: HeroSectionProps) {
  const heroReviews = (reviews && reviews.length > 0 ? reviews : defaultHeroReviews);

  return (
    <section className="relative">
      <HeroSlider reviews={heroReviews} />
      <div className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 sm:mb-6 text-gray-900 letter-tight">Descubre los mejores sabores de tu ciudad</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed">Reseñas auténticas de restaurantes, cafeterías y locales únicos escritas por amantes de la buena comida</p>
        </div>
      </div>
    </section>
  );
}


