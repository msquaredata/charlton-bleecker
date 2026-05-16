"use client";

import Link from "next/link";
import { useEffect } from "react";
import { isEmbeddedFrame } from "@/lib/intake/is-embedded";

export default function ThankYouPage() {
  useEffect(() => {
    if (!isEmbeddedFrame()) return;
    document.body.classList.add("embedded");
    return () => document.body.classList.remove("embedded");
  }, []);

  return (
    <main className="thankyou-main min-h-[100svh] bg-[var(--color-surface)] px-4 py-24">
      <div className="thankyou-content container-site max-w-xl text-center">
        <h1 className="font-display text-4xl font-semibold text-[var(--color-dark)]">
          Thank you
        </h1>
        <p className="mt-6 text-lg text-[var(--color-muted)]">
          Your deal prospect intake was received. We appreciate you sharing the
          opportunity with us.
        </p>
        <p className="mt-4 text-[var(--color-muted)]">
          Our team will review your submission shortly. If your opportunity aligns
          with our current focus areas, a partner will reach out with next steps.
        </p>
        <Link
          href="/submit"
          className="mt-10 inline-flex min-h-11 items-center justify-center rounded-sm bg-[var(--color-accent)] px-8 font-semibold text-white hover:bg-[var(--color-accent-hover)]"
        >
          Submit another response
        </Link>
      </div>
    </main>
  );
}
