"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero v2: the analysis happens as you scroll. The champion photo loads
 * bare; scrolling sweeps a scan line down the frame and draws the real
 * MediaPipe skeleton bone by bone in the app's cyan. No labels, no
 * captions — the photo and the line work carry it.
 *
 * Landmarks are actual MediaPipe Pose detections on this exact frame
 * (image space 1672x941), body points only.
 */

const P: [number, number][] = [
  [1200.1, 322.8], [1101.9, 304.1], [1268.9, 360], [1006.8, 323.4],
  [1337.9, 370.2], [905.9, 313.6], [1359.3, 364.4], [881, 296.7],
  [1127.1, 484.7], [1112.1, 480], [1035.6, 585.9], [1198, 577.6],
  [922.2, 603], [1197.5, 733.4], [903.8, 590.7], [1182.4, 760.4],
  [896.5, 651], [1237.7, 772],
];

const BONES: [number, number][] = [
  [0, 1], [0, 2], [2, 4], [4, 6],
  [1, 3], [3, 5], [5, 7],
  [0, 8], [1, 9], [8, 9],
  [8, 10], [10, 12], [12, 14], [14, 16], [12, 16],
  [9, 11], [11, 13], [13, 15], [15, 17], [13, 17],
];

const boneLength = ([a, b]: [number, number]) =>
  Math.hypot(P[b][0] - P[a][0], P[b][1] - P[a][1]);

export default function HeroScan() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Entrance: wait for the preloader wipe, then reveal the headline
      const entrance = () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".hero-photo", { opacity: 0, scale: 1.05, duration: 1.3 }, 0)
          .from(".hero-line", { yPercent: 110, duration: 1.0, stagger: 0.09 }, 0.15)
          .from(".hero-sub", { y: 22, opacity: 0, duration: 0.75 }, "-=0.5")
          .from(".hero-cta", { y: 18, opacity: 0, duration: 0.65 }, "-=0.45")
          .from(".hero-hint", { opacity: 0, duration: 0.6 }, "-=0.3");
      };
      if (document.documentElement.classList.contains("gaita-ready")) {
        entrance();
      } else {
        window.addEventListener("gaita:ready", entrance, { once: true });
      }

      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
          mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const bones = gsap.utils.toArray<SVGLineElement>(".bone");
          const joints = gsap.utils.toArray<SVGCircleElement>(".joint");

          if (ctx.conditions?.desktop) {
            // Prime bones as undrawn strokes
            bones.forEach((el, i) => {
              const len = boneLength(BONES[i]);
              gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
            });
            gsap.set(joints, { scale: 0, transformOrigin: "center" });
            gsap.set(".scanline", { yPercent: -4, opacity: 0 });

            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: root.current,
                start: "top top",
                end: "+=180%",
                pin: true,
                scrub: 0.6,
                anticipatePin: 1,
              },
            });

            tl
              // Copy steps aside so the frame becomes the subject
              .to(".hero-copy", { yPercent: -14, opacity: 0.28 }, 0)
              .to(".hero-photo-img", { scale: 1.04 }, 0)
              // Scan sweep
              .to(".scanline", { opacity: 1, duration: 0.05 }, 0.05)
              .to(".scanline", { yPercent: 2350, duration: 0.55 }, 0.08)
              .to(".scanline", { opacity: 0, duration: 0.06 }, 0.6)
              // Skeleton draws while the scan passes
              .to(
                bones,
                { strokeDashoffset: 0, duration: 0.45, stagger: 0.018 },
                0.14
              )
              .to(
                joints,
                { scale: 1, duration: 0.18, stagger: 0.012, ease: "power2.out" },
                0.24
              )
              // Settle beat at the end so the finished frame holds
              .to({}, { duration: 0.25 });
          } else {
            // Mobile and reduced motion: skeleton fully drawn, no pin
            gsap.set(bones, { strokeDashoffset: 0 });
            gsap.set(joints, { scale: 1 });
            gsap.set(".scanline", { opacity: 0 });
          }
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="top"
      className="blueprint relative flex min-h-screen flex-col overflow-hidden"
    >
      {/* Photo layer */}
      <div className="hero-photo absolute inset-0 md:left-auto md:right-0 md:aspect-[1672/941] md:w-auto">
        <Image
          src="/hero-champion.jpg"
          alt="Sprinter crossing the finish line first in a packed stadium"
          fill
          priority
          sizes="100vw"
          className="hero-photo-img object-cover object-[68%_center] grayscale contrast-105 brightness-95 md:object-center"
        />

        {/* Scan line */}
        <div
          className="scanline pointer-events-none absolute inset-x-0 top-0 h-[4%] opacity-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(0,229,255,0.16) 55%, rgba(0,229,255,0.5) 98%, rgba(0,229,255,0.9))",
          }}
          aria-hidden="true"
        />

        {/* Real skeleton, drawn on scroll */}
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
            <circle key={i} className="joint" cx={x} cy={y} r="5.5" fill="#00e5ff" />
          ))}
        </svg>

        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/25 md:via-ink/50 md:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      {/* Copy */}
      <div className="hero-copy relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] flex-col justify-center px-6 pb-20 pt-24 md:px-16">
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

      {/* Scroll hint */}
      <p className="hero-hint hud-label absolute bottom-7 left-6 z-10 hidden md:left-16 md:block">
        Scroll to run the analysis
      </p>
    </section>
  );
}
