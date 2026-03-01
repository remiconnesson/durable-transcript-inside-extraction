declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { BlogPostMetadata } from "@/types/blog";

  export const metadata: BlogPostMetadata;

  const MDXContent: ComponentType;
  export default MDXContent;
}
