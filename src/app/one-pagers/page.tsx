import type { Metadata } from "next";
import Link from "next/link";
import OnePagerFooter from "@/components/one-pagers/OnePagerFooter";
import { ONE_PAGER_VARIANTS } from "@/data/onePagerContent";

export const metadata: Metadata = {
  title: "Index · One-pagers",
};

export default function OnePagersHubPage() {
  return (
    <main className="container-site py-12 md:py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
        Charlton Bleecker
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-[var(--color-dark)] md:text-4xl">
        One-pager variants
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--color-muted)]">
        Three formats for lead review — same story, different layout. Not linked
        from the public site navigation.
      </p>
      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {ONE_PAGER_VARIANTS.map((v) => (
          <li key={v.slug}>
            <Link
              href={`/one-pagers/${v.slug}`}
              className="one-pager-card flex h-full flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                {v.slug}
              </span>
              <span className="mt-2 font-display text-xl font-semibold text-[var(--color-dark)]">
                {v.title}
              </span>
              <span className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
                {v.description}
              </span>
              <span className="mt-6 text-sm font-semibold text-[var(--color-accent)]">
                Open →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <OnePagerFooter variant="hub" />
    </main>
  );
}
