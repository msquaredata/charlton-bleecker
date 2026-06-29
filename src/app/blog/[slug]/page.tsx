import Link from "next/link";
import { BLOG_POSTS, getBlogPost } from "@/data/blog";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post" };
  return { title: `${post.title} | Charlton Bleecker` };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return (
      <main className="container-site section-pad">
        <p>Post not found.</p>
      </main>
    );
  }

  return (
    <article className="bg-[var(--color-bg)]">
      <div className="container-site section-pad max-w-3xl">
        <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
          {post.author}
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-[var(--color-dark)]">
          {post.title}
        </h1>
        <div className="mt-10 max-w-none">{post.body}</div>
        <Link
          href="/#blog"
          className="mt-12 inline-flex font-semibold text-[var(--color-accent)] hover:underline"
        >
          ← Back to insights
        </Link>
      </div>
    </article>
  );
}
