import Image from "next/image";
import FadeUp from "@/components/ui/FadeUp";
import { PILLARS } from "@/data/criteria";
import { ABOUT_HEADLINE, ABOUT_LEAD } from "@/data/onePagerContent";

export default function About() {
  return (
    <section id="about" className="section-pad bg-[var(--color-bg)]">
      <div className="container-site">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            Who we are
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--color-dark)] md:text-4xl">
            {ABOUT_HEADLINE}
          </h2>
        </FadeUp>
        <FadeUp delay={0.06}>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-muted)]">
            {ABOUT_LEAD}
          </p>
        </FadeUp>
        <div className="mt-14 grid items-stretch gap-8 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <FadeUp
              key={p.title}
              delay={i * 0.08}
              className="h-full min-h-0"
            >
              <article className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
                <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-[var(--color-surface)]">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-semibold text-[var(--color-dark)]">
                    {p.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
                    {p.body}
                  </p>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
