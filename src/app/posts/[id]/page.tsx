import PostDelete from "@/components/post-delete";
import { auth } from "@/auth";
import { fetchPostById } from "@/db/queries/posts";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PostDetailProps {
    params: {
        id: string;
    };
}

export default async function PostDetail({ params }: PostDetailProps) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/signin');
    }

    const post = await fetchPostById(params.id);
    const isAuthor = session.user.id === post.authorId;
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'long',
    }).format(post.createdAt);

    return (
        <main className="min-h-screen bg-gray-100 px-4 py-10 md:py-16">
            <div className="mx-auto w-full max-w-3xl">
                <Link
                    href="/"
                    className="inline-flex items-center rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50"
                >
                    Back
                </Link>

                <article className="mt-6 rounded-3xl bg-white p-6 md:p-10 shadow-lg">
                    <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                        by {post.author.name}
                    </p>
                    <h1 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
                        {post.title}
                    </h1>
                    <p className="mt-4 text-sm text-gray-500">
                        Posted on {formattedDate}
                    </p>

                    <div className="mt-8 whitespace-pre-wrap text-base md:text-lg leading-8 text-gray-700">
                        {post.content}
                    </div>

                    {isAuthor && (
                        <div className="mt-10 flex flex-col sm:flex-row gap-3">
                            <Link
                                href={`/posts/${post.id}/edit`}
                                className="inline-flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
                            >
                                Edit
                            </Link>
                            <div className="flex-1">
                                <PostDelete id={post.id} />
                            </div>
                        </div>
                    )}
                </article>
            </div>
        </main>
    );
}