import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes: Record<string, string[]> = {
  '/admin': ['ADMIN'],
  '/doctors': ['DOCTOR', 'PATIENT'],
  '/doctor': ['DOCTOR'],
  '/appointments': ['PATIENT'],
  '/pricing': ['PATIENT', 'DOCTOR'],
  '/onboarding': ['PATIENT', 'DOCTOR'],
}

const authRoutes = ['/sign-in', '/sign-up']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get('accessToken')?.value
  const userCookie = request.cookies.get('userData')?.value

  let user = null

  try {
    if (userCookie) {
      user = JSON.parse(decodeURIComponent(userCookie))
    }
  } catch (error) {
    console.error('❌ Middleware - Failed to parse user cookie:', error)
  }

  const isProtectedRoute = Object.keys(protectedRoutes).some((route) => pathname.startsWith(route))

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // RULE 1: Redirect to sign-in if accessing protected route without auth
  if (isProtectedRoute && !token) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // RULE 2: Redirect to dashboard if accessing auth routes while logged in
  if (isAuthRoute && token && user) {
    const roleRedirects: Record<string, string> = {
      ADMIN: '/admin',
      DOCTOR: '/doctor',
      PATIENT: '/doctors',
    }
    const redirectPath = roleRedirects[user.role] || '/'
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }

  // RULE 3: Check role-based access
  if (isProtectedRoute && user) {
    const matchedRoute = Object.entries(protectedRoutes).find(([route]) =>
      pathname.startsWith(route),
    )

    if (matchedRoute) {
      const [, allowedRoles] = matchedRoute

      if (!allowedRoles.includes(user.role)) {
        const roleRedirects: Record<string, string> = {
          ADMIN: '/admin',
          DOCTOR: '/doctor',
          PATIENT: '/doctors',
        }
        const redirectPath = roleRedirects[user.role] || '/'
        return NextResponse.redirect(new URL(redirectPath, request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
