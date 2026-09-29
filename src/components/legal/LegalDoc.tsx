import Link from "next/link";
import type { ReactNode } from "react";

export function LegalDoc({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="container-site section-pad max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
        Legal
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-[var(--color-dark)] md:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-sm text-[var(--color-muted)]">
        Last updated: {updated}
      </p>
      <div className="legal-prose mt-10 space-y-8 text-[var(--color-text)]">
        {children}
      </div>
      <p className="mt-12 border-t border-[var(--color-border)] pt-8 text-sm text-[var(--color-muted)]">
        Questions about these terms? Contact{" "}
        <a
          href="mailto:ContactUs@CharltonBleecker.com"
          className="font-medium text-[var(--color-accent)] hover:underline"
        >
          ContactUs@CharltonBleecker.com
        </a>
        .
      </p>
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link href="/privacy" className="text-[var(--color-dark)] hover:text-[var(--color-accent)]">
          Privacy Policy
        </Link>
        <Link href="/terms" className="text-[var(--color-dark)] hover:text-[var(--color-accent)]">
          Terms of Use
        </Link>
        <Link href="/disclaimer" className="text-[var(--color-dark)] hover:text-[var(--color-accent)]">
          Disclaimer
        </Link>
        <Link href="/" className="text-[var(--color-accent)] hover:underline">
          ← Home
        </Link>
      </div>
    </main>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="font-display text-xl font-semibold text-[var(--color-dark)] md:text-2xl">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-[var(--color-text)] [&_a]:font-medium [&_a]:text-[var(--color-accent)] [&_a]:hover:underline [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
