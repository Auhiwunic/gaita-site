"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pricing without cards: two columns split by a hairline. Tiers,
 * prices and benefit lines match the in-app paywall exactly.
 */

const TIERS = [
  {
    name: "Free",
    price: "$0",
    cycle: "forever",
    note: "Form analysis stays free. Not a trial.",
    perks: [
      "On device video analysis",
      "Drive, impact and smooth scores",
      "Form grade and focus list",
    ],
  },
  {
    name: "Premium",
    price: "$7.99",
    cycle: "a month, or $59.99 a year",
    note: "The coach, when you want one in your ear.",
    perks: [
      "AI coach chat and drills",
      "Shoe gait scan",
      "Full analysis history",
    ],
  },
];

export default function Pricing() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".price-col", {
          y: 36,
          autoAlpha: 0,
          stagger: 0.14,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="pricing" className="px-5 pb-24 md:px-10 md:pb-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-baseline justify-between border-t border-line pt-3">
          <span className="meta">Pricing</span>
          <span className="meta hidden sm:inline">App Store, day one</span>
        </div>

        <div className="mt-10 grid gap-14 md:grid-cols-2 md:gap-0">
          {TIERS.map((t, i) => (
            <div
              key={t.name}
              className={`price-col ${
                i === 1 ? "md:border-l md:border-line md:pl-14" : "md:pr-14"
              }`}
            >
              <span className="head-caps block text-[0.95rem] text-mid">
                {t.name}
              </span>
              <p
                className={`display-caps tabular mt-4 text-6xl md:text-7xl ${
                  i === 1 ? "text-accent" : "text-ink"
                }`}
              >
                {t.price}
              </p>
              <p className="mt-2 text-sm text-mid">{t.cycle}</p>
              <p className="mt-6 max-w-xs text-[0.95rem] font-medium leading-relaxed text-ink">
                {t.note}
              </p>
              <ul className="mt-8">
                {t.perks.map((p) => (
                  <li
                    key={p}
                    className="border-t border-line py-3 text-[0.9rem] text-mid"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
