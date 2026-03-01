import type { ComponentType } from "react";

export type BlogPostMetadata = {
  title: string;
  description: string;
  date: string;
  tags: string[];
};

export type BlogPostModule = {
  default: ComponentType;
  metadata: BlogPostMetadata;
};
