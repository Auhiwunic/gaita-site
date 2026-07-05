"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Proof section. Every line here is real output from the app's
 * cross-reference engine, not marketing invention. The grade copy is the
 * app's own metric guide.
 */

const LINES = [
  {
    quote:
      "You brake hard at contact and your heel wear backs it up. Cue soft, quiet feet and lift your cadence to lower the impact.",
    tag: "HEAVY LANDING",
    badge: "CONFIRMED",
  },
  {
    quote: "Foot lands under you.",
    tag: "HEEL BRAKING",
    badge: "PASS",
  },
  {
    quote:
      "Your form and your shoe wear agree. Efficient, balanced mechanics. Hold your cadence and keep it up.",
    tag: "EFFICIENT GAIT",
    badge: "CONFIRMED",
  },
];

export default function Receipts() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.from(".receipt", {
        y: 32,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.from(".grade-mark", {
        scale: 0.85,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="border-y border-white/5 bg-ink-2/50">
      <div className="mx-auto grid max-w-[1400px] items-center gap-16 px-6 py-24 md:grid-cols-[4fr_8fr] md:px-16 md:py-32">
        {/* The grade */}
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-n3">
            Form grade
          </p>
          <p className="grade-mark font-display text-[9rem] font-bold leading-none md:text-[12rem]">
            A<span className="text-accent">.</span>
          </p>
          <p className="mt-6 max-w-xs leading-relaxed text-n4">
            One number from 0 to 100, turned into a grade. 80 and up is an A
            range stride. Most runners start in the 60s and that is fine.
          </p>
        </div>

        {/* The receipts */}
        <div className="space-y-5">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-n3">
            Straight from the engine
          </p>
          {LINES.map((l) => (
            <figure
              key={l.tag}
              className="receipt rounded-[22px] bg-card p-6 md:p-8"
            >
              <blockquote className="text-lg leading-relaxed md:text-xl">
                “{l.quote}”
              </blockquote>
              <figcaption className="mt-4 font-mono flex items-center gap-3 text-xs tracking-[0.2em] text-n3">
                {l.tag}
                <span
                  className={`font-mono rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold ${
                    l.badge === "CONFIRMED"
                      ? "border-accent/40 text-accent"
                      : "border-white/20 text-n4"
                  }`}
                >
                  {l.badge}
                </span>
              </figcaption>
            </figure>
          ))}
          <p className="pt-2 text-xs text-n3">
            Findings marked confirmed are backed by two sources: your video and
            your shoe wear.
          </p>
        </div>
      </div>
    </section>
  );
}
