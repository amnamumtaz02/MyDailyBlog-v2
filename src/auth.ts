import { db } from '@/db'
import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'

const credentialsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    trustHost: true,
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const parsed = credentialsSchema.safeParse(credentials)
                if (!parsed.success) return null
                const email = parsed.data.email.toLowerCase()
                const user = await db.user.findUnique({ where: { email } })
                if (!user) return null
                const passwordMatch = await bcrypt.compare(parsed.data.password, user.password)
                if (!passwordMatch) return null
                return { id: user.id, name: user.name, email: user.email }
            },
        }),
    ],
    pages: { signIn: '/signin', error: '/signin' },
    session: { strategy: 'jwt' },
    callbacks: {
        jwt({ token, user }) {
            if (user) token.id = user.id
            return token
        },
        session({ session, token }) {
            if (session.user && token.id) session.user.id = token.id as string
            return session
        },
    },
})