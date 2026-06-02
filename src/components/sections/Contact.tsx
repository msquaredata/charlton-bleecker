"use client";

import { useRef, useState } from "react";
import { Calendar, Mail, Lock } from "lucide-react";
import FadeUp from "@/components/ui/FadeUp";
import { NDA_TEMPLATE_HREF } from "@/data/onePagerContent";
import PublicLeadHoneypotInput from "@/components/forms/PublicLeadHoneypotInput";
import PublicLeadTurnstile, {
  isPublicLeadTurnstileEnabled,
} from "@/components/forms/PublicLeadTurnstile";

export default function Contact() {
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    if (isPublicLeadTurnstileEnabled() && !turnstileToken.trim()) {
      setErr("Please complete the security check below.");
      return;
    }

    setSending(true);
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, string> = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      message: String(fd.get("message") || ""),
      _lead_hp: honeypotRef.current?.value ?? "",
    };
    if (turnstileToken.trim()) {
      payload.cfTurnstileResponse = turnstileToken.trim();
    }
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        success?: boolean;
      };
      if (!res.ok) {
        throw new Error(data.error || "Failed to send");
      }
      setMsg(data.message || "Thanks, we received your message.");
      e.currentTarget.reset();
      setTurnstileToken("");
    } catch (e2: unknown) {
      setErr(e2 instanceof Error ? e2.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  const field =
    "mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none";

  return (
    <section id="contact" className="section-pad bg-[var(--color-surface)]">
      <div className="container-site">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            Get in touch
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--color-dark)] md:text-4xl">
            Let&apos;s Start a Conversation
          </h2>
        </FadeUp>
        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <FadeUp delay={0.06}>
            <ul className="space-y-10">
              <li className="flex gap-4">
                <Calendar
                  className="mt-1 size-6 shrink-0 text-[var(--color-accent)]"
                  aria-hidden
                />
                <div>
                  <h3 className="font-display text-lg font-semibold text-[var(--color-dark)]">
                    Book a call
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    Schedule a 30-minute intro call
                  </p>
                  <a
                    href="https://calendly.com/gts-charltonbleecker"
                    className="mt-2 inline-flex text-sm font-semibold text-[var(--color-accent)] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Calendly
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <Mail
                  className="mt-1 size-6 shrink-0 text-[var(--color-accent)]"
                  aria-hidden
                />
                <div>
                  <h3 className="font-display text-lg font-semibold text-[var(--color-dark)]">
                    Email us
                  </h3>
                  <a
                    href="mailto:ContactUs@CharltonBleecker.com"
                    className="mt-1 inline-block text-sm font-medium text-[var(--color-dark)] hover:text-[var(--color-accent)]"
                  >
                    ContactUs@CharltonBleecker.com
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <Lock
                  className="mt-1 size-6 shrink-0 text-[var(--color-accent)]"
                  aria-hidden
                />
                <div>
                  <h3 className="font-display text-lg font-semibold text-[var(--color-dark)]">
                    Confidentiality
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    Concerned about confidentiality? We understand.
                  </p>
                  <a
                    href={NDA_TEMPLATE_HREF}
                    className="mt-2 inline-flex text-sm font-semibold text-[var(--color-accent)] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download our NDA
                  </a>
                </div>
              </li>
            </ul>
          </FadeUp>
          <FadeUp delay={0.12}>
            <form
              onSubmit={onSubmit}
              className="relative rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-8 shadow-sm"
            >
              <PublicLeadHoneypotInput ref={honeypotRef} />
              <div>
                <label htmlFor="contact-name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  required
                  className={field}
                  autoComplete="name"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="contact-email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  className={field}
                  autoComplete="email"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="contact-message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  className={field}
                />
              </div>
              <PublicLeadTurnstile
                className="mt-4"
                onToken={setTurnstileToken}
                onExpire={() => setTurnstileToken("")}
              />
              {msg ? (
                <p className="mt-4 text-sm text-green-700" role="status">
                  {msg}
                </p>
              ) : null}
              {err ? (
                <p className="mt-4 text-sm text-red-700" role="alert">
                  {err}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={sending}
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-sm bg-[var(--color-accent)] px-6 font-semibold text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
              >
                {sending ? "Sending…" : "Send message"}
              </button>
            </form>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
