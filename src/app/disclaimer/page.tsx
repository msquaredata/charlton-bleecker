import Link from "next/link";

export default function DisclaimerPage() {
  return (
    <main className="container-site section-pad max-w-2xl">
      <h1 className="font-display text-3xl font-semibold">Disclaimer</h1>
      <p className="mt-6 text-[var(--color-muted)]">
        Investment-related disclaimers will be confirmed with legal counsel. This
        placeholder exists so footer links resolve during development.
      </p>
      <Link href="/" className="mt-8 inline-block text-[var(--color-accent)]">
        ← Home
      </Link>
    </main>
  );
}
