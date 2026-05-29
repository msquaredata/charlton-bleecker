import type { Metadata } from "next";
import Image from "next/image";
import {
  BarChart2,
  CheckCircle,
  Lock,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import OnePagerFooter from "@/components/one-pagers/OnePagerFooter";
import {
  ABOUT_HEADLINE,
  ABOUT_LEAD,
  CRITERIA,
  HERO_HEADLINE,
  HERO_TAGLINE,
  PILLARS,
  PROCESS_STEPS,
  WHY_US,
} from "@/data/onePagerContent";

export const metadata: Metadata = {
  title: "Visual overview · One-pagers",
};

const whyIcons = {
  Shield,
  Users,
  CheckCircle,
  BarChart2,
  Zap,
  Lock,
} as const;

export default function OnePagerOverviewPage() {
  return (
    <main className="container-site py-10 md:py-14">
      <section className="rounded-xl bg-[var(--color-dark)] px-6 py-12 text-center text-white md:px-10 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
          Visual overview
        </p>
        <h1 className="mx-auto mt-4 max-w-4xl font-display text-3xl font-semibold leading-tight md:text-5xl">
          {HERO_HEADLINE.replace(/\.$/, "")}
          <span className="text-[var(--color-accent)]">.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
          {HERO_TAGLINE}
        </p>
      </section>

      <section className="mt-14 border-t border-[var(--color-border)] pt-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
          Who we are
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--color-dark)] md:text-3xl">
          {ABOUT_HEADLINE}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--color-muted)] md:text-lg">
          {ABOUT_LEAD}
        </p>
      </section>

      <section className="print-break-before mt-14">
        <h2 className="font-display text-xl font-semibold text-[var(--color-dark)] md:text-2xl">
          What you get
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {PILLARS.map((p) => (
            <article
              key={p.title}
              className="one-pager-card flex flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm"
            >
              <div className="relative aspect-[16/10] bg-[var(--color-surface)]">
                <Image
                  src={p.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-semibold text-[var(--color-dark)]">
                  {p.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
                  {p.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="print-break-before mt-14 rounded-xl bg-[var(--color-surface)] px-5 py-10 md:px-8 md:py-12">
        <h2 className="font-display text-xl font-semibold text-[var(--color-dark)] md:text-2xl">
          Why founders choose us
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {WHY_US.map((card) => {
            const Icon = whyIcons[card.icon];
            return (
              <article
                key={card.title}
                className="one-pager-card rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-sm"
              >
                <Icon
                  className="size-8 text-[var(--color-accent)]"
                  aria-hidden
                />
                <h3 className="mt-3 font-display text-lg font-semibold text-[var(--color-dark)]">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                  {card.body}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-xl font-semibold text-[var(--color-dark)] md:text-2xl">
          Criteria at a glance
        </h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {CRITERIA.map((c) => (
            <li
              key={c.label}
              className="one-pager-card flex min-h-[5.75rem] flex-col justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm shadow-sm"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                {c.label}
              </span>
              <span className="mt-1.5 font-display text-base font-semibold leading-snug text-[var(--color-dark)] md:text-lg">
                {c.value}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="print-break-before mt-14">
        <h2 className="font-display text-xl font-semibold text-[var(--color-dark)] md:text-2xl">
          How it works
        </h2>
        <div className="mt-8">
          {PROCESS_STEPS.map((step, index) => {
            const isLast = index === PROCESS_STEPS.length - 1;
            const stepNum = String(Number.parseInt(step.number, 10));
            return (
              <div
                key={step.number}
                className="one-pager-card flex gap-4 pb-8 last:pb-0"
              >
                <div className="relative flex w-10 shrink-0 flex-col items-center">
                  {!isLast ? (
                    <div
                      className="absolute left-1/2 top-8 bottom-0 z-0 w-0.5 -translate-x-1/2 bg-[var(--color-accent)]"
                      aria-hidden
                    />
                  ) : null}
                  <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] font-display text-sm font-bold text-white">
                    {stepNum}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="font-display text-lg font-semibold text-[var(--color-dark)]">
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{step.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <OnePagerFooter />
    </main>
  );
}
