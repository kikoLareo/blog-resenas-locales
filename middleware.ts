import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // 1. Protección del Dashboard
  if (pathname.startsWith("/dashboard")) {
    // Permitir acceso a la página de login
    if (pathname === "/dashboard/acceso") {
      return NextResponse.next();
    }

    // Verificar sesión
    const token = await getToken({ req: request });
    
    if (!token) {
      // Redirigir a login si no hay sesión
      url.pathname = "/dashboard/acceso";
      return NextResponse.redirect(url);
    }
    
    // Si hay sesión, permitir acceso y saltar lógica SEO
    return NextResponse.next();
  }
  
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
    '/((?!api|_next/static|_next/image|favicon.ico|studio).*)',
  ],
};