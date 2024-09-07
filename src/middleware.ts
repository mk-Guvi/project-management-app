import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Define auth routes (routes that don't require authentication)
  const authRoutes = ["/login", "/signup"];
  
  // Check for the presence of an access token and refresh token in cookies
  const accessToken = req.cookies.get("accessToken");
  const refreshToken = req.cookies.get("refreshToken");

  // Log cookie information for debugging
  console.log("Access Token:", accessToken);
  console.log("Refresh Token:", refreshToken);

  // Determine if tokens exist
  const hasAccessToken = !!accessToken;
  const hasRefreshToken = !!refreshToken;
  
  // If there's no access token and the user is not on an auth route, redirect to login
  // if (!hasAccessToken && !hasRefreshToken && !authRoutes.includes(path)) {
  //   console.log("No tokens found, redirecting to /login");
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  // If there is an access token or refresh token and the user is on an auth route, redirect to home
  if ((hasAccessToken || hasRefreshToken) && authRoutes.includes(path)) {
    console.log("Tokens found and user on auth route, redirecting to /");
    return NextResponse.redirect(new URL("/", req.url));
  }

  // For all other cases, allow access
  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};