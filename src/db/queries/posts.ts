import type { Post } from '@prisma/client'
import { db } from '@/db'
import { notFound } from 'next/navigation'

export interface PostWithAuthor extends Post {
    author: {
        name: string
    }
}

export async function fetchPosts(): Promise<PostWithAuthor[]> {
    return await db.post.findMany({
        include: {
            author: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: [
            {
                updatedAt: 'desc',
            }
        ],
    })
}

export async function fetchPostById(id: string): Promise<PostWithAuthor> {
    const post = await db.post.findUnique({
        where: {
            id,
        },
        include: {
            author: {
                select: {
                    name: true,
                },
            },
        },
    })

    if (!post) {
        notFound()
    }

    return post
}