import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

/**
 * Route matcher that identifies protected routes requiring authentication.
 * All routes under '/dashboard' and its sub-routes are protected.
 * 
 * @example
 * - `/dashboard` - Protected ✓
 * - `/dashboard/products` - Protected ✓
 * - `/dashboard/analytics` - Protected ✓
 * - `/` - Public ✗
 * - `/auth/signin` - Public ✗
 */
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

/**
 * Next.js middleware that handles authentication for the application.
 * Uses Clerk authentication to protect dashboard routes while allowing public access to other pages.
 * 
 * This middleware:
 * - Checks if the current route is protected (dashboard routes)
 * - Redirects unauthenticated users to sign-in page for protected routes
 * - Allows public access to authentication pages and landing pages
 * - Runs on all routes except static files and Next.js internals
 * 
 * @param auth - Clerk authentication object with protect method
 * @param req - Next.js request object containing route information
 * 
 * @example
 * ```
 * // Protected route access:
 * // User not signed in + visits /dashboard → Redirected to sign-in
 * // User signed in + visits /dashboard → Access granted
 * 
 * // Public route access:
 * // Any user visits / → Access granted
 * // Any user visits /auth/signin → Access granted
 * ```
 */
export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (isProtectedRoute(req)) await auth.protect();
});

/**
 * Configuration object that defines which routes the middleware should run on.
 * 
 * The matcher array includes:
 * - All routes except Next.js internals (_next) and static files
 * - API routes and tRPC routes for server-side protection
 * - Excludes common static file extensions (images, fonts, etc.)
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
 */
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
