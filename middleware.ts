import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === "ADMIN"
    },
    pages: {
      signIn: "/dashboard/acceso"
    }
  }
)

export const config = {
  matcher: [
    // Proteger todas las rutas del dashboard
    "/dashboard/:path*",
    // Excluir específicamente la página de login
    "/((?!dashboard/acceso|api/auth).*)"
  ]
};