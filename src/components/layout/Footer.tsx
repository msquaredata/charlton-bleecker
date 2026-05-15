import Link from "next/link";
import { Linkedin } from "lucide-react";
import BrandLogo from "@/components/layout/BrandLogo";
import { BRAND_LOGO_HEADER_CLASSES } from "@/components/layout/brand-logo-sizes";

const footerLinks = [
  { label: "About", href: "/#about" },
  { label: "Criteria", href: "/#criteria" },
  { label: "Process", href: "/#process" },
  { label: "Team", href: "/#team" },
  { label: "Blog", href: "/#blog" },
  { label: "Submit", href: "/submit" },
  { label: "Contact", href: "/#contact" },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="container-site section-pad">
        <div className="flex flex-col items-center gap-10 text-center md:flex-row md:items-start md:justify-between md:gap-4 md:text-left">
          <div className="flex shrink-0 flex-col items-center md:items-start">
            <Link
              href="/"
              className="flex shrink-0 items-center outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
              aria-label="Charlton Bleecker home"
            >
              <BrandLogo className={BRAND_LOGO_HEADER_CLASSES} />
            </Link>
            <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-[var(--color-muted)] md:mt-3 md:text-left">
              A private holding company acquiring and scaling enduring B2B
              businesses.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="flex w-full min-h-0 flex-col items-center justify-center px-2 md:min-w-0 md:flex-1"
          >
            <ul className="flex flex-col items-center gap-2.5 sm:flex-row sm:flex-nowrap sm:justify-center sm:gap-x-2 sm:gap-y-0 md:gap-x-2.5 lg:gap-x-4">
              {footerLinks.map((l) => (
                <li key={l.href} className="shrink-0">
                  <a
                    href={l.href}
                    className="whitespace-nowrap text-xs font-medium text-[var(--color-dark)] hover:text-[var(--color-accent)] md:text-sm"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex w-full shrink-0 flex-col items-center md:w-auto md:items-end md:text-right">
            <a
              href="mailto:ContactUs@CharltonBleecker.com"
              className="text-sm font-medium leading-normal text-[var(--color-dark)] hover:text-[var(--color-accent)]"
            >
              ContactUs@CharltonBleecker.com
            </a>
            <a
              href="https://www.linkedin.com/in/gtoddsilva/"
              className="mt-3 inline-flex items-center justify-center gap-2 text-sm font-medium leading-normal text-[var(--color-dark)] hover:text-[var(--color-accent)] md:justify-end"
              aria-label="LinkedIn — G. Todd Silva"
            >
              <Linkedin className="size-5 shrink-0" aria-hidden />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)]">
        <div className="container-site flex flex-col items-center justify-center gap-3 py-6 text-center text-xs text-[var(--color-muted)] md:flex-row md:items-center md:justify-between md:gap-6 md:text-left">
          <span className="max-w-full text-balance md:text-left">
            Copyright 2025 Charlton Bleecker Group LLC · All Rights Reserved
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 md:flex-nowrap md:justify-end md:gap-x-6">
            <Link
              href="/privacy"
              className="whitespace-nowrap hover:text-[var(--color-dark)]"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="whitespace-nowrap hover:text-[var(--color-dark)]"
            >
              Terms of Use
            </Link>
            <Link
              href="/disclaimer"
              className="whitespace-nowrap hover:text-[var(--color-dark)]"
            >
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
