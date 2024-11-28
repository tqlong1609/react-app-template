import { NextRequest, NextResponse } from 'next/server'

const COOKIE_KEYS = {
  TOKEN: 'ns-sdm-token',
  AUTHORIZATION: 'Authorization',
}

const protectedRoutes = ['/', '/factories']
const publicRoutes = ['/login']

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
  const cookie = req.cookies.get(COOKIE_KEYS.AUTHORIZATION)?.value
  if (path === '/logout') {
    const response = NextResponse.redirect(new URL('/login', req.url))
    response.cookies.delete(COOKIE_KEYS.AUTHORIZATION)
    return response
  }

  if (isProtectedRoute) {
    if (!cookie) {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    return NextResponse.next()
  }
  if (isPublicRoute && cookie) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/auth:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
