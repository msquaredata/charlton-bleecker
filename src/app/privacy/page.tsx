import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="container-site section-pad max-w-2xl">
      <h1 className="font-display text-3xl font-semibold">Privacy Policy</h1>
      <p className="mt-6 text-[var(--color-muted)]">
        Final privacy policy text will be provided by Charlton Bleecker legal
        counsel. This placeholder exists so footer links resolve during
        development.
      </p>
      <Link href="/" className="mt-8 inline-block text-[var(--color-accent)]">
        ← Home
      </Link>
    </main>
  );
}
