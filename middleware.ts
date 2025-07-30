import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if user is authenticated by looking for auth token in cookies
  const isAuthenticated = request.cookies.has('isAuthenticated')
  const userRole = request.cookies.get('userRole')?.value
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login']
  
  // If trying to access a public route and already authenticated, redirect appropriately
  if (publicRoutes.includes(pathname) && isAuthenticated) {
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    } else {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  // If trying to access protected routes without authentication, redirect to login
  if (!publicRoutes.includes(pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If admin tries to access customer routes, redirect to admin
  if (pathname === '/' && userRole === 'admin') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }
  
  // If customer tries to access admin routes, redirect to home
  if (pathname.startsWith('/admin') && userRole === 'customer') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 