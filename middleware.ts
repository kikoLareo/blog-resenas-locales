import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    console.log("🔒 Middleware ejecutándose para:", req.nextUrl.pathname);
    console.log("🔑 Token:", req.nextauth.token);
    
    // Permitir acceso si hay token (temporalmente)
    if (req.nextauth.token) {
      console.log("✅ Acceso permitido para:", req.nextauth.token.email);
      return NextResponse.next();
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
    "/dashboard/:path*"
  ]
};