import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Định nghĩa các route groups
const PUBLIC_ROUTES = ["/", "/api/auth", "/_next", "/favicon.ico"];

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

const USER_ROUTES = [
  "/profile",
  "/orders",
  "/downloads",
  "/wishlist",
  "/settings",
  "/cart",
  "/checkout",
];

const ADMIN_ROUTES = ["/admin"];

// Helper function để kiểm tra route
function isRouteMatch(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname.startsWith(route));
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Kiểm tra route admin - chỉ ADMIN mới được truy cập
    if (isRouteMatch(pathname, ADMIN_ROUTES)) {      
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      const userRole = token.role?.toLowerCase();
      if (userRole !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Kiểm tra route user - yêu cầu đăng nhập
    if (isRouteMatch(pathname, USER_ROUTES)) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // Redirect authenticated users away from auth pages
    if (isRouteMatch(pathname, AUTH_ROUTES)) {
      if (token) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Cho phép truy cập public routes
        if (isRouteMatch(pathname, PUBLIC_ROUTES)) {
          return true;
        }

        // Cho phép truy cập auth pages
        if (isRouteMatch(pathname, AUTH_ROUTES)) {
          return true;
        }

        // Kiểm tra admin routes - cần token và role admin
        if (isRouteMatch(pathname, ADMIN_ROUTES)) {
          return !!token && token.role?.toLowerCase() === "admin";
        }

        // Yêu cầu authentication cho các route user
        if (isRouteMatch(pathname, USER_ROUTES)) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};
