"use client";

import { Download } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  isOnePagerSlug,
  onePagerPdfFilename,
  type OnePagerSlug,
} from "@/lib/one-pagers/slugs";

type DownloadPdfButtonProps = {
  slug?: OnePagerSlug;
  className?: string;
  variant?: "primary" | "secondary" | "compact";
};

function resolveSlug(explicitSlug: OnePagerSlug | undefined, pathname: string) {
  if (explicitSlug) {
    return explicitSlug;
  }

  const segment = pathname.split("/").pop();
  return segment && isOnePagerSlug(segment) ? segment : null;
}

export default function DownloadPdfButton({
  slug: explicitSlug,
  className = "",
  variant = "secondary",
}: DownloadPdfButtonProps) {
  const pathname = usePathname();
  const slug = resolveSlug(explicitSlug, pathname);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  if (!slug) {
    return null;
  }

  const pdfUrl = `/api/one-pagers/${slug}/pdf`;
  const filename = onePagerPdfFilename(slug);

  async function handleDownload(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (loading) {
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const response = await fetch(pdfUrl);

      if (!response.ok) {
        throw new Error("PDF generation failed");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const baseStyles =
    "print-hidden inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

  const variantStyles = {
    primary:
      "min-h-11 rounded-sm bg-[var(--color-accent)] px-6 text-white hover:bg-[var(--color-accent-hover)]",
    secondary:
      "min-h-11 rounded-sm border-2 border-[var(--color-dark)] px-6 text-[var(--color-dark)] hover:bg-[var(--color-surface)]",
    compact:
      "rounded-sm border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-dark)] hover:bg-[var(--color-surface)]",
  }[variant];

  return (
    <a
      href={pdfUrl}
      download={filename}
      onClick={handleDownload}
      aria-busy={loading}
      className={`${baseStyles} ${variantStyles} ${className} ${loading ? "pointer-events-none opacity-60" : ""}`.trim()}
    >
      <Download className="size-4 shrink-0" aria-hidden />
      {loading ? "Preparing PDF…" : error ? "Download failed — retry" : "Download PDF"}
    </a>
  );
}
