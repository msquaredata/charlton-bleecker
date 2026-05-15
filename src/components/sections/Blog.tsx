import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import { BLOG_POSTS } from "@/data/blog";

export default function Blog() {
  return (
    <section id="blog" className="section-pad bg-[var(--color-bg)]">
      <div className="container-site">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            Insights
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--color-dark)] md:text-4xl">
            From the Desk of Charlton Bleecker
          </h2>
        </FadeUp>
        <div className="mt-12 grid items-stretch gap-8 md:grid-cols-2">
          {BLOG_POSTS.map((post, i) => (
            <FadeUp
              key={post.slug}
              delay={i * 0.08}
              className="h-full min-h-0"
            >
              <article className="flex h-full min-h-0 flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-8 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
                  {post.date} · {post.author}
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-[var(--color-dark)]">
                  {post.title}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
                  {post.excerpt}
                </p>
                <Link
                  href={post.href}
                  className="mt-auto inline-flex pt-6 text-sm font-semibold text-[var(--color-accent)] hover:underline"
                >
                  Read more
                </Link>
              </article>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.2}>
          <div className="mt-10 text-center">
            <Link
              href="/blog/firm-gt-fund"
              className="inline-flex text-sm font-semibold text-[var(--color-accent)] hover:underline"
            >
              View all posts →
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
