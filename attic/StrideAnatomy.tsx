"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * One horizontal chapter: the sheet, card by card. Values are the real
 * analysis of the hero footage; color is semantic — cyan when the value
 * sits inside the app's target range, grease red when the coach would
 * mark it. The worst value gets the pencil.
 */

const METRICS = [
  { key: "CAD", value: "150", unit: "spm", target: "165 to 190", ok: false, note: "Turnover sets the ceiling. Slow cadence stretches every stride.", marked: false },
  { key: "TORSO", value: "6°", unit: "lean", target: "5 to 10°", ok: true, note: "A slight forward lean puts gravity to work.", marked: false },
  { key: "SHIN", value: "13°", unit: "at contact", target: "under 8°", ok: false, note: "Shin angle at touchdown decides how hard you brake.", marked: true },
  { key: "KNEE", value: "178°", unit: "extension", target: "150 to 170", ok: false, note: "A locked knee at contact sends impact straight up the chain.", marked: false },
  { key: "HIP", value: "175°", unit: "drive", target: "150 to 175", ok: true, note: "Hip extension is where speed actually comes from.", marked: false },
  { key: "ELBOW", value: "116°", unit: "carry", target: "near 90°", ok: false, note: "Arms set rhythm. Open elbows waste the swing.", marked: false },
  { key: "OVERSTRIDE", value: "13°", unit: "reach", target: "minus 12 to 8°", ok: false, note: "Positive means your foot lands ahead of your body and brakes you.", marked: false },
  { key: "STRIKE", value: "FORE", unit: "pattern", target: "MID", ok: false, note: "Where your foot lands tells the whole braking story.", marked: false },
];

export default function StrideAnatomy() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const track = root.current!.querySelector<HTMLElement>(".stride-track")!;
          const section = root.current!.querySelector<HTMLElement>(".stride-pin")!;
          const tween = gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 1,
              start: "top top",
              end: () => "+=" + (track.scrollWidth - window.innerWidth),
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                gsap.set(".stride-progress", { scaleX: self.progress });
              },
            },
          });
          // Pencil circles the marked card as it crosses center
          gsap.fromTo(
            ".sa-ellipse",
            { strokeDashoffset: 1, strokeDasharray: 1 },
            {
              strokeDashoffset: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".sa-marked",
                containerAnimation: tween,
                start: "left 65%",
              },
            }
          );
          return () => tween.scrollTrigger?.kill();
        }
      );
      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        gsap.set(".sa-ellipse", { strokeDasharray: 1, strokeDashoffset: 0 });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="metrics" className="border-y border-white/5">
      <div className="stride-pin overflow-hidden">
        <div className="mx-auto max-w-[1440px] px-6 pb-2 pt-24 md:grid md:grid-cols-12 md:px-12">
          <div className="md:col-span-8 md:col-start-3">
            <h2 className="font-serif-display text-5xl font-black leading-[1.0] text-paper sm:text-6xl">
              Your shin lands at 13 degrees. A coach would{" "}
              <em className="coach-italic text-grease">mark that</em>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-n4">
              The full sheet from the hero footage. Cyan sits inside the
              target range. Red is coaching material.
            </p>
          </div>
        </div>

        <div className="stride-track flex w-max snap-x snap-mandatory gap-6 overflow-x-auto px-6 py-14 [-ms-overflow-style:none] [scrollbar-width:none] md:overflow-visible md:px-12 [&::-webkit-scrollbar]:hidden">
          {METRICS.map((m, i) => (
            <article
              key={m.key}
              className={`${m.marked ? "sa-marked" : ""} relative w-[78vw] shrink-0 snap-center border border-white/8 bg-ink-2 p-8 sm:w-[360px] md:p-9`}
              style={{ transform: `rotate(${((i * 7) % 5) * 0.5 - 1}deg)` }}
            >
              <div className="flex items-baseline justify-between">
                <p className="font-serif-display text-xl font-bold text-paper">{m.key}</p>
                <p className="font-mono text-[0.62rem] tracking-[0.14em] text-n3">
                  {m.unit.toUpperCase()}
                </p>
              </div>
              <div className="relative mt-9 inline-block">
                <p
                  className={`font-serif-display text-7xl font-black md:text-8xl ${
                    m.ok ? "text-accent" : "text-paper"
                  }`}
                >
                  {m.value}
                </p>
                {m.marked && (
                  <svg
                    viewBox="0 0 200 120"
                    className="pointer-events-none absolute -inset-x-8 -inset-y-4 h-[calc(100%+2rem)] w-[calc(100%+4rem)]"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      className="sa-ellipse"
                      pathLength={1}
                      d="M 18 62 C 10 30, 70 8, 120 16 C 175 25, 195 62, 168 90 C 138 116, 40 112, 22 82 C 10 61, 40 30, 90 24"
                      stroke="#ff2d2d"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                  </svg>
                )}
              </div>
              <p
                className={`mt-5 font-mono text-xs tracking-[0.1em] ${
                  m.ok ? "text-accent" : "text-grease"
                }`}
              >
                TARGET {m.target.toUpperCase()}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-n4">{m.note}</p>
            </article>
          ))}
        </div>

        <div className="mx-6 mb-14 hidden h-px bg-white/10 md:mx-12 md:block">
          <div className="stride-progress h-px origin-left scale-x-0 bg-grease" />
        </div>
      </div>
    </section>
  );
}
