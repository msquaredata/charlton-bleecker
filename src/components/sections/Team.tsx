"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Linkedin, X } from "lucide-react";
import FadeUp from "@/components/ui/FadeUp";
import { TEAM } from "@/data/team";
import { linkedInUnavatarSrc } from "@/lib/linkedin-avatar";
import { useIsClient } from "@/lib/use-is-client";
import { cn } from "@/lib/utils";

type TeamPhotoLightbox = {
  src: string;
  name: string;
};

function lockBodyScroll() {
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = "hidden";
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
}

function unlockBodyScroll() {
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
}

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

function AvatarLightbox({
  src,
  name,
  onClose,
}: {
  src: string;
  name: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${name} photo`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Close photo"
        onClick={onClose}
      />
      <figure className="relative z-10">
        <div className="relative aspect-[4/5] h-[min(85vh,42rem)] max-w-[92vw] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
          <Image
            src={src}
            alt={name}
            fill
            className="object-cover object-[center_22%]"
            sizes="(max-width: 768px) 92vw, 672px"
            priority
          />
        </div>
        <figcaption className="sr-only">{name}</figcaption>
        <button
          ref={closeRef}
          type="button"
          className="absolute -right-2 -top-2 flex size-10 items-center justify-center rounded-full bg-white text-[var(--color-dark)] shadow-lg hover:bg-[var(--color-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Close photo"
          onClick={onClose}
        >
          <X className="size-5" aria-hidden />
        </button>
      </figure>
    </motion.div>
  );
}

function MemberAvatar({
  member,
  onOpenPhoto,
}: {
  member: (typeof TEAM)[number];
  onOpenPhoto: (photo: TeamPhotoLightbox) => void;
}) {
  const remote = linkedInUnavatarSrc(member.linkedin);
  const candidates = [member.photo, remote].filter(
    (s): s is string => typeof s === "string" && s.length > 0,
  );
  const [failCount, setFailCount] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
    <>
      <button
        type="button"
        className="group relative size-28 shrink-0 cursor-zoom-in overflow-hidden rounded-full bg-[var(--color-surface)] ring-1 ring-black/5 transition-shadow hover:ring-[var(--color-accent)]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        aria-label={`View larger photo of ${member.name}`}
        onClick={() => setZoomOpen(true)}
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-cover object-[center_22%] transition-transform duration-200 group-hover:scale-105"
          sizes="112px"
          onError={() => setFailCount((n) => n + 1)}
        />
      </button>
      {isClient
        ? createPortal(
            <AnimatePresence>
              {zoomOpen ? (
                <AvatarLightbox
                  key={member.name}
                  src={src}
                  name={member.name}
                  onClose={closeLightbox}
                />
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
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
