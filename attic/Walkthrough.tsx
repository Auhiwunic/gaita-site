"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * The session, told like a film review: a sticky phone plays real
 * screenshots while the story scrolls past. No step numbers — the
 * screens carry the sequence. The last beat trades the big number
 * for the coach's actual voice.
 */

const BEATS = [
  {
    key: "analyze",
    stat: "60 fps",
    title: "Film one run",
    body: "Side on, any iPhone. No lab, no wearable, no treadmill booking. Upload the clip and the engine takes it from there.",
    src: "/app/analyze.png",
    alt: "Gaita Form Analysis dashboard with a treadmill runner and form scores",
    label: "form analysis — dashboard",
  },
  {
    key: "snapshot",
    stat: "33 points",
    title: "It reads your body",
    body: "MediaPipe BlazePose tracks 33 landmarks through every frame, then draws your skeleton at the exact moment your foot meets the ground.",
    src: "/app/snapshot.png",
    alt: "Skeleton at contact point with joint angle callouts",
    label: "skeleton at contact",
  },
  {
    key: "metrics",
    stat: "8 angles",
    title: "Then it measures everything",
    body: "Cadence, torso, shin, knee, hip, elbow, ground contact and foot strike, each judged against target ranges on one sheet.",
    src: "/app/metrics.png",
    alt: "Full metrics sheet with angles and target ranges",
    label: "full metrics sheet",
  },
  {
    key: "coach",
    stat: null,
    quote: "Cadence 150. Bring it up two clicks and land under your hips.",
    title: "And coaches the fix",
    body: "The findings feed a coach that talks to you on real runs. Pace, cadence and form cues in your ear, from your phone alone.",
    src: "/app/coach.png",
    alt: "Gaita coach chat with training guidance",
    label: "coach — live cues",
  },
];

export default function Walkthrough() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const screens = gsap.utils.toArray<HTMLElement>(".wt-screen");
          gsap.set(screens, { clipPath: "inset(0 0 100% 0)" });
          gsap.set(screens[0], { clipPath: "inset(0 0 0% 0)" });

          const show = (i: number) => {
            screens.forEach((s, j) => {
              gsap.to(s, {
                clipPath: j <= i ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
                duration: 0.5,
                ease: "power3.inOut",
                overwrite: true,
              });
            });
            const label = root.current!.querySelector(".wt-label");
            if (label) label.textContent = BEATS[i].label;
          };

          gsap.utils.toArray<HTMLElement>(".wt-beat").forEach((beat, i) => {
            ScrollTrigger.create({
              trigger: beat,
              start: "top center",
              end: "bottom center",
              onEnter: () => show(i),
              onEnterBack: () => show(i),
            });
          });
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} id="how" className="px-6 py-28 md:px-12 md:py-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="md:grid md:grid-cols-12">
          <h2 className="font-serif-display text-5xl font-black leading-[1.02] text-paper sm:text-6xl md:col-span-9">
            One clip becomes{" "}
            <em className="coach-italic">a coaching plan</em>
          </h2>
        </div>

        <div className="mt-16 grid gap-16 md:grid-cols-12 md:gap-6">
          {/* Beats — columns 1-6 */}
          <div className="md:col-span-6">
            {BEATS.map((b, i) => (
              <div
                key={b.key}
                className="wt-beat flex flex-col justify-center py-14 md:min-h-[76vh] md:max-w-md md:py-0"
                style={{ marginLeft: i % 2 === 1 ? "8%" : 0 }}
              >
                {b.stat ? (
                  <p className="font-serif-display text-6xl font-black text-paper md:text-7xl">
                    {b.stat.split(" ")[0]}
                    <span className="ml-3 font-mono text-sm font-normal tracking-[0.18em] text-n3">
                      {b.stat.split(" ")[1].toUpperCase()}
                    </span>
                  </p>
                ) : (
                  <blockquote className="relative pt-8 font-serif-display text-2xl italic leading-snug text-paper">
                    <span
                      aria-hidden="true"
                      className="absolute -left-2 -top-6 select-none font-serif-display text-8xl not-italic leading-none text-grease/80"
                    >
                      &ldquo;
                    </span>
                    {b.quote}&rdquo;
                    <cite className="mt-3 block font-mono text-[0.62rem] not-italic tracking-[0.14em] text-n3">
                      GAITA COACH · LIVE CUE
                    </cite>
                  </blockquote>
                )}
                <h3 className="mt-6 font-serif-display text-3xl font-bold text-paper">
                  {b.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-n4">{b.body}</p>

                {/* Mobile: taped printout with its beat */}
                <div className="relative mt-10 w-60 md:hidden" style={{ transform: `rotate(${i % 2 ? 1.6 : -2.1}deg)` }}>
                  <span className="tape" />
                  <div className="relative aspect-[1206/2622] overflow-hidden rounded-xl border border-white/12 bg-ink-2 shadow-[6px_8px_0_rgba(0,0,0,0.45)]">
                    <Image src={b.src} alt={b.alt} fill sizes="240px" className="object-cover" />
                  </div>
                  <p className="mt-3 font-mono text-[0.62rem] tracking-[0.14em] text-n3">
                    {b.label.toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Sticky phone — columns 8-12, taped printout treatment */}
          <div className="relative hidden md:col-span-6 md:block">
            <div className="sticky top-[8vh] flex h-[84vh] items-center justify-center">
              <div className="relative rotate-[1.4deg]">
                <span className="tape" />
                <div className="relative aspect-[1206/2622] w-[300px] overflow-hidden rounded-[2rem] border border-white/12 bg-ink-2 shadow-[10px_14px_0_rgba(0,0,0,0.4)] lg:w-[340px]">
                  {BEATS.map((b, i) => (
                    <div key={b.key} className="wt-screen absolute inset-0">
                      <Image
                        src={b.src}
                        alt={b.alt}
                        fill
                        priority={i === 0}
                        sizes="340px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="wt-label mt-4 text-center font-mono text-[0.62rem] tracking-[0.16em] text-n3">
                  form analysis — dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
