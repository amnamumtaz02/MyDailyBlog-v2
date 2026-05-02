'use server'

import { db } from '@/db'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export interface SignUpFormState {
    errors: {
        name?: string[]
        email?: string[]
        password?: string[]
        confirmPassword?: string[]
        _form?: string[]
    }
}

const signUpSchema = z
    .object({
        name: z
            .string({ required_error: 'Full name is required.' })
            .trim()
            .min(1, 'Full name is required.')
            .max(255, 'Full name must be 255 characters or fewer.'),
        email: z
            .string({ required_error: 'Email is required.' })
            .trim()
            .min(1, 'Email is required.')
            .email('Please enter a valid email address.'),
        password: z
            .string({ required_error: 'Password is required.' })
            .min(1, 'Password is required.')
            .min(6, 'Password must be at least 6 characters long.'),
        confirmPassword: z
            .string({ required_error: 'Confirm password is required.' })
            .min(1, 'Confirm password is required.'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match.',
    })

export async function signUp(
    formState: SignUpFormState,
    formData: FormData
): Promise<SignUpFormState> {
    const result = signUpSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    })

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        }
    }

    const email = result.data.email.toLowerCase()

    const existingUser = await db.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        return {
            errors: {
                email: ['An account with this email already exists.'],
            },
        }
    }

    try {
        const hashedPassword = await bcrypt.hash(result.data.password, 10)

        await db.user.create({
            data: {
                name: result.data.name,
                email,
                password: hashedPassword,
            },
        })
    } catch {
        return {
            errors: {
                _form: ['Unable to create account right now. Please try again.'],
            },
        }
    }

    redirect('/signin')
}
