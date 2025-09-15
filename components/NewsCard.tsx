"use client";

import { Clock, MapPin, AlertTriangle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { OptimizedImage } from './OptimizedImage';

interface NewsCardProps {
  news: {
    _id: string;
    title: string;
    slug: { current: string };
    excerpt: string;
    newsType: 'aperturas' | 'pop-ups' | 'temporada' | 'eventos' | 'tendencias' | 'cierres';
    city: {
      title: string;
      slug: { current: string };
    };
    heroImage: {
      asset: { url: string };
      alt: string;
    };
    venues?: Array<{
      venue: {
        title: string;
      };
      status: string;
    }>;
    eventDate?: string;
    featured: boolean;
    urgent: boolean;
    publishedAt: string;
    expiresAt?: string;
  };
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export function NewsCard({ news, variant = 'default', className = "" }: NewsCardProps) {
  const typeConfig = {
    aperturas: { label: 'Aperturas', icon: '🆕', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    'pop-ups': { label: 'Pop-ups', icon: '⏰', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
    temporada: { label: 'Temporada', icon: '🍂', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    eventos: { label: 'Eventos', icon: '🎉', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    tendencias: { label: 'Tendencias', icon: '📈', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    cierres: { label: 'Cierres', icon: '🔒', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  };

  const config = typeConfig[news.newsType];
  const isExpiringSoon = news.expiresAt && new Date(news.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const isExpired = news.expiresAt && new Date(news.expiresAt) < new Date();

  if (variant === 'compact') {
    return (
      <Link href={`/noticias/${news.slug.current}`} className={`block ${className}`}>
        <article className="flex gap-4 p-4 bg-card border rounded-xl hover:shadow-md transition-all">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <OptimizedImage
              src={news.heroImage.asset.url}
              alt={news.heroImage.alt}
              fill
              className="object-cover"
            />
            {news.urgent && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon} {config.label}
              </span>
              {news.urgent && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  🚨 Urgente
                </span>
              )}
            </div>
            
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">
              {news.title}
            </h3>
            
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {news.excerpt}
            </p>
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{news.city.title}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{new Date(news.publishedAt).toLocaleDateString('es-ES')}</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/noticias/${news.slug.current}`} className={`block ${className}`}>
        <article className="bg-card border rounded-2xl overflow-hidden hover:shadow-lg transition-all">
          <div className="relative aspect-[16/9]">
            <OptimizedImage
              src={news.heroImage.asset.url}
              alt={news.heroImage.alt}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color} bg-opacity-90 backdrop-blur-sm`}>
                {config.icon} {config.label}
              </span>
              {news.urgent && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500 text-white bg-opacity-90 backdrop-blur-sm">
                  🚨 Urgente
                </span>
              )}
              {news.featured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white bg-opacity-90 backdrop-blur-sm">
                  ⭐ Destacada
                </span>
              )}
            </div>
            
            {isExpiringSoon && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-500 text-white bg-opacity-90 backdrop-blur-sm">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Expira pronto
                </span>
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{news.city.title}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{new Date(news.publishedAt).toLocaleDateString('es-ES')}</span>
              </div>
              {news.eventDate && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Evento: {new Date(news.eventDate).toLocaleDateString('es-ES')}</span>
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-serif font-bold mb-3 line-clamp-2">
              {news.title}
            </h2>
            
            <p className="text-muted-foreground line-clamp-3 mb-4">
              {news.excerpt}
            </p>
            
            {news.venues && news.venues.length > 0 && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Locales mencionados:</span>
                <span className="ml-2">
                  {news.venues.slice(0, 3).map(v => v.venue.title).join(', ')}
                  {news.venues.length > 3 && ` y ${news.venues.length - 3} más`}
                </span>
              </div>
            )}
          </div>
        </article>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/noticias/${news.slug.current}`} className={`block ${className}`}>
      <article className={`bg-card border rounded-2xl overflow-hidden hover:shadow-md transition-all ${isExpired ? 'opacity-60' : ''}`}>
        <div className="relative aspect-[4/3]">
          <OptimizedImage
            src={news.heroImage.asset.url}
            alt={news.heroImage.alt}
            fill
            className="object-cover"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color} bg-opacity-90 backdrop-blur-sm`}>
              {config.icon} {config.label}
            </span>
            {news.urgent && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white bg-opacity-90 backdrop-blur-sm">
                🚨
              </span>
            )}
          </div>
          
          {isExpiringSoon && !isExpired && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-500 text-white bg-opacity-90 backdrop-blur-sm">
                <AlertTriangle className="h-3 w-3" />
              </span>
            </div>
          )}
          
          {isExpired && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                Expirada
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{news.city.title}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{new Date(news.publishedAt).toLocaleDateString('es-ES')}</span>
            </div>
          </div>
          
          <h3 className="font-semibold line-clamp-2 mb-2">
            {news.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-3">
            {news.excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
}
