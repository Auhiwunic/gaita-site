"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Hero: the champion finish-line image with a REAL MediaPipe Pose skeleton.
 * The joint coordinates below are actual detections run on this exact frame
 * (pose-scan.py), drawn in the app's skeleton cyan. Body only - no face
 * mesh, no labels, per design direction.
 */

// Real MediaPipe landmarks (image space 1672x941), body points only
const P: [number, number][] = [
  [1200.1, 322.8], [1101.9, 304.1], [1268.9, 360], [1006.8, 323.4],
  [1337.9, 370.2], [905.9, 313.6], [1359.3, 364.4], [881, 296.7],
  [1127.1, 484.7], [1112.1, 480], [1035.6, 585.9], [1198, 577.6],
  [922.2, 603], [1197.5, 733.4], [903.8, 590.7], [1182.4, 760.4],
  [896.5, 651], [1237.7, 772],
];

const BONES: [number, number][] = [
  [0, 1], [0, 2], [2, 4], [4, 6],           // shoulders + left arm chain
  [1, 3], [3, 5], [5, 7],                    // right arm chain
  [0, 8], [1, 9], [8, 9],                    // torso
  [8, 10], [10, 12], [12, 14], [14, 16], [12, 16], // trail leg + foot
  [9, 11], [11, 13], [13, 15], [15, 17], [13, 17], // lead leg + foot
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.15,
      });
      tl.from(".hero-photo", { opacity: 0, scale: 1.04, duration: 1.4 }, 0)
        .from(
          ".hero-line",
          { yPercent: 110, duration: 1.05, stagger: 0.09 },
          0.2
        )
        .from(".hero-sub", { y: 24, opacity: 0, duration: 0.8 }, "-=0.55")
        .from(".hero-cta", { y: 20, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(
          ".bone",
          { opacity: 0, duration: 0.45, stagger: 0.035, ease: "power2.out" },
          "-=0.4"
        )
        .from(".joint", { opacity: 0, duration: 0.4, stagger: 0.025 }, "<0.1");
    },
    { scope: root }
  );

  return (
    <section ref={root} id="top" className="relative min-h-screen overflow-hidden">
      {/* Photo layer with real skeleton overlay */}
      <div className="hero-photo absolute inset-0 md:left-auto md:right-0 md:aspect-[1672/941] md:w-auto">
        <Image
          src="/hero-champion.jpg"
          alt="Sprinter crossing the finish line first in a packed stadium"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center] grayscale contrast-105 brightness-95 md:object-center"
        />
        <svg
          viewBox="0 0 1672 941"
          className="absolute inset-0 hidden h-full w-full md:block"
          fill="none"
          aria-hidden="true"
        >
          <g
            stroke="#00e5ff"
            strokeOpacity="0.95"
            strokeWidth="3"
            strokeLinecap="round"
          >
            {BONES.map(([a, b], i) => (
              <line
                key={i}
                className="bone"
                x1={P[a][0]}
                y1={P[a][1]}
                x2={P[b][0]}
                y2={P[b][1]}
              />
            ))}
          </g>
          {P.map(([x, y], i) => (
            <circle
              key={i}
              className="joint"
              cx={x}
              cy={y}
              r="5.5"
              fill="#00e5ff"
            />
          ))}
        </svg>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/25 md:via-ink/50 md:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      {/* Copy */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center px-6 pb-20 pt-24 md:px-16">
        <div className="max-w-2xl">
          <h1 className="font-display text-[3.6rem] font-semibold leading-[0.95] sm:text-7xl lg:text-[5.8rem]">
            <span className="block overflow-hidden">
              <span className="hero-line block">Where champions</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line block">are made.</span>
            </span>
          </h1>

          <p className="hero-sub mt-8 max-w-md text-lg leading-relaxed text-n4">
            Gaita is the coach in your ear. It reads your body, pushes you to
            your limits, and shows you the numbers behind every stride.
          </p>

          <div className="hero-cta mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#access"
              className="rounded-full bg-accent px-7 py-3.5 font-semibold text-ink transition-transform duration-300 hover:scale-[1.03]"
            >
              Get notified
            </a>
            <a
              href="#how"
              className="rounded-full border border-white/20 px-7 py-3.5 font-medium text-paper transition-colors duration-300 hover:border-white/50"
            >
              See how it works
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
