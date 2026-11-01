"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Hero: a real MediaPipe BlazePose skeleton, detected off a grayscale
 * side-view runner, sitting full bleed behind the headline. The photo
 * is object-cover center, so the SVG crops identically with
 * preserveAspectRatio="xMidYMid slice" to keep every bone on its joint.
 */

const W = 1800;
const H = 1100;

const P: Record<number, [number, number]> = {
  0: [0.448, 0.233],
  7: [0.468, 0.221],
  11: [0.475, 0.297],
  12: [0.508, 0.306],
  13: [0.478, 0.373],
  15: [0.445, 0.385],
  23: [0.489, 0.537],
  24: [0.485, 0.546],
  25: [0.56, 0.706],
  26: [0.409, 0.681],
  27: [0.667, 0.764],
  28: [0.393, 0.867],
  31: [0.684, 0.851],
  32: [0.341, 0.884],
};

const BONES: [number, number][] = [
  [7, 11],
  [11, 12],
  [11, 13],
  [13, 15],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [25, 27],
  [27, 31],
  [24, 26],
  [26, 28],
  [28, 32],
];

const JOINTS = [11, 12, 13, 15, 23, 24, 25, 26, 27, 28];

const px = (i: number) => [P[i][0] * W, P[i][1] * H] as const;

export default function HeroSkeleton() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<SVGLineElement>(".hs-bone").forEach((b) => {
          const len = b.getTotalLength();
          gsap.set(b, { strokeDasharray: len, strokeDashoffset: len });
        });
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".hs-line", {
          yPercent: 115,
          duration: 1.1,
          stagger: 0.09,
          delay: 0.15,
        })
          .to(
            ".hs-bone",
            { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut", stagger: 0.05 },
            0.3
          )
          .from(
            ".hs-joint",
            { scale: 0, transformOrigin: "center", duration: 0.4, stagger: 0.03 },
            "-=0.7"
          )
          .from(".hs-fade", { autoAlpha: 0, duration: 0.9, stagger: 0.08 }, "-=0.6");
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative min-h-[100svh] overflow-hidden"
    >
      {/* Background: grayscale runner + aligned skeleton */}
      <div className="absolute inset-0">
        <Image
          src="/photos/gait-sideview.webp"
          alt="Side view of a runner tracked by a pose skeleton"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <g style={{ filter: "drop-shadow(0 2px 7px rgba(20,20,18,0.6))" }}>
            {BONES.map(([a, b], i) => {
              const [x1, y1] = px(a);
              const [x2, y2] = px(b);
              return (
                <line
                  key={i}
                  className="hs-bone"
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
                <g key={i} className="hs-joint">
                  <circle cx={x} cy={y} r={11} fill="#f5f5f3" />
                  <circle cx={x} cy={y} r={4.5} fill="#00CED1" />
                </g>
              );
            })}
          </g>
        </svg>
        {/* Scrims so the ink type stays readable while the skeleton
            keeps its mid tones. Bottom scrim is taller on mobile where
            the copy sits over the runner's legs. */}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,var(--color-bone)_0%,rgba(241,241,239,0.82)_30%,rgba(241,241,239,0)_62%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(to_top,var(--color-bone)_18%,rgba(241,241,239,0.9)_38%,rgba(241,241,239,0))] md:h-52 md:bg-[linear-gradient(to_top,var(--color-bone),rgba(241,241,239,0))]" />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-5 pb-10 pt-28 md:px-10 md:pb-14">
        <h1 className="display-caps text-ink [font-size:clamp(3.2rem,11.5vw,9.5rem)]">
          <span className="block overflow-hidden">
            <span className="hs-line block">All in one</span>
          </span>
          <span className="block overflow-hidden">
            <span className="hs-line block">trainer</span>
          </span>
        </h1>

        <p className="hs-fade mt-6 max-w-md text-[0.95rem] leading-relaxed text-mid">
          <span className="font-semibold text-ink">
            Everything a coaching staff does, in your pocket.
          </span>{" "}
          Gaita reads your form, gait and power off one video, then
          coaches the fix in your ear.
        </p>

        <div className="hs-fade mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#access"
            className="meta rounded-full bg-accent px-6 py-3 !text-accent-ink transition-transform duration-300 hover:scale-[1.03]"
          >
            Get early access
          </a>
          <a
            href="#app"
            className="meta rounded-full border border-ink/25 px-6 py-3 text-ink transition-colors hover:border-accent hover:text-accent"
          >
            See the app
          </a>
        </div>

        {/* Meta rule row */}
        <div className="hs-fade mt-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-line pt-3">
          <span className="meta">Est. 2026</span>
          <span className="meta hidden sm:inline">Form · gait · power · plans</span>
          <span className="meta hidden md:inline">MediaPipe BlazePose</span>
          <span className="meta">100% on device</span>
        </div>
      </div>
    </section>
  );
}
