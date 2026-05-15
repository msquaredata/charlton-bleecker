"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import BrandLogo from "@/components/layout/BrandLogo";
import { BRAND_LOGO_HEADER_CLASSES } from "@/components/layout/brand-logo-sizes";
import { cn } from "@/lib/utils";

export const NAV_SECTIONS = [
  { label: "About", hash: "about" },
  { label: "Criteria", hash: "criteria" },
  { label: "Why Us", hash: "why-us" },
  { label: "Process", hash: "process" },
  { label: "Team", hash: "team" },
  { label: "Blog", hash: "blog" },
  { label: "Contact", hash: "contact" },
] as const;

/** @deprecated use NAV_SECTIONS */
export const NAV_LINKS = NAV_SECTIONS.map((s) => ({
  label: s.label,
  href: `#${s.hash}` as const,
}));

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!isHome) return;
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const sectionHighlight = isHome ? active : "";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)] bg-white shadow-sm">
      <nav
        className="container-site flex min-h-14 w-full items-center justify-between gap-3 py-2 md:min-h-16 md:gap-4 md:py-2.5"
        aria-label="Primary"
      >
        <div className="flex shrink-0 items-center">
          <Link
            href="/"
            className="flex shrink-0 items-center outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            aria-label="Charlton Bleecker home"
          >
            <BrandLogo className={BRAND_LOGO_HEADER_CLASSES} />
          </Link>
        </div>
        <div className="hidden min-h-0 min-w-0 flex-1 items-center justify-center px-2 md:flex">
          <ul className="flex max-w-full flex-wrap justify-center gap-x-2 gap-y-1 sm:gap-x-3 md:flex-nowrap md:gap-x-2.5 lg:gap-x-4">
            {NAV_SECTIONS.map((item) => (
              <li key={item.hash} className="shrink-0">
                <a
                  href={isHome ? `#${item.hash}` : `/#${item.hash}`}
                  className={cn(
                    "whitespace-nowrap text-xs font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)] md:text-sm",
                    sectionHighlight === item.hash && "text-[var(--color-accent)]",
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden shrink-0 md:block">
          <Link
            href="/submit"
            className={cn(
              "inline-flex min-h-10 shrink-0 items-center justify-center rounded-sm px-5 py-2 text-sm font-semibold transition-colors",
              "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]",
            )}
          >
            Submit Your Company
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 rounded-sm p-2 text-[var(--color-dark)] hover:bg-black/5 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>
      {open ? (
        <div
          className="fixed inset-0 top-[4.5rem] z-40 flex flex-col gap-6 bg-[var(--color-dark)] p-8 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {NAV_SECTIONS.map((item) => (
            <a
              key={item.hash}
              href={isHome ? `#${item.hash}` : `/#${item.hash}`}
              className="text-lg font-medium text-white"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/submit"
            className="mt-4 inline-flex min-h-12 items-center justify-center rounded-sm bg-[var(--color-accent)] px-5 font-semibold text-white"
            onClick={() => setOpen(false)}
          >
            Submit Your Company
          </Link>
        </div>
      ) : null}
    </header>
  );
}
