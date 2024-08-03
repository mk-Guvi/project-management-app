import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Define auth routes (routes that don't require authentication)
  const authRoutes = ['/login', '/signup'];

  // Check for the presence of an access token in cookies
  const hasAccessToken = req.cookies.has('accessToken');
  const hasRefreshToken = req.cookies.has('refreshToken');

  console.log("Cookies:", req.cookies);
  console.log("Path:", path);
  console.log("Has Access Token:", !!hasAccessToken);
  console.log("Has Refresh Token:", !!hasRefreshToken);

  // If there's no access token and the user is not on an auth route, redirect to login
  if (!hasAccessToken && !hasRefreshToken && !authRoutes.includes(path)) {
    console.log("Redirecting to /login");
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If there is an access token and the user is on an auth route, redirect to home
  if ((hasAccessToken || hasRefreshToken) && authRoutes.includes(path)) {
    console.log("Redirecting to /");
    return NextResponse.redirect(new URL('/', req.url));
  }

  // For all other cases, allow access
  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
