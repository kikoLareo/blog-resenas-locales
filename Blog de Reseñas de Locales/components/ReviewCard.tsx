import { Star, MapPin, Clock } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ReviewCardProps {
  id: string;
  title: string;
  image: string;
  rating: number;
  location: string;
  readTime: string;
  tags: string[];
  description: string;
  featured?: boolean;
  onClick?: () => void;
}

export function ReviewCard({ 
  title, 
  image, 
  rating, 
  location, 
  readTime, 
  tags, 
  description, 
  featured = false,
  onClick
}: ReviewCardProps) {
  return (
    <Card 
      className={`group cursor-pointer overflow-hidden border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300 ${
        featured ? 'shadow-md' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] ${
            featured ? 'h-64' : 'h-52'
          }`}
        />
        
        {featured && (
          <div className="absolute top-3 left-3">
            <div className="bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
              Destacado
            </div>
          </div>
        )}
        
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold text-gray-900">{rating}</span>
        </div>
      </div>
      
      <CardContent className="p-4 sm:p-5">
        <div className="space-y-3">
          <div>
            <h3 className={`font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-accent transition-colors ${
              featured ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
            }`}>
              {title}
            </h3>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{readTime}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded hover:bg-gray-200 transition-colors"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                +{tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}