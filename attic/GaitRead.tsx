"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * The read: a real MediaPipe BlazePose skeleton, detected off a
 * grayscale side-view running photo, traced on scroll. Landmarks
 * are the actual normalized coordinates from the model, so the
 * bones sit exactly where the runner's joints are.
 */

const W = 1800;
const H = 1100;

// MediaPipe normalized landmarks (index: [x, y]) from detection.
const P: Record<number, [number, number]> = {
  0: [0.448, 0.233], // nose
  7: [0.468, 0.221], // ear
  11: [0.475, 0.297], // shoulder near
  12: [0.508, 0.306], // shoulder far
  13: [0.478, 0.373], // elbow near
  15: [0.445, 0.385], // wrist near
  23: [0.489, 0.537], // hip near
  24: [0.485, 0.546], // hip far
  25: [0.56, 0.706], // knee lead
  26: [0.409, 0.681], // knee trail
  27: [0.667, 0.764], // ankle lead
  28: [0.393, 0.867], // ankle trail
  31: [0.684, 0.851], // foot lead
  32: [0.341, 0.884], // foot trail
};

// Bones drawn only where both joints were confidently visible.
const BONES: [number, number][] = [
  [7, 11], // neck
  [11, 12], // shoulders
  [11, 13],
  [13, 15], // near arm
  [11, 23],
  [12, 24], // torso sides
  [23, 24], // hips
  [23, 25],
  [25, 27],
  [27, 31], // lead leg
  [24, 26],
  [26, 28],
  [28, 32], // trail leg
];

const JOINTS = [11, 12, 13, 15, 23, 24, 25, 26, 27, 28];

const px = (i: number) => [P[i][0] * W, P[i][1] * H] as const;

export default function GaitRead() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Prime each bone with its own length so it can draw on.
        gsap.utils.toArray<SVGLineElement>(".gr-bone").forEach((b) => {
          const len = b.getTotalLength();
          gsap.set(b, { strokeDasharray: len, strokeDashoffset: len });
        });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".gr-frame", start: "top 78%" },
        });
        tl.to(".gr-bone", {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.inOut",
          stagger: 0.04,
        }).from(
          ".gr-joint",
          { scale: 0, transformOrigin: "center", duration: 0.4, stagger: 0.03 },
          "-=0.5"
        );
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="px-5 pb-24 md:px-10 md:pb-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-baseline justify-between border-t border-line pt-3">
          <span className="meta">The read</span>
          <span className="meta hidden sm:inline">MediaPipe BlazePose, 33 points</span>
        </div>

        <div className="gr-frame relative mt-8 overflow-hidden bg-shell">
          <img
            src="/photos/gait-sideview.webp"
            alt="Side view of a runner with a pose skeleton traced on their joints"
            className="w-full object-cover"
          />
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <g
              style={{
                filter: "drop-shadow(0 2px 6px rgba(20,20,18,0.55))",
              }}
            >
              {BONES.map(([a, b], i) => {
                const [x1, y1] = px(a);
                const [x2, y2] = px(b);
                return (
                  <line
                    key={i}
                    className="gr-bone"
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#f5f5f3"
                    strokeWidth={6}
                    strokeLinecap="round"
                  />
                );
              })}
              {JOINTS.map((i) => {
                const [x, y] = px(i);
                return (
                  <g key={i} className="gr-joint">
                    <circle cx={x} cy={y} r={11} fill="#f5f5f3" />
                    <circle cx={x} cy={y} r={4.5} fill="#141412" />
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        <p className="mt-6 max-w-xl text-[0.95rem] leading-relaxed text-mid">
          <span className="font-semibold text-ink">
            One frame, thirty three points.
          </span>{" "}
          Gaita tracks every joint through the stride and measures the
          eight angles a coach watches for. No markers, no lab, no wearable.
        </p>
      </div>
    </section>
  );
}
