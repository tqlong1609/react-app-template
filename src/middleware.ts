import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/member']
const publicRoutes = ['/guest']

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  if (path === '/logout') {
    return NextResponse.redirect(new URL('/guest/signin', req.url))
  }

  if (isProtectedRoute) {
    try {
      if (isGuestPage(path) || path === '/') {
        return NextResponse.redirect(new URL('/member/dashboard', req.nextUrl))
      }
    } catch (err) {
      // 未ログインユーザーはcatch節に処理が移る
      if (!isGuestPage(path) || path === '/') {
        return NextResponse.redirect(new URL('/guest/signin', req.nextUrl))
      }
    }
    return NextResponse.next()
  }
  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/member/dashboard', req.nextUrl))
  }
  return NextResponse.next()
}

const isGuestPage = (path: string): boolean => {
  return path.includes('guest')
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)']
}
