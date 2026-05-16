"use client";

import Image from "next/image";
import { useState } from "react";
import { Linkedin } from "lucide-react";
import FadeUp from "@/components/ui/FadeUp";
import { TEAM } from "@/data/team";
import { linkedInUnavatarSrc } from "@/lib/linkedin-avatar";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");
}

function Bio({ text }: { text: string }) {
  const parts = text.split(/(?<=[.!?])\s+/);
  const short = parts.slice(0, 3).join(" ");
  const [open, setOpen] = useState(false);
  const needToggle = text.length > short.length + 12;

  return (
    <div className="text-sm leading-relaxed text-[var(--color-muted)]">
      <p>{open ? text : short}</p>
      {needToggle ? (
        <button
          type="button"
          className="mt-2 text-sm font-semibold text-[var(--color-accent)] hover:underline"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Show less" : "Read more"}
        </button>
      ) : null}
    </div>
  );
}

function MemberAvatar({ member }: { member: (typeof TEAM)[number] }) {
  const remote = linkedInUnavatarSrc(member.linkedin);
  const candidates = [member.photo, remote].filter(
    (s): s is string => typeof s === "string" && s.length > 0,
  );
  const [failCount, setFailCount] = useState(0);

  if (failCount >= candidates.length) {
    return (
      <div
        className="flex size-28 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] font-display text-2xl font-semibold text-white"
        aria-hidden
      >
        {initials(member.name)}
      </div>
    );
  }

  const src = candidates[failCount];

  return (
    <div className="relative size-28 shrink-0 overflow-hidden rounded-full bg-[var(--color-surface)] ring-1 ring-black/5">
      <Image
        src={src}
        alt=""
        fill
        className="object-cover"
        sizes="112px"
        onError={() => setFailCount((n) => n + 1)}
      />
    </div>
  );
}

function MemberCard({
  member,
  delay,
}: {
  member: (typeof TEAM)[number];
  delay: number;
}) {
  return (
    <FadeUp delay={delay} className="h-full min-h-0">
      <article className="flex h-full min-h-0 flex-col items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-8 text-center shadow-sm">
        <MemberAvatar member={member} />
        <h3 className="mt-5 font-display text-xl font-semibold text-[var(--color-dark)]">
          {member.name}
        </h3>
        <p className="text-sm font-medium text-[var(--color-accent)]">
          {member.title}
        </p>
        <div className="mt-4 w-full flex-1 text-left">
          <Bio text={member.bio} />
        </div>
        <div className="mt-auto flex min-h-11 w-full items-center justify-center pt-4">
          {member.linkedin ? (
            <a
              href={member.linkedin}
              className={cn(
                "inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-dark)] hover:text-[var(--color-accent)]",
              )}
              aria-label={`${member.name} on LinkedIn`}
            >
              <Linkedin className="size-4" aria-hidden />
              LinkedIn
            </a>
          ) : null}
        </div>
      </article>
    </FadeUp>
  );
}

export default function Team() {
  const leaders = TEAM.filter((m) => m.role === "leadership");
  const directors = TEAM.filter((m) => m.role === "directors");

  return (
    <section id="team" className="section-pad bg-[var(--color-surface)]">
      <div className="container-site">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            Our team
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--color-dark)] md:text-4xl">
            The People Behind the Capital
          </h2>
        </FadeUp>
        <div className="mt-12">
          <h3 className="font-display text-lg font-semibold text-[var(--color-dark)]">
            Leadership
          </h3>
          <div
            className={cn(
              "mt-6 grid items-stretch gap-8",
              leaders.length === 1
                ? "mx-auto max-w-md grid-cols-1"
                : "md:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {leaders.map((m, i) => (
              <MemberCard key={m.name} member={m} delay={i * 0.08} />
            ))}
          </div>
        </div>
        <div className="mt-14">
          <h3 className="font-display text-lg font-semibold text-[var(--color-dark)]">
            Directors
          </h3>
          <div className="mt-6 grid grid-cols-1 items-stretch gap-8 sm:grid-cols-2">
            {directors.map((m, i) => (
              <MemberCard key={m.name} member={m} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
