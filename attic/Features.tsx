"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PhoneFrame from "./PhoneFrame";

/**
 * Editorial feature blocks. Asymmetric, photography led, real app copy.
 * The metric names, targets and prompts below are lifted from the app.
 */

const METRIC_ROWS = [
  { k: "CAD", v: "165 to 190" },
  { k: "KNEE", v: "150 to 170°" },
  { k: "GCT", v: "under 250 ms" },
  { k: "STRIKE", v: "MID" },
];

const PROMPTS = [
  "How was my last run coach?",
  "Which drills fit my focus list?",
  "What should I focus on before my next run?",
];

const TRIO = [
  {
    label: "Shoe scan",
    body: "Scan your outsole. Wear zones confirm what the video sees, so a finding is backed by two sources, not one guess.",
  },
  {
    label: "Intervals",
    body: "Structured workouts with pace targets per segment, spoken in your ear while you run.",
  },
  {
    label: "Scorecard",
    body: "A telemetry share card built from your run. Ring dials, wear maps and the overall score. Post it.",
  },
];

export default function Features() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray<HTMLElement>(".feat-block").forEach((el) => {
        gsap.from(el, {
          y: 48,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="features"
      className="mx-auto max-w-[1400px] px-6 py-24 md:px-16 md:py-32"
    >
      {/* Block A — full metrics */}
      <div className="feat-block grid items-center gap-12 md:grid-cols-[7fr_5fr] md:gap-20">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-n3">
            Full metrics
          </p>
          <h2 className="font-display max-w-xl text-4xl font-semibold leading-[1.02] md:text-6xl">
            Numbers with targets, not noise.
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-n4">
            Cadence, torso lean, shin angle, knee and hip extension, elbow
            carry, ground contact time, foot strike. Every number sits next to
            the range it should be in.
          </p>

          <div className="mt-10 max-w-sm divide-y divide-white/8 border-y border-white/8">
            {METRIC_ROWS.map((r) => (
              <div
                key={r.k}
                className="flex items-baseline justify-between py-3.5"
              >
                <span className="font-mono text-sm font-semibold tracking-[0.2em]">
                  {r.k}
                </span>
                <span className="font-mono text-sm text-n4">{r.v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto w-64 md:w-80">
          <PhoneFrame
            src="/app/metrics.png"
            alt="Gaita full metrics with angles, targets, ground contact and bounce waveforms"
          />
        </div>
      </div>

      {/* Block B — coach */}
      <div className="feat-block mt-32 grid items-center gap-12 md:mt-44 md:grid-cols-[5fr_7fr] md:gap-20">
        <div className="order-2 mx-auto w-64 md:order-1 md:w-80">
          <PhoneFrame
            src="/app/coach.png"
            alt="GAITA coach chat with starter prompts and drills"
          />
        </div>
        <div className="order-1 md:order-2">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-n3">
            Gaita coach
          </p>
          <h2 className="font-display max-w-xl text-4xl font-semibold leading-[1.02] md:text-6xl">
            A coach that read your last run.
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-n4">
            Ask it anything. It holds your focus list, your drills and your
            history. Every drill comes with a target, a how and a dose.
          </p>
          <div className="mt-8 flex max-w-md flex-wrap gap-2.5">
            {PROMPTS.map((p) => (
              <span
                key={p}
                className="rounded-full border border-white/12 px-4 py-2 text-sm text-n4"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Block C — run tab wide */}
      <div className="feat-block mt-32 grid items-center gap-12 md:mt-44 md:grid-cols-[7fr_5fr] md:gap-20">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-n3">
            Live runs
          </p>
          <h2 className="font-display max-w-xl text-4xl font-semibold leading-[1.02] md:text-6xl">
            It runs with you.
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-n4">
            GPS tracking with a voice in your ear. Mile splits, pace checks and
            a push when you need one. Pick a shoe, toggle intervals, press
            start.
          </p>
        </div>
        <div className="mx-auto w-64 md:w-80">
          <PhoneFrame
            src="/app/run.png"
            alt="Gaita run screen with map, shoe selector and interval workout"
          />
        </div>
      </div>

      {/* Trio strip */}
      <div className="feat-block mt-32 grid gap-4 rounded-none md:mt-44 md:grid-cols-3">
        {TRIO.map((t) => (
          <div key={t.label} className="rounded-[22px] bg-card p-8 md:p-10">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em]">
              {t.label}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-n4">{t.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
