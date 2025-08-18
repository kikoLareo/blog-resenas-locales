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
      signIn: "/acceso"
    }
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*"
  ]
};