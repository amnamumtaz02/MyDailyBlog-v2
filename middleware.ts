import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/signin', '/signup']

export async function middleware(req: NextRequest) {
    const { nextUrl } = req
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
    })

    const isAuthenticated = !!token

    if (!isAuthenticated && !isPublicRoute) {
        const signInUrl = new URL('/signin', nextUrl.origin)
        signInUrl.searchParams.set('callbackUrl', nextUrl.pathname)
        return NextResponse.redirect(signInUrl)
    }

    if (isAuthenticated && isPublicRoute) {
        const homeUrl = new URL('/', nextUrl.origin)
        return NextResponse.redirect(homeUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
