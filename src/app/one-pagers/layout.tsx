import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/layout/BrandLogo";
import "./one-pagers-print.css";

export const metadata: Metadata = {
  title: "Review · One-pagers",
  description: "Internal review materials — Charlton Bleecker one-pager variants.",
  robots: { index: false, follow: false },
};

export default function OnePagersLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="one-pagers-shell min-h-full bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="one-pagers-header sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-sm">
        <div className="container-site flex flex-wrap items-center justify-between gap-3 py-3 md:py-4">
          <Link
            href="/"
            className="flex shrink-0 items-center outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            aria-label="Charlton Bleecker home"
          >
            <BrandLogo className="!h-10 sm:!h-11 md:!h-12" />
          </Link>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
            Review materials
          </p>
        </div>
      </header>
      {children}
    </div>
  );
}
