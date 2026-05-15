import Link from "next/link";
import { BLOG_POSTS } from "@/data/blog";

const POST_BODIES: Record<
  string,
  { title: string; date: string; author: string; paragraphs: string[] }
> = {
  "firm-gt-fund": {
    title: "Firm > Fund",
    date: "January 13, 2026",
    author: "G. Todd Silva",
    paragraphs: [
      "Most investors are running funds — optimizing for carry with the fewest people in the shortest time. That model works for a lot of strategies, but it is not the only way to build durable value in private markets.",
      "At Charlton Bleecker, we are building a firm where compounding competitive advantage is a core objective alongside exceptional returns. Permanent capital changes what is possible: longer horizons, fewer conflicts, and a structure aligned with the founders and businesses we partner with.",
      "This is early thinking, published for peers and sellers who care as much about how a deal gets done as the headline number. We will expand on what “firm > fund” means for diligence, governance, and value creation in future posts.",
    ],
  },
  "blog-post-four-43xem": {
    title: "10 Problem Areas That Erode Your Business Value",
    date: "August 14, 2019",
    author: "G. Todd Silva",
    paragraphs: [
      "From misaligned incentives to underdeveloped management teams, certain issues show up repeatedly in engagements — and each can weigh on valuation and certainty of close. A full article treatment is forthcoming; until then, this space summarizes the themes we discuss with operators.",
      "If you are preparing for a transaction, addressing the underlying drivers early usually produces better outcomes than patching the symptoms during diligence. Reach out if you would like a conversation about your situation.",
    ],
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
          {meta.date} · {meta.author}
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-[var(--color-dark)]">
          {meta.title}
        </h1>
        <div className="mt-10 max-w-none">
          {meta.paragraphs.map((p, i) => (
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
