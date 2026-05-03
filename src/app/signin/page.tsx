'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignInPage() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const trimmedEmail = email.trim()

        if (!trimmedEmail || !password) {
            setError('Please enter both email and password.')
            return
        }

        if (!emailPattern.test(trimmedEmail)) {
            setError('Please enter a valid email address.')
            return
        }

        setError(null)
        setIsLoading(true)

        const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: trimmedEmail,
                password,
            }),
        })

        setIsLoading(false)

        if (!response.ok) {
            setError('Incorrect email or password.')
            return
        }

        router.push('/')
    }

    return (
        <main className="min-h-screen bg-gray-100 flex items-start justify-center pt-16 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-lg">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">Sign In</h1>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block mb-1 text-sm font-semibold text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="rounded-lg border border-gray-300 p-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900 bg-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-1 text-sm font-semibold text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="rounded-lg border border-gray-300 p-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900 bg-white"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gray-900 text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-sm text-gray-600 mt-6">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-gray-900 font-semibold hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </main>
    )
}
