import { db } from '@/db'
import { sessionOptions, type SessionData } from '@/lib/session'
import bcrypt from 'bcryptjs'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const signInSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(1),
})

export async function POST(request: Request) {
    const body = await request.json().catch(() => null)
    const parsed = signInSchema.safeParse(body)

    if (!parsed.success) {
        return NextResponse.json({ message: 'Invalid email or password.' }, { status: 400 })
    }

    const email = parsed.data.email.toLowerCase()

    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
        return NextResponse.json({ message: 'Incorrect email or password.' }, { status: 401 })
    }

    const passwordMatches = await bcrypt.compare(parsed.data.password, user.password)
    if (!passwordMatches) {
        return NextResponse.json({ message: 'Incorrect email or password.' }, { status: 401 })
    }

    const session = await getIronSession<SessionData>(cookies(), sessionOptions)
    session.user = {
        userId: user.id,
        name: user.name,
        email: user.email,
    }
    await session.save()

    return NextResponse.json({ ok: true })
}