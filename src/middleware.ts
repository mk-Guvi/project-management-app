import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Define auth routes (routes that don't require authentication)
  const authRoutes = ['/login', '/signup'];

  // Check for the presence of an access token in cookies
  const hasAccessToken = req.cookies?.has('accessToken')||req.cookies?.has('refreshToken');

  // If there's no access token and the user is not on an auth route, redirect to login
  if (!hasAccessToken && !authRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If there is an access token and the user is on an auth route, redirect to home
  if (hasAccessToken && authRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // For all other cases, allow access
  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};