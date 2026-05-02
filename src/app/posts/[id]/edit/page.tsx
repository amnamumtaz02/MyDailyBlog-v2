import { updatePost } from "@/app/actions/posts";
import { auth } from "@/auth";
import PostForm from "@/components/post-form";
import { fetchPostById } from "@/db/queries/posts";
import { notFound, redirect } from "next/navigation";

interface PostsEditProps {
    params: {
        id: string;
    };
}

export default async function PostsEdit({ params }: PostsEditProps) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/signin');
    }

    const { id } = params;

    const post = await fetchPostById(id)

    if (!post || post.authorId !== session.user.id) {
        notFound();
    }

    const updateAction = updatePost.bind(null, id)

    return (
        <main className="min-h-screen bg-gray-100 flex items-start justify-center pt-16 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-lg">
                <PostForm formAction={updateAction} initialData={{ title: post?.title ?? '', content: post?.content ?? '' }} />
            </div>
        </main>
    );
}
