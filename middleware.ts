import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  
  // Normalizar rutas de ciudad/venue para redirects SEO-friendly
  const cityVenueMatch = pathname.match(/^\/([^\/]+)\/([^\/]+)(?:\/.*)?$/);
  
  if (cityVenueMatch) {
    const [, city, venue] = cityVenueMatch;
    const normalizedCity = city.toLowerCase();
    const normalizedVenue = venue.toLowerCase();
    
    // Solo redirigir si hay cambios (no crear loops)
    if (city !== normalizedCity || venue !== normalizedVenue) {
      const normalizedPath = pathname.replace(`/${city}/${venue}`, `/${normalizedCity}/${normalizedVenue}`);
      url.pathname = normalizedPath;
      
      return NextResponse.redirect(url, 301); // Redirect permanente para SEO
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Excluir archivos estáticos, API routes, etc.
    '/((?!api|_next/static|_next/image|favicon.ico|studio|dashboard).*)',
  ],
};