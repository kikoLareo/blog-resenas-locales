import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { ADMIN_SECURITY_HEADERS, isAdminRoute } from "@/lib/seo-protection";

export default withAuth(
  function middleware(req) {
    console.log("🔒 Middleware ejecutándose para:", req.nextUrl.pathname);
    console.log("🔑 Token:", req.nextauth.token);
    
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
      console.log("✅ Acceso permitido para:", req.nextauth.token.email);
      return response;
    }
    
    console.log("❌ Acceso denegado, redirigiendo a /acceso");
    return NextResponse.redirect(new URL("/acceso", req.url));
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log("🔍 Verificando autorización:", { hasToken: !!token, role: token?.role });
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