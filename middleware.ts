import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define protected routes
const protectedRoutes = ['/search', '/alerts'];
const authRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/auth/forgotpassword',
  '/auth/resetpassword',
];

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const customToken = req.cookies.get('token')?.value.trim();
  const isLoggedIn = !!token || !!customToken;
  const pathname = req.nextUrl.pathname;

  // Check if it is auth route
  if (authRoutes.includes(pathname)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Check if the route is protected
  if (protectedRoutes.includes(pathname)) {
    if (!isLoggedIn) {
      // Redirect to sign in if token is not found
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
  }
  // Allow access if token exists or route is public
  return NextResponse.next();
}

// Define routes where middleware applies
export const config = {
  matcher: [
    '/search',
    '/alerts',
    '/auth/signin',
    '/auth/signup',
    '/auth/forgotpassword',
    '/auth/resetpassword',
  ], // Apply middleware to specific paths
};
