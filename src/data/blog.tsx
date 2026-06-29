import { FirmGtFundBody, firmGtFundPost } from "@/content/firm-gt-fund";
import { ProblemAreasBody, problemAreasPost } from "@/content/problem-areas";

const BLOG_POST_ENTRIES = [
  { ...firmGtFundPost, body: <FirmGtFundBody /> },
  { ...problemAreasPost, body: <ProblemAreasBody /> },
] as const;

export const BLOG_POSTS = BLOG_POST_ENTRIES.map((post) => ({
  slug: post.slug,
  title: post.title,
  author: post.author,
  excerpt: post.excerpt,
  href: `/blog/${post.slug}`,
}));

export function getBlogPost(slug: string) {
  return BLOG_POST_ENTRIES.find((post) => post.slug === slug);
}
