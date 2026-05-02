import { auth, signOut } from "@/auth";
import { fetchPosts } from "@/db/queries/posts";
import Link from "next/link";
import PostDelete from "@/components/post-delete";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/signin');
  }

  const posts = await fetchPosts()

  return (
    <main
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=80')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-8 py-16">
        <div className="w-full max-w-5xl flex items-center justify-between mb-10">
          {session?.user ? (
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-white font-medium">Welcome, {session.user.name}</span>
              <form
                action={async () => {
                  'use server'
                  await signOut({ redirectTo: '/' })
                }}
              >
                <button
                  type="submit"
                  className="bg-white text-gray-900 font-semibold px-5 py-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/signin"
              className="ml-auto bg-white text-gray-900 font-semibold px-5 py-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Hero */}
        <h1 className="text-6xl font-serif font-bold text-white text-center mb-6 tracking-wide drop-shadow-lg">
          MyDailyBlogs
        </h1>
        <Link
          href="/posts/create"
          className="bg-white text-gray-900 font-semibold px-7 py-3 rounded-full hover:bg-gray-100 transition-colors duration-200 mb-14 shadow-md"
        >
          Create New Post
        </Link>

        {/* Posts grid */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post.id} className="relative bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between overflow-hidden">
              <Link
                href={`/posts/${post.id}`}
                aria-label={`Open ${post.title}`}
                className="absolute inset-0 z-10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
              />
              <div className="relative z-0">
                <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
                <p className="text-gray-600 text-sm mb-2 italic">by {post.author?.name ?? 'Unknown author'}</p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}
                </p>
              </div>
              {session?.user?.id === post.authorId && (
                <div className="relative z-20 flex gap-3 mt-5">
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="flex-1 text-center bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Edit
                  </Link>
                  <PostDelete id={post.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
