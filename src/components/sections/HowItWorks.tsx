"use client";

import { motion } from "framer-motion";
import FadeUp from "@/components/ui/FadeUp";
import { PROCESS_STEPS } from "@/data/criteria";

export default function HowItWorks() {
  return (
    <section id="process" className="section-pad bg-[var(--color-bg)]">
      <div className="container-site">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            The process
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--color-dark)] md:text-4xl">
            From First Call to Close
          </h2>
        </FadeUp>
        <ol className="mt-14 hidden items-stretch gap-8 md:grid md:grid-cols-6">
          {PROCESS_STEPS.map((step, i) => (
            <motion.li
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="relative flex min-h-0 flex-col border-t-2 border-[var(--color-accent)] pt-6"
            >
              <span className="font-display text-4xl font-semibold text-[var(--color-accent)]/40">
                {step.number}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-[var(--color-dark)]">
                {step.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
                {step.body}
              </p>
            </motion.li>
          ))}
        </ol>
        <ol className="mt-12 flex flex-col gap-10 md:hidden">
          {PROCESS_STEPS.map((step, i) => (
            <motion.li
              key={step.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="border-l-2 border-[var(--color-accent)] pl-6"
            >
              <span className="font-display text-3xl font-semibold text-[var(--color-accent)]/50">
                {step.number}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold text-[var(--color-dark)]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                {step.body}
              </p>
            </motion.li>
          ))}
        </ol>
        <FadeUp delay={0.2}>
          <p className="mt-12 text-center text-sm text-[var(--color-muted)]">
            Typical timeline from first call to close: 60–90 days.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
