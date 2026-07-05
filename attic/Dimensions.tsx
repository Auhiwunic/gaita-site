"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * What the engine reads — set as an index, not a card wall. Five entries,
 * hairline rules, staggered indents, one real figure each.
 */

const ENTRIES = [
  {
    term: "Running form",
    figure: "A to F",
    body: "Posture, arm swing and trunk alignment graded like a coach would, not scored like a step counter.",
    indent: "md:pl-0",
  },
  {
    term: "Stride mechanics",
    figure: "frame by frame",
    body: "Contact, flight and swing broken down from the moment your foot lands to the next.",
    indent: "md:pl-[10%]",
  },
  {
    term: "Cadence",
    figure: "165 to 190",
    body: "Turnover tracked across the whole clip, judged against the range that protects your knees.",
    indent: "md:pl-[4%]",
  },
  {
    term: "Shoe wear",
    figure: "9 zones",
    body: "Scan your sole and the wear pattern confirms what the video sees in your stride.",
    indent: "md:pl-[14%]",
  },
  {
    term: "Efficiency",
    figure: "0 to 100",
    body: "Energy spent against speed gained, compressed into one score you can train against.",
    indent: "md:pl-[7%]",
  },
];

export default function Dimensions() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".dim-row").forEach((row) => {
          gsap.from(row, {
            y: 26,
            autoAlpha: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 84%" },
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="features" className="px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-[1440px]">
        <div className="md:grid md:grid-cols-12">
          <h2 className="font-serif-display text-5xl font-black leading-[1.0] text-paper sm:text-6xl md:col-span-7 md:col-start-2">
            Five reads on <em className="coach-italic">every</em> run
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-n4 md:col-span-4 md:col-start-8 md:mt-2">
            Video and gait data cross checked against each other, so a
            finding only counts when the evidence agrees. All of it on your
            phone, none of it on a server.
          </p>
        </div>

        <ol className="mt-20">
          {ENTRIES.map((e, i) => (
            <li
              key={e.term}
              className={`dim-row border-t border-white/10 py-10 last:border-b ${e.indent}`}
            >
              <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
                <span className="font-mono text-[0.62rem] tracking-[0.16em] text-n3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif-display text-3xl font-bold text-paper sm:text-4xl">
                  {e.term}
                </h3>
                <span className="font-mono text-sm tracking-[0.08em] text-accent">
                  {e.figure.toUpperCase()}
                </span>
                <p className="max-w-md text-sm leading-relaxed text-n4 md:ml-auto">
                  {e.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
