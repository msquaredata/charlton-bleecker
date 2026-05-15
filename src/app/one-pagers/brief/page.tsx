import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import OnePagerFooter from "@/components/one-pagers/OnePagerFooter";
import {
  ABOUT_LEAD,
  BRIEF_HOOK,
  CRITERIA,
  PROCESS_STEPS,
  TRUST_LEAD,
} from "@/data/onePagerContent";
import { TEAM } from "@/data/team";

export const metadata: Metadata = {
  title: "Founder brief · One-pagers",
};

const lead = TEAM[0];

export default function OnePagerBriefPage() {
  return (
    <main className="container-site max-w-3xl py-10 md:py-14">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
        Founder brief
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-[var(--color-dark)] md:text-4xl">
        Charlton Bleecker — partner brief
      </h1>
      <p className="mt-6 text-base leading-relaxed text-[var(--color-muted)] md:text-lg">
        {BRIEF_HOOK}
      </p>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-[var(--color-dark)]">
          The problem we solve
        </h2>
        <p className="mt-3 leading-relaxed text-[var(--color-muted)]">
          Many founders need capital and a thoughtful partner but fear losing
          culture, control, and predictability to fund timelines, LP-driven
          decisions, and a predetermined exit. That friction slows good
          transactions and erodes trust before a deal even closes.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-[var(--color-dark)]">
          Our answer
        </h2>
        <p className="mt-3 leading-relaxed text-[var(--color-muted)]">{ABOUT_LEAD}</p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-[var(--color-dark)]">
          What we look for
        </h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-[var(--color-muted)]">
          {CRITERIA.map((c) => (
            <li key={c.label}>
              <span className="font-medium text-[var(--color-dark)]">{c.label}:</span>{" "}
              {c.value}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-[var(--color-dark)]">
          How we move when there is fit
        </h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-[var(--color-muted)]">
          {PROCESS_STEPS.map((step) => (
            <li key={step.number} className="one-pager-card pl-1">
              <span className="font-medium text-[var(--color-dark)]">{step.title}.</span>{" "}
              {step.body}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-[var(--color-dark)]">
          Leadership
        </h2>
        <p className="mt-3 leading-relaxed text-[var(--color-muted)]">{TRUST_LEAD}</p>
        {lead ? (
          <div className="mt-6 flex flex-col gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:flex-row sm:items-center">
            <div className="relative mx-auto size-24 shrink-0 overflow-hidden rounded-full bg-[var(--color-border)] sm:mx-0">
              <Image
                src={lead.photo}
                alt=""
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-[var(--color-dark)]">
                {lead.name}
              </p>
              <p className="text-sm text-[var(--color-muted)]">{lead.title}</p>
              <Link
                href="/#team"
                className="mt-2 inline-block text-sm font-semibold text-[var(--color-accent)] hover:underline"
              >
                View full team on site
              </Link>
            </div>
          </div>
        ) : null}
        <p className="mt-4 text-sm text-[var(--color-muted)]">
          Perspective on permanent capital and firm-building:{" "}
          <Link
            href="/blog/firm-gt-fund"
            className="font-semibold text-[var(--color-accent)] hover:underline"
          >
            Firm {'>'} Fund
          </Link>
          .
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-[var(--color-dark)]">
          Confidentiality
        </h2>
        <p className="mt-3 leading-relaxed text-[var(--color-muted)]">
          We treat your process seriously. An NDA is available before detailed
          conversations, and we respect your time through focused diligence.
        </p>
      </section>

      <OnePagerFooter />
    </main>
  );
}
