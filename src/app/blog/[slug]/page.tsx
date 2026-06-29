import Link from "next/link";
import { FirmGtFundBody } from "@/content/firm-gt-fund";
import { ProblemAreasBody } from "@/content/problem-areas";
import { BLOG_POSTS } from "@/data/blog";

const POST_BODIES: Record<
  string,
  {
    title: string;
    author: string;
    paragraphs?: string[];
    body?: React.ReactNode;
  }
> = {
  "firm-gt-fund": {
    title: "Firm > Fund",
    author: "David Haber",
    body: <FirmGtFundBody />,
  },
  "blog-post-four-43xem": {
    title:
      "10 problem areas that erode your business value…and how we'll fix them.",
    author: "G. Todd Silva",
    body: <ProblemAreasBody />,
  },
};

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = POST_BODIES[slug];
  if (!meta) return { title: "Post" };
  return { title: `${meta.title} | Charlton Bleecker` };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = POST_BODIES[slug];
  if (!meta) {
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
          {meta.author}
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-[var(--color-dark)]">
          {meta.title}
        </h1>
        <div className="mt-10 max-w-none">
          {meta.body ??
            meta.paragraphs?.map((p, i) => (
              <p
                key={i}
                className="mb-6 text-lg leading-relaxed text-[var(--color-muted)]"
              >
                {p}
              </p>
            ))}
        </div>
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
