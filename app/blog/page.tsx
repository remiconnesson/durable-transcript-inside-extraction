import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Developer notes and experiments written in MDX.",
};

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <main className="py-12">
      <h1 className="text-4xl font-semibold tracking-tight mb-3">Blog</h1>
      <p className="text-zinc-700 mb-10">
        A small MDX blog section built with Next.js 16 and App Router.
      </p>

      <div className="space-y-5">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-xl border p-5">
            <p className="text-sm text-zinc-500">{post.metadata.date}</p>
            <h2 className="text-2xl font-medium mt-1">
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                {post.metadata.title}
              </Link>
            </h2>
            <p className="text-zinc-700 mt-2">{post.metadata.description}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
