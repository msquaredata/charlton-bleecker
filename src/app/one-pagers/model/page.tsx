import type { Metadata } from "next";
import OnePagerFooter from "@/components/one-pagers/OnePagerFooter";
import {
  ABOUT_HEADLINE,
  CRITERIA,
  MODEL_COMPARISON,
  PROCESS_STEPS,
} from "@/data/onePagerContent";

export const metadata: Metadata = {
  title: "Comparison · One-pagers",
};

export default function OnePagerModelPage() {
  return (
    <main className="container-site py-10 md:py-14">
      <h1 className="mt-2 font-display text-3xl font-semibold text-[var(--color-dark)] md:text-4xl">
        {ABOUT_HEADLINE}
      </h1>
      <p className="mt-4 max-w-2xl text-sm text-[var(--color-muted)] md:text-base">
      Charlton Bleecker Group LLC is a private holding company focused on acquiring and growing enduring scalable B2B businesses. We partner with owner-managers to position companies for long-term success, without the constraints of a fund termination date. Your legacy, your team, and your culture remain intact. We welcome challenges, whether operational, financial or succession.
      </p>

      <div className="print:break-after-page mt-10 overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
              <th className="px-4 py-3 font-display font-semibold text-[var(--color-dark)] md:px-5">
                Dimension
              </th>
              <th className="px-4 py-3 font-display font-semibold text-[var(--color-muted)] md:px-5">
                Typical PE fund
              </th>
              <th className="px-4 py-3 font-display font-semibold text-[var(--color-accent)] md:px-5">
                Charlton Bleecker
              </th>
            </tr>
          </thead>
          <tbody>
            {MODEL_COMPARISON.map((row) => (
              <tr
                key={row.dimension}
                className="border-b border-[var(--color-border)] last:border-0"
              >
                <th
                  scope="row"
                  className="px-4 py-3.5 font-medium text-[var(--color-dark)] md:px-5"
                >
                  {row.dimension}
                </th>
                <td className="px-4 py-3.5 text-[var(--color-muted)] md:px-5">
                  {row.traditional}
                </td>
                <td className="px-4 py-3.5 text-[var(--color-text)] md:px-5">
                  {row.ours}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="print:break-after-page print:break-inside-avoid mt-14">
        <h2 className="font-display text-xl font-semibold text-[var(--color-dark)] md:text-2xl">
          Investment criteria
        </h2>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-2">
          {CRITERIA.map((row) => (
            <div
              key={row.label}
              className="one-pager-card rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
            >
              <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                {row.label}
              </dt>
              <dd className="mt-1 font-display text-lg font-semibold text-[var(--color-dark)]">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="print:break-inside-avoid mt-14">
        <h2 className="font-display text-xl font-semibold text-[var(--color-dark)] md:text-2xl">
          Path to partnership
        </h2>
        <ol className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-2">
          {PROCESS_STEPS.map((step) => (
            <li
              key={step.number}
              className="one-pager-card flex gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4"
            >
              <span className="font-display text-2xl font-semibold tabular-nums text-[var(--color-accent)]">
                {step.number}
              </span>
              <div>
                <p className="font-display font-semibold text-[var(--color-dark)]">
                  {step.title}
                </p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <OnePagerFooter />
    </main>
  );
}
