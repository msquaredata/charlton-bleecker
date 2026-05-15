import {
  Shield,
  Users,
  CheckCircle,
  BarChart2,
  Zap,
  Lock,
} from "lucide-react";
import FadeUp from "@/components/ui/FadeUp";
import { WHY_US } from "@/data/criteria";

const icons = {
  Shield,
  Users,
  CheckCircle,
  BarChart2,
  Zap,
  Lock,
} as const;

export default function WhyUs() {
  return (
    <section id="why-us" className="section-pad bg-[var(--color-surface)]">
      <div className="container-site">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            Why partner with us
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--color-dark)] md:text-4xl">
            Why Founders Choose Charlton Bleecker
          </h2>
        </FadeUp>
        <div className="mt-12 grid items-stretch gap-8 md:grid-cols-2 xl:grid-cols-3">
          {WHY_US.map((card, i) => {
            const Icon = icons[card.icon];
            return (
              <FadeUp
                key={card.title}
                delay={i * 0.07}
                className="h-full min-h-0"
              >
                <article className="flex h-full min-h-0 flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm">
                  <Icon
                    className="size-9 shrink-0 text-[var(--color-accent)]"
                    aria-hidden
                  />
                  <h3 className="mt-4 font-display text-xl font-semibold text-[var(--color-dark)]">
                    {card.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
                    {card.body}
                  </p>
                  {"cta" in card && card.cta ? (
                    <a
                      href={card.cta.href}
                      className="mt-auto inline-flex pt-4 text-sm font-semibold text-[var(--color-accent)] hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {card.cta.label}
                    </a>
                  ) : null}
                </article>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
