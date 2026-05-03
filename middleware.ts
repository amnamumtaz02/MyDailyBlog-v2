import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/signin' || pathname === '/signup') {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get('blog-session')
  if (!sessionCookie) {
    const signInUrl = new URL('/signin', request.url)
    signInUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/posts/:path*'],
}