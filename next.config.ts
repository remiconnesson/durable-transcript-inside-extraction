import createMDX from "@next/mdx";
import { withWorkflow } from "workflow/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [["@shikijs/rehype", { theme: "github-dark" }]],
  },
});

export default withWorkflow(withMDX(nextConfig));
