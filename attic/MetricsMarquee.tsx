"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * One strip, once. Real metric names from the app's Full Metrics sheet,
 * outlined mono type, speeds up with scroll velocity.
 */

const ITEMS = [
  "CADENCE",
  "TORSO ANGLE",
  "SHIN AT CONTACT",
  "KNEE",
  "HIP",
  "ELBOW",
  "GROUND CONTACT",
  "FOOT STRIKE",
  "OVERSTRIDE",
  "KNEE FLEXION",
];

export default function MetricsMarquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const track = root.current!.querySelector(".marquee-track")!;
        const tl = gsap.to(track, {
          xPercent: -50,
          repeat: -1,
          duration: 34,
          ease: "none",
        });

        let boost = { v: 1 };
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
      className="relative overflow-hidden border-y border-white/5 py-6"
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-10">
            {ITEMS.map((item, i) => (
              <span
                key={item}
                className={`font-mono text-4xl font-bold tracking-tight md:text-5xl ${
                  i === 0 ? "text-outline-accent" : "text-outline"
                }`}
              >
                {item}
                <span className="ml-10 inline-block h-1.5 w-1.5 rounded-full bg-white/20 align-middle" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
