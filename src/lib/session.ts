import type { SessionOptions } from 'iron-session'

export interface SessionUser {
    userId: string
    name: string
    email: string
}

export interface SessionData {
    user?: SessionUser
}

export const sessionOptions: SessionOptions = {
    cookieName: 'blog-session',
    password: 'mysupersecretkey12345678901234!!',
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    },
}