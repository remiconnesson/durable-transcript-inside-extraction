import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentProps } from "react";

const components: MDXComponents = {
  h1: ({ children }: ComponentProps<"h1">) => (
    <h1 className="text-3xl font-semibold tracking-tight mt-8 mb-4">
      {children}
    </h1>
  ),
  h2: ({ children }: ComponentProps<"h2">) => (
    <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-3">
      {children}
    </h2>
  ),
  p: ({ children }: ComponentProps<"p">) => (
    <p className="leading-7 text-zinc-700 mb-4">{children}</p>
  ),
  ul: ({ children }: ComponentProps<"ul">) => (
    <ul className="list-disc pl-6 space-y-1 mb-4">{children}</ul>
  ),
  ol: ({ children }: ComponentProps<"ol">) => (
    <ol className="list-decimal pl-6 space-y-1 mb-4">{children}</ol>
  ),
  code: ({ className, children }: ComponentProps<"code">) => {
    if (className?.includes("language-")) {
      return <code className={className}>{children}</code>;
    }

    return (
      <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
        {children}
      </code>
    );
  },
  pre: ({ className, ...props }: ComponentProps<"pre">) => (
    <pre
      className={`overflow-x-auto rounded-lg mb-6 text-sm ${className ?? ""}`.trim()}
      {...props}
    />
  ),
  a: ({ href, children }: ComponentProps<"a">) => {
    if (!href) return <>{children}</>;

    if (href.startsWith("/")) {
      return (
        <Link
          href={href}
          className="text-blue-600 underline underline-offset-4"
        >
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline underline-offset-4"
      >
        {children}
      </a>
    );
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
