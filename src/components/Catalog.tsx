"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * The app as a product catalog: four screens on recessed mats,
 * numbered like a listing. Real screenshots, no phone chrome.
 */

const SCREENS = [
  {
    n: "01",
    label: "Form analysis",
    body: "Your video, graded stride by stride.",
    src: "/app/analyze.png",
  },
  {
    n: "02",
    label: "Full metrics",
    body: "Every angle against coach targets.",
    src: "/app/metrics.png",
  },
  {
    n: "03",
    label: "Coach chat",
    body: "Ask anything. It knows your gait.",
    src: "/app/coach.png",
  },
  {
    n: "04",
    label: "Guided runs",
    body: "Plans, zones and cues on the road.",
    src: "/app/run.png",
  },
];

export default function Catalog() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".cat-item", {
          y: 44,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".cat-grid", start: "top 78%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="app" className="px-5 pb-24 md:px-10 md:pb-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-baseline justify-between border-t border-line pt-3">
          <span className="meta">The app</span>
          <span className="meta hidden sm:inline">iPhone, day one</span>
        </div>

        <div className="cat-grid mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
          {SCREENS.map((s) => (
            <figure key={s.n} className="cat-item">
              <div className="bg-shell px-5 pb-0 pt-5 sm:px-7 sm:pt-7">
                <img
                  src={s.src}
                  alt={`${s.label} screen in the Gaita app`}
                  className="w-full rounded-t-[1.4rem] border border-black/10 shadow-[0_18px_40px_rgb(0_0_0/0.18)]"
                />
              </div>
              <figcaption className="mt-4 flex items-baseline gap-3">
                <span className="meta">{s.n}</span>
                <span>
                  <span className="head-caps block text-[0.95rem] text-ink">
                    {s.label}
                  </span>
                  <span className="mt-1 block text-[0.8rem] leading-snug text-mid">
                    {s.body}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
