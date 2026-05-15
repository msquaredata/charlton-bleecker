"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import FadeUp from "@/components/ui/FadeUp";

const HERO_VIDEO_MP4 = "/video/nyc.mp4";
/** 1 = normal; lower = slower footage (independent of CSS drift). */
const HERO_VIDEO_PLAYBACK_RATE = 0.72;

export default function Hero() {
  const [hideCue, setHideCue] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 40) setHideCue(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showVideo = !reduceMotion && !videoFailed;

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !showVideo) return;
    el.playbackRate = HERO_VIDEO_PLAYBACK_RATE;
  }, [showVideo]);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center justify-center px-4 pt-24 text-white md:pt-28"
    >
      <div className="absolute inset-0 bg-[#1a1a1a]" aria-hidden />
      {showVideo ? (
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <div className="hero-video-drift absolute left-1/2 top-1/2 h-[120%] min-h-full w-[120%] min-w-full -translate-x-1/2 -translate-y-1/2">
            <video
              ref={videoRef}
              className="h-full w-full object-cover opacity-90"
              autoPlay
              muted
              loop
              playsInline
              onError={() => setVideoFailed(true)}
              onLoadedMetadata={(e) => {
                e.currentTarget.playbackRate = HERO_VIDEO_PLAYBACK_RATE;
              }}
            >
              <source src={HERO_VIDEO_MP4} type="video/mp4" />
            </video>
          </div>
        </div>
      ) : null}
      <div
        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(26,26,26,0.92)_0%,rgba(26,26,26,0.78)_45%,rgba(192,57,43,0.15)_100%)]"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <FadeUp>
          <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
            We partner with founders to build enduring businesses
            <span className="text-[var(--color-accent)]">.</span>
          </h1>
        </FadeUp>
        <FadeUp delay={0.08}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
            Permanent capital. Operational freedom. Long-term value.
          </p>
        </FadeUp>
        <FadeUp delay={0.16}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/submit"
              className="inline-flex min-h-12 min-w-[200px] items-center justify-center rounded-sm bg-[var(--color-accent)] px-8 font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
            >
              Submit Your Company
            </Link>
            <a
              href="#process"
              className="inline-flex min-h-12 min-w-[200px] items-center justify-center rounded-sm border-2 border-white px-8 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Learn How It Works
            </a>
          </div>
        </FadeUp>
      </div>
      {!hideCue ? (
        <motion.a
          href="#about"
          aria-label="Scroll to content"
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70"
          animate={
            reduceMotion
              ? undefined
              : { y: [0, 6, 0] }
          }
          transition={
            reduceMotion
              ? undefined
              : { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
          }
        >
          <ChevronDown className="size-10" />
        </motion.a>
      ) : null}
    </section>
  );
}
