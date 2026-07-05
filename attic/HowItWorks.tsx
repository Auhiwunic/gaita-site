"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PhoneFrame from "./PhoneFrame";

/**
 * Pinned three-beat story: film, read, coach. Desktop pins the viewport
 * (sticky) and crossfades real app screenshots as you scroll; mobile falls
 * back to a plain stacked list. All copy comes from the app itself.
 */

const STEPS = [
  {
    n: "01",
    label: "Film",
    title: "Film one stride.",
    body: "Prop your phone and run past it. Side on, 60 fps. That is the whole setup. No lab, no wearable, no treadmill booking.",
    shot: "/app/analyze.png",
    alt: "Gaita Form Analysis dashboard with drive, impact and smooth scores",
  },
  {
    n: "02",
    label: "Read",
    title: "Get read in seconds.",
    body: "On device vision maps your joints frame by frame. Drive, impact and smooth scores roll into one form grade, next to the range each number should be in.",
    shot: "/app/metrics.png",
    alt: "Gaita full metrics screen with angles, targets and waveforms",
  },
  {
    n: "03",
    label: "Coach",
    title: "Train the fix.",
    body: "GAITA turns your weakest cue into drills and talks you through the next run. Film again and watch the grade climb.",
    shot: "/app/coach.png",
    alt: "GAITA coach chat with drills",
  },
];

export default function HowItWorks() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const idx = Math.min(2, Math.floor(self.progress * 3));
          setActive((prev) => (prev === idx ? prev : idx));
        },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="how" className="relative">
      {/* Desktop: tall scroll runway with a sticky stage */}
      <div className="hidden md:block" style={{ height: "300vh" }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="mx-auto grid w-full max-w-[1400px] grid-cols-2 items-center gap-16 px-16">
            <div>
              <p className="mb-10 font-mono text-xs uppercase tracking-[0.3em] text-n3">
                How it works
              </p>
              <div className="space-y-10">
                {STEPS.map((s, i) => (
                  <div
                    key={s.n}
                    className="transition-opacity duration-500"
                    style={{ opacity: active === i ? 1 : 0.25 }}
                  >
                    <div className="flex items-baseline gap-4">
                      <span
                        className={`font-display text-sm font-semibold ${
                          active === i ? "text-accent" : "text-n3"
                        }`}
                      >
                        {s.n}
                      </span>
                      <h3 className="font-display text-4xl font-semibold lg:text-5xl">
                        {s.title}
                      </h3>
                    </div>
                    <p
                      className="mt-3 max-w-md pl-10 leading-relaxed text-n4 transition-all duration-500"
                      style={{
                        maxHeight: active === i ? 120 : 0,
                        overflow: "hidden",
                        opacity: active === i ? 1 : 0,
                      }}
                    >
                      {s.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* phone stage */}
            <div className="relative mx-auto h-[72vh] max-h-[700px] w-auto">
              <div className="relative h-full" style={{ aspectRatio: "1206/2622" }}>
                {STEPS.map((s, i) => (
                  <div
                    key={s.n}
                    className="absolute inset-0 transition-all duration-700"
                    style={{
                      opacity: active === i ? 1 : 0,
                      transform: `translateY(${active === i ? 0 : 24}px)`,
                    }}
                  >
                    <PhoneFrame src={s.shot} alt={s.alt} className="h-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: plain stacked beats */}
      <div className="space-y-20 px-6 py-24 md:hidden">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-n3">
          How it works
        </p>
        {STEPS.map((s) => (
          <div key={s.n}>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-sm font-semibold text-accent">
                {s.n}
              </span>
              <h3 className="font-display text-3xl font-semibold">{s.title}</h3>
            </div>
            <p className="mt-3 leading-relaxed text-n4">{s.body}</p>
            <div className="mx-auto mt-8 w-64">
              <PhoneFrame src={s.shot} alt={s.alt} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
