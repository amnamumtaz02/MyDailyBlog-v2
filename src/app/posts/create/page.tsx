import { createPost } from "@/app/actions/posts";
import PostForm from "@/components/post-form";
import { sessionOptions, type SessionData } from "@/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PostsCreate() {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    if (!session.user?.userId) {
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
