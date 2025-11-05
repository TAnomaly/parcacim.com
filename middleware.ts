import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Seller routes require SELLER role
    if (path.startsWith("/seller")) {
      if (!token || token.role !== "SELLER") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // Admin routes require ADMIN role
    if (path.startsWith("/admin")) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/seller/:path*",
    "/admin/:path*",
    "/checkout",
    "/orders",
  ],
};
