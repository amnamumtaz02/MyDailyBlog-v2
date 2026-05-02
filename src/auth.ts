import { db } from '@/db'
import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const email = (credentials.email as string).toLowerCase()
                const user = await db.user.findUnique({ where: { email } })
                if (!user) return null

                const passwordMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )
                if (!passwordMatch) return null

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            },
        }),
    ],
    pages: {
        signIn: '/signin',
        error: '/signin',
    },
    session: { strategy: 'jwt' as const },
    callbacks: {
        jwt({ token, user }: any) {
            if (user) token.id = user.id
            return token
        },
        session({ session, token }: any) {
            if (session.user && token.id) {
                session.user.id = token.id as string
            }
            return session
        },
    },
}

export default NextAuth(authOptions)