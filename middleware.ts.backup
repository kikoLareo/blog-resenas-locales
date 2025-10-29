import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { ADMIN_SECURITY_HEADERS, isAdminRoute } from "@/lib/seo-protection";

export default withAuth(
  function middleware(req) {
    
    // Crear respuesta
    let response = NextResponse.next();
    
    // Agregar headers de seguridad para rutas administrativas
    if (isAdminRoute(req.nextUrl.pathname)) {
      Object.entries(ADMIN_SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }
    
    // Permitir acceso si hay token (temporalmente)
    if (req.nextauth.token) {
      return response;
    }
    
    return NextResponse.redirect(new URL("/acceso", req.url));
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Permitir si hay token (temporalmente)
        return !!token;
      }
    },
    pages: {
      signIn: "/acceso"
    }
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/acceso"
  ]
};