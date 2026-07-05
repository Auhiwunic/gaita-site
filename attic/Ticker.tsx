"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * A live readout strip, not a keyword marquee: actual readings from the
 * analyzed footage, judged against the app's target ranges. Speeds up
 * with scroll velocity.
 */

const READS: { text: string; ok: boolean }[] = [
  { text: "CADENCE 150 SPM · 15 UNDER TARGET", ok: false },
  { text: "TORSO 6° · IN RANGE", ok: true },
  { text: "SHIN 13° AT CONTACT · BRAKE RISK", ok: false },
  { text: "KNEE 178° · TOO STRAIGHT", ok: false },
  { text: "HIP 175° · IN RANGE", ok: true },
  { text: "ELBOW 116° · OPEN CARRY", ok: false },
  { text: "OVERSTRIDE 13° · LANDS OUT FRONT", ok: false },
  { text: "STRIKE FORE · TARGET MID", ok: false },
];

export default function Ticker() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const track = root.current!.querySelector(".ticker-track")!;
        const tl = gsap.to(track, {
          xPercent: -50,
          repeat: -1,
          duration: 40,
          ease: "none",
        });
        const boost = { v: 1 };
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = 1 + Math.min(Math.abs(self.getVelocity()) / 900, 3);
            gsap.to(boost, {
              v,
              duration: 0.4,
              overwrite: true,
              onUpdate: () => tl.timeScale(boost.v),
            });
          },
          onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
        });
        return () => st.kill();
      });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className="relative overflow-hidden border-y border-white/5 bg-ink-2/60 py-4"
      aria-hidden="true"
    >
      <div className="ticker-track flex w-max items-center gap-12 whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-12">
            {READS.map((r) => (
              <span
                key={r.text}
                className={`font-mono text-sm tracking-[0.08em] ${
                  r.ok ? "text-accent/90" : "text-grease/90"
                }`}
              >
                {r.text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
