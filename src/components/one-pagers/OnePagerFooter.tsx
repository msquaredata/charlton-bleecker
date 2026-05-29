import Link from "next/link";
import DownloadPdfButton from "@/components/one-pagers/DownloadPdfButton";
import {
  CALENDLY_URL,
  CONTACT_EMAIL,
  DISCLAIMER_SHORT,
  NDA_TEMPLATE_HREF,
} from "@/data/onePagerContent";

type OnePagerFooterProps = {
  /** Hub page hides “back to index” style extras */
  variant?: "leaf" | "hub";
};

export default function OnePagerFooter({ variant = "leaf" }: OnePagerFooterProps) {
  return (
    <footer className="one-pager-card mt-16 border-t border-[var(--color-border)] pt-10 pb-6">
      <div className="flex flex-col gap-6 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href="/submit"
            className="inline-flex min-h-11 items-center justify-center rounded-sm bg-[var(--color-accent)] px-6 font-semibold text-white hover:bg-[var(--color-accent-hover)]"
          >
            Submit your company
          </Link>
          <a
            href={CALENDLY_URL}
            className="inline-flex min-h-11 items-center justify-center rounded-sm border-2 border-[var(--color-dark)] px-6 font-semibold text-[var(--color-dark)] hover:bg-[var(--color-surface)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a call
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-[var(--color-border)] px-6 font-semibold text-[var(--color-dark)] hover:bg-[var(--color-surface)]"
          >
            Email us
          </a>
          {variant === "leaf" ? <DownloadPdfButton /> : null}
          {NDA_TEMPLATE_HREF ? (
            <a
              href={NDA_TEMPLATE_HREF}
              className="inline-flex min-h-11 items-center justify-center text-sm font-semibold text-[var(--color-accent)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download NDA
            </a>
          ) : null}
        </div>
        {variant === "leaf" ? (
          <Link
            href="/one-pagers"
            className="pdf-export-hidden text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-accent)]"
          >
            All one-pagers
          </Link>
        ) : null}
      </div>
      <p className="pdf-export-hidden mt-8 max-w-3xl text-xs leading-relaxed text-[var(--color-muted)]">
        {DISCLAIMER_SHORT}{" "}
        <Link href="/disclaimer" className="underline hover:text-[var(--color-dark)]">
          Full disclaimer
        </Link>
        .
      </p>
    </footer>
  );
}
