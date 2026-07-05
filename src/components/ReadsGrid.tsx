"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * What the camera reads — set like a partner logo wall: a
 * hairline-ruled grid, one read per cell, target underneath.
 */

const READS = [
  { name: "Cadence", target: "165 to 190 spm" },
  { name: "Ground contact", target: "200 to 300 ms" },
  { name: "Torso", target: "3 to 12°" },
  { name: "Shin", target: "under 12°" },
  { name: "Knee", target: "128 to 160°" },
  { name: "Elbow", target: "55 to 105°" },
  { name: "Overstride", target: "minus 12 to 8°" },
  { name: "Strike", target: "observed" },
];

export default function ReadsGrid() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".read-cell", {
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 76%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="reads" className="px-5 pb-24 md:px-10 md:pb-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-baseline justify-between border-t border-line pt-3">
          <span className="meta">What the camera reads</span>
          <span className="meta">Eight reads, every run</span>
        </div>

        <div className="mt-10 grid grid-cols-2 border-l border-t border-line md:grid-cols-4">
          {READS.map((r) => (
            <div
              key={r.name}
              className="read-cell flex min-h-[7.5rem] flex-col items-center justify-center gap-1.5 border-b border-r border-line px-4 py-8 text-center md:min-h-[9rem]"
            >
              <span className="head-caps text-xl text-ink md:text-2xl">
                {r.name}
              </span>
              <span className="meta !text-soft">{r.target}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
