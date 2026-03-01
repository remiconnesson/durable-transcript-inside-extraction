import type { BlogPostMetadata, BlogPostModule } from "@/types/blog";

export type BlogPost = {
  slug: string;
  metadata: BlogPostMetadata;
};

const postModules = {
  "hello-next16": () => import("@/content/blog/hello-next16.mdx"),
  "rendering-strategies": () =>
    import("@/content/blog/rendering-strategies.mdx"),
} satisfies Record<string, () => Promise<BlogPostModule>>;

export type BlogSlug = keyof typeof postModules;

export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await Promise.all(
    (Object.keys(postModules) as BlogSlug[]).map(async (slug) => {
      const mod = await postModules[slug]();

      return {
        slug,
        metadata: mod.metadata,
      };
    }),
  );

  return posts.sort((a, b) => b.metadata.date.localeCompare(a.metadata.date));
}

export async function getBlogPostModule(slug: BlogSlug) {
  return postModules[slug]();
}
