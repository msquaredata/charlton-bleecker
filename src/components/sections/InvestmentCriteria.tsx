import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import { CRITERIA } from "@/data/criteria";

export default function InvestmentCriteria() {
  return (
    <section id="criteria" className="section-pad bg-[var(--color-dark)] text-white">
      <div className="container-site">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            What we look for
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
            Our Investment Criteria
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            We focus on businesses with a durable competitive edge, whether it
            exists now or in the future.
          </p>
        </FadeUp>
        <div className="mt-12 grid items-stretch gap-6 sm:grid-cols-2">
          {CRITERIA.map((item, i) => (
            <FadeUp
              key={item.label}
              delay={i * 0.06}
              className="h-full min-h-0"
            >
              <div className="flex h-full min-h-[7.5rem] flex-col rounded-lg border border-white/15 bg-white/5 p-6">
                <p className="text-sm font-medium uppercase tracking-wide text-white/60">
                  {item.label}
                </p>
                <p className="mt-2 flex-1 font-display text-2xl font-semibold leading-snug text-white">
                  {item.value}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.3}>
          <div className="mt-12 text-center">
            <Link
              href="/submit"
              className="inline-flex min-h-11 items-center justify-center rounded-sm bg-[var(--color-accent)] px-8 font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
            >
              Submit Your Company →
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
