"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Editorial masthead: massive condensed caps, the speed glyph
 * stretching line two, a small right-aligned descriptor, and a
 * hairline meta row. All type, almost no chrome.
 */

function SpeedGlyph() {
  return (
    <svg
      viewBox="0 0 220 60"
      preserveAspectRatio="none"
      className="mx-[0.35em] h-[0.42em] w-full min-w-[3rem] flex-1 self-center"
      aria-hidden="true"
    >
      <g fill="currentColor">
        <rect x="30" y="4" width="190" height="10" rx="5" />
        <rect x="70" y="25" width="150" height="10" rx="5" />
        <rect x="0" y="46" width="220" height="10" rx="5" />
      </g>
    </svg>
  );
}

export default function Masthead() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".mast-line", {
            y: 90,
            autoAlpha: 0,
            duration: 1.1,
            stagger: 0.09,
            delay: 0.15,
          })
          .from(
            ".mast-side",
            { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.08 },
            "-=0.7"
          )
          .from(".mast-meta", { autoAlpha: 0, duration: 0.9 }, "-=0.4");
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="px-5 pt-28 md:px-10 md:pt-36">
      <div className="mx-auto max-w-[1440px]">
        {/* Small photo + descriptor, right aligned above the headline */}
        <div className="flex items-end justify-end gap-6">
          <img
            src="/photos/5274777.jpg"
            alt="Blue track, numbered lanes"
            className="mast-side h-20 w-28 object-cover md:h-24 md:w-36"
          />
        </div>

        {/* The headline */}
        <h1 className="display-caps mt-4 text-ink [font-size:clamp(3.4rem,12.5vw,11.5rem)]">
          <span className="mast-line block">Where</span>
          <span className="mast-line block">Champions</span>
          <span className="mast-line flex w-full items-center">
            <span>Are</span>
            <SpeedGlyph />
            <span>Made</span>
          </span>
        </h1>

        {/* Descriptor row under the headline, pushed right like a caption */}
        <div className="mt-6 flex justify-end">
          <p className="mast-side max-w-[15rem] text-[0.8rem] leading-snug text-mid">
            <span className="font-semibold text-ink">The AI running coach</span>{" "}
            for runners who want to{" "}
            <span className="font-semibold text-ink">see exactly</span> what
            their body is doing.
          </p>
        </div>

        {/* Meta rule row */}
        <div className="mast-meta mt-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-line pt-3">
          <span className="meta">Est. 2026</span>
          <span className="meta hidden sm:inline">Eight angles per stride</span>
          <span className="meta hidden md:inline">30 fps</span>
          <span className="meta">100% on device</span>
        </div>
      </div>
    </section>
  );
}
