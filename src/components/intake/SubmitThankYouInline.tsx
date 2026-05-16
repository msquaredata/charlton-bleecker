import Link from "next/link";

/** Inline thank-you panel (legacy embedded iframe behavior). */
export default function SubmitThankYouInline() {
  return (
    <div className="thankyou-content space-y-8 py-4">
      <div>
        <h2 className="font-display text-3xl font-semibold md:text-4xl">
          Thank you
        </h2>
        <p className="mt-4 text-lg text-white/80">
          Your deal prospect intake was received. We appreciate you sharing the
          opportunity with us.
        </p>
      </div>
      <div className="rounded-lg border border-white/15 bg-white/5 p-6">
        <p className="text-white/85">
          Our team will review your submission shortly. If your opportunity aligns
          with our current focus areas, a partner will reach out with next steps.
        </p>
        <Link
          href="/submit"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-sm bg-[var(--color-accent)] px-8 font-semibold text-white hover:bg-[var(--color-accent-hover)]"
        >
          Submit another response
        </Link>
      </div>
    </div>
  );
}
