'use client'

import { signUp, type SignUpFormState } from '@/app/actions/auth'
import Link from 'next/link'
import { useFormState } from 'react-dom'

const initialState: SignUpFormState = {
    errors: {},
}

export default function SignUpPage() {
    const [formState, action] = useFormState(signUp, initialState)

    return (
        <main className="min-h-screen bg-gray-100 flex items-start justify-center pt-16 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-lg">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">Create Account</h1>

                <form action={action} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block mb-1 text-sm font-semibold text-gray-700">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            className="rounded-lg border border-gray-300 p-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900 bg-white"
                        />
                        {formState.errors.name && (
                            <p className="text-red-500 text-sm mt-1">{formState.errors.name.join(', ')}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block mb-1 text-sm font-semibold text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="rounded-lg border border-gray-300 p-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900 bg-white"
                        />
                        {formState.errors.email && (
                            <p className="text-red-500 text-sm mt-1">{formState.errors.email.join(', ')}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-1 text-sm font-semibold text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="rounded-lg border border-gray-300 p-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900 bg-white"
                        />
                        {formState.errors.password && (
                            <p className="text-red-500 text-sm mt-1">{formState.errors.password.join(', ')}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block mb-1 text-sm font-semibold text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            className="rounded-lg border border-gray-300 p-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900 bg-white"
                        />
                        {formState.errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {formState.errors.confirmPassword.join(', ')}
                            </p>
                        )}
                    </div>

                    {formState.errors._form && (
                        <p className="text-red-500 text-sm">{formState.errors._form.join(', ')}</p>
                    )}

                    <button
                        type="submit"
                        className="bg-gray-900 text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-sm text-gray-600 mt-6">
                    Already have an account?{' '}
                    <Link href="/signin" className="text-gray-900 font-semibold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </main>
    )
}
