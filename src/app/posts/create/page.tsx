import { createPost } from "@/app/actions/posts";
import { auth } from "@/auth";
import PostForm from "@/components/post-form";
import { redirect } from "next/navigation";

export default async function PostsCreate() {
    const session = await auth();

    if (!session?.user) {
        redirect('/signin');
    }

    return (
        <main className="min-h-screen bg-gray-100 flex items-start justify-center pt-16 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-lg">
                <PostForm formAction={createPost} initialData={{ title: '', content: '' }} />
            </div>
        </main>
    );
}
