"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * The problem, said once, like a person. No stat wall, no eyebrow label.
 * A giant cropped asterisk hangs in the margin like a coach's mark.
 */

export default function Problem() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".pr-line", {
          yPercent: 112,
          duration: 0.9,
          stagger: 0.09,
          ease: "power4.out",
          scrollTrigger: { trigger: root.current, start: "top 72%" },
        });
        gsap.to(".pr-asterisk", {
          rotate: 28,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
        gsap.fromTo(
          ".pr-underline",
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: ".pr-copy", start: "top 70%" },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden px-6 py-32 md:px-12 md:py-44">
      <span
        aria-hidden="true"
        className="pr-asterisk pointer-events-none absolute -right-[10vw] -top-[6vw] select-none font-serif-display text-[38vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.1)]"
      >
        *
      </span>

      <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-12">
        <h2 className="font-serif-display text-5xl font-black leading-[1.0] text-paper sm:text-6xl md:col-span-8 md:col-start-2 lg:text-7xl">
          <span className="block overflow-hidden">
            <span className="pr-line block">You can&apos;t watch</span>
          </span>
          <span className="block overflow-hidden pl-[6%]">
            <span className="pr-line block">
              your own <em className="coach-italic text-grease">stride</em>
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="pr-line block">Nobody can</span>
          </span>
        </h2>

        <div className="pr-copy md:col-span-5 md:col-start-6">
          <p className="text-lg leading-relaxed text-n4">
            So the same{" "}
            <span className="relative inline-block text-paper">
              overstride
              <svg
                viewBox="0 0 120 12"
                className="absolute -bottom-1.5 left-0 w-full"
                fill="none"
                aria-hidden="true"
              >
                <path
                  className="pr-underline"
                  pathLength={1}
                  strokeDasharray={1}
                  d="M2 8 C 30 4, 60 10, 118 5"
                  stroke="#ff2d2d"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            follows you through every training block. You feel slow weeks,
            sore knees, a plateau you can&apos;t name, and you call it fitness
            when it&apos;s form.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-n4">
            Coaches fix this by watching film. That used to cost a lab fee.
            Now it costs one phone clip.
          </p>
        </div>
      </div>
    </section>
  );
}
